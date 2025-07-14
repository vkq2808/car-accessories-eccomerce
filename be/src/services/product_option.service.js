
import db from '../models/index';

class ProductOptionService {
  constructor() {
    this.model = db.product_option;
  }

  async create(data, options = {}) {
    try {
      const result = await this.model.create(data, options);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async query(query) {
    try {
      let entries = Object.entries(query);
      let where = { deleted_at: null };

      for (let [key, value] of entries) {
        if (key === 'name' || key === 'value') {
          where[key] = { [db.Sequelize.Op.like]: `%${value}%` };
        } else {
          where[key] = value;
        }
      }

      let data = await this.model.findAll({
        where,
        include: [
          {
            model: db.product,
            where: { deleted_at: null },
            required: false
          }
        ]
      });
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(data, options = {}) {
    try {
      const { id, ...filteredData } = data;
      let result = await this.model.update(filteredData, {
        where: {
          id: id,
          deleted_at: null
        },
        ...options
      });
      if (result[0] === 0) {
        return null;
      }
      return await this.getById(id);
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
          }
        ]
      });
      return { rows, count };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Additional methods for product option management
  async getByProductId(product_id) {
    try {
      const result = await this.model.findAll({
        where: {
          product_id: product_id,
          deleted_at: null
        },
        order: [['name', 'ASC']]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getByName(name) {
    try {
      const result = await this.model.findAll({
        where: {
          name: name,
          deleted_at: null
        },
        include: [
          {
            model: db.product,
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

  async updateStock(option_id, quantity_change) {
    try {
      const option = await this.model.findOne({
        where: {
          id: option_id,
          deleted_at: null
        }
      });

      if (option) {
        const newQuantity = (option.quantity || 0) + quantity_change;
        option.quantity = Math.max(0, newQuantity);
        await option.save();
        return option;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getLowStockOptions(threshold = 5) {
    try {
      const result = await this.model.findAll({
        where: {
          quantity: { [db.Sequelize.Op.lte]: threshold },
          deleted_at: null
        },
        include: [
          {
            model: db.product,
            where: { deleted_at: null },
            required: false
          }
        ],
        order: [['quantity', 'ASC']]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default ProductOptionService;
