import { AppError } from "@/utils/AppError"
import { ErrorRequestHandler } from "express"
import { z, ZodError } from "zod"

export const errorHandling: ErrorRequestHandler = (
    error,
    request,
    response,
    next
) => {
    if (error instanceof AppError) {
        response.status(error.statusCode).json({ message: error.message})
        return
    }

    if(error instanceof ZodError) {
        const formattedErrors = z.treeifyError(error)
        response.status(400).json({ message: "validation error", issues: formattedErrors })

        return
    }

    response.status(500).json({ message: error.message })
    return
}