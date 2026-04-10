# AI-Assisted Job Application Tracker

A full-stack (MERN) web application for tracking job applications with an AI-powered job description parser and resume suggestion generator.

## Features
- **Kanban Board**: Track your applications across different stages (Applied, Phone Screen, Interview, Offer, Rejected) using a drag-and-drop Kanaban UI.
- **AI Job Description Parser**: Paste a job description and AI automatically extracts the company, role, skills, and more.
- **AI Resume Suggestions**: Generates 3-5 tailored resume bullet points customized for the job description to help you apply.
- **Secure Authentication**: JWT-based authentication ensures all application data is protected and private to each user.
- **Dark Mode UI**: A premium, visually distinct dark theme built utilizing TailwindCSS.

## Tech Stack
- **Frontend**: Vite, React (TypeScript), Tailwind CSS, React Router, `@hello-pangea/dnd`, Axios.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT Auth.
- **AI**: OpenAI API via standard GPT-3.5-turbo models.

## How to Run Locally

### 1. Requirements
- Node.js (v18+)
- MongoDB (A local instance or a MongoDB Atlas URI)
- OpenAI API Key

### 2. Environment Setup
Make sure to create `.env` files in both the `frontend` and `backend` directories.

**Backend (`backend/.env`):**
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_cluster_url
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
\`\`\`

**Frontend (`frontend/.env`):**
\`\`\`env
VITE_API_BASE_URL=your_vite_api_url
\`\`\`

### 3. Start the Application

**Run Terminal 1 (Backend):**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*(Make sure to add `"dev": "nodemon src/index.ts"` to your `package.json` scripts if not preset!)*

**Run Terminal 2 (Frontend):**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 4. Access the App
Navigate to `http://localhost:5173` to register an account and start tracking your job applications.

### 5. Sample JD to run the AI features
#### Copy and paste the following text into the Job Description field and click Generate Insights button to see the AI features in action

Company: Vercel
Role: Senior Frontend Engineer (React/Next.js)

About Us
Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. We enable teams to iterate quickly and develop, preview, and ship delightful user experiences.

The Role
We are looking for a Senior Frontend Engineer to join our core product team. You will be building modern, high-performance user interfaces that thousands of developers rely on daily.

Requirements:
- 5+ years of experience with React, TypeScript, and modern CSS frameworks like Tailwind.
- Deep understanding of Next.js, App Router, and server-side rendering (SSR).
- Strong experience building complex, interactive interfaces (e.g., drag-and-drop, fluid animations).
- Solid grasp of web performance optimization and Core Web Vitals.
- Ability to write clean, maintainable, and well-tested code.

Nice to Have:
- Experience with Framer Motion or complex data visualization.
- Previous meaningful open-source contributions.

Location: Remote (US)
Compensation: $150,000 - $190,000 + Equity
