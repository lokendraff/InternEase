<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=200&section=header&text=InternEase%20🚀&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=ffffff" />

### 🌟 The Next-Gen AI-Powered Career Ecosystem 🌟

[![Made with Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge\&logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb)](https://mongodb.com)
[![Powered by Gemini AI](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-8E75B2?style=for-the-badge\&logo=googlebard)](https://deepmind.google/technologies/gemini/)
[![Realtime Supabase](https://img.shields.io/badge/Realtime-Supabase-3ECF8E?style=for-the-badge\&logo=supabase)](https://supabase.com)

</div>

---

## ⚡ Overview

**InternEase** isn't just another job portal; it's a fully automated, gamified, and AI-driven career acceleration platform. Built with a robust MERN stack architecture, it bridges the gap between ambitious students and top-tier organizers.

Whether it's getting your resume scored by AI, taking a live AI mock interview, or tracking your global LeetCode ranking, InternEase handles it all in real-time.

---

## 🔥 Futuristic Features

* 🧠 **Gemini AI Resume Analyzer:** ATS scoring + JD-based feedback
* 🎙️ **AI Mock Interview Engine:** Dynamic questions + real-time evaluation
* ⚡ **Real-time Kanban Board:** Instant UI updates via Supabase
* 🎮 **Gamification Engine:** XP, badges (`Rising Star 🌟`, `Pro Applicant 🔥`)
* 📊 **Live Coding Profiles:** LeetCode + Codeforces integration
* 🌍 **Super-App Job Fetcher:** RapidAPI (JSearch) fallback engine
* 🔐 **Security:** RBAC + JWT + OTP Email Verification

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas + Mongoose
* **Auth:** JWT + Nodemailer (OTP)
* **Realtime:** Supabase
* **AI:** Gemini 2.5 Flash
* **APIs:** JSearch, LeetCode API, Codeforces API

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/InternEase-Backend.git
cd InternEase-Backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key

EMAIL_USER=your_gmail_address
EMAIL_PASS=your_16_digit_app_password

GEMINI_API_KEY=your_google_studio_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

RAPIDAPI_KEY=your_jsearch_rapidapi_key
```

### 4. Run the Server

```bash
npm run dev
```

Server runs on:
`http://localhost:5000`

---

## 📡 API Routes

| Module | Method | Endpoint                     | Access    | Description        |
| ------ | ------ | ---------------------------- | --------- | ------------------ |
| Auth   | POST   | /api/auth/register           | Public    | OTP Registration   |
| Auth   | POST   | /api/auth/verify-otp         | Public    | Verify OTP + JWT   |
| User   | GET    | /api/users/profile           | Student   | Profile + LeetCode |
| Jobs   | GET    | /api/opportunities/live      | Public    | External Jobs      |
| AI     | POST   | /api/interviews/evaluate     | Student   | AI Evaluation      |
| Kanban | PATCH  | /api/applications/:id/status | Organizer | Realtime Update    |

---

<div align="center">
  <i>"I build systems that build careers."</i>  
  <br><br>
  <b>Developed with 💻 and ☕ by InternEase Team</b>
</div>
