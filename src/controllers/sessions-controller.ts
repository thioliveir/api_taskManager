import { Request, Response } from "express"
import { AppError } from "@/utils/AppError"
import { prisma } from "@/database/prisma"
import { authConfig } from "@/configs/auth"
import { sign, SignOptions } from "jsonwebtoken"
import { compare } from "bcrypt"
import { z } from "zod"

class SessionsController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            email: z.email({ message: "E-mail inválido" }),
            password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
        })

        const { email, password } = bodySchema.parse(req.body)

        const user = await prisma.users.findFirst({ where: { email }})

        if(!user) {
            throw new AppError("Email ou senha inválidos", 401)
        }

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch) {
            throw new AppError("Email ou senha inválidos", 401)
        }

        const { secret, expiresIn} = authConfig.jwt

        const token = sign({ role: user.role}, secret, {
            subject: user.id,
            expiresIn: expiresIn
        } as SignOptions)

        const { password: _, ...userWithoutPassword } = user


        res.json({ token, user: userWithoutPassword })
    }
}

export { SessionsController }