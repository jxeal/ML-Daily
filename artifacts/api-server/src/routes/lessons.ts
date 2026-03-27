import { Router, type IRouter } from "express";
import lessonsData from "../data/lessons.json" with { type: "json" };
import categoriesData from "../data/categories.json" with { type: "json" };
import challengesData from "../data/daily-challenges.json" with { type: "json" };

const router: IRouter = Router();

router.get("/lessons", (_req, res) => {
  res.json(lessonsData);
});

router.get("/lessons/:id", (req, res) => {
  const lesson = (lessonsData as Array<{ id: string }>).find(
    (l) => l.id === req.params.id
  );
  if (!lesson) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }
  res.json(lesson);
});

router.get("/categories", (_req, res) => {
  res.json(categoriesData);
});

router.get("/daily-challenge", (_req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const challenge = (challengesData as Array<{ date: string }>).find(
    (c) => c.date === today
  );
  if (!challenge) {
    res.json(challengesData[0]);
    return;
  }
  res.json(challenge);
});

export default router;
