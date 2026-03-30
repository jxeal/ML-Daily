# ML Daily 🧠🌱

Master Machine Learning one day at a time with bite-sized lessons and daily challenges.

ML Daily is a mobile-first educational platform designed to make learning Machine Learning consistent, engaging, and accessible. Built with React, Vite, and Supabase, it features a gamified experience with streaks, XP, and badges.

## 🚀 Features

- **Bite-sized Lessons:** Short, focused lessons on core ML concepts (Overfitting, Gradient Descent, Neural Networks, etc.).
- **Daily Challenges:** Test your knowledge every day with a fresh question and earn XP rewards.
- **Categorized Learning:** Explore ML topics by category (Beginner, Supervised Learning, Deep Learning, etc.).
- **Gamified Progress:** Track your learning streak, earn XP, and unlock badges as you progress.
- **Knowledge Checks:** Interactive quizzes at the end of each lesson to reinforce learning.
- **Responsive Design:** A sleek, dark-mode interface optimized for mobile and desktop.

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Framer Motion (animations)
- **State Management:** Zustand (with persistence)
- **Data Fetching:** TanStack Query (React Query)
- **Backend:** Supabase (Database & Auth)
- **Icons:** Lucide React

## 📦 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- A Supabase account and project

### 2. Database Setup

Run the migration script (found in your Supabase SQL Editor or provided in the repository) to create the necessary tables and seed initial data:

- `categories`
- `lessons`
- `daily_challenges`

### 3. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation

```bash
npm install
```

### 5. Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 📝 Content Generation

To add new lessons or challenges to your database, refer to the `scripts.md` file. It contains pre-formatted prompts that you can use with AI to generate SQL `INSERT` commands that match the database schema perfectly.

## 📄 License

MIT
