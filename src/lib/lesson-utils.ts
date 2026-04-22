
/**
 * Checks if a lesson is unlocked based on completion history and login status.
 */
export function isLessonUnlocked(
  lessonNumber: number,
  category: string,
  completedLessons: string[],
  isLoggedIn: boolean
): boolean {
  // 1. Not logged in: Only allow lesson_number 0
  if (!isLoggedIn) {
    return lessonNumber === 0;
  }

  // 2. Logged in:
  // Format: "categoryNameOrID:lessonNumber"
  // If no entry found, allow only lesson_number 0
  // Allow till chapter_number_found + 1

  const categoryEntry = completedLessons.find(entry => 
    entry.startsWith(`${category}:`)
  );

  if (!categoryEntry) {
    return lessonNumber === 0;
  }

  const parts = categoryEntry.split(":");
  if (parts.length === 2) {
    const lastCompletedChapter = parseInt(parts[1], 10);
    return lessonNumber <= lastCompletedChapter + 1;
  }

  return lessonNumber === 0;
}

/**
 * Checks if a lesson is completed based on progress format "category:lessonNumber"
 * or legacy UUID format.
 */
export function isLessonCompleted(
  lessonId: string,
  lessonNumber: number,
  category: string,
  completedLessons: string[]
): boolean {
  // Check legacy UUID format
  if (completedLessons.includes(lessonId)) {
    return true;
  }

  // Check new format "category:lessonNumber"
  const categoryEntry = completedLessons.find(entry => 
    entry.startsWith(`${category}:`)
  );

  if (categoryEntry) {
    const parts = categoryEntry.split(":");
    if (parts.length === 2) {
      const lastCompletedChapter = parseInt(parts[1], 10);
      return lessonNumber <= lastCompletedChapter;
    }
  }

  return false;
}

/**
 * Returns a new completed_lessons array with the entry updated for the given lesson.
 */
export function getUpdatedCompletedLessons(
  completedLessons: string[],
  category: string,
  lessonNumber: number
): string[] {
  const categoryPrefix = `${category}:`;
  const existingEntryIndex = completedLessons.findIndex(entry => 
    entry.startsWith(categoryPrefix)
  );

  const newEntry = `${categoryPrefix}${lessonNumber}`;

  if (existingEntryIndex === -1) {
    return [...completedLessons, newEntry];
  }

  const existingEntry = completedLessons[existingEntryIndex];
  const parts = existingEntry.split(":");
  if (parts.length === 2) {
    const lastCompletedChapter = parseInt(parts[1], 10);
    // Only update if the new lesson number is higher
    if (lessonNumber > lastCompletedChapter) {
      const newCompletedLessons = [...completedLessons];
      newCompletedLessons[existingEntryIndex] = newEntry;
      return newCompletedLessons;
    }
  }

  return completedLessons;
}
