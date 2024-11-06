import db from '../models';

export default class CartService {
    constructor() {
        this.model = db.cart;
    }

    async getCartByuser_id(user_id) {
        try {
            const cart = await this.model.findOne({
                where: { user_id },
                include: [{
                    model: db.cart_item,
                    include: [{
                        model: db.product
                    }]
                }]
            });
            return cart || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createCart(user_id) {
        try {
            const cart = await this.model.create({
                user_id
            });
            return cart;
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
            console.log("data: ", data);
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