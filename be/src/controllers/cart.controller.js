import db from "../models";
import { CartItemService, CartService } from "../services";

export default class CartController {
    constructor() {
    }

    addProduct = async (req, res) => {
        try {
            const { user } = req;
            const { product, quantity, product_option } = req.body;

            let cart = await new CartService().getOne({
                where: { user_id: user.id },
                include: [{ model: db.cart_item, include: [{ model: db.product, include: [db.product_option] }, { model: db.product_option }] }]
            });
            const cartItem = await new CartItemService().createCartItem(cart.id, product.id, quantity, product_option.id);

            cart.cart_items.push(cartItem);

            cart = await new CartService().getOne({
                where: { user_id: user.id },
                include: [{ model: db.cart_item, include: [{ model: db.product, include: [db.product_option] }, { model: db.product_option }] }]
            });

            return res.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    getByUserId = async (req, res) => {
        try {
            const user = req.user;
            let cart = await new CartService().getByUserId(user.id);

            if (!cart) {
                cart = await new CartService().create({ user_id: user.id });
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

    updateCartItem = async (req, res) => {
        try {
            const { user } = req;
            const { quantity, product_option } = req.body;
            console.log(req.body)

            await new CartItemService().update({
                id: req.params.id,
                quantity: quantity,
                product_option_id: product_option.id
            });

            const cart = await new CartService().getOne({
                where: { user_id: user.id },
                include: [{ model: db.cart_item, include: [{ model: db.product, include: [db.product_option] }, { model: db.product_option }] }]
            });

            return res.status(200).json(cart);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    deleteCartItem = async (req, res) => {
        try {
            const { user } = req;

            await new CartItemService().delete(req.params.id);

            const cart = await new CartService().getOne({
                where: { user_id: user.id },
                include: [{ model: db.cart_item, include: [{ model: db.product, include: [db.product_option] }, { model: db.product_option }] }]
            });

            return res.status(200).json(cart);
        }
        catch (error) {
            console.error(error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    sync = async (req, res) => {
        try {
            const { user } = req;
            const cart = await new CartService().getByUserId(user.id);
            const { cart_items } = req.body;

            for (const item of cart_items) {
                const cartItem = cart.cart_items?.find(user_item => user_item.product.id === item.product.id);
                if (cartItem) {
                    cartItem.quantity += item.quantity;
                    await new CartItemService().updateCartItem(cartItem);
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
            const data = await new CartService().update(req.params.id, req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const { user } = req;
            let cart = await new CartService().getByUserId(user.id);
            if (!cart) {
                return res.status(404).json({ message: "Not found" });
            }
            if (cart.id !== parseInt(req.params.id)) {
                return res.status(401).json({ message: "Forbidden" });
            }
            await new CartService().delete(req.params.id);
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
