const { User } = require("../../lib/sequelize");
const Service = require("../service");

class UserService extends Service {
    static handleSuccess = ({
        data = undefined,
        message = "Find all users",
        statusCode = 200
    }) => {
        return {
            success: true,
            data,
            message,
            statusCode
        }
    }

    static getAllUsers = async (req) => {
        try {
            const findUsers = await User.findAll({
                ...req.query
            })

            return {
                success: true,
                data: findUsers,
                message: "Find all users",
                statusCode: 200
            }

        } catch (err) {
            return {
                success: false,
                message: "Server error",
                statusCode: 500
            }
        }
    }
}

module.exports = UserService