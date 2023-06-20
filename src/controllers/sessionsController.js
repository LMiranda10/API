const knex  = require("../Database/knex");
const { compare } = require("bcryptjs");
const Apperror = require("../utils/Apperror");
const { sign } = require("jsonwebtoken")
const authConfig = require("../Configs/auth")

class SessionsController {
    async create(request, response){
        const { email, password } = request.body;

        const user = await knex("users").where({ email }).first();

        if(!user) {
            throw new Apperror("Email e/ou senha incorretos", 401)
        }

        const passwordMatched = await compare (
            password,
            user.password
        );

        if(!passwordMatched) {
            throw new Apperror("Email e/ou senha incorretos", 401)
        }

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })
    
        return response.json({user, token});
    }
}

module.exports = SessionsController;