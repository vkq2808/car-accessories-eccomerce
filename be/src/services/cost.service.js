
import db from "../models";
import { COST_TYPES, COST_STATUS } from '../constants/enum';

export default class CostService {
  constructor() {
    this.model = db.cost;
  }

  async create(data, options = {}) {
    try {
      const costData = {
        ...data,
        type: data.type || COST_TYPES.OTHER,
        status: data.status || COST_STATUS.PENDING,
        amount: data.amount || 0,
        currency: data.currency || 'VND',
        date: data.date || new Date(),
        metadata: data.metadata || {}
      };

      const result = await this.model.create(costData, options);
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
      let cost = await this.model.findOne({
        where: {
          id: id,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });
      return cost;
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
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
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

      const result = await this.model.findAll({
        ...options,
        include: [
          {
            model: db.user,
            as: 'approver',
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: options.order || [['date', 'DESC']]
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
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
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
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: options.order || [['date', 'DESC']]
      });
      return { rows, count };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Additional methods for cost management
  async getCostsByType(type, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          type: type,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['date', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCostsByStatus(status, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          status: status,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['date', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCostsByDateRange(start_date, end_date, options = {}) {
    try {
      const result = await this.model.findAll({
        where: {
          date: {
            [db.Sequelize.Op.between]: [start_date, end_date]
          },
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['date', 'DESC']],
        ...options
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateStatus(cost_id, status) {
    try {
      const cost = await this.model.findOne({
        where: {
          id: cost_id,
          deleted_at: null
        }
      });

      if (cost) {
        cost.status = status;

        if (status === COST_STATUS.APPROVED) {
          cost.approved_at = new Date();
        } else if (status === COST_STATUS.REJECTED) {
          cost.rejected_at = new Date();
        }

        await cost.save();
        return cost;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getTotalCostsByPeriod(start_date, end_date, type = null) {
    try {
      const whereCondition = {
        date: {
          [db.Sequelize.Op.between]: [start_date, end_date]
        },
        status: COST_STATUS.APPROVED,
        deleted_at: null
      };

      if (type) {
        whereCondition.type = type;
      }

      const result = await this.model.sum('amount', {
        where: whereCondition
      });

      return result || 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getCostSummaryByType(start_date, end_date) {
    try {
      const result = await this.model.findAll({
        attributes: [
          'type',
          [db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'total_amount'],
          [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
        ],
        where: {
          date: {
            [db.Sequelize.Op.between]: [start_date, end_date]
          },
          status: COST_STATUS.APPROVED,
          deleted_at: null
        },
        group: ['type'],
        order: [[db.Sequelize.fn('SUM', db.Sequelize.col('amount')), 'DESC']]
      });

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
