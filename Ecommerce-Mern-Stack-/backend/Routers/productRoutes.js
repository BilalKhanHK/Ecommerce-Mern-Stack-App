import express from "express"
const router3 = express.Router()
import auth from "../middlewares/authUser.js"
import isAdmin from "../middlewares/isAdmin.js"
import ProductModel from "../models/Product_Schema.js"
import slugify from "slugify"
import fs from "fs"
import ExpressFormidable from 'express-formidable'
import CategoryModel from "../models/CategoryModel.js"
import braintree from "braintree"
import OrderModel from "../models/orderModel.js"

//importing dotenv
import dotenv from "dotenv"
import toast from "react-hot-toast"
dotenv.config()

//paymet Gatway
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.Merchant_ID,
    publicKey: process.env.Public_Key,
    privateKey: process.env.Private_Key,
});

//create product 
router3.post("/createProduct", auth, isAdmin, ExpressFormidable(), async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(401).send({ success: false, message: "Name is required" })
            case !description:
                return res.status(401).send({ success: false, message: "Name is description" })
            case !price:
                return res.status(401).send({ success: false, message: "price is required" })
            case !category:
                return res.status(401).send({ success: false, message: "category is required" })
            case !quantity:
                return res.status(401).send({ success: false, message: "quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(401).send({ success: false, message: "Photo is required and should be less than 1mb" })
        }
        const products = new ProductModel({
            ...req.fields, slug: slugify(name)
        })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Create Product"
        })
    }
})

//get products
router3.get("/allProducts", async (req, res) => {
    try {
        const products = await ProductModel.find({}).populate("category").select("-photo").sort({ createdAt: -1 })
        // .limit(20)
        res.status(200).json({
            success: true,
            total: products.length,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Get all Products"
        })
    }
})

router3.get("/individualProduct/:slug", ExpressFormidable(), async (req, res) => {
    try {
        const slug = req.params.slug
        const exist = await ProductModel.findOne({ slug })
        if (!exist) {
            return res.status(200).send({
                success: false,
                message: "Product does not exist"
            })
        }
        const product = await ProductModel.findOne({ slug }).select("-photo").populate("category")
        res.status(200).json({
            success: true,
            message: "Product was successfully Fetched.",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Get Individual Products"
        })
    }
})

//get Photo
router3.get("/productPhoto/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const exist = await ProductModel.findOne({ _id })
        if (!exist) {
            return res.status(200).send({
                success: false,
                message: "Product does not exist"
            })
        }
        const product = await ProductModel.findOne({ _id }).select("photo")
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType)
            return res.send(product.photo.data);
        }
        else {
            return res.status(404).json({
                success: false,
                message: "Product photo not found",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Get Product photo."
        })
    }
})

//delete product
router3.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const _id = req.params.id
        const exist = await ProductModel.findOne({ _id })
        if (!exist) {
            return res.status(200).send({
                success: false,
                message: "Product does not exist"
            })
        }
        let product = await ProductModel.findByIdAndDelete({ _id }).select("-photo")
        res.status(200).json({
            success: true,
            message: "Product was successfully Deleted.",
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Delete Product photo."
        })
    }
})

//update Product
router3.put("/updateProduct/:id", auth, isAdmin, ExpressFormidable(), async (req, res) => {
    try {
        const _id = req.params.id

        //validations
        const exist = await ProductModel.findOne({ _id })
        if (!exist) {
            return res.status(200).send({
                success: false,
                message: "Product does not exist"
            })
        }

        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        switch (true) {
            case !name:
                return res.status(401).send({ success: false, message: "Name is required" })
            case !description:
                return res.status(401).send({ success: false, message: "Name is description" })
            case !price:
                return res.status(401).send({ success: false, message: "price is required" })
            case !category:
                return res.status(401).send({ success: false, message: "category is required" })
            case !quantity:
                return res.status(401).send({ success: false, message: "quantity is required" })
            case !photo && photo.size > 1000000:
                return res.status(401).send({ success: false, message: "Photo is required and should be less than 1mb" })
        }
        const products = await ProductModel.findByIdAndUpdate(_id, {
            ...req.fields, slug: slugify(name)
        }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).json({
            success: true,
            message: "Product Updated successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Update Product"
        })
    }
})

//filter products
router3.post("/filterProducts", async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) {
            args.category = checked
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }
        const products = await ProductModel.find(args)
        res.status(200).json({
            success: true,
            total: products.length,
            products
        })
        // console.log(args)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Filter Product"
        })
    }
})

//search product
router3.get("/searchProduct/:keyword", async (req, res) => {
    try {
        const keyword = req.params.keyword
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select("-photo")
        res.status(200).json({
            success: true,
            total: products.length,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Search Product"
        })
    }
})

//related products
router3.get("/relatedProducts/:pid/:cid", async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await ProductModel.find({ _id: { $ne: pid }, category: cid }).select("-photo").limit(3)
        res.status(200).json({
            success: true,
            total: products.length,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Related Product route."
        })
    }
})

//get product by Category
router3.get("/productByCategory/:slug", async (req, res) => {
    try {
        const category = await CategoryModel.findOne({ slug: req.params.slug });
        const products = await ProductModel.find({ category }).populate("category").select("-photo")
        res.status(200).json({
            success: true,
            total: products.length,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting products by category."
        });
    }
});
//payment routes
router3.get("/braintree/token", async (req, res) => {
    try {
        const clientToken = await gateway.clientToken.generate()
        if (clientToken) {
            res.status(200).json({
                success: true,
                clientToken
            })
        }
        else {
            res.status(200).json({
                success: false,
                message: "Token Generating Failed."
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in Braintree Token"
        })
    }
})

//payments
router3.post("/braintree/payments", auth, async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((item) => {
            return total += item.price;
        });

        const result = await gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        });

        if (result.success) {
            // Payment successful, create order
            const order = new OrderModel({
                products: cart,
                payment: result,
                buyer: req.user._id
            });

            await order.save();
            res.json({ success: true });
        } else {
            // Payment unsuccessful
            res.status(400).json({
                success: false,
                message: "Payment Unsuccessful"
            });
            console.log(result)
        }
    } catch (error) {
        console.error("Error in Braintree Payments:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Error in Braintree Payments"
        });
    }
});

export default router3