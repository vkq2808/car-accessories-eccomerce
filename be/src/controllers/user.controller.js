import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CartService, UserService } from '../services';
import { account_roles } from '../constants/constants';

const role_author_number = {
    [account_roles.NO_ROLE]: 0,
    [account_roles.USER]: 1,
    [account_roles.EMPLOYEE]: 1,
    [account_roles.ADMIN]: 2,
    [account_roles.SUPER_ADMIN]: 3,
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



    updateInfo(req, res) {
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

            if (update.password) {
                update.hashed_password = new UserService().hashUserPassword(update.password);
                delete update.password;
            }

            new UserService().update({ id, ...update });

            return res.status(200).json({ message: "Update successfully" });
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
            if (!canCreate(req.user?.role || account_roles.NO_ROLE, req.body.role)) {
                return res.status(403).json({ message: "You don't have permission to create this user" });
            }

            let { password, ...formData } = req.body;
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
            if (req.user.id != req.body.id && !canUpdate(req.user?.role || account_roles.NO_ROLE, target_user.role)) {
                return res.status(403).json({ message: "You don't have permission to edit this user" });
            }

            let { password, ...formData } = req.body;
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
            if (!canDelete(req.user?.role || account_roles.NO_ROLE, target_user.role) && req.user.id !== req.params.id) {
                return res.status(403).json({ message: "You don't have permission to delete this user" });
            }

            let data = await new UserService().delete(req.params.id);
            if (data) {
                return res.status(200).json({ message: "Delete successfully" });
            } else {
                return res.status(404).json({ message: "Not found" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
