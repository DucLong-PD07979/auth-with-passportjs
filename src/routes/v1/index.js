import express from "express";
import auth from "./authRouter";
import user from "./userRouter";

const Routes = express.Router();
Routes.use("/v1", auth);
Routes.use("/v1", user);


export default Routes;
