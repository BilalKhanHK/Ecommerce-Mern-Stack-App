import express from 'express';
const router = express.Router();
import User from "../models/Users_Schema.js"
import { body, validationResult } from "express-validator"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"
import auth from "../middlewares/authUser.js"
import isAdmin from '../middlewares/isAdmin.js';
import OrderModel from '../models/orderModel.js';
//importing dotenv
import dotenv from "dotenv"
dotenv.config()

router.get("/", (req, res) => {
    res.send("<h1>Router and APIS are Working !</h1>");
});



router.post("/register",
    [
        body("name", "Enter a valid name").isLength({ min: 3 }),
        body("email", "Enter a valid name").isEmail(),
        body("password", "Password must be atleast 5 characters").isLength({ min: 5 }),
        body("cPassword", "Password must be atleast 5 characters").isLength({ min: 5 }),
        body("question", "Question must be atleast 5 characters").isLength({ min: 5 }),
        body("phone", "Enter a valid phone number").isLength({ min: 10 }),
    ],
    async (req, res) => {
        try {
            let success = false
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array(), success });
            }
            let password = req.body.password
            let cPassword = req.body.cPassword
            if (password !== cPassword) {
                return res.status(400).json({ message: "Passwords do not match", success });
            }
            else {
                //hashing Passwords
                let secPass = await bcrypt.hash(password, 10)
                let secPass2 = await bcrypt.hash(cPassword, 10)

                //creating a new user
                let user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass,
                    cPassword: secPass2,
                    phone: req.body.phone,
                    question: req.body.question,
                    address: req.body.address,
                    role: req.body.role,
                })

                //generating json webtoken
                let token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
                success = true
                res.status(200).json({ token, message: "User is Successfully Created.", success, user });
            }
        } catch (error) {
            res.status(404).json({ message: "This is server side error", error });

        }
    })
router.post("/login", [
    body("email", "Enter a valid name").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({ min: 5 }),
], async (req, res) => {
    try {
        let success = false;
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist", success });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect Password", success });
        }
        //generating json webtoken
        let token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
        success = true
        res.status(200).json({ token, message: "User is Successfully LogedIn.", success, user });


    } catch (error) {
        res.status(404).json({ message: "This is server side error", error });
    }
})

//forget password
router.post("/forgetPassword", async (req, res) => {
    try {
        const { email, question, newPassword } = req.body
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!question) {
            return res.status(400).json({ message: "Question is required" })
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New Password is required" })
        }

        //check
        const user = await User.findOne({ email, question })

        //validation
        if (!user) {
            return res.status(400).json({ message: "Wrong Email or Answer", success: false })
        }
        const hashed = await bcrypt.hash(newPassword, 10)
        await User.findByIdAndUpdate(user._id, { password: hashed, cPassword: hashed })
        res.status(200).json({ message: "Password changed successfully", success: true })
    } catch (error) {
        res.status(404).json({ message: "This is server side error", error });
    }
})

router.get("/details", auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

//Protected-route auth
router.get("/user-auth", auth, (req, res) => {
    res.status(200).send({ ok: true })
    console.log("Private api is hit.")
})

//admin route
router.get("/admin", auth, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
    console.log("Admin api is hit.")
})

router.put("/updateProfile", auth, [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid name").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({ min: 5 }),
    body("cPassword", "Password must be atleast 5 characters").isLength({ min: 5 }),
    body("phone", "Enter a valid phone number").isLength({ min: 10 }),
], async (req, res) => {
    try {
        let success = false
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), success });
        }
        let password = req.body.password
        let cPassword = req.body.cPassword
        if (password !== cPassword) {
            return res.status(400).json({ message: "Passwords do not match", success });
        }
        else {
            //hashing Passwords
            let secPass = await bcrypt.hash(password, 10)
            let secPass2 = await bcrypt.hash(cPassword, 10)

            const user = await User.findByIdAndUpdate(req.user._id, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                password: secPass,
                cPassword: secPass2,
            })
            success = true
            res.status(200).json({ user, success, message: "User Updated Successfully." })
            // console.log(user)
        }
    } catch (error) {
        res.status(404).json({ message: "This is server side error in updating Profile.", error: error });
        console.log(error)
    }
})

router.get("/orders", auth, async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name")
        res.status(200).json({ total: orders.length, orders })
    } catch (error) {
        res.status(404).json({ message: "This is server side error in getting orders.", error: error })
    }
})

router.get("/allOrders", auth, isAdmin, async (req, res) => {
    try {
        const orders = await OrderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: -1 })
        res.status(200).json({ total: orders.length, orders })
        // console.log(orders)
    } catch (error) {
        res.status(404).json({ message: "This is server side error in getting orders.", error: error })
    }
})

//updateStatus
router.put("/updateStatus/:id", auth, isAdmin, async (req, res) => {
    try {
        const orderId = req.params.id
        const { status } = req.body
        const orders = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.status(200).json({ message: "Status Updated Successfully", orders, success: true })
    } catch (error) {
        res.status(404).json({ message: "This is server side error in updating Status.", error: error })
        console.log(error)
    }
})
export default router;
