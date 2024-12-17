import express from "express";
import colors from "colors";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";

//importing dotenv
import dotenv from "dotenv";
dotenv.config();

//importing UserSchema file
import User from "./models/Users_Schema.js";

const PORT = process.env.PORT || 3000;
import morgan from "morgan";

//importing conn.js file
import "./conn.js";

//using Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

//importing routes
import router from "./Routers/auth.js";
app.use(router);
import router2 from "./Routers/category.js";
app.use(router2);
import router3 from "./Routers/productRoutes.js";
app.use(router3);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgCyan);
});
