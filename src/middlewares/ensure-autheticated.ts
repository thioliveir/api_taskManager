import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"
import { authConfig } from "@/configs/auth"
import { verify } from "jsonwebtoken"

interface TokenPayLoad {
    role: string
    sub: string
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization

        if(!authHeader){
            throw new AppError("JWT token não fornecido", 401)
        }

        const [, token] = authHeader.split(" ")

        const { role, sub: user_id} = verify(token, authConfig.jwt.secret) as TokenPayLoad

        req.user = {
            id: user_id,
            role,
        }

        return next()

    } catch (error) {
        throw new AppError("JWT token Inválido", 401)
    }
}

export { ensureAuthenticated}