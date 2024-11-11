
import { OrderItemService, OrderService, PaymentService } from "../services";
import jwt from "jsonwebtoken";
import db from "../models";
import moment from "moment";
import { info } from "console";
import { payment_method_codes } from "../constants/constants";
import EmailService from "../services/email.service";

require("dotenv").config();

export default class OrderController {
  constructor() { }

  sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  };


  createVNPayPaymentUrl = async (req, res) => {
    const { amount, bankCode, locale = 'vn', order_id } = req.body;

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = process.env.vnp_TmnCode;
    const secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    const returnUrl = process.env.vnp_ReturnUrl;

    const currCode = 'VND';
    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: order_id,
      vnp_OrderInfo: `Thanh toan cho ma GD: ${order_id}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = this.sortObject(vnp_Params);

    const querystring = require('qs');
    const signData = querystring.stringify(vnp_Params, { encode: false });
    console.log('signData', signData);
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return res.status(200).json({ code: '00', paymentUrl: vnpUrl });
  };


  confirmVNPayPayment = async (req, res) => {
    try {
      let vnp_Params = req.body;
      let secureHash = vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      // Sắp xếp các tham số
      vnp_Params = this.sortObject(vnp_Params);

      let tmnCode = process.env.vnp_TmnCode;
      let secretKey = process.env.vnp_HashSecret;
      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      console.log('signData', signData);
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

      // Kiểm tra checksum
      if (secureHash === signed) {
        let order_id = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        let amount = vnp_Params['vnp_Amount'] / 100;
        let bankCode = vnp_Params['vnp_BankCode'];
        let orderInfo = vnp_Params['vnp_OrderInfo'];
        let transaction_id = vnp_Params['vnp_TransactionNo'];
        let transaction_time = moment(vnp_Params['vnp_PayDate'], 'YYYYMMDDHHmmss').toDate();

        // Tạo payment mới
        let payment = await new PaymentService().create({
          order_id,
          method: 'vnpay',
          status: rspCode === '00' ? 'success' : 'failed',
          bankCode,
          amount,
          currency: 'VND',
          transaction_id,
          decription: orderInfo,
          transaction_info: orderInfo,
          transaction_status: rspCode,
          transaction_time,
          transaction_data: vnp_Params
        });

        // Cập nhật đơn hàng
        let order = await new OrderService().getOne({ where: { id: order_id } });
        if (order) {
          const updatedData = {
            id: order.id,
            status: rspCode === '00' ? 'success' : 'failed',
          };
          await new OrderService().update(updatedData);
        } else {
          return res.status(404).json({ code: '99', msg: 'Order not found' });
        }

        // Lấy thông tin chi tiết đơn hàng
        order = await new OrderService().getOne({
          where: { id: order.id },
          include: [
            {
              model: db.order_item,
              include: [db.product, db.product_option]
            },
            {
              model: db.payment
            }
          ]
        });

        await new EmailService().sendSuccessVNPAYPaymentOrderEmail({ order, email: order.info.email });
        return res.status(200).json({ order });
      } else {
        return res.status(400).json({ code: '97', msg: 'Fail checksum' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ code: '99', msg: 'Internal Server Error' });
    }
  };


  getUserByToken = async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return null;
      }

      const { user } = jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET_KEY,
        async (err, data) => {
          if (err)
            return null;
          return data;
        });

      return user || null;
    } catch (error) {
      return null;
    }
  }

  getAllByUser = async (req, res) => {
    try {
      const user = await this.getUserByToken(req, res);
      if (!user)
        return res.status(204).send();
      const data = await new OrderService().getAll({ where: { userId: user.id }, include: [{ model: db.order_item, include: [{ model: db.product, include: [db.product_option] }] }] });
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  createOrder = async (req, res) => {
    try {
      const { order_items, info, bank_code, payment_method, total_amount } = req.body;
      const user = await this.getUserByToken(req, res);

      let order = await new OrderService().create({ userId: user?.id, status: 'pending', info: info, payment_method: payment_method, payment_bank_code: bank_code, total_amount });

      let new_order_items = order_items.map(item => {
        return {
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          product_option_id: item.product_option?.id,
          currency: item.product.currency
        }
      });

      await db.order_item.bulkCreate(new_order_items);

      order = await new OrderService().getOne({
        where: { id: order.id },
        include: [{
          model: db.order_item, include: [{
            model: db.product,
            include: [db.product_option]
          },
          { model: db.product_option }]
        }]
      });

      if (payment_method === payment_method_codes.COD) {
        new EmailService().sendOrderPendingEmail({ order, email: info.email });
      }

      return res.status(201).json({ order });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  getEmptyOrder = async (req, res) => {
    try {
      const user = await this.getUserByToken(req, res);
      if (!user) {
        return res.status(204).send();
      }
      const data = await new OrderService().findOne({
        where: { userId: user.id, status: 'empty' },
        include: [{
          model: db.order_item,
          as: 'order_items',
        }]
      });
      if (!data) {
        data = await new OrderService().create({ userId: user.id, status: 'empty' });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  getById = async (req, res) => {
    try {
      const data = await new OrderService().getOne(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  addOrderItem = async (req, res) => {
    try {
      const user = await this.getUserByToken(req, res);
      if (!user) {
        return res.status(204).send();
      }

      const order_item = await new OrderItemService().create({ order_id: req.params.id, product_id: req.body.product.id, quantity: req.body.quantity });
      const data = await new OrderService().getOne(req.params.id);

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  updateOrderItem = async (req, res) => {
    try {
      const user = await this.getUserByToken(req, res);
      if (!user) {
        return res.status(204).send();
      }

      const order = await new OrderService().getOne({
        where: { id: req.params.id },
        include: [{ model: db.order_item, include: [{ model: db.product, include: [db.product_option] }] }]
      });
      if (!order) {
        return res.status(404).json({ message: "Not found" });
      }

      const order_item = order.order_items.find(item => item.product.id === req.body.order_item.product.id);
      const new_order_item = await new OrderItemService().update({
        quantity: req.body.quantity
      })

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }





  async getAll(req, res) {
    try {
      const data = await new OrderService().getAll({
        include: [{ model: db.order_item, include: [{ model: db.product, include: [db.product_option] }, { model: db.product_option }] }]
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  async getOne(req, res) {
    try {
      const data = await new OrderService().getOne(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req, res) {
    try {
      const data = await new OrderService().create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req, res) {
    try {
      const data = await new OrderService().update(req.params.id, req.body);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req, res) {
    try {
      await new OrderService().delete(req.params.id);
      return res.status(204).json();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}