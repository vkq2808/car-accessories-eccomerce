import jwt from 'jsonwebtoken';
import db from '../models';
import { CartService, OrderService, UserService } from '../services';
import { account_roles, order_status, payment_method_codes } from '../constants/constants';
import { USER_ROLES, ORDER_STATUS, PAYMENT_METHODS, GENERAL_STATUS } from '../constants/enum';

const role_author_number = {
    [USER_ROLES.NO_ROLE]: 0,
    [USER_ROLES.USER]: 1,
    [USER_ROLES.EMPLOYEE]: 2,
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.SUPER_ADMIN]: 4,
}
const canCreate = (req_role, user_role) => {
    return role_author_number[req_role] > role_author_number[user_role];
}
const canRead = (req_role, user_role) => {
    return role_author_number[req_role] >= role_author_number[user_role];
}
const canUpdate = (req_role, user_role) => {
    return role_author_number[req_role] > role_author_number[user_role];
}
const canDelete = (req_role, user_role) => {
    return role_author_number[req_role] > role_author_number[user_role];
}
export default class UserController {

    async updateInfo(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ message: "Missing user info" });
            }
            if (!req.body.id) {
                return res.status(400).json({ message: "Missing user id" });
            }
            const { id, ...formData } = req.body;
            if (req.user?.id != id) {
                return res.status(403).json({ message: "You don't have permission to edit this user" });
            }

            let update = formData;

            // Handle password update
            if (update.password) {
                if (update.password.length < 8) {
                    return res.status(400).json({ message: "Password must be at least 8 characters" });
                }

                let user = await new UserService().getOne({ where: { id } });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }

                let old_password_match = await new UserService().compareUserPassword(update.old_password, user.hashed_password);
                if (!old_password_match) {
                    return res.status(400).json({ message: "Old password is incorrect" });
                }
                update.hashed_password = await new UserService().hashUserPassword(update.password);
                delete update.password;
                delete update.old_password;
            }

            // Validate enum values
            if (update.gender && !Object.values(USER_GENDERS).includes(update.gender)) {
                return res.status(400).json({ message: "Invalid gender value" });
            }
            if (update.status && !Object.values(GENERAL_STATUS).includes(update.status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            if (update.role && !Object.values(USER_ROLES).includes(update.role)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            await new UserService().update({ id, ...update });

            return res.status(200).json({ message: "Update successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async cancelOrder(req, res) {
        try {
            const order = await new OrderService().getOne({ where: { id: req.params.id } });
            if (!order) {
                return res.status(404).json({ message: "Not found" });
            }
            if (order.status !== ORDER_STATUS.PENDING) {
                return res.status(400).json({ message: "Order is not pending" });
            }
            if (order.payment_method !== PAYMENT_METHODS.COD) {
                return res.status(400).json({ message: "Can't cancel this order" });
            }
            if (order.user_id !== req.user.id) {
                return res.status(403).json({ message: "You don't have permission to cancel this order" });
            }
            const data = await new OrderService().update({ id: req.params.id, status: ORDER_STATUS.CANCELLED });

            let updatedOrder = await new OrderService().getOne({
                where: { id: req.params.id },
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
                            }
                        ]
                    }
                ]
            });

            return res.status(200).json({ message: "Cancel order successfully", order: updatedOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getUserByToken(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            const user = await new UserService().getFullUserInfoById(decoded.id);
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async getOrders(req, res) {
        try {
            const orders = await new OrderService().getAll({
                where: { user_id: req.user.id },
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
                            }
                        ]
                    },
                    {
                        model: db.payment,
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json({ orders });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const data = await new UserService().getAll();
            return res.status(200).json(data);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async query(req, res) {
        try {
            let query = req.query;

            let data = await new UserService().query(query);

            return res.status(200).json({ users: data });
        }
        catch (error) {
            // console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res) {
        try {
            const data = await new UserService().getOne({ where: { id: req.params.id } });
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
            if (!canCreate(req.user?.role || USER_ROLES.NO_ROLE, req.body.role)) {
                return res.status(403).json({ message: "You don't have permission to create this user" });
            }

            let { password, ...formData } = req.body;

            // Validate enum values
            if (formData.gender && !Object.values(USER_GENDERS).includes(formData.gender)) {
                return res.status(400).json({ message: "Invalid gender value" });
            }
            if (formData.status && !Object.values(GENERAL_STATUS).includes(formData.status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            if (formData.role && !Object.values(USER_ROLES).includes(formData.role)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            // Set default values
            formData.status = formData.status || GENERAL_STATUS.ACTIVE;
            formData.role = formData.role || USER_ROLES.USER;
            formData.gender = formData.gender || USER_GENDERS.OTHER;

            formData.hashed_password = await new UserService().hashUserPassword(password);
            const data = await new UserService().create(formData);
            return res.status(201).json({ user: data, message: "Create successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const target_user = await new UserService().getOne({ where: { id: req.params.id } });
            if (!target_user) {
                return res.status(404).json({ message: "Not found" });
            }

            console.log(req.user.id, req.body.id, req.user?.role, target_user.role);
            if (req.user.id != req.body.id && !canUpdate(req.user?.role || USER_ROLES.NO_ROLE, target_user.role)) {
                return res.status(403).json({ message: "You don't have permission to edit this user" });
            }

            let { password, ...formData } = req.body;

            // Validate enum values
            if (formData.gender && !Object.values(USER_GENDERS).includes(formData.gender)) {
                return res.status(400).json({ message: "Invalid gender value" });
            }
            if (formData.status && !Object.values(GENERAL_STATUS).includes(formData.status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            if (formData.role && !Object.values(USER_ROLES).includes(formData.role)) {
                return res.status(400).json({ message: "Invalid role value" });
            }

            if (password) {
                formData.hashed_password = await new UserService().hashUserPassword(password);
            }

            let data = await new UserService().update(formData);

            if (data) {
                data = await new UserService().getOne({
                    where: { id: req.body.id }
                });
            } else {
                return res.status(404).json({ message: "Not found" });
            }
            return res.status(200).json({ user: data, message: "Update successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            const target_user = await new UserService().getOne({ where: { id: req.params.id } });
            if (!target_user) {
                return res.status(404).json({ message: "Not found" });
            }
            if (!canDelete(req.user?.role || USER_ROLES.NO_ROLE, target_user.role) && req.user.id !== req.params.id) {
                return res.status(403).json({ message: "You don't have permission to delete this user" });
            }

            let data = await new UserService().delete({ where: { id: req.params.id } });
            return res.status(200).json({ message: "Delete successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
