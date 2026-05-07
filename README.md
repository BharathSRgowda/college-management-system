# An Interactive Web-Based College Management System Using MERN Stack

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that provides a comprehensive platform for managing college operations with role-based access for Admins, Teachers, and Students.

## 🔗 Live Demo

- **Frontend:** https://collegemanagementsystemusingmernstack.netlify.app
- **Backend API:** https://college-management-system-h9or.onrender.com

## 👤 Login Credentials

| Role    | Email / ID         | Password   |
|---------|--------------------|------------|
| Admin   | admin@college.com  | Admin@123  |
| Teacher | (teacher email)    | (password) |
| Student | (roll number)      | (password) |

## ✨ Features

- **Multi-Role Authentication** — Admin, Teacher, Student dashboards
- **Admin Dashboard** — Live stats, charts, recent activity
- **Assignment Management** — Admin/Teacher can post, Students can view
- **Attendance Tracking** — Per subject, with percentage progress bars
- **Exam Marks Management** — Enter and update marks per subject
- **Notice Board** — Admin posts notices visible to all roles
- **Panel Switcher** — Admin can preview Teacher/Student panels without logging out
- **Responsive UI** — Built with Material UI

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Redux Toolkit, MUI      |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas                     |
| Hosting   | Netlify (frontend), Render (backend) |

## 🚀 Run Locally

```bash
# Backend
cd college_management_system/backend
npm install
npm start

# Frontend
cd college_management_system/frontend
npm install
npm start
```
