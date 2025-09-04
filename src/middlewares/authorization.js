const jwt = require("jsonwebtoken");
require('dotenv').config();


const authMiddleware = (req,res,next) => {
    try{
        const authHeader = req.headers['authorization'];

        if(!authHeader){
            return res.status(401).json({messsage : "No token provided."});
        }

        const token = authHeader.split(" ")[1]; // Bearer <token>
        if(!token){
            return res.status(401).json({messsage : "Invalid token format."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }catch(err){
        console.error("❌ Auth error:", err.message);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = authMiddleware;