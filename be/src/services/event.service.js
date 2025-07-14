import db from '../models';
import { EVENT_STATUS, EVENT_TYPES, EVENT_VISIBILITY } from '../constants/enum';

class EventService {
  constructor() {
    this.model = db.event;
  }

  async create(data) {
    try {
      const eventData = {
        ...data,
        status: data.status || EVENT_STATUS.DRAFT,
        visibility: data.visibility || EVENT_VISIBILITY.PUBLIC,
        max_attendees: data.max_attendees || null,
        current_attendees: data.current_attendees || 0,
        metadata: data.metadata || {},
        tags: data.tags || []
      };

      return await this.model.create(eventData);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAll(options = {}) {
    try {
      // Add soft delete filter by default
      const whereCondition = options.where ?
        { ...options.where, deleted_at: null } :
        { deleted_at: null };

      return await this.model.findAll({
        ...options,
        where: whereCondition,
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: options.order || [['start_date', 'ASC']]
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getOne(options = {}) {
    try {
      // Add soft delete filter by default
      const whereCondition = options.where ?
        { ...options.where, deleted_at: null } :
        { deleted_at: null };

      return await this.model.findOne({
        ...options,
        where: whereCondition,
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async update(data) {
    try {
      const { id, ...updates } = data;
      await this.model.update(updates, {
        where: {
          id,
          deleted_at: null
        }
      });
      return await this.getOne({ where: { id } });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async delete(id) {
    try {
      return await this.model.destroy({
        where: {
          id,
          deleted_at: null
        }
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Additional methods for event management
  async getById(id) {
    try {
      return await this.getOne({ where: { id } });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getEventsByStatus(status, options = {}) {
    try {
      return await this.model.findAll({
        where: {
          status: status,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['start_date', 'ASC']],
        ...options
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getEventsByType(type, options = {}) {
    try {
      return await this.model.findAll({
        where: {
          type: type,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['start_date', 'ASC']],
        ...options
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getEventsByDateRange(start_date, end_date, options = {}) {
    try {
      return await this.model.findAll({
        where: {
          start_date: {
            [db.Sequelize.Op.between]: [start_date, end_date]
          },
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['start_date', 'ASC']],
        ...options
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getUpcomingEvents(options = {}) {
    try {
      return await this.model.findAll({
        where: {
          start_date: { [db.Sequelize.Op.gte]: new Date() },
          status: EVENT_STATUS.PUBLISHED,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['start_date', 'ASC']],
        ...options
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getPublicEvents(options = {}) {
    try {
      return await this.model.findAll({
        where: {
          visibility: EVENT_VISIBILITY.PUBLIC,
          status: EVENT_STATUS.PUBLISHED,
          deleted_at: null
        },
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['start_date', 'ASC']],
        ...options
      });
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateStatus(event_id, status) {
    try {
      const event = await this.model.findOne({
        where: {
          id: event_id,
          deleted_at: null
        }
      });

      if (event) {
        event.status = status;

        if (status === EVENT_STATUS.PUBLISHED) {
          event.published_at = new Date();
        } else if (status === EVENT_STATUS.COMPLETED) {
          event.completed_at = new Date();
        } else if (status === EVENT_STATUS.CANCELLED) {
          event.cancelled_at = new Date();
        }

        await event.save();
        return event;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateAttendeeCount(event_id, count_change) {
    try {
      const event = await this.model.findOne({
        where: {
          id: event_id,
          deleted_at: null
        }
      });

      if (event) {
        event.current_attendees = Math.max(0, (event.current_attendees || 0) + count_change);
        await event.save();
        return event;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async searchAndCountAll(options = {}) {
    try {
      // Add soft delete filter by default
      const whereCondition = options.where ?
        { ...options.where, deleted_at: null } :
        { deleted_at: null };

      const { rows, count } = await this.model.findAndCountAll({
        ...options,
        where: whereCondition,
        include: [
          {
            model: db.user,
            as: 'created_by_user',
            where: { deleted_at: null },
            required: false,
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: options.order || [['start_date', 'ASC']]
      });
      return { rows, count };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default EventService;
