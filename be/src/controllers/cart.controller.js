import db from "../models";
import { CartItemService, CartService, ProductService, ProductOptionService } from "../services";
import { CART_STATUS } from "../constants/enum";

export default class CartController {
    constructor() {
    }

    addProduct = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { user } = req;
            const { product_id, quantity, product_option_id } = req.body;

            // Validate input
            if (!product_id || !quantity || quantity <= 0) {
                await transaction.rollback();
                return res.status(400).json({ message: "Invalid product_id or quantity" });
            }

            // Verify product exists
            const product = await new ProductService().getById(product_id);
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ message: "Product not found" });
            }

            // Verify product option if provided
            let productOption = null;
            if (product_option_id) {
                productOption = await new ProductOptionService().getById(product_option_id);
                if (!productOption || productOption.product_id !== product_id) {
                    await transaction.rollback();
                    return res.status(404).json({ message: "Product option not found or doesn't belong to product" });
                }
            }

            // Get or create cart
            let cart = await new CartService().findOrCreateCart(user.id);
            if (!cart) {
                await transaction.rollback();
                return res.status(500).json({ message: "Failed to create or get cart" });
            }

            // Check if item already exists in cart
            const existingCartItem = await new CartItemService().getOne({
                where: {
                    cart_id: cart.id,
                    product_id: product_id,
                    product_option_id: product_option_id || null
                },
                transaction
            });

            const price = productOption ? productOption.price : product.price;

            if (existingCartItem) {
                // Update existing cart item
                const newQuantity = existingCartItem.quantity + quantity;
                await new CartItemService().update({
                    id: existingCartItem.id,
                    quantity: newQuantity,
                    price: price,
                    total_price: price * newQuantity
                });
            } else {
                // Create new cart item
                await new CartItemService().create({
                    cart_id: cart.id,
                    product_id: product_id,
                    product_option_id: product_option_id || null,
                    quantity: quantity,
                    price: price,
                    total_price: price * quantity
                }, { transaction });
            }

            // Recalculate cart totals
            await new CartService().calculateCartTotals(cart.id);

            await transaction.commit();

            // Get updated cart
            cart = await new CartService().getByUserId(user.id);
            return res.status(200).json({ cart, message: "Product added to cart successfully" });

        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    getByUserInToken = async (req, res) => {
        try {
            const user = req.user;
            let cart = await new CartService().getByUserId(user.id);

            if (!cart) {
                cart = await new CartService().create({ user_id: user.id });
            }

            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Admin methods
    async getAll(req, res) {
        try {
            const data = await new CartService().getAll();
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res) {
        try {
            const data = await new CartService().getOne({ where: { id: req.params.id } });
            if (!data) {
                return res.status(404).json({ message: "Not found" });
            }
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req, res) {
        try {
            const data = await new CartService().create(req.body);
            return res.status(201).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const data = await new CartService().update(req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            await new CartService().delete({ where: { id: req.params.id } });
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { id } = req.params;
            const { quantity, product_option_id } = req.body;
            const user = req.user;

            // Validate input
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: "Invalid quantity" });
            }

            // Get cart item and verify ownership
            const cartItem = await new CartItemService().getOne({
                where: { id: id, deleted_at: null },
                include: [{
                    model: db.cart,
                    where: { user_id: user.id, deleted_at: null },
                    required: true
                }]
            });

            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }

            // Get product price (from option if specified, otherwise from product)
            let price = cartItem.price;
            if (product_option_id) {
                const productOption = await new ProductOptionService().getById(product_option_id);
                if (productOption && productOption.product_id === cartItem.product_id) {
                    price = productOption.price;
                }
            }

            // Update cart item
            const updatedCartItem = await new CartItemService().update({
                id: id,
                quantity: quantity,
                price: price,
                product_option_id: product_option_id || cartItem.product_option_id,
                total_price: price * quantity
            });

            if (!updatedCartItem) {
                return res.status(500).json({ message: "Failed to update cart item" });
            }

            // Recalculate cart totals
            await new CartService().calculateCartTotals(cartItem.cart.id);

            // Get updated cart
            const cart = await new CartService().getByUserId(user.id);
            return res.status(200).json({ cart, message: "Cart item updated successfully" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async deleteCartItem(req, res) {
        try {
            const { id } = req.params;
            const user = req.user;

            // Get cart item and verify ownership
            const cartItem = await new CartItemService().getOne({
                where: { id: id, deleted_at: null },
                include: [{
                    model: db.cart,
                    where: { user_id: user.id, deleted_at: null },
                    required: true
                }]
            });

            if (!cartItem) {
                return res.status(404).json({ message: "Cart item not found" });
            }

            // Delete cart item
            await new CartItemService().delete({ where: { id: id } });

            // Recalculate cart totals
            await new CartService().calculateCartTotals(cartItem.cart.id);

            // Get updated cart
            const cart = await new CartService().getByUserId(user.id);
            return res.status(200).json({ cart, message: "Cart item deleted successfully" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async sync(req, res) {
        try {
            const { cart_items } = req.body;
            const user = req.user;

            if (!cart_items || !Array.isArray(cart_items)) {
                return res.status(400).json({ message: "Invalid cart_items data" });
            }

            const transaction = await db.sequelize.transaction();

            try {
                // Get or create cart
                let cart = await new CartService().findOrCreateCart(user.id);
                if (!cart) {
                    await transaction.rollback();
                    return res.status(500).json({ message: "Failed to create or get cart" });
                }

                // Clear existing cart items
                await new CartItemService().delete({
                    where: { cart_id: cart.id },
                    transaction
                });

                // Add new cart items
                for (const item of cart_items) {
                    const { product_id, quantity, product_option_id } = item;

                    // Validate product
                    const product = await new ProductService().getById(product_id);
                    if (!product) continue;

                    // Get price
                    let price = product.price;
                    if (product_option_id) {
                        const productOption = await new ProductOptionService().getById(product_option_id);
                        if (productOption && productOption.product_id === product_id) {
                            price = productOption.price;
                        }
                    }

                    // Create cart item
                    await new CartItemService().create({
                        cart_id: cart.id,
                        product_id: product_id,
                        product_option_id: product_option_id || null,
                        quantity: quantity,
                        price: price,
                        total_price: price * quantity
                    }, { transaction });
                }

                // Recalculate cart totals
                await new CartService().calculateCartTotals(cart.id);

                await transaction.commit();

                // Get updated cart
                cart = await new CartService().getByUserId(user.id);
                return res.status(200).json({ cart, message: "Cart synchronized successfully" });

            } catch (error) {
                await transaction.rollback();
                throw error;
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
