import { Router } from "express"
import { TeamsController } from "../controllers/teams-controller"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/", verifyUserAuthorization(["ADMIN"]), teamsController.create)
teamsRoutes.get("/", verifyUserAuthorization(["ADMIN"]), teamsController.index)
teamsRoutes.patch("/:id", verifyUserAuthorization(["ADMIN"]), teamsController.update)
teamsRoutes.delete("/:id", verifyUserAuthorization(["ADMIN"]), teamsController.delete)

export { teamsRoutes }