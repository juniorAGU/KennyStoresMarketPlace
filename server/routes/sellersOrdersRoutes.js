import express from 'express'
import protect from '../middlewears/protect.js'
import Authorize from '../middlewears/rbac.js'
import { GetsellersOrder, UpdateOrderstatus,resolveDispute } from '../controllers/sellersOrderscontroller.js';

export const SellersOrdersRoutes = express.Router();

SellersOrdersRoutes.get("/api/sellerorders", protect, Authorize(["seller"]), GetsellersOrder);
SellersOrdersRoutes.patch("/api/selleroders/:orderId", protect, Authorize(["seller"]), UpdateOrderstatus);
SellersOrdersRoutes.post("/api/selleroders/:orderId", protect, Authorize(["seller"]), resolveDispute)