import React, { useEffect, useMemo, useState } from "react";

import {
    ArrowLeft,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    HelpCircle,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
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
    grayLight: "#F5F6F4",

    border: "#E5E1D7",

    red: "#DC4444",
    redSoft: "#FDEAEA",

    blue: "#3B6F8F",
    blueSoft: "#E7F0F5",
};


// ============================================================
// DEFAULT QUESTION
// ============================================================

const createEmptyQuestion = () => ({
    id: null,

    questionText: "",

    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",

    correctAnswer: "",

    marks: "1",
});


// ============================================================
// CREATE QUIZ
// ============================================================

const CreateQuiz = () => {

    const navigate = useNavigate();

    const { user } = useAuth();


    // ========================================================
    // QUIZ FORM
    // ========================================================

    const [formData, setFormData] = useState({

        title: "",

        description: "",

        categoryId: "",

        difficulty: "EASY",

        duration: "30",

        questionCount: "10",

        totalMarks: "20",

        passingMarks: "10",

        negativeMarking: false,

        negativeMarks: "0.5",

    });


    // ========================================================
    // CATEGORIES
    // ========================================================

    const [categories, setCategories] = useState([]);

    const [categoriesLoading, setCategoriesLoading] =
        useState(true);

    // ========================================================
    // CREATE NEW CATEGORY
    // ========================================================

    const [categoryDropdown, setCategoryDropdown] =
        useState(false);

    const [newCategoryName, setNewCategoryName] =
        useState("");

    const [creatingCategory, setCreatingCategory] =
        useState(false);


    // ========================================================
    // QUIZ ID
    // Created when we move from quiz information
    // to questions.
    // ========================================================

    const [quizId, setQuizId] = useState(null);


    // ========================================================
    // STEP
    //
    // 1 = Quiz Information
    // 2 = Questions
    // ========================================================

    const [step, setStep] = useState(1);


    // ========================================================
    // QUESTIONS
    // ========================================================

    const [questions, setQuestions] = useState([
        createEmptyQuestion(),
    ]);


    // ========================================================
    // CURRENT QUESTION
    // ========================================================

    const [currentQuestionIndex, setCurrentQuestionIndex] =
        useState(0);


    // ========================================================
    // LOADING STATES
    // ========================================================

    const [savingQuiz, setSavingQuiz] =
        useState(false);

    const [savingQuestion, setSavingQuestion] =
        useState(false);

    const [publishing, setPublishing] =
        useState(false);


    // ========================================================
    // CURRENT QUESTION
    // ========================================================

    const currentQuestion =
        questions[currentQuestionIndex];


    // ========================================================
    // COMPLETED QUESTIONS
    // ========================================================

    const completedQuestionCount = useMemo(() => {

        return questions.filter(
            (question) =>
                question.questionText.trim() &&
                question.optionA.trim() &&
                question.optionB.trim() &&
                question.optionC.trim() &&
                question.optionD.trim() &&
                question.correctAnswer
        ).length;

    }, [questions]);


    // ========================================================
    // FETCH CATEGORIES
    // ========================================================

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                setCategoriesLoading(true);

                const token =
                    localStorage.getItem(
                        "quivora_token"
                    );


                const response =
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


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to load categories."
                    );

                }


                const data =
                    result?.data;


                if (Array.isArray(data)) {

                    setCategories(data);

                } else if (
                    Array.isArray(
                        data?.categories
                    )
                ) {

                    setCategories(
                        data.categories
                    );

                } else if (
                    Array.isArray(
                        data?.results
                    )
                ) {

                    setCategories(
                        data.results
                    );

                } else {

                    setCategories([]);

                }

            } catch (error) {

                console.error(
                    "Category fetch error:",
                    error
                );

                toast.error(
                    error.message ||
                    "Unable to load categories."
                );

            } finally {

                setCategoriesLoading(false);

            }

        };


        fetchCategories();

    }, []);


    // ========================================================
    // CREATE NEW CATEGORY
    // ========================================================

    const createNewCategory = async () => {

        const categoryName = newCategoryName.trim();

        if (!categoryName) {
            toast.error("Please enter a category name.");
            return;
        }

        const alreadyExists = categories.some(
            (category) =>
                category.name.trim().toLowerCase() ===
                categoryName.toLowerCase()
        );

        if (alreadyExists) {
            toast.error("This category already exists.");
            return;
        }

        try {

            setCreatingCategory(true);

            const token =
                localStorage.getItem("quivora_token");

            if (!token) {
                toast.error("Authentication token not found.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/categories`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name: categoryName,
                        description: `${categoryName} fundamentals and programming concepts.`,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to create category."
                );
            }

            const createdCategory = result?.data;

            if (!createdCategory?.id) {
                throw new Error(
                    "Category was created but category ID was not returned."
                );
            }

            // Add the new category immediately to the dropdown.
            setCategories((previous) => [
                createdCategory,
                ...previous,
            ]);

            // Automatically select the newly created category.
            setFormData((previous) => ({
                ...previous,
                categoryId: createdCategory.id,
            }));

            setNewCategoryName("");
            setCategoryDropdown(false);

            toast.success(
                `\"${createdCategory.name}\" category created successfully.`
            );

        } catch (error) {

            console.error(
                "Create category error:",
                error
            );

            toast.error(
                error.message ||
                "Unable to create category."
            );

        } finally {
            setCreatingCategory(false);
        }
    };


    const handleCategoryKeyDown = (event) => {

        if (event.key === "Enter") {
            event.preventDefault();

            if (!creatingCategory) {
                createNewCategory();
            }
        }

        if (event.key === "Escape") {
            setNewCategoryName("");
            setCategoryDropdown(false);
        }
    };


    // ========================================================
    // HANDLE QUIZ INPUT
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };


    // ========================================================
    // HANDLE QUESTION INPUT
    // ========================================================

    const handleQuestionChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setQuestions((previous) => {

            const updated =
                [...previous];


            updated[currentQuestionIndex] = {

                ...updated[
                    currentQuestionIndex
                ],

                [name]: value,

            };


            return updated;

        });

    };


    // ========================================================
    // VALIDATE QUIZ
    // ========================================================

    const validateQuiz = () => {

        if (
            !formData.title.trim()
        ) {

            toast.error(
                "Quiz title is required."
            );

            return false;

        }


        if (
            !formData.categoryId
        ) {

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
            !formData.questionCount ||
            Number(formData.questionCount) <= 0
        ) {

            toast.error(
                "Please enter the number of questions."
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
    // CREATE QUIZ
    //
    // This creates the quiz as DRAFT first.
    // Then questions are added to that quiz.
    // ========================================================

    const createQuizAndContinue = async () => {

        if (!validateQuiz()) {
            return;
        }


        try {

            setSavingQuiz(true);


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
                    false,

                categoryId:
                    formData.categoryId,

            };


            const response =
                await fetch(
                    `${API_BASE_URL}/quizzes`,
                    {
                        method: "POST",

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
                    "Failed to create quiz."
                );

            }


            const createdQuiz =
                result?.data;


            if (!createdQuiz?.id) {

                throw new Error(
                    "Quiz was created but quiz ID was not returned."
                );

            }


            setQuizId(
                createdQuiz.id
            );


            // Create the requested number
            // of question slots.

            const count =
                Number(
                    formData.questionCount
                );


            const newQuestions =
                Array.from(
                    {
                        length: count,
                    },
                    () =>
                        createEmptyQuestion()
                );


            setQuestions(
                newQuestions
            );


            setCurrentQuestionIndex(
                0
            );


            setStep(2);


            toast.success(
                "Quiz created. Now add your questions."
            );

        } catch (error) {

            console.error(
                "Create quiz error:",
                error
            );


            toast.error(
                error.message ||
                "Unable to create quiz."
            );

        } finally {

            setSavingQuiz(false);

        }

    };


    // ========================================================
    // VALIDATE QUESTION
    // ========================================================

    const validateQuestion = () => {

        if (
            !currentQuestion.questionText.trim()
        ) {

            toast.error(
                "Question text is required."
            );

            return false;

        }


        if (
            !currentQuestion.optionA.trim()
        ) {

            toast.error(
                "Option A is required."
            );

            return false;

        }


        if (
            !currentQuestion.optionB.trim()
        ) {

            toast.error(
                "Option B is required."
            );

            return false;

        }


        if (
            !currentQuestion.optionC.trim()
        ) {

            toast.error(
                "Option C is required."
            );

            return false;

        }


        if (
            !currentQuestion.optionD.trim()
        ) {

            toast.error(
                "Option D is required."
            );

            return false;

        }


        if (
            !currentQuestion.correctAnswer
        ) {

            toast.error(
                "Please select the correct answer."
            );

            return false;

        }


        if (
            !currentQuestion.marks ||
            Number(currentQuestion.marks) <= 0
        ) {

            toast.error(
                "Question marks must be greater than 0."
            );

            return false;

        }


        return true;

    };


    // ========================================================
    // SAVE CURRENT QUESTION
    //
    // POST if new question.
    // PUT if question already exists.
    // ========================================================

    const saveCurrentQuestion =
        async () => {

            if (!quizId) {

                toast.error(
                    "Quiz ID is missing."
                );

                return false;

            }


            if (!validateQuestion()) {

                return false;

            }


            try {

                setSavingQuestion(true);


                const token =
                    localStorage.getItem(
                        "quivora_token"
                    );


                const payload = {

                    questionText:
                        currentQuestion.questionText.trim(),

                    optionA:
                        currentQuestion.optionA.trim(),

                    optionB:
                        currentQuestion.optionB.trim(),

                    optionC:
                        currentQuestion.optionC.trim(),

                    optionD:
                        currentQuestion.optionD.trim(),

                    correctAnswer:
                        currentQuestion.correctAnswer,

                    marks:
                        Number(
                            currentQuestion.marks
                        ),

                    quizId,

                };


                let response;


                // =================================================
                // NEW QUESTION
                // =================================================

                if (
                    !currentQuestion.id
                ) {

                    response =
                        await fetch(
                            `${API_BASE_URL}/questions`,
                            {
                                method:
                                    "POST",

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

                }

                // =================================================
                // EXISTING QUESTION
                // =================================================

                else {

                    response =
                        await fetch(
                            `${API_BASE_URL}/questions/${currentQuestion.id}`,
                            {
                                method:
                                    "PUT",

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

                }


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Failed to save question."
                    );

                }


                const savedQuestion =
                    result?.data;


                if (
                    savedQuestion?.id
                ) {

                    setQuestions(
                        (previous) => {

                            const updated =
                                [...previous];


                            updated[
                                currentQuestionIndex
                            ] = {

                                ...updated[
                                    currentQuestionIndex
                                ],

                                id:
                                    savedQuestion.id,

                            };


                            return updated;

                        }
                    );

                }


                return true;

            } catch (error) {

                console.error(
                    "Save question error:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to save question."
                );


                return false;

            } finally {

                setSavingQuestion(false);

            }

        };


    // ========================================================
    // NEXT QUESTION
    // ========================================================

    const handleNextQuestion =
        async () => {

            const saved =
                await saveCurrentQuestion();


            if (!saved) {
                return;
            }


            if (
                currentQuestionIndex <
                questions.length - 1
            ) {

                setCurrentQuestionIndex(
                    (previous) =>
                        previous + 1
                );

                return;

            }


            toast.success(
                "All questions have been saved."
            );

        };


    // ========================================================
    // PREVIOUS QUESTION
    // ========================================================

    const handlePreviousQuestion =
        async () => {

            if (
                currentQuestionIndex === 0
            ) {

                return;

            }


            // Save current question before
            // moving backward if it has content.

            const hasContent =
                currentQuestion.questionText.trim() ||
                currentQuestion.optionA.trim() ||
                currentQuestion.optionB.trim() ||
                currentQuestion.optionC.trim() ||
                currentQuestion.optionD.trim();


            if (hasContent) {

                const saved =
                    await saveCurrentQuestion();


                if (!saved) {
                    return;
                }

            }


            setCurrentQuestionIndex(
                (previous) =>
                    previous - 1
            );

        };


    // ========================================================
    // JUMP TO QUESTION
    // ========================================================

    const handleQuestionJump =
        async (index) => {

            if (
                index ===
                currentQuestionIndex
            ) {

                return;

            }


            const hasContent =
                currentQuestion.questionText.trim() ||
                currentQuestion.optionA.trim() ||
                currentQuestion.optionB.trim() ||
                currentQuestion.optionC.trim() ||
                currentQuestion.optionD.trim();


            if (hasContent) {

                const saved =
                    await saveCurrentQuestion();


                if (!saved) {
                    return;
                }

            }


            setCurrentQuestionIndex(
                index
            );

        };


    // ========================================================
    // DELETE CURRENT QUESTION
    // ========================================================

    const deleteCurrentQuestion =
        async () => {

            if (
                questions.length === 1
            ) {

                toast.info(
                    "At least one question is required."
                );

                return;

            }


            const question =
                questions[
                    currentQuestionIndex
                ];


            try {

                // =================================================
                // DELETE FROM DATABASE
                // =================================================

                if (question.id) {

                    const token =
                        localStorage.getItem(
                            "quivora_token"
                        );


                    const response =
                        await fetch(
                            `${API_BASE_URL}/questions/${question.id}`,
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
                            "Unable to delete question."
                        );

                    }

                }


                // =================================================
                // DELETE FROM LOCAL STATE
                // =================================================

                setQuestions(
                    (previous) =>
                        previous.filter(
                            (_, index) =>
                                index !==
                                currentQuestionIndex
                        )
                );


                setCurrentQuestionIndex(
                    (previous) => {

                        if (
                            previous >=
                            questions.length - 1
                        ) {

                            return Math.max(
                                0,
                                questions.length - 2
                            );

                        }

                        return previous;

                    }
                );


                toast.success(
                    "Question deleted."
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

            }

        };


    // ========================================================
    // ADD EXTRA QUESTION
    // ========================================================

    const addQuestion =
        () => {

            setQuestions(
                (previous) => [

                    ...previous,

                    createEmptyQuestion(),

                ]
            );


            setCurrentQuestionIndex(
                questions.length
            );


            // Keep the displayed
            // question count in sync.

            setFormData(
                (previous) => ({

                    ...previous,

                    questionCount:
                        String(
                            questions.length + 1
                        ),

                })
            );

        };


    // ========================================================
    // SAVE DRAFT
    // ========================================================

    const saveDraft =
        async () => {

            if (!quizId) {

                toast.error(
                    "Quiz has not been created yet."
                );

                return;

            }


            try {

                setSavingQuiz(true);


                const token =
                    localStorage.getItem(
                        "quivora_token"
                    );


                // Save current question if
                // there is something entered.

                const hasContent =
                    currentQuestion.questionText.trim() ||
                    currentQuestion.optionA.trim() ||
                    currentQuestion.optionB.trim() ||
                    currentQuestion.optionC.trim() ||
                    currentQuestion.optionD.trim();


                if (hasContent) {

                    const saved =
                        await saveCurrentQuestion();


                    if (!saved) {
                        return;
                    }

                }


                // Make sure quiz remains draft.

                const response =
                    await fetch(
                        `${API_BASE_URL}/quizzes/${quizId}`,
                        {
                            method:
                                "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body:
                                JSON.stringify({
                                    isPublished:
                                        false,
                                }),

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to save draft."
                    );

                }


                toast.success(
                    "Quiz saved as draft."
                );

            } catch (error) {

                console.error(
                    "Save draft error:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to save draft."
                );

            } finally {

                setSavingQuiz(false);

            }

        };


    // ========================================================
    // PUBLISH QUIZ
    // ========================================================

    const publishQuiz =
        async () => {

            if (!quizId) {

                toast.error(
                    "Quiz has not been created yet."
                );

                return;

            }


            // Make sure every question
            // has been completed.

            const incompleteQuestion =
                questions.findIndex(
                    (question) =>
                        !question.questionText.trim() ||
                        !question.optionA.trim() ||
                        !question.optionB.trim() ||
                        !question.optionC.trim() ||
                        !question.optionD.trim() ||
                        !question.correctAnswer ||
                        !question.marks ||
                        Number(question.marks) <= 0
                );


            if (
                incompleteQuestion !== -1
            ) {

                setCurrentQuestionIndex(
                    incompleteQuestion
                );


                toast.error(
                    `Please complete Question ${incompleteQuestion + 1} before publishing.`
                );


                return;

            }


            try {

                setPublishing(true);


                // Save current question.

                const saved =
                    await saveCurrentQuestion();


                if (!saved) {
                    return;
                }


                const token =
                    localStorage.getItem(
                        "quivora_token"
                    );


                const response =
                    await fetch(
                        `${API_BASE_URL}/quizzes/${quizId}`,
                        {
                            method:
                                "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body:
                                JSON.stringify({
                                    isPublished:
                                        true,
                                }),

                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to publish quiz."
                    );

                }


                toast.success(
                    "Quiz published successfully!"
                );


                setTimeout(() => {

                    navigate(
                        "/admin/quizzes"
                    );

                }, 700);

            } catch (error) {

                console.error(
                    "Publish quiz error:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to publish quiz."
                );

            } finally {

                setPublishing(false);

            }

        };


    // ========================================================
    // BACK TO QUIZZES
    // ========================================================

    const handleBack =
        () => {

            navigate(
                "/admin/quizzes"
            );

        };


    // ========================================================
    // SELECT DIFFICULTY
    // ========================================================

    const difficultyOptions = [

        {
            value: "EASY",
            label: "Easy",
            description:
                "Basic level",
        },

        {
            value: "MEDIUM",
            label: "Medium",
            description:
                "Intermediate level",
        },

        {
            value: "HARD",
            label: "Hard",
            description:
                "Advanced level",
        },

    ];


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
                        "76px",

                    background:
                        COLORS.white,

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
                            "54px",

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
                            "5px",

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


                {/* ADMIN PROFILE */}

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

                        <div
                            style={{
                                fontSize:
                                    "12px",

                                fontWeight:
                                    "800",

                                color:
                                    COLORS.green,
                            }}
                        >

                            {user?.firstName ||
                                "Admin"}{" "}

                            {user?.lastName ||
                                ""}

                        </div>


                        <div
                            style={{
                                marginTop:
                                    "2px",

                                fontSize:
                                    "10px",

                                color:
                                    COLORS.gray,
                            }}
                        >
                            Administrator
                        </div>

                    </div>


                    <div
                        style={{
                            width:
                                "40px",

                            height:
                                "40px",

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

                            overflow:
                                "hidden",

                            fontSize:
                                "13px",

                            fontWeight:
                                "800",
                        }}
                    >

                        {user?.profileImage ? (

                            <img
                                src={
                                    user.profileImage.startsWith(
                                        "http"
                                    )
                                        ? user.profileImage
                                        : `http://localhost:5000${user.profileImage}`
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

                    </div>

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main>

                <div
                    style={{
                        width:
                            "min(1180px, calc(100% - 48px))",

                        margin:
                            "0 auto",

                        padding:
                            "25px 0 40px",
                    }}
                >


                    {/* =================================================
                        BACK
                    ================================================= */}

                    <button
                        onClick={
                            handleBack
                        }
                        style={{
                            border:
                                "none",

                            background:
                                "transparent",

                            padding:
                                "3px 0",

                            display:
                                "flex",

                            alignItems:
                                "center",

                            gap:
                                "7px",

                            color:
                                COLORS.greenLight,

                            fontSize:
                                "12px",

                            fontWeight:
                                "700",

                            cursor:
                                "pointer",

                            marginBottom:
                                "18px",
                        }}
                    >

                        <ArrowLeft
                            size={16}
                        />

                        Back to Quizzes

                    </button>


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "flex-end",

                            justifyContent:
                                "space-between",

                            gap:
                                "20px",

                            marginBottom:
                                "22px",
                        }}
                    >

                        <div>

                            <p
                                style={{
                                    margin:
                                        "0 0 6px",

                                    color:
                                        COLORS.greenLight,

                                    fontSize:
                                        "9px",

                                    fontWeight:
                                        "800",

                                    letterSpacing:
                                        "0.15em",
                                }}
                            >
                                QUIZ MANAGEMENT
                            </p>


                            <h1
                                style={{
                                    margin:
                                        0,

                                    fontSize:
                                        "27px",

                                    lineHeight:
                                        "1.15",

                                    fontWeight:
                                        "800",

                                    color:
                                        COLORS.green,
                                }}
                            >
                                Create New Quiz
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
                                {step === 1
                                    ? "Configure your quiz before adding questions."
                                    : "Add questions, review them and publish your quiz."}
                            </p>

                        </div>


                        {/* STEP INDICATOR */}

                        <div
                            style={{
                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap:
                                    "9px",
                            }}
                        >

                            <StepCircle
                                number="1"
                                label="Quiz"
                                active={
                                    step === 1
                                }
                                completed={
                                    step === 2
                                }
                            />

                            <div
                                style={{
                                    width:
                                        "32px",

                                    height:
                                        "1px",

                                    background:
                                        step === 2
                                            ? COLORS.greenLight
                                            : COLORS.border,
                                }}
                            />

                            <StepCircle
                                number="2"
                                label="Questions"
                                active={
                                    step === 2
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        STEP 1
                        QUIZ INFORMATION
                    ================================================== */}

                    {step === 1 && (

                        <>

                            {/* BASIC INFORMATION */}

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
                                        "16px",

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
                                    subtitle="Enter the main details of your assessment."
                                />


                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "1fr 1fr",

                                        gap:
                                            "16px",
                                    }}
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
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: Java Basics Quiz"
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
                                            rows={3}
                                            placeholder="Briefly describe what students will learn or be tested on..."
                                            style={{
                                                ...inputStyle,

                                                height:
                                                    "85px",

                                                padding:
                                                    "11px 12px",

                                                resize:
                                                    "vertical",
                                            }}
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div>

                                        <FieldLabel>
                                            Category
                                        </FieldLabel>


                                        <div style={{ position: "relative" }}>

                                            {/* CATEGORY SELECT BUTTON */}

                                            <button
                                                type="button"
                                                disabled={categoriesLoading}
                                                onClick={() => {
                                                    setCategoryDropdown((previous) =>
                                                        previous === "dropdown"
                                                            ? false
                                                            : "dropdown"
                                                    );
                                                }}
                                                style={{
                                                    ...inputStyle,
                                                    width: "100%",
                                                    height: "44px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    textAlign: "left",
                                                    cursor: categoriesLoading
                                                        ? "not-allowed"
                                                        : "pointer",
                                                    color: formData.categoryId
                                                        ? COLORS.grayDark
                                                        : COLORS.gray,
                                                    background: COLORS.white,
                                                }}
                                            >
                                                <span>
                                                    {categoriesLoading
                                                        ? "Loading categories..."
                                                        : formData.categoryId
                                                            ? categories.find(
                                                                (category) =>
                                                                    category.id ===
                                                                    formData.categoryId
                                                            )?.name ||
                                                              "Select category"
                                                            : "Select category"}
                                                </span>

                                                <span
                                                    style={{
                                                        fontSize: "16px",
                                                        lineHeight: 1,
                                                    }}
                                                >
                                                    {categoryDropdown === "dropdown"
                                                        ? "⌃"
                                                        : "⌄"}
                                                </span>
                                            </button>


                                            {/* CATEGORY DROPDOWN */}

                                            {categoryDropdown === "dropdown" &&
                                                !categoriesLoading && (
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "calc(100% + 5px)",
                                                            left: 0,
                                                            right: 0,
                                                            background: COLORS.white,
                                                            border: `1px solid ${COLORS.border}`,
                                                            borderRadius: "10px",
                                                            boxShadow:
                                                                "0 10px 30px rgba(2,50,34,0.14)",
                                                            zIndex: 100,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                maxHeight: "230px",
                                                                overflowY: "auto",
                                                            }}
                                                        >
                                                            {categories.map((category) => (
                                                                <button
                                                                    key={category.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData((previous) => ({
                                                                            ...previous,
                                                                            categoryId: category.id,
                                                                        }));
                                                                        setCategoryDropdown(false);
                                                                    }}
                                                                    style={{
                                                                        width: "100%",
                                                                        border: "none",
                                                                        background:
                                                                            formData.categoryId ===
                                                                            category.id
                                                                                ? COLORS.greenSoft
                                                                                : COLORS.white,
                                                                        color:
                                                                            formData.categoryId ===
                                                                            category.id
                                                                                ? COLORS.green
                                                                                : COLORS.grayDark,
                                                                        padding: "11px 13px",
                                                                        textAlign: "left",
                                                                        fontSize: "12px",
                                                                        fontWeight:
                                                                            formData.categoryId ===
                                                                            category.id
                                                                                ? "800"
                                                                                : "500",
                                                                        cursor: "pointer",
                                                                    }}
                                                                >
                                                                    {category.name}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        <div
                                                            style={{
                                                                borderTop:
                                                                    `1px solid ${COLORS.border}`,
                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNewCategoryName("");
                                                                setCategoryDropdown("create");
                                                            }}
                                                            style={{
                                                                width: "100%",
                                                                border: "none",
                                                                background: COLORS.greenSoft,
                                                                color: COLORS.greenLight,
                                                                padding: "12px 13px",
                                                                textAlign: "left",
                                                                fontSize: "12px",
                                                                fontWeight: "800",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            + Create New Category
                                                        </button>
                                                    </div>
                                                )}


                                            {/* CREATE CATEGORY INPUT */}

                                            {categoryDropdown === "create" && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "calc(100% + 5px)",
                                                        left: 0,
                                                        right: 0,
                                                        background: COLORS.white,
                                                        border: `1px solid ${COLORS.border}`,
                                                        borderRadius: "10px",
                                                        boxShadow:
                                                            "0 10px 30px rgba(2,50,34,0.14)",
                                                        padding: "13px",
                                                        zIndex: 110,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            fontWeight: "800",
                                                            color: COLORS.green,
                                                            marginBottom: "8px",
                                                        }}
                                                    >
                                                        Create New Category
                                                    </div>

                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={(event) =>
                                                            setNewCategoryName(
                                                                event.target.value
                                                            )
                                                        }
                                                        onKeyDown={
                                                            handleCategoryKeyDown
                                                        }
                                                        placeholder="Example: HTML"
                                                        style={{
                                                            ...inputStyle,
                                                            width: "100%",
                                                            marginBottom: "10px",
                                                        }}
                                                    />

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "flex-end",
                                                            gap: "7px",
                                                        }}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setNewCategoryName("");
                                                                setCategoryDropdown(false);
                                                            }}
                                                            style={{
                                                                border:
                                                                    `1px solid ${COLORS.border}`,
                                                                background: COLORS.white,
                                                                color: COLORS.grayDark,
                                                                borderRadius: "7px",
                                                                padding: "7px 12px",
                                                                fontSize: "10px",
                                                                fontWeight: "700",
                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                creatingCategory ||
                                                                !newCategoryName.trim()
                                                            }
                                                            onClick={
                                                                createNewCategory
                                                            }
                                                            style={{
                                                                border: "none",
                                                                background: COLORS.green,
                                                                color: COLORS.white,
                                                                borderRadius: "7px",
                                                                padding: "7px 13px",
                                                                fontSize: "10px",
                                                                fontWeight: "800",
                                                                cursor:
                                                                    creatingCategory
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                opacity:
                                                                    creatingCategory ||
                                                                    !newCategoryName.trim()
                                                                        ? 0.6
                                                                        : 1,
                                                            }}
                                                        >
                                                            {creatingCategory
                                                                ? "Adding..."
                                                                : "Add"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                        </div>

                                    </div>


                                    {/* DIFFICULTY */}

                                    <div>

                                        <FieldLabel>
                                            Difficulty
                                        </FieldLabel>


                                        <div
                                            style={{
                                                display:
                                                    "grid",

                                                gridTemplateColumns:
                                                    "repeat(3, 1fr)",

                                                gap:
                                                    "7px",
                                            }}
                                        >

                                            {difficultyOptions.map(
                                                (
                                                    option
                                                ) => {

                                                    const active =
                                                        formData.difficulty ===
                                                        option.value;


                                                    return (

                                                        <button
                                                            key={
                                                                option.value
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData(
                                                                    (
                                                                        previous
                                                                    ) => ({
                                                                        ...previous,
                                                                        difficulty:
                                                                            option.value,
                                                                    })
                                                                )
                                                            }
                                                            style={{
                                                                height:
                                                                    "44px",

                                                                border:
                                                                    active
                                                                        ? `1.5px solid ${COLORS.greenLight}`
                                                                        : `1px solid #DCD8CF`,

                                                                borderRadius:
                                                                    "9px",

                                                                background:
                                                                    active
                                                                        ? COLORS.greenSoft
                                                                        : COLORS.white,

                                                                color:
                                                                    active
                                                                        ? COLORS.green
                                                                        : COLORS.grayDark,

                                                                fontSize:
                                                                    "11px",

                                                                fontWeight:
                                                                    active
                                                                        ? "800"
                                                                        : "600",

                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        >
                                                            {
                                                                option.label
                                                            }
                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* QUIZ SETTINGS */}

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
                                        "16px",

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
                                    subtitle="Configure duration, questions and scoring."
                                />


                                <div
                                    style={{
                                        display:
                                            "grid",

                                        gridTemplateColumns:
                                            "repeat(4, 1fr)",

                                        gap:
                                            "13px",
                                    }}
                                >

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
                                                        "50px",
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

                                                    fontSize:
                                                        "10px",

                                                    color:
                                                        COLORS.gray,
                                                }}
                                            >
                                                min
                                            </span>

                                        </div>

                                    </div>


                                    <div>

                                        <FieldLabel>
                                            Number of Questions
                                        </FieldLabel>


                                        <input
                                            type="number"
                                            min="1"
                                            name="questionCount"
                                            value={
                                                formData.questionCount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            style={
                                                inputStyle
                                            }
                                        />

                                    </div>


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
                                        marginTop:
                                            "18px",

                                        paddingTop:
                                            "17px",

                                        borderTop:
                                            `1px solid ${COLORS.border}`,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "space-between",

                                        gap:
                                            "20px",
                                    }}
                                >

                                    <label
                                        style={{
                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap:
                                                "10px",

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
                                                width:
                                                    "17px",

                                                height:
                                                    "17px",

                                                accentColor:
                                                    COLORS.greenLight,

                                                cursor:
                                                    "pointer",
                                            }}
                                        />


                                        <div>

                                            <div
                                                style={{
                                                    fontSize:
                                                        "12px",

                                                    fontWeight:
                                                        "800",

                                                    color:
                                                        COLORS.green,
                                                }}
                                            >
                                                Negative Marking
                                            </div>


                                            <div
                                                style={{
                                                    marginTop:
                                                        "2px",

                                                    fontSize:
                                                        "10px",

                                                    color:
                                                        COLORS.gray,
                                                }}
                                            >
                                                Deduct marks for incorrect answers.
                                            </div>

                                        </div>

                                    </label>


                                    {formData.negativeMarking && (

                                        <div
                                            style={{
                                                width:
                                                    "170px",
                                            }}
                                        >

                                            <FieldLabel>
                                                Deduction per Wrong Answer
                                            </FieldLabel>


                                            <input
                                                type="number"
                                                name="negativeMarks"
                                                min="0"
                                                step="0.5"
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


                            {/* CONFIGURATION SUMMARY */}

                            <div
                                style={{
                                    background:
                                        COLORS.green,

                                    borderRadius:
                                        "15px",

                                    padding:
                                        "18px 21px",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "14px",

                                    color:
                                        COLORS.white,

                                    marginBottom:
                                        "18px",
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                            "42px",

                                        height:
                                            "42px",

                                        borderRadius:
                                            "10px",

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

                                    <ShieldCheck
                                        size={21}
                                    />

                                </div>


                                <div
                                    style={{
                                        flex:
                                            1,
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "12px",

                                            fontWeight:
                                                "800",
                                        }}
                                    >
                                        Quiz Configuration
                                    </div>


                                    <div
                                        style={{
                                            marginTop:
                                                "4px",

                                            color:
                                                "rgba(255,255,255,0.68)",

                                            fontSize:
                                                "10px",
                                        }}
                                    >

                                        {formData.questionCount ||
                                            0}{" "}
                                        questions •{" "}

                                        {formData.totalMarks ||
                                            0}{" "}
                                        marks •{" "}

                                        {formData.duration ||
                                            0}{" "}
                                        minutes •{" "}

                                        {formData.difficulty}

                                    </div>

                                </div>


                                <div
                                    style={{
                                        color:
                                            COLORS.gold,

                                        fontSize:
                                            "10px",

                                        fontWeight:
                                            "800",
                                    }}
                                >
                                    DRAFT
                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div
                                style={{
                                    display:
                                        "flex",

                                    justifyContent:
                                        "space-between",

                                    alignItems:
                                        "center",
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handleBack
                                    }
                                    style={
                                        secondaryButton
                                    }
                                >

                                    <ArrowLeft
                                        size={16}
                                    />

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        createQuizAndContinue
                                    }
                                    disabled={
                                        savingQuiz
                                    }
                                    style={
                                        primaryButton
                                    }
                                >

                                    {savingQuiz ? (

                                        <>
                                            Creating Quiz...
                                        </>

                                    ) : (

                                        <>
                                            Continue to Questions

                                            <ChevronRight
                                                size={17}
                                            />
                                        </>

                                    )}

                                </button>

                            </div>

                        </>

                    )}


                    {/* =================================================
                        STEP 2
                        QUESTIONS
                    ================================================== */}

                    {step === 2 && (

                        <>

                            {/* QUIZ SUMMARY */}

                            <section
                                style={{
                                    background:
                                        COLORS.white,

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    borderRadius:
                                        "15px",

                                    padding:
                                        "17px 20px",

                                    marginBottom:
                                        "15px",

                                    display:
                                        "flex",

                                    alignItems:
                                        "center",

                                    gap:
                                        "15px",

                                    boxShadow:
                                        "0 2px 7px rgba(2,50,34,0.035)",
                                }}
                            >

                                <div
                                    style={{
                                        width:
                                            "43px",

                                        height:
                                            "43px",

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

                                        flexShrink:
                                            0,
                                    }}
                                >

                                    <BookOpen
                                        size={21}
                                    />

                                </div>


                                <div
                                    style={{
                                        flex:
                                            1,

                                        minWidth:
                                            0,
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "15px",

                                            fontWeight:
                                                "800",

                                            color:
                                                COLORS.green,

                                            whiteSpace:
                                                "nowrap",

                                            overflow:
                                                "hidden",

                                            textOverflow:
                                                "ellipsis",
                                        }}
                                    >
                                        {formData.title ||
                                            "New Quiz"}
                                    </div>


                                    <div
                                        style={{
                                            marginTop:
                                                "4px",

                                            color:
                                                COLORS.gray,

                                            fontSize:
                                                "10px",
                                        }}
                                    >

                                        {formData.difficulty}{" "}
                                        •{" "}

                                        {formData.duration}{" "}
                                        minutes{" "}
                                        •{" "}

                                        {formData.totalMarks}{" "}
                                        marks

                                    </div>

                                </div>


                                <div
                                    style={{
                                        textAlign:
                                            "right",
                                    }}
                                >

                                    <div
                                        style={{
                                            color:
                                                COLORS.greenLight,

                                            fontSize:
                                                "17px",

                                            fontWeight:
                                                "800",
                                        }}
                                    >
                                        {completedQuestionCount}
                                    </div>


                                    <div
                                        style={{
                                            color:
                                                COLORS.gray,

                                            fontSize:
                                                "9px",
                                        }}
                                    >
                                        saved

                                    </div>

                                </div>

                            </section>


                            {/* QUESTION NAVIGATION */}

                            <section
                                style={{
                                    background:
                                        COLORS.white,

                                    border:
                                        `1px solid ${COLORS.border}`,

                                    borderRadius:
                                        "15px",

                                    padding:
                                        "15px 18px",

                                    marginBottom:
                                        "15px",
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
                                            "12px",
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "11px",

                                            color:
                                                COLORS.gray,

                                            fontWeight:
                                                "700",
                                        }}
                                    >
                                        QUESTIONS
                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            addQuestion
                                        }
                                        style={{
                                            border:
                                                "none",

                                            background:
                                                COLORS.greenSoft,

                                            color:
                                                COLORS.greenLight,

                                            borderRadius:
                                                "8px",

                                            padding:
                                                "7px 10px",

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",

                                            gap:
                                                "5px",

                                            fontSize:
                                                "10px",

                                            fontWeight:
                                                "800",

                                            cursor:
                                                "pointer",
                                        }}
                                    >

                                        <Plus
                                            size={14}
                                        />

                                        Add Question

                                    </button>

                                </div>


                                <div
                                    style={{
                                        display:
                                            "flex",

                                        gap:
                                            "6px",

                                        flexWrap:
                                            "wrap",
                                    }}
                                >

                                    {questions.map(
                                        (
                                            question,
                                            index
                                        ) => {

                                            const isActive =
                                                index ===
                                                currentQuestionIndex;

                                            const isComplete =
                                                question.questionText.trim() &&
                                                question.optionA.trim() &&
                                                question.optionB.trim() &&
                                                question.optionC.trim() &&
                                                question.optionD.trim() &&
                                                question.correctAnswer;


                                            return (

                                                <button
                                                    key={
                                                        `${question.id || "new"}-${index}`
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuestionJump(
                                                            index
                                                        )
                                                    }
                                                    style={{
                                                        width:
                                                            "34px",

                                                        height:
                                                            "30px",

                                                        border:
                                                            isActive
                                                                ? `1px solid ${COLORS.green}`
                                                                : `1px solid ${COLORS.border}`,

                                                        borderRadius:
                                                            "7px",

                                                        background:
                                                            isActive
                                                                ? COLORS.green
                                                                : isComplete
                                                                    ? COLORS.greenSoft
                                                                    : COLORS.white,

                                                        color:
                                                            isActive
                                                                ? COLORS.white
                                                                : isComplete
                                                                    ? COLORS.greenLight
                                                                    : COLORS.gray,

                                                        fontSize:
                                                            "10px",

                                                        fontWeight:
                                                            "800",

                                                        cursor:
                                                            "pointer",

                                                        position:
                                                            "relative",
                                                    }}
                                                >

                                                    {index + 1}

                                                    {isComplete &&
                                                        !isActive && (

                                                            <span
                                                                style={{
                                                                    position:
                                                                        "absolute",

                                                                    width:
                                                                        "6px",

                                                                    height:
                                                                        "6px",

                                                                    borderRadius:
                                                                        "50%",

                                                                    background:
                                                                        COLORS.greenLight,

                                                                    right:
                                                                        "3px",

                                                                    top:
                                                                        "3px",
                                                                }}
                                                            />

                                                        )}

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </section>


                            {/* QUESTION FORM */}

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
                                        "15px",

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
                                            "center",

                                        marginBottom:
                                            "20px",
                                    }}
                                >

                                    <div
                                        style={{
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
                                                width:
                                                    "40px",

                                                height:
                                                    "40px",

                                                borderRadius:
                                                    "10px",

                                                background:
                                                    COLORS.goldSoft,

                                                color:
                                                    "#A67800",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                justifyContent:
                                                    "center",
                                            }}
                                        >

                                            <HelpCircle
                                                size={20}
                                            />

                                        </div>


                                        <div>

                                            <div
                                                style={{
                                                    color:
                                                        COLORS.green,

                                                    fontSize:
                                                        "16px",

                                                    fontWeight:
                                                        "800",
                                                }}
                                            >
                                                Question{" "}
                                                {currentQuestionIndex +
                                                    1}
                                            </div>


                                            <div
                                                style={{
                                                    color:
                                                        COLORS.gray,

                                                    fontSize:
                                                        "10px",

                                                    marginTop:
                                                        "2px",
                                                }}
                                            >
                                                of{" "}
                                                {questions.length}{" "}
                                                questions
                                            </div>

                                        </div>

                                    </div>


                                    {questions.length >
                                        1 && (

                                        <button
                                            type="button"
                                            onClick={
                                                deleteCurrentQuestion
                                            }
                                            style={{
                                                border:
                                                    "none",

                                                background:
                                                    COLORS.redSoft,

                                                color:
                                                    COLORS.red,

                                                borderRadius:
                                                    "8px",

                                                padding:
                                                    "8px 10px",

                                                display:
                                                    "flex",

                                                alignItems:
                                                    "center",

                                                gap:
                                                    "5px",

                                                fontSize:
                                                    "10px",

                                                fontWeight:
                                                    "700",

                                                cursor:
                                                    "pointer",
                                            }}
                                        >

                                            <Trash2
                                                size={14}
                                            />

                                            Delete

                                        </button>

                                    )}

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
                                            currentQuestion.questionText
                                        }
                                        onChange={
                                            handleQuestionChange
                                        }
                                        rows={4}
                                        placeholder="Enter your question here..."
                                        style={{
                                            ...inputStyle,

                                            height:
                                                "105px",

                                            padding:
                                                "12px",

                                            resize:
                                                "vertical",

                                            lineHeight:
                                                "1.5",
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
                                            "14px",

                                        marginBottom:
                                            "18px",
                                    }}
                                >

                                    <OptionField
                                        letter="A"
                                        name="optionA"
                                        value={
                                            currentQuestion.optionA
                                        }
                                        onChange={
                                            handleQuestionChange
                                        }
                                        selected={
                                            currentQuestion.correctAnswer ===
                                            "A"
                                        }
                                        onSelect={() =>
                                            setQuestions(
                                                (
                                                    previous
                                                ) => {

                                                    const updated =
                                                        [...previous];

                                                    updated[
                                                        currentQuestionIndex
                                                    ] = {

                                                        ...updated[
                                                            currentQuestionIndex
                                                        ],

                                                        correctAnswer:
                                                            "A",

                                                    };

                                                    return updated;

                                                }
                                            )
                                        }
                                    />


                                    <OptionField
                                        letter="B"
                                        name="optionB"
                                        value={
                                            currentQuestion.optionB
                                        }
                                        onChange={
                                            handleQuestionChange
                                        }
                                        selected={
                                            currentQuestion.correctAnswer ===
                                            "B"
                                        }
                                        onSelect={() =>
                                            setQuestions(
                                                (
                                                    previous
                                                ) => {

                                                    const updated =
                                                        [...previous];

                                                    updated[
                                                        currentQuestionIndex
                                                    ] = {

                                                        ...updated[
                                                            currentQuestionIndex
                                                        ],

                                                        correctAnswer:
                                                            "B",

                                                    };

                                                    return updated;

                                                }
                                            )
                                        }
                                    />


                                    <OptionField
                                        letter="C"
                                        name="optionC"
                                        value={
                                            currentQuestion.optionC
                                        }
                                        onChange={
                                            handleQuestionChange
                                        }
                                        selected={
                                            currentQuestion.correctAnswer ===
                                            "C"
                                        }
                                        onSelect={() =>
                                            setQuestions(
                                                (
                                                    previous
                                                ) => {

                                                    const updated =
                                                        [...previous];

                                                    updated[
                                                        currentQuestionIndex
                                                    ] = {

                                                        ...updated[
                                                            currentQuestionIndex
                                                        ],

                                                        correctAnswer:
                                                            "C",

                                                    };

                                                    return updated;

                                                }
                                            )
                                        }
                                    />


                                    <OptionField
                                        letter="D"
                                        name="optionD"
                                        value={
                                            currentQuestion.optionD
                                        }
                                        onChange={
                                            handleQuestionChange
                                        }
                                        selected={
                                            currentQuestion.correctAnswer ===
                                            "D"
                                        }
                                        onSelect={() =>
                                            setQuestions(
                                                (
                                                    previous
                                                ) => {

                                                    const updated =
                                                        [...previous];

                                                    updated[
                                                        currentQuestionIndex
                                                    ] = {

                                                        ...updated[
                                                            currentQuestionIndex
                                                        ],

                                                        correctAnswer:
                                                            "D",

                                                    };

                                                    return updated;

                                                }
                                            )
                                        }
                                    />

                                </div>


                                {/* MARKS */}

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "flex-end",

                                        justifyContent:
                                            "space-between",

                                        gap:
                                            "20px",

                                        paddingTop:
                                            "17px",

                                        borderTop:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >

                                    <div
                                        style={{
                                            width:
                                                "180px",
                                        }}
                                    >

                                        <FieldLabel>
                                            Question Marks
                                        </FieldLabel>


                                        <input
                                            type="number"
                                            name="marks"
                                            min="1"
                                            value={
                                                currentQuestion.marks
                                            }
                                            onChange={
                                                handleQuestionChange
                                            }
                                            style={
                                                inputStyle
                                            }
                                        />

                                    </div>


                                    <div
                                        style={{
                                            color:
                                                COLORS.gray,

                                            fontSize:
                                                "10px",

                                            textAlign:
                                                "right",
                                        }}
                                    >

                                        <span
                                            style={{
                                                color:
                                                    COLORS.greenLight,

                                                fontWeight:
                                                    "800",
                                            }}
                                        >
                                            Correct answer:
                                        </span>{" "}

                                        {currentQuestion.correctAnswer
                                            ? `Option ${currentQuestion.correctAnswer}`
                                            : "Not selected"}

                                    </div>

                                </div>

                            </section>


                            {/* QUESTION NAVIGATION */}

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

                                    marginBottom:
                                        "18px",
                                }}
                            >

                                <button
                                    type="button"
                                    disabled={
                                        currentQuestionIndex ===
                                        0 ||
                                        savingQuestion
                                    }
                                    onClick={
                                        handlePreviousQuestion
                                    }
                                    style={{
                                        ...secondaryButton,

                                        opacity:
                                            currentQuestionIndex ===
                                            0
                                                ? 0.45
                                                : 1,

                                        cursor:
                                            currentQuestionIndex ===
                                            0
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                >

                                    <ChevronLeft
                                        size={17}
                                    />

                                    Previous

                                </button>


                                {currentQuestionIndex <
                                    questions.length -
                                        1 ? (

                                    <button
                                        type="button"
                                        disabled={
                                            savingQuestion
                                        }
                                        onClick={
                                            handleNextQuestion
                                        }
                                        style={
                                            primaryButton
                                        }
                                    >

                                        {savingQuestion
                                            ? "Saving..."
                                            : "Save & Next"}

                                        <ChevronRight
                                            size={17}
                                        />

                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        disabled={
                                            savingQuestion
                                        }
                                        onClick={
                                            saveCurrentQuestion
                                        }
                                        style={
                                            primaryButton
                                        }
                                    >

                                        {savingQuestion
                                            ? "Saving..."
                                            : "Save Question"}

                                        <Check
                                            size={17}
                                        />

                                    </button>

                                )}

                            </div>


                            {/* FINAL ACTIONS */}

                            <section
                                style={{
                                    background:
                                        COLORS.green,

                                    borderRadius:
                                        "15px",

                                    padding:
                                        "18px 20px",

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
                                            "42px",

                                        height:
                                            "42px",

                                        flexShrink:
                                            0,

                                        borderRadius:
                                            "10px",

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

                                    <ShieldCheck
                                        size={21}
                                    />

                                </div>


                                <div
                                    style={{
                                        flex:
                                            1,
                                    }}
                                >

                                    <div
                                        style={{
                                            fontSize:
                                                "12px",

                                            fontWeight:
                                                "800",
                                        }}
                                    >
                                        Ready to finish?
                                    </div>


                                    <div
                                        style={{
                                            marginTop:
                                                "3px",

                                            fontSize:
                                                "10px",

                                            color:
                                                "rgba(255,255,255,0.65)",
                                        }}
                                    >

                                        {completedQuestionCount} of{" "}
                                        {questions.length}{" "}
                                        questions completed.

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        saveDraft
                                    }
                                    disabled={
                                        savingQuiz ||
                                        publishing
                                    }
                                    style={{
                                        height:
                                            "40px",

                                        padding:
                                            "0 14px",

                                        border:
                                            "1px solid rgba(255,255,255,0.25)",

                                        borderRadius:
                                            "9px",

                                        background:
                                            "rgba(255,255,255,0.08)",

                                        color:
                                            COLORS.white,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap:
                                            "7px",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "700",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <Save
                                        size={15}
                                    />

                                    {savingQuiz
                                        ? "Saving..."
                                        : "Save Draft"}

                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        publishQuiz
                                    }
                                    disabled={
                                        savingQuiz ||
                                        publishing
                                    }
                                    style={{
                                        height:
                                            "40px",

                                        padding:
                                            "0 15px",

                                        border:
                                            "none",

                                        borderRadius:
                                            "9px",

                                        background:
                                            COLORS.gold,

                                        color:
                                            COLORS.green,

                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        gap:
                                            "7px",

                                        fontSize:
                                            "11px",

                                        fontWeight:
                                            "800",

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    <CheckCircle2
                                        size={15}
                                    />

                                    {publishing
                                        ? "Publishing..."
                                        : "Publish Quiz"}

                                </button>

                            </section>

                        </>

                    )}


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        style={{
                            marginTop:
                                "25px",

                            paddingTop:
                                "15px",

                            borderTop:
                                "1px solid rgba(2,50,34,0.10)",

                            display:
                                "flex",

                            justifyContent:
                                "space-between",

                            color:
                                COLORS.gray,

                            fontSize:
                                "9px",
                        }}
                    >

                        <span>
                            © 2026 Quivora. Learn. Practice. Excel.
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

                    .quiz-basic-grid {
                        grid-template-columns:
                            1fr !important;
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

                    header > div:last-child {
                        margin-left:
                            auto !important;
                    }

                    main > div {
                        width:
                            calc(100% - 24px) !important;

                        padding-top:
                            18px !important;
                    }

                    main section {
                        padding:
                            17px !important;
                    }

                    main section > div {
                        grid-template-columns:
                            1fr !important;
                    }

                    .question-options {
                        grid-template-columns:
                            1fr !important;
                    }

                    footer {
                        flex-direction:
                            column !important;

                        gap:
                            6px;
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
                border:
                    "none",

                borderRadius:
                    "9px",

                background:
                    active
                        ? COLORS.gold
                        : "transparent",

                color:
                    active
                        ? COLORS.green
                        : "#5F6B67",

                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    "6px",

                padding:
                    "9px 12px",

                fontSize:
                    "11px",

                fontWeight:
                    active
                        ? "800"
                        : "600",

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
                    "18px",
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

                    flexShrink:
                        0,
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
                            "15px",

                        fontWeight:
                            "800",
                    }}
                >
                    {title}
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
                    "6px",

                color:
                    COLORS.green,

                fontSize:
                    "10px",

                fontWeight:
                    "800",
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
    selected,
    onSelect,
}) => {

    return (

        <div
            style={{
                border:
                    selected
                        ? `1.5px solid ${COLORS.greenLight}`
                        : `1px solid ${COLORS.border}`,

                borderRadius:
                    "11px",

                padding:
                    "10px",

                background:
                    selected
                        ? COLORS.greenSoft
                        : COLORS.white,
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
                        "7px",
                }}
            >

                <button
                    type="button"
                    onClick={
                        onSelect
                    }
                    style={{
                        width:
                            "25px",

                        height:
                            "25px",

                        borderRadius:
                            "7px",

                        border:
                            selected
                                ? `1px solid ${COLORS.greenLight}`
                                : `1px solid ${COLORS.border}`,

                        background:
                            selected
                                ? COLORS.greenLight
                                : COLORS.white,

                        color:
                            selected
                                ? COLORS.white
                                : COLORS.gray,

                        fontSize:
                            "10px",

                        fontWeight:
                            "800",

                        cursor:
                            "pointer",

                        display:
                            "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",
                    }}
                >
                    {letter}
                </button>


                <span
                    style={{
                        fontSize:
                            "10px",

                        color:
                            selected
                                ? COLORS.greenLight
                                : COLORS.gray,

                        fontWeight:
                            "700",
                    }}
                >
                    {selected
                        ? "Correct Answer"
                        : `Option ${letter}`}
                </span>

            </div>


            <input
                type="text"
                name={name}
                value={value}
                onChange={
                    onChange
                }
                placeholder={`Enter option ${letter}`}
                style={{
                    ...inputStyle,

                    height:
                        "40px",

                    fontSize:
                        "11px",
                }}
            />

        </div>

    );

};


// ============================================================
// STEP CIRCLE
// ============================================================

const StepCircle = ({
    number,
    label,
    active,
    completed,
}) => {

    return (

        <div
            style={{
                display:
                    "flex",

                alignItems:
                    "center",

                gap:
                    "6px",
            }}
        >

            <div
                style={{
                    width:
                        "27px",

                    height:
                        "27px",

                    borderRadius:
                        "50%",

                    background:
                        active
                            ? COLORS.green
                            : completed
                                ? COLORS.greenSoft
                                : COLORS.white,

                    border:
                        completed || active
                            ? `1px solid ${COLORS.greenLight}`
                            : `1px solid ${COLORS.border}`,

                    color:
                        active
                            ? COLORS.white
                            : COLORS.greenLight,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    fontSize:
                        "9px",

                    fontWeight:
                        "800",
                }}
            >

                {completed ? (
                    <Check size={13} />
                ) : (
                    number
                )}

            </div>


            <span
                style={{
                    color:
                        active
                            ? COLORS.green
                            : COLORS.gray,

                    fontSize:
                        "9px",

                    fontWeight:
                        active
                            ? "800"
                            : "600",
                }}
            >
                {label}
            </span>

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
        "0 11px",

    border:
        "1px solid #DCD8CF",

    borderRadius:
        "9px",

    background:
        COLORS.white,

    color:
        COLORS.green,

    outline:
        "none",

    fontSize:
        "12px",

};


// ============================================================
// BUTTONS
// ============================================================

const primaryButton = {

    height:
        "43px",

    padding:
        "0 17px",

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

    justifyContent:
        "center",

    gap:
        "7px",

    fontSize:
        "11px",

    fontWeight:
        "800",

    cursor:
        "pointer",

    boxShadow:
        "0 4px 10px rgba(2,50,34,0.12)",

};


const secondaryButton = {

    height:
        "43px",

    padding:
        "0 15px",

    border:
        `1px solid ${COLORS.border}`,

    borderRadius:
        "10px",

    background:
        COLORS.white,

    color:
        COLORS.grayDark,

    display:
        "flex",

    alignItems:
        "center",

    justifyContent:
        "center",

    gap:
        "7px",

    fontSize:
        "11px",

    fontWeight:
        "700",

    cursor:
        "pointer",

};


export default CreateQuiz;