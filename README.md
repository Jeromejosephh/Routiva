# Routiva

Routiva is a habit-tracking web app built with **Next.js (App Router)**, **TypeScript**, **Tailwind**, **Prisma**, **Neon (Postgres)**, and **NextAuth (Email via Resend)**.  
It helps users create habits, check them off daily, and track progress with streaks and charts.

---

## 🚀 Tech Stack
- [Next.js](https://nextjs.org) (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Prisma ORM
- Neon (Postgres DB)
- NextAuth (Email login via Resend)
- Vercel (Deployment)

---

## 🔧 Getting Started

### 1. Clone & Install
git clone <your-repo-url>  
cd routiva  
npm install  

### 2. Environment Variables
Create a `.env` file at the project root (or copy `.env.example`):

# .env.example  
DATABASE_URL=postgresql://...  
NEXTAUTH_SECRET=your-secret  
NEXTAUTH_URL=http://localhost:3000  
RESEND_API_KEY=your-resend-key  
EMAIL_FROM="Routiva <login@yourdomain.com>"  

### 3. Database Setup
npx prisma generate  
npx prisma migrate dev  

### 4. Run Dev Server
pnpm dev  

Visit [http://localhost:3000](http://localhost:3000).  

---

## 🚢 Deployment
1. Push to GitHub/GitLab  
2. Connect repo to [Vercel](https://vercel.com/)  
3. Add the same environment variables in the Vercel dashboard  

(Optional) Add a custom domain and set:  
NEXTAUTH_URL=https://yourdomain.com  

Deploy 🎉
