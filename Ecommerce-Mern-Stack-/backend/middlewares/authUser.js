import jwt from "jsonwebtoken"
import User from "../models/Users_Schema.js"

const auth = async (req, res, next) => {
    try {
        const token = req.headers["token"];
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        // it will give you the id of document for which this token is created.
        // console.log(verifyUser)  
        if (!verifyUser) {
            return res.status(401).send("Please firstly login");
        }
        const user = await User.findOne({ _id: verifyUser._id });
        // console.log(user)
        req.user = user;
        req.token = token;
        next(); // Call next() to move to the next middleware or route handler
    } catch (error) {
        res.status(400).send(error)
    }
}
export default auth