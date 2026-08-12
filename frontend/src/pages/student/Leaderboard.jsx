import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    ClipboardCheck,
    LogOut,
    Users,
    Award,
    Clock3,
    X,
    ChevronLeft,
    ChevronRight,
    Medal,
    Crown,
    Menu,
} from "lucide-react";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import leaderboardService from "../../services/leaderboardService";

import logo from "../../assets/logo/quivora-logo.png";

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



const Leaderboard = () => {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [
        leaderboardQuizzes,
        setLeaderboardQuizzes,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        selectedQuiz,
        setSelectedQuiz,
    ] = useState(null);


    const [
        leaderboardData,
        setLeaderboardData,
    ] = useState(null);


    const [
        leaderboardLoading,
        setLeaderboardLoading,
    ] = useState(false);


    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);


    const [
        mobileMenuOpen,
        setMobileMenuOpen,
    ] = useState(false);


    const pageSize = 10;


    // =========================================================
    // FETCH MY LEADERBOARDS
    // =========================================================

    useEffect(() => {

        const fetchMyLeaderboards = async () => {

            try {

                setLoading(true);


                const response =
                    await leaderboardService
                        .getMyLeaderboards();


                setLeaderboardQuizzes(
                    response?.data?.quizzes || []
                );


            } catch (error) {

                console.error(
                    "Failed to fetch leaderboards:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load leaderboards."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchMyLeaderboards();

    }, []);


    // =========================================================
    // FETCH SELECTED QUIZ LEADERBOARD
    // =========================================================

    const openLeaderboard = async (
        quiz,
        page = 1
    ) => {

        try {

            setSelectedQuiz(quiz);

            setCurrentPage(page);

            setLeaderboardLoading(true);

            setLeaderboardData(null);


            const response =
                await leaderboardService
                    .getLeaderboard(
                        quiz.quizId,
                        page,
                        pageSize
                    );


            setLeaderboardData(
                response?.data || null
            );


        } catch (error) {

            console.error(
                "Failed to fetch leaderboard:",
                error
            );


            toast.error(
                error.message ||
                "Unable to load leaderboard."
            );


            setSelectedQuiz(null);


        } finally {

            setLeaderboardLoading(false);

        }

    };


    // =========================================================
    // CLOSE LEADERBOARD
    // =========================================================

    const closeLeaderboard = () => {

        setSelectedQuiz(null);

        setLeaderboardData(null);

        setCurrentPage(1);

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
    // FORMAT TIME
    // =========================================================

    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {
            return "--";
        }


        const totalSeconds =
            Number(seconds);


        const minutes =
            Math.floor(
                totalSeconds / 60
            );


        const remainingSeconds =
            totalSeconds % 60;


        if (minutes > 0) {

            return `${minutes}m ${String(
                remainingSeconds
            ).padStart(2, "0")}s`;

        }


        return `${remainingSeconds}s`;

    };


    // =========================================================
    // RANK ICON
    // =========================================================

    const getRankIcon = (rank) => {

        if (rank === 1) {

            return (
                <Crown
                    size={18}
                    className="text-[#D4A017]"
                />
            );

        }


        if (rank === 2) {

            return (
                <Medal
                    size={18}
                    className="text-gray-400"
                />
            );

        }


        if (rank === 3) {

            return (
                <Medal
                    size={18}
                    className="text-[#B8794A]"
                />
            );

        }


        return (
            <span className="text-sm font-bold text-gray-500">
                {rank}
            </span>
        );

    };


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

                        <Menu size={24} />

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


                    {/* LOGO */}

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
                    


                    {/* NAVIGATION */}

                    <nav className="px-4 pt-6">

                        <p className="px-4 mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Workspace
                        </p>


                        {/* Dashboard */}

                        <button
                            type="button"
                            onClick={() => {
                                navigate(
                                    "/student/dashboard"
                                );
                                closeMobileMenu();
                            }}
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
                            onClick={() => {
                                navigate(
                                    "/student/quizzes"
                                );
                                closeMobileMenu();
                            }}
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
                            onClick={() => {
                                navigate(
                                    "/student/results"
                                );
                                closeMobileMenu();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <ClipboardCheck size={19} />

                            <span>
                                My Results
                            </span>

                        </button>


                        {/* Leaderboard ACTIVE */}

                        <button
                            type="button"
                            onClick={() => {
                                navigate(
                                    "/student/leaderboard"
                                );
                                closeMobileMenu();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-lg"
                        >

                            <Trophy size={19} />

                            <span>
                                Leaderboard
                            </span>

                        </button>

                    </nav>


                    {/* PROFILE + LOGOUT */}

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


                    {/* TOP BAR */}

                    <header className="sticky top-0 z-30 h-20 bg-white border-b border-[#023222]/10 px-5 md:px-8 flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Student Workspace
                            </p>


                            <h2 className="text-xl font-bold">
                                Leaderboard
                            </h2>

                        </div>


                        <div className="flex items-center gap-4">

                            <div className="text-right hidden sm:block">

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


                    {/* CONTENT */}

                    <div className="p-4 md:p-6 lg:p-4 max-w-[1500px] mx-auto">


                        {/* =================================================
                            HERO
                        ================================================== */}

                        <section className="relative overflow-hidden rounded-2xl bg-[#023222] text-white p-7 md:p-4 mb-4">

                            <div className="relative z-10 max-w-xl">

                                <p className="text-[#D4A017] text-sm font-semibold tracking-wider uppercase mb-2">
                                    Rankings
                                </p>


                                <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
                                    Leaderboard
                                </h1>


                                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                                    See how you performed and compare your rank with other participants.
                                </p>

                            </div>


                            <div className="absolute -right-16 -bottom-24 w-72 h-72 rounded-full bg-[#D4A017]/10" />

                            <div className="absolute right-24 -top-28 w-52 h-52 rounded-full bg-white/5" />

                        </section>


                        {/* =================================================
                            TITLE
                        ================================================== */}

                        <div className="flex items-end justify-between mb-5">

                            <div>

                                <p className="text-sm font-semibold text-[#0B5D45] uppercase tracking-wider">
                                    Your Participation
                                </p>


                                <h2 className="text-2xl md:text-2xl font-extrabold mt-1">
                                    Quiz Leaderboards
                                </h2>

                            </div>


                            {!loading && (

                                <p className="text-sm text-gray-500">

                                    {leaderboardQuizzes.length}{" "}

                                    {leaderboardQuizzes.length === 1
                                        ? "quiz"
                                        : "quizzes"}

                                </p>

                            )}

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================== */}

                        {loading && (

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                {[1, 2].map((item) => (

                                    <div
                                        key={item}
                                        className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
                                    >

                                        <div className="flex justify-between">

                                            <div className="w-10 h-12 rounded-2xl bg-gray-200" />

                                            <div className="w-20 h-7 rounded-full bg-gray-200" />

                                        </div>


                                        <div className="h-7 bg-gray-200 rounded w-2/3 mt-6 mb-3" />

                                        <div className="h-4 bg-gray-200 rounded w-full mb-2" />

                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-7" />

                                        <div className="grid grid-cols-2 gap-3">

                                            <div className="h-16 bg-gray-200 rounded-xl" />

                                            <div className="h-16 bg-gray-200 rounded-xl" />

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}


                        {/* =================================================
                            EMPTY STATE
                        ================================================== */}

                        {!loading &&
                            leaderboardQuizzes.length === 0 && (

                                <div className="bg-white rounded-3xl border border-[#023222]/10 p-12 text-center">

                                    <div className="w-16 h-16 rounded-2xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mx-auto mb-5">

                                        <Trophy size={28} />

                                    </div>


                                    <h3 className="text-xl font-bold mb-2">
                                        No leaderboards yet
                                    </h3>


                                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                                        Complete a quiz to see your ranking and compare your performance with other participants.
                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/student/quizzes"
                                            )
                                        }
                                        className="px-6 py-3 rounded-xl bg-[#023222] text-white font-semibold hover:bg-[#0B5D45] transition"
                                    >
                                        View My Quizzes
                                    </button>

                                </div>

                            )}


                        {/* =================================================
                            QUIZ CARDS
                        ================================================== */}

                        {!loading &&
                            leaderboardQuizzes.length > 0 && (

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                    {leaderboardQuizzes.map(
                                        (quiz) => (

                                            <article
                                                key={quiz.quizId}
                                                onClick={() =>
                                                    openLeaderboard(
                                                        quiz,
                                                        1
                                                    )
                                                }
                                                className="group cursor-pointer bg-white rounded-3xl border border-[#023222]/10 p-6 hover:border-[#D4A017]/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                            >

                                                {/* TOP */}

                                                <div className="flex items-start justify-between gap-4 mb-5">

                                                    <div className="w-13 h-13 rounded-2xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                                        <Trophy size={24} />

                                                    </div>


                                                    <span className="px-3 py-1.5 rounded-full bg-[#F5E9D0] text-[#7A5B00] text-xs font-bold">
                                                        COMPLETED
                                                    </span>

                                                </div>


                                                {/* TITLE */}

                                                <h3 className="text-xl md:text-2xl font-extrabold ">
                                                    {quiz.quizTitle}
                                                </h3>


                                                {/* DESCRIPTION */}

                                                <p className="text-gray-500 text-sm leading-relaxed mb-1">
                                                    {quiz.description ||
                                                        "Quiz leaderboard"}
                                                </p>


                                                {/* INFORMATION */}

                                                <div className="grid grid-cols-2 gap-3 mb-5">

                                                    <div className="rounded-xl bg-[#FAF8F2] p-4">

                                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">

                                                            <Users size={15} />

                                                            Participants

                                                        </div>


                                                        <p className="text-lg font-extrabold">
                                                            {quiz.participants}
                                                        </p>

                                                    </div>


                                                    <div className="rounded-xl bg-[#FAF8F2] p-4">

                                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">

                                                            <Trophy size={15} />

                                                            Your Rank

                                                        </div>


                                                        <p className="text-lg font-extrabold text-[#9A7100]">

                                                            #{quiz.myRank}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* SCORE */}

                                                <div className="flex items-center justify-between pt-4 border-t border-[#023222]/10">

                                                    <div>

                                                        <p className="text-xs text-gray-500">
                                                            Your Score
                                                        </p>


                                                        <p className="font-extrabold text-lg">
                                                            {quiz.myScore} / {quiz.totalMarks}
                                                        </p>

                                                    </div>


                                                    <div className="flex items-center gap-2 text-[#0B5D45] font-semibold text-sm group-hover:text-[#D4A017] transition">

                                                        View Leaderboard

                                                        <ChevronRight
                                                            size={18}
                                                            className="group-hover:translate-x-1 transition-transform"
                                                        />

                                                    </div>

                                                </div>

                                            </article>

                                        )
                                    )}

                                </div>

                            )}


                        {/* FOOTER */}

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


            {/* =========================================================
                LEADERBOARD MODAL
            ========================================================== */}

            {selectedQuiz && (

                <div className="fixed inset-0 z-[100] bg-[#023222]/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8">

                    <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#FAF8F2] shadow-2xl">


                        {/* =================================================
                            MODAL HEADER
                        ================================================== */}

                        <div className="bg-[#023222] text-white px-6 md:px-8 py-6">

                            <div className="flex items-start justify-between gap-5">

                                <div>

                                    <p className="text-[#D4A017] text-xs uppercase tracking-widest font-semibold mb-2">
                                        Quiz Leaderboard
                                    </p>


                                    <h2 className="text-2xl md:text-3xl font-extrabold">
                                        {selectedQuiz.quizTitle}
                                    </h2>


                                    <p className="text-white/60 text-sm mt-2">
                                        {leaderboardData?.participants ?? selectedQuiz.participants} participants
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={closeLeaderboard}
                                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0"
                                >

                                    <X size={21} />

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            MODAL CONTENT
                        ================================================== */}

                        <div className="max-h-[calc(90vh-104px)] overflow-y-auto p-5 md:p-7">


                            {/* =================================================
                                MY RANK SUMMARY
                            ================================================== */}

                            {leaderboardData && (

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

                                    <div className="rounded-2xl bg-white border border-[#023222]/10 p-5">

                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">

                                            <Trophy
                                                size={16}
                                                className="text-[#D4A017]"
                                            />

                                            Your Rank

                                        </div>


                                        <p className="text-2xl font-extrabold">

                                            #{leaderboardData.myRank}

                                        </p>

                                    </div>


                                    <div className="rounded-2xl bg-white border border-[#023222]/10 p-5">

                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">

                                            <Award
                                                size={16}
                                                className="text-[#0B5D45]"
                                            />

                                            Your Score

                                        </div>


                                        <p className="text-2xl font-extrabold">

                                            {leaderboardData.myScore}
                                            {" / "}
                                            {leaderboardData.totalMarks}

                                        </p>

                                    </div>


                                    <div className="rounded-2xl bg-white border border-[#023222]/10 p-5">

                                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">

                                            <Clock3
                                                size={16}
                                                className="text-[#9A7100]"
                                            />

                                            Time Taken

                                        </div>


                                        <p className="text-2xl font-extrabold">

                                            {formatTime(
                                                leaderboardData.myTimeTaken
                                            )}

                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                LOADING
                            ================================================== */}

                            {leaderboardLoading && (

                                <div className="space-y-3">

                                    {[1, 2, 3, 4].map(
                                        (item) => (

                                            <div
                                                key={item}
                                                className="h-16 bg-white rounded-xl animate-pulse border border-gray-100"
                                            />

                                        )
                                    )}

                                </div>

                            )}


                            {/* =================================================
                                TABLE
                            ================================================== */}

                            {!leaderboardLoading &&
                                leaderboardData && (

                                    <div className="bg-white rounded-2xl border border-[#023222]/10 overflow-hidden">


                                        {/* TABLE HEADER */}

                                        <div className="hidden md:grid grid-cols-[80px_1fr_140px_130px] gap-4 px-5 py-4 bg-[#F5E9D0]/50 border-b border-[#023222]/10 text-xs font-bold uppercase tracking-wider text-gray-500">

                                            <div>
                                                Rank
                                            </div>

                                            <div>
                                                Participant
                                            </div>

                                            <div>
                                                Score
                                            </div>

                                            <div>
                                                Time
                                            </div>

                                        </div>


                                        {/* ROWS */}

                                        <div className="divide-y divide-[#023222]/10">

                                            {leaderboardData.leaderboard.length === 0 && (

                                                <div className="p-10 text-center text-gray-500">
                                                    No participants found.
                                                </div>

                                            )}


                                            {leaderboardData.leaderboard.map(
                                                (student) => (

                                                    <div
                                                        key={student.studentId}
                                                        className={`
                                                            px-5 py-4
                                                            transition
                                                            ${
                                                                student.isCurrentStudent
                                                                    ? "bg-[#F5E9D0]/70 border-l-4 border-[#D4A017]"
                                                                    : "hover:bg-[#FAF8F2]"
                                                            }
                                                        `}
                                                    >

                                                        {/* DESKTOP */}

                                                        <div className="hidden md:grid grid-cols-[80px_1fr_140px_130px] gap-4 items-center">


                                                            {/* RANK */}

                                                            <div className="flex items-center gap-2">

                                                                {getRankIcon(
                                                                    student.rank
                                                                )}

                                                                <span className="font-bold">

                                                                    #{student.rank}

                                                                </span>

                                                            </div>


                                                            {/* STUDENT */}

                                                            <div className="flex items-center gap-3">

                                                                <div className={`
                                                                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                                                                    ${
                                                                        student.isCurrentStudent
                                                                            ? "bg-[#D4A017] text-[#023222]"
                                                                            : "bg-[#E5F0EB] text-[#0B5D45]"
                                                                    }
                                                                `}>

                                                                    {student.firstName?.charAt(0) ||
                                                                        "U"}

                                                                </div>


                                                                <div className="min-w-0">

                                                                    <p className="font-semibold truncate">

                                                                        {student.firstName}
                                                                        {" "}
                                                                        {student.lastName}

                                                                        {student.isCurrentStudent && (

                                                                            <span className="ml-2 text-[10px] uppercase tracking-wide text-[#9A7100] font-bold">
                                                                                You
                                                                            </span>

                                                                        )}

                                                                    </p>


                                                                    <p className="text-xs text-gray-500 truncate">
                                                                        {student.email}
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            {/* SCORE */}

                                                            <div>

                                                                <p className="font-extrabold">

                                                                    {student.score}
                                                                    {" / "}
                                                                    {student.totalMarks}

                                                                </p>

                                                            </div>


                                                            {/* TIME */}

                                                            <div className="text-sm text-gray-500">

                                                                {formatTime(
                                                                    student.timeTaken
                                                                )}

                                                            </div>

                                                        </div>


                                                        {/* MOBILE */}

                                                        <div className="md:hidden">

                                                            <div className="flex items-center justify-between gap-4">

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-9 h-9 rounded-full bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center font-bold">

                                                                        {student.rank}

                                                                    </div>


                                                                    <div>

                                                                        <p className="font-semibold">

                                                                            {student.firstName}
                                                                            {" "}
                                                                            {student.lastName}

                                                                            {student.isCurrentStudent && (

                                                                                <span className="ml-1 text-[9px] text-[#9A7100] font-bold">
                                                                                    YOU
                                                                                </span>

                                                                            )}

                                                                        </p>


                                                                        <p className="text-xs text-gray-500">

                                                                            Rank #{student.rank}

                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <div className="text-right">

                                                                    <p className="font-extrabold">

                                                                        {student.score}/{student.totalMarks}

                                                                    </p>


                                                                    <p className="text-xs text-gray-500">

                                                                        {formatTime(
                                                                            student.timeTaken
                                                                        )}

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}


                            {/* =================================================
                                PAGINATION
                            ================================================== */}

                            {!leaderboardLoading &&
                                leaderboardData &&
                                leaderboardData.pagination &&
                                leaderboardData.pagination.totalPages > 1 && (

                                    <div className="flex items-center justify-center gap-3 mt-6">

                                        <button
                                            type="button"
                                            disabled={
                                                !leaderboardData.pagination.hasPreviousPage
                                            }
                                            onClick={() =>
                                                openLeaderboard(
                                                    selectedQuiz,
                                                    currentPage - 1
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-white border border-[#023222]/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E5F0EB] transition"
                                        >

                                            <ChevronLeft size={18} />

                                        </button>


                                        <div className="px-4 h-10 rounded-xl bg-[#D4A017] text-[#023222] flex items-center justify-center font-bold text-sm">

                                            Page{" "}
                                            {leaderboardData.pagination.currentPage}
                                            {" "}
                                            of{" "}
                                            {leaderboardData.pagination.totalPages}

                                        </div>


                                        <button
                                            type="button"
                                            disabled={
                                                !leaderboardData.pagination.hasNextPage
                                            }
                                            onClick={() =>
                                                openLeaderboard(
                                                    selectedQuiz,
                                                    currentPage + 1
                                                )
                                            }
                                            className="w-10 h-10 rounded-xl bg-white border border-[#023222]/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E5F0EB] transition"
                                        >

                                            <ChevronRight size={18} />

                                        </button>

                                    </div>

                                )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


export default Leaderboard;