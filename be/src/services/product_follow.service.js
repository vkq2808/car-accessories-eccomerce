
import db from "../models";

export default class ProductFollowService {
  constructor() {
    this.model = db.product_follow;
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