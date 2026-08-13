import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    Users,
    Trophy,
    ClipboardCheck,
    FileQuestion,
    CheckCircle2,
    XCircle,
    Clock3,
    Layers3,
    TrendingUp,
    PieChart as PieChartIcon,
    Menu,
    X,
    LogOut,
    RefreshCw,
    GraduationCap,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../../assets/logo/quivora-logo.png";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";


// ============================================================
// SERVER URL
// ============================================================

const SERVER_URL =
    "https://quivora-backend.onrender.com";


// ============================================================
// PROFILE IMAGE URL
// ============================================================

const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
        return null;
    }

    // If database already contains a complete URL
    if (
        profileImage.startsWith("http://") ||
        profileImage.startsWith("https://")
    ) {
        return profileImage;
    }

    // Remove accidental leading/trailing spaces
    const cleanPath = profileImage.trim();

    // If database contains only the filename
    if (
        !cleanPath.startsWith("/") &&
        !cleanPath.startsWith("uploads/")
    ) {
        return `${SERVER_URL}/uploads/profiles/${cleanPath}`;
    }

    // If database contains uploads/profiles/filename
    if (cleanPath.startsWith("uploads/")) {
        return `${SERVER_URL}/${cleanPath}`;
    }

    // If database contains /uploads/profiles/filename
    return `${SERVER_URL}${cleanPath}`;
};


// ============================================================
// ADMIN DASHBOARD
// ============================================================

const AdminDashboard = () => {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();


    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);


    // =========================================================
    // FETCH ADMIN DASHBOARD
    // =========================================================

    useEffect(() => {

        const fetchDashboard = async () => {

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
                        `${API_BASE_URL}/admin/dashboard`,
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
                        "Unable to load admin dashboard."
                    );

                }


                setDashboardData(
                    data.data
                );


            } catch (error) {

                console.error(
                    "Failed to fetch admin dashboard:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load admin dashboard."
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

                totalStudents: 0,

                activeStudents: 0,

                totalQuizzes: 0,

                publishedQuizzes: 0,

                draftQuizzes: 0,

                totalCategories: 0,

                activeCategories: 0,

                totalQuestions: 0,

                completedAttempts: 0,

                inProgressAttempts: 0,

                passedAttempts: 0,

                failedAttempts: 0,

                averageScore: 0,

                averagePercentage: 0,

                passRate: 0,

                failRate: 0,

            }
        );

    }, [dashboardData]);


    // =========================================================
    // CHART DATA
    // =========================================================

    const quizParticipation =
        dashboardData?.charts?.quizParticipation ||
        [];


    const categoryDistribution =
        dashboardData?.charts?.categoryDistribution ||
        [];


    // =========================================================
    // RECENT DATA
    // =========================================================

    const recentStudents =
        dashboardData?.recent?.students ||
        [];


    const recentQuizzes =
        dashboardData?.recent?.quizzes ||
        [];


    // =========================================================
    // QUIZ PARTICIPATION MAX
    // =========================================================

    const maxParticipants = useMemo(() => {

        if (
            quizParticipation.length === 0
        ) {
            return 1;
        }

        return Math.max(
            ...quizParticipation.map(
                (item) =>
                    Number(
                        item.participants || 0
                    )
            ),
            1
        );

    }, [quizParticipation]);


    // =========================================================
    // CATEGORY TOTAL
    // =========================================================

    const totalCategoryQuizzes =
        useMemo(() => {

            return categoryDistribution.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quizCount || 0
                    ),
                0
            );

        }, [categoryDistribution]);


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

        navigate("/admin/dashboard");

        closeMobileMenu();

    };


    const goToQuizzes = () => {

        navigate("/admin/quizzes");

        closeMobileMenu();

    };


    const goToStudents = () => {

        navigate("/admin/students");

        closeMobileMenu();

    };


    const goToLeaderboard = () => {

        navigate("/admin/leaderboard");

        closeMobileMenu();

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center">

                <div className="flex flex-col items-center gap-4">

                    <div className="w-11 h-11 rounded-full border-4 border-[#E5F0EB] border-t-[#0B5D45] animate-spin" />

                    <p className="text-sm text-gray-500">
                        Loading admin dashboard...
                    </p>

                </div>

            </div>

        );

    }


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


                {mobileMenuOpen && (

                    <div className="px-4 pb-4 border-t border-white/10">

                        <button
                            onClick={goToDashboard}
                            className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-[#D4A017] text-[#023222] font-semibold"
                        >
                            <LayoutDashboard size={18} />

                            Dashboard
                        </button>


                        <button
                            onClick={goToQuizzes}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 hover:bg-white/10"
                        >
                            <BookOpen size={18} />

                            Quizzes
                        </button>


                        <button
                            onClick={goToStudents}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 hover:bg-white/10"
                        >
                            <Users size={18} />

                            Students
                        </button>


                        <button
                            onClick={goToLeaderboard}
                            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl text-white/75 hover:bg-white/10"
                        >
                            <Trophy size={18} />

                            Leaderboard
                        </button>


                        <button
                            onClick={handleLogout}
                            className="w-full mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-red-200 hover:bg-red-500/10"
                        >
                            <LogOut size={18} />

                            Logout
                        </button>

                    </div>

                )}

            </header>


            {/* =====================================================
                DESKTOP NAVBAR
            ====================================================== */}

            <header className="hidden lg:flex sticky top-0 z-50 h-20 bg-[#023222] border-b border-[#023222]/10 px-8 items-center justify-between">

                {/* LOGO */}

                <div className="flex items-center shrink-0">

                    <img
                        src={logo}
                        alt="Quivora"
                        className="h-14 w-auto object-contain"
                    />

                </div>


                {/* NAVIGATION */}

                <nav className="flex items-center gap-2 ml-8">

                    <button
                        type="button"
                        onClick={goToDashboard}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-sm"
                    >

                        <LayoutDashboard size={17} />

                        Dashboard

                    </button>


                    <button
                        type="button"
                        onClick={goToQuizzes}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-100 hover:bg-[#E5F0EB] hover:text-[#0B5D45] transition"
                    >

                        <BookOpen size={17} />

                        Quizzes

                    </button>


                    <button
                        type="button"
                        onClick={goToStudents}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-100 hover:bg-[#E5F0EB] hover:text-[#0B5D45] transition"
                    >

                        <Users size={17} />

                        Students

                    </button>


                    <button
                        type="button"
                        onClick={goToLeaderboard}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-100 hover:bg-[#E5F0EB] hover:text-[#0B5D45] transition"
                    >

                        <Trophy size={17} />

                        Leaderboard

                    </button>

                </nav>


                {/* ADMIN PROFILE */}

                <div className="flex items-center gap-4 ml-auto">

                    <div className="text-right">

                        <p className="font-semibold text-gray-100">

                            {user?.firstName || ""}
                            {" "}
                            {user?.lastName || ""}

                        </p>


                        <p className="text-xs text-gray-500">
                            Administrator
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/profile"
                            )
                        }
                        className="w-11 h-11 rounded-full bg-[#F5E9D0] flex items-center justify-center text-[#023222] font-bold overflow-hidden hover:ring-2 hover:ring-[#D4A017] transition"
                    >

                        {user?.profileImage ? (

                            <img
                                src={getProfileImageUrl(
                                    user.profileImage
                                )}
                                alt={`${user?.firstName || "Admin"} profile`}
                                className="w-full h-full object-cover"
                            />

                        ) : (

                            user?.firstName?.charAt(0) ||
                            "A"

                        )}

                    </button>

                </div>

            </header>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main className="w-full">


                <div className="p-5 md:p-8 lg:p-6 max-w-[1500px] mx-auto">


                    {/* =================================================
                        WELCOME SECTION
                    ================================================== */}

                    <section className="relative overflow-hidden rounded-2xl bg-white text-white p-7 md:p-8 mb-5">

                        <div className="relative z-10 max-w-2xl">

                            <p className="text-[#D4A017] text-sm font-semibold tracking-wide mb-2">
                                ADMIN WORKSPACE
                            </p>


                            <h1 className="text-2xl md:text-4xl text-[#023222] font-extrabold mb-3">

                                Hello,{" "}
                                {user?.firstName ||
                                    "Admin"}{" "}
                                👋

                            </h1>


                            <p className="text-black/70 text-base leading-relaxed">

                                Manage quizzes, students,
                                questions and assessment
                                activity from one place.

                            </p>

                        </div>


                        <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full bg-[#D4A017]/15" />

                        <div className="absolute right-20 -top-24 w-48 h-48 rounded-full bg-white/5" />


                        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex w-20 h-20 rounded-2xl bg-white/10 items-center justify-center text-[#D4A017]">

                            <GraduationCap
                                size={38}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        PRIMARY STATISTICS
                    ================================================== */}

                    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">


                        {/* TOTAL STUDENTS */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Students
                                    </p>

                                    <p className="text-3xl font-extrabold mt-2">
                                        {statistics.totalStudents}
                                    </p>

                                </div>


                                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                    <Users size={22} />

                                </div>

                            </div>

                        </div>


                        {/* TOTAL QUIZZES */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Quizzes
                                    </p>

                                    <p className="text-3xl font-extrabold mt-2">
                                        {statistics.totalQuizzes}
                                    </p>

                                </div>


                                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F5E9D0] flex items-center justify-center text-[#9A7100]">

                                    <BookOpen size={22} />

                                </div>

                            </div>

                        </div>


                        {/* QUESTIONS */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Questions
                                    </p>

                                    <p className="text-3xl font-extrabold mt-2">
                                        {statistics.totalQuestions}
                                    </p>

                                </div>


                                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EEE9F7] flex items-center justify-center text-[#66538F]">

                                    <FileQuestion size={22} />

                                </div>

                            </div>

                        </div>


                        {/* ATTEMPTS */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Completed Attempts
                                    </p>

                                    <p className="text-3xl font-extrabold mt-2">
                                        {statistics.completedAttempts}
                                    </p>

                                </div>


                                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#E6F0F4] flex items-center justify-center text-[#3578A8]">

                                    <ClipboardCheck
                                        size={22}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SECONDARY STATISTICS
                    ================================================== */}

                    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">


                        {/* PUBLISHED */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Published Quizzes
                                    </p>

                                    <p className="text-2xl font-extrabold mt-2">
                                        {statistics.publishedQuizzes}
                                    </p>

                                </div>


                                <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                    <CheckCircle2
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* DRAFT */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Draft Quizzes
                                    </p>

                                    <p className="text-2xl font-extrabold mt-2">
                                        {statistics.draftQuizzes}
                                    </p>

                                </div>


                                <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] flex items-center justify-center text-[#9A7100]">

                                    <Clock3
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PASSED */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Passed Attempts
                                    </p>

                                    <p className="text-2xl font-extrabold mt-2">
                                        {statistics.passedAttempts}
                                    </p>

                                </div>


                                <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] flex items-center justify-center text-[#0B5D45]">

                                    <Trophy
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* FAILED */}

                        <div className="bg-white rounded-2xl p-5 border border-[#023222]/10 shadow-sm">

                            <div className="flex items-center justify-between gap-3">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Failed Attempts
                                    </p>

                                    <p className="text-2xl font-extrabold mt-2">
                                        {statistics.failedAttempts}
                                    </p>

                                </div>


                                <div className="w-11 h-11 rounded-xl bg-[#FDEAEA] flex items-center justify-center text-red-500">

                                    <XCircle
                                        size={21}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ANALYTICS
                    ================================================== */}

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">


                        {/* =================================================
                            PERFORMANCE
                        ================================================== */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                    <TrendingUp size={21} />

                                </div>


                                <div>

                                    <h2 className="text-lg font-extrabold">
                                        Overall Performance
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Platform assessment performance
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center justify-center gap-8 py-5">


                                {/* CIRCLE */}

                                <div
                                    className="w-44 h-44 rounded-full shrink-0 relative flex items-center justify-center"
                                    style={{
                                        background:
                                            `conic-gradient(#D4A017 0% ${Math.min(
                                                Number(
                                                    statistics.averagePercentage ||
                                                    0
                                                ),
                                                100
                                            )}%, #E5E7EB ${Math.min(
                                                Number(
                                                    statistics.averagePercentage ||
                                                    0
                                                ),
                                                100
                                            )}% 100%)`,
                                    }}
                                >

                                    <div className="w-28 h-28 rounded-full bg-white flex flex-col items-center justify-center">

                                        <span className="text-3xl font-extrabold text-[#023222]">

                                            {statistics.averagePercentage ||
                                                0}%

                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Average
                                        </span>

                                    </div>

                                </div>


                                {/* DETAILS */}

                                <div className="space-y-3 w-full max-w-[180px]">

                                    <div className="bg-[#FAF8F2] rounded-xl p-3">

                                        <p className="text-xs text-gray-500">
                                            Average Score
                                        </p>

                                        <p className="text-xl font-extrabold mt-1">
                                            {statistics.averageScore ||
                                                0}
                                        </p>

                                    </div>


                                    <div className="bg-[#E5F0EB] rounded-xl p-3">

                                        <p className="text-xs text-gray-500">
                                            Pass Rate
                                        </p>

                                        <p className="text-xl font-extrabold text-[#0B5D45] mt-1">
                                            {statistics.passRate ||
                                                0}%
                                        </p>

                                    </div>


                                    <div className="bg-[#FDEAEA] rounded-xl p-3">

                                        <p className="text-xs text-gray-500">
                                            Fail Rate
                                        </p>

                                        <p className="text-xl font-extrabold text-red-500 mt-1">
                                            {statistics.failRate ||
                                                0}%
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            ATTEMPT STATUS
                        ================================================== */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                    <PieChartIcon
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-lg font-extrabold">
                                        Attempt Overview
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Current quiz activity
                                    </p>

                                </div>

                            </div>


                            <div className="space-y-2">


                                <div className="flex items-center justify-between p-4 border-b border-gray-100">

                                    <div className="flex items-center gap-3">

                                        <span className="w-3 h-3 rounded-full bg-[#0B5D45]" />

                                        <span className="text-sm text-gray-600">
                                            Completed
                                        </span>

                                    </div>


                                    <span className="font-bold text-[#023222]">
                                        {statistics.completedAttempts}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between p-4 border-b border-gray-100">

                                    <div className="flex items-center gap-3">

                                        <span className="w-3 h-3 rounded-full bg-[#D4A017]" />

                                        <span className="text-sm text-gray-600">
                                            In Progress
                                        </span>

                                    </div>


                                    <span className="font-bold text-[#023222]">
                                        {statistics.inProgressAttempts}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between p-4 border-b border-gray-100">

                                    <div className="flex items-center gap-3">

                                        <span className="w-3 h-3 rounded-full bg-[#6CA984]" />

                                        <span className="text-sm text-gray-600">
                                            Passed
                                        </span>

                                    </div>


                                    <span className="font-bold text-[#023222]">
                                        {statistics.passedAttempts}
                                    </span>

                                </div>


                                <div className="flex items-center justify-between p-4">

                                    <div className="flex items-center gap-3">

                                        <span className="w-3 h-3 rounded-full bg-red-500" />

                                        <span className="text-sm text-gray-600">
                                            Failed
                                        </span>

                                    </div>


                                    <span className="font-bold text-[#023222]">
                                        {statistics.failedAttempts}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        QUIZ PARTICIPATION + CATEGORY
                    ================================================== */}

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-8">


                        {/* QUIZ PARTICIPATION */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                    <BarChartIcon
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="text-lg font-extrabold">
                                        Quiz Participation
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Student participation by quiz
                                    </p>

                                </div>

                            </div>


                            {quizParticipation.length === 0 ? (

                                <div className="h-48 flex flex-col items-center justify-center text-center">

                                    <BookOpen
                                        size={30}
                                        className="text-[#0B5D45] mb-3"
                                    />

                                    <p className="font-semibold">
                                        No participation data
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Quiz participation will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-5">

                                    {quizParticipation.map(
                                        (item) => {

                                            const percentage =
                                                (
                                                    Number(
                                                        item.participants ||
                                                        0
                                                    ) /
                                                    maxParticipants
                                                ) *
                                                100;


                                            return (

                                                <div
                                                    key={
                                                        item.quizId
                                                    }
                                                >

                                                    <div className="flex items-center justify-between gap-4 mb-2">

                                                        <span className="text-sm text-gray-600 truncate">

                                                            {
                                                                item.quizTitle
                                                            }

                                                        </span>


                                                        <span className="text-sm font-bold text-[#023222]">

                                                            {
                                                                item.participants
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                                        <div
                                                            className="h-full bg-[#0B5D45] rounded-full transition-all"
                                                            style={{
                                                                width:
                                                                    `${Math.max(
                                                                        percentage,
                                                                        4
                                                                    )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* CATEGORY DISTRIBUTION */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                    <Layers3 size={21} />

                                </div>


                                <div>

                                    <h2 className="text-lg font-extrabold">
                                        Category Distribution
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Quizzes across categories
                                    </p>

                                </div>

                            </div>


                            {categoryDistribution.length === 0 ? (

                                <div className="h-48 flex flex-col items-center justify-center text-center">

                                    <Layers3
                                        size={30}
                                        className="text-[#9A7100] mb-3"
                                    />

                                    <p className="font-semibold">
                                        No category data
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Categories will appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-5">

                                    {categoryDistribution.map(
                                        (category) => {

                                            const percentage =
                                                totalCategoryQuizzes >
                                                0
                                                    ? (
                                                        Number(
                                                            category.quizCount ||
                                                            0
                                                        ) /
                                                        totalCategoryQuizzes
                                                    ) *
                                                    100
                                                    : 0;


                                            return (

                                                <div
                                                    key={
                                                        category.categoryId
                                                    }
                                                >

                                                    <div className="flex items-center justify-between gap-4 mb-2">

                                                        <span className="text-sm text-gray-600 truncate">

                                                            {
                                                                category.categoryName
                                                            }

                                                        </span>


                                                        <span className="text-sm font-bold text-[#023222]">

                                                            {
                                                                category.quizCount
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                                        <div
                                                            className="h-full bg-[#D4A017] rounded-full"
                                                            style={{
                                                                width:
                                                                    `${Math.max(
                                                                        percentage,
                                                                        4
                                                                    )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        RECENT STUDENTS + RECENT QUIZZES
                    ================================================== */}

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-10">


                        {/* RECENT STUDENTS */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center justify-between mb-5">

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                        <Users size={21} />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-extrabold">
                                            Recent Students
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Recently registered students
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={
                                        goToStudents
                                    }
                                    className="text-sm font-semibold text-[#0B5D45] hover:underline"
                                >
                                    View All
                                </button>

                            </div>


                            {recentStudents.length === 0 ? (

                                <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                                    No students found.
                                </div>

                            ) : (

                                <div>

                                    {recentStudents.map(
                                        (student) => {

                                            const image =
                                                getProfileImageUrl(
                                                    student.profileImage
                                                );


                                            return (

                                                <div
                                                    key={
                                                        student.id
                                                    }
                                                    className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                                                >

                                                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#F5E9D0] text-[#023222] flex items-center justify-center font-bold overflow-hidden">

                                                        {image ? (

                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={`${student.firstName} ${student.lastName}`}
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            student.firstName?.charAt(
                                                                0
                                                            ) ||
                                                            "S"

                                                        )}

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p className="font-semibold text-sm truncate">

                                                            {
                                                                student.firstName
                                                            }{" "}
                                                            {
                                                                student.lastName
                                                            }

                                                        </p>


                                                        <p className="text-xs text-gray-500 truncate">

                                                            {
                                                                student.email
                                                            }

                                                        </p>

                                                    </div>


                                                    <span
                                                        className={`text-xs px-2.5 py-1 rounded-full ${
                                                            student.isActive
                                                                ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                                : "bg-[#FDEAEA] text-red-500"
                                                        }`}
                                                    >
                                                        {
                                                            student.isActive
                                                                ? "Active"
                                                                : "Inactive"
                                                        }
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* RECENT QUIZZES */}

                        <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6">

                            <div className="flex items-center justify-between mb-5">

                                <div className="flex items-center gap-3">

                                    <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                        <BookOpen size={21} />

                                    </div>


                                    <div>

                                        <h2 className="text-lg font-extrabold">
                                            Recent Quizzes
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Latest quizzes created
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={
                                        goToQuizzes
                                    }
                                    className="text-sm font-semibold text-[#0B5D45] hover:underline"
                                >
                                    View All
                                </button>

                            </div>


                            {recentQuizzes.length === 0 ? (

                                <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                                    No quizzes found.
                                </div>

                            ) : (

                                <div>

                                    {recentQuizzes.map(
                                        (quiz) => (

                                            <div
                                                key={
                                                    quiz.id
                                                }
                                                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                                            >

                                                <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                                    <BookOpen
                                                        size={19}
                                                    />

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <p className="font-semibold text-sm truncate">

                                                        {
                                                            quiz.title
                                                        }

                                                    </p>


                                                    <p className="text-xs text-gray-500 mt-1">

                                                        {
                                                            quiz.category?.name ||
                                                            "Uncategorized"
                                                        }

                                                        {" • "}

                                                        {
                                                            quiz.questionCount
                                                        }{" "}
                                                        questions

                                                        {" • "}

                                                        {
                                                            quiz.attemptCount
                                                        }{" "}
                                                        attempts

                                                    </p>

                                                </div>


                                                <span
                                                    className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                                                        quiz.isPublished
                                                            ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                            : "bg-[#F5E9D0] text-[#9A7100]"
                                                    }`}
                                                >
                                                    {
                                                        quiz.isPublished
                                                            ? "Published"
                                                            : "Draft"
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer className="mt-10 pt-6 border-t border-[#023222]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">

                        <p>
                            © 2026 Quivora.
                            Learn. Practice. Excel.
                        </p>


                        <p>
                            Secure Assessment Platform
                        </p>

                    </footer>

                </div>

            </main>

        </div>

    );

};


// ============================================================
// SMALL ICON ALIAS
// ============================================================

const BarChartIcon = ({ size = 21 }) => {

    return (
        <TrendingUp size={size} />
    );

};


export default AdminDashboard;