import express from "express";
import { OrderController } from "../controllers";

let route = express.Router();

let orderRoute = (app) => {
  route.get("/", new OrderController().getAllByUser);
  route.post("/", new OrderController().createOrder);
  route.get("/empty", new OrderController().getEmptyOrder);
  route.get("/:id", new OrderController().getById);
  route.post("/add/:id", new OrderController().addOrderItem);
  route.put("/update/:id", new OrderController().updateOrderItem);
  route.post('/create-payment-url/vnpay', new OrderController().createVNPayPaymentUrl);
  route.post('/confirm-payment/vnpay', new OrderController().confirmVNPayPayment);

  return app.use("/api/v1/order", route);
}

export default orderRoute;
