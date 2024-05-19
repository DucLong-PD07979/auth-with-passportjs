import express from "express";
import { getUserWithToken } from "~/controllers/userController";
import { verifyToKen } from "~/middlewares/authMiddleware";

const Routes = express.Router();

Routes.get("/api/user", verifyToKen, getUserWithToken);

export default Routes;
