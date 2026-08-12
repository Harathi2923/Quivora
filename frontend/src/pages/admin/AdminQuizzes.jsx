import React, { useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Edit3,
    Eye,
    Trash2,
    Clock3,
    FileQuestion,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Users,
    Trophy,
    LayoutDashboard,
    Menu,
    X,
    LogOut,
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
    "http://localhost:5000/api/v1";


// ============================================================
// COLORS
// Same design language as AdminDashboard
// ============================================================

const COLORS = {
    cream: "#FAF8F2",
    green: "#023222",
    greenLight: "#0B5D45",
    greenSoft: "#E5F0EB",
    gold: "#D4A017",
    goldSoft: "#F5E9D0",
    white: "#FFFFFF",
    text: "#023222",
    gray: "#6B7280",
    grayLight: "#E5E7EB",
    red: "#EF4444",
    redSoft: "#FDEAEA",
};


// ============================================================
// PROFILE IMAGE
// ============================================================

const getProfileImageUrl = (profileImage) => {

    if (!profileImage) {
        return null;
    }

    if (
        profileImage.startsWith("http://") ||
        profileImage.startsWith("https://")
    ) {
        return profileImage;
    }

    return `http://localhost:5000${profileImage}`;
};


// ============================================================
// ADMIN QUIZZES
// ============================================================

const AdminQuizes = () => {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    // ========================================================
    // STATE
    // ========================================================

    const [quizzes, setQuizzes] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState(null);

    const [deleteQuizId, setDeleteQuizId] =
        useState(null);

    const [questionCounts, setQuestionCounts] =
        useState({});


    // ========================================================
    // FETCH QUIZZES
    // ========================================================

    const fetchQuizzes = async () => {

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


            const response =
                await fetch(
                    `${API_BASE_URL}/quizzes`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to fetch quizzes."
                );

            }


            const data =
                result?.data;


            if (Array.isArray(data)) {

                setQuizzes(data);

            } else if (
                Array.isArray(
                    data?.quizzes
                )
            ) {

                setQuizzes(
                    data.quizzes
                );

            } else if (
                Array.isArray(
                    data?.results
                )
            ) {

                setQuizzes(
                    data.results
                );

            } else {

                setQuizzes([]);

            }


        } catch (err) {

            console.error(
                "Admin quizzes error:",
                err
            );

            setError(
                err.message ||
                "Unable to load quizzes."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // FETCH QUESTION COUNTS
    // ========================================================

    const fetchQuestionCounts = async () => {

        try {

            const response =
                await fetch(
                    `${API_BASE_URL}/questions`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to fetch questions."
                );
            }

            const data = result?.data;

            const questions =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.questions)
                        ? data.questions
                        : Array.isArray(data?.results)
                            ? data.results
                            : [];

            const counts = {};

            questions.forEach((question) => {

                if (question?.isDeleted === true) {
                    return;
                }

                const quizId =
                    question?.quizId ||
                    question?.quiz?.id;

                if (!quizId) {
                    return;
                }

                counts[quizId] =
                    (counts[quizId] || 0) + 1;
            });

            setQuestionCounts(counts);

        } catch (error) {

            console.error(
                "Question count fetch error:",
                error
            );

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchQuizzes();
        fetchQuestionCounts();

    }, []);


    // ========================================================
    // CATEGORIES
    // ========================================================

const categories = [
    "Java",
    "Advanced Java",
    "Python",
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Spring Boot",
    "SQL",
    "Reasoning",
    "Aptitude",
    "General Knowledge",
];

    // ========================================================
    // FILTERED QUIZZES
    // ========================================================

    const filteredQuizzes =
        useMemo(() => {

            return quizzes.filter(
                (quiz) => {

                    const title =
                        quiz.title
                            ?.toLowerCase() ||
                        "";

                    const description =
                        quiz.description
                            ?.toLowerCase() ||
                        "";

                    const searchValue =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !searchValue ||
                        title.includes(
                            searchValue
                        ) ||
                        description.includes(
                            searchValue
                        );


                    const category =
                        quiz.category?.name ||
                        quiz.categoryName ||
                        "";

                    const matchesCategory =
                        categoryFilter === "ALL" ||
                        category.trim().toLowerCase() ===
                            categoryFilter.trim().toLowerCase();


                    const matchesStatus =
                        statusFilter ===
                            "ALL" ||

                        (
                            statusFilter ===
                                "PUBLISHED" &&
                            quiz.isPublished ===
                                true
                        ) ||

                        (
                            statusFilter ===
                                "DRAFT" &&
                            quiz.isPublished ===
                                false
                        );


                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesStatus
                    );

                }
            );

        }, [
            quizzes,
            search,
            categoryFilter,
            statusFilter,
        ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const totalQuizzes =
        quizzes.length;


    const publishedQuizzes =
        quizzes.filter(
            (quiz) =>
                quiz.isPublished === true
        ).length;


    const draftQuizzes =
        quizzes.filter(
            (quiz) =>
                quiz.isPublished === false
        ).length;


    // ========================================================
    // LOGOUT
    // ========================================================

    const handleLogout = () => {

        logout();

        setMobileMenuOpen(false);

        navigate("/login");

    };


    // ========================================================
    // NAVIGATION
    // ========================================================

    const goToDashboard = () => {

        navigate(
            "/admin/dashboard"
        );

        setMobileMenuOpen(false);

    };


    const goToQuizzes = () => {

        navigate(
            "/admin/quizzes"
        );

        setMobileMenuOpen(false);

    };


    const goToStudents = () => {

        navigate(
            "/admin/students"
        );

        setMobileMenuOpen(false);

    };


    const goToLeaderboard = () => {

        navigate(
            "/admin/leaderboard"
        );

        setMobileMenuOpen(false);

    };


    // ========================================================
    // DELETE QUIZ
    // ========================================================

const handleDelete = (quizId) => {

    setDeleteQuizId(quizId);

};


const confirmDeleteQuiz = async () => {

    if (!deleteQuizId) {
        return;
    }

    try {

        setDeletingId(deleteQuizId);

        const token =
            localStorage.getItem(
                "quivora_token"
            );

        if (!token) {

            toast.error(
                "Authentication token not found."
            );

            return;
        }

        const response =
            await fetch(
                `${API_BASE_URL}/quizzes/${deleteQuizId}`,
                {
                    method: "DELETE",

                    headers: {
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
                "Failed to delete quiz."
            );
        }

        setQuizzes(
            (previous) =>
                previous.filter(
                    (quiz) =>
                        quiz.id !==
                        deleteQuizId
                )
        );

        setQuestionCounts(
            (previous) => {

                const updated = {
                    ...previous,
                };

                delete updated[deleteQuizId];

                return updated;

            }
        );

        toast.success(
            "Quiz deleted successfully."
        );

        setDeleteQuizId(null);

    } catch (error) {

        console.error(
            "Delete quiz error:",
            error
        );

        toast.error(
            error.message ||
            "Unable to delete quiz."
        );

    } finally {

        setDeletingId(null);

    }

};


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background:
                        COLORS.cream,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "14px",
                    color: COLORS.green,
                }}
            >

                <RefreshCw
                    size={28}
                    style={{
                        animation:
                            "spin 1s linear infinite",
                    }}
                />

                <p
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        color: COLORS.gray,
                    }}
                >
                    Loading quizzes...
                </p>

                <style>
                    {`
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                    `}
                </style>

            </div>

        );

    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background:
                        COLORS.cream,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >

                <div
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        background:
                            COLORS.white,
                        border:
                            "1px solid #F0CCCC",
                        borderRadius: "20px",
                        padding: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                    }}
                >

                    <XCircle
                        size={30}
                        color={COLORS.red}
                    />


                    <div
                        style={{
                            flex: 1,
                        }}
                    >

                        <h3
                            style={{
                                margin:
                                    "0 0 5px",
                                color:
                                    COLORS.green,
                                fontSize:
                                    "17px",
                            }}
                        >
                            Unable to load quizzes
                        </h3>


                        <p
                            style={{
                                margin: 0,
                                color:
                                    COLORS.gray,
                                fontSize:
                                    "13px",
                            }}
                        >
                            {error}
                        </p>

                    </div>


                    <button
                        onClick={
                            fetchQuizzes
                        }
                        style={{
                            border: "none",
                            borderRadius:
                                "10px",
                            padding:
                                "10px 15px",
                            background:
                                COLORS.green,
                            color:
                                COLORS.white,
                            cursor:
                                "pointer",
                            fontWeight:
                                "600",
                        }}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    // ========================================================
    // MAIN
    // ========================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                background:
                    COLORS.cream,
                color:
                    COLORS.text,
            }}
        >


            {/* ==================================================
                MOBILE HEADER
            ================================================== */}

            <header
                style={{
                    display: "none",
                }}
                className="mobile-header"
            >

                <div
                    style={{
                        height: "64px",
                        padding:
                            "0 20px",
                        display: "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        background:
                            COLORS.green,
                    }}
                >

                    <img
                        src={logo}
                        alt="Quivora"
                        style={{
                            height: "48px",
                            width: "auto",
                            objectFit:
                                "contain",
                        }}
                    />


                    <button
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        style={{
                            border: "none",
                            background:
                                "transparent",
                            color:
                                COLORS.white,
                            cursor:
                                "pointer",
                            padding: "8px",
                        }}
                    >

                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}

                    </button>

                </div>


                {mobileMenuOpen && (

                    <div
                        style={{
                            padding:
                                "12px 16px 16px",
                            background:
                                COLORS.green,
                        }}
                    >

                        <MobileNavButton
                            icon={
                                <LayoutDashboard
                                    size={18}
                                />
                            }
                            label="Dashboard"
                            active={false}
                            onClick={
                                goToDashboard
                            }
                        />


                        <MobileNavButton
                            icon={
                                <BookOpen
                                    size={18}
                                />
                            }
                            label="Quizzes"
                            active={true}
                            onClick={
                                goToQuizzes
                            }
                        />


                        <MobileNavButton
                            icon={
                                <Users
                                    size={18}
                                />
                            }
                            label="Students"
                            active={false}
                            onClick={
                                goToStudents
                            }
                        />


                        <MobileNavButton
                            icon={
                                <Trophy
                                    size={18}
                                />
                            }
                            label="Leaderboard"
                            active={false}
                            onClick={
                                goToLeaderboard
                            }
                        />


                        <button
                            onClick={
                                handleLogout
                            }
                            style={{
                                width: "100%",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "12px",
                                padding:
                                    "12px 14px",
                                marginTop:
                                    "8px",
                                border:
                                    "none",
                                borderRadius:
                                    "12px",
                                background:
                                    "transparent",
                                color:
                                    "#FECACA",
                                cursor:
                                    "pointer",
                                fontSize:
                                    "14px",
                            }}
                        >

                            <LogOut
                                size={18}
                            />

                            Logout

                        </button>

                    </div>

                )}

            </header>


            {/* ==================================================
                DESKTOP NAVBAR
            ================================================== */}

            <header
                className="desktop-header"
                style={{
                    height: "80px",
                    background:
                        COLORS.green,
                    borderBottom:
                        "1px solid rgba(2,50,34,0.10)",
                    display: "flex",
                    alignItems:
                        "center",
                    padding:
                        "0 32px",
                    position:
                        "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >

                {/* LOGO */}

                <div
                    style={{
                        display: "flex",
                        alignItems:
                            "center",
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
                        alignItems:
                            "center",
                        gap: "6px",
                        marginLeft:
                            "28px",
                    }}
                >

                    <NavButton
                        icon={
                            <LayoutDashboard
                                size={17}
                            />
                        }
                        label="Dashboard"
                        active={false}
                        onClick={
                            goToDashboard
                        }
                    />


                    <NavButton
                        icon={
                            <BookOpen
                                size={17}
                            />
                        }
                        label="Quizzes"
                        active={true}
                        onClick={
                            goToQuizzes
                        }
                    />


                    <NavButton
                        icon={
                            <Users
                                size={17}
                            />
                        }
                        label="Students"
                        active={false}
                        onClick={
                            goToStudents
                        }
                    />


                    <NavButton
                        icon={
                            <Trophy
                                size={17}
                            />
                        }
                        label="Leaderboard"
                        active={false}
                        onClick={
                            goToLeaderboard
                        }
                    />

                </nav>


                {/* PROFILE */}

                <div
                onClick={()=>navigate("/admin/profile")}
                    style={{
                        marginLeft:
                            "auto",
                        display: "flex",
                        alignItems:
                            "center",
                        gap: "14px",
                    }}
                >

                    <div
                        style={{
                            textAlign:
                                "right",
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                fontWeight:
                                    "600",
                                color:
                                    COLORS.white,
                            }}
                        >
                            {user?.firstName ||
                                ""}
                            {" "}
                            {user?.lastName ||
                                ""}
                        </p>


                        <p
                            style={{
                                margin:
                                    "3px 0 0",
                                fontSize:
                                    "12px",
                                color:
                                    COLORS.gray,
                            }}
                        >
                            Administrator
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            navigate(
                                "/admin/profile"
                            )
                        }
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius:
                                "50%",
                            border: "none",
                            padding: 0,
                            overflow:
                                "hidden",
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
                            fontWeight:
                                "700",
                            cursor:
                                "pointer",
                        }}
                    >

                        {user?.profileImage ? (

                            <img
                                src={
                                    getProfileImageUrl(
                                        user.profileImage
                                    )
                                }
                                alt="Admin"
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "100%",
                                    objectFit:
                                        "cover",
                                }}
                            />

                        ) : (

                            user?.firstName?.charAt(
                                0
                            ) || "A"

                        )}

                    </button>

                </div>

            </header>


            {/* ==================================================
                PAGE CONTENT
            ================================================== */}

            <main
                style={{
                    width: "100%",
                }}
            >

                <div
                    style={{
                        width:
                            "min(1500px, calc(100% - 48px))",
                        margin:
                            "0 auto",
                        padding:
                            "26px 0 30px",
                    }}
                >


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <section
                        style={{
                            display: "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "space-between",
                            gap: "20px",
                            marginBottom:
                                "22px",
                        }}
                        className="page-header"
                    >

                        <div>

                            <p
                                style={{
                                    margin:
                                        "0 0 5px",
                                    fontSize:
                                        "13px",
                                    color:
                                        COLORS.gray,
                                }}
                            >
                                Admin Workspace
                            </p>


                            <h1
                                style={{
                                    margin: 0,
                                    fontSize:
                                        "28px",
                                    fontWeight:
                                        "800",
                                    color:
                                        COLORS.green,
                                }}
                            >
                                Quizzes
                            </h1>


                            <p
                                style={{
                                    margin:
                                        "5px 0 0",
                                    fontSize:
                                        "14px",
                                    color:
                                        COLORS.gray,
                                }}
                            >
                                Create, manage and
                                organize your
                                assessments.
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/quizzes/create"
                                )
                            }
                            style={{
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "8px",
                                border: "none",
                                borderRadius:
                                    "12px",
                                padding:
                                    "12px 18px",
                                background:
                                    COLORS.green,
                                color:
                                    COLORS.white,
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "700",
                                cursor:
                                    "pointer",
                                boxShadow:
                                    "0 4px 12px rgba(2,50,34,0.15)",
                                whiteSpace:
                                    "nowrap",
                            }}
                        >

                            <Plus size={19} />

                            Create New Quiz

                        </button>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================== */}

                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: "16px",
                            marginBottom:
                                "20px",
                        }}
                        className="stat-grid"
                    >

                        <StatCard
                            icon={
                                <BookOpen
                                    size={21}
                                />
                            }
                            title="Total Quizzes"
                            value={
                                totalQuizzes
                            }
                            background={
                                COLORS.greenSoft
                            }
                            color={
                                COLORS.greenLight
                            }
                        />


                        <StatCard
                            icon={
                                <CheckCircle2
                                    size={21}
                                />
                            }
                            title="Published"
                            value={
                                publishedQuizzes
                            }
                            background={
                                COLORS.goldSoft
                            }
                            color="#9A7100"
                        />


                        <StatCard
                            icon={
                                <Clock3
                                    size={21}
                                />
                            }
                            title="Drafts"
                            value={
                                draftQuizzes
                            }
                            background="#EEE9F7"
                            color="#66538F"
                        />

                    </section>


                    {/* =================================================
                        CATEGORY FILTER
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,
                            border:
                                "1px solid rgba(2,50,34,0.10)",
                            borderRadius:
                                "18px",
                            padding:
                                "22px",
                            marginBottom:
                                "20px",
                            boxShadow:
                                "0 2px 8px rgba(2,50,34,0.04)",
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
                                marginBottom:
                                    "15px",
                            }}
                        >

                            <div>

                                <p
                                    style={{
                                        margin:
                                            "0 0 4px",
                                        fontSize:
                                            "10px",
                                        fontWeight:
                                            "800",
                                        letterSpacing:
                                            "0.15em",
                                        color:
                                            COLORS.greenLight,
                                    }}
                                >
                                    ORGANIZE
                                </p>


                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "19px",
                                        fontWeight:
                                            "800",
                                        color:
                                            COLORS.green,
                                    }}
                                >
                                    Quiz Categories
                                </h2>

                            </div>


                            <span
                                style={{
                                    fontSize:
                                        "12px",
                                    color:
                                        COLORS.gray,
                                }}
                            >
                                {totalQuizzes}
                                {" "}
                                quizzes
                            </span>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",
                                flexWrap:
                                    "wrap",
                                gap: "8px",
                            }}
                        >

                            <CategoryButton
                                label="All"
                                active={
                                    categoryFilter ===
                                    "ALL"
                                }
                                onClick={() =>
                                    setCategoryFilter(
                                        "ALL"
                                    )
                                }
                            />


                            {categories.map(
                                (category) => (

                                    <CategoryButton
                                        key={
                                            category
                                        }
                                        label={
                                            category
                                        }
                                        active={
                                            categoryFilter ===
                                            category
                                        }
                                        onClick={() =>
                                            setCategoryFilter(
                                                category
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        QUIZ LIST
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,
                            border:
                                "1px solid rgba(2,50,34,0.10)",
                            borderRadius:
                                "18px",
                            padding:
                                "22px",
                            boxShadow:
                                "0 2px 8px rgba(2,50,34,0.04)",
                        }}
                    >

                        {/* SECTION HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: "15px",
                                marginBottom:
                                    "16px",
                            }}
                        >

                            <div>

                                <p
                                    style={{
                                        margin:
                                            "0 0 4px",
                                        fontSize:
                                            "10px",
                                        fontWeight:
                                            "800",
                                        letterSpacing:
                                            "0.15em",
                                        color:
                                            COLORS.greenLight,
                                    }}
                                >
                                    ASSESSMENTS
                                </p>


                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize:
                                            "19px",
                                        fontWeight:
                                            "800",
                                        color:
                                            COLORS.green,
                                    }}
                                >
                                    All Quizzes
                                </h2>

                            </div>


                            <span
                                style={{
                                    fontSize:
                                        "12px",
                                    color:
                                        COLORS.gray,
                                }}
                            >
                                {
                                    filteredQuizzes.length
                                }
                                {" "}
                                shown
                            </span>

                        </div>


                        {/* SEARCH + FILTER */}

                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap: "10px",
                                marginBottom:
                                    "18px",
                            }}
                            className="quiz-toolbar"
                        >

                            <div
                                style={{
                                    flex: 1,
                                    height:
                                        "44px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "9px",
                                    padding:
                                        "0 13px",
                                    background:
                                        COLORS.cream,
                                    border:
                                        "1px solid #DDD9CF",
                                    borderRadius:
                                        "11px",
                                    color:
                                        COLORS.gray,
                                }}
                            >

                                <Search
                                    size={18}
                                />


                                <input
                                    type="text"
                                    placeholder="Search quizzes..."
                                    value={search}
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    style={{
                                        width:
                                            "100%",
                                        height:
                                            "100%",
                                        border:
                                            "none",
                                        outline:
                                            "none",
                                        background:
                                            "transparent",
                                        fontSize:
                                            "13px",
                                        color:
                                            COLORS.green,
                                    }}
                                />

                            </div>


                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStatusFilter(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                style={{
                                    height:
                                        "44px",
                                    minWidth:
                                        "150px",
                                    padding:
                                        "0 12px",
                                    border:
                                        "1px solid #DDD9CF",
                                    borderRadius:
                                        "11px",
                                    background:
                                        COLORS.white,
                                    color:
                                        "#46545D",
                                    outline:
                                        "none",
                                    cursor:
                                        "pointer",
                                    fontSize:
                                        "13px",
                                }}
                            >

                                <option value="ALL">
                                    All Status
                                </option>

                                <option value="PUBLISHED">
                                    Published
                                </option>

                                <option value="DRAFT">
                                    Draft
                                </option>

                            </select>

                        </div>


                        {/* QUIZZES */}

                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "10px",
                            }}
                        >

                            {filteredQuizzes.length ===
                            0 ? (

                                <div
                                    style={{
                                        padding:
                                            "60px 20px",
                                        textAlign:
                                            "center",
                                        color:
                                            COLORS.gray,
                                    }}
                                >

                                    <BookOpen
                                        size={40}
                                        color="#A7B5AF"
                                        style={{
                                            marginBottom:
                                                "10px",
                                        }}
                                    />


                                    <h3
                                        style={{
                                            margin:
                                                "0 0 5px",
                                            color:
                                                COLORS.green,
                                            fontSize:
                                                "17px",
                                        }}
                                    >
                                        No quizzes found
                                    </h3>


                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Try changing your
                                        search or filters.
                                    </p>

                                </div>

                            ) : (

                                filteredQuizzes.map(
                                    (quiz) => (

                                        <QuizCard
                                            key={
                                                quiz.id
                                            }
                                            quiz={
                                                quiz
                                            }
                                            deleting={
                                                deletingId ===
                                                quiz.id
                                            }
                                            questionCount={
                                                questionCounts[
                                                    quiz.id
                                                ] ??
                                                quiz.questionCount ??
                                                quiz.questions?.length ??
                                                0
                                            }
                                            onView={() =>
                                                navigate(
                                                    `/admin/quizzes/${quiz.id}`
                                                )
                                            }
                                           
                                            onDelete={() =>
                                                handleDelete(
                                                    quiz.id
                                                )
                                            }
                                        />

                                    )
                                )

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        style={{
                            marginTop:
                                "30px",
                            padding:
                                "18px 0 5px",
                            borderTop:
                                "1px solid rgba(2,50,34,0.10)",
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            gap: "10px",
                            color:
                                COLORS.gray,
                            fontSize:
                                "11px",
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
                DELETE QUIZ CONFIRMATION MODAL
            ================================================== */}

            {deleteQuizId && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(2,50,34,0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px",
                    }}
                >

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "420px",
                            background:
                                COLORS.white,
                            borderRadius: "18px",
                            padding: "26px",
                            boxShadow:
                                "0 20px 60px rgba(0,0,0,0.20)",
                        }}
                    >

                        <div
                            style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "14px",
                                background:
                                    COLORS.redSoft,
                                color:
                                    COLORS.red,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "16px",
                            }}
                        >
                            <Trash2 size={22} />
                        </div>

                        <h2
                            style={{
                                margin:
                                    "0 0 8px",
                                color:
                                    COLORS.green,
                                fontSize:
                                    "20px",
                                fontWeight:
                                    "800",
                            }}
                        >
                            Delete Quiz?
                        </h2>

                        <p
                            style={{
                                margin:
                                    "0 0 24px",
                                color:
                                    COLORS.gray,
                                fontSize:
                                    "13px",
                                lineHeight:
                                    "1.6",
                            }}
                        >
                            Are you sure you want to
                            delete this quiz? This action
                            cannot be undone.
                        </p>

                        <div
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "flex-end",
                                gap: "10px",
                            }}
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteQuizId(null)
                                }
                                disabled={
                                    deletingId !== null
                                }
                                style={{
                                    height: "42px",
                                    padding:
                                        "0 18px",
                                    border:
                                        "1px solid #DDD9CF",
                                    borderRadius:
                                        "10px",
                                    background:
                                        COLORS.white,
                                    color:
                                        COLORS.gray,
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmDeleteQuiz
                                }
                                disabled={
                                    deletingId !== null
                                }
                                style={{
                                    height: "42px",
                                    padding:
                                        "0 18px",
                                    border: "none",
                                    borderRadius:
                                        "10px",
                                    background:
                                        COLORS.red,
                                    color:
                                        COLORS.white,
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "700",
                                    cursor:
                                        deletingId !== null
                                            ? "not-allowed"
                                            : "pointer",
                                    opacity:
                                        deletingId !== null
                                            ? 0.7
                                            : 1,
                                }}
                            >
                                {deletingId !== null
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================================
                RESPONSIVE CSS ONLY FOR DISPLAY BREAKPOINTS
                No external CSS / no CSS file.
            ================================================== */}

            <style>
                {`
                    @media (max-width: 900px) {

                        .desktop-header {
                            display: none !important;
                        }

                        .mobile-header {
                            display: block !important;
                        }

                        .stat-grid {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }

                    }

                    @media (max-width: 600px) {

                        .stat-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .page-header {
                            flex-direction:
                                column !important;
                            align-items:
                                flex-start !important;
                        }

                        .page-header > button {
                            width: 100%;
                            justify-content:
                                center;
                        }

                        .quiz-toolbar {
                            flex-direction:
                                column !important;
                            align-items:
                                stretch !important;
                        }

                        .quiz-toolbar select {
                            width: 100%;
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
    icon,
    label,
    active,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding:
                    "10px 14px",
                border: "none",
                borderRadius:
                    "11px",
                background: active
                    ? COLORS.gold
                    : "transparent",
                color: active
                    ? COLORS.green
                    : "#5F6B67",
                fontSize:
                    "13px",
                fontWeight:
                    active ? "700" : "500",
                cursor: "pointer",
                transition:
                    "all 0.2s ease",
            }}
        >

            {icon}

            {label}

        </button>

    );

};


// ============================================================
// MOBILE NAV BUTTON
// ============================================================

const MobileNavButton = ({
    icon,
    label,
    active,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            style={{
                width: "100%",
                display: "flex",
                alignItems:
                    "center",
                gap: "12px",
                padding:
                    "12px 14px",
                border: "none",
                borderRadius:
                    "12px",
                background: active
                    ? COLORS.gold
                    : "transparent",
                color: active
                    ? COLORS.green
                    : COLORS.white,
                fontSize:
                    "14px",
                fontWeight:
                    active ? "700" : "500",
                cursor: "pointer",
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
    title,
    value,
    background,
    color,
}) => {

    return (

        <div
            style={{
                background:
                    COLORS.white,
                border:
                    "1px solid rgba(2,50,34,0.10)",
                borderRadius:
                    "16px",
                padding:
                    "18px",
                minHeight:
                    "96px",
                display:
                    "flex",
                alignItems:
                    "center",
                justifyContent:
                    "space-between",
                gap: "12px",
                boxShadow:
                    "0 2px 8px rgba(2,50,34,0.04)",
            }}
        >

            <div>

                <p
                    style={{
                        margin: 0,
                        fontSize:
                            "13px",
                        color:
                            COLORS.gray,
                    }}
                >
                    {title}
                </p>


                <p
                    style={{
                        margin:
                            "6px 0 0",
                        fontSize:
                            "28px",
                        fontWeight:
                            "800",
                        color:
                            COLORS.green,
                    }}
                >
                    {value}
                </p>

            </div>


            <div
                style={{
                    width:
                        "46px",
                    height:
                        "46px",
                    flexShrink: 0,
                    borderRadius:
                        "12px",
                    background,
                    color,
                    display:
                        "flex",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                }}
            >
                {icon}
            </div>

        </div>

    );

};


// ============================================================
// CATEGORY BUTTON
// ============================================================

const CategoryButton = ({
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
                        ? `1px solid ${COLORS.green}`
                        : "1px solid #DDD9CF",
                background:
                    active
                        ? COLORS.green
                        : COLORS.cream,
                color:
                    active
                        ? COLORS.white
                        : "#52616B",
                padding:
                    "8px 15px",
                borderRadius:
                    "999px",
                fontSize:
                    "12px",
                fontWeight:
                    "600",
                cursor:
                    "pointer",
                transition:
                    "all 0.2s ease",
            }}
        >
            {label}
        </button>

    );

};


// ============================================================
// QUIZ CARD
// ============================================================

const QuizCard = ({
    quiz,
    deleting,
    questionCount,
    onView,
    onDelete,
}) => {

    const category =
        quiz.category?.name ||
        quiz.categoryName ||
        "Uncategorized";


    const displayedQuestionCount =
        questionCount ??
        quiz._count ?.questions ??
        quiz.questionCount ??
        quiz.questions?.length ??
        0;


    const displayedAttemptCount =
        quiz._count?.attempts ??
        quiz.attemptCount ??
        quiz.attempts?.length ??
        0;


    return (

        <article
            style={{
                display:
                    "flex",
                alignItems:
                    "center",
                gap: "15px",
                padding:
                    "16px",
                border:
                    "1px solid #E5E1D7",
                borderRadius:
                    "15px",
                background:
                    COLORS.white,
                transition:
                    "all 0.2s ease",
            }}
        >

            {/* ICON */}

            <div
                style={{
                    width:
                        "48px",
                    height:
                        "48px",
                    flexShrink: 0,
                    borderRadius:
                        "13px",
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
                }}
            >

                <BookOpen
                    size={22}
                />

            </div>


            {/* DETAILS */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "9px",
                        marginBottom:
                            "5px",
                    }}
                >

                    <h3
                        style={{
                            margin: 0,
                            fontSize:
                                "15px",
                            fontWeight:
                                "800",
                            color:
                                COLORS.green,
                            overflow:
                                "hidden",
                            textOverflow:
                                "ellipsis",
                            whiteSpace:
                                "nowrap",
                        }}
                    >
                        {quiz.title}
                    </h3>


                    <span
                        style={{
                            padding:
                                "4px 9px",
                            borderRadius:
                                "999px",
                            fontSize:
                                "9px",
                            fontWeight:
                                "800",
                            textTransform:
                                "uppercase",
                            whiteSpace:
                                "nowrap",
                            background:
                                quiz.isPublished
                                    ? COLORS.greenSoft
                                    : COLORS.goldSoft,
                            color:
                                quiz.isPublished
                                    ? COLORS.greenLight
                                    : "#9A7100",
                        }}
                    >
                        {quiz.isPublished
                            ? "Published"
                            : "Draft"}
                    </span>

                </div>


                <p
                    style={{
                        margin:
                            "0 0 9px",
                        color:
                            COLORS.gray,
                        fontSize:
                            "12px",
                        overflow:
                            "hidden",
                        textOverflow:
                            "ellipsis",
                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {quiz.description ||
                        "No description available."}
                </p>


                {/* META */}

                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "center",
                        flexWrap:
                            "wrap",
                        gap: "7px",
                    }}
                >

                    <MetaItem>
                        {category}
                    </MetaItem>


                    <MetaItem>
                        {quiz.difficulty ||
                            "EASY"}
                    </MetaItem>


                    <MetaItem
                        icon={
                            <Clock3
                                size={13}
                            />
                        }
                    >
                        {quiz.duration ??
                            0}{" "}
                        min
                    </MetaItem>


                    <MetaItem
                        icon={
                            <FileQuestion
                                size={13}
                            />
                        }
                    >
                        {displayedQuestionCount}{" "}
                        questions
                    </MetaItem>


                    <MetaItem>
                        {quiz.totalMarks ??
                            0}{" "}
                        marks
                    </MetaItem>


                    <MetaItem
                        icon={
                            <Users
                                size={13}
                            />
                        }
                    >
                        {displayedAttemptCount}{" "}
                        attempts
                    </MetaItem>

                </div>

            </div>


            {/* ACTIONS */}

            <div
                style={{
                    display:
                        "flex",
                    alignItems:
                        "center",
                    gap: "6px",
                    flexShrink: 0,
                }}
            >

                <ActionButton
                    icon={
                        <Eye size={16} />
                    }
                    title="View Quiz"
                    onClick={onView}
                />


                <ActionButton
                    icon={
                        deleting ? (
                            <RefreshCw
                                size={16}
                            />
                        ) : (
                            <Trash2
                                size={16}
                            />
                        )
                    }
                    title="Delete Quiz"
                    danger
                    disabled={deleting}
                    onClick={onDelete}
                />

            </div>

        </article>

    );

};


// ============================================================
// META ITEM
// ============================================================

const MetaItem = ({
    children,
    icon,
}) => {

    return (

        <span
            style={{
                display:
                    "inline-flex",
                alignItems:
                    "center",
                gap: "4px",
                paddingRight:
                    "8px",
                borderRight:
                    "1px solid #E3E0D8",
                color:
                    COLORS.gray,
                fontSize:
                    "10px",
            }}
        >

            {icon}

            {children}

        </span>

    );

};


// ============================================================
// ACTION BUTTON
// ============================================================

const ActionButton = ({
    icon,
    title,
    danger,
    disabled,
    onClick,
}) => {

    return (

        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            style={{
                width:
                    "34px",
                height:
                    "34px",
                display:
                    "flex",
                alignItems:
                    "center",
                justifyContent:
                    "center",
                border:
                    danger
                        ? "1px solid #F2D0D0"
                        : "1px solid #E1DDD4",
                borderRadius:
                    "9px",
                background:
                    COLORS.white,
                color:
                    danger
                        ? "#D93030"
                        : "#52616B",
                cursor:
                    disabled
                        ? "not-allowed"
                        : "pointer",
                opacity:
                    disabled ? 0.5 : 1,
            }}
        >
            {icon}
        </button>

    );

};

export default AdminQuizes;