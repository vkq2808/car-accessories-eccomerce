'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    static associate(models) {
      Setting.belongsTo(models.user, {
        foreignKey: 'updated_by',
        onDelete: 'SET NULL',
        as: 'updater'
      });
    }

    // Instance Methods
    isPublic() {
      return this.visibility === 'PUBLIC';
    }

    isPrivate() {
      return this.visibility === 'PRIVATE';
    }

    isSystem() {
      return this.category === 'SYSTEM';
    }

    isUserSetting() {
      return this.category === 'USER';
    }

    getTypedValue() {
      if (this.data_type === 'boolean') {
        return this.value === 'true' || this.value === true;
      }
      if (this.data_type === 'number') {
        return parseFloat(this.value);
      }
      if (this.data_type === 'json') {
        try {
          return JSON.parse(this.value);
        } catch (e) {
          return this.value;
        }
      }
      return this.value;
    }

    async updateValue(newValue, userId = null) {
      // Validate the new value based on data type
      if (this.data_type === 'boolean' && typeof newValue !== 'boolean') {
        throw new Error('Value must be a boolean');
      }
      if (this.data_type === 'number' && isNaN(parseFloat(newValue))) {
        throw new Error('Value must be a number');
      }
      if (this.data_type === 'json') {
        try {
          JSON.parse(typeof newValue === 'string' ? newValue : JSON.stringify(newValue));
        } catch (e) {
          throw new Error('Value must be valid JSON');
        }
      }

      // Store the value as string for consistency
      this.value = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
      this.updated_by = userId;
      this.updated_at = new Date();

      return await this.save();
    }

    // Static Methods
    static async getSetting(key, defaultValue = null) {
      const setting = await Setting.findOne({ where: { key } });
      return setting ? setting.getTypedValue() : defaultValue;
    }

    static async setSetting(key, value, category = 'GENERAL', dataType = 'string', userId = null) {
      const [setting] = await Setting.findOrCreate({
        where: { key },
        defaults: {
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category,
          data_type: dataType,
          updated_by: userId,
          is_active: true
        }
      });

      if (!setting._options.isNewRecord) {
        await setting.updateValue(value, userId);
      }

      return setting;
    }

    static async getSettingsByCategory(category) {
      const settings = await Setting.findAll({
        where: { category, is_active: true },
        order: [['key', 'ASC']]
      });

      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.getTypedValue();
        return acc;
      }, {});
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        typed_value: this.getTypedValue(),
        is_public: this.isPublic(),
        is_private: this.isPrivate(),
        is_system: this.isSystem(),
        is_user_setting: this.isUserSetting(),
        updater_name: data.updater ? `${data.updater.first_name} ${data.updater.last_name}` : null
      };
    }
  }

  Setting.init({
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        name: 'settings_key_unique',
        msg: 'Setting key already exists'
      },
      validate: {
        notEmpty: {
          msg: 'Setting key is required'
        },
        len: {
          args: [1, 100],
          msg: 'Setting key must be between 1 and 100 characters'
        },
        isValidKey(value) {
          const keyRegex = /^[a-zA-Z0-9_.-]+$/;
          if (!keyRegex.test(value)) {
            throw new Error('Setting key can only contain letters, numbers, underscores, dots, and hyphens');
          }
        }
      }
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    default_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_type: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
      allowNull: false,
      defaultValue: 'string'
    },
    category: {
      type: DataTypes.ENUM('SYSTEM', 'USER', 'GENERAL', 'PAYMENT', 'EMAIL', 'SECURITY', 'APPEARANCE', 'NOTIFICATION', 'API'),
      allowNull: false,
      defaultValue: 'GENERAL'
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
    visibility: {
      type: DataTypes.ENUM('PUBLIC', 'PRIVATE', 'INTERNAL'),
      allowNull: false,
      defaultValue: 'PRIVATE'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    is_readonly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    validation_rules: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
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
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    sequelize,
    modelName: 'setting',
    tableName: 'settings',
    timestamps: true,
    paranoid: true, // Soft delete
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deleted_at: 'deleted_at',
    indexes: [
      {
        unique: true,
        fields: ['key']
      },
      {
        fields: ['category']
      },
      {
        fields: ['data_type']
      },
      {
        fields: ['visibility']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['is_readonly']
      },
      {
        fields: ['updated_by']
      },
      {
        fields: ['sort_order']
      }
    ],
    hooks: {
      beforeCreate: (setting) => {
        // Set default value if not provided
        if (setting.default_value === null) {
          setting.default_value = setting.value;
        }
      },
      beforeUpdate: (setting) => {
        // Prevent updating readonly settings
        if (setting.is_readonly && setting.changed('value')) {
          throw new Error('Cannot update readonly setting');
        }
      }
    }
  });

  return Setting;
}