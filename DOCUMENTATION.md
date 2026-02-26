# Skill - Documentation

## 🚀 Architecture Overview
Skill is a full-stack Next.js application designed to bridge the gap between academic progress and industry requirements.

### Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, Recharts, Framer Motion, Lucide Icons.
- **Backend**: Next.js API Routes, NextAuth.js (Credentials Provider).
- **Database**: Prisma ORM with SQLite (Local) / Compatible with PostgreSQL (Cloud).
- **Styling**: Vanilla CSS with CSS-in-JS (styled-jsx) and Global Design Tokens.

## 🧠 AI Intelligence Layer
The platform currently simulates AI logic through its data models, which can be extended to real ML models:

1. **Dropout Prediction**: 
   - *Current*: Logic in `seed.js` calculates risk based on `grade` (<60) and `attendance` (<80).
   - *Future*: Integrate a Scikit-learn or TensorFlow model that processes historical behavioral logs.

2. **Skill Gap Analysis**:
   - *Current*: Mapping student proficiencies against static demand levels.
   - *Future*: Connect to LinkedIn or Indeed APIs to pull real-time demand JSON and compare using a Cosine Similarity algorithm.

3. **Learning Recommendations**:
   - *Current*: Hardcoded roadmaps in `SkillRoadmap.tsx`.
   - *Future*: Use an LLM (GPT-4 or Gemini) via OpenAI/Google SDK to generate dynamic roadmaps based on the specific skills a student is missing.

## 👥 User Roles
- **STUDENT**: View personal performance, skill gaps, and learning roadmaps.
- **FACULTY**: View class-level analytics, detect weak learners, and see engagement heatmaps.
- **ADMIN**: System-wide analytics, retention trends, and user management.

## 🛠️ Getting Started
1. `npm install`
2. `npx prisma db push`
3. `node prisma/seed.js`
4. `npm run dev`

## ☁️ Cloud Deployment Instructions
1. **Database**: Use Vercel Postgres or Supabase. Update `DATABASE_URL` in `.env`.
2. **Environment Variables**:
   - `NEXTAUTH_SECRET`: Generate using `openssl rand -base64 32`.
   - `NEXTAUTH_URL`: Your deployment URL (e.g., `https://skillsync-smart-edu.vercel.app`).
3. **Deployment**: Push to GitHub and connect to Vercel/Netlify.
