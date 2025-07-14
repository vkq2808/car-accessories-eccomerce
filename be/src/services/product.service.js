
import db from '../models/index';
import { GENERAL_STATUS, PRODUCT_SORT_OPTIONS } from '../constants/enum';

class ProductService {
    constructor() {
        this.model = db.product;
    }

    async searchAndCountProducts({
        searchTerm,
        category_id,
        category_path,
        page = 1,
        limit = 10,
        sort = 'name',
        order = 'ASC',
        minPrice,
        maxPrice,
        inStock,
        featured,
        status
    }) {
        try {
            const whereCondition = {
                deleted_at: null,
                ...(category_id && parseInt(category_id) !== -1 && { category_id: parseInt(category_id) }),
                ...(searchTerm && {
                    [db.Sequelize.Op.or]: [
                        { name: { [db.Sequelize.Op.iLike]: `%${searchTerm}%` } },
                        { detail: { [db.Sequelize.Op.iLike]: `%${searchTerm}%` } },
                        { short_description: { [db.Sequelize.Op.iLike]: `%${searchTerm}%` } },
                        { sku: { [db.Sequelize.Op.iLike]: `%${searchTerm}%` } }
                    ]
                }),
                ...(category_path && { '$category.path$': category_path }),
                ...(minPrice && { price: { [db.Sequelize.Op.gte]: minPrice } }),
                ...(maxPrice && { price: { [db.Sequelize.Op.lte]: maxPrice } }),
                ...(inStock && { stock: { [db.Sequelize.Op.gt]: 0 } }),
                ...(featured && { is_featured: true }),
                ...(status && { is_active: status === 'active' })
            };

            // Price range filter
            if (minPrice && maxPrice) {
                whereCondition.price = {
                    [db.Sequelize.Op.between]: [minPrice, maxPrice]
                };
            }

            // Simplified sorting - use the sort and order parameters directly
            const orderBy = [[sort, order]];

            const results = await this.model.findAndCountAll({
                where: whereCondition,
                include: [
                    {
                        model: db.category,
                        as: 'category', // Use the alias defined in the association
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        as: 'options', // Use the alias defined in the association
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                order: orderBy,
                limit: parseInt(limit) || 10,
                offset: page ? ((page - 1) * (limit || 10)) : 0,
                distinct: true
            });
            return results || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async create(data, options = {}) {
        try {
            // Set default values
            const productData = {
                ...data,
                status: data.status || GENERAL_STATUS.ACTIVE,
                weight: data.weight || 0,
                dimensions: data.dimensions || {},
                meta_title: data.meta_title || data.name,
                meta_description: data.meta_description || data.description,
                is_featured: data.is_featured || false,
                is_digital: data.is_digital || false,
                requires_shipping: data.requires_shipping !== undefined ? data.requires_shipping : true,
                track_quantity: data.track_quantity !== undefined ? data.track_quantity : true,
                allow_backorder: data.allow_backorder || false,
                low_stock_threshold: data.low_stock_threshold || 5,
                tags: data.tags || [],
                attributes: data.attributes || {},
                variants: data.variants || []
            };

            const result = await this.model.create(productData, options);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async query(query) {
        try {
            let entries = Object.entries(query);
            let where = { deleted_at: null };

            for (let [key, value] of entries) {
                if (key === 'name' || key === 'description' || key === 'sku') {
                    where[key] = { [db.Sequelize.Op.like]: `%${value}%` };
                } else {
                    where[key] = value;
                }
            }

            let data = await this.model.findAll({
                where,
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async update(data, options = {}) {
        try {
            const { id, ...filteredData } = data;
            const result = await this.model.update(filteredData, {
                where: {
                    id: id,
                    deleted_at: null
                },
                ...options
            });
            if (result[0] === 0) {
                return null;
            }
            let product = await this.model.findOne({
                where: {
                    id: id,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return product;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async delete(options = {}) {
        try {
            const result = await this.model.destroy(options);
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
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getAll(options = {}) {
        try {

            const result = await this.model.findAll({
                ...options,
                include: [
                    {
                        model: db.category,
                        as: 'category',
                        required: false
                    },
                    {
                        model: db.product_option,
                        as: 'options',
                        required: false
                    }
                ]
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
                where: whereCondition,
                include: [
                    {
                        model: db.category,
                        as: 'category',
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        as: 'options',
                        where: { deleted_at: null },
                        required: false
                    }
                ]
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
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                distinct: true
            });
            return { rows, count };
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Additional methods for product management
    async getBySlug(slug) {
        try {
            const result = await this.model.findOne({
                where: {
                    slug: slug,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getBySku(sku) {
        try {
            const result = await this.model.findOne({
                where: {
                    sku: sku,
                    deleted_at: null
                }
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getFeaturedProducts(limit = 10) {
        try {
            const result = await this.model.findAll({
                where: {
                    is_featured: true,
                    status: GENERAL_STATUS.ACTIVE,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                limit: parseInt(limit),
                order: [['created_at', 'DESC']]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getRelatedProducts(product_id, category_id, limit = 5) {
        try {
            const result = await this.model.findAll({
                where: {
                    id: { [db.Sequelize.Op.ne]: product_id },
                    category_id: category_id,
                    status: GENERAL_STATUS.ACTIVE,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    },
                    {
                        model: db.product_option,
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                limit: parseInt(limit),
                order: [['created_at', 'DESC']]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateStock(product_id, quantity_change) {
        try {
            const product = await this.model.findOne({
                where: {
                    id: product_id,
                    deleted_at: null
                }
            });

            if (product) {
                const newQuantity = (product.quantity || 0) + quantity_change;
                product.quantity = Math.max(0, newQuantity);
                await product.save();
                return product;
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getLowStockProducts(threshold = null) {
        try {
            const stockThreshold = threshold || 5;
            const result = await this.model.findAll({
                where: {
                    quantity: { [db.Sequelize.Op.lte]: stockThreshold },
                    track_quantity: true,
                    status: GENERAL_STATUS.ACTIVE,
                    deleted_at: null
                },
                include: [
                    {
                        model: db.category,
                        where: { deleted_at: null },
                        required: false
                    }
                ],
                order: [['quantity', 'ASC']]
            });
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default ProductService;
