const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    donations: [{ type: String }],
    password: { type: String, required: true }
});

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                _id: this._id.toString(),
                name: this.name,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            }
        );
    } catch (error) {
        console.error("Token Error:", error);
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;