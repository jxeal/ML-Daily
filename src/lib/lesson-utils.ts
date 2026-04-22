
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
  // Format: "categoryID: chapter X"
  // If no entry found, allow only lesson_number 0
  // Allow till chapter_number_found + 1

  const categoryEntry = completedLessons.find(entry => 
    entry.startsWith(`${category}: chapter `)
  );

  if (!categoryEntry) {
    return lessonNumber === 0;
  }

  const match = categoryEntry.match(/chapter (\d+)/);
  if (match) {
    const lastCompletedChapter = parseInt(match[1], 10);
    return lessonNumber <= lastCompletedChapter + 1;
  }

  return lessonNumber === 0;
}

/**
 * Returns a new completed_lessons array with the entry updated for the given lesson.
 */
export function getUpdatedCompletedLessons(
  completedLessons: string[],
  category: string,
  lessonNumber: number
): string[] {
  const categoryPrefix = `${category}: chapter `;
  const existingEntryIndex = completedLessons.findIndex(entry => 
    entry.startsWith(categoryPrefix)
  );

  const newEntry = `${categoryPrefix}${lessonNumber}`;

  if (existingEntryIndex === -1) {
    return [...completedLessons, newEntry];
  }

  const existingEntry = completedLessons[existingEntryIndex];
  const match = existingEntry.match(/chapter (\d+)/);
  if (match) {
    const lastCompletedChapter = parseInt(match[1], 10);
    // Only update if the new lesson number is higher
    if (lessonNumber > lastCompletedChapter) {
      const newCompletedLessons = [...completedLessons];
      newCompletedLessons[existingEntryIndex] = newEntry;
      return newCompletedLessons;
    }
  }

  return completedLessons;
}
