// UserService.js
import bcrypt from 'bcryptjs';
import db from '../models/index';
import CartService from './cart.service';

require('dotenv').config();

const salt = process.env.SALT;

class UserService {
    constructor() {
        this.model = db.user;
    }

    async query(query) {
        try {
            let entries = Object.entries(query);

            let where = {};
            for (let [key, value] of entries) {
                where[key] = { [db.Sequelize.Op.like]: `%${value}%` }
            }

            let data = await this.model.findAll({ where });

            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async hashUserPassword(password) {
        try {
            return bcrypt.hashSync(password, salt);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async createUser(data) {
        try {
            const hashPasswordFromBcrypt = await this.hashUserPassword(data.password);
            await this.model.create({
                email: data.email,
                hashed_password: hashPasswordFromBcrypt,
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                birth: data.birth,
                role: data.role
            });
            return 'Create a new user successful';
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getFullUserInfoById(user_id) {
        try {
            const user = await this.model.findOne({
                where: { id: user_id },
                include: [{
                    model: db.cart,
                    include: [{
                        model: db.cart_item,
                        include: [db.product_option, { model: db.product, include: [db.product_option] }]
                    }]
                }, {
                    model: db.order,
                    include: [{
                        model: db.order_item,
                        include: [{ model: db.product, include: [db.product_option] }, db.product_option]
                    }, {
                        model: db.payment
                    }]
                }, {
                    model: db.product_follow
                }]
            });
            return user || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUser(data) {
        try {
            const user = await this.model.findOne({ where: { id: data.id } });
            if (user) {
                user.first_name = data.first_name;
                user.last_name = data.last_name;
                user.address = data.address;
                await user.save();
                return await this.model.findAll();
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteUser(user_id) {
        try {
            const user = await this.model.findOne({ where: { id: user_id } });
            if (user) {
                await user.destroy();
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserInfoByEmail(userEmail) {
        try {
            const user = await this.model.findOne({ where: { email: userEmail } });
            return user || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateUserPassword(data) {
        try {
            const user = await this.model.findOne({ where: { email: data.email } });
            if (user) {
                user.hashed_password = await this.hashUserPassword(data.password);
                await user.save();
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
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
            const { id, ...filteredData } = data;
            const result = await this.model.update(filteredData, { where: { id: data.id } });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async delete(id) {
        try {
            let result = await this.model.destroy({ where: { id: id } });
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

export default UserService;
