# 🚀 TaskFlow - Enterprise Task Management System

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Node](https://img.shields.io/badge/Node-20.x-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-336791)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E)

TaskFlow is a **production-ready**, **feature-rich** task management system with separate dashboards for Admins and Members. Built with modern technologies, it provides real-time task tracking, team collaboration, and powerful analytics.

## ✨ Features

### 👑 Admin Dashboard
- **Powerful Analytics**: Real-time charts and graphs for task tracking
- **Project Management**: Full CRUD operations on projects
- **Team Management**: Add/remove members, assign roles
- **Task Assignment**: Assign tasks to team members with priorities
- **Reports & Analytics**: Exportable reports and insights
- **Activity Logs**: Track all user activities
- **Advanced Filters**: Search and filter tasks by status, priority, and date
- **Pagination**: Efficient data loading for large datasets

### 👤 Member Dashboard
- **Personal Tasks**: View and manage assigned tasks
- **Task Board**: Drag-and-drop Kanban board for status updates
- **Calendar View**: Visualize tasks by due date
- **Progress Tracking**: Personal analytics and completion rates
- **Profile Management**: Update personal information

### 🔧 Common Features
- **JWT Authentication**: Secure login with token-based auth
- **Role-Based Access**: Different permissions for Admin/Member
- **Real-time Notifications**: Task assignments and due date reminders
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Skeleton Loading**: Smooth loading states
- **Toast Notifications**: User-friendly feedback system
- **Error Boundaries**: Graceful error handling
- **404 Pages**: Custom error pages

## 🏗️ Architecture

cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# Required variables:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET: Random string for J signing
# - CORS_ORIGIN: Frontend URL for CORS

# Run database migrations
npm run migrate

# Seed database with demo data
npm run seed

# Start development server
npm run dev

cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev

# Application
NODE_ENV=development          # development | production
PORT=5000                     # Server port

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this  # At least 32 characters
JWT_EXPIRE=7d                 # Token expiration time

# CORS
CORS_ORIGIN=http://localhost:5173,https://yourdomain.com


# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Sentry for error tracking
# VITE_SENTRY_DSN=your-sentry-dsn

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway project create taskflow

# Deploy backend
cd backend
railway up

# Add PostgreSQL
railway add -p postgresql

# Set environment variables
railway env set JWT_SECRET=$(openssl rand -hex 32)
railway env set JWT_EXPIRE=7d

# Deploy frontend
cd ../frontend
railway up
railway env set VITE_API_URL=$(railway domain --service backend)/api

📚 API Documentation
Authentication Endpoints
Method	Endpoint	Description	Request Body	Response
POST	/api/auth/register	Register new user	{name, email, password, role?}	User object + token
POST	/api/auth/login	Login user	{email, password}	User object + token
GET	/api/auth/me	Get current user	-	User object
Project Endpoints (Admin only for write)
Method	Endpoint	Description	Permissions
GET	/api/projects	Get all projects	Admin: all projects, Member: assigned only
GET	/api/projects/:id	Get project by ID	Must be project member
POST	/api/projects	Create project	Admin only
PUT	/api/projects/:id	Update project	Admin only
DELETE	/api/projects/:id	Delete project	Admin only
POST	/api/projects/:id/members	Add team member	Admin only
DELETE	/api/projects/:id/members	Remove team member	Admin only
Task Endpoints
Method	Endpoint	Description	Permissions
GET	/api/tasks	Get tasks with filters	Admin: all, Member: own tasks
GET	/api/tasks/:id	Get task by ID	Own task or admin
POST	/api/tasks	Create task	Admin only
PUT	/api/tasks/:id	Update task	Admin or assignee
DELETE	/api/tasks/:id	Delete task	Admin only
GET	/api/tasks/dashboard/stats	Get dashboard statistics	All authenticated users
Query Parameters for GET /api/tasks
Parameter	Type	Description	Example
search	string	Search in title	?search=design
status	string	Filter by status	?status=in-progress
priority	string	Filter by priority	?priority=high
projectId	uuid	Filter by project	?projectId=123...
page	number	Pagination page	?page=2
limit	number	Items per page	?limit=20
Example API Calls

taskflow/
├── backend/                      # Backend application
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   └── database.js      # Database configuration
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   ├── userController.js
│   │   │   └── notificationController.js
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.js          # JWT authentication
│   │   ├── models/              # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Activity.js
│   │   │   └── Notification.js
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── utils/               # Utility functions
│   │   └── app.js               # Application entry point
│   ├── migrations/              # Database migrations
│   ├── seeders/                 # Seed data
│   ├── .env.example             # Environment variables template
│   ├── Dockerfile               # Docker configuration
│   ├── package.json             # Dependencies
│   └── railway.json             # Railway deployment config
│
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Layout.tsx       # Main layout wrapper
│   │   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   │   ├── StatCard.tsx     # Dashboard stat cards
│   │   │   ├── TaskCard.tsx     # Task display card
│   │   │   └── ProtectedRoute.tsx # Route guard
│   │   ├── pages/               # Page components
│   │   │   ├── Login.tsx        # Login page
│   │   │   ├── Register.tsx     # Registration page
│   │   │   ├── NotFound.tsx     # 404 page
│   │   │   ├── admin/           # Admin pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Projects.tsx
│   │   │   │   ├── Tasks.tsx
│   │   │   │   ├── Members.tsx
│   │   │   │   ├── Reports.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── Profile.tsx
│   │   │   └── member/          # Member pages
│   │   │       ├── Dashboard.tsx
│   │   │       ├── Tasks.tsx
│   │   │       ├── Projects.tsx
│   │   │       ├── Calendar.tsx
│   │   │       └── Profile.tsx
│   │   ├── context/             # React context
│   │   │   └── AuthContext.tsx  # Authentication state
│   │   ├── services/            # API services
│   │   │   └── api.ts           # Axios configuration
│   │   ├── types/               # TypeScript definitions
│   │   │   └── index.ts
│   │   ├── App.tsx              # Main App component
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── .env.example             # Environment template
│   ├── Dockerfile               # Docker configuration
│   ├── nginx.conf               # Nginx configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── vite.config.ts           # Vite configuration
│   ├── package.json             # Dependencies
│   └── railway.json             # Railway deployment config
│
├── docker-compose.yml            # Docker Compose configuration
├── .gitignore                    # Git ignore file
└── README.md                     # Project documentation