const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const orgSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
    password: { type: String, required: true }
});

orgSchema.methods.generateToken = async function () {
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

const Organization = mongoose.model("Organization", orgSchema);
module.exports = Organization;