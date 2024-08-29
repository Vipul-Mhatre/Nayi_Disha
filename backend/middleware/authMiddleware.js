const jwt = require('jsonwebtoken');

const authMiddleware = (Model) => {
    return async (req, res, next) => {
        const token = req.header('Authorization');
        console.log("Request Headers: ", req.headers);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
        }

        const jwtToken = token.replace(/^Bearer\s/, "").trim();
        console.log("Token from middleware ", jwtToken);

        try {
            const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
            console.log("Decoded Token: ", isVerified);

            const userData = await Model.findOne({ _id: isVerified._id }).select({ password: 0 });

            if (!userData) {
                console.log("User not found");
                return res.status(401).json({ message: "User not found" });
            }
            console.log(userData)
            req.user = userData;
            req.token = token;
            req.userID = userData._id;

            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };
};

module.exports = authMiddleware;