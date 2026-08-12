import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    ClipboardCheck,
    LogOut,
    CheckCircle2,
    XCircle,
    Menu,
    X,
    TrendingUp,
    PieChart as PieChartIcon,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../../assets/logo/quivora-logo.png";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:5000/api/v1";
// ============================================================
// PROFILE IMAGE URL
// ============================================================

const getProfileImageUrl = (profileImage) => {

    if (!profileImage) {
        return null;
    }

    // If backend already returns a complete URL
    if (
        profileImage.startsWith("http://") ||
        profileImage.startsWith("https://")
    ) {
        return profileImage;
    }

    // Backend returns:
    // /uploads/profiles/profile-xxx.png

    return `http://localhost:5000${profileImage}`;
};


// ============================================================
// STUDENT DASHBOARD
// ============================================================

const StudentDashboard = () => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [dashboardData, setDashboardData] = useState(null);

    const [loading, setLoading] = useState(true);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


    // =========================================================
    // FETCH STUDENT DASHBOARD
    // =========================================================

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                setLoading(true);


                const token =
                    localStorage.getItem("quivora_token");


                if (!token) {

                    throw new Error(
                        "Authentication token not found."
                    );

                }


                const response =
                    await fetch(
                        `${API_BASE_URL}/attempts/dashboard`,
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


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load dashboard."
                    );

                }


                setDashboardData(
                    data.data
                );

            } catch (error) {

                console.error(
                    "Failed to fetch student dashboard:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load dashboard."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, []);


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = useMemo(() => {

        return (
            dashboardData?.statistics || {
                availableQuizzes: 0,
                completedQuizzes: 0,
                passedQuizzes: 0,
                failedQuizzes: 0,
            }
        );

    }, [dashboardData]);


    // =========================================================
    // PERFORMANCE DATA
    //
    // One quiz = one graph point.
    //
    // If old testing data contains multiple attempts for the
    // same quiz, only the latest attempt is used.
    // =========================================================

    const performanceData = useMemo(() => {

        const performance =
            dashboardData?.performance || [];


        const latestByQuiz =
            new Map();


        performance.forEach((item) => {

            if (!item?.quizId) {
                return;
            }


            const existing =
                latestByQuiz.get(
                    item.quizId
                );


            if (!existing) {

                latestByQuiz.set(
                    item.quizId,
                    item
                );

                return;
            }


            const existingDate =
                existing.submittedAt
                    ? new Date(
                        existing.submittedAt
                    ).getTime()
                    : 0;


            const currentDate =
                item.submittedAt
                    ? new Date(
                        item.submittedAt
                    ).getTime()
                    : 0;


            if (
                currentDate >=
                existingDate
            ) {

                latestByQuiz.set(
                    item.quizId,
                    item
                );

            }

        });


        return Array.from(
            latestByQuiz.values()
        );

    }, [dashboardData]);


    // =========================================================
    // PIE CHART DATA
    //
    // Shows how many completed quizzes belong to each quiz.
    // No dummy values.
    // =========================================================

    const quizDistribution = useMemo(() => {

        const counts = new Map();


        performanceData.forEach((item) => {

            const quizTitle =
                item.quizTitle ||
                "Unnamed Quiz";


            counts.set(
                quizTitle,
                (counts.get(quizTitle) || 0) + 1
            );

        });


        return Array.from(
            counts.entries()
        ).map(
            ([name, count]) => ({
                name,
                count,
            })
        );

    }, [performanceData]);


    // =========================================================
    // PIE CHART CONIC GRADIENT
    // =========================================================

    const pieGradient = useMemo(() => {

        if (
            quizDistribution.length === 0
        ) {

            return "conic-gradient(#E5E7EB 0deg 360deg)";

        }


        const total =
            quizDistribution.reduce(
                (sum, item) =>
                    sum + item.count,
                0
            );


        const chartColors = [
            "#D4A017",
            "#0B5D45",
            "#5D4A8A",
            "#C96B3B",
            "#3578A8",
            "#7A5B00",
        ];


        let currentDegree = 0;


        const segments =
            quizDistribution.map(
                (item, index) => {

                    const degree =
                        (
                            item.count /
                            total
                        ) * 360;


                    const start =
                        currentDegree;


                    const end =
                        currentDegree +
                        degree;


                    currentDegree = end;


                    return `${
                        chartColors[
                            index %
                            chartColors.length
                        ]
                    } ${start}deg ${end}deg`;

                }
            );


        return `conic-gradient(${segments.join(", ")})`;

    }, [quizDistribution]);


    // =========================================================
    // GRAPH MAX SCORE
    // =========================================================

    const graphMaxScore = useMemo(() => {

        if (
            performanceData.length === 0
        ) {

            return 0;

        }


        return Math.max(
            ...performanceData.map(
                (item) =>
                    Number(
                        item.score || 0
                    )
            )
        );

    }, [performanceData]);


    // =========================================================
    // GRAPH POINTS
    // =========================================================

    const graphPoints = useMemo(() => {

        if (
            performanceData.length === 0
        ) {

            return "";

        }


        const width = 760;

        const height = 200;

        const paddingX = 50;

        const paddingY = 35;


        const chartWidth =
            width -
            paddingX * 2;


        const chartHeight =
            height -
            paddingY * 2;


        const maxValue = Math.max(
            ...performanceData.map(
                (item) =>
                    Number(
                        item.totalMarks || 0
                    )
            ),
            1
        );


        return performanceData
            .map((item, index) => {

                const score =
                    Number(
                        item.score || 0
                    );


                const x =
                    performanceData.length === 1
                        ? width / 2
                        : paddingX +
                          (
                              index /
                              (
                                  performanceData.length -
                                  1
                              )
                          ) *
                          chartWidth;


                const y =
                    paddingY +
                    chartHeight -
                    (
                        score /
                        maxValue
                    ) *
                    chartHeight;


                return `${x},${y}`;

            })
            .join(" ");

    }, [performanceData]);


    // =========================================================
    // GRAPH LABELS
    // =========================================================

    const graphLabels = useMemo(() => {

        if (
            performanceData.length === 0
        ) {

            return [];

        }


        const width = 760;

        const paddingX = 50;

        const chartWidth =
            width -
            paddingX * 2;


        return performanceData.map(
            (item, index) => {

                const x =
                    performanceData.length === 1
                        ? width / 2
                        : paddingX +
                          (
                              index /
                              (
                                  performanceData.length -
                                  1
                              )
                          ) *
                          chartWidth;


                return {
                    x,
                    label:
                        item.quizTitle ||
                        `Quiz ${index + 1}`,
                    score:
                        Number(
                            item.score || 0
                        ),
                };

            }
        );

    }, [performanceData]);


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logout();

        setMobileMenuOpen(false);

        navigate("/login");

    };


    // =========================================================
    // MOBILE MENU
    // =========================================================

    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goToDashboard = () => {

        navigate("/student/dashboard");

        closeMobileMenu();

    };


    const goToMyQuizzes = () => {

        navigate("/student/quizzes");

        closeMobileMenu();

    };


    const goToMyResults = () => {

        navigate("/student/results");

        closeMobileMenu();

    };


    const goToLeaderboard = () => {

        navigate("/student/leaderboard");

        closeMobileMenu();

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">


            {/* =====================================================
                MOBILE HEADER
            ====================================================== */}

            <header className="lg:hidden sticky top-0 z-50 bg-[#023222] text-white shadow-md">

                <div className="h-14 px-5 flex items-center justify-between">

                    <img
                        src={logo}
                        alt="Quivora"
                        className="h-12 w-auto object-contain"
                    />


                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        className="p-2 rounded-lg hover:bg-white/10"
                    >

                        {mobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}

                    </button>

                </div>

            </header>


            {/* =====================================================
                MOBILE OVERLAY
            ====================================================== */}

            {mobileMenuOpen && (

                <div
                    onClick={closeMobileMenu}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />

            )}


            {/* =====================================================
                MAIN LAYOUT
            ====================================================== */}

            <div className="flex min-h-screen">


                {/* =================================================
                    SIDEBAR
                ================================================== */}

                <aside
                    className={`
                        fixed
                        lg:sticky
                        top-0
                        left-0
                        z-50
                        w-50
                        h-screen
                        shrink-0
                        bg-[#023222]
                        text-white
                        flex
                        flex-col
                        shadow-xl
                        transition-transform
                        duration-300

                        ${
                            mobileMenuOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                        }
                    `}
                >


                    {/* =============================================
                        LOGO
                    ============================================== */}

                    <div className=" py-5 border-b border-white/10 shrink-0 flex">

                        <img
                            src={logo}
                            alt="Quivora"
                            className="h-14 w-auto object-contain"
                        />
                        <h3 className="text-[25px] font-bold">Quivora
                            <p className="text-[10px] font-semibold">Learn. Practice. Excel</p>
                        </h3>
                    </div>


                    {/* =============================================
                        NAVIGATION
                    ============================================== */}

                    <nav className="px-4 pt-6">

                        <p className="px-4 mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Workspace
                        </p>


                        {/* Dashboard */}

                        <button
                            type="button"
                            onClick={goToDashboard}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-lg"
                        >

                            <LayoutDashboard size={19} />

                            <span>
                                Dashboard
                            </span>

                        </button>


                        {/* My Quizzes */}

                        <button
                            type="button"
                            onClick={goToMyQuizzes}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <BookOpen size={19} />

                            <span>
                                My Quizzes
                            </span>

                        </button>


                        {/* My Results */}

                        <button
                            type="button"
                            onClick={goToMyResults}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <ClipboardCheck size={19} />

                            <span>
                                My Results
                            </span>

                        </button>


                        {/* Leaderboard */}

                        <button
                            type="button"
                            onClick={goToLeaderboard}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <Trophy size={19} />

                            <span>
                                Leaderboard
                            </span>

                        </button>

                    </nav>


                    {/* =============================================
                        PROFILE + LOGOUT
                    ============================================== */}

                    <div className="px-4 pt-5 pb-5">

                        <div className="border-t border-white/10 pt-4">

                            <button
                                type="button"
                                onClick={() => navigate("/student/profile")}
                                className="w-full text-left rounded-2xl hover:bg-white/5 transition p-2"
                            >
                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#F5E9D0] text-[#023222] flex items-center justify-center font-bold overflow-hidden">

                                        {user?.profileImage ? (

                                            <img
                                                src={getProfileImageUrl(user.profileImage)}
                                                alt={`${user?.firstName || "User"} profile`}
                                                className="w-full h-full object-cover"
                                            />

                                        ) : (

                                            user?.firstName?.charAt(0) || "U"

                                        )}

                                    </div>

                                    <div className="min-w-0">

                                        <p className="font-semibold truncate">
                                            {user?.firstName || ""}{" "}
                                            {user?.lastName || ""}
                                        </p>

                                        <p className="text-xs text-white/50 truncate">
                                            {user?.email || ""}
                                        </p>

                                    </div>

                                </div>
                            </button>


                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-red-200 hover:bg-red-500/10 transition"
                            >

                                <LogOut size={18} />

                                <span>
                                    Logout
                                </span>

                            </button>

                        </div>

                    </div>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <main className="flex-1 min-w-0">


                    {/* =============================================
                        DESKTOP TOP BAR
                    ============================================== */}

                    <header className="hidden lg:flex sticky top-0 z-30 h-20 bg-white border-b border-[#023222]/10 px-8 items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Student Workspace
                            </p>


                            <h2 className="text-xl font-bold">
                                Dashboard
                            </h2>

                        </div>


                        <div className="flex items-center gap-4">

                            <div className="text-right">

                                <p className="font-semibold">

                                    {user?.firstName || ""}
                                    {" "}
                                    {user?.lastName || ""}

                                </p>


                                <p className="text-xs text-gray-500">
                                    Student
                                </p>

                            </div>


                            <div className="w-11 h-11 rounded-full bg-[#F5E9D0] flex items-center justify-center text-[#023222] font-bold overflow-hidden">

                                    {user?.profileImage ? (

                                        <img
                                            src={getProfileImageUrl(user.profileImage)}
                                            alt={`${user?.firstName || "User"} profile`}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        user?.firstName?.charAt(0) || "U"

                                    )}

                            </div>

                        </div>

                    </header>


                    {/* =============================================
                        CONTENT
                    ============================================== */}

                    <div className="p-5 md:p-8 lg:p-5 max-w-[1500px] mx-auto">


                        {/* =========================================
                            WELCOME SECTION
                        ========================================== */}

                        <section className="relative overflow-hidden rounded-2xl bg-[#023222] text-white p-7 md:p-4 mb-3">

                            <div className="relative z-10 max-w-xl">

                                <p className="text-[#D4A017] text-sm font-semibold tracking-wide mb-2">
                                    WELCOME BACK
                                </p>


                                <h1 className="text-2xl md:text-4xl font-extrabold mb-3">

                                    Hello,{" "}
                                    {user?.firstName ||
                                        "Student"} 👋

                                </h1>


                                <p className="text-white/70 text-base md:text-lg leading-relaxed">

                                    Ready to challenge yourself?
                                    Choose a quiz below and put your
                                    knowledge to the test.

                                </p>

                            </div>


                            <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full bg-[#D4A017]/15" />

                            <div className="absolute right-20 -top-24 w-48 h-48 rounded-full bg-white/5" />

                        </section>


                        {/* =========================================
                            FOUR STATISTICS - ONE ROW
                        ========================================== */}

                        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 mb-8">


                            {/* Available */}

                            <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                                <div className="flex items-center justify-between gap-3">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Available
                                        </p>


                                        <p className="text-3xl font-extrabold mt-2">

                                            {loading
                                                ? "—"
                                                : statistics.availableQuizzes}

                                        </p>

                                    </div>


                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                        <BookOpen size={22} />

                                    </div>

                                </div>

                            </div>


                            {/* Completed */}

                            <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                                <div className="flex items-center justify-between gap-3">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Completed
                                        </p>


                                        <p className="text-3xl font-extrabold mt-2">

                                            {loading
                                                ? "—"
                                                : statistics.completedQuizzes}

                                        </p>

                                    </div>


                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                        <CheckCircle2 size={22} />

                                    </div>

                                </div>

                            </div>


                            {/* Passed */}

                            <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                                <div className="flex items-center justify-between gap-3">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Passed
                                        </p>


                                        <p className="text-3xl font-extrabold mt-2">

                                            {loading
                                                ? "—"
                                                : statistics.passedQuizzes}

                                        </p>

                                    </div>


                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                        <CheckCircle2 size={22} />

                                    </div>

                                </div>

                            </div>


                            {/* Failed */}

                            <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                                <div className="flex items-center justify-between gap-3">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Failed
                                        </p>


                                        <p className="text-3xl font-extrabold mt-2">

                                            {loading
                                                ? "—"
                                                : statistics.failedQuizzes}

                                        </p>

                                    </div>


                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#FDEAEA] flex items-center justify-center text-red-500">

                                        <XCircle size={22} />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* =========================================
                            ANALYTICS SECTION
                        ========================================== */}

                        <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-10">


                            {/* =====================================
                                PERFORMANCE GRAPH
                            ====================================== */}

                            <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-7">

                                <div className="flex items-center gap-3 mb-6">

                                    <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                        <TrendingUp size={21} />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-extrabold">
                                            My Quiz Performance
                                        </h2>


                                        <p className="text-sm text-gray-500">
                                            Your performance across completed quizzes
                                        </p>

                                    </div>

                                </div>


                                {loading ? (

                                    <div className="h-[250px] flex items-center justify-center">

                                        <div className="w-10 h-10 rounded-full border-4 border-[#E5F0EB] border-t-[#0B5D45] animate-spin" />

                                    </div>

                                ) : performanceData.length === 0 ? (

                                    <div className="h-[300px] flex flex-col items-center justify-center text-center">

                                        <div className="w-14 h-14 rounded-2xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mb-4">

                                            <TrendingUp size={25} />

                                        </div>


                                        <h3 className="font-bold text-lg">
                                            No performance data yet
                                        </h3>


                                        <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                            Complete a quiz to see your performance here.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="w-full overflow-x-auto">

                                        <svg
                                            viewBox="0 0 760 300"
                                            className="w-full min-w-[650px] h-[300px]"
                                        >

                                            {/* Grid lines */}

                                            {[0, 1, 2, 3, 4].map(
                                                (line) => {

                                                    const y =
                                                        35 +
                                                        line *
                                                        57.5;

                                                    return (
                                                        <line
                                                            key={line}
                                                            x1="50"
                                                            y1={y}
                                                            x2="710"
                                                            y2={y}
                                                            stroke="#E5E7EB"
                                                            strokeWidth="1"
                                                        />
                                                    );

                                                }
                                            )}


                                            {/* Graph line */}

                                            <polyline
                                                points={
                                                    graphPoints
                                                }
                                                fill="none"
                                                stroke="#0B5D45"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />


                                            {/* Points */}

                                            {performanceData.map(
                                                (item, index) => {

                                                    const width = 760;

                                                    const height = 200;

                                                    const paddingX = 50;

                                                    const paddingY = 35;

                                                    const chartWidth =
                                                        width -
                                                        paddingX *
                                                        2;

                                                    const chartHeight =
                                                        height -
                                                        paddingY *
                                                        2;

                                                    const maxValue =
                                                        Math.max(
                                                            ...performanceData.map(
                                                                (data) =>
                                                                    Number(
                                                                        data.totalMarks ||
                                                                        0
                                                                    )
                                                            ),
                                                            1
                                                        );

                                                    const x =
                                                        performanceData.length === 1
                                                            ? width / 2
                                                            : paddingX +
                                                              (
                                                                  index /
                                                                  (
                                                                      performanceData.length -
                                                                      1
                                                                  )
                                                              ) *
                                                              chartWidth;

                                                    const y =
                                                        paddingY +
                                                        chartHeight -
                                                        (
                                                            Number(
                                                                item.score ||
                                                                0
                                                            ) /
                                                            maxValue
                                                        ) *
                                                        chartHeight;

                                                    return (
                                                        <g
                                                            key={
                                                                item.quizId
                                                            }
                                                        >

                                                            <circle
                                                                cx={x}
                                                                cy={y}
                                                                r="6"
                                                                fill="#D4A017"
                                                                stroke="#FFFFFF"
                                                                strokeWidth="3"
                                                            />

                                                        </g>
                                                    );

                                                }
                                            )}


                                            {/* X-axis labels */}

                                            {graphLabels.map(
                                                (item, index) => {

                                                    return (
                                                        <text
                                                            key={index}
                                                            x={item.x}
                                                            y="288"
                                                            textAnchor="middle"
                                                            fontSize="11"
                                                            fill="#6B7280"
                                                        >
                                                            {item.label.length >
                                                            15
                                                                ? `${item.label.substring(
                                                                      0,
                                                                      15
                                                                  )}...`
                                                                : item.label}
                                                        </text>
                                                    );

                                                }
                                            )}

                                        </svg>

                                    </div>

                                )}

                            </div>


                            {/* =====================================
                                PIE CHART
                            ====================================== */}

                            <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-7">

                                <div className="flex items-center gap-3 mb-6">

                                    <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                        <PieChartIcon size={21} />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-extrabold">
                                            Completed Quizzes
                                        </h2>


                                        <p className="text-sm text-gray-500">
                                            Your completed quiz distribution
                                        </p>

                                    </div>

                                </div>


                                {loading ? (

                                    <div className="h-[300px] flex items-center justify-center">

                                        <div className="w-10 h-10 rounded-full border-4 border-[#F5E9D0] border-t-[#D4A017] animate-spin" />

                                    </div>

                                ) : quizDistribution.length === 0 ? (

                                    <div className="h-[300px] flex flex-col items-center justify-center text-center">

                                        <div className="w-14 h-14 rounded-2xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mb-4">

                                            <PieChartIcon size={25} />

                                        </div>


                                        <h3 className="font-bold text-lg">
                                            No completed quizzes
                                        </h3>


                                        <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                            Your completed quizzes will appear here.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[300px]">


                                        {/* PIE */}

                                        <div
                                            className="w-48 h-48 rounded-full shrink-0 relative"
                                            style={{
                                                background:
                                                    pieGradient,
                                            }}
                                        >

                                            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">

                                                <span className="text-2xl font-extrabold">
                                                    {
                                                        performanceData.length
                                                    }
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    Completed
                                                </span>

                                            </div>

                                        </div>


                                        {/* LEGEND */}

                                        <div className="space-y-3 max-w-[230px] w-full">

                                            {quizDistribution.map(
                                                (
                                                    item,
                                                    index
                                                ) => {

                                                    const chartColors = [
                                                        "#D4A017",
                                                        "#0B5D45",
                                                        "#5D4A8A",
                                                        "#C96B3B",
                                                        "#3578A8",
                                                        "#7A5B00",
                                                    ];


                                                    const color =
                                                        chartColors[
                                                            index %
                                                            chartColors.length
                                                        ];


                                                    return (
                                                        <div
                                                            key={
                                                                item.name
                                                            }
                                                            className="flex items-center justify-between gap-3"
                                                        >

                                                            <div className="flex items-center gap-2 min-w-0">

                                                                <span
                                                                    className="w-3 h-3 rounded-full shrink-0"
                                                                    style={{
                                                                        backgroundColor:
                                                                            color,
                                                                    }}
                                                                />


                                                                <span className="text-sm text-gray-600 truncate">

                                                                    {
                                                                        item.name
                                                                    }

                                                                </span>

                                                            </div>


                                                            <span className="text-sm font-bold text-[#023222]">

                                                                {
                                                                    item.count
                                                                }

                                                            </span>

                                                        </div>
                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        </section>


                        {/* =========================================
                            FOOTER
                        ========================================== */}

                        <footer className="mt-10 pt-6 border-t border-[#023222]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">

                            <p>
                                © 2026 Quivora. Learn. Practice. Excel.
                            </p>


                            <p>
                                Secure Assessment Platform
                            </p>

                        </footer>

                    </div>

                </main>

            </div>

        </div>

    );

};


export default StudentDashboard;