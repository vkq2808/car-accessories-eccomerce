'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.hasMany(models.cart_item, {
                foreignKey: 'cart_id',
                onDelete: 'CASCADE',
                as: 'items'
            });
            Cart.belongsTo(models.user, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                as: 'user'
            });
        }

        // Instance Methods
        async getTotalItems() {
            const items = await this.getItems();
            return items.reduce((total, item) => total + item.quantity, 0);
        }

        async getTotalPrice() {
            const items = await this.getItems({
                include: [
                    {
                        model: sequelize.models.product,
                        as: 'product'
                    },
                    {
                        model: sequelize.models.product_option,
                        as: 'productOption'
                    }
                ]
            });

            return items.reduce((total, item) => {
                const price = item.productOption ? item.productOption.price : item.product.price;
                return total + (price * item.quantity);
            }, 0);
        }

        async clearCart() {
            return await this.setItems([]);
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                items: data.items || []
            };
        }
    }

    Cart.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                name: 'carts_user_id_unique',
                msg: 'User already has a cart'
            },
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED'),
            allowNull: false,
            defaultValue: 'ACTIVE'
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Please provide a valid expiration date'
                },
                isAfter: {
                    args: new Date().toISOString(),
                    msg: 'Expiration date must be in the future'
                }
            }
        }
    }, {
        sequelize,
        modelName: 'cart',
        tableName: 'carts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['user_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['expires_at']
            }
        ],
        hooks: {
            beforeCreate: (cart) => {
                // Set default expiration to 30 days from now
                if (!cart.expires_at) {
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 30);
                    cart.expires_at = expirationDate;
                }
            }
        }
    });

    return Cart;
}