const res = require("express/lib/response")
const { verifyToken } = require("../lib/jwt")


const authorizedLoggedInUser = (req, res, next) => {
    try {
        const token = req.headers.authorization

        const verifiedToken = verifyToken(token)
        req.token = verifiedToken

        next()
    } catch (err) {
        console.log(err)

        if (err.message === "jwt expired") {
            return res.status(419).json({
                message: "Token expired"
            })
        }

        return res.status(401).json({
            message: err.message
        })
    }
}

const authorizeUserWithRole = (roles = []) => {
   return (req, res, next) => {

    try {
        if (!roles.length) return next()

        const userRole = req.token.role

        if (roles.includes(userRole)) return next()

        throw new Error("User does not have enough permission levels")
        
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: err.message || "User unauthorized"
        })
    }
   }
}

module.exports = { 
    authorizedLoggedInUser,
    authorizeUserWithRole
}