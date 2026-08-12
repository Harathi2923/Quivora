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

const __filename =
    fileURLToPath(
        import.meta.url
    );

const __dirname =
    path.dirname(
        __filename
    );

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Quivora API 🚀",
  });
});

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/admin", adminRoutes); 

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/protected", protectedRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/quizzes", quizRoutes);

app.use("/api/v1/questions", questionRoutes);

app.use("/api/v1/attempts", quizAttemptRoutes);

app.use("/api/v1/leaderboard",leaderboardRoutes);

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "../uploads"
        )
    )
);

app.use(errorHandler);

export default app;