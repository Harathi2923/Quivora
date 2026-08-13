import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import protectedRoutes from "./routes/protected.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";
import quizAttemptRoutes from "./routes/quizAttempt.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

// ============================================================
// PATH CONFIGURATION
// ============================================================

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://quivora-omega.vercel.app",
];

app.use(
    cors({
        origin: (origin, callback) => {

            // Allow requests such as Postman
            // that don't have an Origin header.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

// ============================================================
// BODY PARSERS
// ============================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

// ============================================================
// ROOT ROUTE
// ============================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Welcome to Quivora API 🚀",
    });

});

// ============================================================
// API ROUTES
// ============================================================

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/admin",
    adminRoutes
);

app.use(
    "/api/v1/users",
    userRoutes
);

app.use(
    "/api/v1/protected",
    protectedRoutes
);

app.use(
    "/api/v1/categories",
    categoryRoutes
);

app.use(
    "/api/v1/quizzes",
    quizRoutes
);

app.use(
    "/api/v1/questions",
    questionRoutes
);

app.use(
    "/api/v1/attempts",
    quizAttemptRoutes
);

app.use(
    "/api/v1/leaderboard",
    leaderboardRoutes
);

// ============================================================
// UPLOADS
// ============================================================

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);

// ============================================================
// ERROR HANDLER
// ============================================================

app.use(errorHandler);

export default app;