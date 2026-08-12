import { Router } from "express";

import authenticate
    from "../middleware/auth.middleware.js";

import authorize
    from "../middleware/role.middleware.js";

import {
    getAdminDashboard,
    getAllStudents,
    getStudentById,
} from "../controllers/admin.controller.js";


const router = Router();


// =========================================================
// ADMIN DASHBOARD
// =========================================================

router.get(
    "/dashboard",
    authenticate,
    authorize("ADMIN"),
    getAdminDashboard
);

// =========================================================
// ADMIN STUDENTS
// =========================================================

router.get(
    "/students",
    authenticate,
    authorize("ADMIN"),
    getAllStudents
);


// =========================================================
// ADMIN STUDENT DETAILS
// =========================================================

router.get(
    "/students/:id",
    authenticate,
    authorize("ADMIN"),
    getStudentById
);


export default router;