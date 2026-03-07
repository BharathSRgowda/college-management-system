# College Management System - Deployment Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free) - https://vercel.com
- Render account (free) - https://render.com

---

## Part 1: Push Code to GitHub

### Step 1: Create GitHub Repository
1. Go to https://github.com
2. Click "New Repository"
3. Name: `college-management-system`
4. Make it **Private** (recommended for security)
5. Click "Create Repository"

### Step 2: Push Your Code
Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit - College Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/college-management-system.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username**

---

## Part 2: Deploy Backend on Render

### Step 1: Sign Up on Render
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (easiest)

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `college-management-system`
4. Configure:
   - **Name**: `college-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `MERN-School-Management-System-main/backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```
PORT=5000
MONGO_URL=mongodb+srv://Admin:Bharath2005@admin.zzhvxra.mongodb.net/smsproject?retryWrites=true&w=majority
SECRET_KEY=secret123key
ADMIN_EMAIL=admin@college.com
ADMIN_PASSWORD=Admin@123
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Copy your backend URL (e.g., `https://college-backend.onrender.com`)

---

## Part 3: Deploy Frontend on Vercel

### Step 1: Update Frontend Environment
Before deploying, we need to update the backend URL in frontend.

Your backend URL from Render: `https://college-backend.onrender.com`

### Step 2: Sign Up on Vercel
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub (easiest)

### Step 3: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Select `college-management-system`
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `MERN-School-Management-System-main/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 4: Add Environment Variable
Click "Environment Variables":

```
REACT_APP_BASE_URL=https://college-backend.onrender.com
```

**Replace with YOUR actual Render backend URL**

### Step 5: Deploy
1. Click "Deploy"
2. Wait 3-5 minutes
3. Your site will be live at: `https://your-project.vercel.app`

---

## Part 4: Update Backend CORS (Important!)

After getting your Vercel URL, you need to update backend to allow requests from frontend.

Your Vercel URL: `https://your-project.vercel.app`

Update `backend/index.js` CORS configuration to include your Vercel URL, then push to GitHub. Render will auto-redeploy.

---

## Part 5: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Try to login with:
   - Email: `admin@college.com`
   - Password: `Admin@123`
3. Test creating classes, students, etc.

---

## Troubleshooting

### Backend Issues:
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend Issues:
- Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
- Verify REACT_APP_BASE_URL is correct
- Check browser console for errors (F12)

### CORS Errors:
- Update backend CORS to include your Vercel URL
- Restart backend service on Render

---

## Important Notes

### Free Tier Limitations:
- **Render**: Backend may sleep after 15 min of inactivity (takes 30s to wake up)
- **Vercel**: Frontend is always fast and available
- **MongoDB Atlas**: 512MB storage limit

### Security:
- Change default admin password after first login
- Keep `.env` files secure
- Never commit sensitive data to GitHub

### Custom Domain (Optional):
- Vercel: Settings → Domains → Add your domain
- Render: Settings → Custom Domain → Add your domain

---

## Your Deployed URLs

After deployment, save these:

- **Frontend**: https://your-project.vercel.app
- **Backend**: https://college-backend.onrender.com
- **Admin Login**: admin@college.com / Admin@123

---

## Updating Your App

To update after making changes:

```bash
git add .
git commit -m "Your update message"
git push
```

Both Vercel and Render will automatically redeploy!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/

---

**Congratulations! Your College Management System is now live! 🎉**
