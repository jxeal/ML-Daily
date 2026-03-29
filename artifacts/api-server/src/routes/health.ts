import { Router, type IRouter, type Response } from "express"; // Add Response here
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res: Response) => { // Type 'res' here
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;