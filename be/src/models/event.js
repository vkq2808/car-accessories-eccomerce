'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.user, {
        foreignKey: 'created_by',
        onDelete: 'SET NULL',
        as: 'creator'
      });
    }

    // Instance Methods
    isUpcoming() {
      return new Date(this.date) > new Date();
    }

    isPast() {
      return new Date(this.date) < new Date();
    }

    isToday() {
      const today = new Date();
      const eventDate = new Date(this.date);
      return today.toDateString() === eventDate.toDateString();
    }

    isPublic() {
      return this.visibility === 'PUBLIC';
    }

    isPrivate() {
      return this.visibility === 'PRIVATE';
    }

    getDaysUntilEvent() {
      if (this.isPast()) return 0;
      const now = new Date();
      const eventDate = new Date(this.date);
      const diffTime = eventDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }

    getFormattedDate() {
      return new Date(this.date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    getFormattedTime() {
      return new Date(this.date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    toJSON() {
      const data = this.get();
      return {
        ...data,
        is_upcoming: this.isUpcoming(),
        is_past: this.isPast(),
        is_today: this.isToday(),
        is_public: this.isPublic(),
        is_private: this.isPrivate(),
        days_until_event: this.getDaysUntilEvent(),
        formatted_date: this.getFormattedDate(),
        formatted_time: this.getFormattedTime(),
        creator_name: data.creator ? `${data.creator.first_name} ${data.creator.last_name}` : null
      };
    }
  }

  Event.init({
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Event title is required'
        },
        len: {
          args: [1, 200],
          msg: 'Event title must be between 1 and 200 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Description must be less than 2000 characters'
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Please provide a valid event date'
        }
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Please provide a valid end date'
        },
        isAfterStartDate(value) {
          if (value && this.date && new Date(value) < new Date(this.date)) {
            throw new Error('End date must be after start date');
          }
        }
      }
    },
    location: {
      type: DataTypes.STRING(300),
      allowNull: true,
      validate: {
        len: {
          args: [0, 300],
          msg: 'Location must be less than 300 characters'
        }
      }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'Address must be less than 500 characters'
        }
      }
    },
    event_type: {
      type: DataTypes.ENUM('MEETING', 'CONFERENCE', 'WORKSHOP', 'TRAINING', 'SOCIAL', 'MAINTENANCE', 'PROMOTION', 'OTHER'),
      allowNull: false,
      defaultValue: 'OTHER'
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'DRAFT'
    },
    visibility: {
      type: DataTypes.ENUM('PUBLIC', 'PRIVATE', 'INTERNAL'),
      allowNull: false,
      defaultValue: 'PUBLIC'
    },
    max_attendees: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: 1,
          msg: 'Maximum attendees must be at least 1'
        }
      }
    },
    current_attendees: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: 0,
          msg: 'Current attendees cannot be negative'
        }
      }
    },
    registration_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    registration_deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Please provide a valid registration deadline'
        },
        isBeforeEventDate(value) {
          if (value && this.date && new Date(value) > new Date(this.date)) {
            throw new Error('Registration deadline must be before event date');
          }
        }
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    contact_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid contact email'
        }
      }
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [0, 20],
          msg: 'Contact phone must be less than 20 characters'
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
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    recurring_pattern: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    reminder_settings: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        enabled: true,
        intervals: [24, 2] // hours before event
      }
    }
  }, {
    sequelize,
    modelName: 'event',
    tableName: 'events',
    timestamps: true,
    paranoid: true, // Soft delete
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deleted_at: 'deleted_at',
    indexes: [
      {
        fields: ['date']
      },
      {
        fields: ['end_date']
      },
      {
        fields: ['event_type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['visibility']
      },
      {
        fields: ['created_by']
      },
      {
        fields: ['registration_required']
      },
      {
        fields: ['registration_deadline']
      },
      {
        fields: ['is_recurring']
      },
      {
        fields: ['title']
      }
    ],
    hooks: {
      beforeCreate: (event) => {
        // Set default end_date if not provided (1 hour after start)
        if (!event.end_date && event.date) {
          const endDate = new Date(event.date);
          endDate.setHours(endDate.getHours() + 1);
          event.end_date = endDate;
        }
      }
    }
  });

  return Event;
}