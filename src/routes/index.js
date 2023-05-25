import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import UserController from "../controllers/user";
import CandidateController from "../controllers/candidates";

const routes = new Router();

// ---- unauthenticated routes -------
routes.post("/login", UserController.login);
routes.post("/forgot-password", UserController.forgotPassword);
routes.post("/reset-password", UserController.resetPassword);

// ---- authenticated routes   -------
routes.use(authMiddleware);
routes.get("/user/listusers", UserController.getAll);
routes.post("/user/create", UserController.create);
routes.put("/user/update", UserController.updateUser);

// ---- candidate routes -------
routes.post("/candidates/create", CandidateController.create);
routes.get("/candidates/listcandidates", CandidateController.getAll);
routes.put("/candidates/update", CandidateController.update);
routes.delete("/candidates/delete", CandidateController.delete);

export default routes;
