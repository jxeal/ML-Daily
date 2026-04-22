
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

/**
 * Calculates total completed lessons across all categories based on progress strings.
 * Also handles legacy UUID entries by counting them as 1 unique lesson each if they don't match a category.
 */
export function getCompletedCount(completedLessons: string[]): number {
  let total = 0;
  const categoriesProcessed = new Set<string>();

  completedLessons.forEach(entry => {
    if (entry.includes(':')) {
      const parts = entry.split(':');
      if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
        // "1:2" means lessons 0, 1, 2 are done = 3 lessons
        total += parseInt(parts[1], 10) + 1;
        categoriesProcessed.add(parts[0]);
      }
    } else {
      // Legacy UUID or non-formatted entry
      // Only count if it's explicitly a lesson ID (we assume any non-colon string is a UUID)
      total += 1;
    }
  });

  return total;
}

/**
 * Calculates completed lessons for a specific category.
 */
export function getCategoryCompletedCount(category: string, completedLessons: string[]): number {
  const entry = completedLessons.find(e => e.startsWith(`${category}:`));
  if (entry) {
    const parts = entry.split(':');
    if (parts.length === 2) {
      return parseInt(parts[1], 10) + 1;
    }
  }
  
  // Also check if any legacy UUIDs belong to this category (though we don't know the lesson -> category mapping here easily)
  // For simplicity, we rely on the formatted strings which are now the standard.
  return 0;
}
