const Service = require("../service")
const { User } = require("../../lib/sequelize")
const bcrypt = require("bcrypt")
const { generateToken } = require("../../lib/jwt")
const { Op } = require("sequelize")

class AuthService extends Service {
    static loginUser = async (req, res) => {
        try {
            const { username, password } = req.body;
      
            const findUser = await User.findOne({
              where: {
                username,
              },
            });
      
            if (!findUser) {
              return this.handleClientError(res, {
                  message: "Wrong username or password"
              });
            }
      
            const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);
      
            if (!isPasswordCorrect) {
              return this.handleClientError(res, {
                  message: "Wrong username or password"
              });
            }
      
            delete findUser.dataValues.password;
      
            const token = generateToken({
              id: findUser.id,
              role: findUser.role,
            });

            return this.handleSuccess(res, {
                message: "Logged in user",
                data: {
                    user: findUser,
                    token
                }
            })

          } catch (err) {
            return this.handleServerError(res, err);
          }
    }
}

module.exports = AuthService