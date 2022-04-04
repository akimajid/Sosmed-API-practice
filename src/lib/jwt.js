const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const JWT_KEY = process.env.JWT_SECRET_KEY

// const encryptToken = (token) => {
//     const cipher = crypto.createCipher("aes-256-gcm", "password")
//     let encrypted = cipher.update(token, "utf-8", "hex")

//     return encrypted += cipher.final("utf-8")
// }

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