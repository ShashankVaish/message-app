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
const profileUser = asyncAwaitHandler(async (req, res) => {
    console.log(req.User)
    const user = req.User; // User is attached by auth middleware
    if (!user) {
        throw new apiError(401, "Unauthorized");
    }

    const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
    };

    return res.status(200)
    .json(new apiResponse(200, userData, "User profile fetched successfully"));
}
);

const updateUser = asyncAwaitHandler(async (req, res) => {
    // Assuming req.user is set by the auth middleware
    if (!req.User) {
        throw new apiError(401, "Unauthorized");
    }
    console.log(req.User);

  const userId = req.User.id; // user is attached by auth middleware
  const { username, password,bio,location,phone } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (username) user.username = username;
  if (bio) user.bio = bio;
    if (location) user.location = location;
  if (phone) user.Phone = phone;
    // Only hash password if it is provided
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  await user.save();

  const updatedUserData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  return res.status(200).json(
    new apiResponse(200, updatedUserData, "User updated successfully")
  );
});



export{ registerUser, loginUser , profileUser,updateUser,
};