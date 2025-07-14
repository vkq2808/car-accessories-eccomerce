'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.order_item, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        as: 'items'
      });
      Order.belongsTo(models.user, {
        foreignKey: 'user_id',
        onDelete: 'SET NULL',
        as: 'user'
      });
      Order.hasOne(models.payment, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        as: 'payment'
      });
    }

    // Instance Methods
    async getTotalItems() {
      const items = await this.getItems();
      return items.reduce((total, item) => total + item.quantity, 0);
    }

    async calculateTotal() {
      const items = await this.getItems();
      const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discountAmount = this.discount || 0;
      const tax = this.tax_amount || 0;
      const shipping = this.shipping_fee || 0;

      return subtotal - discountAmount + tax + shipping;
    }

    canBeCancelled() {
      return ['PENDING', 'CONFIRMED'].includes(this.status);
    }

    canBeModified() {
      return this.status === 'PENDING';
    }

    isCompleted() {
      return this.status === 'FINISHED';
    }

    isPending() {
      return this.status === 'PENDING';
    }

    async updateStatus(newStatus, note = null) {
      const validTransitions = {
        'PENDING': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['PROCESSING', 'CANCELLED'],
        'PROCESSING': ['SHIPPING', 'CANCELLED'],
        'SHIPPING': ['DELIVERED', 'CANCELLED'],
        'DELIVERED': ['FINISHED'],
        'CANCELLED': [], // Final state
        'FINISHED': [] // Final state
      };

      if (!validTransitions[this.status].includes(newStatus)) {
        throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
      }

      this.status = newStatus;
      if (note) {
        this.notes = this.notes || [];
        this.notes.push({
          status: newStatus,
          note: note,
          timestamp: new Date()
        });
      }

      if (newStatus === 'FINISHED') {
        this.completed_at = new Date();
      }

      return await this.save();
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        can_be_cancelled: this.canBeCancelled(),
        can_be_modified: this.canBeModified(),
        is_completed: this.isCompleted(),
        is_pending: this.isPending(),
        order_number: this.order_number || `ORD-${this.id}`,
        total_items: data.items?.reduce((total, item) => total + item.quantity, 0) || 0
      };
    }
  }

  Order.init({
    order_number: {
      type: DataTypes.STRING(50),
      unique: {
        name: 'orders_order_number_unique',
        msg: 'Order number already exists'
      },
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPING', 'DELIVERED', 'FINISHED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Total amount cannot be negative'
        }
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Subtotal cannot be negative'
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
    discount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Discount cannot be negative'
        }
      }
    },
    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Tax amount cannot be negative'
        }
      }
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Shipping fee cannot be negative'
        }
      }
    },
    shipping_address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    billing_address: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    customer_info: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    payment_method: {
      type: DataTypes.ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    notes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    tracking_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    estimated_delivery: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivered_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'order',
    tableName: 'orders',
    timestamps: true,
    paranoid: true, // Soft delete
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    indexes: [
      {
        unique: true,
        fields: ['order_number'],
        where: {
          order_number: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['payment_status']
      },
      {
        fields: ['payment_method']
      },
      {
        fields: ['total_amount']
      },
      {
        fields: ['created_at']
      }
    ],
    hooks: {
      beforeCreate: (order) => {
        // Generate order number if not provided
        if (!order.order_number) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 5).toUpperCase();
          order.order_number = `ORD-${timestamp}-${random}`;
        }
      },
      beforeUpdate: (order) => {
        // Set cancelled_at when status changes to CANCELLED
        if (order.changed('status') && order.status === 'CANCELLED') {
          order.cancelled_at = new Date();
        }
        // Set delivered_at when status changes to DELIVERED
        if (order.changed('status') && order.status === 'DELIVERED') {
          order.delivered_at = new Date();
        }
        // Set completed_at when status changes to FINISHED
        if (order.changed('status') && order.status === 'FINISHED') {
          order.completed_at = new Date();
        }
      }
    }
  });

  return Order;
}