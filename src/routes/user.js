const UserService = require("../services/user")

const router = require("express").Router()
const DAO = require("../lib/dao")
const { User, Post } = require("../lib/sequelize")

router.get("/", async (req, res) => {
    try {
        const userDAO = new DAO(User)
    
        const findUsers = await userDAO.findAndCountAll(req.query)
    
        return res.status(200).json({
            message: "Find users",
            result: findUsers
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        })
    }


    // try {
    //     const serviceResult = await UserService.getAllUsers()

    //     if (!serviceResult.success) throw serviceResult

    //     return res.status(serviceResult.statusCode || 200).json({
    //         message: serviceResult.message,
    //         result: serviceResult.data
    //     })
    // } catch (err) {
    //     return res.status(err.statusCode || 500).json({
    //         message: err.message
    //     }) 
})

module.exports = router