
import db from "../models";
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants/enum';

export default class OrderService {
  constructor() {
    this.model = db.order;
  }

  findOrCreate = async (options) => {
    try {
      const [result, created] = await this.model.findOrCreate(options);
      return [result, created];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(data, options = {}) {
    try {
      const orderData = {
        ...data,
        order_number: data.order_number || this.generateOrderNumber(),
        status: data.status || ORDER_STATUS.PENDING,
        payment_status: data.payment_status || PAYMENT_STATUS.PENDING,
        currency: data.currency || 'VND',
        total_amount: data.total_amount || 0,
        subtotal: data.subtotal || 0,
        tax_amount: data.tax_amount || 0,
        shipping_amount: data.shipping_amount || 0,
        discount_amount: data.discount_amount || 0,
        shipping_address: data.shipping_address || {},
        billing_address: data.billing_address || data.shipping_address || {},
        order_date: data.order_date || new Date(),
        tracking_number: data.tracking_number || null,
        notes: data.notes || null
      };

      const result = await this.model.create(orderData, options);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(data, options = {}) {
    try {
      const { id, ...filteredData } = data;
      const result = await this.model.update(filteredData, {
        where: {
          id: id,
          deleted_at: null
        },
        ...options
      });
      let order = await this.model.findOne({
        where: {
          id: id,
          deleted_at: null
        },
        include: [
          {
            model: db.order_item,
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
          },
          {
            model: db.payment,
            where: { deleted_at: null },
            required: false
          }
        ]
      });
      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(option = {}) {
    try {
      const result = await this.model.destroy(option);
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
            model: db.order_item,
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
          },
          {
            model: db.payment,
            where: { deleted_at: null },
            required: false
          },
          {
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
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
            model: db.user,
            as: 'user',
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ],
        order: options.order || [['created_at', 'DESC']]
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
            model: db.order_item,
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
          },
          {
            model: db.payment,
            where: { deleted_at: null },
            required: false
          },
          {
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
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
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ],
        order: options.order || [['created_at', 'DESC']]
      });
      return { rows, count };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Additional methods for order management
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  async getByOrderNumber(order_number) {
    try {
      const result = await this.model.findOne({
        where: {
          order_number: order_number,
          deleted_at: null
        },
        include: [
          {
            model: db.order_item,
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
          },
          {
            model: db.payment,
            where: { deleted_at: null },
            required: false
          },
          {
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByUserId(user_id, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          user_id: user_id,
          deleted_at: null
        },
        include: [
          {
            model: db.order_item,
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
          },
          {
            model: db.payment,
            where: { deleted_at: null },
            required: false
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateStatus(order_id, status) {
    try {
      const order = await this.model.findOne({
        where: {
          id: order_id,
          deleted_at: null
        }
      });

      if (order) {
        order.status = status;
        if (status === ORDER_STATUS.DELIVERED) {
          order.delivered_at = new Date();
        }
        await order.save();
        return order;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updatePaymentStatus(order_id, payment_status) {
    try {
      const order = await this.model.findOne({
        where: {
          id: order_id,
          deleted_at: null
        }
      });

      if (order) {
        order.payment_status = payment_status;
        if (payment_status === PAYMENT_STATUS.PAID) {
          order.paid_at = new Date();
        }
        await order.save();
        return order;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateTrackingNumber(order_id, tracking_number) {
    try {
      const order = await this.model.findOne({
        where: {
          id: order_id,
          deleted_at: null
        }
      });

      if (order) {
        order.tracking_number = tracking_number;
        await order.save();
        return order;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getOrdersByStatus(status, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          status: status,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ],
        order: [['created_at', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getOrdersByDateRange(start_date, end_date, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          order_date: {
            [db.Sequelize.Op.between]: [start_date, end_date]
          },
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
          }
        ],
        order: [['order_date', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}