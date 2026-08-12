import React, { useEffect, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock3,
    Edit3,
    FileQuestion,
    Layers3,
    Loader2,
    RotateCcw,
    Trash2,
    Trophy,
    Users,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import logo from "../../assets/logo/quivora-logo.png";


// ============================================================
// API
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1";

const SERVER_URL =
    "http://localhost:5000";


// ============================================================
// COLORS
// ============================================================

const COLORS = {

    cream:
        "#FAF8F2",

    green:
        "#023222",

    greenLight:
        "#0B5D45",

    greenSoft:
        "#E5F0EB",

    gold:
        "#D4A017",

    goldSoft:
        "#F5E9D0",

    white:
        "#FFFFFF",

    gray:
        "#6B7280",

    grayDark:
        "#374151",

    border:
        "#E5E1D7",

    red:
        "#DC4444",

    redSoft:
        "#FDEAEA",
};


// ============================================================
// VIEW QUIZ
// ============================================================

const ViewQuiz = () => {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const { user } =
        useAuth();


    // ========================================================
    // STATE
    // ========================================================

    const [quiz, setQuiz] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [deletedQuestions, setDeletedQuestions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [deletingQuestionId, setDeletingQuestionId] =
        useState(null);

    const [restoringQuestionId, setRestoringQuestionId] =
        useState(null);

    const [deleteConfirmId, setDeleteConfirmId] =
        useState(null);


    // ========================================================
    // FETCH QUIZ + QUESTIONS
    // ========================================================

    useEffect(() => {

        const fetchQuiz =
            async () => {

                try {

                    setLoading(true);


                    const token =
                        localStorage.getItem(
                            "quivora_token"
                        );


                    if (!token) {

                        toast.error(
                            "Authentication token not found."
                        );

                        navigate(
                            "/login"
                        );

                        return;
                    }


                    // ==================================================
                    // GET QUIZ
                    // ==================================================

                    const quizResponse =
                        await fetch(
                            `${API_BASE_URL}/quizzes/${id}`,
                            {
                                method:
                                    "GET",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    const quizResult =
                        await quizResponse.json();


                    if (!quizResponse.ok) {

                        throw new Error(
                            quizResult.message ||
                            "Unable to load quiz."
                        );

                    }


                    const quizData =
                        quizResult?.data;


                    setQuiz(
                        quizData
                    );


                    // ==================================================
                    // GET QUESTIONS
                    // ==================================================

                    const questionResponse =
                        await fetch(
                            `${API_BASE_URL}/questions`,
                            {
                                method:
                                    "GET",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    const questionResult =
                        await questionResponse.json();


                    if (!questionResponse.ok) {

                        throw new Error(
                            questionResult.message ||
                            "Unable to load questions."
                        );

                    }


                    const questionData =
                        questionResult?.data;


                    let allQuestions =
                        [];


                    if (
                        Array.isArray(
                            questionData
                        )
                    ) {

                        allQuestions =
                            questionData;

                    } else if (
                        Array.isArray(
                            questionData?.questions
                        )
                    ) {

                        allQuestions =
                            questionData.questions;

                    } else if (
                        Array.isArray(
                            questionData?.results
                        )
                    ) {

                        allQuestions =
                            questionData.results;

                    }


                    // ==================================================
                    // FILTER QUESTIONS FOR CURRENT QUIZ
                    // ==================================================

                    const quizQuestions =
                        allQuestions.filter(
                            (question) =>
                                question.quizId === id ||
                                question.quiz?.id === id
                        );


                    // ==================================================
                    // SEPARATE ACTIVE + DELETED
                    // ==================================================

                    const activeQuestions =
                        quizQuestions.filter(
                            (question) =>
                                question.isDeleted !== true
                        );


                    const deletedQuestionsList =
                        quizQuestions.filter(
                            (question) =>
                                question.isDeleted === true
                        );


                    setQuestions(
                        activeQuestions
                    );


                    setDeletedQuestions(
                        deletedQuestionsList
                    );


                } catch (error) {

                    console.error(
                        "View quiz error:",
                        error
                    );


                    toast.error(
                        error.message ||
                        "Unable to load quiz."
                    );


                } finally {

                    setLoading(false);

                }

            };


        if (id) {

            fetchQuiz();

        }

    }, [
        id,
        navigate,
    ]);


    // ========================================================
    // OPEN DELETE CONFIRMATION
    // ========================================================

    const openDeleteConfirmation = (
        questionId
    ) => {

        setDeleteConfirmId(
            questionId
        );

    };


    // ========================================================
    // CLOSE DELETE CONFIRMATION
    // ========================================================

    const closeDeleteConfirmation = () => {

        if (
            deletingQuestionId
        ) {

            return;

        }


        setDeleteConfirmId(
            null
        );

    };


    // ========================================================
    // DELETE QUESTION
    // ========================================================

    const handleDeleteQuestion = async (
        questionId
    ) => {

        try {

            setDeletingQuestionId(
                questionId
            );


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
                    `${API_BASE_URL}/questions/${questionId}`,
                    {
                        method:
                            "DELETE",

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
                    "Failed to delete question."
                );

            }


            // ==================================================
            // FIND QUESTION BEFORE REMOVING
            // ==================================================

            const deletedQuestion =
                questions.find(
                    (question) =>
                        question.id ===
                        questionId
                );


            // ==================================================
            // REMOVE FROM ACTIVE QUESTIONS
            // ==================================================

            setQuestions(
                (previous) =>
                    previous.filter(
                        (question) =>
                            question.id !==
                            questionId
                    )
            );


            // ==================================================
            // MOVE TO DELETED QUESTIONS
            // ==================================================

            if (deletedQuestion) {

                setDeletedQuestions(
                    (previous) => [

                        {
                            ...deletedQuestion,

                            isDeleted:
                                true,
                        },

                        ...previous,

                    ]
                );

            }


            // ==================================================
            // CLOSE MODAL
            // ==================================================

            setDeleteConfirmId(
                null
            );


            // ==================================================
            // TOAST
            // ==================================================

            toast.success(
                "Question deleted successfully."
            );


        } catch (error) {

            console.error(
                "Delete question error:",
                error
            );


            toast.error(
                error.message ||
                "Unable to delete question."
            );


        } finally {

            setDeletingQuestionId(
                null
            );

        }

    };


    // ========================================================
    // RESTORE QUESTION
    // ========================================================

    const handleRestoreQuestion = async (
        questionId
    ) => {

        try {

            setRestoringQuestionId(
                questionId
            );


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
                    `${API_BASE_URL}/questions/${questionId}/restore`,
                    {
                        method:
                            "PATCH",

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
                    "Failed to restore question."
                );

            }


            const restoredQuestion =
                result?.data;


            // ==================================================
            // REMOVE FROM DELETED
            // ==================================================

            setDeletedQuestions(
                (previous) =>
                    previous.filter(
                        (question) =>
                            question.id !==
                            questionId
                    )
            );


            // ==================================================
            // ADD BACK TO ACTIVE QUESTIONS
            // ==================================================

            if (
                restoredQuestion
            ) {

                setQuestions(
                    (previous) => [

                        ...previous,

                        {
                            ...restoredQuestion,

                            isDeleted:
                                false,
                        },

                    ]
                );

            }


            // ==================================================
            // TOAST
            // ==================================================

            toast.success(
                "Question restored successfully."
            );


        } catch (error) {

            console.error(
                "Restore question error:",
                error
            );


            toast.error(
                error.message ||
                "Unable to restore question."
            );


        } finally {

            setRestoringQuestionId(
                null
            );

        }

    };


    // ========================================================
    // EDIT QUESTION
    // ========================================================

    const handleEditQuestion = (
        questionId
    ) => {

        navigate(
            `/admin/quizzes/${id}/questions/${questionId}/edit`
        );

    };


    // ========================================================
    // EDIT QUIZ DETAILS
    // ========================================================

    const handleEditQuiz = () => {

        navigate(
            `/admin/quizzes/${id}/edit`
        );

    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/admin/quizzes"
        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight:
                        "100vh",

                    background:
                        COLORS.cream,

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
                        "14px",
                }}
            >

                <Loader2
                    size={20}
                    style={{
                        animation:
                            "spin 1s linear infinite",
                    }}
                />

                Loading quiz...

                <style>
                    {`

                        @keyframes spin {

                            from {
                                transform:
                                    rotate(0deg);
                            }

                            to {
                                transform:
                                    rotate(360deg);
                            }

                        }

                    `}
                </style>

            </div>

        );

    }


    // ========================================================
    // QUIZ NOT FOUND
    // ========================================================

    if (!quiz) {

        return (

            <div
                style={{
                    minHeight:
                        "100vh",

                    background:
                        COLORS.cream,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    padding:
                        "20px",
                }}
            >

                <div
                    style={{
                        background:
                            COLORS.white,

                        border:
                            `1px solid ${COLORS.border}`,

                        borderRadius:
                            "16px",

                        padding:
                            "30px",

                        textAlign:
                            "center",

                        maxWidth:
                            "420px",

                        width:
                            "100%",
                    }}
                >

                    <h2
                        style={{
                            margin:
                                "0 0 8px",

                            color:
                                COLORS.green,

                            fontSize:
                                "20px",
                        }}
                    >
                        Quiz not found
                    </h2>


                    <p
                        style={{
                            margin:
                                "0 0 20px",

                            color:
                                COLORS.gray,

                            fontSize:
                                "13px",
                        }}
                    >
                        The quiz you are looking for
                        does not exist or was removed.
                    </p>


                    <button
                        onClick={
                            handleBack
                        }
                        style={{
                            border:
                                "none",

                            borderRadius:
                                "10px",

                            background:
                                COLORS.green,

                            color:
                                COLORS.white,

                            padding:
                                "11px 18px",

                            cursor:
                                "pointer",

                            fontWeight:
                                "700",
                        }}
                    >
                        Back to Quizzes
                    </button>

                </div>

            </div>

        );

    }


    // ========================================================
    // CATEGORY
    // ========================================================

    const category =
        quiz.category?.name ||
        quiz.categoryName ||
        "Uncategorized";


    // ========================================================
    // QUESTION TO DELETE
    // ========================================================

    const questionToDelete =
        questions.find(
            (question) =>
                question.id ===
                deleteConfirmId
        );


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
            }}
        >


            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header
                style={{
                    height:
                        "74px",

                    background:
                        COLORS.white,

                    borderBottom:
                        `1px solid ${COLORS.border}`,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    padding:
                        "0 32px",

                    position:
                        "sticky",

                    top:
                        0,

                    zIndex:
                        50,
                }}
            >

                {/* LOGO */}

                <img
                    src={logo}
                    alt="Quivora"
                    style={{
                        height:
                            "52px",

                        width:
                            "auto",

                        objectFit:
                            "contain",
                    }}
                />


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
                        active
                        icon={
                            <BookOpen
                                size={16}
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
                                size={16}
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
                        icon={
                            <Trophy
                                size={16}
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
                            "11px",
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
                                margin:
                                    0,

                                color:
                                    COLORS.green,

                                fontSize:
                                    "12px",

                                fontWeight:
                                    "700",
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

                                color:
                                    COLORS.gray,

                                fontSize:
                                    "10px",
                            }}
                        >
                            Administrator
                        </p>

                    </div>


                    <div
                        style={{
                            width:
                                "40px",

                            height:
                                "40px",

                            borderRadius:
                                "50%",

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
                                "800",

                            fontSize:
                                "13px",
                        }}
                    >

                        {user?.profileImage ? (

                            <img
                                src={
                                    user.profileImage.startsWith(
                                        "http"
                                    )
                                        ? user.profileImage
                                        : `${SERVER_URL}${user.profileImage}`
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
                            ) ||
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
                            "min(1120px, calc(100% - 48px))",

                        margin:
                            "0 auto",

                        padding:
                            "25px 0 40px",
                    }}
                >


                    {/* ==================================================
                        TOP ACTIONS
                    ================================================== */}

                    <div
                        className="top-actions"
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            gap:
                                "15px",

                            marginBottom:
                                "18px",
                        }}
                    >

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
                                    "7px",

                                border:
                                    "none",

                                background:
                                    "transparent",

                                color:
                                    COLORS.greenLight,

                                fontSize:
                                    "13px",

                                fontWeight:
                                    "700",

                                cursor:
                                    "pointer",

                                padding:
                                    "6px 0",
                            }}
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back to Quizzes

                        </button>

                    </div>


                    {/* ==================================================
                        QUIZ HEADER
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.green,

                            borderRadius:
                                "17px",

                            padding:
                                "25px 28px",

                            marginBottom:
                                "17px",

                            color:
                                COLORS.white,

                            position:
                                "relative",

                            overflow:
                                "hidden",
                        }}
                    >

                        <div
                            style={{
                                position:
                                    "absolute",

                                width:
                                    "170px",

                                height:
                                    "170px",

                                borderRadius:
                                    "50%",

                                right:
                                    "-55px",

                                top:
                                    "-90px",

                                background:
                                    "rgba(255,255,255,0.06)",
                            }}
                        />


                        <div
                            style={{
                                position:
                                    "relative",

                                zIndex:
                                    2,
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "8px",

                                    marginBottom:
                                        "8px",
                                }}
                            >

                                <Layers3
                                    size={15}
                                    color={
                                        COLORS.gold
                                    }
                                />

                                <span
                                    style={{
                                        color:
                                            COLORS.gold,

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            "800",

                                        letterSpacing:
                                            "0.12em",

                                        textTransform:
                                            "uppercase",
                                    }}
                                >
                                    {category}
                                </span>

                            </div>


                            <h1
                                style={{
                                    margin:
                                        "0 0 7px",

                                    fontSize:
                                        "27px",

                                    lineHeight:
                                        "1.2",

                                    fontWeight:
                                        "800",
                                }}
                            >
                                {quiz.title}
                            </h1>


                            <p
                                style={{
                                    margin:
                                        0,

                                    maxWidth:
                                        "720px",

                                    color:
                                        "rgba(255,255,255,0.72)",

                                    fontSize:
                                        "12px",

                                    lineHeight:
                                        "1.6",
                                }}
                            >
                                {quiz.description ||
                                    "No description available."}
                            </p>

                        </div>

                    </section>


                    {/* ==================================================
                        QUIZ STATISTICS
                    ================================================== */}

                    <div
                        className="quiz-stat-grid"
                        style={{
                            display:
                                "grid",

                            gridTemplateColumns:
                                "repeat(5, minmax(0, 1fr))",

                            gap:
                                "11px",

                            marginBottom:
                                "18px",
                        }}
                    >

                        <StatCard
                            icon={
                                <FileQuestion
                                    size={18}
                                />
                            }
                            label="Questions"
                            value={
                                questions.length
                            }
                            tone="green"
                        />


                        <StatCard
                            icon={
                                <Clock3
                                    size={18}
                                />
                            }
                            label="Duration"
                            value={
                                `${quiz.duration || 0} min`
                            }
                            tone="blue"
                        />


                        <StatCard
                            icon={
                                <Trophy
                                    size={18}
                                />
                            }
                            label="Total Marks"
                            value={
                                quiz.totalMarks ??
                                0
                            }
                            tone="gold"
                        />


                        <StatCard
                            icon={
                                <CheckCircle2
                                    size={18}
                                />
                            }
                            label="Passing Marks"
                            value={
                                quiz.passingMarks ??
                                0
                            }
                            tone="purple"
                        />


                        <StatCard
                            icon={
                                <BookOpen
                                    size={18}
                                />
                            }
                            label="Difficulty"
                            value={
                                quiz.difficulty ||
                                "EASY"
                            }
                            tone="red"
                        />

                    </div>


                    {/* ==================================================
                        QUIZ SETTINGS
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,

                            border:
                                `1px solid ${COLORS.border}`,

                            borderRadius:
                                "15px",

                            padding:
                                "18px 20px",

                            marginBottom:
                                "18px",
                        }}
                    >

                        <div
                            style={{
                                display:
                                    "flex",

                                justifyContent:
                                    "space-between",

                                alignItems:
                                    "center",

                                gap:
                                    "15px",

                                marginBottom:
                                    "13px",
                            }}
                        >

                            <div>

                                <h2
                                    style={{
                                        margin:
                                            0,

                                        color:
                                            COLORS.green,

                                        fontSize:
                                            "16px",

                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    Quiz Settings
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
                                    Scoring and publishing
                                    configuration
                                </p>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "8px",

                                    flexShrink:
                                        0,
                                }}
                            >

                                {/* EDIT QUIZ DETAILS */}

                                <button
                                    type="button"
                                    onClick={
                                        handleEditQuiz
                                    }
                                    style={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap:
                                            "6px",

                                        border:
                                            `1px solid ${COLORS.greenLight}`,

                                        borderRadius:
                                            "8px",

                                        background:
                                            COLORS.white,

                                        color:
                                            COLORS.greenLight,

                                        padding:
                                            "7px 11px",

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            "700",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <Edit3
                                        size={13}
                                    />

                                    Edit Quiz

                                </button>


                                {/* STATUS */}

                                <span
                                    style={{
                                        padding:
                                            "6px 10px",

                                        borderRadius:
                                            "20px",

                                        background:
                                            quiz.isPublished
                                                ? COLORS.greenSoft
                                                : COLORS.goldSoft,

                                        color:
                                            quiz.isPublished
                                                ? COLORS.greenLight
                                                : "#9A7100",

                                        fontSize:
                                            "9px",

                                        fontWeight:
                                            "800",

                                        textTransform:
                                            "uppercase",
                                    }}
                                >
                                    {quiz.isPublished
                                        ? "Published"
                                        : "Draft"}
                                </span>

                            </div>

                        </div>


                        <div
                            style={{
                                display:
                                    "flex",

                                flexWrap:
                                    "wrap",

                                gap:
                                    "9px",
                            }}
                        >

                            <InfoBadge>
                                Category: {category}
                            </InfoBadge>


                            <InfoBadge>
                                Difficulty:{" "}
                                {quiz.difficulty ||
                                    "EASY"}
                            </InfoBadge>


                            <InfoBadge>
                                Duration:{" "}
                                {quiz.duration ||
                                    0}{" "}
                                minutes
                            </InfoBadge>


                            <InfoBadge>
                                Total Marks:{" "}
                                {quiz.totalMarks ??
                                    0}
                            </InfoBadge>


                            <InfoBadge>
                                Passing Marks:{" "}
                                {quiz.passingMarks ??
                                    0}
                            </InfoBadge>


                            <InfoBadge>
                                Negative Marking:{" "}
                                {quiz.negativeMarking
                                    ? `${quiz.negativeMarks || 0} marks`
                                    : "Disabled"}
                            </InfoBadge>

                        </div>

                    </section>


                    {/* ==================================================
                        QUESTIONS HEADER
                    ================================================== */}

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            marginBottom:
                                "12px",
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
                                        "0.12em",
                                }}
                            >
                                QUESTION MANAGEMENT
                            </p>


                            <h2
                                style={{
                                    margin:
                                        0,

                                    color:
                                        COLORS.green,

                                    fontSize:
                                        "19px",

                                    fontWeight:
                                        "800",
                                }}
                            >
                                Questions
                            </h2>

                        </div>


                        <span
                            style={{
                                color:
                                    COLORS.gray,

                                fontSize:
                                    "11px",
                            }}
                        >
                            {questions.length}{" "}
                            question
                            {questions.length !==
                            1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {/* ==================================================
                        ACTIVE QUESTIONS
                    ================================================== */}

                    {questions.length ===
                    0 ? (

                        <section
                            style={{
                                background:
                                    COLORS.white,

                                border:
                                    `1px solid ${COLORS.border}`,

                                borderRadius:
                                    "15px",

                                padding:
                                    "50px 20px",

                                textAlign:
                                    "center",
                            }}
                        >

                            <FileQuestion
                                size={42}
                                color="#A7B5AF"
                            />


                            <h3
                                style={{
                                    margin:
                                        "12px 0 5px",

                                    color:
                                        COLORS.green,

                                    fontSize:
                                        "17px",
                                }}
                            >
                                No questions found
                            </h3>


                            <p
                                style={{
                                    margin:
                                        0,

                                    color:
                                        COLORS.gray,

                                    fontSize:
                                        "12px",
                                }}
                            >
                                This quiz does not
                                have any active questions yet.
                            </p>

                        </section>

                    ) : (

                        <div
                            style={{
                                display:
                                    "flex",

                                flexDirection:
                                    "column",

                                gap:
                                    "12px",
                            }}
                        >

                            {questions.map(
                                (
                                    question,
                                    index
                                ) => (

                                    <QuestionCard
                                        key={
                                            question.id
                                        }

                                        question={
                                            question
                                        }

                                        index={
                                            index
                                        }

                                        deleting={
                                            deletingQuestionId ===
                                            question.id
                                        }

                                        onEdit={() =>
                                            handleEditQuestion(
                                                question.id
                                            )
                                        }

                                        onDelete={() =>
                                            openDeleteConfirmation(
                                                question.id
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}


                    {/* ==================================================
                        RECENTLY DELETED QUESTIONS
                    ================================================== */}

                    {deletedQuestions.length >
                        0 && (

                        <section
                            style={{
                                marginTop:
                                    "28px",
                            }}
                        >

                            <div
                                style={{
                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center",

                                    marginBottom:
                                        "12px",
                                }}
                            >

                                <div>

                                    <p
                                        style={{
                                            margin:
                                                "0 0 4px",

                                            color:
                                                COLORS.red,

                                            fontSize:
                                                "9px",

                                            fontWeight:
                                                "800",

                                            letterSpacing:
                                                "0.12em",
                                        }}
                                    >
                                        RECENTLY DELETED
                                    </p>


                                    <h2
                                        style={{
                                            margin:
                                                0,

                                            color:
                                                COLORS.green,

                                            fontSize:
                                                "19px",

                                            fontWeight:
                                                "800",
                                        }}
                                    >
                                        Deleted Questions
                                    </h2>

                                </div>


                                <span
                                    style={{
                                        color:
                                            COLORS.gray,

                                        fontSize:
                                            "11px",
                                    }}
                                >
                                    {
                                        deletedQuestions.length
                                    }{" "}
                                    deleted
                                </span>

                            </div>


                            <div
                                style={{
                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    gap:
                                        "10px",
                                }}
                            >

                                {deletedQuestions.map(
                                    (
                                        question,
                                        index
                                    ) => (

                                        <DeletedQuestionCard
                                            key={
                                                question.id
                                            }

                                            question={
                                                question
                                            }

                                            index={
                                                index
                                            }

                                            restoring={
                                                restoringQuestionId ===
                                                question.id
                                            }

                                            onRestore={() =>
                                                handleRestoreQuestion(
                                                    question.id
                                                )
                                            }
                                        />

                                    )
                                )}

                            </div>

                        </section>

                    )}


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        style={{
                            marginTop:
                                "30px",

                            paddingTop:
                                "17px",

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
                DELETE CONFIRMATION MODAL
            ================================================== */}

            {deleteConfirmId && (

                <div
                    onClick={
                        closeDeleteConfirmation
                    }
                    style={{
                        position:
                            "fixed",

                        inset:
                            0,

                        background:
                            "rgba(2, 50, 34, 0.42)",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        zIndex:
                            9999,

                        padding:
                            "20px",

                        backdropFilter:
                            "blur(3px)",
                    }}
                >

                    <div
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                        style={{
                            width:
                                "min(420px, 100%)",

                            background:
                                COLORS.white,

                            borderRadius:
                                "18px",

                            padding:
                                "25px",

                            boxShadow:
                                "0 22px 70px rgba(0,0,0,0.22)",

                            border:
                                `1px solid ${COLORS.border}`,
                        }}
                    >

                        {/* ICON */}

                        <div
                            style={{
                                width:
                                    "48px",

                                height:
                                    "48px",

                                borderRadius:
                                    "13px",

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
                                    "15px",
                            }}
                        >

                            <Trash2
                                size={22}
                            />

                        </div>


                        {/* TITLE */}

                        <h3
                            style={{
                                margin:
                                    "0 0 7px",

                                color:
                                    COLORS.green,

                                fontSize:
                                    "19px",

                                fontWeight:
                                    "800",
                            }}
                        >
                            Delete Question?
                        </h3>


                        {/* MESSAGE */}

                        <p
                            style={{
                                margin:
                                    "0",

                                color:
                                    COLORS.gray,

                                fontSize:
                                    "12px",

                                lineHeight:
                                    "1.65",
                            }}
                        >

                            Are you sure you want to
                            delete this question?

                            <br />

                            You can restore it later from
                            the Recently Deleted section.

                        </p>


                        {/* QUESTION PREVIEW */}

                        {questionToDelete && (

                            <div
                                style={{
                                    marginTop:
                                        "15px",

                                    padding:
                                        "11px 12px",

                                    borderRadius:
                                        "10px",

                                    background:
                                        COLORS.cream,

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    color:
                                        COLORS.grayDark,

                                    fontSize:
                                        "11px",

                                    lineHeight:
                                        "1.5",
                                }}
                            >

                                {questionToDelete.questionText}

                            </div>

                        )}


                        {/* ACTIONS */}

                        <div
                            style={{
                                display:
                                    "flex",

                                justifyContent:
                                    "flex-end",

                                gap:
                                    "9px",

                                marginTop:
                                    "22px",
                            }}
                        >

                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={
                                    closeDeleteConfirmation
                                }
                                disabled={
                                    deletingQuestionId !==
                                    null
                                }
                                style={{
                                    height:
                                        "40px",

                                    padding:
                                        "0 17px",

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    borderRadius:
                                        "9px",

                                    background:
                                        COLORS.white,

                                    color:
                                        COLORS.grayDark,

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        "700",

                                    cursor:
                                        "pointer",
                                }}
                            >
                                Cancel
                            </button>


                            {/* DELETE */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleDeleteQuestion(
                                        deleteConfirmId
                                    )
                                }
                                disabled={
                                    deletingQuestionId !==
                                    null
                                }
                                style={{
                                    height:
                                        "40px",

                                    padding:
                                        "0 18px",

                                    border:
                                        "none",

                                    borderRadius:
                                        "9px",

                                    background:
                                        COLORS.red,

                                    color:
                                        COLORS.white,

                                    fontSize:
                                        "12px",

                                    fontWeight:
                                        "700",

                                    cursor:
                                        deletingQuestionId !==
                                        null
                                            ? "not-allowed"
                                            : "pointer",

                                    opacity:
                                        deletingQuestionId !==
                                        null
                                            ? 0.65
                                            : 1,
                                }}
                            >

                                {deletingQuestionId !==
                                null ? (
                                    <span
                                        style={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap:
                                                "6px",
                                        }}
                                    >

                                        <Loader2
                                            size={14}
                                            style={{
                                                animation:
                                                    "spin 1s linear infinite",
                                            }}
                                        />

                                        Deleting...

                                    </span>

                                ) : (

                                    "Delete"

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                RESPONSIVE
            ================================================== */}

            <style>
                {`

                    @keyframes spin {

                        from {
                            transform:
                                rotate(0deg);
                        }

                        to {
                            transform:
                                rotate(360deg);
                        }

                    }


                    @media (max-width: 1000px) {

                        .quiz-stat-grid {
                            grid-template-columns:
                                repeat(3, 1fr) !important;
                        }

                    }


                    @media (max-width: 700px) {

                        header {
                            padding:
                                0 16px !important;
                        }

                        header nav {
                            display:
                                none !important;
                        }

                        main > div {
                            width:
                                calc(100% - 24px) !important;

                            padding-top:
                                18px !important;
                        }

                        .quiz-stat-grid {
                            grid-template-columns:
                                repeat(2, 1fr) !important;
                        }

                        .top-actions {
                            flex-direction:
                                column !important;

                            align-items:
                                stretch !important;
                        }

                        .question-options {
                            grid-template-columns:
                                1fr !important;
                        }

                    }


                    @media (max-width: 450px) {

                        .quiz-stat-grid {
                            grid-template-columns:
                                1fr !important;
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
            onClick={
                onClick
            }
            style={{
                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    "7px",

                padding:
                    "9px 13px",

                border:
                    "none",

                borderRadius:
                    "10px",

                background:
                    active
                        ? COLORS.gold
                        : "transparent",

                color:
                    active
                        ? COLORS.green
                        : "#5F6B67",

                fontSize:
                    "12px",

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
    tone,
}) => {

    const toneStyles = {

        green: {
            background:
                COLORS.greenSoft,

            color:
                COLORS.greenLight,
        },

        blue: {
            background:
                "#E7F0F4",

            color:
                "#3A7187",
        },

        gold: {
            background:
                COLORS.goldSoft,

            color:
                "#A87900",
        },

        purple: {
            background:
                "#EEEAF7",

            color:
                "#66538F",
        },

        red: {
            background:
                COLORS.redSoft,

            color:
                COLORS.red,
        },

    };


    const currentTone =
        toneStyles[tone] ||
        toneStyles.green;


    return (

        <div
            style={{
                background:
                    COLORS.white,

                border:
                    `1px solid ${COLORS.border}`,

                borderRadius:
                    "13px",

                padding:
                    "13px",

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
                        "36px",

                    height:
                        "36px",

                    borderRadius:
                        "10px",

                    background:
                        currentTone.background,

                    color:
                        currentTone.color,

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


            <div
                style={{
                    minWidth:
                        0,
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
                            "3px",
                    }}
                >
                    {label}
                </span>


                <strong
                    style={{
                        color:
                            COLORS.green,

                        fontSize:
                            "16px",

                        lineHeight:
                            "1",

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    {value}
                </strong>

            </div>

        </div>

    );

};


// ============================================================
// INFO BADGE
// ============================================================

const InfoBadge = ({
    children,
}) => {

    return (

        <span
            style={{
                padding:
                    "7px 10px",

                borderRadius:
                    "9px",

                background:
                    COLORS.cream,

                border:
                    `1px solid ${COLORS.border}`,

                color:
                    COLORS.grayDark,

                fontSize:
                    "10px",

                fontWeight:
                    "600",
            }}
        >
            {children}
        </span>

    );

};


// ============================================================
// QUESTION CARD
// ============================================================

const QuestionCard = ({
    question,
    index,
    deleting,
    onEdit,
    onDelete,
}) => {

    const correctAnswer =
        question.correctAnswer;


    const optionStyle = (
        option
    ) => {

        const isCorrect =
            correctAnswer ===
            option;


        return {

            padding:
                "11px 12px",

            borderRadius:
                "9px",

            border:
                isCorrect
                    ? `1px solid ${COLORS.greenLight}`
                    : "1px solid #E8E5DD",

            background:
                isCorrect
                    ? COLORS.greenSoft
                    : "#FCFCFA",

            color:
                isCorrect
                    ? COLORS.green
                    : COLORS.grayDark,

            fontSize:
                "11px",

            display:
                "flex",

            alignItems:
                "center",

            gap:
                "8px",

            fontWeight:
                isCorrect
                    ? "700"
                    : "500",

        };

    };


    return (

        <section
            style={{
                background:
                    COLORS.white,

                border:
                    `1px solid ${COLORS.border}`,

                borderRadius:
                    "15px",

                padding:
                    "19px 20px",

                boxShadow:
                    "0 2px 7px rgba(2,50,34,0.035)",
            }}
        >

            {/* QUESTION HEADER */}

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "flex-start",

                    gap:
                        "15px",

                    marginBottom:
                        "14px",
                }}
            >

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "9px",

                        minWidth:
                            0,
                    }}
                >

                    <div
                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

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

                            fontSize:
                                "11px",

                            fontWeight:
                                "800",

                            flexShrink:
                                0,
                        }}
                    >
                        {index + 1}
                    </div>


                    <div>

                        <span
                            style={{
                                display:
                                    "block",

                                color:
                                    COLORS.greenLight,

                                fontSize:
                                    "9px",

                                fontWeight:
                                    "800",

                                letterSpacing:
                                    "0.08em",
                            }}
                        >
                            QUESTION {index + 1}
                        </span>


                        <span
                            style={{
                                color:
                                    COLORS.gray,

                                fontSize:
                                    "9px",
                            }}
                        >
                            {question.marks ??
                                0}{" "}
                            mark
                            {Number(
                                question.marks
                            ) !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>

                </div>


                {/* ACTIONS */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "7px",

                        flexShrink:
                            0,
                    }}
                >

                    {/* EDIT */}

                    <button
                        type="button"
                        onClick={
                            onEdit
                        }
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "5px",

                            border:
                                "1px solid #DCD8CF",

                            borderRadius:
                                "8px",

                            background:
                                COLORS.white,

                            color:
                                COLORS.greenLight,

                            padding:
                                "7px 9px",

                            fontSize:
                                "10px",

                            fontWeight:
                                "700",

                            cursor:
                                "pointer",
                        }}
                    >

                        <Edit3
                            size={13}
                        />

                        Edit

                    </button>


                    {/* DELETE */}

                    <button
                        type="button"
                        onClick={
                            onDelete
                        }
                        disabled={
                            deleting
                        }
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "5px",

                            border:
                                `1px solid ${COLORS.red}30`,

                            borderRadius:
                                "8px",

                            background:
                                COLORS.redSoft,

                            color:
                                COLORS.red,

                            padding:
                                "7px 9px",

                            fontSize:
                                "10px",

                            fontWeight:
                                "700",

                            cursor:
                                deleting
                                    ? "not-allowed"
                                    : "pointer",

                            opacity:
                                deleting
                                    ? 0.6
                                    : 1,
                        }}
                    >

                        {deleting ? (

                            <Loader2
                                size={13}
                                style={{
                                    animation:
                                        "spin 1s linear infinite",
                                }}
                            />

                        ) : (

                            <Trash2
                                size={13}
                            />

                        )}

                        Delete

                    </button>

                </div>

            </div>


            {/* QUESTION TEXT */}

            <div
                style={{
                    background:
                        COLORS.cream,

                    borderRadius:
                        "10px",

                    padding:
                        "13px 14px",

                    marginBottom:
                        "13px",
                }}
            >

                <p
                    style={{
                        margin:
                            0,

                        color:
                            COLORS.green,

                        fontSize:
                            "13px",

                        lineHeight:
                            "1.55",

                        fontWeight:
                            "700",
                    }}
                >
                    {question.questionText}
                </p>

            </div>


            {/* OPTIONS */}

            <div
                className="question-options"
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "1fr 1fr",

                    gap:
                        "9px",
                }}
            >

                <div
                    style={
                        optionStyle("A")
                    }
                >

                    <strong>
                        A.
                    </strong>

                    <span>
                        {question.optionA}
                    </span>

                    {correctAnswer ===
                        "A" && (

                        <CheckCircle2
                            size={15}
                            style={{
                                marginLeft:
                                    "auto",
                            }}
                        />

                    )}

                </div>


                <div
                    style={
                        optionStyle("B")
                    }
                >

                    <strong>
                        B.
                    </strong>

                    <span>
                        {question.optionB}
                    </span>

                    {correctAnswer ===
                        "B" && (

                        <CheckCircle2
                            size={15}
                            style={{
                                marginLeft:
                                    "auto",
                            }}
                        />

                    )}

                </div>


                <div
                    style={
                        optionStyle("C")
                    }
                >

                    <strong>
                        C.
                    </strong>

                    <span>
                        {question.optionC}
                    </span>

                    {correctAnswer ===
                        "C" && (

                        <CheckCircle2
                            size={15}
                            style={{
                                marginLeft:
                                    "auto",
                            }}
                        />

                    )}

                </div>


                <div
                    style={
                        optionStyle("D")
                    }
                >

                    <strong>
                        D.
                    </strong>

                    <span>
                        {question.optionD}
                    </span>

                    {correctAnswer ===
                        "D" && (

                        <CheckCircle2
                            size={15}
                            style={{
                                marginLeft:
                                    "auto",
                            }}
                        />

                    )}

                </div>

            </div>


            {/* CORRECT ANSWER */}

            <div
                style={{
                    marginTop:
                        "13px",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        "8px",

                    color:
                        COLORS.greenLight,

                    fontSize:
                        "10px",

                    fontWeight:
                        "700",
                }}
            >

                <CheckCircle2
                    size={15}
                />

                Correct Answer:
                {" "}
                {correctAnswer ||
                    "Not specified"}

            </div>

        </section>

    );

};


// ============================================================
// DELETED QUESTION CARD
// ONLY RESTORE BUTTON
// ============================================================

const DeletedQuestionCard = ({
    question,
    index,
    restoring,
    onRestore,
}) => {

    return (

        <section
            style={{
                background:
                    COLORS.white,

                border:
                    `1px solid ${COLORS.border}`,

                borderRadius:
                    "15px",

                padding:
                    "15px 17px",

                boxShadow:
                    "0 2px 7px rgba(2,50,34,0.025)",
            }}
        >

            <div
                style={{
                    display:
                        "flex",

                    justifyContent:
                        "space-between",

                    alignItems:
                        "center",

                    gap:
                        "15px",
                }}
            >

                {/* QUESTION */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap:
                            "10px",

                        minWidth:
                            0,

                        flex:
                            1,
                    }}
                >

                    <div
                        style={{
                            width:
                                "30px",

                            height:
                                "30px",

                            borderRadius:
                                "9px",

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

                            fontSize:
                                "10px",

                            fontWeight:
                                "800",

                            flexShrink:
                                0,
                        }}
                    >
                        {index + 1}
                    </div>


                    <div
                        style={{
                            minWidth:
                                0,

                            flex:
                                1,
                        }}
                    >

                        <span
                            style={{
                                display:
                                    "block",

                                color:
                                    COLORS.red,

                                fontSize:
                                    "8px",

                                fontWeight:
                                    "800",

                                letterSpacing:
                                    "0.1em",

                                marginBottom:
                                    "4px",
                            }}
                        >
                            DELETED QUESTION
                        </span>


                        <p
                            style={{
                                margin:
                                    0,

                                color:
                                    COLORS.grayDark,

                                fontSize:
                                    "11px",

                                fontWeight:
                                    "600",

                                overflow:
                                    "hidden",

                                textOverflow:
                                    "ellipsis",

                                whiteSpace:
                                    "nowrap",
                            }}
                        >
                            {question.questionText}
                        </p>

                    </div>

                </div>


                {/* RESTORE ONLY */}

                <button
                    type="button"
                    onClick={
                        onRestore
                    }
                    disabled={
                        restoring
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

                        borderRadius:
                            "8px",

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
                            restoring
                                ? "not-allowed"
                                : "pointer",

                        opacity:
                            restoring
                                ? 0.6
                                : 1,

                        flexShrink:
                            0,
                    }}
                >

                    {restoring ? (

                        <Loader2
                            size={13}
                            style={{
                                animation:
                                    "spin 1s linear infinite",
                            }}
                        />

                    ) : (

                        <RotateCcw
                            size={13}
                        />

                    )}

                    {restoring
                        ? "Restoring..."
                        : "Restore"}

                </button>

            </div>

        </section>

    );

};


export default ViewQuiz;