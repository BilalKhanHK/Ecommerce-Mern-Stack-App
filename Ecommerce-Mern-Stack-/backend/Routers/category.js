import express from 'express';
const router2 = express.Router()
import CategoryModel from '../models/CategoryModel.js';
import auth from "../middlewares/authUser.js"
import isAdmin from "../middlewares/isAdmin.js"
import slugify from 'slugify';
//create Category
router2.post("/createCategory", auth, isAdmin, async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }
        const existingCategory = await CategoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            })
        }
        const Category = await new CategoryModel({ name, slug: slugify(name) }).save()
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            Category
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: "Error in Create Category" })
    }
})

//update Category
router2.put("/updateCategory/:id", auth, isAdmin, async (req, res) => {
    try {
        const { name } = req.body
        const id = req.params.id
        const existingCategory = await CategoryModel.findOne({ _id: id })
        if (!existingCategory) {
            return res.status(200).send({
                success: false,
                message: "Category does not exist"
            })
        }
        const Category = await CategoryModel.findByIdAndUpdate(id, { name: name, slug: slugify(name) }, { new: true })
        return res.json({ Category: Category, success: true, message: "Category Update Successfully." })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: "Error in Update Category" })
    }
})

//get all categories
router2.get("/allCategories", async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        res.status(200).json({ success: true, message: "All Categories are fetched.", categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error, message: "Error in All Category route." })
    }
})

//delete Category
router2.delete("/deleteCategory/:id", auth, isAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const deleteCategory = await CategoryModel.findOne({ _id: id });
        // console.log(deleteCategory)

        // Check if the category exists
        if (!deleteCategory) {
            return res.status(200).json({ success: false, message: "This Category does not exist" });
        }

        // Delete the category
        const deletedItem = await CategoryModel.findByIdAndDelete({ _id: id });

        // Respond with success message
        res.status(200).json({ success: true, message: "Category is Deleted Successfully.", deletedItem });
    } catch (error) {
        // Handle errors
        console.log(error);
        res.status(500).json({ success: false, error, message: "Error in delete Category route." });
    }
});

//individual category
router2.get("/individualCategory/:slug", async (req, res) => {
    try {
        const slug = req.params.slug
        const individualCategory = await CategoryModel.findOne({ slug })
        if (!individualCategory) {
            return res.status(200).json({
                success: false,
                message: "Category does not exist"
            })
        }
        return res.json({ success: true, message: "Category are fetched successfully", individualCategory })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error, message: "Error in Individaul Category route." });
    }
})

export default router2
