import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const protectRoute = async (req, res, next) => {
    
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return  res.status(401).json({ message: "Not authorized, token invalid" });
        }

        const user = await User.findById(decoded.UserId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" }); 
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.log("Error in portectRoute middleware:", error); 
        res.status(500).json({ message: "Internal server error" });
    }
}
