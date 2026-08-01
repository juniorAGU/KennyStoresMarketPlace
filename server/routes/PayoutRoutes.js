import express from 'express'
import protect from '../middlewears/protect.js';
import Authorize from '../middlewears/rbac.js';
import { createPayout,getPayout, getBanks } from '../controllers/PayoutsController.js';

export const PayoutRout = express.Router();
PayoutRout.get('/api/earnings/withdrawal', protect, Authorize(['seller']), getPayout);
PayoutRout.get('/api/all/banks', protect, Authorize(['seller']), getBanks)
PayoutRout.post('/api/earnings/withdrawal', protect, Authorize(['seller']), createPayout);