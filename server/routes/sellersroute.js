import express from 'express';
import protect from '../middlewears/protect.js';
import { getSeller } from '../controllers/sellersController.js';


export const sellersRoute = express.Router();
sellersRoute.get("/api/seller/:sellerId", protect, getSeller)