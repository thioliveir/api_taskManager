import { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class TeamsController {
    async create(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(1, "Nome do Team é obrigatória"),
            description: z.string().optional()
        })

        const { name, description} = bodySchema.parse(req.body)

        const team = await prisma.teams.create({
            data: {
                name,
                description
            }
        })

        res.status(201).json()
    }

    async index(req: Request, res: Response) {
        const teams = await prisma.teams.findMany({
            orderBy: {
                createAt: "desc"
            }
        })

        res.status(200).json(teams)
    }

    async update(req: Request, res: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(1, "Nome do Team é obrigatória").optional(),
            description: z.string().optional()
        })

        const { name, description } = bodySchema.parse(req.body)
        const { id } = req.params

        if(!id) {
            throw new AppError("ID do Team é obrigatório", 400)
        }

        if(!name && !description) {
            throw new AppError("Pelo menos um campo deve ser atualizado", 400)
        }

        const dateTeamsUpdated: { name?: string, description?: string, updatedAt: Date } = { updatedAt: new Date() }
        if (name) dateTeamsUpdated.name = name
        if (description) dateTeamsUpdated.description = description

        const team = await prisma.teams.update({
            where: { id },
            data: dateTeamsUpdated
        })

        res.json()
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        const team = await prisma.teams.findUnique({ where: { id } })

        if(!team) {
            throw new AppError("Team não encontrado", 404)
        }

        await prisma.teams.delete({ where: { id } })

        res.status(204).send()
    }
}

export { TeamsController }