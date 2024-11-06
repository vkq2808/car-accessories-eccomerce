import { OrderService } from "../services";

import OrderItemService from "../services";

export default class OrderController {
  constructor() {
  }

  async getAll(req, res) {
    try {
      const data = await new OrderService().getAll();
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOne(req, res) {
    try {
      const data = await new OrderService().getOne(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const data = await new OrderService().create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const data = await new OrderService().update(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      await new OrderService().delete(req.params.id);
      return res.status(204).json();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}