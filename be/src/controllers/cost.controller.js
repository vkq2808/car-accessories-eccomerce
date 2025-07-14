
import { CostService, PaymentService } from "../services";
import db from "../models";
import { USER_ROLES, COST_STATUS, PAYMENT_METHODS } from "../constants/enum";

const role_author_number = {
  [USER_ROLES.NO_ROLE]: 0,
  [USER_ROLES.USER]: 1,
  [USER_ROLES.EMPLOYEE]: 1,
  [USER_ROLES.ADMIN]: 2,
  [USER_ROLES.SUPER_ADMIN]: 3,
}
const canCreate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canRead = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.NO_ROLE];
const canUpdate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canDelete = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];

export default class CostController {
  constructor() { }

  async getAll(req, res) {
    try {
      if (!canRead(req.user?.role || USER_ROLES.NO_ROLE)) {
        return res.status(403).json({ message: "You don't have permission to read" });
      }

      const data = await new CostService().getAll({
        include: [{
          model: db.product,
          as: "product",
        }, {
          model: db.user,
          as: "employee",
        },
        ]
      });

      return res.status(200).json({ costs: data });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOne(req, res) {
    try {
      const data = await new CostService().getOne({ where: { id: req.params.id } });
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json({ cost: data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      if (!canCreate(req.user?.role || USER_ROLES.NO_ROLE)) {
        return res.status(403).json({ message: "You don't have permission to create this cost" });
      }

      // Add validation for required fields
      const { title, amount, cost_type, description } = req.body;
      if (!title || !amount || !cost_type) {
        return res.status(400).json({ message: "Missing required fields: title, amount, cost_type" });
      }

      const costData = {
        ...req.body,
        employee_id: req.user.id,
        status: COST_STATUS.PENDING
      };

      const data = await new CostService().create(costData);
      return res.status(201).json({ cost: data, message: "Cost created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const target_cost = await new CostService().getOne({ where: { id: req.params.id } });
      if (!target_cost) {
        return res.status(404).json({ message: "Cost not found" });
      }
      if (!canUpdate(req.user?.role || USER_ROLES.NO_ROLE)) {
        return res.status(403).json({ message: "You don't have permission to edit this cost" });
      }

      const updateData = { ...req.body };
      delete updateData.id; // Prevent ID from being updated

      const data = await new CostService().update(req.params.id, updateData);
      return res.status(200).json({ cost: data, message: "Cost updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      if (!canDelete(req.user?.role || USER_ROLES.NO_ROLE)) {
        return res.status(403).json({ message: "You don't have permission to delete this cost" });
      }

      const target_cost = await new CostService().getOne({ where: { id: req.params.id } });
      if (!target_cost) {
        return res.status(404).json({ message: "Cost not found" });
      }

      await new CostService().delete(req.params.id);
      return res.status(200).json({ message: "Cost deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}