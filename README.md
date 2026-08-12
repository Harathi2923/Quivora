# Quivora - Online Quiz and Assessment Platform

## Learn. Assess. Achieve.

Quivora is a full-stack online quiz and assessment platform designed to provide a simple and interactive way for students to take quizzes and for administrators to manage assessments.

The platform allows administrators to create and manage categories, quizzes, and multiple-choice questions. Students can register, log in, attempt published quizzes, receive their results, and track their performance through the platform.

The main goal of Quivora is to bring the complete quiz and assessment process into one place instead of managing questions, assessments, results, and performance separately.

---

## Project Overview

Quivora is developed as a full-stack web application with a separate frontend and backend.

The frontend provides the user interface for both students and administrators, while the backend handles authentication, business logic, quiz management, question management, quiz attempts, database operations, and leaderboard functionality.

The application has two main types of users:

- Student
- Administrator

Each user gets access to features based on their role.

---

# Key Features

## Student Features

Students can:

- Create a new account
- Log in securely
- View available published quizzes
- View quiz details before starting
- Start a quiz
- Answer multiple-choice questions
- Navigate through quiz questions
- Submit the quiz
- View quiz results
- Track quiz performance
- View leaderboard information
- Access quizzes based on available categories

The quiz interface is designed to provide a simple and focused examination experience.

---

## Administrator Features

Administrators can:

- Log in as an administrator
- Access the admin dashboard
- Manage students
- Create quiz categories
- View available categories
- Create quizzes
- Edit quiz details
- Delete quizzes
- Create questions
- Add multiple questions to a quiz
- Update questions
- Delete questions
- Restore deleted questions
- Publish quizzes
- Configure quiz difficulty
- Configure quiz duration
- Configure total marks
- Configure passing marks
- Configure negative marking
- View the number of questions in a quiz
- View quiz attempts
- Manage the overall assessment content

Bulk question creation is also supported so that multiple questions can be added to a quiz at once instead of entering every question individually.

---

# Quiz Features

Each quiz can contain:

- Quiz title
- Description
- Category
- Difficulty level
- Duration
- Number of questions
- Total marks
- Passing marks
- Negative marking
- Negative marks
- Published/Draft status

Questions contain:

- Question text
- Option A
- Option B
- Option C
- Option D
- Correct answer
- Marks
- Quiz association

The platform supports different quiz categories such as:

- Advanced Java
- Python
- JavaScript
- React
- Aptitude
- Reasoning
- General Knowledge
- SQL

New categories can also be created from the administration interface.

---

# Authentication and Authorization

Quivora uses role-based authentication.

Users authenticate using their email and password.

JSON Web Tokens (JWT) are used for authentication.

The backend verifies the authenticated user's identity before allowing access to protected resources.

Role-based authorization is implemented to control administrator-only operations.

For example:

- Students can attempt available quizzes.
- Administrators can create and manage quizzes.
- Administrators can create and manage questions.
- Administrators can manage categories.

Passwords are securely handled on the backend using password hashing.

---

# Technology Stack

## Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- React Toastify
- Fetch API
- Lucide React Icons

The frontend is responsible for the user interface, navigation, forms, quiz experience, validation, and communication with the backend APIs.

---

## Backend

- Node.js
- Express.js
- JavaScript
- Prisma ORM
- JWT
- bcrypt
- Express Validator
- CORS
- Cookie Parser
- Multer

The backend provides REST APIs and contains the application's business logic.

---

## Database

- PostgreSQL
- Neon PostgreSQL
- Prisma ORM

Prisma is used to communicate with the PostgreSQL database and manage the application's database models and relationships.

---

# Main Database Entities

The application uses several important entities to manage the quiz platform.

### User

Stores student and administrator information.

### Category

Stores quiz categories such as Python, React, SQL, Aptitude, and others.

### Quiz

Stores quiz information including title, difficulty, duration, marks, publishing status, and category.

### Question

Stores multiple-choice questions and their options.

### Quiz Attempt

Stores information related to a student's quiz attempt and result.

### Leaderboard

Provides ranking and performance information based on quiz results.

---

# Project Architecture

The project is divided into two main applications:

```text
Quivora/
│
├── backend/
│
└── frontend/