import { User } from "../models/User.js";
import { Products } from "../models/Product.js";
import { Order } from "../models/orders.js";

const getSeller = async (req,res,next) => {
    try{

        const sellerId = req.params.sellerId;

        const finduser = await User.findById(sellerId)
                .select("name image bio createdAt")
                .lean();

        if(!finduser){
            return res.status(404).json({
                success: false,
                message: "usernot found"
            });
        };

        const findproduct = await Products.find({seller: sellerId, status: "available"})
                    .sort({createdAt: -1})
                    .lean();
        
        if(!findproduct){
            return res.status(404).json({
                success: false,
                message: "products not found"
            });
        };

        const totalProduct = await Products.countDocuments({seller: sellerId})
        const totalSold =  await Order.countDocuments({seller: sellerId, status: {$in: ["paid","shipped","delivered"]}});

        res.status(200).json({
            success: true,
            message: "successful",
            seller: {
                ...finduser,
                totalProduct,
                totalSold
            },
            products: findproduct
        })


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    }
}

export {
    getSeller
}