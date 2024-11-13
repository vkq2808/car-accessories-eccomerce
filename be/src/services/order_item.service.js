import db from '../models';

export default class OrderItemService {
    constructor() {
        this.model = db.order_item;
    }
    async getOrderItemByorder_id(order_id) {
        try {
            const orderItem = await this.model.findAll({
                where: { order_id },
                include: [{ model: db.product, include: [db.product_option] }]
            });
            return orderItem || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async createOrderItem(order_id, product_id, quantity) {
        try {
            const orderItem = await this.model.create({
                order_id,
                product_id,
                quantity
            });
            return orderItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async updateOrderItem(orderItemId, quantity) {
        try {
            const orderItem = await this.model.update({
                quantity
            }, {
                where: { id: orderItemId }
            });
            return orderItem;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async deleteOrderItem(orderItemId) {
        try {
            const orderItem = await this.model.destroy({
                where: { id: orderItemId }
            });
            return orderItem;
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