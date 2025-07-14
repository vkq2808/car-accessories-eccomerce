'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProductOption extends Model {
    static associate(models) {
      ProductOption.belongsTo(models.product, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE',
        as: 'product'
      });
      ProductOption.hasMany(models.order_item, {
        foreignKey: 'product_option_id',
        onDelete: 'SET NULL',
        as: 'orderItems'
      });
      ProductOption.hasMany(models.cart_item, {
        foreignKey: 'product_option_id',
        onDelete: 'CASCADE',
        as: 'cartItems'
      });
    }

    // Instance Methods
    isInStock() {
      return this.stock > 0;
    }

    isAvailable() {
      return this.is_active && this.isInStock();
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
        formatted_price: `${this.price.toLocaleString()} VND`
      };
    }
  }

  ProductOption.init({
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Option name is required'
        },
        len: {
          args: [1, 100],
          msg: 'Option name must be between 1 and 100 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Description must be less than 500 characters'
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
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: {
        name: 'product_options_sku_unique',
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
    attributes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid image URL'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'product_option',
    tableName: 'product_options',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
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
        unique: true,
        fields: ['product_id', 'name'],
        name: 'product_options_product_name_unique'
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['price']
      },
      {
        fields: ['stock']
      },
      {
        fields: ['sort_order']
      }
    ],
    hooks: {
      beforeCreate: (productOption) => {
        // Generate SKU if not provided
        if (!productOption.sku) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 3).toUpperCase();
          productOption.sku = `OPT-${timestamp}-${random}`;
        }

        // Set original price if not provided
        if (!productOption.original_price) {
          productOption.original_price = productOption.price;
        }
      }
    }
  });

  return ProductOption;
}