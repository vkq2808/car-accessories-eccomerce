
import db from '../models/index';

class ProductService {
    constructor() {
        this.model = db.product;
    }

    async getProductDetailByPath(path) {
        try {
            const product = await this.model.findOne({
                where: { path },
                include: [db.category],
            });
            return product || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllProducts() {
        try {
            const products = await this.model.findAll({
                include: [{ model: db.category }],
                order: [['createdAt', 'DESC']]
            });
            return products || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async followProduct(user, product) {
        try {
            const userFollowProduct = await db.product_follow.create({
                user_id: user.id,
                product_id: product.id
            });
            return userFollowProduct;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getFollowingProducts(user) {
        try {
            const followings = await db.product_follow.findAll({
                where: { user_id: user.id },
                include: [{
                    model: this.model,
                    include: [db.category]
                }],
                order: [['createdAt', 'DESC']]
            });
            return followings || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async unfollowProduct(user, product_id) {
        try {
            const userUnfollowProduct = await db.product_follow.destroy({
                where: {
                    user_id: user.id,
                    product_id: product_id
                }
            });
            return userUnfollowProduct;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getProductsBycategory_id(category_id, page, limit) {
        try {
            const result = await this.model.findAndCountAll({
                where: category_id !== -1 ? { category_id: category_id } : null,
                include: [db.category],
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: (page - 1) * limit
            });
            return result || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async searchAndCountProducts({ searchTerm, category_id, category_path, page, limit }) {
        try {
            const results = await this.model.findAndCountAll({
                where: {
                    ...(category_id && parseInt(category_id) !== -1 && { category_id: parseInt(category_id) }),
                    ...(searchTerm && { path: { [db.Sequelize.Op.like]: `%${searchTerm}%` } }),
                    ...(category_path && { '$category.path$': category_path })
                },
                include: [db.category],
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit) || 10,
                offset: page ? ((page - 1) * (limit || 10)) : 0
            });
            return results || null;
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

    async query(query) {
        try {
            let entries = Object.entries(query);

            let where = {};
            for (let [key, value] of entries) {
                where[key] = { [db.Sequelize.Op.like]: `%${value}%` }
            }
            // console.log(where)
            let data = await this.model.findAll({ where });
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data) {
        try {
            const { id, ...filteredData } = data;
            const result = await this.model.update(filteredData, { where: { id: id } });
            if (result[0] === 0) {
                return null;
            }
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

export default ProductService;
