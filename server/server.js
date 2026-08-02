import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { ConnectDB } from './DBconfig/db.js';
import cookiePerser from 'cookie-parser';
import helmet from 'helmet';
import sanitizer from 'mongo-sanitize';
import { xss } from 'express-xss-sanitizer';

// imported files
import { authRoute } from './routes/Authroute.js';
import { basicLimiter } from './middlewears/ratelimiter.js';
import { productRouth } from './routes/productRoutes.js';
import { CommentRoute } from './routes/CommentRouth.js';
import { LikesRouth } from './routes/likeRouth.js';
import { CartRoutes } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { sellersRoute } from './routes/sellersroute.js';
import { SellersOrdersRoutes } from './routes/sellersOrdersRoutes.js';
import { PayoutRout } from './routes/PayoutRoutes.js';
import { webHookRouter } from './routes/paystackRouth.js';




const app = express();
app.set('trust proxy', 1);
app.use(helmet());

app.use(cors({
    origin: ["https://kenny-stores-market-place.vercel.app"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));
ConnectDB();
app.use('/api/paystack/webhook',express.raw({ type: 'application/json'}))
app.use(express.json());
app.use(cookiePerser());
app.use(xss());
app.use(basicLimiter);


app.get("/", (req,res) => {
    res.send("backend is running underground")
})

// api Routes 
app.use("/", authRoute);
app.use("/", productRouth);
app.use("/", CommentRoute);
app.use("/", LikesRouth);
app.use("/", CartRoutes);
app.use("/", orderRouter);
app.use("/", SellersOrdersRoutes);
app.use("/", sellersRoute);
app.use("/", PayoutRout);
app.use('/', webHookRouter)



app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:5000")
})