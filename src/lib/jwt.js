const jwt = require("jsonwebtoken")

const JWT_KEY = process.env.JWT_SECRET_KEY

const generateToken = (payload) => {
    const token = jwt.sign(payload, JWT_KEY, {
        expiresIn: "2d"
    })

    return token
}

const verifyToken = (token) => {
    const isVerified = jwt.verify(token, JWT_KEY)

    return isVerified
}

module.exports = {
    generateToken,
    verifyToken
}