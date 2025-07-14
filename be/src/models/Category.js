'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.product, {
                foreignKey: 'category_id',
                onDelete: 'SET NULL',
                as: 'products'
            });
            Category.belongsTo(models.category, {
                foreignKey: 'parent_id',
                onDelete: 'SET NULL',
                as: 'parent'
            });
            Category.hasMany(models.category, {
                foreignKey: 'parent_id',
                onDelete: 'SET NULL',
                as: 'children'
            });
        }

        // Instance Methods
        async getProductCount() {
            return await this.countProducts();
        }

        async getActiveProductCount() {
            return await this.countProducts({
                where: {
                    is_active: true
                }
            });
        }

        isParent() {
            return this.parent_id === null;
        }

        async getAncestors() {
            const ancestors = [];
            let current = this;

            while (current.parent_id) {
                current = await current.getParent();
                if (current) ancestors.push(current);
            }

            return ancestors.reverse();
        }

        async getFullPath() {
            const ancestors = await this.getAncestors();
            const pathNames = ancestors.map(a => a.name);
            pathNames.push(this.name);
            return pathNames.join(' > ');
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                is_parent: this.isParent(),
                product_count: data.products?.length || 0
            };
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Category name is required'
                },
                len: {
                    args: [1, 100],
                    msg: 'Category name must be between 1 and 100 characters'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1000],
                    msg: 'Description must be less than 1000 characters'
                }
            }
        },
        path: {
            type: DataTypes.STRING(200),
            unique: {
                name: 'categories_path_unique',
                msg: 'Category path already exists'
            },
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Category path is required'
                },
                isSlug(value) {
                    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
                    if (!slugRegex.test(value)) {
                        throw new Error('Path must be a valid slug (lowercase letters, numbers, and hyphens only)');
                    }
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
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
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
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
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
        }
    }, {
        sequelize,
        modelName: 'category',
        tableName: 'categories',
        timestamps: true,
        paranoid: true, // Soft delete
        indexes: [
            {
                unique: true,
                fields: ['path']
            },
            {
                fields: ['parent_id']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['sort_order']
            },
            {
                fields: ['name']
            }
        ],
        hooks: {
            beforeCreate: (category) => {
                // Generate path from name if not provided
                if (!category.path && category.name) {
                    category.path = category.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            },
            beforeUpdate: (category) => {
                // Update path if name changed and path not manually set
                if (category.changed('name') && !category.changed('path')) {
                    category.path = category.name
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim('-');
                }
            }
        }
    });

    return Category;
}
