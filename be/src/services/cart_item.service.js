import db from '../models';

export default class CartItemService {
    constructor() {
        this.model = db.cart_item;
    }

    async getCartItemBycart_id(cart_id) {
        try {
            const cartItem = await this.model.findAll({
                where: { cart_id },
                include: [db.product]
            });
            return cartItem || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createCartItem(cart_id, product_id, quantity) {
        try {
            const cartItem = await this.model.create({
                cart_id,
                product_id,
                quantity
            });
            return cartItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateCartItem(cartItemId, quantity) {
        try {
            const cartItem = await this.model.update({
                quantity
            }, {
                where: { id: cartItemId }
            });
            return cartItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteCartItem(cartItemId) {
        try {
            const cartItem = await this.model.destroy({
                where: { id: cartItemId }
            });
            return cartItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(data) {
        try {
            const result = await this.model.create(data);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data) {
        try {
            const result = await this.model.update(data, { where: { id: data.id } });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            const result = await this.model.destroy({ where: { id: id } });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            const result = await this.model.findOne({ where: { id: id } });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAll(options = {}) {
        try {
            const result = await this.model.findAll(options);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOne(options = {}) {
        try {
            const result = await this.model.findOne(options);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async searchAndCountAll(options = {}) {
        try {
            const { rows, count } = await this.model.findAndCountAll(options);
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}