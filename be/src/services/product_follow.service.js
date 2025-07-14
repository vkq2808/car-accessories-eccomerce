import db from '../models/index';
import { GENERAL_STATUS } from '../constants/enum';

class ProductFollowService {
  constructor() {
    this.model = db.product_follow;
    this.productModel = db.product;
    this.userModel = db.user;
  }

  /**
   * Follow a product
   * @param {Object} data - Follow data
   * @param {number} data.product_id - Product ID
   * @param {number} data.user_id - User ID
   * @param {boolean} data.notification_enabled - Enable notifications
   * @param {Object} data.notification_preferences - Notification preferences
   * @returns {Promise<Object>} Created follow record
   */
  async followProduct(data) {
    try {
      // Check if product exists and is active
      const product = await this.productModel.findByPk(data.product_id);
      if (!product) {
        throw new Error('Product not found');
      }
      if (!product.is_active) {
        throw new Error('Cannot follow inactive product');
      }

      // Check if user exists
      const user = await this.userModel.findByPk(data.user_id);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if already following
      const existingFollow = await this.model.findOne({
        where: {
          product_id: data.product_id,
          user_id: data.user_id
        }
      });

      if (existingFollow) {
        throw new Error('User is already following this product');
      }

      // Create follow record
      const followData = {
        product_id: data.product_id,
        user_id: data.user_id,
        notification_enabled: data.notification_enabled !== undefined ? data.notification_enabled : true,
        notification_preferences: data.notification_preferences || {
          price_drop: true,
          back_in_stock: true,
          new_variant: false,
          promotion: true
        },
        followed_at: new Date()
      };

      const follow = await this.model.create(followData);

      return await this.getFollowWithDetails(follow.id);
    } catch (error) {
      console.error('Error following product:', error);
      throw error;
    }
  }

  /**
   * Unfollow a product
   * @param {number} product_id - Product ID
   * @param {number} user_id - User ID
   * @returns {Promise<boolean>} Success status
   */
  async unfollowProduct(product_id, user_id) {
    try {
      const follow = await this.model.findOne({
        where: {
          product_id: product_id,
          user_id: user_id
        }
      });

      if (!follow) {
        throw new Error('Follow relationship not found');
      }

      await follow.destroy();
      return true;
    } catch (error) {
      console.error('Error unfollowing product:', error);
      throw error;
    }
  }

  /**
   * Check if user is following a product
   * @param {number} product_id - Product ID
   * @param {number} user_id - User ID
   * @returns {Promise<boolean>} Is following status
   */
  async isFollowing(product_id, user_id) {
    try {
      const follow = await this.model.findOne({
        where: {
          product_id: product_id,
          user_id: user_id
        }
      });

      return !!follow;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }

  /**
   * Get user's followed products
   * @param {number} user_id - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated followed products
   */
  async getUserFollowedProducts(user_id, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'followed_at',
        order = 'DESC',
        active_only = true
      } = options;

      const offset = (page - 1) * limit;

      const whereCondition = {
        user_id: user_id
      };

      const productWhere = active_only ? { is_active: true } : {};

      const { count, rows } = await this.model.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: this.productModel,
            as: 'product',
            where: productWhere,
            include: [
              {
                model: db.category,
                as: 'category',
                attributes: ['id', 'name', 'path']
              }
            ]
          }
        ],
        order: [[sort, order]],
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      return {
        follows: rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting user followed products:', error);
      throw error;
    }
  }

  /**
   * Get product followers
   * @param {number} product_id - Product ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Paginated followers
   */
  async getProductFollowers(product_id, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = 'followed_at',
        order = 'DESC',
        notification_enabled_only = false
      } = options;

      const offset = (page - 1) * limit;

      const whereCondition = {
        product_id: product_id,
        ...(notification_enabled_only && { notification_enabled: true })
      };

      const { count, rows } = await this.model.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: this.userModel,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [[sort, order]],
        limit: parseInt(limit),
        offset: offset,
        distinct: true
      });

      return {
        followers: rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      console.error('Error getting product followers:', error);
      throw error;
    }
  }

  /**
   * Get follow with details
   * @param {number} follow_id - Follow ID
   * @returns {Promise<Object>} Follow with product and user details
   */
  async getFollowWithDetails(follow_id) {
    try {
      const follow = await this.model.findByPk(follow_id, {
        include: [
          {
            model: this.productModel,
            as: 'product',
            include: [
              {
                model: db.category,
                as: 'category',
                attributes: ['id', 'name', 'path']
              }
            ]
          },
          {
            model: this.userModel,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });

      if (!follow) {
        throw new Error('Follow record not found');
      }

      return follow;
    } catch (error) {
      console.error('Error getting follow details:', error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   * @param {number} product_id - Product ID
   * @param {number} user_id - User ID
   * @param {Object} preferences - Notification preferences
   * @returns {Promise<Object>} Updated follow record
   */
  async updateNotificationPreferences(product_id, user_id, preferences) {
    try {
      const follow = await this.model.findOne({
        where: {
          product_id: product_id,
          user_id: user_id
        }
      });

      if (!follow) {
        throw new Error('Follow relationship not found');
      }

      const updatedPreferences = {
        ...follow.notification_preferences,
        ...preferences
      };

      await follow.update({
        notification_preferences: updatedPreferences
      });

      return await this.getFollowWithDetails(follow.id);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  /**
   * Toggle notification enabled status
   * @param {number} product_id - Product ID
   * @param {number} user_id - User ID
   * @param {boolean} enabled - Enable/disable notifications
   * @returns {Promise<Object>} Updated follow record
   */
  async toggleNotifications(product_id, user_id, enabled) {
    try {
      const follow = await this.model.findOne({
        where: {
          product_id: product_id,
          user_id: user_id
        }
      });

      if (!follow) {
        throw new Error('Follow relationship not found');
      }

      await follow.update({
        notification_enabled: enabled
      });

      return await this.getFollowWithDetails(follow.id);
    } catch (error) {
      console.error('Error toggling notifications:', error);
      throw error;
    }
  }

  /**
   * Get followers count for a product
   * @param {number} product_id - Product ID
   * @returns {Promise<number>} Followers count
   */
  async getFollowersCount(product_id) {
    try {
      const count = await this.model.count({
        where: {
          product_id: product_id
        }
      });

      return count;
    } catch (error) {
      console.error('Error getting followers count:', error);
      return 0;
    }
  }

  /**
   * Get follows for notification (with enabled notifications)
   * @param {number} product_id - Product ID
   * @returns {Promise<Array>} Follows with notification enabled
   */
  async getFollowsForNotification(product_id) {
    try {
      const follows = await this.model.findAll({
        where: {
          product_id: product_id,
          notification_enabled: true
        },
        include: [
          {
            model: this.userModel,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name', 'email'],
            where: {
              is_active: true
            }
          }
        ]
      });

      return follows;
    } catch (error) {
      console.error('Error getting follows for notification:', error);
      return [];
    }
  }

  /**
   * Update last notification sent time
   * @param {number} follow_id - Follow ID
   * @returns {Promise<void>}
   */
  async updateLastNotificationSent(follow_id) {
    try {
      await this.model.update(
        { last_notification_sent: new Date() },
        { where: { id: follow_id } }
      );
    } catch (error) {
      console.error('Error updating last notification sent:', error);
      throw error;
    }
  }

  /**
   * Bulk unfollow products (for product deletion)
   * @param {number} product_id - Product ID
   * @returns {Promise<number>} Number of unfollowed records
   */
  async bulkUnfollowProduct(product_id) {
    try {
      const result = await this.model.destroy({
        where: {
          product_id: product_id
        }
      });

      return result;
    } catch (error) {
      console.error('Error bulk unfollowing product:', error);
      throw error;
    }
  }

  /**
   * Get follow statistics
   * @returns {Promise<Object>} Follow statistics
   */
  async getFollowStatistics() {
    try {
      const totalFollows = await this.model.count();
      const activeFollows = await this.model.count({
        where: {
          notification_enabled: true
        }
      });

      const topFollowedProducts = await this.model.findAll({
        attributes: [
          'product_id',
          [db.Sequelize.fn('COUNT', db.Sequelize.col('product_id')), 'follow_count']
        ],
        include: [
          {
            model: this.productModel,
            as: 'product',
            attributes: ['id', 'name', 'path', 'image_url', 'price']
          }
        ],
        group: ['product_id', 'product.id'],
        order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('product_id')), 'DESC']],
        limit: 10
      });

      return {
        total_follows: totalFollows,
        active_follows: activeFollows,
        top_followed_products: topFollowedProducts
      };
    } catch (error) {
      console.error('Error getting follow statistics:', error);
      throw error;
    }
  }
}

export default ProductFollowService;
