import User from "../models/Users_Schema.js"

const isAdmin = async (req, res, next) => {
    try {
        let validateAdmin = req.user.role
        if (validateAdmin) {
            next()
        }
        else {
            res.status(400).send("You are not an admin")
        }
    } catch (error) {
        res.status(400).send(error)
    }
}
export default isAdmin