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
    Menu,
    X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import quizService from "../../services/quizService";
import { toast } from "react-toastify";
import logo from "../../assets/logo/quivora-logo.png";


// ============================================================
// API
// ============================================================

const API_BASE_URL = "https://quivora-backend.onrender.com/api/v1";

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


// ============================================================
// MY QUIZZES
// ============================================================

const MyQuizzes = () => {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [quizzes, setQuizzes] = useState([]);

    const [completedQuizIds, setCompletedQuizIds] =
        useState([]);

    const [loading, setLoading] = useState(true);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // =========================================================
    // FETCH QUIZZES + STUDENT COMPLETION DATA
    // =========================================================

    useEffect(() => {

        const fetchData = async () => {

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


                // ---------------------------------------------
                // Fetch published quizzes
                // ---------------------------------------------

                const quizResponse =
                    await quizService.getPublishedQuizzes();


                const publishedQuizzes =
                    quizResponse.data || [];


                // ---------------------------------------------
                // Fetch student's dashboard information
                // ---------------------------------------------

                const dashboardResponse =
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


                const dashboardData =
                    await dashboardResponse.json();


                if (!dashboardResponse.ok) {

                    throw new Error(
                        dashboardData.message ||
                        "Unable to load student quiz information."
                    );

                }


                const completedIds =
                    dashboardData.data
                        ?.completedQuizIds || [];


                setQuizzes(
                    publishedQuizzes
                );


                setCompletedQuizIds(
                    [
                        ...new Set(
                            completedIds
                        ),
                    ]
                );

            } catch (error) {

                console.error(
                    "Failed to load My Quizzes:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load quizzes."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, []);


    // =========================================================
    // CHECK COMPLETION
    // =========================================================

    const isQuizCompleted = (quizId) => {

        return completedQuizIds.includes(
            quizId
        );

    };


    // =========================================================
    // START QUIZ
    // =========================================================

    const handleStartQuiz = (quiz) => {

        if (
            isQuizCompleted(
                quiz.id
            )
        ) {

            toast.info(
                "You have already completed this quiz."
            );

            return;

        }


        navigate(
            `/student/quiz/${quiz.id}`,
            {
                state: {
                    quiz,
                },
            }
        );

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

                            <LayoutDashboard size={19} />

                            <span>
                                Dashboard
                            </span>

                        </button>


                        {/* My Quizzes */}

                        <button
                            type="button"
                            onClick={goToMyQuizzes}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-lg"
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
                        TOP BAR
                    ============================================== */}

                    <header className="hidden lg:flex sticky top-0 z-30 h-20 bg-white border-b border-[#023222]/10 px-8 items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Student Workspace
                            </p>


                            <h2 className="text-xl font-bold">
                                My Quizzes
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
                            PAGE INTRO
                        ========================================== */}

                        <section className="relative overflow-hidden rounded-2xl bg-[#023222] text-white p-7 md:p-4 mb-4">

                            <div className="relative z-10">

                                <p className="text-[#D4A017] text-sm font-semibold tracking-wide mb-2 uppercase">
                                    Assessments
                                </p>


                                <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                                    My Quizzes
                                </h1>


                                <p className="text-white/70 text-base md:text-lg max-w-2xl leading-relaxed">
                                    View your available assessments and
                                    continue your learning journey.
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
                                    Your Assessments
                                </p>


                                <h2 className="text-2xl md:text-3xl font-extrabold mt-1">
                                    Quiz Library
                                </h2>

                            </div>


                            {!loading && (

                                <p className="text-sm text-gray-500">

                                    {quizzes.length}{" "}

                                    {quizzes.length === 1
                                        ? "quiz"
                                        : "quizzes"}

                                </p>

                            )}

                        </div>


                        {/* =========================================
                            LOADING
                        ========================================== */}

                        {loading && (

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                {[1, 2].map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className="bg-white rounded-3xl border border-[#023222]/10 p-6 animate-pulse"
                                        >

                                            <div className="flex justify-between mb-6">

                                                <div className="w-12 h-12 rounded-2xl bg-gray-200" />

                                                <div className="w-16 h-7 rounded-full bg-gray-200" />

                                            </div>


                                            <div className="h-7 bg-gray-200 rounded w-2/3 mb-3" />

                                            <div className="h-4 bg-gray-200 rounded w-full mb-2" />

                                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />

                                            <div className="flex gap-3 mb-6">

                                                <div className="h-9 w-24 bg-gray-200 rounded-xl" />

                                                <div className="h-9 w-28 bg-gray-200 rounded-xl" />

                                                <div className="h-9 w-24 bg-gray-200 rounded-xl" />

                                            </div>


                                            <div className="h-12 bg-gray-200 rounded-xl" />

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {/* =========================================
                            NO QUIZZES
                        ========================================== */}

                        {!loading &&
                            quizzes.length === 0 && (

                                <div className="bg-white rounded-3xl border border-[#023222]/10 p-12 text-center">

                                    <div className="w-16 h-16 rounded-2xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mx-auto mb-5">

                                        <BookOpen size={28} />

                                    </div>


                                    <h3 className="text-xl font-bold mb-2">
                                        No quizzes available
                                    </h3>


                                    <p className="text-gray-500 max-w-md mx-auto">
                                        There are no published quizzes
                                        available right now. Please check
                                        back later.
                                    </p>

                                </div>

                            )}


                        {/* =========================================
                            QUIZ CARDS
                        ========================================== */}

                        {!loading &&
                            quizzes.length > 0 && (

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                    {quizzes.map(
                                        (quiz) => {

                                            const completed =
                                                isQuizCompleted(
                                                    quiz.id
                                                );


                                            return (

                                                <article
                                                    key={
                                                        quiz.id
                                                    }
                                                    className={`
                                                        bg-white
                                                        rounded-3xl
                                                        border
                                                        p-6
                                                        transition-all
                                                        duration-300
                                                        ${
                                                            completed
                                                                ? "border-[#0B5D45]/20"
                                                                : "border-[#023222]/10 hover:border-[#D4A017]/60 hover:shadow-xl hover:-translate-y-1"
                                                        }
                                                    `}
                                                >

                                                    {/* Top */}

                                                    <div className="flex justify-between items-start gap-4 mb-5">

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
                                                                    completed
                                                                        ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                                        : "bg-[#E5F0EB] text-[#0B5D45]"
                                                                }
                                                            `}
                                                        >

                                                            {completed ? (
                                                                <CheckCircle2
                                                                    size={23}
                                                                />
                                                            ) : (
                                                                <BookOpen
                                                                    size={23}
                                                                />
                                                            )}

                                                        </div>


                                                        <span className="px-3 py-1 rounded-full bg-[#F5E9D0] text-[#7A5B00] text-xs font-bold uppercase">

                                                            {quiz.difficulty}

                                                        </span>

                                                    </div>


                                                    {/* Title */}

                                                    <h3 className="text-xl font-extrabold mb-2">

                                                        {quiz.title}

                                                    </h3>


                                                    {/* Description */}

                                                    <p className="text-gray-500 text-sm leading-relaxed mb-5">

                                                        {quiz.description ||
                                                            "No description available."}

                                                    </p>


                                                    {/* Information */}

                                                    <div className="flex flex-wrap gap-3 mb-6">


                                                        {/* Duration */}

                                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F2] text-sm">

                                                            <Clock3
                                                                size={16}
                                                                className="text-[#0B5D45]"
                                                            />

                                                            <span>
                                                                {quiz.duration}{" "}
                                                                min
                                                            </span>

                                                        </div>


                                                        {/* Marks */}

                                                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F2] text-sm">

                                                            <Award
                                                                size={16}
                                                                className="text-[#D4A017]"
                                                            />

                                                            <span>
                                                                {quiz.totalMarks}{" "}
                                                                marks
                                                            </span>

                                                        </div>


                                                        {/* Passing */}

                                                        <div className="px-3 py-2 rounded-xl bg-[#FAF8F2] text-sm">

                                                            Pass:{" "}
                                                            {quiz.passingMarks}

                                                        </div>

                                                    </div>


                                                    {/* =====================================
                                                        COMPLETED
                                                    ====================================== */}

                                                    {completed ? (

                                                        <div className="w-full h-12 rounded-xl bg-[#E5F0EB] text-[#0B5D45] font-bold flex items-center justify-center gap-2">

                                                            <CheckCircle2
                                                                size={19}
                                                            />

                                                            <span>
                                                                Quiz Completed
                                                            </span>

                                                        </div>

                                                    ) : (

                                                        /* =================================
                                                           START QUIZ
                                                        ================================== */

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStartQuiz(
                                                                    quiz
                                                                )
                                                            }
                                                            className="w-full h-12 rounded-xl bg-[#023222] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0B5D45] transition"
                                                        >

                                                            <span>
                                                                Start Quiz
                                                            </span>

                                                            <ChevronRight
                                                                size={19}
                                                            />

                                                        </button>

                                                    )}

                                                </article>

                                            );

                                        }
                                    )}

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


export default MyQuizzes;