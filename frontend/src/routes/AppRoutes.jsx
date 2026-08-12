import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

import StudentDashboard from "../pages/student/StudentDashboard";
import QuizInstructions from "../pages/student/QuizInstructions";
import QuizExam from "../pages/student/QuizExam";
import QuizResult from "../pages/student/QuizResult";
import MyQuizzes from "../pages/student/MyQuizzes";
import MyResults from "../pages/student/MyResults";
import ResultDetails from "../pages/student/ResultDetails";
import Leaderboard from "../pages/student/Leaderboard";
import StudentProfile from "../pages/student/StudentProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminQuizzes from "../pages/admin/AdminQuizzes";
import CreateQuiz from "../pages/admin/CreateQuiz";
import ViewQuiz from "../pages/admin/ViewQuiz";
import EditQuiz from "../pages/admin/EditQuiz";
import EditQuestion from "../pages/admin/EditQuestion";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminLeaderboard from "../pages/admin/Leaderboard";
import AdminProfile from "../pages/admin/AdminProfile";

const AppRoutes = () => {

    return (

        <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/student/dashboard"
                element={<StudentDashboard />}
            />

            <Route
                path="/student/quiz/:quizId"
                element={<QuizInstructions />}
            />

            <Route
                path="/student/quiz/:quizId/attempt/:attemptId"
                element={<QuizExam />}
            />

            <Route
                path="/student/quiz/:quizId/result/:attemptId"
                element={<QuizResult />}
            />

            <Route
                path="/student/quizzes"
                element={<MyQuizzes />}
            />

            <Route
                path="/student/results"
                element={<MyResults />}
            />

            <Route
                path="/student/results/:attemptId"
                element={<ResultDetails />}
            />

            <Route
                path="/student/leaderboard"
                element={<Leaderboard />}
            />

            <Route
                path="/student/profile"
                element={<StudentProfile />}
            />

            <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
            />

            <Route
                path="/admin/quizzes"
                element={<AdminQuizzes />}
            />

            <Route
                path="/admin/quizzes/create"
                element={<CreateQuiz />}
            />

            <Route
                path="/admin/quizzes/:id"
                element={<ViewQuiz />}
            />

            <Route
                path="/admin/quizzes/:id/edit"
                element={<EditQuiz />}
            />

            <Route
                path="/admin/quizzes/:id/questions/:questionId/edit"
                element={<EditQuestion />}
            />

            <Route
                path="/admin/students"
                element={<AdminStudents />}
            />

            <Route
                path="/admin/leaderboard"
                element={<AdminLeaderboard />}
            />

            <Route
                path="/admin/profile"
                element={<AdminProfile />}
            />
            

        </Routes>

    );

};


export default AppRoutes;