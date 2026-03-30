# ML Daily Content Generation Prompts

Use these prompts with an AI (like ChatGPT or Gemini) to generate SQL commands for adding new content to your Supabase database.

---

## 1. Add a New Lesson
**Prompt:**
> Generate a PostgreSQL `INSERT` command for the `lessons` table. 
> **Topic:** [INSERT TOPIC HERE]
> **Category:** [Choose from: Statistics, Supervised Learning, Unsupervised Learning, Deep Learning]
> **Difficulty:** [Choose from: Beginner, Intermediate, Advanced]
> 
> **Table Schema:**
> - `id`: TEXT (slug format, e.g., 'neural-networks')
> - `title`: TEXT
> - `category`: TEXT
> - `difficulty`: TEXT
> - `short_description`: TEXT (1-2 sentences)
> - `content`: TEXT (Detailed educational content with markdown-style formatting)
> - `examples`: JSONB (Array of strings, e.g., `["Example 1", "Example 2"]`)
> - `quiz`: JSONB (Array of 3 objects: `{"question": string, "options": [{"id": "a", "text": "..."}, ...], "answer": "id"}`)
> - `icon`: TEXT (Single emoji)
> 
> **Output Format:**
> Return ONLY the SQL command starting with `INSERT INTO lessons ...`. Use `::jsonb` for the JSON fields.

---

## 2. Update an Existing Lesson
**Prompt:**
> Generate a PostgreSQL `UPDATE` command for the `lessons` table.
> **Target Lesson ID:** [INSERT SLUG HERE, e.g., 'neural-networks']
> **Change Requested:** [Describe what to add or change, e.g., "Add more info about CNNs"]
> 
> **Output Format:**
> Return ONLY the SQL command starting with `UPDATE lessons SET ... WHERE id = '...';`. Use `::jsonb` for any JSON field updates.

---

## 3. Add a Daily Challenge
**Prompt:**
> Generate a PostgreSQL `INSERT` command for the `daily_challenges` table.
> **Topic:** [INSERT TOPIC HERE]
> **Date:** [YYYY-MM-DD]
> 
> **Table Schema:**
> - `id`: TEXT (format: 'dc-XXX')
> - `date`: TEXT (YYYY-MM-DD)
> - `question`: TEXT
> - `options`: JSONB (Array of 4 objects: `{"id": "a", "text": "..."}`)
> - `answer`: TEXT (the id of the correct option)
> - `explanation`: TEXT
> - `xp_reward`: INTEGER (usually 50)
> 
> **Output Format:**
> Return ONLY the SQL command starting with `INSERT INTO daily_challenges ...`. Use `::jsonb` for the JSON fields.

---

## 4. Add a New Category
**Prompt:**
> Generate a PostgreSQL `INSERT` command for the `categories` table.
> **Topic:** [INSERT CATEGORY NAME]
> 
> **Table Schema:**
> - `id`: TEXT (slug format)
> - `name`: TEXT
> - `description`: TEXT
> - `icon`: TEXT (Single emoji)
> - `color`: TEXT (Hex code)
> - `lesson_count`: INTEGER (Initial count, e.g., 0 or 1)
> 
> **Output Format:**
> Return ONLY the SQL command starting with `INSERT INTO categories ...`.
