import mongoose from "mongoose"

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        lowercase: true
    }
})
const CategoryModel = new mongoose.model("CategoryModel", CategorySchema)
export default CategoryModel;