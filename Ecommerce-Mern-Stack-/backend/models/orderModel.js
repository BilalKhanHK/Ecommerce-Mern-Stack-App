import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Types.ObjectId,
        ref: "ProductModel"
    }],
    payment: {},
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Canceled"]
    }
}, { timestamps: true })
const OrderModel = new mongoose.model("OrderModel", OrderSchema)
export default OrderModel;