import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";


export async function signup(req, res) {
    const {email, password, fullName} = req.body;


    // Validation
    try {
        
        if(!email || !password || !fullName) {
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
             return res.status(400).json({ message: "Invalid email format" });
        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use, please use a different email" });
        }

        // Create new user
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // Create new user
        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePic: randomAvatar,
        });


        // Create Stream user
        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullName,
            image: newUser.profilePic || "",
        });
        console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.error("Error creating Stream user:", error);
        }



        // Generate JWT token
        const token = jwt.sign({UserId:newUser._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});
        res.cookie("token",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,                                   // prevent xss attacks
            sameSite:"strict",                               // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"      // only send cookie over https in production            
        })
        res.status(201).json({ sucess: true, user: newUser });

    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }


}

export  async function Login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await user.matchPassword(password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid  email or password" });
        }

        const token = jwt.sign({UserId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

        res.cookie("token",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,                                   // prevent xss attacks
            sameSite:"strict",                               // prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"      // only send cookie over https in production            
        })
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export function Logout(req, res) {
    res.clearCookie("token")
    res.status(200).json({ message: "Logged out successfully" });
}

export async function onboard(req, res) {
    try {
        const UserId = req.user._id;

        const { fullName, bio,  nativeLanguage, learningLanguage, location} = req.body;

        if (!fullName || !nativeLanguage || !learningLanguage || !location || !bio) {
            return res.status(400).json({
                message: "All fields are required for onboarding",
                missingFields: {
                    fullName: !fullName,
                    nativeLanguage: !nativeLanguage,
                    learningLanguage: !learningLanguage,
                    location: !location,
                    bio: !bio
                }
            });
        }

        const updatedUser = await User.findByIdAndUpdate(UserId, {
            ...req.body,
            isOnboarded: true
        } , { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        //TODO: Update the  user info in stream as well


        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error during user onboarding:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}