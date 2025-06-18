import { Router } from "express";
import { loginUser,registerUser,profileUser,updateUser } from "../controllers/user.controller.js";

import { verifyUserJWT } from "../middleware/auth.middleware.js";
const router = Router();


router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route('/profile').get(verifyUserJWT,profileUser)
router.route('/update').put(verifyUserJWT,updateUser) // Assuming you want to use the same profileUser for update

export default router