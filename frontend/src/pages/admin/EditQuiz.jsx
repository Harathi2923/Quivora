import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock3,
    FileText,
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
    "https://quivora-backend.onrender.com/api/v1";

const SERVER_URL = "https://quivora-backend.onrender.com";

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
};

// ============================================================
// EDIT QUIZ
// ============================================================

const EditQuiz = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useAuth();

    // ========================================================
    // FORM DATA
    // ========================================================

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "EASY",
        duration: "",
        totalMarks: "",
        passingMarks: "",
        negativeMarking: false,
        negativeMarks: "0",
        isPublished: false,
        categoryId: "",
    });

    // ========================================================
    // CATEGORIES
    // ========================================================

    const [categories, setCategories] = useState([]);

    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    // ========================================================
    // PAGE LOADING
    // ========================================================

    const [loading, setLoading] =
        useState(true);

    // ========================================================
    // SAVING
    // ========================================================

    const [saving, setSaving] =
        useState(false);

    // ========================================================
    // FETCH QUIZ + CATEGORIES
    // ========================================================

    useEffect(() => {

        const loadData = async () => {

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

                // ==================================================
                // FETCH QUIZ
                // ==================================================

                const quizResponse =
                    await fetch(
                        `${API_BASE_URL}/quizzes/${id}`,
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

                const quizResult =
                    await quizResponse.json();

                if (!quizResponse.ok) {

                    throw new Error(
                        quizResult.message ||
                        "Unable to load quiz."
                    );
                }

                const quiz =
                    quizResult?.data;

                if (!quiz) {

                    throw new Error(
                        "Quiz data not found."
                    );
                }

                // ==================================================
                // SET QUIZ DATA
                // ==================================================

                setFormData({
                    title:
                        quiz.title || "",

                    description:
                        quiz.description || "",

                    difficulty:
                        quiz.difficulty || "EASY",

                    duration:
                        quiz.duration ?? "",

                    totalMarks:
                        quiz.totalMarks ?? "",

                    passingMarks:
                        quiz.passingMarks ?? "",

                    negativeMarking:
                        Boolean(
                            quiz.negativeMarking
                        ),

                    negativeMarks:
                        quiz.negativeMarks ?? "0",

                    isPublished:
                        Boolean(
                            quiz.isPublished
                        ),

                    categoryId:
                        quiz.categoryId ||
                        quiz.category?.id ||
                        "",
                });

                // ==================================================
                // FETCH CATEGORIES
                // ==================================================

                setCategoriesLoading(true);

                const categoryResponse =
                    await fetch(
                        `${API_BASE_URL}/categories`,
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

                const categoryResult =
                    await categoryResponse.json();

                if (!categoryResponse.ok) {

                    throw new Error(
                        categoryResult.message ||
                        "Unable to load categories."
                    );
                }

                const categoryData =
                    categoryResult?.data;

                if (
                    Array.isArray(
                        categoryData
                    )
                ) {

                    setCategories(
                        categoryData
                    );

                } else if (
                    Array.isArray(
                        categoryData?.categories
                    )
                ) {

                    setCategories(
                        categoryData.categories
                    );

                } else if (
                    Array.isArray(
                        categoryData?.results
                    )
                ) {

                    setCategories(
                        categoryData.results
                    );

                } else {

                    setCategories([]);

                }

            } catch (error) {

                console.error(
                    "Edit quiz loading error:",
                    error
                );

                toast.error(
                    error.message ||
                    "Unable to load quiz."
                );

            } finally {

                setLoading(false);

                setCategoriesLoading(
                    false
                );

            }

        };

        if (id) {
            loadData();
        }

    }, [id, navigate]);

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
            })
        );

    };

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {

        if (!formData.title.trim()) {

            toast.error(
                "Quiz title is required."
            );

            return false;
        }

        if (!formData.categoryId) {

            toast.error(
                "Please select a category."
            );

            return false;
        }

        if (
            !formData.duration ||
            Number(formData.duration) <= 0
        ) {

            toast.error(
                "Please enter a valid duration."
            );

            return false;
        }

        if (
            !formData.totalMarks ||
            Number(formData.totalMarks) <= 0
        ) {

            toast.error(
                "Please enter valid total marks."
            );

            return false;
        }

        if (
            formData.passingMarks === "" ||
            Number(formData.passingMarks) < 0
        ) {

            toast.error(
                "Please enter valid passing marks."
            );

            return false;
        }

        if (
            Number(formData.passingMarks) >
            Number(formData.totalMarks)
        ) {

            toast.error(
                "Passing marks cannot be greater than total marks."
            );

            return false;
        }

        if (
            formData.negativeMarking &&
            (
                formData.negativeMarks === "" ||
                Number(formData.negativeMarks) < 0
            )
        ) {

            toast.error(
                "Please enter valid negative marks."
            );

            return false;
        }

        return true;
    };

    // ========================================================
    // SAVE CHANGES
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

                title:
                    formData.title.trim(),

                description:
                    formData.description.trim() ||
                    null,

                difficulty:
                    formData.difficulty,

                duration:
                    Number(
                        formData.duration
                    ),

                totalMarks:
                    Number(
                        formData.totalMarks
                    ),

                passingMarks:
                    Number(
                        formData.passingMarks
                    ),

                negativeMarking:
                    formData.negativeMarking,

                negativeMarks:
                    formData.negativeMarking
                        ? Number(
                            formData.negativeMarks
                        )
                        : 0,

                isPublished:
                    formData.isPublished,

                categoryId:
                    formData.categoryId,
            };

            const response =
                await fetch(
                    `${API_BASE_URL}/quizzes/${id}`,
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
                    "Failed to update quiz."
                );
            }

            toast.success(
                "Quiz updated successfully."
            );

            // Go back to View Quiz
            setTimeout(() => {

                navigate(
                    `/admin/quizzes/${id}`
                );

            }, 700);

        } catch (error) {

            console.error(
                "Update quiz error:",
                error
            );

            toast.error(
                error.message ||
                "Unable to update quiz."
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
            `/admin/quizzes/${id}`
        );

    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    background: COLORS.cream,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    color: COLORS.greenLight,
                    fontSize: "14px",
                }}
            >

                <Loader2
                    size={20}
                    style={{
                        animation:
                            "editQuizSpin 1s linear infinite",
                    }}
                />

                Loading quiz...

                <style>
                    {`
                        @keyframes editQuizSpin {
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
    // PAGE
    // ========================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                background: COLORS.cream,
                color: COLORS.green,
            }}
        >

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header
                style={{
                    height: "74px",
                    background: COLORS.white,
                    borderBottom:
                        `1px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 32px",
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >

                <img
                    src={logo}
                    alt="Quivora"
                    style={{
                        height: "52px",
                        width: "auto",
                        objectFit: "contain",
                    }}
                />

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
                            <BookOpen size={16} />
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
                            <Users size={16} />
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
                            <Trophy size={16} />
                        }
                        onClick={() =>
                            navigate(
                                "/admin/leaderboard"
                            )
                        }
                    />

                </nav>

                <div
                    style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: "11px",
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
                                color: COLORS.green,
                                fontSize: "12px",
                                fontWeight: "700",
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
                                color: COLORS.gray,
                                fontSize: "10px",
                            }}
                        >
                            Administrator
                        </p>

                    </div>

                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            background:
                                COLORS.goldSoft,
                            color: COLORS.green,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                            fontSize: "13px",
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
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />

                        ) : (

                            user?.firstName?.charAt(
                                0
                            ) || "A"

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
                            "min(1050px, calc(100% - 48px))",
                        margin: "0 auto",
                        padding: "25px 0 40px",
                    }}
                >

                    {/* BACK */}

                    <button
                        onClick={handleBack}
                        disabled={saving}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            border: "none",
                            background: "transparent",
                            color: COLORS.greenLight,
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: saving
                                ? "not-allowed"
                                : "pointer",
                            padding: "5px 0",
                            marginBottom: "18px",
                        }}
                    >

                        <ArrowLeft size={17} />

                        Back to Quiz

                    </button>

                    {/* PAGE HEADER */}

                    <div
                        style={{
                            marginBottom: "22px",
                        }}
                    >

                        <p
                            style={{
                                margin:
                                    "0 0 6px",
                                color:
                                    COLORS.greenLight,
                                fontSize: "10px",
                                fontWeight: "800",
                                letterSpacing:
                                    "0.15em",
                            }}
                        >
                            QUIZ MANAGEMENT
                        </p>

                        <h1
                            style={{
                                margin: 0,
                                color: COLORS.green,
                                fontSize: "27px",
                                fontWeight: "800",
                            }}
                        >
                            Edit Quiz
                        </h1>

                        <p
                            style={{
                                margin:
                                    "6px 0 0",
                                color: COLORS.gray,
                                fontSize: "12px",
                            }}
                        >
                            Update the quiz information
                            and scoring configuration.
                        </p>

                    </div>

                    {/* ==================================================
                        BASIC INFORMATION
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,
                            border:
                                `1px solid ${COLORS.border}`,
                            borderRadius: "16px",
                            padding: "23px",
                            marginBottom: "17px",
                            boxShadow:
                                "0 2px 7px rgba(2,50,34,0.035)",
                        }}
                    >

                        <SectionHeader
                            icon={
                                <FileText
                                    size={19}
                                />
                            }
                            title="Basic Information"
                            subtitle="Update the main details of your quiz."
                        />

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: "17px",
                            }}
                            className="edit-basic-grid"
                        >

                            {/* TITLE */}

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                }}
                            >

                                <FieldLabel>
                                    Quiz Title
                                </FieldLabel>

                                <input
                                    type="text"
                                    name="title"
                                    value={
                                        formData.title
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                }}
                            >

                                <FieldLabel>
                                    Description
                                </FieldLabel>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={4}
                                    style={{
                                        ...inputStyle,
                                        height: "100px",
                                        resize: "vertical",
                                        padding: "12px",
                                    }}
                                />

                            </div>

                            {/* CATEGORY */}

                            <div>

                                <FieldLabel>
                                    Category
                                </FieldLabel>

                                <select
                                    name="categoryId"
                                    value={
                                        formData.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        categoriesLoading
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="">
                                        {categoriesLoading
                                            ? "Loading categories..."
                                            : "Select category"}
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* DIFFICULTY */}

                            <div>

                                <FieldLabel>
                                    Difficulty
                                </FieldLabel>

                                <select
                                    name="difficulty"
                                    value={
                                        formData.difficulty
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                >

                                    <option value="EASY">
                                        Easy
                                    </option>

                                    <option value="MEDIUM">
                                        Medium
                                    </option>

                                    <option value="HARD">
                                        Hard
                                    </option>

                                </select>

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        QUIZ SETTINGS
                    ================================================== */}

                    <section
                        style={{
                            background:
                                COLORS.white,
                            border:
                                `1px solid ${COLORS.border}`,
                            borderRadius: "16px",
                            padding: "23px",
                            marginBottom: "17px",
                            boxShadow:
                                "0 2px 7px rgba(2,50,34,0.035)",
                        }}
                    >

                        <SectionHeader
                            icon={
                                <Clock3
                                    size={19}
                                />
                            }
                            title="Quiz Settings"
                            subtitle="Update duration and scoring rules."
                        />

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: "15px",
                            }}
                            className="edit-settings-grid"
                        >

                            {/* DURATION */}

                            <div>

                                <FieldLabel>
                                    Duration
                                </FieldLabel>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >

                                    <input
                                        type="number"
                                        min="1"
                                        name="duration"
                                        value={
                                            formData.duration
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={{
                                            ...inputStyle,
                                            paddingRight:
                                                "55px",
                                        }}
                                    />

                                    <span
                                        style={{
                                            position:
                                                "absolute",
                                            right:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            color:
                                                COLORS.gray,
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        min
                                    </span>

                                </div>

                            </div>

                            {/* TOTAL MARKS */}

                            <div>

                                <FieldLabel>
                                    Total Marks
                                </FieldLabel>

                                <input
                                    type="number"
                                    min="1"
                                    name="totalMarks"
                                    value={
                                        formData.totalMarks
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>

                            {/* PASSING MARKS */}

                            <div>

                                <FieldLabel>
                                    Passing Marks
                                </FieldLabel>

                                <input
                                    type="number"
                                    min="0"
                                    name="passingMarks"
                                    value={
                                        formData.passingMarks
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

                        {/* NEGATIVE MARKING */}

                        <div
                            style={{
                                marginTop: "19px",
                                paddingTop: "19px",
                                borderTop:
                                    `1px solid ${COLORS.border}`,
                            }}
                        >

                            <label
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: "10px",
                                    cursor:
                                        "pointer",
                                }}
                            >

                                <input
                                    type="checkbox"
                                    name="negativeMarking"
                                    checked={
                                        formData.negativeMarking
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={{
                                        width: "17px",
                                        height: "17px",
                                        accentColor:
                                            COLORS.greenLight,
                                        cursor:
                                            "pointer",
                                    }}
                                />

                                <span
                                    style={{
                                        color:
                                            COLORS.green,
                                        fontSize:
                                            "12px",
                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    Enable Negative Marking
                                </span>

                            </label>

                            <p
                                style={{
                                    margin:
                                        "6px 0 0 27px",
                                    color:
                                        COLORS.gray,
                                    fontSize:
                                        "10px",
                                }}
                            >
                                Deduct marks for incorrect
                                answers.
                            </p>

                            {formData.negativeMarking && (

                                <div
                                    style={{
                                        marginTop:
                                            "14px",
                                        maxWidth:
                                            "250px",
                                    }}
                                >

                                    <FieldLabel>
                                        Negative Marks
                                    </FieldLabel>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        name="negativeMarks"
                                        value={
                                            formData.negativeMarks
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={
                                            inputStyle
                                        }
                                    />

                                </div>

                            )}

                        </div>

                    </section>

                    {/* ==================================================
                        STATUS
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
                                "15px",
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
                                    margin: 0,
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "700",
                                }}
                            >
                                Quiz Status
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
                                Choose whether this quiz
                                is published or kept as a draft.
                            </p>

                        </div>

                        <select
                            name="isPublished"
                            value={
                                formData.isPublished
                                    ? "true"
                                    : "false"
                            }
                            onChange={(event) =>
                                setFormData(
                                    (previous) => ({
                                        ...previous,
                                        isPublished:
                                            event.target.value ===
                                            "true",
                                    })
                                )
                            }
                            style={{
                                height:
                                    "38px",
                                padding:
                                    "0 10px",
                                border:
                                    "1px solid rgba(255,255,255,0.2)",
                                borderRadius:
                                    "9px",
                                background:
                                    "rgba(255,255,255,0.10)",
                                color:
                                    COLORS.white,
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "700",
                                outline:
                                    "none",
                                cursor:
                                    "pointer",
                            }}
                        >

                            <option
                                value="false"
                                style={{
                                    color:
                                        COLORS.green,
                                }}
                            >
                                Draft
                            </option>

                            <option
                                value="true"
                                style={{
                                    color:
                                        COLORS.green,
                                }}
                            >
                                Published
                            </option>

                        </select>

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
                        className="edit-action-row"
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
                                            "editQuizSpin 1s linear infinite",
                                    }}
                                />

                            ) : (

                                <Save
                                    size={16}
                                />

                            )}

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

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

                    @media (max-width: 900px) {

                        .edit-settings-grid {
                            grid-template-columns:
                                1fr 1fr !important;
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

                        .edit-basic-grid,
                        .edit-settings-grid {
                            grid-template-columns:
                                1fr !important;
                        }

                        .edit-action-row {
                            flex-direction:
                                column !important;
                            align-items:
                                stretch !important;
                        }

                        .edit-action-row button {
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
// SECTION HEADER
// ============================================================

const SectionHeader = ({
    icon,
    title,
    subtitle,
}) => {

    return (

        <div
            style={{
                display:
                    "flex",
                alignItems:
                    "center",
                gap:
                    "11px",
                marginBottom:
                    "19px",
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
                {icon}
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
                    {title}
                </h2>

                <p
                    style={{
                        margin: 0,
                        color:
                            COLORS.gray,
                        fontSize:
                            "10px",
                    }}
                >
                    {subtitle}
                </p>

            </div>

        </div>
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
// EXPORT
// ============================================================

export default EditQuiz;