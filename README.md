# College Management System (CMS)

## Overview
The College Management System (CMS) is a full-stack web application designed to manage academic and administrative data in a college environment.  
It handles records related to students, faculty, branches, subjects, exams, and notices.  

---

## Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Redux  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  

---

## Features

### Authentication
- Role-based login (Admin, Student, Faculty)

### Academic Management
- Branch management  
- Subject management  
- Faculty management  
- Student management  

### Operations
- Exam management  
- Notice board  
- Profile and password management  

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your_jwt_secret
NODEMAILER_EMAIL=your_nodemailer_email
NODEMAILER_PASS=your_nodemailer_password
```
### Frontend (`frontend/.env`)
```
REACT_APP_APILINK=http://localhost:4000/api
```
---

## Setup Instructions

### 1. Clone the repository
```
git clone <repository-url>
cd student_management
```

### 2. Backend setup
```
cd backend
npm install
npm run dev
```
The backend server will start on **http://localhost:4000**
### 3. Frontend setup
```
cd ../frontend
npm install
npm start
```
The frontend application will run on **http://localhost:3000**

---
