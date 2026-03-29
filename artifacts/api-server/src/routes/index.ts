import { Router, type IRouter } from "express";
import healthRouter from "./health.js"; // Added .js
import lessonsRouter from "./lessons.js"; // Added .js

const router: IRouter = Router();

router.use(healthRouter);
router.use(lessonsRouter);

export default router;
