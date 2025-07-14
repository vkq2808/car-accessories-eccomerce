'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.order, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        as: 'order'
      });
      OrderItem.belongsTo(models.product, {
        foreignKey: 'product_id',
        onDelete: 'SET NULL',
        as: 'product'
      });
      OrderItem.belongsTo(models.product_option, {
        foreignKey: 'product_option_id',
        onDelete: 'SET NULL',
        as: 'productOption'
      });
    }

    // Instance Methods
    getTotalPrice() {
      return parseFloat(this.price) * parseInt(this.quantity);
    }

    getDiscountAmount() {
      if (this.discount_percentage > 0) {
        return this.getTotalPrice() * (this.discount_percentage / 100);
      }
      return 0;
    }

    getFinalPrice() {
      return this.getTotalPrice() - this.getDiscountAmount();
    }

    async getProductName() {
      const product = await this.getProduct();
      if (this.product_option_id) {
        const option = await this.getProductOption();
        return option ? `${product.name} - ${option.name}` : product.name;
      }
      return product ? product.name : 'Unknown Product';
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        total_price: this.getTotalPrice(),
        discount_amount: this.getDiscountAmount(),
        final_price: this.getFinalPrice(),
        product_name: data.product?.name || 'Unknown Product',
        option_name: data.productOption?.name || null
      };
    }
  }

  OrderItem.init({
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
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
      onDelete: 'SET NULL'
    },
    product_option_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'product_options',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
          args: 9999,
          msg: 'Quantity cannot exceed 9999'
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
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Note must be less than 1000 characters'
        }
      }
    },
    product_snapshot: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    }
  }, {
    sequelize,
    modelName: 'order_item',
    tableName: 'order_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['order_id']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['product_option_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['price']
      }
    ],
    hooks: {
      beforeCreate: async (orderItem) => {
        // Capture product snapshot for historical reference
        if (orderItem.product_id && !orderItem.product_snapshot) {
          const product = await sequelize.models.product.findByPk(orderItem.product_id);
          if (product) {
            orderItem.product_snapshot = {
              name: product.name,
              price: product.price,
              sku: product.sku,
              image_url: product.image_url
            };
            orderItem.sku = product.sku;
          }
        }

        // Set original price if not provided
        if (!orderItem.original_price) {
          orderItem.original_price = orderItem.price;
        }
      }
    }
  });

  return OrderItem;
}