import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { RoleUser } from "@prisma/client"
import { z } from "zod"
import { hash } from "bcrypt"
import { AppError } from "@/utils/AppError"

class UsersController {
    async create(req: Request, res: Response) {

        const bodySchema = z.object({
            name: z.string().trim().min(1, "Nome é obrigatório"),
            email: z.email().trim().min(1, "Email é obrigatório").toLowerCase(),
            password: z.string().trim().min(6, "Senha deve ter pelo menos 6 caracteres"),
            role: z.enum([RoleUser.ADMIN, RoleUser.MEMBER]).default(RoleUser.MEMBER)
        })

        const { name, email, password, role } = bodySchema.parse(req.body)

        const userWhithSameEmail = await prisma.users.findFirst({ where: { email }})

        if(userWhithSameEmail) {
            throw new AppError("Ja existe um usuário com este e-mail")
        }

        const hashedPassword = await hash(password, 8)

        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        })

        res.status(201).json()
    }
}

export { UsersController}