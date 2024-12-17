import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    cPassword: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        default: "Mianwali Sultan Khel Punjab Pakistan"
    },
    question: {
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = new mongoose.model("User", UserSchema)
export default User;