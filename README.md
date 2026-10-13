# PrepTrack — Placement Preparation Dashboard

PrepTrack is a responsive React application for organizing DSA practice, study tasks, and technical mock quizzes.

## Current frontend features
- Dashboard with study activity chart and progress cards
- DSA question tracker with search, topic/status filters, create, update, and delete
- Study planner with due dates and completion toggles
- Technical MCQ quiz with score review and explanations
- Analytics calculated from saved questions, tasks, and quiz attempts
- Browser persistence with `localStorage`
- Responsive layout for mobile and desktop

## Stack
React, Vite, JavaScript, CSS, Lucide React, Recharts. An optional Express/Mongoose API scaffold is included in `server/`.

## Run the frontend
```bash
npm install
npm run dev
```

## Build for deployment
```bash
npm run build
npm run preview
```

## Deploy frontend
1. Push the project to a GitHub repository.
2. Import the repository into Vercel or Netlify.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy and test the public URL.

## Optional API setup
The `server/` directory contains an Express API for MongoDB-backed questions and tasks. It is separate from the frontend and is not connected to the frontend by default.

1. Create a MongoDB database and obtain a connection string.
2. In `server/`, run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGODB_URI`, `PORT`, and `CLIENT_ORIGIN`.
4. Run `npm run dev`.
5. Test `GET /api/health`.

Deploy the server separately on a Node-compatible host and configure the environment variables there. Do not commit `.env` or expose database credentials.

## Important implementation note
The frontend currently stores question, task, and quiz data in the current browser's `localStorage`. It does not provide user accounts, cross-device synchronization, or authenticated access. The optional backend API is a scaffold and is not yet wired into the frontend. Weekly study hours and the streak displayed on the dashboard are demo values.

## Before publishing
- Test all features in desktop and mobile layouts.
- Replace demo values and personalize the app.
- Add your own GitHub and live-demo links to your resume.
- Only claim backend/database features as completed after connecting and testing them.
