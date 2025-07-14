'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.category, {
                foreignKey: 'category_id',
                as: 'category'
            });
            Product.hasMany(models.cart_item, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                as: 'cartItems'
            });
            Product.hasMany(models.order_item, {
                foreignKey: 'product_id',
                onDelete: 'SET NULL',
                as: 'orderItems'
            });
            Product.hasMany(models.product_option, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                as: 'options'
            });
            Product.hasMany(models.product_follow, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                as: 'followers'
            });
            Product.hasMany(models.cost, {
                foreignKey: 'product_id',
                onDelete: 'SET NULL',
                as: 'costs'
            });
        }

        // Instance Methods
        async getProductOptions(options = {}) {
            return await this.getOptions(options);
        }

        async getFollowers(options = {}) {
            return await this.getProduct_follows(options);
        }

        async getFollowerCount() {
            return await this.countFollowers();
        }

        async getCosts(options = {}) {
            return await this.getCosts(options);
        }

        async getCategory(options = {}) {
            return await this.getCategory(options);
        }

        async getTotalSold() {
            const orderItems = await this.getOrderItems({
                include: [{
                    model: sequelize.models.order,
                    as: 'order',
                    where: {
                        status: 'FINISHED'
                    }
                }]
            });
            return orderItems.reduce((total, item) => total + item.quantity, 0);
        }

        async getAverageRating() {
            // This would need a reviews model - placeholder for now
            return 0;
        }

        isInStock() {
            return this.stock > 0;
        }

        isAvailable() {
            return this.is_active && this.isInStock();
        }

        getDiscountedPrice() {
            if (this.discount_percentage > 0) {
                return this.price * (1 - this.discount_percentage / 100);
            }
            return this.price;
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                is_in_stock: this.isInStock(),
                is_available: this.isAvailable(),
                discounted_price: this.getDiscountedPrice(),
                has_options: (data.options?.length || 0) > 0,
                follower_count: data.followers?.length || 0
            };
        }
    }

    Product.init({
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Product name is required'
                },
                len: {
                    args: [1, 200],
                    msg: 'Product name must be between 1 and 200 characters'
                }
            }
        },
        path: {
            type: DataTypes.STRING(250),
            unique: {
                name: 'products_path_unique',
                msg: 'Product path already exists'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Product path is required'
                },
                isSlug(value) {
                    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
                    if (!slugRegex.test(value)) {
                        throw new Error('Path must be a valid slug (lowercase letters, numbers, and hyphens only)');
                    }
                }
            }
        },
        detail: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 5000],
                    msg: 'Product detail must be less than 5000 characters'
                }
            }
        },
        short_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: 'Short description must be less than 500 characters'
                }
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: 0,
                    msg: 'Stock cannot be negative'
                }
            }
        },
        price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: {
                    args: 0,
                    msg: 'Price cannot be negative'
                }
            }
        },
        original_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            validate: {
                min: {
                    args: 0,
                    msg: 'Original price cannot be negative'
                }
            }
        },
        discount_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: 0,
                    msg: 'Discount percentage cannot be negative'
                },
                max: {
                    args: 100,
                    msg: 'Discount percentage cannot exceed 100%'
                }
            }
        },
        currency: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'VND',
            validate: {
                len: {
                    args: [3, 3],
                    msg: 'Currency must be a 3-character code'
                }
            }
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                isUrl: {
                    msg: 'Please provide a valid image URL'
                }
            }
        },
        images: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: []
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        },
        sku: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: {
                name: 'products_sku_unique',
                msg: 'SKU already exists'
            },
            validate: {
                len: {
                    args: [0, 50],
                    msg: 'SKU must be less than 50 characters'
                }
            }
        },
        weight: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            validate: {
                min: {
                    args: 0,
                    msg: 'Weight cannot be negative'
                }
            }
        },
        dimensions: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {}
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: {
                    args: 0,
                    msg: 'Sort order cannot be negative'
                }
            }
        },
        meta_title: {
            type: DataTypes.STRING(200),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 200],
                    msg: 'Meta title must be less than 200 characters'
                }
            }
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: 'Meta description must be less than 500 characters'
                }
            }
        },
        low_stock_threshold: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: {
                    args: 0,
                    msg: 'Low stock threshold cannot be negative'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'product',
        tableName: 'products',
        timestamps: true,
        paranoid: true, // Soft delete
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deleted_at: 'deleted_at',
        indexes: [
            {
                unique: true,
                fields: ['path']
            },
            {
                unique: true,
                fields: ['sku'],
                where: {
                    sku: {
                        [sequelize.Sequelize.Op.ne]: null
                    }
                }
            },
            {
                fields: ['category_id']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['is_featured']
            },
            {
                fields: ['price']
            },
            {
                fields: ['stock']
            },
            {
                fields: ['sort_order']
            },
            {
                fields: ['name']
            }
        ],
        hooks: {
            beforeCreate: (product) => {
                // Generate path from name if not provided
                if (!product.path && product.name) {
                    product.path = product.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
                // Generate SKU if not provided
                if (!product.sku) {
                    product.sku = 'PRD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
                }
            },
            beforeUpdate: (product) => {
                // Update path if name changed and path not manually set
                if (product.changed('name') && !product.changed('path')) {
                    product.path = product.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            }
        }
    });

    return Product;
}
