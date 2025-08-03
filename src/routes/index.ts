import { usersRoutes } from "./users-routes"
import { Router } from "express"
import { sessionsRoutes } from "./sessions-routes"
import { teamsRoutes } from "./teams-routes"
import { ensureAuthenticated } from "@/middlewares/ensure-autheticated"

const routes = Router()

// Rotas públicas
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)

// Rotas privadas
routes.use(ensureAuthenticated)
routes.use("/teams", teamsRoutes)


export { routes }