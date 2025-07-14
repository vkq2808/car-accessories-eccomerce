
import db from "../models";
import { GENERAL_STATUS } from '../constants/enum';

export default class CategoryService {
  constructor() {
    this.model = db.category;
  }

  async create(data, options = {}) {
    try {
      // Set default values
      const categoryData = {
        ...data,
        status: data.status || GENERAL_STATUS.ACTIVE,
        meta_title: data.meta_title || data.name,
        meta_description: data.meta_description || data.description,
        sort_order: data.sort_order || 0
      };

      const result = await this.model.create(categoryData, options);
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
      let category = await this.model.findOne({
        where: {
          id: id,
          deleted_at: null
        }
      });
      return category;
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
        }
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
        order: options.order || [['sort_order', 'ASC'], ['name', 'ASC']]
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
        where: whereCondition,
        order: options.order || [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return { rows, count };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Additional methods for category management
  async getBySlug(slug) {
    try {
      const result = await this.model.findOne({
        where: {
          slug: slug,
          deleted_at: null
        }
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getParentCategories() {
    try {
      const result = await this.model.findAll({
        where: {
          parent_id: null,
          deleted_at: null
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getChildCategories(parent_id) {
    try {
      const result = await this.model.findAll({
        where: {
          parent_id: parent_id,
          deleted_at: null
        },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getCategoryTree() {
    try {
      const categories = await this.model.findAll({
        where: { deleted_at: null },
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });

      // Build tree structure
      const categoryMap = {};
      const tree = [];

      categories.forEach(category => {
        categoryMap[category.id] = { ...category.toJSON(), children: [] };
      });

      categories.forEach(category => {
        if (category.parent_id) {
          if (categoryMap[category.parent_id]) {
            categoryMap[category.parent_id].children.push(categoryMap[category.id]);
          }
        } else {
          tree.push(categoryMap[category.id]);
        }
      });

      return tree;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
} 