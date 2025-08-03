import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError"

function verifyUserAuthorization(role: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user || !role.includes(req.user.role)) {
            throw new AppError("Usuário não autorizado", 401)
        }

        return next()
    }
}

export { verifyUserAuthorization }