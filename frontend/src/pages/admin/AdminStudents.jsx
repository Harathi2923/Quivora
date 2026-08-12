import React, { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    Search,
    Users,
    UserCheck,
    UserX,
    Eye,
    X,
    Mail,
    Phone,
    CalendarDays,
    Trophy,
    Clock3,
    CheckCircle2,
    XCircle,
    LoaderCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import logo from "../../assets/logo/quivora-logo.png";


// ============================================================
// API
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://quivora-backend.onrender.com/api/v1";


// ============================================================
// COLORS
// Same Quivora Admin Theme
// ============================================================

const COLORS = {

    cream: "#FAF8F2",

    green: "#023222",

    greenLight: "#0B5D45",

    greenSoft: "#E5F0EB",

    gold: "#D4A017",

    goldSoft: "#F5E9D0",

    white: "#FFFFFF",

    gray: "#6B7280",

    grayDark: "#374151",

    border: "#E5E1D7",

    red: "#DC4444",

    redSoft: "#FDEAEA",

    blue: "#3D7188",

    blueSoft: "#E8F1F5",

};


// ============================================================
// ADMIN STUDENTS
// ============================================================

const AdminStudents = () => {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ========================================================
    // STATE
    // ========================================================

    const [students, setStudents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [studentDetails, setStudentDetails] =
        useState(null);

    const [detailsLoading, setDetailsLoading] =
        useState(false);


    const [statistics, setStatistics] =
        useState({

            totalStudents: 0,

            activeStudents: 0,

            inactiveStudents: 0,

        });


    // ========================================================
    // FETCH STUDENTS
    // ========================================================

    const fetchStudents = async () => {

        try {

            setLoading(true);

            setError("");


            const token =
                localStorage.getItem(
                    "quivora_token"
                );


            if (!token) {

                throw new Error(
                    "Authentication token not found."
                );

            }


            const queryParams =
                new URLSearchParams();


            if (search.trim()) {

                queryParams.append(
                    "search",
                    search.trim()
                );

            }


            if (statusFilter !== "ALL") {

                queryParams.append(
                    "status",
                    statusFilter
                );

            }


            const queryString =
                queryParams.toString();


            const url =
                `${API_BASE_URL}/admin/students` +
                (
                    queryString
                        ? `?${queryString}`
                        : ""
                );


            const response =
                await fetch(
                    url,
                    {
                        method: "GET",

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,

                        },
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Unable to load students."
                );

            }


            const data =
                result?.data;


            const studentList =
                Array.isArray(data?.students)
                    ? data.students
                    : Array.isArray(data)
                        ? data
                        : [];


            setStudents(
                studentList
            );


            if (data?.statistics) {

                setStatistics({

                    totalStudents:
                        data.statistics
                            .totalStudents ??
                        0,

                    activeStudents:
                        data.statistics
                            .activeStudents ??
                        0,

                    inactiveStudents:
                        data.statistics
                            .inactiveStudents ??
                        0,

                });

            }


        } catch (err) {

            console.error(
                "Students fetch error:",
                err
            );


            setError(
                err.message ||
                "Unable to load students."
            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchStudents();

    }, [statusFilter]);


    // ========================================================
    // SEARCH
    // ========================================================

    useEffect(() => {

        const timer =
            setTimeout(() => {

                fetchStudents();

            }, 350);


        return () => {

            clearTimeout(timer);

        };

    }, [search]);


    // ========================================================
    // VIEW STUDENT
    // ========================================================

    const handleViewStudent =
        async (student) => {

            try {

                setSelectedStudent(
                    student
                );

                setStudentDetails(null);

                setDetailsLoading(true);


                const token =
                    localStorage.getItem(
                        "quivora_token"
                    );


                const response =
                    await fetch(

                        `${API_BASE_URL}/admin/students/${student.id}`,

                        {

                            method: "GET",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                        }

                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to load student details."
                    );

                }


                setStudentDetails(
                    result?.data || null
                );


            } catch (err) {

                console.error(
                    "Student details error:",
                    err
                );


                toast.error(
                    err.message ||
                    "Unable to load student details."
                );


            } finally {

                setDetailsLoading(false);

            }

        };


    // ========================================================
    // CLOSE DETAILS
    // ========================================================

    const closeDetails = () => {

        setSelectedStudent(null);

        setStudentDetails(null);

    };


    // ========================================================
    // NAVIGATION
    // ========================================================

    const goDashboard = () => {

        navigate(
            "/admin/dashboard"
        );

    };


    const goQuizzes = () => {

        navigate(
            "/admin/quizzes"
        );

    };


    const goStudents = () => {

        navigate(
            "/admin/students"
        );

    };


    const goLeaderboard = () => {

        navigate(
            "/admin/leaderboard"
        );

    };


    // ========================================================
    // DATE FORMAT
    // ========================================================

    const formatDate = (date) => {

        if (!date) {

            return "—";

        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {

            return "—";

        }


        return parsed.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ========================================================
    // AVATAR INITIALS
    // ========================================================

    const getInitials =
        (student) => {

            const first =
                student?.firstName
                    ?.charAt(0) ||
                "";

            const last =
                student?.lastName
                    ?.charAt(0) ||
                "";

            return (
                `${first}${last}`
                    .toUpperCase() ||
                "S"
            );

        };


    // ========================================================
    // PROFILE IMAGE URL
    // ========================================================

    const getProfileImage =
        (profileImage) => {

            if (!profileImage) {

                return null;

            }


            if (
                profileImage.startsWith(
                    "http"
                )
            ) {

                return profileImage;

            }


            return (
                `https://quivora-backend.onrender.com${profileImage}`
            );

        };


    // ========================================================
    // FRONTEND FALLBACK FILTER
    // ========================================================

    const visibleStudents =
        useMemo(() => {

            return students.filter(
                (student) => {

                    const text =
                        `${student.firstName || ""} ${student.lastName || ""} ${student.email || ""}`
                            .toLowerCase();

                    return text.includes(
                        search
                            .trim()
                            .toLowerCase()
                    );

                }
            );

        }, [
            students,
            search,
        ]);


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    COLORS.cream,
                color:
                    COLORS.green,
                fontFamily:
                    "inherit",
            }}
        >


            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header
                style={{
                    height: "80px",
                    background:
                        COLORS.green,
                    borderBottom:
                        "1px solid rgba(2,50,34,0.10)",
                    display: "flex",
                    alignItems: "center",
                    padding:
                        "0 32px",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >

                {/* LOGO */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >

                    <img
                        src={logo}
                        alt="Quivora"
                        style={{
                            height: "55px",
                            width: "auto",
                            objectFit:
                                "contain",
                        }}
                    />

                </div>


                {/* NAVIGATION */}

                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginLeft: "28px",
                    }}
                >

                    <NavButton
                        label="Dashboard"
                        onClick={
                            goDashboard
                        }
                    />


                    <NavButton
                        label="Quizzes"
                        icon={
                            <BookOpen
                                size={17}
                            />
                        }
                        onClick={
                            goQuizzes
                        }
                    />


                    <NavButton
                        label="Students"
                        active
                        icon={
                            <Users
                                size={17}
                            />
                        }
                        onClick={
                            goStudents
                        }
                    />


                    <NavButton
                        label="Leaderboard"
                        icon={
                            <Trophy
                                size={17}
                            />
                        }
                        onClick={
                            goLeaderboard
                        }
                    />

                </nav>


                {/* ADMIN USER */}

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontSize:
                                    "13px",
                                fontWeight:
                                    "700",
                                color:
                                    COLORS.white,
                            }}
                        >
                            {user?.firstName ||
                                "Admin"}{" "}
                            {user?.lastName ||
                                ""}
                        </p>


                        <p
                            style={{
                                margin:
                                    "2px 0 0",
                                fontSize:
                                    "11px",
                                color:
                                    COLORS.gray,
                            }}
                        >
                            Administrator
                        </p>

                    </div>


                    <div
                    onClick={()=>navigate("/admin/profile")}
                        style={{
                            width: "43px",
                            height: "43px",
                            borderRadius:
                                "50%",
                            background:
                                COLORS.goldSoft,
                            color:
                                COLORS.green,
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontWeight: "800",
                            overflow:
                                "hidden",
                        }}
                    >

                        {user?.profileImage ? (

                            <img
                                src={
                                    getProfileImage(
                                        user.profileImage
                                    )
                                }
                                alt="Admin"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit:
                                        "cover",
                                }}
                            />

                        ) : (

                            user?.firstName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                            "A"

                        )}

                    </div>

                </div>

            </header>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <main>

                <div
                    style={{
                        width:
                            "min(1240px, calc(100% - 48px))",
                        margin:
                            "0 auto",
                        padding:
                            "10px 0 30px",
                    }}
                >


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div
                        style={{
                            marginBottom:
                                "10px",
                        }}
                    >

                        <p
                            style={{
                                margin:
                                    "0 0 2px",
                                color:
                                    COLORS.greenLight,
                                fontSize:
                                    "10px",
                                fontWeight:
                                    "800",
                                letterSpacing:
                                    "0.16em",
                            }}
                        >
                            STUDENT MANAGEMENT
                        </p>


                        <h1
                            style={{
                                margin:0,
                                color:
                                    COLORS.green,
                                fontSize:
                                    "28px",
                                fontWeight:
                                    "800",
                            }}
                        >
                            Students
                        </h1>


                        <p
                            style={{
                                margin:
                                    "1px 0 0",
                                color:
                                    COLORS.gray,
                                fontSize:
                                    "13px",
                            }}
                        >
                            Manage and monitor all
                            registered students.
                        </p>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================== */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "14px",
                            marginBottom:
                                "18px",
                        }}
                        className="student-stat-grid"
                    >

                        <StatCard
                            icon={
                                <Users
                                    size={21}
                                />
                            }
                            label="Total Students"
                            value={
                                statistics.totalStudents
                            }
                            type="green"
                        />


                        <StatCard
                            icon={
                                <UserCheck
                                    size={21}
                                />
                            }
                            label="Active Students"
                            value={
                                statistics.activeStudents
                            }
                            type="gold"
                        />


                        <StatCard
                            icon={
                                <UserX
                                    size={21}
                                />
                            }
                            label="Inactive Students"
                            value={
                                statistics.inactiveStudents
                            }
                            type="red"
                        />

                    </div>


                    {/* =================================================
                        STUDENT PANEL
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,
                            border:
                                `1px solid ${COLORS.border}`,
                            borderRadius:
                                "16px",
                            boxShadow:
                                "0 2px 7px rgba(24,48,40,0.04)",
                            overflow:
                                "hidden",
                        }}
                    >


                        {/* =================================================
                            PANEL HEADER
                        ================================================= */}

                        <div
                            style={{
                                padding:
                                    "12px 20px",
                                borderBottom:
                                    `1px solid ${COLORS.border}`,
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    gap:
                                        "18px",
                                }}
                                className="student-toolbar"
                            >

                                <div>

                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize:
                                                "17px",
                                            fontWeight:
                                                "800",
                                            color:
                                                COLORS.green,
                                        }}
                                    >
                                        All Students
                                    </h2>


                                    <p
                                        style={{
                                            margin:
                                                "4px 0 0",
                                            color:
                                                COLORS.gray,
                                            fontSize:
                                                "11px",
                                        }}
                                    >
                                        {visibleStudents.length}{" "}
                                        student
                                        {visibleStudents.length !==
                                        1
                                            ? "s"
                                            : ""}{" "}
                                        displayed
                                    </p>

                                </div>


                                {/* SEARCH */}

                                <div
                                    style={{
                                        position:
                                            "relative",
                                        width:
                                            "300px",
                                    }}
                                    className="student-search"
                                >

                                    <Search
                                        size={16}
                                        style={{
                                            position:
                                                "absolute",
                                            left:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            color:
                                                COLORS.gray,
                                        }}
                                    />


                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={
                                            (event) =>
                                                setSearch(
                                                    event
                                                        .target
                                                        .value
                                                )
                                        }
                                        placeholder="Search by name or email..."
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "40px",
                                            boxSizing:
                                                "border-box",
                                            border:
                                                `1px solid ${COLORS.border}`,
                                            borderRadius:
                                                "10px",
                                            outline:
                                                "none",
                                            padding:
                                                "0 12px 0 36px",
                                            fontSize:
                                                "12px",
                                            color:
                                                COLORS.green,
                                            background:
                                                COLORS.cream,
                                        }}
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                FILTERS
                            ================================================== */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap:
                                        "8px",
                                    marginTop:
                                        "10px",
                                    flexWrap:
                                        "wrap",
                                }}
                            >

                                <FilterButton
                                    label="All Students"
                                    active={
                                        statusFilter ===
                                        "ALL"
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            "ALL"
                                        )
                                    }
                                />


                                <FilterButton
                                    label="Active"
                                    active={
                                        statusFilter ===
                                        "ACTIVE"
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            "ACTIVE"
                                        )
                                    }
                                />


                                <FilterButton
                                    label="Inactive"
                                    active={
                                        statusFilter ===
                                        "INACTIVE"
                                    }
                                    onClick={() =>
                                        setStatusFilter(
                                            "INACTIVE"
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading && (

                            <div
                                style={{
                                    minHeight:
                                        "280px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    gap:
                                        "10px",
                                    color:
                                        COLORS.greenLight,
                                    fontSize:
                                        "13px",
                                }}
                            >

                                <LoaderCircle
                                    size={19}
                                    style={{
                                        animation:
                                            "studentSpin 1s linear infinite",
                                    }}
                                />

                                Loading students...

                            </div>

                        )}


                        {/* =================================================
                            ERROR
                        ================================================== */}

                        {!loading &&
                            error && (

                                <div
                                    style={{
                                        minHeight:
                                            "260px",
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        padding:
                                            "30px",
                                        textAlign:
                                            "center",
                                    }}
                                >

                                    <div
                                        style={{
                                            width:
                                                "48px",
                                            height:
                                                "28px",
                                            borderRadius:
                                                "14px",
                                            background:
                                                COLORS.redSoft,
                                            color:
                                                COLORS.red,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            marginBottom:
                                                "12px",
                                        }}
                                    >

                                        <XCircle
                                            size={22}
                                        />

                                    </div>


                                    <h3
                                        style={{
                                            margin:
                                                "0 0 5px",
                                            color:
                                                COLORS.green,
                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        Unable to load students
                                    </h3>


                                    <p
                                        style={{
                                            margin:
                                                "0 0 15px",
                                            color:
                                                COLORS.gray,
                                            fontSize:
                                                "11px",
                                        }}
                                    >
                                        {error}
                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            fetchStudents
                                        }
                                        style={{
                                            border:
                                                "none",
                                            borderRadius:
                                                "9px",
                                            background:
                                                COLORS.green,
                                            color:
                                                COLORS.white,
                                            padding:
                                                "9px 15px",
                                            fontSize:
                                                "11px",
                                            fontWeight:
                                                "700",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        Try Again
                                    </button>

                                </div>

                            )}


                        {/* =================================================
                            EMPTY
                        ================================================== */}

                        {!loading &&
                            !error &&
                            visibleStudents.length ===
                                0 && (

                                <div
                                    style={{
                                        minHeight:
                                            "180px",
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        padding:
                                            "30px",
                                        textAlign:
                                            "center",
                                    }}
                                >

                                    <div
                                        style={{
                                            width:
                                                "54px",
                                            height:
                                                "54px",
                                            borderRadius:
                                                "16px",
                                            background:
                                                COLORS.greenSoft,
                                            color:
                                                COLORS.greenLight,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            marginBottom:
                                                "12px",
                                        }}
                                    >

                                        <Users
                                            size={24}
                                        />

                                    </div>


                                    <h3
                                        style={{
                                            margin:
                                                "0 0 5px",
                                            color:
                                                COLORS.green,
                                            fontSize:
                                                "15px",
                                        }}
                                    >
                                        No students found
                                    </h3>


                                    <p
                                        style={{
                                            margin: 0,
                                            color:
                                                COLORS.gray,
                                            fontSize:
                                                "11px",
                                        }}
                                    >
                                        Try changing your
                                        search or filter.
                                    </p>

                                </div>

                            )}


                        {/* =================================================
                            STUDENT TABLE
                        ================================================== */}

                        {!loading &&
                            !error &&
                            visibleStudents.length >
                                0 && (

                                <div
                                    style={{
                                        overflowX:
                                            "auto",
                                    }}
                                >

                                    <table
                                        style={{
                                            width:
                                                "100%",
                                            borderCollapse:
                                                "collapse",
                                            minWidth:
                                                "800px",
                                        }}
                                    >

                                        <thead>

                                            <tr
                                                style={{
                                                    background:
                                                        "#FBFAF6",
                                                }}
                                            >

                                                <th
                                                    style={
                                                        tableHeaderStyle
                                                    }
                                                >
                                                    Student
                                                </th>


                                                <th
                                                    style={
                                                        tableHeaderStyle
                                                    }
                                                >
                                                    Email
                                                </th>


                                                <th
                                                    style={
                                                        tableHeaderStyle
                                                    }
                                                >
                                                    Registered
                                                </th>


                                                <th
                                                    style={
                                                        tableHeaderStyle
                                                    }
                                                >
                                                    Attempts
                                                </th>


                                                <th
                                                    style={
                                                        tableHeaderStyle
                                                    }
                                                >
                                                    Status
                                                </th>


                                                <th
                                                    style={{
                                                        ...tableHeaderStyle,
                                                        textAlign:
                                                            "right",
                                                    }}
                                                >
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {visibleStudents.map(
                                                (
                                                    student
                                                ) => {

                                                    const image =
                                                        getProfileImage(
                                                            student.profileImage
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                student.id
                                                            }
                                                            style={{
                                                                borderTop:
                                                                    `1px solid ${COLORS.border}`,
                                                            }}
                                                        >

                                                            {/* STUDENT */}

                                                            <td
                                                                style={
                                                                    tableCellStyle
                                                                }
                                                            >

                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "11px",
                                                                    }}
                                                                >

                                                                    {image ? (

                                                                        <img
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt={
                                                                                student.fullName
                                                                            }
                                                                            style={{
                                                                                width:
                                                                                    "40px",
                                                                                height:
                                                                                    "40px",
                                                                                borderRadius:
                                                                                    "50%",
                                                                                objectFit:
                                                                                    "cover",
                                                                                flexShrink:
                                                                                    0,
                                                                            }}
                                                                        />

                                                                    ) : (

                                                                        <div
                                                                            style={{
                                                                                width:
                                                                                    "40px",
                                                                                height:
                                                                                    "40px",
                                                                                borderRadius:
                                                                                    "50%",
                                                                                background:
                                                                                    COLORS.goldSoft,
                                                                                color:
                                                                                    COLORS.green,
                                                                                display:
                                                                                    "flex",
                                                                                alignItems:
                                                                                    "center",
                                                                                justifyContent:
                                                                                    "center",
                                                                                fontSize:
                                                                                    "12px",
                                                                                fontWeight:
                                                                                    "800",
                                                                                flexShrink:
                                                                                    0,
                                                                            }}
                                                                        >
                                                                            {
                                                                                getInitials(
                                                                                    student
                                                                                )
                                                                            }
                                                                        </div>

                                                                    )}


                                                                    <div
                                                                        style={{
                                                                            minWidth:
                                                                                0,
                                                                        }}
                                                                    >

                                                                        <p
                                                                            style={{
                                                                                margin:
                                                                                    0,
                                                                                color:
                                                                                    COLORS.green,
                                                                                fontSize:
                                                                                    "12px",
                                                                                fontWeight:
                                                                                    "800",
                                                                            }}
                                                                        >
                                                                            {
                                                                                student.firstName
                                                                            }{" "}
                                                                            {
                                                                                student.lastName
                                                                            }
                                                                        </p>


                                                                        <p
                                                                            style={{
                                                                                margin:
                                                                                    "3px 0 0",
                                                                                color:
                                                                                    COLORS.gray,
                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            Student
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* EMAIL */}

                                                            <td
                                                                style={
                                                                    tableCellStyle
                                                                }
                                                            >

                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "7px",
                                                                        color:
                                                                            COLORS.grayDark,
                                                                        fontSize:
                                                                            "11px",
                                                                    }}
                                                                >

                                                                    <Mail
                                                                        size={
                                                                            14
                                                                        }
                                                                        color={
                                                                            COLORS.gray
                                                                        }
                                                                    />

                                                                    {
                                                                        student.email
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* DATE */}

                                                            <td
                                                                style={
                                                                    tableCellStyle
                                                                }
                                                            >

                                                                <div
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "7px",
                                                                        color:
                                                                            COLORS.grayDark,
                                                                        fontSize:
                                                                            "11px",
                                                                    }}
                                                                >

                                                                    <CalendarDays
                                                                        size={
                                                                            14
                                                                        }
                                                                        color={
                                                                            COLORS.gray
                                                                        }
                                                                    />

                                                                    {
                                                                        formatDate(
                                                                            student.createdAt
                                                                        )
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* ATTEMPTS */}

                                                            <td
                                                                style={
                                                                    tableCellStyle
                                                                }
                                                            >

                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "inline-flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "6px",
                                                                        padding:
                                                                            "6px 9px",
                                                                        borderRadius:
                                                                            "8px",
                                                                        background:
                                                                            COLORS.blueSoft,
                                                                        color:
                                                                            COLORS.blue,
                                                                        fontSize:
                                                                            "10px",
                                                                        fontWeight:
                                                                            "700",
                                                                    }}
                                                                >

                                                                    <Trophy
                                                                        size={
                                                                            13
                                                                        }
                                                                    />

                                                                    {
                                                                        student.attemptCount ??
                                                                        0
                                                                    }

                                                                    {" "}
                                                                    attempts

                                                                </span>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td
                                                                style={
                                                                    tableCellStyle
                                                                }
                                                            >

                                                                {student.isActive ? (

                                                                    <span
                                                                        style={{
                                                                            display:
                                                                                "inline-flex",
                                                                            alignItems:
                                                                                "center",
                                                                            gap:
                                                                                "5px",
                                                                            padding:
                                                                                "6px 9px",
                                                                            borderRadius:
                                                                                "20px",
                                                                            background:
                                                                                COLORS.greenSoft,
                                                                            color:
                                                                                COLORS.greenLight,
                                                                            fontSize:
                                                                                "9px",
                                                                            fontWeight:
                                                                                "700",
                                                                        }}
                                                                    >

                                                                        <CheckCircle2
                                                                            size={
                                                                                12
                                                                            }
                                                                        />

                                                                        Active

                                                                    </span>

                                                                ) : (

                                                                    <span
                                                                        style={{
                                                                            display:
                                                                                "inline-flex",
                                                                            alignItems:
                                                                                "center",
                                                                            gap:
                                                                                "5px",
                                                                            padding:
                                                                                "6px 9px",
                                                                            borderRadius:
                                                                                "20px",
                                                                            background:
                                                                                COLORS.redSoft,
                                                                            color:
                                                                                COLORS.red,
                                                                            fontSize:
                                                                                "9px",
                                                                            fontWeight:
                                                                                "700",
                                                                        }}
                                                                    >

                                                                        <XCircle
                                                                            size={
                                                                                12
                                                                            }
                                                                        />

                                                                        Inactive

                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* ACTION */}

                                                            <td
                                                                style={{
                                                                    ...tableCellStyle,
                                                                    textAlign:
                                                                        "right",
                                                                }}
                                                            >

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleViewStudent(
                                                                            student
                                                                        )
                                                                    }
                                                                    style={{
                                                                        display:
                                                                            "inline-flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap:
                                                                            "6px",
                                                                        border:
                                                                            "none",
                                                                        borderRadius:
                                                                            "9px",
                                                                        background:
                                                                            COLORS.greenSoft,
                                                                        color:
                                                                            COLORS.greenLight,
                                                                        padding:
                                                                            "8px 12px",
                                                                        fontSize:
                                                                            "10px",
                                                                        fontWeight:
                                                                            "700",
                                                                        cursor:
                                                                            "pointer",
                                                                    }}
                                                                >

                                                                    <Eye
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    View

                                                                </button>

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                    </section>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        style={{
                            marginTop:
                                "28px",
                            paddingTop:
                                "16px",
                            borderTop:
                                "1px solid rgba(2,50,34,0.10)",
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            color:
                                COLORS.gray,
                            fontSize:
                                "10px",
                        }}
                    >

                        <span>
                            © 2026 Quivora.
                            Learn. Practice. Excel.
                        </span>


                        <span>
                            Secure Assessment Platform
                        </span>

                    </footer>

                </div>

            </main>


            {/* ==================================================
                STUDENT DETAILS MODAL
            ================================================== */}

            {selectedStudent && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(2,50,34,0.45)",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "center",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                    onClick={
                        closeDetails
                    }
                >

                    <div
                        style={{
                            width:
                                "100%",
                            maxWidth:
                                "760px",
                            maxHeight:
                                "90vh",
                            overflowY:
                                "auto",
                            background:
                                COLORS.white,
                            borderRadius:
                                "18px",
                            boxShadow:
                                "0 20px 70px rgba(0,0,0,0.20)",
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div
                            style={{
                                padding:
                                    "20px 22px",
                                borderBottom:
                                    `1px solid ${COLORS.border}`,
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                            }}
                        >

                            <div>

                                <p
                                    style={{
                                        margin:
                                            "0 0 4px",
                                        color:
                                            COLORS.greenLight,
                                        fontSize:
                                            "9px",
                                        fontWeight:
                                            "800",
                                        letterSpacing:
                                            "0.14em",
                                    }}
                                >
                                    STUDENT DETAILS
                                </p>


                                <h2
                                    style={{
                                        margin: 0,
                                        color:
                                            COLORS.green,
                                        fontSize:
                                            "19px",
                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    {
                                        selectedStudent.firstName
                                    }{" "}
                                    {
                                        selectedStudent.lastName
                                    }
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeDetails
                                }
                                style={{
                                    width:
                                        "34px",
                                    height:
                                        "34px",
                                    border:
                                        "none",
                                    borderRadius:
                                        "9px",
                                    background:
                                        COLORS.cream,
                                    color:
                                        COLORS.gray,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    cursor:
                                        "pointer",
                                }}
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        {detailsLoading ? (

                            <div
                                style={{
                                    minHeight:
                                        "300px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    gap:
                                        "10px",
                                    color:
                                        COLORS.greenLight,
                                    fontSize:
                                        "12px",
                                }}
                            >

                                <LoaderCircle
                                    size={18}
                                    style={{
                                        animation:
                                            "studentSpin 1s linear infinite",
                                    }}
                                />

                                Loading student details...

                            </div>

                        ) : studentDetails ? (

                            <StudentDetails
                                details={
                                    studentDetails
                                }
                                formatDate={
                                    formatDate
                                }
                                getProfileImage={
                                    getProfileImage
                                }
                                getInitials={
                                    getInitials
                                }
                            />

                        ) : (

                            <div
                                style={{
                                    padding:
                                        "40px",
                                    textAlign:
                                        "center",
                                    color:
                                        COLORS.gray,
                                    fontSize:
                                        "12px",
                                }}
                            >
                                Student details
                                unavailable.
                            </div>

                        )}

                    </div>

                </div>

            )}


            {/* ==================================================
                RESPONSIVE
            ================================================== */}

            <style>
                {`

                    @keyframes studentSpin {

                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }

                    }


                    @media (max-width: 900px) {

                        header {
                            overflow-x: auto;
                        }

                        .student-stat-grid {
                            grid-template-columns:
                                repeat(2, minmax(0, 1fr)) !important;
                        }

                    }


                    @media (max-width: 700px) {

                        header {
                            padding:
                                0 16px !important;
                        }

                        header > nav {
                            display:
                                none !important;
                        }

                        header > div:last-child {
                            margin-left:
                                auto !important;
                        }

                        main > div {
                            width:
                                calc(100% - 24px) !important;
                            padding-top:
                                18px !important;
                        }

                        .student-stat-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .student-toolbar {
                            flex-direction:
                                column !important;
                            align-items:
                                stretch !important;
                        }

                        .student-search {
                            width:
                                100% !important;
                        }

                    }

                `}
            </style>

        </div>

    );

};


// ============================================================
// NAV BUTTON
// ============================================================

const NavButton = ({
    label,
    icon,
    active = false,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            style={{
                display:
                    "flex",
                alignItems:
                    "center",
                gap:
                    "7px",
                padding:
                    "10px 14px",
                border:
                    "none",
                borderRadius:
                    "11px",
                background:
                    active
                        ? COLORS.gold
                        : "transparent",
                color:
                    active
                        ? COLORS.green
                        : "#5F6B67",
                fontSize:
                    "13px",
                fontWeight:
                    active
                        ? "700"
                        : "500",
                cursor:
                    "pointer",
            }}
        >

            {icon}

            {label}

        </button>

    );

};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    icon,
    label,
    value,
    type,
}) => {

    const iconBackground =
        type === "gold"
            ? COLORS.goldSoft
            : type === "red"
                ? COLORS.redSoft
                : COLORS.greenSoft;


    const iconColor =
        type === "gold"
            ? "#B88400"
            : type === "red"
                ? COLORS.red
                : COLORS.greenLight;


    return (

        <div
            style={{
                minHeight:
                    "92px",
                background:
                    COLORS.white,
                border:
                    `1px solid ${COLORS.border}`,
                borderRadius:
                    "13px",
                padding:
                    "16px 17px",
                display:
                    "flex",
                alignItems:
                    "center",
                gap:
                    "13px",
                boxShadow:
                    "0 2px 5px rgba(24,48,40,0.04)",
            }}
        >

            <div
                style={{
                    width:
                        "42px",
                    height:
                        "42px",
                    borderRadius:
                        "11px",
                    background:
                        iconBackground,
                    color:
                        iconColor,
                    display:
                        "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    flexShrink:
                        0,
                }}
            >

                {icon}

            </div>


            <div>

                <span
                    style={{
                        display:
                            "block",
                        color:
                            COLORS.gray,
                        fontSize:
                            "11px",
                        marginBottom:
                            "5px",
                    }}
                >
                    {label}
                </span>


                <strong
                    style={{
                        color:
                            COLORS.green,
                        fontSize:
                            "22px",
                        lineHeight:
                            1,
                    }}
                >
                    {value}
                </strong>

            </div>

        </div>

    );

};


// ============================================================
// FILTER BUTTON
// ============================================================

const FilterButton = ({
    label,
    active,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            style={{
                border:
                    active
                        ? "1px solid #D4A017"
                        : `1px solid ${COLORS.border}`,
                borderRadius:
                    "9px",
                background:
                    active
                        ? COLORS.goldSoft
                        : COLORS.white,
                color:
                    active
                        ? COLORS.green
                        : COLORS.grayDark,
                padding:
                    "8px 13px",
                fontSize:
                    "10px",
                fontWeight:
                    active
                        ? "700"
                        : "600",
                cursor:
                    "pointer",
            }}
        >
            {label}
        </button>

    );

};


// ============================================================
// STUDENT DETAILS
// ============================================================

const StudentDetails = ({
    details,
    formatDate,
    getProfileImage,
    getInitials,
}) => {

    const student =
        details.student || {};

    const statistics =
        details.statistics || {};

    const attempts =
        details.recentAttempts || [];


    const image =
        getProfileImage(
            student.profileImage
        );


    return (

        <div
            style={{
                padding:
                    "22px",
            }}
        >

            {/* PROFILE */}

            <div
                style={{
                    background:
                        COLORS.cream,
                    border:
                        `1px solid ${COLORS.border}`,
                    borderRadius:
                        "14px",
                    padding:
                        "18px",
                    display:
                        "flex",
                    alignItems:
                        "center",
                    gap:
                        "15px",
                    marginBottom:
                        "18px",
                }}
            >

                {image ? (

                    <img
                        src={image}
                        alt={
                            student.fullName
                        }
                        style={{
                            width:
                                "64px",
                            height:
                                "64px",
                            borderRadius:
                                "50%",
                            objectFit:
                                "cover",
                        }}
                    />

                ) : (

                    <div
                        style={{
                            width:
                                "64px",
                            height:
                                "64px",
                            borderRadius:
                                "50%",
                            background:
                                COLORS.goldSoft,
                            color:
                                COLORS.green,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontSize:
                                "18px",
                            fontWeight:
                                "800",
                        }}
                    >
                        {
                            getInitials(
                                student
                            )
                        }
                    </div>

                )}


                <div>

                    <h3
                        style={{
                            margin: 0,
                            color:
                                COLORS.green,
                            fontSize:
                                "17px",
                            fontWeight:
                                "800",
                        }}
                    >
                        {
                            student.fullName
                        }
                    </h3>


                    <p
                        style={{
                            margin:
                                "4px 0 0",
                            color:
                                COLORS.gray,
                            fontSize:
                                "11px",
                        }}
                    >
                        {
                            student.email
                        }
                    </p>


                    <div
                        style={{
                            display:
                                "flex",
                            gap:
                                "7px",
                            marginTop:
                                "8px",
                        }}
                    >

                        <span
                            style={{
                                padding:
                                    "5px 9px",
                                borderRadius:
                                    "20px",
                                background:
                                    student.isActive
                                        ? COLORS.greenSoft
                                        : COLORS.redSoft,
                                color:
                                    student.isActive
                                        ? COLORS.greenLight
                                        : COLORS.red,
                                fontSize:
                                    "9px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            {
                                student.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                        </span>

                    </div>

                </div>

            </div>


            {/* BASIC INFORMATION */}

            <h3
                style={{
                    margin:
                        "0 0 12px",
                    color:
                        COLORS.green,
                    fontSize:
                        "14px",
                    fontWeight:
                        "800",
                }}
            >
                Basic Information
            </h3>


            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap:
                        "10px",
                    marginBottom:
                        "20px",
                }}
                className="details-grid"
            >

                <DetailBox
                    icon={
                        <Mail size={15} />
                    }
                    label="Email"
                    value={
                        student.email ||
                        "—"
                    }
                />


                <DetailBox
                    icon={
                        <Phone size={15} />
                    }
                    label="Phone"
                    value={
                        student.phone ||
                        "—"
                    }
                />


                <DetailBox
                    icon={
                        <CalendarDays
                            size={15}
                        />
                    }
                    label="Registered"
                    value={
                        formatDate(
                            student.createdAt
                        )
                    }
                />

            </div>


            {/* PERFORMANCE */}

            <h3
                style={{
                    margin:
                        "0 0 12px",
                    color:
                        COLORS.green,
                    fontSize:
                        "14px",
                    fontWeight:
                        "800",
                }}
            >
                Quiz Performance
            </h3>


            <div
                style={{
                    display:
                        "grid",
                    gridTemplateColumns:
                        "repeat(4, 1fr)",
                    gap:
                        "10px",
                    marginBottom:
                        "20px",
                }}
                className="details-stat-grid"
            >

                <MiniStat
                    label="Total Attempts"
                    value={
                        statistics.totalAttempts ??
                        0
                    }
                />


                <MiniStat
                    label="Completed"
                    value={
                        statistics.completedAttempts ??
                        0
                    }
                />


                <MiniStat
                    label="Passed"
                    value={
                        statistics.passedAttempts ??
                        0
                    }
                />


                <MiniStat
                    label="Failed"
                    value={
                        statistics.failedAttempts ??
                        0
                    }
                />

            </div>


            {/* RECENT ATTEMPTS */}

            <h3
                style={{
                    margin:
                        "0 0 12px",
                    color:
                        COLORS.green,
                    fontSize:
                        "14px",
                    fontWeight:
                        "800",
                }}
            >
                Recent Quiz Attempts
            </h3>


            {attempts.length ===
            0 ? (

                <div
                    style={{
                        padding:
                            "24px",
                        border:
                            `1px solid ${COLORS.border}`,
                        borderRadius:
                            "12px",
                        background:
                            COLORS.cream,
                        textAlign:
                            "center",
                        color:
                            COLORS.gray,
                        fontSize:
                            "11px",
                    }}
                >
                    No quiz attempts yet.
                </div>

            ) : (

                <div
                    style={{
                        border:
                            `1px solid ${COLORS.border}`,
                        borderRadius:
                            "12px",
                        overflow:
                            "hidden",
                    }}
                >

                    {attempts.map(
                        (attempt) => {

                            const completed =
                                attempt.status ===
                                "COMPLETED";


                            return (

                                <div
                                    key={
                                        attempt.id
                                    }
                                    style={{
                                        padding:
                                            "12px 14px",
                                        borderBottom:
                                            `1px solid ${COLORS.border}`,
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "space-between",
                                        gap:
                                            "12px",
                                    }}
                                >

                                    <div
                                        style={{
                                            minWidth:
                                                0,
                                            flex:
                                                1,
                                        }}
                                    >

                                        <strong
                                            style={{
                                                display:
                                                    "block",
                                                color:
                                                    COLORS.green,
                                                fontSize:
                                                    "11px",
                                            }}
                                        >
                                            {
                                                attempt.quiz
                                                    ?.title ||
                                                "Quiz"
                                            }
                                        </strong>


                                        <span
                                            style={{
                                                display:
                                                    "block",
                                                marginTop:
                                                    "3px",
                                                color:
                                                    COLORS.gray,
                                                fontSize:
                                                    "9px",
                                            }}
                                        >
                                            {
                                                formatDate(
                                                    attempt.startedAt
                                                )
                                            }
                                        </span>

                                    </div>


                                    <span
                                        style={{
                                            fontSize:
                                                "11px",
                                            fontWeight:
                                                "800",
                                            color:
                                                COLORS.green,
                                        }}
                                    >
                                        {
                                            attempt.score ??
                                            0
                                        }{" "}
                                        /{" "}
                                        {
                                            attempt.quiz
                                                ?.totalMarks ??
                                            0
                                        }
                                    </span>


                                    <span
                                        style={{
                                            padding:
                                                "5px 8px",
                                            borderRadius:
                                                "20px",
                                            background:
                                                completed
                                                    ? COLORS.greenSoft
                                                    : COLORS.goldSoft,
                                            color:
                                                completed
                                                    ? COLORS.greenLight
                                                    : "#A57800",
                                            fontSize:
                                                "8px",
                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        {
                                            completed
                                                ? "Completed"
                                                : "In Progress"
                                        }
                                    </span>

                                </div>

                            );

                        }
                    )}

                </div>

            )}


            <style>
                {`

                    @media (max-width: 700px) {

                        .details-grid,
                        .details-stat-grid {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }

                    }

                `}
            </style>

        </div>

    );

};


// ============================================================
// DETAIL BOX
// ============================================================

const DetailBox = ({
    icon,
    label,
    value,
}) => {

    return (

        <div
            style={{
                padding:
                    "12px",
                background:
                    COLORS.cream,
                border:
                    `1px solid ${COLORS.border}`,
                borderRadius:
                    "10px",
            }}
        >

            <div
                style={{
                    display:
                        "flex",
                    alignItems:
                        "center",
                    gap:
                        "6px",
                    color:
                        COLORS.greenLight,
                    fontSize:
                        "10px",
                    fontWeight:
                        "700",
                    marginBottom:
                        "5px",
                }}
            >

                {icon}

                {label}

            </div>


            <p
                style={{
                    margin: 0,
                    color:
                        COLORS.grayDark,
                    fontSize:
                        "10px",
                    wordBreak:
                        "break-word",
                }}
            >
                {value}
            </p>

        </div>

    );

};


// ============================================================
// MINI STAT
// ============================================================

const MiniStat = ({
    label,
    value,
}) => {

    return (

        <div
            style={{
                background:
                    COLORS.cream,
                border:
                    `1px solid ${COLORS.border}`,
                borderRadius:
                    "10px",
                padding:
                    "12px",
            }}
        >

            <span
                style={{
                    display:
                        "block",
                    color:
                        COLORS.gray,
                    fontSize:
                        "9px",
                    marginBottom:
                        "5px",
                }}
            >
                {label}
            </span>


            <strong
                style={{
                    color:
                        COLORS.green,
                    fontSize:
                        "18px",
                }}
            >
                {value}
            </strong>

        </div>

    );

};


// ============================================================
// TABLE STYLES
// ============================================================

const tableHeaderStyle = {

    padding:
        "12px 15px",

    color:
        "#78837D",

    fontSize:
        "9px",

    fontWeight:
        "800",

    textTransform:
        "uppercase",

    letterSpacing:
        "0.06em",

    textAlign:
        "left",

    whiteSpace:
        "nowrap",

};


const tableCellStyle = {

    padding:
        "14px 15px",

    verticalAlign:
        "middle",

};


// ============================================================
// EXPORT
// ============================================================

export default AdminStudents;