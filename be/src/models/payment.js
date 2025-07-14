'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.order, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        as: 'order'
      });
    }

    // Instance Methods
    isPending() {
      return this.status === 'PENDING';
    }

    isSuccessful() {
      return this.status === 'SUCCESS';
    }

    isFailed() {
      return this.status === 'FAILED';
    }

    isRefunded() {
      return this.status === 'REFUNDED';
    }

    canBeRefunded() {
      return this.isSuccessful() && !this.isRefunded();
    }

    async markAsSuccess(transactionData = {}) {
      this.status = 'SUCCESS';
      this.transaction_status = 'COMPLETED';
      this.transaction_time = new Date();
      this.transaction_data = { ...this.transaction_data, ...transactionData };
      return await this.save();
    }

    async markAsFailed(reason = null) {
      this.status = 'FAILED';
      this.transaction_status = 'FAILED';
      this.failure_reason = reason;
      return await this.save();
    }

    async processRefund(refundAmount = null, reason = null) {
      if (!this.canBeRefunded()) {
        throw new Error('Payment cannot be refunded');
      }

      const refundAmountFinal = refundAmount || this.amount;

      this.status = 'REFUNDED';
      this.refund_amount = refundAmountFinal;
      this.refund_reason = reason;
      this.refunded_at = new Date();

      return await this.save();
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        is_pending: this.isPending(),
        is_successful: this.isSuccessful(),
        is_failed: this.isFailed(),
        is_refunded: this.isRefunded(),
        can_be_refunded: this.canBeRefunded(),
        formatted_amount: `${this.amount.toLocaleString()} ${this.currency}`
      };
    }
  }

  Payment.init({
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
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: {
        name: 'payments_payment_reference_unique',
        msg: 'Payment reference already exists'
      }
    },
    method: {
      type: DataTypes.ENUM('COD', 'VNPAY', 'MOMO', 'BANK_TRANSFER'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Payment method is required'
        }
      }
    },
    bank_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Amount cannot be negative'
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
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: {
        name: 'payments_transaction_id_unique',
        msg: 'Transaction ID already exists'
      }
    },
    transaction_info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    transaction_status: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaction_data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    gateway_response: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    failure_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refund_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: 'Refund amount cannot be negative'
        }
      }
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fee_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Fee amount cannot be negative'
        }
      }
    },
    net_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: {
          args: 0,
          msg: 'Net amount cannot be negative'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'payment',
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['payment_reference'],
        where: {
          payment_reference: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        unique: true,
        fields: ['transaction_id'],
        where: {
          transaction_id: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        fields: ['order_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['method']
      },
      {
        fields: ['amount']
      },
      {
        fields: ['transaction_time']
      },
      {
        fields: ['expires_at']
      }
    ],
    hooks: {
      beforeCreate: (payment) => {
        // Generate payment reference if not provided
        if (!payment.payment_reference) {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 8).toUpperCase();
          payment.payment_reference = `PAY-${timestamp}-${random}`;
        }

        // Set expiration for pending payments (30 minutes from now)
        if (payment.status === 'PENDING' && !payment.expires_at) {
          const expirationTime = new Date();
          expirationTime.setMinutes(expirationTime.getMinutes() + 30);
          payment.expires_at = expirationTime;
        }

        // Calculate net amount
        if (!payment.net_amount) {
          payment.net_amount = payment.amount - payment.fee_amount;
        }
      },
      beforeUpdate: (payment) => {
        // Update net amount if amount or fee changes
        if (payment.changed('amount') || payment.changed('fee_amount')) {
          payment.net_amount = payment.amount - payment.fee_amount;
        }
      }
    }
  });

  return Payment;
}