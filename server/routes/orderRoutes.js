import express from "express";
import protect from '../middlewears/protect.js'
import Authorize from '../middlewears/rbac.js';
import { CreateOrder, CreateDispute, verifyOrders,getOrders,getSpecificOrder } from "../controllers/orderController.js";

export const orderRouter = express.Router();
orderRouter.get("/api/orders",protect ,Authorize("buyer"), getOrders);
orderRouter.post("/api/checkout",protect, Authorize("buyer"), CreateOrder);
orderRouter.post("/api/orders/:orderId", protect, Authorize(["buyer"]), CreateDispute)
orderRouter.get("/api/verify/:reference",protect ,Authorize("buyer"), verifyOrders);
orderRouter.get("/api/orders/:orderId", protect, Authorize("buyer"), getSpecificOrder)

