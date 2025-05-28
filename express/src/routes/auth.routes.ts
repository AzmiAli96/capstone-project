import { Router } from "express";
import { test } from "../controller/auth.controller";

const authRouter = Router()

authRouter.get("/", test)

export default authRouter