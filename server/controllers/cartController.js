import { Cart } from "../models/cart.js";
import { Products } from "../models/Product.js";
import { User } from "../models/User.js";
import sanitize from "mongo-sanitize";

const CreateCart = async (req,res,next) => {
    try{
        const userId = req.user._id;

        const cleaned = sanitize(req.body);

        const { productId , quantity = 1} = cleaned;

        const product = await Products.findById(productId);

        if(!product){
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        };

        let exist = await Cart.findOne({user: userId});

        if(!exist){
            exist = await Cart.create({
                user: userId,
                items: [{
                    product: productId,
                    quantity: quantity,
                    price: product.price
                }],
                totalprice: product.price * quantity,
                totalqauntity: quantity
            })
        }else{
            const existing = exist.items.find(item => item.product.toString() === productId);

            const currentQuantityInCart = existing ? existing.quantity : 0;
            if(currentQuantityInCart + quantity > product.quantity){
                return res.status(400).json({
                    success: false,
                    message: `only ${product.quantity} ${product.name} are available`
                });
            }

            if(existing){
                existing.quantity += quantity
            }else{
                exist.items.push({
                    product: productId,
                    price: product.price,
                    quantity: quantity
                })
            };

            exist.totalprice = exist.items.reduce((sum, item) => sum + (item.price * item.quantity),0);

            exist.totalqauntity = exist.items.reduce((sum,item) => sum + item.quantity,0);

            await exist.save();
        };

        const created = await Cart.findById(exist._id)
                .populate({path: "items.product",
                    select: "name  images price seller shippingFee", 
                    populate: {
                        path: "seller",
                        select: "name"
                }})
                .lean();
                
                console.log(created)

        res.status(200).json({
            success: true,
            message: "successful",
            cart: created
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server Error"
        })
    };
};

const getCart = async (req,res,next) => {
    try{

        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate({ path: "items.product",
                select: "name images price seller shippingFee",
                populate: {
                    path: "seller",
                    select: "name"
                }
            })
            .lean();

        if (!cart) {
            return res.status(200).json({ 
                success: true, 
                cart: { items: [], totalprice: 0, totalQuantity: 0 } 
            });
        }

        res.status(200).json({ success: true, cart });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };
};

const UpdateCart = async (req,res,next) => {
    try{

        const cleaned =  sanitize(req.body);

        const userId = req.user._id;

        const itemId =  req.params.itemId;
        

        const { quantity } = cleaned;
        

        if(!quantity || quantity < 1){
            return res.status(400).json({
                success: false,
                message: "quantity must be atleast 1"
            });
        };

        const findCart =  await Cart.findOne({user: userId});

        if(!findCart){
            return res.status(404).json({
                success: false,
                message: "Cart not found" 
            });
        };

        const cartItem = findCart.items.find(pro => pro._id.toString() === itemId);
        if(!cartItem){
            return res.status(404).json({
                success: false,
                message: "cart item no found"
            });
        };

        const product = await Products.findById(cartItem.product);
        if(!product){
            return res.status(404).json({
                success: false,
                message: "product not found"
            });
        };

        if(quantity > product.quantity ){
            return res.status(400).json({
                success: false,
                message: `only ${product.quantity} is available`
            })
        }

        cartItem.quantity = quantity

        findCart.totalprice = findCart.items.reduce((sum, pro) => sum + (pro.price * pro.quantity),0);

        findCart.totalqauntity = findCart.items.reduce((sum, pro) => sum + pro.quantity,0);

        await findCart.save();

        const update = await Cart.findById(findCart._id)
                        .populate("items.product", "name images price quantity")
                        .lean();
        
        res.status(200).json({
            success: true,
            message: "successful",
            cart: update
        })


    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };
};

const DeleteSpecificCart = async (req,res,next) => {
    try{

        const userId = req.user._id;

        const itmId = req.params.itemId;

        const findcart = await Cart.findOne({user: userId});

        if(!findcart){
            return res.status(404).json({
                success: false,
                message: "user Cart not found",
            });
        };

        findcart.items = findcart.items.filter(pro => pro._id.toString() !== itmId);

        findcart.totalprice = findcart.items.reduce((sum, pro) => sum + (pro.price * pro.quantity),0);
        findcart.totalqauntity = findcart.items.reduce((sum, pro) => sum + pro.quantity, 0);

        await findcart.save();

        const update = await Cart.findById(findcart._id)
                    .populate("items.product", "name images price")
                    .lean();

        res.status(200).json({
            success: true,
            message: "successful",
            cart: update
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };
};

const DeleteCart = async (req,res,next) => {
    try{

        const userId = req.user._id;

        const find = await Cart.findOne({user: userId});

        if(!find){
            return res.status(404).json({
                success: false,
                message: "cart not found"
            });
        };

        await Cart.findOneAndDelete({user: userId});

        res.status(200).json({
            success: true,
            message: "success"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    };
}

export {
    CreateCart,
    getCart,
    UpdateCart,
    DeleteSpecificCart,
    DeleteCart
}