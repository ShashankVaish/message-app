import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        // Hash the password before saving
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.default.genSalt(10);
        this.password = await bcrypt.default.hash(this.password, salt);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    const jwt = await import("jsonwebtoken");
    const token = jwt.default.sign({ id: this._id }, process.env.TOKEN_SECRET, {
        expiresIn: "1h",
    });
    return token;
}   


const User = mongoose.model("User", userSchema);
export {User}
export default User;