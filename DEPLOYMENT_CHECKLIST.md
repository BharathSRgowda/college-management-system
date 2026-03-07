# 📋 Deployment Checklist

Print this and check off as you go!

---

## Pre-Deployment Checklist

- [ ] MongoDB Atlas is working (test locally first)
- [ ] Admin login works locally (admin@college.com / Admin@123)
- [ ] Can create classes, students, subjects locally
- [ ] Have GitHub account
- [ ] Have Render account (or will create)
- [ ] Have Vercel account (or will create)

---

## GitHub Setup

- [ ] Code pushed to GitHub repository
- [ ] Repository is Private (recommended)
- [ ] Repository name: `college-management-system`

---

## Backend Deployment (Render)

- [ ] Signed up on Render.com
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set Root Directory: `MERN-School-Management-System-main/backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `node index.js`
- [ ] Added all 5 environment variables:
  - [ ] PORT
  - [ ] MONGO_URL
  - [ ] SECRET_KEY
  - [ ] ADMIN_EMAIL
  - [ ] ADMIN_PASSWORD
- [ ] Clicked "Create Web Service"
- [ ] Deployment successful (green checkmark)
- [ ] Copied backend URL: `_______________________________`

---

## Frontend Deployment (Vercel)

- [ ] Signed up on Vercel.com
- [ ] Imported GitHub repository
- [ ] Set Root Directory: `MERN-School-Management-System-main/frontend`
- [ ] Set Framework: Create React App
- [ ] Added environment variable:
  - [ ] REACT_APP_BASE_URL = (your Render backend URL + /api)
- [ ] Clicked "Deploy"
- [ ] Deployment successful
- [ ] Copied frontend URL: `_______________________________`

---

## MongoDB Atlas Configuration

- [ ] Logged into MongoDB Atlas
- [ ] Network Access → IP Whitelist
- [ ] Added IP: `0.0.0.0/0` (allow from anywhere)
- [ ] Saved changes

---

## Testing

- [ ] Opened frontend URL in browser
- [ ] Page loads without errors
- [ ] Login page appears
- [ ] Logged in with admin@college.com / Admin@123
- [ ] Dashboard loads
- [ ] Can create a class
- [ ] Can add a subject
- [ ] Can add a student
- [ ] Can view students list
- [ ] Can create a notice
- [ ] Tested on mobile phone
- [ ] Tested on different browser

---

## Post-Deployment

- [ ] Changed admin password (recommended)
- [ ] Saved deployment URLs in safe place
- [ ] Shared URL with team/college
- [ ] Bookmarked admin panel
- [ ] Read DEPLOYMENT_GUIDE.md for troubleshooting

---

## Your Deployment URLs

```
Backend:  https://________________________________.onrender.com
Frontend: https://________________________________.vercel.app

Admin Credentials:
Email:    admin@college.com
Password: Admin@123 (change this after first login!)
```

---

## Troubleshooting Checklist

If something doesn't work:

- [ ] Checked Render logs for backend errors
- [ ] Checked Vercel logs for frontend errors
- [ ] Verified REACT_APP_BASE_URL is correct
- [ ] Verified MongoDB allows 0.0.0.0/0
- [ ] Waited 30 seconds for backend to wake up
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Tried in incognito/private window
- [ ] Checked browser console (F12) for errors

---

## Success! 🎉

- [ ] System is live and working
- [ ] Shared with college administration
- [ ] Students can access from anywhere
- [ ] Teachers can login and use
- [ ] Mobile access works

---

**Congratulations! Your College Management System is deployed!**

Date Deployed: _______________
Deployed By: _______________
