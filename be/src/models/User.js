'use strict';
const {
    Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.cart, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                as: 'cart'
            });
            User.hasMany(models.order, {
                foreignKey: 'user_id',
                onDelete: 'SET NULL',
                as: 'orders'
            });
            User.hasMany(models.product_follow, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                as: 'followedProducts'
            });
            User.hasMany(models.cost, {
                foreignKey: 'employee_id',
                onDelete: 'SET NULL',
                as: 'costs'
            });
            User.hasMany(models.task, {
                foreignKey: 'employee_id',
                onDelete: 'SET NULL',
                as: 'assignedTasks'
            });
            User.hasMany(models.task, {
                foreignKey: 'admin_id',
                onDelete: 'SET NULL',
                as: 'createdTasks'
            });
        }

        // Instance Methods
        getFullName() {
            return `${this.first_name} ${this.last_name}`;
        }

        toJSON() {
            const { hashed_password, ...data } = this.get();
            return {
                ...data,
                full_name: this.getFullName()
            };
        }

        async comparePassword(password) {
            return await bcrypt.compare(password, this.hashed_password);
        }

        // Class Methods
        static async hashPassword(password) {
            const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
            return await bcrypt.hash(password, saltRounds);
        }

        static getRoleHierarchy() {
            return {
                'SUPER_ADMIN': 4,
                'ADMIN': 3,
                'EMPLOYEE': 2,
                'USER': 1,
                'NO_ROLE': 0
            };
        }

        hasRole(requiredRole) {
            const hierarchy = User.getRoleHierarchy();
            return hierarchy[this.role] >= hierarchy[requiredRole];
        }

        isAdmin() {
            return ['ADMIN', 'SUPER_ADMIN'].includes(this.role);
        }

        isEmployee() {
            return ['EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'].includes(this.role);
        }
    }

    User.init({
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: {
                name: 'users_email_unique',
                msg: 'Email address already exists'
            },
            validate: {
                isEmail: {
                    msg: 'Please provide a valid email address'
                },
                notEmpty: {
                    msg: 'Email is required'
                }
            }
        },
        hashed_password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Password is required'
                }
            }
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'First name is required'
                },
                len: {
                    args: [1, 100],
                    msg: 'First name must be between 1 and 100 characters'
                }
            }
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Last name is required'
                },
                len: {
                    args: [1, 100],
                    msg: 'Last name must be between 1 and 100 characters'
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
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Phone number is required'
                },
                isPhoneNumber(value) {
                    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
                    if (!phoneRegex.test(value)) {
                        throw new Error('Please provide a valid Vietnamese phone number');
                    }
                }
            }
        },
        gender: {
            type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
            allowNull: true,
            defaultValue: 'OTHER'
        },
        birth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Please provide a valid birth date'
                },
                isBefore: {
                    args: new Date().toISOString(),
                    msg: 'Birth date cannot be in the future'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('NO_ROLE', 'USER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN'),
            allowNull: false,
            defaultValue: 'USER'
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
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'user',
        tableName: 'users',
        timestamps: true,
        paranoid: true, // Soft delete
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['role']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['phone']
            }
        ],
        hooks: {
            beforeCreate: async (user) => {
                if (user.hashed_password) {
                    user.hashed_password = await User.hashPassword(user.hashed_password);
                }
                user.email = user.email.toLowerCase();
            },
            beforeUpdate: async (user) => {
                if (user.changed('hashed_password')) {
                    user.hashed_password = await User.hashPassword(user.hashed_password);
                }
                if (user.changed('email')) {
                    user.email = user.email.toLowerCase();
                }
            }
        }
    });

    return User;
}
