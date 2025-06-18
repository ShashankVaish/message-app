import { asyncAwaitHandler } from "../utils/asyncAwaithandler.util.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.util.js";


const verifyUserJWT = asyncAwaitHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Decoded token:", decodedToken); // Debugging line

    let student = await User.findOne({ _id: decodedToken.id });

    if (!student) {
      throw new apiError(401, "Expired Access Token");
    }

    req.User = student;
    next();
  } catch (error) {
    console.log(error);
    throw new apiError(500, "Cannot verify tokens");
  }
});
export { verifyUserJWT };