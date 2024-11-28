import { FaCreditCard, FaMobileAlt, FaMoneyBillWave } from "react-icons/fa";

export const payment_method_codes = {
  MOMO: "momo",
  VN_PAY: "vnpay",
  COD: "cod",
}

export const payment_methods = [
  {
    id: payment_method_codes.MOMO,
    name: "Momo",
    icon: <FaMobileAlt className="w-8 h-8 text-pink-500" />,
    description: "Pay with Momo e-wallet"
  },
  {
    id: payment_method_codes.VN_PAY,
    name: "VNPay",
    icon: <FaCreditCard className="w-8 h-8 text-blue-500" />,
    description: "Pay with VNPay gateway",
    banks: [
      {
        code: "NCB",
        name: "Ngan hang NCB",
        logo: "https://s-vnba-cdn.aicms.vn/vnba-media/23/8/22/ncb_64e48d66c2ccd.jpg"
      },
      {
        code: "ACB",
        name: "Ngan hang ACB",
        logo: "https://rubicmarketing.com/wp-content/uploads/2022/12/y-nghia-logo-acb-1.jpg"
      },
      {
        code: "VCB",
        name: "Ngan hang Vietcombank",
        logo: "https://saca.com.vn/vnt_upload/partner/Vietcombank.jpg"
      },
      // {
      //   code: "VNPAYQR",
      //   name: "Thanh toan qua VNPAYQR",
      //   logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1UA-RNBzfbFgVg3sWZWoZoJwkEAc6jy5OtA&s"
      // }
    ]
  },
  {
    id: payment_method_codes.COD,
    name: "Cash on Delivery",
    icon: <FaMoneyBillWave className="w-8 h-8 text-green-500" />,
    description: "Pay when you receive"
  }
];

export const contact_constants = {
  company_logo: "https://hips.hearstapps.com/hmg-prod/images/2023-mercedes-amg-c63-s-e-performance-109-65d79697e865a.jpg?crop=0.651xw:0.549xh;0.0897xw,0.326xh&resize=2048:*",
  company_name: "Company Name"
}

export const admin_table_field_types = {
  TABLE: "table",
  PARENT_SELECT: "parent-select",
  CHILD_SELECT: "child-select",
  ID: "id",
  UNIQUE: "unique",
  NO_FORM_DATA: "no-form-data",
  NO_SHOW_DATA: "no-show-data",
  NO_EDITABLE: "no-editable",
  NO_ADDABLE: "no-addable",
  REQUIRED: "required",
  NO_EDIT_REQUIRED: "NO_EDIT_REQUIRED",
  TEXT: "text",
  EMAIL: "email",
  SELECT: "select",
  NUMBER: "number",
  IMAGE: "image",
  DATE: "date",
  DATE_TIME: "date-time",
  PASSWORD: "password",
  MINIMUN_LENGTH: "minimun-length",
  TEXTAREA: "textarea",
  QUERY: "query",
  JSON: "json",
}

export const account_roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  EMPLOYEE: 'EMPLOYEE'
}

export const role_author_number = {
  [account_roles.NO_ROLE]: 0,
  [account_roles.USER]: 1,
  [account_roles.EMPLOYEE]: 1,
  [account_roles.ADMIN]: 2,
  [account_roles.SUPER_ADMIN]: 3,
}


export const account_statuses = {
  Active: "Active",
  Inactive: "Inactive"
}

export const account_gender = {
  MALE: "male",
  FEMALE: "female"
}

export const order_status = {
  EMPTY: 'EMPTY',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  DELIVERING: 'DELIVERING',
  FINISHED: 'FINISHED',
  NONE: 'NONE'
}

export const cost_types = {
  PURCHASE: 'PURCHASE',
  SALARY: 'SALARY',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER'
}