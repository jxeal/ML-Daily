import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function checkBadges(stats: { streak: number; xp: number; completed_lessons: string[] }) {
  const badges: string[] = [];
  
  if (stats.completed_lessons.length >= 1) badges.push("First Lesson");
  if (stats.completed_lessons.length >= 5) badges.push("ML Novice");
  if (stats.completed_lessons.length >= 10) badges.push("ML Scholar");
  
  if (stats.streak >= 3) badges.push("3-Day Streak");
  if (stats.streak >= 7) badges.push("Streak Master");
  
  if (stats.xp >= 100) badges.push("XP Starter");
  if (stats.xp >= 500) badges.push("XP Collector");
  if (stats.xp >= 1000) badges.push("ML Master");
  
  return badges;
}
