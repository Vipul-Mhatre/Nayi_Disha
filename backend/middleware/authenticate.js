const router = require('express')();
const jwt = require("jsonwebtoken")
const User = require("../model/userSchema")
const cookieparser = require('cookie-parser')

router.use(cookieparser())

const authenticate = (req,res,next) => {

    try{
        const token = req.cookies.jwtoken;
        if (!token) {
            return res.status(403).json({message:'No Token Found'});
        }
        const verifyToken = jwt.verify(token , process.env.SECRET_KEY);

        User.findOne({_id : verifyToken._id , "tokens.token" : token})
            .then((rootUser) => {
                if(!rootUser){
                    return res.status(401).json({message: "User Not Found"});
                }
                else{
                    console.log("User Authenticated")
                    req.rootUser = rootUser;
                    req.token = token;
                    req.UserID = rootUser._id;
                }
                next();
            
            })
            .catch((e) => {throw Error(e)})
    }
    catch(err){
        console.log(err)
        return res.status(401).json({message: "Invalid Token"});
    }
}

module.exports = authenticate;