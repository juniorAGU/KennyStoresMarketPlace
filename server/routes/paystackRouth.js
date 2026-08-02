import { Router} from 'express';
import { PaystackwebHook } from '../controllers/Paystackcontroller.js';

export const webHookRouter = Router();
webHookRouter.post('/api/paystack/webhook', PaystackwebHook)