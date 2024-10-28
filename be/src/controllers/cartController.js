
import { getCartByUserId, createCart } from '../services/cartService.js';
import { createProductCartItem, findCartItemByProductId, updateCartItemQuantity, deleteCartItem } from '../services/cartItemService.js';

export const getCart = async (req, res) => {
    try {
        let cart = await getCartByUserId(req.user.id);
        if (!cart) {
            cart = await createCart(req.user.id);
        }
        console.log("Get cart successfully")
        return res.status(200).json({ msg: 'Get cart successfully', cart: cart });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

export const addProductToCart = async (req, res) => {
    try {
        let cart = await getCartByUserId(req.user.id);
        if (!cart) {
            cart = await createCart(req.user.id);
        }
        const product = req.body.product;
        const quantity = req.body.quantity;

        let cartItem = await findCartItemByProductId(cart.id, product.id);

        if (cartItem) {
            cartItem.quantity += quantity;
            const updatedCartItem = await updateCartItemQuantity(cartItem);
            console.log("Update cart item successfully")
            return res.status(200).send({ msg: 'Update cart item successfully' });
        } else {
            console.log("Add product to cart successfully")
            const newCartItem = await createProductCartItem(cart.id, product.id, quantity);
            return res.status(200).send({ msg: 'Add product to cart successfully' });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: error.message });
    }
}

export const updateCart = async (req, res) => {
    try {
        let cart = await getCartByUserId(req.user.id);
        if (!cart) {
            cart = await createCart(req.user.id);
        }
        const cartItems = req.body.cartItems;
        cart.cart_items.forEach(item => {
            const cartItem = cartItems.find(i => i.id === item.id);
            if (cartItem) {
                item.quantity = cartItem.quantity;
                updateCartItemQuantity(item);
            } else {
                deleteCartItem(item.id);
            }
        });

        return res.status(200).json({ msg: 'Update cart successfully', cart: cart });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}

export const handleSyncCart = async (req, res) => {
    try {
        let cart = await getCartByUserId(req.user.id);

        if (!cart) {
            cart = await createCart(req.user.id);
        }

        const cart_items = req.body.cart_items;
        cart_items.forEach(item => {
            cart.cart_items.forEach(cartItem => {
                if (item.product.id === cartItem.product.id) {
                    cartItem.quantity += item.quantity;
                    updateCartItemQuantity(cartItem);
                } else {
                    createProductCartItem(cart.id, item.product.id, item.quantity);
                }
            });
        });
        console.log("Sync cart successfully")
        return res.status(200).json({ msg: 'Sync cart successfully', cart: cart });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
    }
}
