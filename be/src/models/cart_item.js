'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            CartItem.belongsTo(models.cart, {
                foreignKey: 'cart_id',
                onDelete: 'CASCADE',
                as: 'cart'
            });
            CartItem.belongsTo(models.product, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                as: 'product'
            });
            CartItem.belongsTo(models.product_option, {
                foreignKey: 'product_option_id',
                onDelete: 'CASCADE',
                as: 'productOption'
            });
        }

        // Instance Methods
        async getItemPrice() {
            if (this.product_option_id) {
                const productOption = await this.getProductOption();
                return productOption ? productOption.price : 0;
            }
            const product = await this.getProduct();
            return product ? product.price : 0;
        }

        async getTotalPrice() {
            const price = await this.getItemPrice();
            return price * this.quantity;
        }

        async validateStock() {
            if (this.product_option_id) {
                const productOption = await this.getProductOption();
                return productOption && productOption.stock >= this.quantity;
            }
            const product = await this.getProduct();
            return product && product.stock >= this.quantity;
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                total_price: this.quantity * (this.productOption?.price || this.product?.price || 0)
            };
        }
    }

    CartItem.init({
        cart_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'carts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        product_option_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'product_options',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: {
                    args: 1,
                    msg: 'Quantity must be at least 1'
                },
                max: {
                    args: 999,
                    msg: 'Quantity cannot exceed 999'
                }
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
            validate: {
                min: {
                    args: 0,
                    msg: 'Unit price cannot be negative'
                }
            }
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 500],
                    msg: 'Note must be less than 500 characters'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'cart_item',
        tableName: 'cart_items',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['cart_id', 'product_id', 'product_option_id'],
                name: 'cart_items_unique_constraint'
            },
            {
                fields: ['cart_id']
            },
            {
                fields: ['product_id']
            },
            {
                fields: ['product_option_id']
            }
        ],
        hooks: {
            beforeCreate: async (cartItem) => {
                // Set unit price if not provided
                if (!cartItem.unit_price) {
                    cartItem.unit_price = await cartItem.getItemPrice();
                }
            },
            beforeUpdate: async (cartItem) => {
                // Update unit price if product or option changed
                if (cartItem.changed('product_id') || cartItem.changed('product_option_id')) {
                    cartItem.unit_price = await cartItem.getItemPrice();
                }
            }
        }
    });

    return CartItem;
}