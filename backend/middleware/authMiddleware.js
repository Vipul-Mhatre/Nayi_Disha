const jwt = require('jsonwebtoken');
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const jwtToken = token.replace(/^Bearer\s/, "").trim();

    try {
        const secretKey = process.env.JWT_SECRET_KEY;
        const isVerified = jwt.verify(jwtToken, secretKey);

        const userData = await User.findById(isVerified._id).select('-password');

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = userData;
        req.token = jwtToken;
        req.userID = userData._id;

        next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = authMiddleware;