import express from 'express';
import protect from '../middlewears/protect.js';
import { Upload } from '../CloudinaryConfig/cloudinary.js';
import { CreateProducts, UpdateProduct,getProduct,DeleteProduct,getSpecificProduct,getSellersProduct } from '../controllers/productController.js';
import abac from '../middlewears/Abac.js';
import Authorize from '../middlewears/rbac.js';
import { paginat } from '../middlewears/pagination.js';
import { Products } from '../models/Product.js';
import { SetSellerFilter } from '../middlewears/Filters.js';

export const productRouth = express.Router();

productRouth.get("/api/products", protect,  getProduct);
productRouth.get("/api/products/my", protect, Authorize(["seller"]), SetSellerFilter, paginat(Products), getSellersProduct);

productRouth.get("/api/products/:id",protect,getSpecificProduct)
productRouth.post("/api/products", protect, Authorize(["seller"]), Upload.array("images",5), CreateProducts);

// managament routes

productRouth.patch("/api/products/:id", protect, abac("updateItem"),Upload.array("images",5), UpdateProduct);
productRouth.delete("/api/products/:id",protect, Authorize(["seller"]),abac("deleteItem"), DeleteProduct);