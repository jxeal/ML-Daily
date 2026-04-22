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
> - `id`: UUID (Generate a random UUID)
> - `title`: TEXT
> - `category`: TEXT (The UUID or Name of the category)
> - `difficulty`: TEXT
> - `lesson_number`: INTEGER (Sequence number starting from 0 for 'Introduction')
> - `xp_reward`: INTEGER (Range: 20 for Beginner, 50 for Intermediate, 100 for Advanced)
> - `short_description`: TEXT (1-2 sentences)
> - `content`: TEXT (Detailed educational content in Markdown. Use `![align|Caption](url)` for images where `align` is `left`, `right`, or `center`. Format with bold section titles like **The Core Idea**. Do NOT use `##` or `---`.)
> - `examples`: JSONB (Array of strings)
> - `quiz`: JSONB (Array of objects: `{"question": string, "options": [{"id": "a", "text": "..."}, ...], "answer": "id"}`)
> 
> **Output Format:**
> Return ONLY the SQL command. Use `::jsonb` for JSON fields.

---

## 2. Update an Existing Lesson
**Prompt:**
> Generate a PostgreSQL `UPDATE` command for the `lessons` table.
> **Target Lesson Number & Category:** [e.g., Lesson 1 in Machine Learning]
> **Change Requested:** [Describe change]
> 
> **Output Format:**
> Return ONLY the SQL command.

---

## 3. Add a Daily Challenge
**Prompt:**
> Generate a PostgreSQL `INSERT` command for the `daily_challenges` table.
> **Topic:** [INSERT TOPIC HERE]
> **Date:** [YYYY-MM-DD]
> 
> **Table Schema:**
> - `id`: UUID (generate a random UUID)
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

## 4. Add Weekly Daily Challenges
**Prompt:**
> Generate a PostgreSQL `INSERT` command with multiple values for the `daily_challenges` table.
> **Topic:** [INSERT TOPIC HERE, e.g., "Machine Learning Basics"]
> **Start Date:** [INSERT START DATE HERE, e.g., "2nd April 2026"]
> 
> **Instructions:**
> Create 7 daily challenges for consecutive days starting from the Start Date (e.g., if Start Date is 2nd April 2026, generate challenges for 2nd April to 8th April 2026).
> 
> **Table Schema:**
> - `id`: UUID (generate a random UUID for each row)
> - `date`: TEXT (YYYY-MM-DD format for each consecutive day)
> - `question`: TEXT
> - `options`: JSONB (Array of 4 objects: `{"id": "a", "text": "..."}`)
> - `answer`: TEXT (the id of the correct option)
> - `explanation`: TEXT
> - `xp_reward`: INTEGER (usually 50)
> 
> **Output Format:**
> Return ONLY the SQL command starting with `INSERT INTO daily_challenges ... VALUES ...`. Use `::jsonb` for the JSON fields.

---

## 5. Add a New Category
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
