`README.md`
```md
# Task Management WebApp (MERN Stack)

## Project Overview
This is a full-stack Task Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The application supports user authentication (with Google OAuth and manual email-password login with email OTP verification), task management with CRUD operations, PDF report generation, and user management features accessible to admins.

---

## Features

### Authentication
- Google OAuth 2.0 login
- Manual login with email/password
- Email OTP verification during registration and password reset
- Route protection with JWT and role-based authorization

### Task Management (CRUD)
- Add, view, edit, delete tasks
- Search, filter, and sort tasks
- Assign tasks to active users
- Task status management (Pending, In Progress, Completed)

### User Management (Admin Only)
- Admins can view list of all users
- Edit user roles and active status
- Soft delete (deactivate) users

### PDF Report Generation
- Generate downloadable PDF reports of all tasks

### Frontend Tech
- React.js with React Router for SPA navigation
- Tailwind CSS and Bootstrap for modern responsive styling
- Context API for global authentication state

### Backend Tech
- Node.js with Express.js REST APIs
- MongoDB with Mongoose ODM
- Nodemailer for email OTP
- Passport.js for Google OAuth
- JWT for authentication

---

## Git Workflow

The project follows a Git branching workflow:

- Feature branches for each major feature:
  - `auth-feature`
  - `task-crud-feature`
  - `user-management-feature`
  - `pdf-report-feature`
- Feature branches merged into `dev` branch after completion
- `dev` branch regularly merged into `main` for production readiness
- Meaningful commit messages and frequent commits are maintained

---

## Project Structure

```
project-root/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/                 
│   └── server.js 
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── api/
│   │   └── App.jsx
│   └── tailwind.config.js
├── .env (excluded via .gitignore)
├── README.md
├── package.json
└── env_files.zip
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or later recommended)
- MongoDB (local or cloud instance)
- Gmail account for email OTP (App Password recommended)
- Google OAuth 2.0 Client ID & Secret

### Backend Setup
1. Navigate to `backend` directory:
   ```
   cd backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file with appropriate environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GMAIL_USER=your_gmail_address
   GMAIL_PASS=your_gmail_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:3000
   ```
4. Start backend server:
   ```
   npm run start
   ```
   or if you have nodemon:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend` directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create `.env` file with environment variables:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start frontend:
   ```
   npm start
   ```

---

## Usage

- Register as a user or login with Google OAuth.
- Intern users can manage their tasks on the dashboard.
- Admin users can access the Admin User Management page to manage users.
- Generate and download task reports as PDFs from the dashboard.

---

## Git Branch Management

To manage your features with Git:

```bash
# Create and switch to a new feature branch
git checkout -b feature-branch-name

# Stage specific files
git add path/to/file1 path/to/file2

# Commit changes
git commit -m "Meaningful commit message"

# Push branch to origin
git push origin feature-branch-name

# Switch to dev branch
git checkout dev

# Pull latest changes
git pull origin dev

# Merge feature branch into dev
git merge feature-branch-name

# Push dev branch after merge
git push origin dev

# After tests, merge dev into main
git checkout main
git merge dev
git push origin main

# Optionally delete feature branch locally and remotely
git branch -d feature-branch-name
git push origin --delete feature-branch-name
```

---

## Notes

- Use strong passwords and protect your `.env` files; never commit them.
- Ensure email credentials allow SMTP access with Nodemailer.
- For OAuth, correctly set authorized redirect URIs in Google Developer Console.
- Regularly pull updates and keep branches synced to avoid complex merge conflicts.

---

## Contact

For issues or suggestions, reach out via the project's GitHub repository.

---

Thank you for using this Task Management WebApp!  
This project is designed to provide a robust example of a modern full-stack MERN application with essential enterprise features.

```