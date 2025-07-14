import db from '../models';
import { Op } from 'sequelize';

export default class SettingService {
  constructor() {
    this.SettingModel = db.setting;
    this.UserModel = db.user;
  }

  // Get setting by key
  async getSetting(key, defaultValue = null) {
    try {
      const setting = await this.SettingModel.findOne({
        where: { key, is_active: true },
        include: [
          {
            model: this.UserModel,
            as: 'updater',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              deleted_at: null
            },
            required: false
          }
        ]
      });

      if (!setting) {
        return defaultValue;
      }

      return setting.getTypedValue();
    } catch (error) {
      throw error;
    }
  }

  // Set setting value
  async setSetting(key, value, options = {}) {
    try {
      const {
        category = 'GENERAL',
        dataType = 'string',
        description = null,
        visibility = 'PRIVATE',
        userId = null,
        isReadonly = false,
        validationRules = {},
        tags = [],
        metadata = {}
      } = options;

      const [setting] = await this.SettingModel.findOrCreate({
        where: { key },
        defaults: {
          key,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          category,
          data_type: dataType,
          description,
          visibility,
          updated_by: userId,
          is_active: true,
          is_readonly: isReadonly,
          validation_rules: validationRules,
          tags,
          metadata
        }
      });

      if (!setting._options.isNewRecord) {
        await setting.updateValue(value, userId);
      }

      return setting;
    } catch (error) {
      throw error;
    }
  }

  // Get settings by category
  async getSettingsByCategory(category) {
    try {
      const settings = await this.SettingModel.findAll({
        where: {
          category,
          is_active: true
        },
        include: [
          {
            model: this.UserModel,
            as: 'updater',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              deleted_at: null
            },
            required: false
          }
        ],
        order: [['sort_order', 'ASC'], ['key', 'ASC']]
      });

      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.getTypedValue();
        return acc;
      }, {});
    } catch (error) {
      throw error;
    }
  }

  // Get all settings with pagination
  async getAllSettings({ page = 1, limit = 20, category = null, visibility = null, search = null, isActive = true } = {}) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = { is_active: isActive };

      if (category) {
        whereClause.category = category;
      }

      if (visibility) {
        whereClause.visibility = visibility;
      }

      if (search) {
        whereClause[Op.or] = [
          { key: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await this.SettingModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: this.UserModel,
            as: 'updater',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              deleted_at: null
            },
            required: false
          }
        ],
        order: [['sort_order', 'ASC'], ['key', 'ASC']],
        limit,
        offset
      });

      return {
        settings: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update setting value
  async updateSetting(key, value, userId = null) {
    try {
      const setting = await this.SettingModel.findOne({
        where: { key, is_active: true }
      });

      if (!setting) {
        throw new Error('Setting not found');
      }

      if (setting.is_readonly) {
        throw new Error('Cannot update readonly setting');
      }

      await setting.updateValue(value, userId);

      // Return updated setting with relations
      return await this.SettingModel.findOne({
        where: { key },
        include: [
          {
            model: this.UserModel,
            as: 'updater',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              deleted_at: null
            },
            required: false
          }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  // Delete setting (soft delete)
  async deleteSetting(key, userId = null) {
    try {
      const setting = await this.SettingModel.findOne({
        where: { key, is_active: true }
      });

      if (!setting) {
        throw new Error('Setting not found');
      }

      if (setting.is_readonly) {
        throw new Error('Cannot delete readonly setting');
      }

      setting.updated_by = userId;
      await setting.destroy();

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Restore deleted setting
  async restoreSetting(key, userId = null) {
    try {
      const setting = await this.SettingModel.findOne({
        where: { key },
        paranoid: false
      });

      if (!setting) {
        throw new Error('Setting not found');
      }

      setting.updated_by = userId;
      await setting.restore();

      return setting;
    } catch (error) {
      throw error;
    }
  }

  // Get public settings (for client-side)
  async getPublicSettings() {
    try {
      const settings = await this.SettingModel.findAll({
        where: {
          visibility: 'PUBLIC',
          is_active: true
        },
        order: [['sort_order', 'ASC'], ['key', 'ASC']]
      });

      return settings.reduce((acc, setting) => {
        acc[setting.key] = setting.getTypedValue();
        return acc;
      }, {});
    } catch (error) {
      throw error;
    }
  }

  // Update multiple settings
  async updateMultipleSettings(settingsData, userId = null) {
    try {
      const results = [];

      for (const { key, value } of settingsData) {
        const result = await this.updateSetting(key, value, userId);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }

  // Get settings by tags
  async getSettingsByTags(tags = []) {
    try {
      const settings = await this.SettingModel.findAll({
        where: {
          is_active: true,
          tags: {
            [Op.overlap]: tags
          }
        },
        include: [
          {
            model: this.UserModel,
            as: 'updater',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              deleted_at: null
            },
            required: false
          }
        ],
        order: [['sort_order', 'ASC'], ['key', 'ASC']]
      });

      return settings;
    } catch (error) {
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getPolicies() {
    return await this.getSetting('policies');
  }

  async updatePolicies(data, userId = null) {
    return await this.setSetting('policies', data, {
      category: 'GENERAL',
      dataType: 'json',
      description: 'Website policies configuration',
      userId
    });
  }

  async getPromotions() {
    return await this.getSetting('promotions');
  }

  async updatePromotions(data, userId = null) {
    return await this.setSetting('promotions', data, {
      category: 'GENERAL',
      dataType: 'json',
      description: 'Website promotions configuration',
      userId
    });
  }
}