import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    FileQuestion,
    Loader2,
    Save,
    Trophy,
    Users,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/quivora-logo.png";

// ============================================================
// API
// ============================================================

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1";

const SERVER_URL = "http://localhost:5000";

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
};

// ============================================================
// EDIT QUESTION
// ============================================================

const EditQuestion = () => {

    const navigate = useNavigate();

    const {
        id: quizId,
        questionId,
    } = useParams();

    const { user } = useAuth();

    // ========================================================
    // FORM
    // ========================================================

    const [formData, setFormData] = useState({

        questionText: "",

        optionA: "",

        optionB: "",

        optionC: "",

        optionD: "",

        correctAnswer: "A",

        marks: "1",

    });

    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    // ========================================================
    // SAVING
    // ========================================================

    const [saving, setSaving] =
        useState(false);

    // ========================================================
    // FETCH QUESTION
    // ========================================================

    useEffect(() => {

        const fetchQuestion = async () => {

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

                    navigate("/login");

                    return;
                }

                const response =
                    await fetch(
                        `${API_BASE_URL}/questions/${questionId}`,
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
                        "Unable to load question."
                    );
                }

                const question =
                    result?.data;

                if (!question) {

                    throw new Error(
                        "Question data not found."
                    );
                }

                // ==================================================
                // MAKE SURE QUESTION BELONGS TO CURRENT QUIZ
                // ==================================================

                const belongsToQuiz =
                    question.quizId === quizId ||
                    question.quiz?.id === quizId;

                if (!belongsToQuiz) {

                    throw new Error(
                        "This question does not belong to this quiz."
                    );
                }

                // ==================================================
                // SET FORM
                // ==================================================

                setFormData({

                    questionText:
                        question.questionText ||
                        "",

                    optionA:
                        question.optionA ||
                        "",

                    optionB:
                        question.optionB ||
                        "",

                    optionC:
                        question.optionC ||
                        "",

                    optionD:
                        question.optionD ||
                        "",

                    correctAnswer:
                        question.correctAnswer ||
                        "A",

                    marks:
                        question.marks ??
                        "1",

                });

            } catch (error) {

                console.error(
                    "Fetch question error:",
                    error
                );

                toast.error(
                    error.message ||
                    "Unable to load question."
                );

            } finally {

                setLoading(false);

            }

        };

        if (
            questionId &&
            quizId
        ) {

            fetchQuestion();

        }

    }, [
        questionId,
        quizId,
        navigate,
    ]);

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,

                [name]: value,
            })
        );

    };

    // ========================================================
    // VALIDATE
    // ========================================================

    const validateForm = () => {

        if (
            !formData.questionText.trim()
        ) {

            toast.error(
                "Question is required."
            );

            return false;

        }

        if (
            !formData.optionA.trim()
        ) {

            toast.error(
                "Option A is required."
            );

            return false;

        }

        if (
            !formData.optionB.trim()
        ) {

            toast.error(
                "Option B is required."
            );

            return false;

        }

        if (
            !formData.optionC.trim()
        ) {

            toast.error(
                "Option C is required."
            );

            return false;

        }

        if (
            !formData.optionD.trim()
        ) {

            toast.error(
                "Option D is required."
            );

            return false;

        }

        if (
            !["A", "B", "C", "D"].includes(
                formData.correctAnswer
            )
        ) {

            toast.error(
                "Please select a correct answer."
            );

            return false;

        }

        if (
            !formData.marks ||
            Number(formData.marks) <= 0
        ) {

            toast.error(
                "Marks must be greater than 0."
            );

            return false;

        }

        return true;

    };

    // ========================================================
    // UPDATE QUESTION
    // ========================================================

    const handleSave = async () => {

        if (!validateForm()) {

            return;

        }

        try {

            setSaving(true);

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

            const payload = {

                questionText:
                    formData.questionText.trim(),

                optionA:
                    formData.optionA.trim(),

                optionB:
                    formData.optionB.trim(),

                optionC:
                    formData.optionC.trim(),

                optionD:
                    formData.optionD.trim(),

                correctAnswer:
                    formData.correctAnswer,

                marks:
                    Number(
                        formData.marks
                    ),

            };

            const response =
                await fetch(
                    `${API_BASE_URL}/questions/${questionId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            JSON.stringify(
                                payload
                            ),
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to update question."
                );

            }

            toast.success(
                "Question updated successfully."
            );

            // ==================================================
            // RETURN TO VIEW QUIZ
            // ==================================================

            setTimeout(() => {

                navigate(
                    `/admin/quizzes/${quizId}`
                );

            }, 700);

        } catch (error) {

            console.error(
                "Update question error:",
                error
            );

            toast.error(
                error.message ||
                "Unable to update question."
            );

        } finally {

            setSaving(false);

        }

    };

    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            `/admin/quizzes/${quizId}`
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
                            "editQuestionSpin 1s linear infinite",
                    }}
                />

                Loading question...

                <style>
                    {`
                        @keyframes editQuestionSpin {

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
    // PAGE
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
                            "min(950px, calc(100% - 48px))",

                        margin:
                            "0 auto",

                        padding:
                            "25px 0 40px",
                    }}
                >

                    {/* ==================================================
                        BACK
                    ================================================== */}

                    <button
                        onClick={
                            handleBack
                        }
                        disabled={
                            saving
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
                                saving
                                    ? "not-allowed"
                                    : "pointer",

                            padding:
                                "5px 0",

                            marginBottom:
                                "18px",
                        }}
                    >

                        <ArrowLeft
                            size={17}
                        />

                        Back to Quiz

                    </button>

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div
                        style={{
                            marginBottom:
                                "22px",
                        }}
                    >

                        <p
                            style={{
                                margin:
                                    "0 0 6px",

                                color:
                                    COLORS.greenLight,

                                fontSize:
                                    "10px",

                                fontWeight:
                                    "800",

                                letterSpacing:
                                    "0.15em",
                            }}
                        >
                            QUESTION MANAGEMENT
                        </p>

                        <h1
                            style={{
                                margin:
                                    0,

                                color:
                                    COLORS.green,

                                fontSize:
                                    "27px",

                                fontWeight:
                                    "800",
                            }}
                        >
                            Edit Question
                        </h1>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",

                                color:
                                    COLORS.gray,

                                fontSize:
                                    "12px",
                            }}
                        >
                            Update the question,
                            options, correct answer
                            and marks.
                        </p>

                    </div>

                    {/* ==================================================
                        QUESTION FORM
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
                                "23px",

                            marginBottom:
                                "17px",

                            boxShadow:
                                "0 2px 7px rgba(2,50,34,0.035)",
                        }}
                    >

                        {/* SECTION HEADER */}

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap:
                                    "11px",

                                marginBottom:
                                    "20px",
                            }}
                        >

                            <div
                                style={{
                                    width:
                                        "40px",

                                    height:
                                        "40px",

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

                                <FileQuestion
                                    size={19}
                                />

                            </div>

                            <div>

                                <h2
                                    style={{
                                        margin:
                                            "0 0 3px",

                                        color:
                                            COLORS.green,

                                        fontSize:
                                            "16px",

                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    Question Details
                                </h2>

                                <p
                                    style={{
                                        margin:
                                            0,

                                        color:
                                            COLORS.gray,

                                        fontSize:
                                            "10px",
                                    }}
                                >
                                    Modify the question
                                    and its answer options.
                                </p>

                            </div>

                        </div>

                        {/* QUESTION TEXT */}

                        <div
                            style={{
                                marginBottom:
                                    "18px",
                            }}
                        >

                            <FieldLabel>
                                Question
                            </FieldLabel>

                            <textarea
                                name="questionText"
                                value={
                                    formData.questionText
                                }
                                onChange={
                                    handleChange
                                }
                                rows={4}
                                placeholder="Enter the question..."
                                style={{
                                    ...textareaStyle,
                                }}
                            />

                        </div>

                        {/* OPTIONS */}

                        <div
                            style={{
                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "1fr 1fr",

                                gap:
                                    "15px",
                            }}
                            className="edit-question-options"
                        >

                            <OptionField
                                letter="A"
                                name="optionA"
                                value={
                                    formData.optionA
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <OptionField
                                letter="B"
                                name="optionB"
                                value={
                                    formData.optionB
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <OptionField
                                letter="C"
                                name="optionC"
                                value={
                                    formData.optionC
                                }
                                onChange={
                                    handleChange
                                }
                            />

                            <OptionField
                                letter="D"
                                name="optionD"
                                value={
                                    formData.optionD
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                        {/* ==================================================
                            CORRECT ANSWER + MARKS
                        ================================================== */}

                        <div
                            style={{
                                marginTop:
                                    "20px",

                                paddingTop:
                                    "20px",

                                borderTop:
                                    `1px solid ${COLORS.border}`,

                                display:
                                    "grid",

                                gridTemplateColumns:
                                    "1fr 1fr",

                                gap:
                                    "15px",
                            }}
                            className="answer-settings-grid"
                        >

                            {/* CORRECT ANSWER */}

                            <div>

                                <FieldLabel>
                                    Correct Answer
                                </FieldLabel>

                                <select
                                    name="correctAnswer"
                                    value={
                                        formData.correctAnswer
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="A">
                                        A — Option A
                                    </option>

                                    <option value="B">
                                        B — Option B
                                    </option>

                                    <option value="C">
                                        C — Option C
                                    </option>

                                    <option value="D">
                                        D — Option D
                                    </option>

                                </select>

                            </div>

                            {/* MARKS */}

                            <div>

                                <FieldLabel>
                                    Marks
                                </FieldLabel>

                                <input
                                    type="number"
                                    name="marks"
                                    min="1"
                                    value={
                                        formData.marks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        ANSWER PREVIEW
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.green,

                            borderRadius:
                                "15px",

                            padding:
                                "18px 21px",

                            marginBottom:
                                "21px",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "13px",

                            color:
                                COLORS.white,
                        }}
                    >

                        <div
                            style={{
                                width:
                                    "40px",

                                height:
                                    "40px",

                                borderRadius:
                                    "10px",

                                background:
                                    "rgba(255,255,255,0.09)",

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                color:
                                    COLORS.gold,

                                flexShrink:
                                    0,
                            }}
                        >

                            <CheckCircle2
                                size={21}
                            />

                        </div>

                        <div
                            style={{
                                flex: 1,
                            }}
                        >

                            <p
                                style={{
                                    margin:
                                        0,

                                    fontSize:
                                        "13px",

                                    fontWeight:
                                        "700",
                                }}
                            >
                                Correct Answer
                            </p>

                            <p
                                style={{
                                    margin:
                                        "3px 0 0",

                                    color:
                                        "rgba(255,255,255,0.65)",

                                    fontSize:
                                        "10px",
                                }}
                            >
                                Option{" "}
                                {formData.correctAnswer}
                                {" "}will be marked
                                as correct.
                            </p>

                        </div>

                        <div
                            style={{
                                padding:
                                    "8px 12px",

                                borderRadius:
                                    "9px",

                                background:
                                    "rgba(212,160,23,0.15)",

                                color:
                                    COLORS.gold,

                                fontSize:
                                    "11px",

                                fontWeight:
                                    "800",
                            }}
                        >
                            {formData.marks || 0}{" "}
                            Marks
                        </div>

                    </section>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            alignItems:
                                "center",

                            gap:
                                "12px",
                        }}
                        className="question-action-row"
                    >

                        <button
                            type="button"
                            onClick={
                                handleBack
                            }
                            disabled={
                                saving
                            }
                            style={{
                                height:
                                    "44px",

                                padding:
                                    "0 17px",

                                border:
                                    `1px solid ${COLORS.border}`,

                                borderRadius:
                                    "10px",

                                background:
                                    COLORS.white,

                                color:
                                    COLORS.grayDark,

                                fontSize:
                                    "12px",

                                fontWeight:
                                    "700",

                                cursor:
                                    saving
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleSave
                            }
                            disabled={
                                saving
                            }
                            style={{
                                height:
                                    "44px",

                                padding:
                                    "0 20px",

                                border:
                                    "none",

                                borderRadius:
                                    "10px",

                                background:
                                    COLORS.green,

                                color:
                                    COLORS.white,

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap:
                                    "8px",

                                fontSize:
                                    "12px",

                                fontWeight:
                                    "700",

                                cursor:
                                    saving
                                        ? "not-allowed"
                                        : "pointer",

                                opacity:
                                    saving
                                        ? 0.65
                                        : 1,

                                boxShadow:
                                    "0 4px 12px rgba(2,50,34,0.14)",
                            }}
                        >

                            {saving ? (

                                <Loader2
                                    size={16}
                                    style={{
                                        animation:
                                            "editQuestionSpin 1s linear infinite",
                                    }}
                                />

                            ) : (

                                <Save
                                    size={16}
                                />

                            )}

                            {saving
                                ? "Updating..."
                                : "Update Question"}

                        </button>

                    </div>

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
                RESPONSIVE
            ================================================== */}

            <style>
                {`

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

                        .edit-question-options,
                        .answer-settings-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .question-action-row {
                            flex-direction:
                                column !important;

                            align-items:
                                stretch !important;
                        }

                        .question-action-row button {
                            width:
                                100%;
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
// FIELD LABEL
// ============================================================

const FieldLabel = ({
    children,
}) => {

    return (

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
            {children}
        </label>

    );
};


// ============================================================
// OPTION FIELD
// ============================================================

const OptionField = ({
    letter,
    name,
    value,
    onChange,
}) => {

    return (

        <div>

            <FieldLabel>
                Option {letter}
            </FieldLabel>

            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    gap:
                        "8px",
                }}
            >

                <div
                    style={{
                        width:
                            "34px",

                        height:
                            "43px",

                        borderRadius:
                            "9px",

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
                            "12px",

                        fontWeight:
                            "800",

                        flexShrink:
                            0,
                    }}
                >
                    {letter}
                </div>

                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={`Enter option ${letter}...`}
                    style={
                        inputStyle
                    }
                />

            </div>

        </div>

    );
};


// ============================================================
// INPUT STYLE
// ============================================================

const inputStyle = {

    width:
        "100%",

    height:
        "43px",

    boxSizing:
        "border-box",

    padding:
        "0 12px",

    border:
        "1px solid #DCD8CF",

    borderRadius:
        "9px",

    background:
        "#FFFFFF",

    color:
        COLORS.green,

    outline:
        "none",

    fontSize:
        "12px",
};


// ============================================================
// TEXTAREA STYLE
// ============================================================

const textareaStyle = {

    width:
        "100%",

    minHeight:
        "110px",

    boxSizing:
        "border-box",

    padding:
        "12px",

    border:
        "1px solid #DCD8CF",

    borderRadius:
        "9px",

    background:
        "#FFFFFF",

    color:
        COLORS.green,

    outline:
        "none",

    fontSize:
        "12px",

    lineHeight:
        "1.5",

    resize:
        "vertical",
};


// ============================================================
// EXPORT
// ============================================================

export default EditQuestion;