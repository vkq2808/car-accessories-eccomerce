import db from '../models';

export default class CartItemService {
    constructor() {
        this.model = db.cart_item;
    }

    async getCartItemByCartId(cart_id) {
        try {
            const cartItem = await this.model.findAll({
                where: { cart_id },
                include: [{ model: db.product, include: [db.product_option] }]
            });
            return cartItem || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createCartItem(cart_id, product_id, quantity, product_option_id) {
        try {
            const cartItem = await this.model.create({
                cart_id,
                product_id,
                quantity,
                product_option_id
            });
            return cartItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateCartItem(cartItem) {
        try {
            const cartItem = await this.model.update({
                quantity: cartItem.quantity,
            }, {
                where: { id: cartItem.id }
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
            const { id, ...filteredData } = data;
            const result = await this.model.update(filteredData, { where: { id: id } });
            if (result[0] === 0) {
                return null;
            }
            let product = await this.model.findOne({ where: { id: id } });
            return product;
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