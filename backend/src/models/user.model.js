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
const User = mongoose.model("User", userSchema);

export default User;