
import db from "../models";

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

  createOrder = async (userId, cart, name, email, phone, note) => {
    try {
      const order = await this.create({ userId, name, email, phone, note });
      if (!order) {
        return null;
      }

      const orderDetails = cart.map(item => ({
        orderId: order.id,
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const orderDetail = await db.orderDetail.bulkCreate(orderDetails);
      if (!orderDetail) {
        return null;
      }

      return order;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async create(data, options = {}) {
    try {
      console.log(data)
      const result = await this.model.create(data, options);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(data, options = {}) {
    try {
      const { id, ...filteredData } = data;
      const result = await this.model.update(filteredData, { where: { id: id }, ...options });
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