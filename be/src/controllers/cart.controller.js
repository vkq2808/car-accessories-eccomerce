import db from "../models";
import { CartItemService, CartService } from "../services";

export default class CartController {
    constructor() {
    }

    addProduct = async (req, res) => {
        try {
            const { user } = req;
            const { product, quantity } = req.body;

            const cart = await this.getOne({
                where: { user_id: user.id },
                include: [{ model: db.cart_item, include: [db.product] }]
            });
            const cartItem = await new CartItemService().createCartItem(cart.id, product.id, quantity);

            cart.cart_items.push(cartItem);

            await new CartService().update(cart);
            console.log('test')
            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    getByuser_id = async (req, res) => {
        try {
            const { user } = req;
            let cart = await new CartService().getCartByuser_id(user.id);

            if (!cart) {
                cart = await new CartService().createCart(user.id);
            }

            if (!cart.cart_items) {
                cart.cart_items = [];
            }

            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    sync = async (req, res) => {
        try {
            const { user } = req;
            const cart = await this.getCartByuser_id(user.id);
            const { cart_items } = req.body;

            for (const item of cart_items) {
                const cartItem = cart.cart_items.find(user_item => user_item.product.id === item.product.id);

                if (cartItem) {
                    cartItem.quantity += item.quantity;
                    await new CartItemService().updateCartItemQuantity(cartItem);
                } else {
                    await new CartItemService().createCartItem(cart.id, item.product.id, item.quantity);
                }
            }

            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    getCartByuser_id = async (user_id) => {
        return new CartService().getCartByuser_id(user_id);
    }

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
            const data = await new CartService().getOne(req.params.id);
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
            const data = await new CartService().update(req.params.id, req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            await new CartService().delete(req.params.id);
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
