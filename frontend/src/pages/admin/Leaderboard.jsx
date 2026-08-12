import React, { useEffect, useMemo, useState } from "react";

import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Crown,
    Filter,
    Medal,
    RefreshCw,
    Search,
    Trophy,
    Users,
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

    blue: "#3D7186",

    blueSoft: "#E7F1F5",

};


// ============================================================
// LEADERBOARD
// ============================================================

const Leaderboard = () => {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ========================================================
    // QUIZZES
    // ========================================================

    const [quizzes, setQuizzes] = useState([]);

    const [quizzesLoading, setQuizzesLoading] =
        useState(true);


    // ========================================================
    // FILTERS
    // ========================================================

    const [selectedCategory, setSelectedCategory] =
        useState("ALL");

    const [selectedQuiz, setSelectedQuiz] =
        useState("");

    const [search, setSearch] =
        useState("");


    // ========================================================
    // LEADERBOARD DATA
    // ========================================================

    const [leaderboardData, setLeaderboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    // ========================================================
    // PAGE
    // ========================================================

    const [page, setPage] =
        useState(1);

    const limit = 10;


    // ========================================================
    // CATEGORIES
    // ========================================================

    const categories = [

        "ALL",

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

        "GK",

    ];


    // ========================================================
    // TOKEN
    // ========================================================

    const getToken = () => {

        return localStorage.getItem(
            "quivora_token"
        );

    };


    // ========================================================
    // FETCH QUIZZES
    // ========================================================

    useEffect(() => {

        const fetchQuizzes = async () => {

            try {

                setQuizzesLoading(true);


                const response =
                    await fetch(
                        `${API_BASE_URL}/quizzes`
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result?.message ||
                        "Unable to load quizzes."
                    );

                }


                const data =
                    result?.data;


                if (Array.isArray(data)) {

                    setQuizzes(data);

                }

                else if (
                    Array.isArray(
                        data?.quizzes
                    )
                ) {

                    setQuizzes(
                        data.quizzes
                    );

                }

                else {

                    setQuizzes([]);

                }


            } catch (error) {

                console.error(
                    "Quiz fetch error:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load quizzes."
                );


            } finally {

                setQuizzesLoading(
                    false
                );

            }

        };


        fetchQuizzes();

    }, []);


    // ========================================================
    // CATEGORY FILTER
    // ========================================================

    const filteredQuizzes =
        useMemo(() => {

            if (
                selectedCategory === "ALL"
            ) {

                return quizzes;

            }


            return quizzes.filter(
                (quiz) => {

                    const categoryName =
                        quiz?.category?.name ||
                        quiz?.categoryName ||
                        "";

                    return (
                        categoryName
                            .toLowerCase()
                            .trim() ===
                        selectedCategory
                            .toLowerCase()
                            .trim()
                    );

                }
            );

        }, [
            quizzes,
            selectedCategory,
        ]);


    // ========================================================
    // RESET QUIZ WHEN CATEGORY CHANGES
    // ========================================================

    useEffect(() => {

        setSelectedQuiz("");

        setLeaderboardData(null);

        setPage(1);

    }, [selectedCategory]);


    // ========================================================
    // FETCH LEADERBOARD
    // ========================================================

    const fetchLeaderboard = async (
        quizId,
        requestedPage = 1
    ) => {

        if (!quizId) {

            setLeaderboardData(null);

            return;

        }


        try {

            setLoading(true);


            const token =
                getToken();


            const response =
                await fetch(
                    `${API_BASE_URL}/leaderboard/${quizId}?page=${requestedPage}&limit=${limit}`,
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
                    result?.message ||
                    "Unable to load leaderboard."
                );

            }


            setLeaderboardData(
                result?.data || null
            );


            setPage(
                result?.data?.pagination?.currentPage ||
                requestedPage
            );


        } catch (error) {

            console.error(
                "Leaderboard fetch error:",
                error
            );


            setLeaderboardData(null);


            toast.error(
                error.message ||
                "Unable to load leaderboard."
            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // SELECT QUIZ
    // ========================================================

    const handleQuizChange = (
        event
    ) => {

        const quizId =
            event.target.value;


        setSelectedQuiz(
            quizId
        );


        setSearch("");

        setPage(1);


        if (quizId) {

            fetchLeaderboard(
                quizId,
                1
            );

        } else {

            setLeaderboardData(
                null
            );

        }

    };


    // ========================================================
    // SEARCH
    // ========================================================

    const visibleLeaderboard =
        useMemo(() => {

            const list =
                leaderboardData?.leaderboard ||
                [];


            if (!search.trim()) {

                return list;

            }


            const value =
                search
                    .toLowerCase()
                    .trim();


            return list.filter(
                (student) => {

                    const name =
                        `${student.firstName || ""} ${student.lastName || ""}`
                            .toLowerCase();

                    const email =
                        (
                            student.email ||
                            ""
                        ).toLowerCase();

                    return (
                        name.includes(value) ||
                        email.includes(value)
                    );

                }
            );

        }, [
            leaderboardData,
            search,
        ]);


    // ========================================================
    // PAGINATION
    // ========================================================

    const handlePrevious =
        () => {

            if (
                !leaderboardData
                    ?.pagination
                    ?.hasPreviousPage
            ) {

                return;

            }


            const nextPage =
                page - 1;


            fetchLeaderboard(
                selectedQuiz,
                nextPage
            );

        };


    const handleNext =
        () => {

            if (
                !leaderboardData
                    ?.pagination
                    ?.hasNextPage
            ) {

                return;

            }


            const nextPage =
                page + 1;


            fetchLeaderboard(
                selectedQuiz,
                nextPage
            );

        };


    // ========================================================
    // REFRESH
    // ========================================================

    const handleRefresh =
        () => {

            if (
                selectedQuiz
            ) {

                fetchLeaderboard(
                    selectedQuiz,
                    page
                );

            }

        };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack =
        () => {

            navigate(
                "/admin/dashboard"
            );

        };


    // ========================================================
    // FORMAT TIME
    // ========================================================

    const formatTime =
        (seconds) => {

            if (
                seconds === null ||
                seconds === undefined
            ) {

                return "-";

            }


            const totalSeconds =
                Number(seconds);


            if (
                Number.isNaN(
                    totalSeconds
                )
            ) {

                return "-";

            }


            const minutes =
                Math.floor(
                    totalSeconds / 60
                );

            const remaining =
                totalSeconds % 60;


            return `${minutes}m ${remaining}s`;

        };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate =
        (date) => {

            if (!date) {

                return "-";

            }


            try {

                return new Date(
                    date
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                    }
                );

            } catch {

                return "-";

            }

        };


    // ========================================================
    // GET STUDENT INITIALS
    // ========================================================

    const getInitials =
        (student) => {

            const first =
                student?.firstName
                    ?.charAt(0) || "";

            const last =
                student?.lastName
                    ?.charAt(0) || "";


            return (
                `${first}${last}`
                    .toUpperCase() ||
                "S"
            );

        };


    // ========================================================
    // TOP 3
    // ========================================================

    const topThree =
        leaderboardData?.leaderboard
            ?.slice(0, 3) || [];


    // ========================================================
    // RANK STYLE
    // ========================================================

    const getRankStyle =
        (rank) => {

            if (rank === 1) {

                return {

                    background:
                        COLORS.goldSoft,

                    color:
                        "#A27400",

                };

            }


            if (rank === 2) {

                return {

                    background:
                        "#ECECEC",

                    color:
                        "#555555",

                };

            }


            if (rank === 3) {

                return {

                    background:
                        "#F4E3D2",

                    color:
                        "#9A6338",

                };

            }


            return {

                background:
                    COLORS.greenSoft,

                color:
                    COLORS.greenLight,

            };

        };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <div
            style={{
                minHeight:
                    "100vh",

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
                    height:
                        "80px",

                    background:
                        COLORS.green,

                    borderBottom:
                        "1px solid rgba(2,50,34,0.10)",

                    display:
                        "flex",

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
                        display:
                            "flex",

                        alignItems:
                            "center",
                    }}
                >

                    <img
                        src={logo}
                        alt="Quivora"
                        style={{
                            height:
                                "55px",

                            width:
                                "auto",

                            objectFit:
                                "contain",
                        }}
                    />

                </div>


                {/* NAVIGATION */}

                <nav
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "6px",

                        marginLeft:
                            "28px",
                    }}
                >

                    <NavButton
                        label="Dashboard"
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                    />


                    <NavButton
                        label="Quizzes"
                        icon={
                            <BookOpen
                                size={17}
                            />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/quizzes"
                            )
                        }
                    />


                    <NavButton
                        label="Students"
                        icon={
                            <Users
                                size={17}
                            />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/students"
                            )
                        }
                    />


                    <NavButton
                        label="Leaderboard"
                        active
                        icon={
                            <Trophy
                                size={17}
                            />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/leaderboard"
                            )
                        }
                    />

                </nav>


                {/* ADMIN */}

                <div
                    style={{
                        marginLeft:
                            "auto",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "12px",
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
                            width:
                                "43px",

                            height:
                                "43px",

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

                            fontWeight:
                                "800",

                            overflow:
                                "hidden",
                        }}
                    >

                        {user?.profileImage ? (

                            <img
                                src={
                                    `http://localhost:5000${user.profileImage}`
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
                            "min(1250px, calc(100% - 48px))",

                        margin:
                            "0 auto",

                        padding:
                            "12px 0 40px",
                    }}
                >

                    {/* BACK */}

                    <button
                        onClick={
                            handleBack
                        }
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "6px",

                            border:
                                "none",

                            background:
                                "transparent",

                            color:
                                COLORS.greenLight,

                            fontSize:
                                "13px",

                            fontWeight:
                                "600",

                            cursor:
                                "pointer",

                            padding:
                                "2px 0",

                            marginBottom:
                                "10px",
                        }}
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Back to Dashboard

                    </button>


                    {/* PAGE HEADER */}

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "flex-end",

                            gap:
                                "20px",

                            marginBottom:
                                "20px",
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
                                        "10px",

                                    fontWeight:
                                        "800",

                                    letterSpacing:
                                        "0.16em",
                                }}
                            >
                                PERFORMANCE & RANKINGS
                            </p>


                            <h1
                                style={{
                                    margin: 0,

                                    color:
                                        COLORS.green,

                                    fontSize:
                                        "28px",

                                    fontWeight:
                                        "800",
                                }}
                            >

                                Leaderboard

                            </h1>


                            <p
                                style={{
                                    margin:
                                        "6px 0 0",

                                    color:
                                        COLORS.gray,

                                    fontSize:
                                        "13px",
                                }}
                            >

                                View student rankings and
                                quiz performance.

                            </p>

                        </div>


                        {selectedQuiz && (

                            <button
                                type="button"
                                onClick={
                                    handleRefresh
                                }
                                disabled={
                                    loading
                                }
                                style={{
                                    height:
                                        "42px",

                                    padding:
                                        "0 15px",

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    borderRadius:
                                        "10px",

                                    background:
                                        COLORS.white,

                                    color:
                                        COLORS.green,

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "7px",

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        "700",

                                    cursor:
                                        "pointer",

                                    opacity:
                                        loading
                                            ? 0.6
                                            : 1,
                                }}
                            >

                                <RefreshCw
                                    size={15}
                                    className={
                                        loading
                                            ? "spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        )}

                    </div>


                    {/* =================================================
                        FILTER CARD
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,

                            border:
                                `1px solid ${COLORS.border}`,

                            borderRadius:
                                "16px",

                            padding:
                                "20px",

                            marginBottom:
                                "18px",

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

                                gap:
                                    "10px",

                                marginBottom:
                                    "16px",
                            }}
                        >

                            <div
                                style={{
                                    width:
                                        "38px",

                                    height:
                                        "38px",

                                    borderRadius:
                                        "10px",

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

                                <Filter
                                    size={18}
                                />

                            </div>


                            <div>

                                <h2
                                    style={{
                                        margin: 0,

                                        fontSize:
                                            "15px",

                                        fontWeight:
                                            "800",

                                        color:
                                            COLORS.green,
                                    }}
                                >

                                    Leaderboard Filters

                                </h2>


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

                                    Select a category and quiz
                                    to view rankings.

                                </p>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "minmax(180px, 0.7fr) minmax(280px, 1.3fr)",

                                gap:
                                    "14px",
                            }}
                            className="leaderboard-filter-grid"
                        >

                            {/* CATEGORY */}

                            <div>

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            COLORS.green,

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "700",
                                    }}
                                >

                                    Quiz Category

                                </label>


                                <select
                                    value={
                                        selectedCategory
                                    }
                                    onChange={(event) =>
                                        setSelectedCategory(
                                            event.target.value
                                        )
                                    }
                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "44px",

                                        boxSizing:
                                            "border-box",

                                        padding:
                                            "0 12px",

                                        border:
                                            "1px solid #DCD8CF",

                                        borderRadius:
                                            "10px",

                                        background:
                                            COLORS.white,

                                        color:
                                            COLORS.green,

                                        outline:
                                            "none",

                                        fontSize:
                                            "12px",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category
                                                }
                                                value={
                                                    category
                                                }
                                            >

                                                {category ===
                                                    "ALL"
                                                    ? "All Categories"
                                                    : category}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* QUIZ */}

                            <div>

                                <label
                                    style={{
                                        display:
                                            "block",

                                        marginBottom:
                                            "7px",

                                        color:
                                            COLORS.green,

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "700",
                                    }}
                                >

                                    Select Quiz

                                </label>


                                <select
                                    value={
                                        selectedQuiz
                                    }
                                    onChange={
                                        handleQuizChange
                                    }
                                    disabled={
                                        quizzesLoading
                                    }
                                    style={{
                                        width:
                                            "100%",

                                        height:
                                            "44px",

                                        boxSizing:
                                            "border-box",

                                        padding:
                                            "0 12px",

                                        border:
                                            "1px solid #DCD8CF",

                                        borderRadius:
                                            "10px",

                                        background:
                                            COLORS.white,

                                        color:
                                            COLORS.green,

                                        outline:
                                            "none",

                                        fontSize:
                                            "12px",

                                        cursor:
                                            "pointer",

                                        opacity:
                                            quizzesLoading
                                                ? 0.6
                                                : 1,
                                    }}
                                >

                                    <option value="">

                                        {quizzesLoading
                                            ? "Loading quizzes..."
                                            : filteredQuizzes.length ===
                                                0
                                            ? "No quizzes available"
                                            : "Select a quiz"}

                                    </option>


                                    {filteredQuizzes.map(
                                        (quiz) => (

                                            <option
                                                key={
                                                    quiz.id
                                                }
                                                value={
                                                    quiz.id
                                                }
                                            >

                                                {quiz.title}

                                                {quiz.category?.name
                                                    ? ` — ${quiz.category.name}`
                                                    : ""}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        NO QUIZ SELECTED
                    ================================================== */}

                    {!selectedQuiz &&
                        !loading && (

                            <div
                                style={{
                                    background:
                                        COLORS.white,

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    borderRadius:
                                        "16px",

                                    minHeight:
                                        "100px",

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "center",

                                    justifyContent:
                                        "center",

                                    textAlign:
                                        "center",

                                    padding:
                                        "30px",
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                            "65px",

                                        height:
                                            "65px",

                                        borderRadius:
                                            "18px",

                                        background:
                                            COLORS.goldSoft,

                                        color:
                                            COLORS.gold,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "center",

                                        marginBottom:
                                            "14px",
                                    }}
                                >

                                    <Trophy
                                        size={30}
                                    />

                                </div>


                                <h2
                                    style={{
                                        margin:
                                            "0 0 7px",

                                        color:
                                            COLORS.green,

                                        fontSize:
                                            "17px",

                                        fontWeight:
                                            "800",
                                    }}
                                >

                                    Select a Quiz

                                </h2>


                                <p
                                    style={{
                                        margin: 0,

                                        maxWidth:
                                            "430px",

                                        color:
                                            COLORS.gray,

                                        fontSize:
                                            "12px",

                                        lineHeight:
                                            "1.6",
                                    }}
                                >

                                    Choose a quiz from the
                                    dropdown above to view
                                    its student rankings.

                                </p>

                            </div>

                        )}


                    {/* =================================================
                        LOADING
                    ================================================== */}

                    {loading && (

                        <div
                            style={{
                                background:
                                    COLORS.white,

                                border:
                                    `1px solid ${COLORS.border}`,

                                borderRadius:
                                    "16px",

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
                                    "13px",
                            }}
                        >

                            <RefreshCw
                                size={20}
                                className="spin"
                            />

                            Loading leaderboard...

                        </div>

                    )}


                    {/* =================================================
                        LEADERBOARD
                    ================================================== */}

                    {!loading &&
                        selectedQuiz &&
                        leaderboardData && (

                            <>

                                {/* QUIZ SUMMARY */}

                                <section
                                    style={{
                                        background:
                                            COLORS.green,

                                        borderRadius:
                                            "16px",

                                        padding:
                                            "20px 24px",

                                        marginBottom:
                                            "18px",

                                        color:
                                            COLORS.white,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap:
                                            "16px",
                                    }}
                                >

                                    <div
                                        style={{
                                            width:
                                                "48px",

                                            height:
                                                "48px",

                                            flexShrink:
                                                0,

                                            borderRadius:
                                                "13px",

                                            background:
                                                "rgba(255,255,255,0.10)",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "center",

                                            color:
                                                COLORS.gold,
                                        }}
                                    >

                                        <Trophy
                                            size={25}
                                        />

                                    </div>


                                    <div
                                        style={{
                                            flex: 1,

                                            minWidth:
                                                0,
                                        }}
                                    >

                                        <p
                                            style={{
                                                margin: 0,

                                                color:
                                                    COLORS.gold,

                                                fontSize:
                                                    "10px",

                                                fontWeight:
                                                    "800",

                                                letterSpacing:
                                                    "0.08em",
                                            }}
                                        >

                                            QUIZ LEADERBOARD

                                        </p>


                                        <h2
                                            style={{
                                                margin:
                                                    "4px 0 3px",

                                                fontSize:
                                                    "18px",

                                                fontWeight:
                                                    "800",

                                                whiteSpace:
                                                    "nowrap",

                                                overflow:
                                                    "hidden",

                                                textOverflow:
                                                    "ellipsis",
                                            }}
                                        >

                                            {
                                                leaderboardData.quizTitle
                                            }

                                        </h2>


                                        <p
                                            style={{
                                                margin: 0,

                                                color:
                                                    "rgba(255,255,255,0.65)",

                                                fontSize:
                                                    "10px",
                                            }}
                                        >

                                            {
                                                leaderboardData.participants ||
                                                0
                                            }{" "}
                                            participants •{" "}

                                            {
                                                leaderboardData.totalMarks ||
                                                0
                                            }{" "}
                                            total marks

                                        </p>

                                    </div>


                                    <div
                                        style={{
                                            textAlign:
                                                "right",
                                        }}
                                    >

                                        <p
                                            style={{
                                                margin: 0,

                                                color:
                                                    "rgba(255,255,255,0.60)",

                                                fontSize:
                                                    "9px",
                                            }}
                                        >

                                            Your Rank

                                        </p>


                                        <strong
                                            style={{
                                                display:
                                                    "block",

                                                marginTop:
                                                    "3px",

                                                color:
                                                    COLORS.gold,

                                                fontSize:
                                                    "22px",
                                            }}
                                        >

                                            {leaderboardData.myRank
                                                ? `#${leaderboardData.myRank}`
                                                : "-"}

                                        </strong>

                                    </div>

                                </section>


                                {/* TOP THREE */}

                                {topThree.length > 0 && (

                                    <section
                                        style={{
                                            display:
                                                "grid",

                                            gridTemplateColumns:
                                                "repeat(3, 1fr)",

                                            gap:
                                                "14px",

                                            marginBottom:
                                                "18px",
                                        }}
                                        className="top-three-grid"
                                    >

                                        {topThree.map(
                                            (student) => {

                                                const rank =
                                                    student.rank;

                                                const isFirst =
                                                    rank ===
                                                    1;

                                                return (

                                                    <div
                                                        key={
                                                            student.studentId
                                                        }
                                                        style={{
                                                            background:
                                                                COLORS.white,

                                                            border:
                                                                `1px solid ${COLORS.border}`,

                                                            borderRadius:
                                                                "15px",

                                                            padding:
                                                                "20px",

                                                            textAlign:
                                                                "center",

                                                            boxShadow:
                                                                isFirst
                                                                    ? "0 5px 18px rgba(212,160,23,0.12)"
                                                                    : "0 2px 7px rgba(2,50,34,0.03)",

                                                            position:
                                                                "relative",
                                                        }}
                                                    >

                                                        {isFirst && (

                                                            <div
                                                                style={{
                                                                    position:
                                                                        "absolute",

                                                                    top:
                                                                        "12px",

                                                                    right:
                                                                        "12px",

                                                                    color:
                                                                        COLORS.gold,
                                                                }}
                                                            >

                                                                <Crown
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                            </div>

                                                        )}


                                                        <div
                                                            style={{
                                                                width:
                                                                    "52px",

                                                                height:
                                                                    "52px",

                                                                borderRadius:
                                                                    "50%",

                                                                margin:
                                                                    "0 auto 9px",

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

                                                                fontWeight:
                                                                    "800",

                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                        >

                                                            {getInitials(
                                                                student
                                                            )}

                                                        </div>


                                                        <div
                                                            style={{
                                                                width:
                                                                    "30px",

                                                                height:
                                                                    "30px",

                                                                borderRadius:
                                                                    "50%",

                                                                margin:
                                                                    "0 auto 8px",

                                                                display:
                                                                    "flex",

                                                                alignItems:
                                                                    "center",

                                                                justifyContent:
                                                                    "center",

                                                                ...getRankStyle(
                                                                    rank
                                                                ),

                                                                fontWeight:
                                                                    "800",

                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >

                                                            #{rank}

                                                        </div>


                                                        <h3
                                                            style={{
                                                                margin:
                                                                    "0 0 4px",

                                                                color:
                                                                    COLORS.green,

                                                                fontSize:
                                                                    "13px",

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

                                                        </h3>


                                                        <p
                                                            style={{
                                                                margin:
                                                                    "0 0 10px",

                                                                color:
                                                                    COLORS.gray,

                                                                fontSize:
                                                                    "9px",
                                                            }}
                                                        >

                                                            {
                                                                student.email
                                                            }

                                                        </p>


                                                        <div
                                                            style={{
                                                                background:
                                                                    COLORS.cream,

                                                                borderRadius:
                                                                    "9px",

                                                                padding:
                                                                    "9px",
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
                                                                }}
                                                            >

                                                                Score

                                                            </span>


                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",

                                                                    marginTop:
                                                                        "3px",

                                                                    color:
                                                                        COLORS.green,

                                                                    fontSize:
                                                                        "18px",
                                                                }}
                                                            >

                                                                {
                                                                    student.score
                                                                }{" "}

                                                                <span
                                                                    style={{
                                                                        color:
                                                                            COLORS.gray,

                                                                        fontSize:
                                                                            "10px",

                                                                        fontWeight:
                                                                            "500",
                                                                    }}
                                                                >

                                                                    /{" "}

                                                                    {
                                                                        student.totalMarks
                                                                    }

                                                                </span>

                                                            </strong>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </section>

                                )}


                                {/* SEARCH */}

                                <section
                                    style={{
                                        background:
                                            COLORS.white,

                                        border:
                                            `1px solid ${COLORS.border}`,

                                        borderRadius:
                                            "14px",

                                        padding:
                                            "15px 18px",

                                        marginBottom:
                                            "12px",

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap:
                                            "10px",
                                    }}
                                >

                                    <Search
                                        size={17}
                                        color={
                                            COLORS.gray
                                        }
                                    />


                                    <input
                                        type="text"
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSearch(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search student by name or email..."
                                        style={{
                                            flex:
                                                1,

                                            border:
                                                "none",

                                            outline:
                                                "none",

                                            background:
                                                "transparent",

                                            color:
                                                COLORS.green,

                                            fontSize:
                                                "12px",
                                        }}
                                    />

                                </section>


                                {/* TABLE */}

                                <section
                                    style={{
                                        background:
                                            COLORS.white,

                                        border:
                                            `1px solid ${COLORS.border}`,

                                        borderRadius:
                                            "16px",

                                        overflow:
                                            "hidden",

                                        boxShadow:
                                            "0 2px 8px rgba(2,50,34,0.04)",
                                    }}
                                >

                                    {/* TABLE HEADER */}

                                    <div
                                        style={{
                                            padding:
                                                "18px 20px",

                                            borderBottom:
                                                `1px solid ${COLORS.border}`,

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            justifyContent:
                                                "space-between",
                                        }}
                                    >

                                        <div>

                                            <h2
                                                style={{
                                                    margin: 0,

                                                    color:
                                                        COLORS.green,

                                                    fontSize:
                                                        "15px",

                                                    fontWeight:
                                                        "800",
                                                }}
                                            >

                                                Student Rankings

                                            </h2>


                                            <p
                                                style={{
                                                    margin:
                                                        "4px 0 0",

                                                    color:
                                                        COLORS.gray,

                                                    fontSize:
                                                        "10px",
                                                }}
                                            >

                                                Highest score ranks
                                                first.

                                            </p>

                                        </div>


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
                                            }}
                                        >

                                            <Users
                                                size={14}
                                            />

                                            {
                                                leaderboardData.participants ||
                                                0
                                            }{" "}
                                            Students

                                        </div>

                                    </div>


                                    {/* DESKTOP TABLE */}

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
                                                        Rank
                                                    </th>

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
                                                        Score
                                                    </th>

                                                    <th
                                                        style={
                                                            tableHeaderStyle
                                                        }
                                                    >
                                                        Time Taken
                                                    </th>

                                                    <th
                                                        style={
                                                            tableHeaderStyle
                                                        }
                                                    >
                                                        Submitted
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {visibleLeaderboard.length >
                                                0 ? (

                                                    visibleLeaderboard.map(
                                                        (
                                                            student
                                                        ) => {

                                                            const rank =
                                                                student.rank;

                                                            const isTop =
                                                                rank <=
                                                                3;

                                                            return (

                                                                <tr
                                                                    key={
                                                                        student.studentId
                                                                    }
                                                                    style={{
                                                                        borderTop:
                                                                            `1px solid ${COLORS.border}`,

                                                                        background:
                                                                            student.isCurrentStudent
                                                                                ? "#F8F4E8"
                                                                                : COLORS.white,
                                                                    }}
                                                                >

                                                                    {/* RANK */}

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

                                                                                justifyContent:
                                                                                    "center",

                                                                                width:
                                                                                    "31px",

                                                                                height:
                                                                                    "31px",

                                                                                borderRadius:
                                                                                    "50%",

                                                                                margin:
                                                                                    "0 auto",

                                                                                ...getRankStyle(
                                                                                    rank
                                                                                ),

                                                                                fontSize:
                                                                                    "10px",

                                                                                fontWeight:
                                                                                    "800",
                                                                            }}
                                                                        >

                                                                            {isTop
                                                                                ? rank ===
                                                                                  1
                                                                                    ? "🥇"
                                                                                    : rank ===
                                                                                      2
                                                                                    ? "🥈"
                                                                                    : "🥉"
                                                                                : `#${rank}`}

                                                                        </div>

                                                                    </td>


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
                                                                                    "10px",
                                                                            }}
                                                                        >

                                                                            <div
                                                                                style={{
                                                                                    width:
                                                                                        "34px",

                                                                                    height:
                                                                                        "34px",

                                                                                    borderRadius:
                                                                                        "50%",

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

                                                                                    fontSize:
                                                                                        "10px",

                                                                                    fontWeight:
                                                                                        "800",

                                                                                    flexShrink:
                                                                                        0,
                                                                                }}
                                                                            >

                                                                                {getInitials(
                                                                                    student
                                                                                )}

                                                                            </div>


                                                                            <div>

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
                                                                                        student.firstName
                                                                                    }{" "}

                                                                                    {
                                                                                        student.lastName
                                                                                    }

                                                                                </strong>


                                                                                {student.isCurrentStudent && (

                                                                                    <span
                                                                                        style={{
                                                                                            display:
                                                                                                "inline-block",

                                                                                            marginTop:
                                                                                                "3px",

                                                                                            padding:
                                                                                                "2px 6px",

                                                                                            borderRadius:
                                                                                                "20px",

                                                                                            background:
                                                                                                COLORS.goldSoft,

                                                                                            color:
                                                                                                "#9A7000",

                                                                                            fontSize:
                                                                                                "7px",

                                                                                            fontWeight:
                                                                                                "800",
                                                                                        }}
                                                                                    >

                                                                                        YOU

                                                                                    </span>

                                                                                )}

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    {/* EMAIL */}

                                                                    <td
                                                                        style={
                                                                            tableCellStyle
                                                                        }
                                                                    >

                                                                        <span
                                                                            style={{
                                                                                color:
                                                                                    COLORS.gray,

                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >

                                                                            {
                                                                                student.email
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* SCORE */}

                                                                    <td
                                                                        style={
                                                                            tableCellStyle
                                                                        }
                                                                    >

                                                                        <strong
                                                                            style={{
                                                                                color:
                                                                                    COLORS.green,

                                                                                fontSize:
                                                                                    "12px",
                                                                            }}
                                                                        >

                                                                            {
                                                                                student.score
                                                                            }

                                                                            <span
                                                                                style={{
                                                                                    color:
                                                                                        COLORS.gray,

                                                                                    fontSize:
                                                                                        "9px",

                                                                                    fontWeight:
                                                                                        "500",
                                                                                }}
                                                                            >

                                                                                {" "}
                                                                                /{" "}

                                                                                {
                                                                                    student.totalMarks
                                                                                }

                                                                            </span>

                                                                        </strong>

                                                                    </td>


                                                                    {/* TIME */}

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
                                                                                    "5px",

                                                                                color:
                                                                                    COLORS.gray,

                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >

                                                                            <Clock3
                                                                                size={
                                                                                    13
                                                                                }
                                                                            />

                                                                            {
                                                                                formatTime(
                                                                                    student.timeTaken
                                                                                )
                                                                            }

                                                                        </div>

                                                                    </td>


                                                                    {/* DATE */}

                                                                    <td
                                                                        style={
                                                                            tableCellStyle
                                                                        }
                                                                    >

                                                                        <span
                                                                            style={{
                                                                                color:
                                                                                    COLORS.gray,

                                                                                fontSize:
                                                                                    "10px",
                                                                            }}
                                                                        >

                                                                            {
                                                                                formatDate(
                                                                                    student.submittedAt
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </td>

                                                                </tr>

                                                            );

                                                        }
                                                    )

                                                ) : (

                                                    <tr>

                                                        <td
                                                            colSpan={
                                                                6
                                                            }
                                                            style={{
                                                                padding:
                                                                    "55px 20px",

                                                                textAlign:
                                                                    "center",

                                                                color:
                                                                    COLORS.gray,

                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >

                                                            <Trophy
                                                                size={
                                                                    28
                                                                }
                                                                style={{
                                                                    marginBottom:
                                                                        "8px",
                                                                }}
                                                            />

                                                            <div>

                                                                No students
                                                                found.

                                                            </div>

                                                        </td>

                                                    </tr>

                                                )}

                                            </tbody>

                                        </table>

                                    </div>


                                    {/* PAGINATION */}

                                    <div
                                        style={{
                                            borderTop:
                                                `1px solid ${COLORS.border}`,

                                            padding:
                                                "13px 18px",

                                            display:
                                                "flex",

                                            justifyContent:
                                                "space-between",

                                            alignItems:
                                                "center",

                                            gap:
                                                "12px",
                                        }}
                                    >

                                        <span
                                            style={{
                                                color:
                                                    COLORS.gray,

                                                fontSize:
                                                    "10px",
                                            }}
                                        >

                                            Page{" "}
                                            <strong
                                                style={{
                                                    color:
                                                        COLORS.green,
                                                }}
                                            >

                                                {
                                                    leaderboardData
                                                        .pagination
                                                        ?.currentPage ||
                                                    1
                                                }

                                            </strong>{" "}

                                            of{" "}

                                            {
                                                leaderboardData
                                                    .pagination
                                                    ?.totalPages ||
                                                1
                                            }

                                        </span>


                                        <div
                                            style={{
                                                display:
                                                    "flex",

                                                gap:
                                                    "7px",
                                            }}
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    handlePrevious
                                                }
                                                disabled={
                                                    !leaderboardData
                                                        .pagination
                                                        ?.hasPreviousPage ||
                                                    loading
                                                }
                                                style={{
                                                    width:
                                                        "35px",

                                                    height:
                                                        "35px",

                                                    border:
                                                        `1px solid ${COLORS.border}`,

                                                    borderRadius:
                                                        "9px",

                                                    background:
                                                        COLORS.white,

                                                    color:
                                                        COLORS.green,

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

                                                    cursor:
                                                        "pointer",

                                                    opacity:
                                                        !leaderboardData
                                                            .pagination
                                                            ?.hasPreviousPage ||
                                                        loading
                                                            ? 0.4
                                                            : 1,
                                                }}
                                            >

                                                <ChevronLeft
                                                    size={
                                                        16
                                                    }
                                                />

                                            </button>


                                            <button
                                                type="button"
                                                onClick={
                                                    handleNext
                                                }
                                                disabled={
                                                    !leaderboardData
                                                        .pagination
                                                        ?.hasNextPage ||
                                                    loading
                                                }
                                                style={{
                                                    width:
                                                        "35px",

                                                    height:
                                                        "35px",

                                                    border:
                                                        `1px solid ${COLORS.border}`,

                                                    borderRadius:
                                                        "9px",

                                                    background:
                                                        COLORS.green,

                                                    color:
                                                        COLORS.white,

                                                    display:
                                                        "flex",

                                                    alignItems:
                                                        "center",

                                                    justifyContent:
                                                        "center",

                                                    cursor:
                                                        "pointer",

                                                    opacity:
                                                        !leaderboardData
                                                            .pagination
                                                            ?.hasNextPage ||
                                                        loading
                                                            ? 0.4
                                                            : 1,
                                                }}
                                            >

                                                <ChevronRight
                                                    size={
                                                        16
                                                    }
                                                />

                                            </button>

                                        </div>

                                    </div>

                                </section>

                            </>

                        )}

                </div>

            </main>


            {/* ==================================================
                RESPONSIVE + ANIMATION
            ================================================== */}

            <style>
                {`

                    .spin {
                        animation:
                            leaderboard-spin
                            1s linear infinite;
                    }

                    @keyframes leaderboard-spin {

                        from {
                            transform:
                                rotate(0deg);
                        }

                        to {
                            transform:
                                rotate(360deg);
                        }

                    }


                    @media (max-width: 850px) {

                        .leaderboard-filter-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .top-three-grid {
                            grid-template-columns:
                                1fr !important;
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

                        main > div {
                            width:
                                calc(100% - 24px) !important;
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
// TABLE HEADER STYLE
// ============================================================

const tableHeaderStyle = {

    padding:
        "12px 14px",

    textAlign:
        "left",

    color:
        "#758078",

    fontSize:
        "9px",

    fontWeight:
        "800",

    textTransform:
        "uppercase",

    letterSpacing:
        "0.05em",

    whiteSpace:
        "nowrap",

};


// ============================================================
// TABLE CELL STYLE
// ============================================================

const tableCellStyle = {

    padding:
        "13px 14px",

    verticalAlign:
        "middle",

};


export default Leaderboard;