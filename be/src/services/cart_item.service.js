import db from '../models';

export default class CartItemService {
    constructor() {
        this.model = db.cart_item;
    }

    async create(data, options = {}) {
        try {
            // Validate required fields
            if (!data.cart_id || !data.product_id) {
                throw new Error('cart_id and product_id are required');
            }

            const cartItemData = {
                ...data,
                quantity: data.quantity || 1,
                price: data.price || 0,
                total_price: (data.price || 0) * (data.quantity || 1)
            };

            const result = await this.model.create(cartItemData, options);
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

            let cartItem = await this.model.findOne({
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
            return cartItem;
        } catch (error) {
            console.error(error);
            return null;
        }
    }


    async delete(options = {}) {
        try {
            const result = await this.model.destroy(options);
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

    // Additional methods for cart item management
    async getByCartId(cart_id) {
        try {
            const result = await this.model.findAll({
                where: {
                    cart_id: cart_id,
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

    async findOrCreateCartItem(cart_id, product_id, product_option_id = null) {
        try {
            const whereCondition = {
                cart_id: cart_id,
                product_id: product_id,
                deleted_at: null
            };

            if (product_option_id) {
                whereCondition.product_option_id = product_option_id;
            }

            const [cartItem, created] = await this.model.findOrCreate({
                where: whereCondition,
                defaults: {
                    cart_id: cart_id,
                    product_id: product_id,
                    product_option_id: product_option_id,
                    quantity: 1,
                    price: 0,
                    total_price: 0
                }
            });

            return cartItem;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateQuantity(cart_item_id, quantity) {
        try {
            const cartItem = await this.model.findOne({
                where: {
                    id: cart_item_id,
                    deleted_at: null
                }
            });

            if (cartItem) {
                cartItem.quantity = quantity;
                cartItem.total_price = cartItem.price * quantity;
                await cartItem.save();
                return cartItem;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async removeFromCart(cart_id, product_id, product_option_id = null) {
        try {
            const whereCondition = {
                cart_id: cart_id,
                product_id: product_id,
                deleted_at: null
            };

            if (product_option_id) {
                whereCondition.product_option_id = product_option_id;
            }

            const result = await this.model.destroy({
                where: whereCondition
            });

            return result > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async clearCartItems(cart_id) {
        try {
            const result = await this.model.destroy({
                where: {
                    cart_id: cart_id
                }
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}