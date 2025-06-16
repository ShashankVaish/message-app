import { apiError } from "../utils/apiError.util.js";
// import { User } from "../models/user.model.js";
import { asyncAwaitHandler } from "../utils/asyncAwaithandler.util.js";
import { apiResponse } from "../utils/apiResponse.uitil.js";
import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";


const registerUser = asyncAwaitHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if(existingUser){
        throw new apiError(409, "User already exists with this email");

    }
    try{
        // Create new user
        const newUser = await User.create({
            username,
            email,
            password
        });

        // Return success response
        return  res.status(201)
        .json(new apiResponse(201, {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }, "User registered successfully"));
    }
    catch (error) {
        console.error("Error registering user:", error);
        throw new apiError(500, "Internal server error while registering user");
    }
})



const loginUser = asyncAwaitHandler(async (req, res) => {
    const { email, password } = req.body;
    
    toString(email, password);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(404, "User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        throw new apiError(401, "Invalid password");
    }
    const token = await user.generateAuthToken();
    const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
    };
    return res.status(200)
    .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    }).
    json(new apiResponse(200, {"User":userData,
        "token": token
    }, "User logged in successfully"));
});


export{ registerUser, loginUser };