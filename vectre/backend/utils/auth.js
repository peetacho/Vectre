const config = require('../config');
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, config.jwt_secret_token, (error, wallet_address) => {
            if (error) // Invalid token
                return res.status(403).send({
                    success: false,
                    message: "Invalid token"
                })
            req.wallet_address = wallet_address
            next()
        })
    } else { // No token
        return res.status(401).send({
            success: false,
            message: "You are not logged in"
        })
    }
}

module.exports = {
    authenticateToken
}