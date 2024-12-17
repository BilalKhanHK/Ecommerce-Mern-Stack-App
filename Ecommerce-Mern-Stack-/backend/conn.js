import mongoose from "mongoose";
//importing dotenv
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb://localhost:27017/EcommerceMernApp")
    await mongoose.connect(
      "mongodb+srv://muhammadbilall987456:5B2KhDGYMNkQMrwQ@ecommerceapp.c6myr5m.mongodb.net/EcommerceApp"
    );
    console.log("Connection Successfull".bgYellow);
  } catch (error) {
    console.log("Connection Failed.".bgRed);
    console.log(error);
  }
};

connectDB();
