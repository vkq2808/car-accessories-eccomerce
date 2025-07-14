// UserService.js
import bcrypt from 'bcryptjs';
import db from '../models/index';
import CartService from './cart.service';
import { USER_ROLES, USER_GENDERS, GENERAL_STATUS } from '../constants/enum';

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
            return this.model.hash_password(password);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async createUser(data) {
        try {
            const hashPasswordFromBcrypt = await this.hashUserPassword(data.password);
            const userData = {
                email: data.email,
                hashed_password: hashPasswordFromBcrypt,
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
                birth_date: data.birth_date || data.birth,
                gender: data.gender || USER_GENDERS.OTHER,
                address: data.address,
                city: data.city,
                country: data.country,
                postal_code: data.postal_code,
                role: data.role || USER_ROLES.USER,
                status: data.status || GENERAL_STATUS.ACTIVE,
                email_verified: data.email_verified || false,
                phone_verified: data.phone_verified || false,
                avatar_url: data.avatar_url,
                preferences: data.preferences || {},
                last_login: null,
                login_attempts: 0,
                locked_until: null
            };

            const user = await this.model.create(userData);
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getFullUserInfoById(user_id) {
        try {
            const user = await this.model.findOne({
                where: {
                    id: user_id,
                    deleted_at: null
                },
                include: [{
                    model: db.cart,
                    as: 'cart',
                    required: false,
                    include: [{
                        model: db.cart_item,
                        as: 'items',
                        required: false,
                        include: [
                            {
                                model: db.product_option,
                                as: 'productOption',
                                required: false
                            },
                            {
                                model: db.product,
                                as: 'product',
                                required: false,
                                include: [{
                                    model: db.product_option,
                                    as: 'options',
                                    required: false
                                }]
                            }
                        ]
                    }]
                }, {
                    model: db.order,
                    as: 'orders',
                    required: false,
                    include: [{
                        model: db.order_item,
                        as: 'items',
                        required: false,
                        include: [
                            {
                                model: db.product,
                                as: 'product',
                                required: false,
                                include: [{
                                    model: db.product_option,
                                    as: 'options',
                                    required: false
                                }]
                            },
                            {
                                model: db.product_option,
                                as: 'productOption',
                                required: false
                            }
                        ]
                    }]
                }, {
                    model: db.product_follow,
                    as: 'followedProducts',
                    required: false,
                    include: [{
                        model: db.product,
                        as: 'product',
                        required: false
                    }]
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
            const user = await this.model.findOne({
                where: {
                    id: data.id,
                    deleted_at: null
                }
            });
            if (user) {
                // Update allowed fields
                if (data.first_name !== undefined) user.first_name = data.first_name;
                if (data.last_name !== undefined) user.last_name = data.last_name;
                if (data.phone !== undefined) user.phone = data.phone;
                if (data.birth_date !== undefined) user.birth_date = data.birth_date;
                if (data.gender !== undefined) user.gender = data.gender;
                if (data.address !== undefined) user.address = data.address;
                if (data.city !== undefined) user.city = data.city;
                if (data.country !== undefined) user.country = data.country;
                if (data.postal_code !== undefined) user.postal_code = data.postal_code;
                if (data.avatar_url !== undefined) user.avatar_url = data.avatar_url;
                if (data.preferences !== undefined) user.preferences = data.preferences;
                if (data.email_verified !== undefined) user.email_verified = data.email_verified;
                if (data.phone_verified !== undefined) user.phone_verified = data.phone_verified;
                if (data.status !== undefined) user.status = data.status;
                if (data.role !== undefined) user.role = data.role;

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

    async deleteUser(user_id) {
        try {
            const user = await this.model.findOne({
                where: {
                    id: user_id,
                    deleted_at: null
                }
            });
            if (user) {
                // Soft delete
                await user.destroy();
                return { message: 'User deleted successfully' };
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserInfoByEmail(userEmail) {
        try {
            if (!userEmail) return null;
            const user = await this.model.findOne({
                where: {
                    email: userEmail,
                    deleted_at: null
                }
            });
            return user || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updateUserPassword(data) {
        try {
            const user = await this.model.findOne({
                where: {
                    email: data.email,
                    deleted_at: null
                }
            });
            if (user) {
                user.hashed_password = await this.hashUserPassword(data.password);
                user.login_attempts = 0; // Reset login attempts on password change
                user.locked_until = null; // Unlock account if locked
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

    async compareUserPassword(password, hashed_password) {
        try {
            if (!password || !hashed_password) {
                return false;
            }
            return await bcrypt.compare(password, hashed_password);
        } catch (error) {
            return false;
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

    async delete(options = {}) {
        try {
            await this.model.destroy(options);
        } catch (error) {
            console.error(error);
            throw error;
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
                where: whereCondition
            });
            return result;
        } catch (error) {
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
                where: whereCondition
            });
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Additional methods for user management
    async updateLastLogin(user_id) {
        try {
            const user = await this.model.findOne({
                where: {
                    id: user_id,
                    deleted_at: null
                }
            });
            if (user) {
                user.last_login = new Date();
                user.login_attempts = 0; // Reset login attempts on successful login
                await user.save();
                return user;
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async incrementLoginAttempts(user_id) {
        try {
            const user = await this.model.findOne({
                where: {
                    id: user_id,
                    deleted_at: null
                }
            });
            if (user) {
                user.login_attempts = (user.login_attempts || 0) + 1;
                // Lock account after 5 failed attempts for 30 minutes
                if (user.login_attempts >= 5) {
                    user.locked_until = new Date(Date.now() + 30 * 60 * 1000);
                }
                await user.save();
                return user;
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async isAccountLocked(user_id) {
        try {
            const user = await this.model.findOne({
                where: {
                    id: user_id,
                    deleted_at: null
                }
            });
            if (user && user.locked_until) {
                return new Date() < user.locked_until;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default UserService;
