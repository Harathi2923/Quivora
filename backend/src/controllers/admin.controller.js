import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import adminService
    from "../services/admin.service.js";


// =========================================================
// GET ADMIN DASHBOARD
// =========================================================

export const getAdminDashboard =
    asyncHandler(async (req, res) => {

        const dashboard =
            await adminService.getDashboard();


        return res.status(200).json(

            new ApiResponse(

                200,

                "Admin dashboard fetched successfully.",

                dashboard

            )

        );

    });

    // =========================================================
// GET ALL STUDENTS
// =========================================================

export const getAllStudents =
asyncHandler(async (req, res) => {


    const {

        search = "",

        status = "ALL",

        verified = "ALL",

    } = req.query;


    const result =
        await adminService.getStudents({

            search,

            status,

            verified,

        });


    return res.status(200).json(

        new ApiResponse(

            200,

            "Students fetched successfully.",

            result

        )

    );

});


// =========================================================
// GET STUDENT BY ID
// =========================================================

export const getStudentById =
asyncHandler(async (req, res) => {


    const student =
        await adminService.getStudentById(
            req.params.id
        );


    return res.status(200).json(

        new ApiResponse(

            200,

            "Student details fetched successfully.",

            student

        )

    );

});