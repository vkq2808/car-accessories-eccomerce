import db from '../models';

export default class OrderItemService {
    constructor() {
        this.model = db.order_item;
    }

    async create(data, options = {}) {
        try {
            const orderItemData = {
                ...data,
                total_price: (data.price || 0) * (data.quantity || 1)
            };

            const result = await this.model.create(orderItemData, options);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data) {
        try {
            const { id, ...filteredData } = data;

            // Recalculate total_price if quantity or price changed
            if (filteredData.quantity !== undefined || filteredData.price !== undefined) {
                const currentItem = await this.model.findOne({
                    where: {
                        id: id,
                        deleted_at: null
                    }
                });

                if (currentItem) {
                    const newQuantity = filteredData.quantity !== undefined ? filteredData.quantity : currentItem.quantity;
                    const newPrice = filteredData.price !== undefined ? filteredData.price : currentItem.price;
                    filteredData.total_price = newQuantity * newPrice;
                }
            }

            const result = await this.model.update(filteredData, {
                where: {
                    id: id,
                    deleted_at: null
                }
            });

            if (result[0] === 0) {
                return null;
            }

            let orderItem = await this.model.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return orderItem;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            const result = await this.model.destroy({
                where: {
                    id: id,
                    deleted_at: null
                }
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getById(id) {
        try {
            const result = await this.model.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAll(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            const result = await this.model.findAll({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getOne(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            const result = await this.model.findOne({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async searchAndCountAll(options = {}) {
        try {
            // Add soft delete filter by default
            const whereCondition = options.where ?
                { ...options.where, deleted_at: null } :
                { deleted_at: null };

            const { rows, count } = await this.model.findAndCountAll({
                ...options,
                where: whereCondition,
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Additional methods for order item management
    async getByOrderId(order_id) {
        try {
            const result = await this.model.findAll({
                where: {
                    order_id: order_id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.product,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}