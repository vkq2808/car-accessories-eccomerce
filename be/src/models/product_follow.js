'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductFollow extends Model {
        static associate(models) {
            ProductFollow.belongsTo(models.product, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                as: 'product'
            });
            ProductFollow.belongsTo(models.user, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                as: 'user'
            });
        }

        // Instance Methods
        async getProductInfo() {
            const product = await this.getProduct();
            return product ? {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                path: product.path,
                is_active: product.is_active,
                stock: product.stock
            } : null;
        }

        async getUserInfo() {
            const user = await this.getUser();
            return user ? {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            } : null;
        }

        toJSON() {
            const data = this.get();
            return {
                ...data,
                product_name: data.product?.name || 'Unknown Product',
                user_name: data.user ? `${data.user.first_name} ${data.user.last_name}` : 'Unknown User'
            };
        }
    }

    ProductFollow.init({
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        notification_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        followed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        last_notification_sent: {
            type: DataTypes.DATE,
            allowNull: true
        },
        notification_preferences: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: {
                price_drop: true,
                back_in_stock: true,
                new_variant: false,
                promotion: true
            }
        }
    }, {
        sequelize,
        modelName: 'product_follow',
        tableName: 'product_follows',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['product_id', 'user_id'],
                name: 'product_follows_product_user_unique'
            },
            {
                fields: ['product_id']
            },
            {
                fields: ['user_id']
            },
            {
                fields: ['notification_enabled']
            },
            {
                fields: ['followed_at']
            }
        ],
        hooks: {
            beforeCreate: (productFollow) => {
                // Set followed_at to current time
                if (!productFollow.followed_at) {
                    productFollow.followed_at = new Date();
                }
            }
        }
    });

    return ProductFollow;
}