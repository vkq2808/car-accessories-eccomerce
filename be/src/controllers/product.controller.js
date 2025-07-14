import { account_roles } from "../constants/constants";
import { USER_ROLES, GENERAL_STATUS, PRODUCT_SORT_OPTIONS } from "../constants/enum";
import db from "../models";
import { ProductFollowService, ProductOptionService, ProductService } from "../services";

const role_author_number = {
    [USER_ROLES.NO_ROLE]: 0,
    [USER_ROLES.USER]: 1,
    [USER_ROLES.EMPLOYEE]: 2,
    [USER_ROLES.ADMIN]: 3,
    [USER_ROLES.SUPER_ADMIN]: 4,
}
const canCreate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canRead = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.NO_ROLE];
const canUpdate = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
const canDelete = (req_role) => role_author_number[req_role] >= role_author_number[USER_ROLES.ADMIN];
export default class ProductController {

    createOption = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { product_id, name, stock, price, sku, attributes } = req.body;

            // Validate required fields
            if (!product_id || !name || !price) {
                return res.status(400).json({ message: "product_id, name, and price are required" });
            }

            const productOption = await new ProductOptionService().create({
                product_id,
                name,
                sku,
                stock: stock || 0,
                price,
                attributes: attributes || {},
                status: GENERAL_STATUS.ACTIVE
            }, { transaction });

            // Update parent product stock if tracking quantity
            let product = await new ProductService().getOne({
                where: { id: product_id }
            }, { transaction });

            if (product && product.track_quantity) {
                product.quantity = (product.quantity || 0) + (stock || 0);
                await product.save({ transaction });
            }

            await transaction.commit();
            return res.status(201).json({ product_option: productOption });
        } catch (error) {
            console.error(error);
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    updateOption = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id, product_id, name, stock, price, sku, attributes, status } = req.body;

            let oldProductOption = await new ProductOptionService().getOne({
                where: { id }
            }, { transaction });

            if (!oldProductOption) {
                await transaction.rollback();
                return res.status(404).json({ message: "Product option not found" });
            }

            const stockDiff = (stock || 0) - (oldProductOption.stock || 0);

            let productOption = await new ProductOptionService().update({
                id,
                product_id,
                name,
                stock,
                price,
                sku,
                attributes,
                status
            }, { transaction });

            // Update parent product stock if tracking quantity
            let product = await new ProductService().getOne({
                where: { id: product_id }
            }, { transaction });

            if (product && product.track_quantity && stockDiff !== 0) {
                product.quantity = (product.quantity || 0) + stockDiff;
                await product.save({ transaction });
            }

            await transaction.commit();
            productOption = await new ProductOptionService().getOne({
                where: { id }
            });
            return res.status(200).json({ product_option: productOption });
        } catch (error) {
            console.error(error);
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    deleteOption = async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { id } = req.params;

            let productOption = await new ProductOptionService().getOne({
                where: { id: parseInt(id) }
            }, { transaction });

            if (!productOption) {
                return res.status(404).json({ message: "Product option not found" });
            }

            let product = await new ProductService().getOne({
                where: { id: productOption.product_id }
            }, { transaction });

            product.stock -= productOption.stock;
            await product.save({ transaction });

            await new ProductOptionService().delete(
                {
                    where: { id: req.params.id },
                    transaction
                }
            );

            transaction.commit();
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    getByPath = async (req, res) => {
        try {
            const { path } = req.params;

            const product = await new ProductService().getOne({
                where: { path },
                include: [db.product_option]
            });

            return res.status(200).json({ product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    search = async (req, res) => {
        try {
            const {
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
                featured
            } = req.query;

            // Input validation
            const pageNum = Math.max(1, parseInt(page) || 1);
            const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max 100 items per page
            const sortOrder = ['ASC', 'DESC'].includes(order?.toUpperCase()) ? order.toUpperCase() : 'ASC';
            const sortField = ['name', 'price', 'created_at', 'stock', 'discount_percentage'].includes(sort) ? sort : 'name';

            // Price range validation
            const minPriceNum = minPrice ? Math.max(0, parseFloat(minPrice)) : undefined;
            const maxPriceNum = maxPrice ? Math.max(0, parseFloat(maxPrice)) : undefined;

            if (minPriceNum && maxPriceNum && minPriceNum > maxPriceNum) {
                return res.status(400).json({
                    message: "Minimum price cannot be greater than maximum price"
                });
            }

            // Search parameters
            const searchParams = {
                searchTerm: searchTerm?.trim(),
                category_id: category_id ? parseInt(category_id) : undefined,
                category_path: category_path?.trim(),
                page: pageNum,
                limit: limitNum,
                sort: sortField,
                order: sortOrder,
                minPrice: minPriceNum,
                maxPrice: maxPriceNum,
                inStock: inStock === 'true',
                featured: featured === 'true'
            };

            // Remove undefined values
            Object.keys(searchParams).forEach(key => {
                if (searchParams[key] === undefined) {
                    delete searchParams[key];
                }
            });

            const { rows, count } = await new ProductService().searchAndCountProducts(searchParams);

            // Calculate pagination info
            const totalPages = Math.ceil(count / limitNum);
            const hasNextPage = pageNum < totalPages;
            const hasPreviousPage = pageNum > 1;

            return res.status(200).json({
                result: {
                    products: rows,
                    total: count,
                    pagination: {
                        currentPage: pageNum,
                        totalPages,
                        hasNextPage,
                        hasPreviousPage,
                        limit: limitNum
                    },
                    filters: {
                        searchTerm: searchParams.searchTerm,
                        category_id: searchParams.category_id,
                        category_path: searchParams.category_path,
                        priceRange: {
                            min: minPriceNum,
                            max: maxPriceNum
                        },
                        inStock: searchParams.inStock,
                        featured: searchParams.featured
                    },
                    sorting: {
                        field: sortField,
                        order: sortOrder
                    }
                }
            });
        } catch (error) {
            // console.error('Product search error:', error);

            // Handle specific error types
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: 'Invalid search parameters',
                    errors: error.errors?.map(e => e.message) || []
                });
            }

            if (error.name === 'SequelizeDatabaseError') {
                return res.status(500).json({
                    message: 'Database error occurred while searching products'
                });
            }

            return res.status(500).json({
                message: 'An error occurred while searching products',
                ...(process.env.NODE_ENV === 'development' && { error: error.message })
            });
        }
    }

    getFollow = async (req, res) => {
        try {
            const user = req.user;

            const products = await new ProductFollowService().getUserFollowedProducts(user.id);
            return res.status(200).json({ products: products });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    follow = async (req, res) => {
        try {
            const { product } = req.body;
            const user = req.user;

            const productFollow = await new ProductFollowService().create({
                user_id: user.id,
                product_id: product.id
            });

            return res.status(200).json({ message: "Followed successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    unfollow = async (req, res) => {
        try {
            const { product } = req.body;
            const user = req.user;

            await new ProductFollowService().delete({
                where: {
                    user_id: user.id,
                    product_id: product.id
                }
            });

            return res.status(200).json({ message: "Unfollowed successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }

    syncFollow = async (req, res) => {
        try {
            const { following_items } = req.body;
            const user = req.user;

            for (let product_follow of following_items) {
                const productFollow = await new ProductFollowService().getOne({
                    where: {
                        user_id: user.id,
                        product_id: product_follow.product.id
                    }
                });

                if (!productFollow) {
                    await new ProductFollowService().create({
                        user_id: user.id,
                        product_id: product_follow.product.id
                    });
                }
            }

            return res.status(200).json({ message: "Sync follow completed" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    }


    async getAll(req, res) {
        try {
            if (!canRead(req.user?.role || account_roles.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to read" });
            }
            const data = await new ProductService().getAll();
            return res.status(200).json(data);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async getOne(req, res) {
        try {
            const data = await new ProductService().getOne({
                where: { id: req.params.id },
                include: [db.product_option]
            });
            if (!data) {
                return res.status(404).json({ message: "Not found" });
            }
            return res.status(200).json({ product: data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async create(req, res) {
        try {
            if (!canCreate(req.user?.role || account_roles.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to create this product" });
            }
            const data = await new ProductService().create(req.body);

            let default_product_option = await new ProductOptionService().create({
                product_id: data.id,
                name: "Default",
                stock: 0,
                price: 0
            });

            return res.status(201).json({ product: data, message: "Create successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async query(req, res) {
        try {
            let query = req.query;
            let data = await new ProductService().query(query);

            return res.status(200).json({ products: data });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async update(req, res) {
        try {
            const target_product = await new ProductService().getOne({ where: { id: req.params.id } });
            if (!target_product) {
                return res.status(404).json({ message: "Not found" });
            }
            if (!canUpdate(req.user?.role || account_roles.NO_ROLE)) {
                return res.status(403).json({ message: "You don't have permission to edit this product" });
            }
            let data = await new ProductService().update(req.body);
            return res.status(200).json({ product: data, message: "Update successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async delete(req, res) {
        try {
            await new ProductService().delete({ where: { id: req.params.id } });
            return res.status(204).json();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}