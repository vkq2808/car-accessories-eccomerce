
import db from "../models";
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../constants/enum';

export default class PaymentService {
  constructor() {
    this.model = db.payment;
  }



  async create(data, options = {}) {
    try {
      const paymentData = {
        ...data,
        payment_method: data.payment_method || PAYMENT_METHODS.COD,
        status: data.status || PAYMENT_STATUS.PENDING,
        currency: data.currency || 'VND',
        amount: data.amount || 0,
        transaction_id: data.transaction_id || this.generateTransactionId(),
        payment_date: data.payment_date || new Date(),
        gateway_response: data.gateway_response || {},
        metadata: data.metadata || {}
      };

      const result = await this.model.create(paymentData, options);
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
      let payment = await this.model.findOne({
        where: {
          id: id,
          deleted_at: null
        },
        include: [
          {
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
          }
        ]
      });
      return payment;
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
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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

  // Additional methods for payment management
  generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN-${timestamp}-${random}`;
  }

  async getByTransactionId(transaction_id) {
    try {
      const result = await this.model.findOne({
        where: {
          transaction_id: transaction_id,
          deleted_at: null
        },
        include: [
          {
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
          }
        ]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByOrderId(order_id) {
    try {
      const result = await this.model.findAll({
        where: {
          order_id: order_id,
          deleted_at: null
        },
        order: [['created_at', 'DESC']]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateStatus(payment_id, status, gateway_response = {}) {
    try {
      const payment = await this.model.findOne({
        where: {
          id: payment_id,
          deleted_at: null
        }
      });

      if (payment) {
        payment.status = status;
        payment.gateway_response = { ...payment.gateway_response, ...gateway_response };

        if (status === PAYMENT_STATUS.PAID) {
          payment.paid_at = new Date();
        } else if (status === PAYMENT_STATUS.FAILED) {
          payment.failed_at = new Date();
        } else if (status === PAYMENT_STATUS.REFUNDED) {
          payment.refunded_at = new Date();
        }

        await payment.save();
        return payment;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async processRefund(payment_id, refund_amount = null, reason = null) {
    try {
      const payment = await this.model.findOne({
        where: {
          id: payment_id,
          deleted_at: null
        }
      });

      if (payment) {
        payment.status = PAYMENT_STATUS.REFUNDED;
        payment.refunded_at = new Date();
        payment.refund_amount = refund_amount || payment.amount;
        payment.refund_reason = reason;

        await payment.save();
        return payment;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getPaymentsByStatus(status, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          status: status,
          deleted_at: null
        },
        include: [
          {
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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

  async getPaymentsByMethod(payment_method, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          payment_method: payment_method,
          deleted_at: null
        },
        include: [
          {
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
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

  async getPaymentsByDateRange(start_date, end_date, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          payment_date: {
            [db.Sequelize.Op.between]: [start_date, end_date]
          },
          deleted_at: null
        },
        include: [
          {
            model: db.order,
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'order_number', 'status', 'total_amount']
          }
        ],
        order: [['payment_date', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}