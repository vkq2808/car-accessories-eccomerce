import db from '../models';
import { EventService } from '../services';
import { USER_ROLES, EVENT_STATUS, EVENT_TYPES, EVENT_VISIBILITY } from '../constants/enum';

class EventController {
  // Create a new event
  async create(req, res) {
    try {
      const { title, description, event_date, location, event_type, visibility } = req.body;

      if (!title || !event_date || !event_type) {
        return res.status(400).json({ message: "Missing required fields: title, event_date, event_type" });
      }

      // Check if user has permission to create events
      if (req.user.role !== USER_ROLES.ADMIN && req.user.role !== USER_ROLES.SUPER_ADMIN) {
        return res.status(403).json({ message: "You don't have permission to create events" });
      }

      // Validate event_type
      if (!Object.values(EVENT_TYPES).includes(event_type)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      // Validate visibility
      if (visibility && !Object.values(EVENT_VISIBILITY).includes(visibility)) {
        return res.status(400).json({ message: "Invalid visibility value" });
      }

      const eventData = {
        title,
        description,
        event_date,
        location,
        event_type,
        visibility: visibility || EVENT_VISIBILITY.PUBLIC,
        status: EVENT_STATUS.DRAFT,
        created_by: req.user.id
      };

      const newEvent = await new EventService().create(eventData);

      return res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get all events
  async getAll(req, res) {
    try {
      const { status, event_type, visibility } = req.query;
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;

      let whereClause = {};

      // Filter by status if provided
      if (status && Object.values(EVENT_STATUS).includes(status)) {
        whereClause.status = status;
      }

      // Filter by event type if provided
      if (event_type && Object.values(EVENT_TYPES).includes(event_type)) {
        whereClause.event_type = event_type;
      }

      // Filter by visibility if provided
      if (visibility && Object.values(EVENT_VISIBILITY).includes(visibility)) {
        whereClause.visibility = visibility;
      }

      // If not admin, only show public events or events created by the user
      if (!isAdminOrSuperAdmin) {
        whereClause = {
          ...whereClause,
          [db.Sequelize.Op.or]: [
            { visibility: EVENT_VISIBILITY.PUBLIC },
            { created_by: req.user?.id }
          ]
        };
      }

      const events = await new EventService().getAll({
        where: whereClause,
        include: [
          { model: db.user, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }
        ],
        order: [['event_date', 'ASC']]
      });

      return res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get one event
  async getOne(req, res) {
    try {
      const { id } = req.params;

      const event = await new EventService().getOne({
        where: { id },
        include: [
          { model: db.user, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }
        ]
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user has permission to view this event
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;
      const isCreator = req.user?.id === event.created_by;
      const isPublic = event.visibility === EVENT_VISIBILITY.PUBLIC;

      if (!isAdminOrSuperAdmin && !isCreator && !isPublic) {
        return res.status(403).json({ message: "You don't have permission to view this event" });
      }

      return res.status(200).json({ event });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update an event
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const event = await new EventService().getOne({ where: { id } });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user has permission to update this event
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;
      const isCreator = req.user?.id === event.created_by;

      if (!isAdminOrSuperAdmin && !isCreator) {
        return res.status(403).json({ message: "You don't have permission to update this event" });
      }

      // Validate event_type if provided
      if (updates.event_type && !Object.values(EVENT_TYPES).includes(updates.event_type)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      // Validate visibility if provided
      if (updates.visibility && !Object.values(EVENT_VISIBILITY).includes(updates.visibility)) {
        return res.status(400).json({ message: "Invalid visibility value" });
      }

      // Validate status if provided
      if (updates.status && !Object.values(EVENT_STATUS).includes(updates.status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      delete updates.id; // Prevent ID from being updated
      delete updates.created_by; // Prevent creator from being changed

      const updatedEvent = await new EventService().update(id, updates);

      return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete an event
  async delete(req, res) {
    try {
      const { id } = req.params;

      const event = await new EventService().getOne({ where: { id } });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user has permission to delete this event
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;
      const isCreator = req.user?.id === event.created_by;

      if (!isAdminOrSuperAdmin && !isCreator) {
        return res.status(403).json({ message: "You don't have permission to delete this event" });
      }

      await new EventService().delete(id);

      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update event status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(EVENT_STATUS).includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const event = await new EventService().getOne({ where: { id } });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      // Check if user has permission to update status
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;
      const isCreator = req.user?.id === event.created_by;

      if (!isAdminOrSuperAdmin && !isCreator) {
        return res.status(403).json({ message: "You don't have permission to update this event status" });
      }

      const updatedEvent = await new EventService().update(id, { status });

      return res.status(200).json({ message: "Event status updated successfully", event: updatedEvent });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get upcoming events
  async getUpcoming(req, res) {
    try {
      const { limit = 10 } = req.query;
      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;

      let whereClause = {
        event_date: {
          [db.Sequelize.Op.gte]: new Date()
        },
        status: EVENT_STATUS.PUBLISHED
      };

      // If not admin, only show public events
      if (!isAdminOrSuperAdmin) {
        whereClause.visibility = EVENT_VISIBILITY.PUBLIC;
      }

      const events = await new EventService().getAll({
        where: whereClause,
        include: [
          { model: db.user, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }
        ],
        order: [['event_date', 'ASC']],
        limit: parseInt(limit)
      });

      return res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Get events by type
  async getByType(req, res) {
    try {
      const { type } = req.params;

      if (!Object.values(EVENT_TYPES).includes(type)) {
        return res.status(400).json({ message: "Invalid event type" });
      }

      const isAdminOrSuperAdmin = req.user?.role === USER_ROLES.ADMIN || req.user?.role === USER_ROLES.SUPER_ADMIN;

      let whereClause = {
        event_type: type,
        status: EVENT_STATUS.PUBLISHED
      };

      // If not admin, only show public events
      if (!isAdminOrSuperAdmin) {
        whereClause.visibility = EVENT_VISIBILITY.PUBLIC;
      }

      const events = await new EventService().getAll({
        where: whereClause,
        include: [
          { model: db.user, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] }
        ],
        order: [['event_date', 'ASC']]
      });

      return res.status(200).json({ events });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default EventController;
