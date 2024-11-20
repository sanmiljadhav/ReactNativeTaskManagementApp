const jwt = require('jsonwebtoken');
require('dotenv').config();


const AuthHelper = module.exports;

const SECRET_KEY = process.env.SECRET_KEY;

AuthHelper.createJWTToken = (payload) => {
    try {
        const token = jwt.sign(
            payload, 
            SECRET_KEY, 
        )
        return token;
    } catch (error) {
       throw error
    }
}
AuthHelper.validateToken = (req, res,  next) =>{
    let token = req.headers['x-auth-token']; 
    if(!token){
        return res.status(403).send("No Auth Token"); 
    }
    try {
       const verifyToken = jwt.verify(token, SECRET_KEY)
        // Manually check for token expiration

        if(!verifyToken){
            return res.status(401).json({
                message: 'Invalid token',
                success:false
            })

        }
        
       req.user = verifyToken.user; 
       next();
    } catch (error) {
        return res.status(401).send({ message: "Error", error: error.message })
    }
}