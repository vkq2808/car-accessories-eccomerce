// User and Role Enums
export const USER_ROLES = {
  NO_ROLE: 'NO_ROLE',
  USER: 'USER',
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

export const USER_GENDERS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

// Order and Payment Enums
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  FINISHED: 'FINISHED',
  CANCELLED: 'CANCELLED'
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

export const PAYMENT_METHODS = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

// Cart Enums
export const CART_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED'
};

// Cost Enums
export const COST_TYPES = {
  PURCHASE: 'PURCHASE',
  SALARY: 'SALARY',
  MAINTENANCE: 'MAINTENANCE',
  UTILITIES: 'UTILITIES',
  MARKETING: 'MARKETING',
  OTHER: 'OTHER'
};

export const COST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

// Task Enums
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
};

// Event Enums
export const EVENT_TYPES = {
  MEETING: 'MEETING',
  CONFERENCE: 'CONFERENCE',
  WORKSHOP: 'WORKSHOP',
  TRAINING: 'TRAINING',
  SOCIAL: 'SOCIAL',
  MAINTENANCE: 'MAINTENANCE',
  PROMOTION: 'PROMOTION',
  OTHER: 'OTHER'
};

export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const EVENT_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INTERNAL: 'INTERNAL'
};

// Setting Enums
export const SETTING_CATEGORIES = {
  SYSTEM: 'SYSTEM',
  USER: 'USER',
  GENERAL: 'GENERAL',
  PAYMENT: 'PAYMENT',
  EMAIL: 'EMAIL',
  SECURITY: 'SECURITY',
  APPEARANCE: 'APPEARANCE',
  NOTIFICATION: 'NOTIFICATION',
  API: 'API'
};

export const SETTING_DATA_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ARRAY: 'array'
};

export const SETTING_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INTERNAL: 'INTERNAL'
};

// Currency
export const CURRENCIES = {
  VND: 'VND',
  USD: 'USD',
  EUR: 'EUR'
};

// General Status
export const GENERAL_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

// Product related
export const PRODUCT_SORT_OPTIONS = {
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  CREATED_ASC: 'created_asc',
  CREATED_DESC: 'created_desc',
  POPULARITY: 'popularity'
};

// Notification preferences
export const NOTIFICATION_TYPES = {
  PRICE_DROP: 'price_drop',
  BACK_IN_STOCK: 'back_in_stock',
  NEW_VARIANT: 'new_variant',
  PROMOTION: 'promotion',
  ORDER_STATUS: 'order_status',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed'
};

// File upload types
export const ALLOWED_IMAGE_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp'
};

export const ALLOWED_DOCUMENT_TYPES = {
  PDF: 'application/pdf',
  DOC: 'application/msword',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS: 'application/vnd.ms-excel',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

// API Response codes
export const API_RESPONSE_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Common validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_VN: /^(\+84|0)[0-9]{9,10}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  SKU: /^[A-Z0-9-]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Default values
export const DEFAULT_VALUES = {
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  CART_EXPIRY_DAYS: 30,
  PAYMENT_EXPIRY_MINUTES: 30,
  LOW_STOCK_THRESHOLD: 5,
  DEFAULT_CURRENCY: 'VND',
  DEFAULT_LANGUAGE: 'vi',
  DEFAULT_TIMEZONE: 'Asia/Ho_Chi_Minh'
};