import { AppError } from "@/utils/AppError"

const secret = process.env.JWT_SECRET;
if(!secret) {
    throw new AppError("JWT secret deve ser definido", 500)
}

export const authConfig = {
    jwt: {
        secret: secret,
        expiresIn: "1d",
    }
}