import express from "express";
import { Login, Logout, signup, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middileware/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", Login);
router.post("/logout", Logout);


router.post("/onboarding", protectRoute, onboard);

//check if user is logged in
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});

export default router;