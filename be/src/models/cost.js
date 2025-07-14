'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cost extends Model {
    static associate(models) {
      Cost.belongsTo(models.product, {
        foreignKey: 'product_id',
        onDelete: 'SET NULL',
        as: 'product'
      });
      Cost.belongsTo(models.user, {
        foreignKey: 'employee_id',
        onDelete: 'SET NULL',
        as: 'employee'
      });
      Cost.belongsTo(models.user, {
        foreignKey: 'approved_by',
        onDelete: 'SET NULL',
        as: 'approver'
      });
    }

    // Instance Methods
    isPurchaseCost() {
      return this.cost_type === 'PURCHASE';
    }

    isSalaryCost() {
      return this.cost_type === 'SALARY';
    }

    isMaintenanceCost() {
      return this.cost_type === 'MAINTENANCE';
    }

    isApproved() {
      return this.status === 'APPROVED';
    }

    isPending() {
      return this.status === 'PENDING';
    }

    isRejected() {
      return this.status === 'REJECTED';
    }

    canBeApproved() {
      return this.status === 'PENDING';
    }

    canBeRejected() {
      return this.status === 'PENDING';
    }

    async approve(approverId, note = null) {
      if (!this.canBeApproved()) {
        throw new Error('Cost cannot be approved in current status');
      }

      this.status = 'APPROVED';
      this.approved_by = approverId;
      this.approved_at = new Date();
      this.approval_note = note;

      return await this.save();
    }

    async reject(approverId, reason) {
      if (!this.canBeRejected()) {
        throw new Error('Cost cannot be rejected in current status');
      }

      this.status = 'REJECTED';
      this.approved_by = approverId;
      this.approved_at = new Date();
      this.rejection_reason = reason;

      return await this.save();
    }

    getFormattedAmount() {
      return `${this.total_cost.toLocaleString()} ${this.currency}`;
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        is_purchase: this.isPurchaseCost(),
        is_salary: this.isSalaryCost(),
        is_maintenance: this.isMaintenanceCost(),
        is_approved: this.isApproved(),
        is_pending: this.isPending(),
        is_rejected: this.isRejected(),
        can_be_approved: this.canBeApproved(),
        can_be_rejected: this.canBeRejected(),
        formatted_amount: this.getFormattedAmount(),
        employee_name: data.employee ? `${data.employee.first_name} ${data.employee.last_name}` : null,
        approver_name: data.approver ? `${data.approver.first_name} ${data.approver.last_name}` : null
      };
    }
  }

  Cost.init({
    total_cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: {
          args: 0,
          msg: 'Total cost cannot be negative'
        }
      }
    },
    cost_type: {
      type: DataTypes.ENUM('PURCHASE', 'SALARY', 'MAINTENANCE', 'UTILITIES', 'MARKETING', 'OTHER'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Cost type is required'
        }
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Category must be less than 100 characters'
        }
      }
    },
    subcategory: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Subcategory must be less than 100 characters'
        }
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'products',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    payment_method: {
      type: DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'CARD', 'CHECK', 'OTHER'),
      allowNull: true
    },
    payment_reference: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: {
        name: 'costs_invoice_number_unique',
        msg: 'Invoice number already exists'
      }
    },
    vendor_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    vendor_contact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    receipt_url: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid receipt URL'
        }
      }
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    incurred_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Please provide a valid incurred date'
        }
      }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Please provide a valid due date'
        }
      }
    },
    paid_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Please provide a valid paid date'
        }
      }
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approval_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    recurring_frequency: {
      type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
      allowNull: true
    },
    recurring_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'cost',
    tableName: 'costs',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['invoice_number'],
        where: {
          invoice_number: {
            [sequelize.Sequelize.Op.ne]: null
          }
        }
      },
      {
        fields: ['cost_type']
      },
      {
        fields: ['category']
      },
      {
        fields: ['product_id']
      },
      {
        fields: ['employee_id']
      },
      {
        fields: ['approved_by']
      },
      {
        fields: ['status']
      },
      {
        fields: ['total_cost']
      },
      {
        fields: ['incurred_date']
      },
      {
        fields: ['due_date']
      },
      {
        fields: ['paid_date']
      },
      {
        fields: ['is_recurring']
      }
    ],
    hooks: {
      beforeCreate: (cost) => {
        // Set incurred_date to current date if not provided
        if (!cost.incurred_date) {
          cost.incurred_date = new Date();
        }

        // Generate invoice number if not provided
        if (!cost.invoice_number && cost.cost_type === 'PURCHASE') {
          const timestamp = Date.now();
          const random = Math.random().toString(36).substr(2, 5).toUpperCase();
          cost.invoice_number = `INV-${timestamp}-${random}`;
        }
      }
    }
  });

  return Cost;
}