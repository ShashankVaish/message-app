import { asyncAwaitHandler } from "../utils/asyncAwaithandler.util";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.utils.js";


const verifyUserJWT = asyncAwaitHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(400, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

    let student = await User.findOne({ _id: decodedToken._id });

    if (!student) {
      throw new apiError(401, "Expired Access Token");
    }

    req.User = User;
    next();
  } catch (error) {
    console.log(error);
    throw new apiError(500, "Cannot verify tokens");
  }
});
export { verifyUserJWT };