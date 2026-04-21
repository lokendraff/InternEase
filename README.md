<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=200&section=header&text=InternEase%20🚀&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=ffffff" />

  ### 🌟 The Next-Gen AI-Powered Career Ecosystem 🌟
  
  [![Made with Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
  [![Powered by Gemini AI](https://img.shields.io/badge/AI_Engine-Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlebard)](https://deepmind.google/technologies/gemini/)
  [![Realtime Supabase](https://img.shields.io/badge/Realtime-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
</div>

---

## ⚡ Overview
**InternEase** isn't just another job portal; it's a fully automated, gamified, and AI-driven career acceleration platform. Built with a robust MERN stack architecture, it bridges the gap between ambitious students and top-tier organizers. 

Whether it's getting your resume scored by AI, taking a live AI mock interview, or tracking your global LeetCode ranking, InternEase handles it all in real-time.

---

## 🔥 Futuristic Features (The "Wow" Factor)

* 🧠 **Gemini AI Resume Analyzer:** Automated ATS scoring and line-by-line feedback based on the exact Job Description.
* 🎙️ **AI Mock Interview Engine:** Dynamically generates technical interview questions and evaluates student answers in real-time.
* ⚡ **Real-time Kanban Board:** Supabase-powered instant UI updates when an Organizer drags an application to "Selected".
* 🎮 **Gamification Engine:** Earn XP and unlock badges (`Rising Star 🌟`, `Pro Applicant 🔥`) for active engagement.
* 📊 **Live Coding Profiles:** Direct integration with **LeetCode** and **Codeforces** APIs to showcase real-time problem-solving stats.
* 🌍 **Super-App Job Fetcher:** Fallback engine using RapidAPI (JSearch) to fetch live external internships from LinkedIn & Indeed.
* 🔐 **Fort Knox Security:** Role-Based Access Control (RBAC) + Nodemailer OTP Email Verification + JWT Authentication.

---

## 🛠️ System Architecture & Tech Stack

* **Backend Environment:** Node.js, Express.js
* **Database:** MongoDB Atlas + Mongoose
* **Authentication:** JWT (JSON Web Tokens) + Nodemailer (OTP)
* **Real-time Engine:** Supabase Broadcasting
* **AI Integration:** Google Generative AI SDK (`gemini-2.5-flash`)
* **External APIs:** JSearch (RapidAPI), Alfa LeetCode API, Codeforces Official API

---

## 🚀 Getting Started (Run the Matrix)

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/InternEase-Backend.git](https://github.com/yourusername/InternEase-Backend.git)
cd InternEase-Backend
2. Install dependenciesBashnpm install
3. Environment Variables (.env)Create a .env file in the root directory and add your secret keys:Code snippetPORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key

# Nodemailer Setup
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_16_digit_app_password

# AI & Realtime
GEMINI_API_KEY=your_google_studio_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key

# External Data
RAPIDAPI_KEY=your_jsearch_rapidapi_key
4. Ignite the ServerBashnpm run dev
Server will boot up on http://localhost:5000 with the MongoDB cluster engaged.📡 Core API Routes (Terminal Commands)ConceptEndpointAccessActionAuthPOST /api/auth/registerPublicInitiates OTP-based RegistrationAuthPOST /api/auth/verify-otpPublicVerifies OTP & Issues JWT TokenUserGET /api/users/profileStudentFetches User Data + Live LeetCode StatsJobsGET /api/opportunities/livePublicFetches global internships via RapidAPIAIPOST /api/interviews/evaluateStudentAI grades the mock interviewKanbanPATCH /api/applications/:id/statusOrganizerTriggers Supabase Realtime broadcast<div align="center"><i>"I build systems that build careers."</i><b>Developed with 💻 and ☕ by InternEase team</b></div>