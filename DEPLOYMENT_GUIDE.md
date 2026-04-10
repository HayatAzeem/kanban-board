# 🚀 Full Stack Deployment Guide (MERN)

This guide provides a step-by-step process for taking your local JobTracker AI project and securely deploying it to production using **Render** (for the backend), **Vercel** (for the frontend), and **MongoDB Atlas** (for the cloud database).

---

## Phase 1: Cloud Database Setup (MongoDB Atlas)
Currently, you are running MongoDB locally. You need a free cloud database to connect to your live servers.

1. **Create an Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Build a Cluster:** Click **Build a Database** and select the **FREE Shared** tier (M0 cluster).
3. **Database Security:** 
   - Choose a Username and Password. **Save this password!**
   - In **Network Access**, add `0.0.0.0/0` (Allow access from anywhere). This is required so your backend server can securely connect to it from a dynamic IP address.
4. **Get your Connection String:**
   - Click **Connect** > **Drivers** > **Node.js**.
   - Copy the connection string. It will look something like this:
     `mongodb+srv://<username>:<password>@cluster0.mongodb.net/JobTracker?retryWrites=true&w=majority`
   - *Replace `<password>` with the exact password you just made.*

---

## Phase 2: Deploy Backend (Render)
We will deploy the Node/Express backend to **Render**, which is excellent for free backend Node applications.

1. **Sign in to Render:** Go to [Render.com](https://render.com/) and link it with your GitHub account.
2. **New Web Service:**
   - Click **New +** > **Web Service**.
   - Select your `kanban-board` repository.
3. **Configuration:**
   - **Name:** `jobtracker-backend`
   - **Root Directory:** `backend` *(Crucial! Because your code is inside the backend folder)*
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start` 
     *(Make sure your backend `package.json` has `"start": "node dist/index.js"` and `"build": "tsc"`)*
4. **Add Environment Variables:**
   Scroll down to Advanced > Environment Variables and click **Add Environment Variable**. Add all your secrets here:
   - `MONGO_URI` -> Paste the MongoDB Atlas connection string from Phase 1.
   - `JWT_SECRET` -> Put a random, very long text string (e.g., `SuperSecretSecureKey123!`).
   - `GEMINI_API_KEY` -> Paste your active Google Gemini API Key.
5. **Deploy!**
   - Click **Create Web Service**. 
   - Render will build and deploy your app. Once it finishes, copy the live URL (e.g. `https://jobtracker-backend.onrender.com`).

---

## Phase 3: Deploy Frontend (Vercel)
Now that your Backend API is alive on the internet, let's deploy the React Vite Frontend so the world can see it.

1. **Sign in to Vercel:** Go to [Vercel.com](https://vercel.com/) and log in with GitHub.
2. **Import Project:**
   - Click **Add New...** > **Project**.
   - Import your `kanban-board` repository.
3. **Configuration:**
   - **Project Name:** `jobtracker`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click "Edit", select `frontend`, and click Save.
4. **Environment Variables:**
   You must tell your frontend where to find your live backend!
   - Click the "Environment Variables" dropdown.
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://jobtracker-backend.onrender.com/api` *(Make sure you replace the URL with your exact Render backend URL, and ensure `/api` is at the end!)*
5. **Deploy!**
   - Click **Deploy**. Vercel will install dependencies, build the React app, and assign you a permanent live `.vercel.app` domain.

---

## 🎯 Verification List

1. **Test Registration**: Open your new Vercel URL, click the Register tab, and create an account.
2. **Test Gemini**: Go to your dashboard, hit "New Application", paste a sample Job Description, and click the Insight Generation button to ensure your Gemini API is firing properly from your Render server!
3. **Done!**

You are now fully live on the internet! 🚀
