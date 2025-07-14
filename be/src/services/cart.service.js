import db from '../models';
import { CART_STATUS } from '../constants/enum';

export default class CartService {
    constructor() {
        this.model = db.cart;
    }

    async getByUserId(user_id) {
        try {
            const cart = await this.model.findOne({
                where: {
                    user_id,
                    deleted_at: null
                },
                include: [{
                    model: db.cart_item,
                    where: { deleted_at: null },
                    required: false,
                    include: [
                        {
                            model: db.product_option,
                            where: { deleted_at: null },
                            required: false
                        },
                        {
                            model: db.product,
                            where: { deleted_at: null },
                            required: false,
                            include: [{
                                model: db.product_option,
                                where: { deleted_at: null },
                                required: false
                            }]
                        }
                    ]
                }]
            });
            return cart || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(data, options = {}) {
        try {
            const cartData = {
                ...data,
                status: data.status || CART_STATUS.ACTIVE,
                session_id: data.session_id || null,
                total_amount: data.total_amount || 0,
                discount_amount: data.discount_amount || 0,
                tax_amount: data.tax_amount || 0,
                shipping_amount: data.shipping_amount || 0,
                coupon_code: data.coupon_code || null,
                notes: data.notes || null,
                expires_at: data.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
            };

            const result = await this.model.create(cartData, options);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data) {
        try {
            const { id, ...filteredData } = data;
            const result = await this.model.update(filteredData, {
                where: {
                    id: id,
                    deleted_at: null
                }
            });
            if (result[0] === 0) {
                return null;
            }
            let cart = await this.model.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: [{
                    model: db.cart_item,
                    where: { deleted_at: null },
                    required: false,
                    include: [
                        {
                            model: db.product_option,
                            where: { deleted_at: null },
                            required: false
                        },
                        {
                            model: db.product,
                            where: { deleted_at: null },
                            required: false
                        }
                    ]
                }]
            });
            return cart;
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
                include: [{
                    model: db.cart_item,
                    where: { deleted_at: null },
                    required: false,
                    include: [
                        {
                            model: db.product_option,
                            where: { deleted_at: null },
                            required: false
                        },
                        {
                            model: db.product,
                            where: { deleted_at: null },
                            required: false
                        }
                    ]
                }]
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
                where: whereCondition
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
                where: whereCondition
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
                where: whereCondition
            });
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Additional methods for cart management
    async findOrCreateCart(user_id, session_id = null) {
        try {
            const [cart, created] = await this.model.findOrCreate({
                where: {
                    user_id: user_id,
                    deleted_at: null
                },
                defaults: {
                    user_id: user_id,
                    session_id: session_id,
                    status: CART_STATUS.ACTIVE,
                    total_amount: 0,
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                }
            });
            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async calculateCartTotals(cart_id) {
        try {
            const cart = await this.model.findOne({
                where: {
                    id: cart_id,
                    deleted_at: null
                },
                include: [{
                    model: db.cart_item,
                    where: { deleted_at: null },
                    required: false,
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
                }]
            });

            if (!cart) return null;

            let subtotal = 0;
            if (cart.cart_items && cart.cart_items.length > 0) {
                cart.cart_items.forEach(item => {
                    const price = item.product_option ? item.product_option.price : item.product.price;
                    subtotal += price * item.quantity;
                });
            }

            // Update cart totals
            cart.total_amount = subtotal + (cart.tax_amount || 0) + (cart.shipping_amount || 0) - (cart.discount_amount || 0);
            await cart.save();

            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async clearCart(cart_id) {
        try {
            // Soft delete all cart items
            await db.cart_item.destroy({
                where: { cart_id: cart_id }
            });

            // Reset cart totals
            const cart = await this.model.findOne({
                where: {
                    id: cart_id,
                    deleted_at: null
                }
            });

            if (cart) {
                cart.total_amount = 0;
                cart.discount_amount = 0;
                cart.tax_amount = 0;
                cart.shipping_amount = 0;
                cart.coupon_code = null;
                await cart.save();
            }

            return cart;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getExpiredCarts() {
        try {
            const result = await this.model.findAll({
                where: {
                    expires_at: { [db.Sequelize.Op.lt]: new Date() },
                    status: CART_STATUS.ACTIVE,
                    deleted_at: null
                }
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async applyCoupon(cart_id, coupon_code, discount_amount) {
        try {
            const cart = await this.model.findOne({
                where: {
                    id: cart_id,
                    deleted_at: null
                }
            });

            if (cart) {
                cart.coupon_code = coupon_code;
                cart.discount_amount = discount_amount;
                await cart.save();
                return await this.calculateCartTotals(cart_id);
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}