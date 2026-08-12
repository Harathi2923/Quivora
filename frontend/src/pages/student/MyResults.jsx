import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    ClipboardCheck,
    LogOut,
    Clock3,
    Award,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Menu,
    X,
    CalendarDays,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import logo from "../../assets/logo/quivora-logo.png";


const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";

    // ============================================================
// PROFILE IMAGE URL
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

    return `https://quivora-backend.onrender.com${profileImage}`;
};


const MyResults = () => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [results, setResults] = useState([]);

    const [pagination, setPagination] =
        useState({
            currentPage: 1,
            totalPages: 1,
            totalResults: 0,
            pageSize: 6,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [loading, setLoading] =
        useState(true);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // =========================================================
    // FETCH RESULTS
    // =========================================================

    const fetchResults = async (
        page = 1
    ) => {

        try {

            setLoading(true);


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
                    `${API_BASE_URL}/attempts/results?page=${page}&limit=6`,
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
                    "Unable to fetch results."
                );

            }


            setResults(
                data.data?.results || []
            );


            setPagination(
                data.data?.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalResults: 0,
                    pageSize: 6,
                    hasNextPage: false,
                    hasPreviousPage: false,
                }
            );

        } catch (error) {

            console.error(
                "Failed to fetch results:",
                error
            );


            toast.error(
                error.message ||
                "Unable to load your results."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        fetchResults(1);

    }, []);


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page >
                pagination.totalPages
        ) {
            return;
        }


        fetchResults(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        logout();

        setMobileMenuOpen(false);

        navigate("/login");

    };


    // =========================================================
    // CLOSE MOBILE MENU
    // =========================================================

    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };


    // =========================================================
    // NAVIGATION
    // =========================================================

    const goToDashboard = () => {

        navigate(
            "/student/dashboard"
        );

        closeMobileMenu();

    };


    const goToMyQuizzes = () => {

        navigate(
            "/student/quizzes"
        );

        closeMobileMenu();

    };


    const goToMyResults = () => {

        navigate(
            "/student/results"
        );

        closeMobileMenu();

    };


    const goToLeaderboard = () => {

        navigate(
            "/student/leaderboard"
        );

        closeMobileMenu();

    };


    // =========================================================
    // VIEW RESULT
    // =========================================================

    const handleViewResult = (
        attemptId
    ) => {

        navigate(
            `/student/results/${attemptId}`
        );

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "—";
        }


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

    };


    // =========================================================
    // FORMAT TIME
    // =========================================================

    const formatTime = (
        seconds
    ) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "—";
        }


        const totalSeconds =
            Number(seconds);


        if (
            Number.isNaN(
                totalSeconds
            )
        ) {
            return "—";
        }


        const minutes =
            Math.floor(
                totalSeconds / 60
            );


        const remainingSeconds =
            totalSeconds % 60;


        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

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

                <div className="h-16 px-5 flex items-center justify-between">

                    <img
                        src={logo}
                        alt="Quivora"
                        className="h-9 w-auto object-contain"
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
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <LayoutDashboard
                                size={19}
                            />

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

                            <BookOpen
                                size={19}
                            />

                            <span>
                                My Quizzes
                            </span>

                        </button>


                        {/* My Results */}

                        <button
                            type="button"
                            onClick={goToMyResults}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-lg"
                        >

                            <ClipboardCheck
                                size={19}
                            />

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

                            <Trophy
                                size={19}
                            />

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

                                <LogOut
                                    size={18}
                                />

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
                                My Results
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

                    <div className="p-5 md:p-8 lg:p-4 max-w-[1500px] mx-auto">


                        {/* =========================================
                            HERO
                        ========================================== */}

                        <section className="relative overflow-hidden rounded-2xl bg-[#023222] text-white p-7 md:p-4 mb-6">

                            <div className="relative z-10">

                                <p className="text-[#D4A017] text-sm font-semibold tracking-wide mb-2 uppercase">
                                    Performance
                                </p>


                                <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
                                    My Results
                                </h1>


                                <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed">
                                    Review your completed assessments,
                                    scores, and performance history.
                                </p>

                            </div>


                            <div className="absolute -right-20 -bottom-24 w-72 h-72 rounded-full bg-[#D4A017]/15" />

                            <div className="absolute right-24 -top-28 w-52 h-52 rounded-full bg-white/5" />

                        </section>


                        {/* =========================================
                            SECTION HEADER
                        ========================================== */}

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">

                            <div>

                                <p className="text-sm font-semibold text-[#0B5D45] uppercase tracking-wider">
                                    Assessment History
                                </p>


                                <h2 className="text-2xl md:text-2xl font-extrabold mt-1">
                                    Completed Results
                                </h2>

                            </div>


                            {!loading && (

                                <p className="text-sm text-gray-500">

                                    {pagination.totalResults}{" "}

                                    {pagination.totalResults === 1
                                        ? "result"
                                        : "results"}

                                </p>

                            )}

                        </div>


                        {/* =========================================
                            LOADING
                        ========================================== */}

                        {loading && (

                            <div className="space-y-5">

                                {[1, 2].map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className="bg-white rounded-3xl border border-[#023222]/10 p-6 animate-pulse"
                                        >

                                            <div className="flex justify-between gap-5">

                                                <div className="flex gap-4">

                                                    <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />

                                                    <div>

                                                        <div className="h-6 bg-gray-200 rounded w-56 mb-3" />

                                                        <div className="h-4 bg-gray-200 rounded w-72" />

                                                    </div>

                                                </div>


                                                <div className="w-20 h-8 bg-gray-200 rounded-full" />

                                            </div>


                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">

                                                <div className="h-16 bg-gray-200 rounded-xl" />

                                                <div className="h-16 bg-gray-200 rounded-xl" />

                                                <div className="h-16 bg-gray-200 rounded-xl" />

                                                <div className="h-16 bg-gray-200 rounded-xl" />

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {/* =========================================
                            NO RESULTS
                        ========================================== */}

                        {!loading &&
                            results.length === 0 && (

                                <div className="bg-white rounded-3xl border border-[#023222]/10 p-12 text-center">

                                    <div className="w-16 h-16 rounded-2xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mx-auto mb-5">

                                        <ClipboardCheck
                                            size={28}
                                        />

                                    </div>


                                    <h3 className="text-xl font-bold mb-2">
                                        No results yet
                                    </h3>


                                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                                        Complete a quiz to see your
                                        score and performance history
                                        here.
                                    </p>


                                    <button
                                        type="button"
                                        onClick={goToMyQuizzes}
                                        className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                                    >

                                        Browse Quizzes

                                        <ChevronRight
                                            size={18}
                                        />

                                    </button>

                                </div>

                            )}


                        {/* =========================================
                            RESULT CARDS
                        ========================================== */}

                        {!loading &&
                            results.length > 0 && (

                                <div className="space-y-5">

                                    {results.map(
                                        (result) => {

                                            const passed =
                                                result.result ===
                                                "PASS";


                                            return (

                                                <article
                                                    key={
                                                        result.attemptId
                                                    }
                                                    className="bg-white rounded-3xl border border-[#023222]/10 p-6 md:p-5 hover:border-[#D4A017]/50 hover:shadow-lg transition-all duration-300"
                                                >

                                                    {/* =================================
                                                        CARD HEADER
                                                    ================================== */}

                                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                                                        <div className="flex items-start gap-4">

                                                            <div
                                                                className={`
                                                                    w-12
                                                                    h-12
                                                                    rounded-2xl
                                                                    flex
                                                                    items-center
                                                                    justify-center
                                                                    shrink-0
                                                                    ${
                                                                        passed
                                                                            ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                                            : "bg-[#F5E9D0] text-[#9A7100]"
                                                                    }
                                                                `}
                                                            >

                                                                {passed ? (

                                                                    <CheckCircle2
                                                                        size={23}
                                                                    />

                                                                ) : (

                                                                    <XCircle
                                                                        size={23}
                                                                    />

                                                                )}

                                                            </div>


                                                            <div>

                                                                <h3 className="text-xl font-extrabold">
                                                                    {result.quizTitle}
                                                                </h3>


                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {result.description ||
                                                                        "Completed assessment"}
                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* RESULT BADGE */}

                                                        <span
                                                            className={`
                                                                self-start
                                                                px-4
                                                                py-2
                                                                rounded-full
                                                                text-xs
                                                                font-extrabold
                                                                tracking-wide
                                                                ${
                                                                    passed
                                                                        ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                                        : "bg-[#F5E9D0] text-[#8A6500]"
                                                                }
                                                            `}
                                                        >

                                                            {passed
                                                                ? "✓ PASS"
                                                                : "✕ FAIL"}

                                                        </span>

                                                    </div>


                                                    {/* =================================
                                                        DETAILS
                                                    ================================== */}

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-7">


                                                        {/* SCORE */}

                                                        <div className="rounded-2xl bg-[#FAF8F2] p-4">

                                                            <p className="text-xs text-gray-500 mb-1">
                                                                Score
                                                            </p>


                                                            <p className="text-xl font-extrabold text-[#023222]">

                                                                {result.score}
                                                                {" / "}
                                                                {result.totalMarks}

                                                            </p>

                                                        </div>


                                                        {/* PASSING MARKS */}

                                                        <div className="rounded-2xl bg-[#FAF8F2] p-4">

                                                            <p className="text-xs text-gray-500 mb-1">
                                                                Passing Marks
                                                            </p>


                                                            <p className="text-xl font-extrabold">

                                                                {result.passingMarks}

                                                            </p>

                                                        </div>


                                                        {/* TIME */}

                                                        <div className="rounded-2xl bg-[#FAF8F2] p-4">

                                                            <p className="text-xs text-gray-500 mb-1">
                                                                Time Taken
                                                            </p>


                                                            <div className="flex items-center gap-2">

                                                                <Clock3
                                                                    size={17}
                                                                    className="text-[#0B5D45]"
                                                                />

                                                                <p className="text-xl font-extrabold">

                                                                    {formatTime(
                                                                        result.timeTaken
                                                                    )}

                                                                </p>

                                                            </div>

                                                        </div>


                                                        {/* DATE */}

                                                        <div className="rounded-2xl bg-[#FAF8F2] p-4">

                                                            <p className="text-xs text-gray-500 mb-1">
                                                                Submitted
                                                            </p>


                                                            <div className="flex items-center gap-2">

                                                                <CalendarDays
                                                                    size={17}
                                                                    className="text-[#D4A017]"
                                                                />

                                                                <p className="text-sm font-bold">

                                                                    {formatDate(
                                                                        result.submittedAt
                                                                    )}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* =================================
                                                        FOOTER
                                                    ================================== */}

                                                    <div className="mt-4 pt-5 border-t border-[#023222]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                                        <div className="flex items-center gap-2 text-sm text-gray-500">

                                                            <Award
                                                                size={17}
                                                                className="text-[#D4A017]"
                                                            />

                                                            <span>
                                                                Quiz completed
                                                                successfully
                                                            </span>

                                                        </div>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleViewResult(
                                                                    result.attemptId
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                                                        >

                                                            View Result

                                                            <ChevronRight
                                                                size={18}
                                                            />

                                                        </button>

                                                    </div>

                                                </article>

                                            );

                                        }
                                    )}

                                </div>

                            )}


                        {/* =========================================
                            PAGINATION
                        ========================================== */}

                        {!loading &&
                            results.length > 0 &&
                            pagination.totalPages > 1 && (

                                <div className="mt-8 flex items-center justify-center gap-2">


                                    {/* PREVIOUS */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasPreviousPage
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage - 1
                                            )
                                        }
                                        className="h-10 px-4 rounded-xl border border-[#023222]/10 bg-white text-[#023222] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4A017] transition"
                                    >

                                        Previous

                                    </button>


                                    {/* PAGE NUMBERS */}

                                    {Array.from(
                                        {
                                            length:
                                                pagination.totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        (page) => (

                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }
                                                className={`
                                                    w-10
                                                    h-10
                                                    rounded-xl
                                                    font-bold
                                                    transition
                                                    ${
                                                        page ===
                                                        pagination.currentPage
                                                            ? "bg-[#D4A017] text-[#023222]"
                                                            : "bg-white text-[#023222] border border-[#023222]/10 hover:border-[#D4A017]"
                                                    }
                                                `}
                                            >

                                                {page}

                                            </button>

                                        )
                                    )}


                                    {/* NEXT */}

                                    <button
                                        type="button"
                                        disabled={
                                            !pagination.hasNextPage
                                        }
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage + 1
                                            )
                                        }
                                        className="h-10 px-4 rounded-xl border border-[#023222]/10 bg-white text-[#023222] font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4A017] transition"
                                    >

                                        Next

                                    </button>

                                </div>

                            )}


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


export default MyResults;