import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Clock3,
    Award,
    ClipboardCheck,
    CircleAlert,
    Trophy,
    BookOpen,
} from "lucide-react";

import { toast } from "react-toastify";

import quizAttemptService from "../../services/quizAttemptService";


const ResultDetails = () => {

    const navigate = useNavigate();

    const { attemptId } = useParams();


    const [result, setResult] = useState(null);

    const [loading, setLoading] = useState(true);


    // =========================================================
    // FETCH RESULT
    // =========================================================

    useEffect(() => {

        const fetchResult = async () => {

            try {

                setLoading(true);

                const response =
                    await quizAttemptService.getQuizResult(
                        attemptId
                    );

                setResult(response.data);

            } catch (error) {

                console.error(
                    "Failed to fetch quiz result:",
                    error
                );

                toast.error(
                    error.message ||
                    "Unable to load quiz result."
                );

            } finally {

                setLoading(false);

            }

        };


        if (attemptId) {
            fetchResult();
        }

    }, [attemptId]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-[#D4A017]/30 border-t-[#D4A017] rounded-full animate-spin mx-auto mb-4" />

                    <p className="text-[#023222] font-semibold">
                        Loading your result...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // NO RESULT
    // =========================================================

    if (!result) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-5">

                <div className="bg-white rounded-3xl border border-[#023222]/10 p-10 text-center max-w-md">

                    <CircleAlert
                        size={48}
                        className="text-red-500 mx-auto mb-5"
                    />

                    <h2 className="text-2xl font-extrabold text-[#023222] mb-2">
                        Result Not Found
                    </h2>

                    <p className="text-gray-500 mb-6">
                        We could not find the requested quiz result.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/results")
                        }
                        className="px-6 py-3 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                    >
                        Back to My Results
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // HELPERS
    // =========================================================

    const formatTime = (seconds) => {

        if (!seconds && seconds !== 0) {
            return "00:00";
        }

        const mins = Math.floor(seconds / 60);

        const secs = seconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(
            secs
        ).padStart(2, "0")}`;

    };


    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    const getOptionText = (question, option) => {

        if (!option) {
            return "Not Answered";
        }

        switch (option) {

            case "A":
                return question.optionA;

            case "B":
                return question.optionB;

            case "C":
                return question.optionC;

            case "D":
                return question.optionD;

            default:
                return option;

        }

    };


    const passed =
        result.result === "PASS";


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">


            {/* =====================================================
                TOP HEADER
            ====================================================== */}

            <header className="sticky top-0 z-40 bg-white border-b border-[#023222]/10">

                <div className="max-w-4xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/results")
                        }
                        className="flex items-center gap-2 text-[#023222] font-semibold hover:text-[#0B5D45] transition"
                    >

                        <ArrowLeft size={19} />

                        <span>
                            Back to My Results
                        </span>

                    </button>


                    <div className="text-right">

                        <p className="text-xs text-gray-500">
                            Quivora
                        </p>

                        <p className="font-bold text-[#023222]">
                            Result Details
                        </p>

                    </div>

                </div>

            </header>



            {/* =====================================================
                CONTENT
            ====================================================== */}

            <main className="max-w-4xl mx-auto px-5 md:px-8 py-8 md:py-10">


                {/* =================================================
                    PAGE INTRO
                ================================================== */}

                <section className="mb-5">

                    <p className="text-sm font-semibold uppercase tracking-wider text-[#0B5D45] mb-2">
                        Examination Review
                    </p>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

                        <div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#023222]">
                                {result.quizTitle}
                            </h1>

                            {result.description && (

                                <p className="mt-2 text-gray-500">
                                    {result.description}
                                </p>

                            )}

                        </div>


                        <div
                            className={`
                                inline-flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-full
                                font-bold
                                text-sm
                                self-start
                                md:self-auto

                                ${
                                    passed
                                        ? "bg-[#E5F0EB] text-[#0B5D45]"
                                        : "bg-red-50 text-red-600"
                                }
                            `}
                        >

                            {passed ? (
                                <CheckCircle2 size={17} />
                            ) : (
                                <XCircle size={17} />
                            )}

                            {result.result}

                        </div>

                    </div>

                </section>



                {/* =================================================
                    SCORE HERO
                ================================================== */}

                <section className="rounded-3xl bg-[#023222] text-white p-7 md:p-8 mb-4 relative overflow-hidden">

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                        <div>

                            <p className="text-white/60 text-sm mb-2">
                                Your Score
                            </p>

                            <div className="flex items-end gap-2">

                                <span className="text-5xl md:text-6xl font-extrabold text-[#D4A017]">
                                    {result.score}
                                </span>

                                <span className="text-white/60 text-xl mb-2">
                                    / {result.totalMarks}
                                </span>

                            </div>

                            <p className="mt-3 text-sm text-white/70">

                                Passing Marks:{" "}

                                <span className="text-white font-bold">
                                    {result.passingMarks}
                                </span>

                            </p>

                        </div>


                        <div className="grid grid-cols-2 gap-4">

                            <div className="bg-white/10 rounded-2xl p-4">

                                <Clock3
                                    size={20}
                                    className="text-[#D4A017] mb-3"
                                />

                                <p className="text-xs text-white/50">
                                    Time Taken
                                </p>

                                <p className="font-bold text-lg">
                                    {formatTime(
                                        result.timeTaken
                                    )}
                                </p>

                            </div>


                            <div className="bg-white/10 rounded-2xl p-4">

                                <Award
                                    size={20}
                                    className="text-[#D4A017] mb-3"
                                />

                                <p className="text-xs text-white/50">
                                    Submitted
                                </p>

                                <p className="font-bold text-sm">
                                    {formatDate(
                                        result.submittedAt
                                    )}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-[#D4A017]/10" />

                    <div className="absolute right-20 -bottom-28 w-64 h-64 rounded-full bg-white/5" />

                </section>



                {/* =================================================
                    PERFORMANCE SUMMARY
                ================================================== */}

                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-9">


                    {/* Correct */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mb-4">

                            <CheckCircle2 size={20} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Correct Answers
                        </p>

                        <p className="text-2xl font-extrabold mt-1">
                            {result.correctAnswers}
                        </p>

                    </div>


                    {/* Wrong */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">

                            <XCircle size={20} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Wrong Answers
                        </p>

                        <p className="text-2xl font-extrabold mt-1">
                            {result.wrongAnswers}
                        </p>

                    </div>


                    {/* Unanswered */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mb-4">

                            <ClipboardCheck size={20} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Unanswered
                        </p>

                        <p className="text-2xl font-extrabold mt-1">
                            {result.unansweredQuestions}
                        </p>

                    </div>


                    {/* Total */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#E8E4F2] text-[#5D4A8A] flex items-center justify-center mb-4">

                            <BookOpen size={20} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Total Questions
                        </p>

                        <p className="text-2xl font-extrabold mt-1">
                            {result.totalQuestions}
                        </p>

                    </div>

                </section>



                {/* =================================================
                    QUESTION REVIEW
                ================================================== */}

                <section>

                    <div className="flex items-center gap-3 mb-5">

                        <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                            <ClipboardCheck size={20} />

                        </div>

                        <div>

                            <h2 className="text-2xl font-extrabold">
                                Question Review
                            </h2>

                            <p className="text-sm text-gray-500">
                                Review your answers and the correct answers.
                            </p>

                        </div>

                    </div>



                    <div className="space-y-5">

                        {result.questions.map(
                            (question) => {

                                const isAnswered =
                                    question.answered;

                                const isCorrect =
                                    question.isCorrect;


                                return (

                                    <article
                                        key={question.questionId}
                                        className="bg-white rounded-3xl border border-[#023222]/10 overflow-hidden"
                                    >


                                        {/* Question header */}

                                        <div className="px-6 py-5 border-b border-[#023222]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center font-extrabold">

                                                    {question.questionNumber}

                                                </div>

                                                <span className="font-bold">
                                                    Question{" "}
                                                    {question.questionNumber}
                                                </span>

                                            </div>


                                            <div
                                                className={`
                                                    inline-flex
                                                    items-center
                                                    gap-2
                                                    px-3
                                                    py-1.5
                                                    rounded-full
                                                    text-xs
                                                    font-bold
                                                    self-start
                                                    sm:self-auto

                                                    ${
                                                        !isAnswered
                                                            ? "bg-gray-100 text-gray-600"
                                                            : isCorrect
                                                            ? "bg-[#E5F0EB] text-[#0B5D45]"
                                                            : "bg-red-50 text-red-600"
                                                    }
                                                `}
                                            >

                                                {!isAnswered ? (
                                                    <>
                                                        <CircleAlert size={14} />
                                                        Unanswered
                                                    </>
                                                ) : isCorrect ? (
                                                    <>
                                                        <CheckCircle2 size={14} />
                                                        Correct
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle size={14} />
                                                        Wrong
                                                    </>
                                                )}

                                            </div>

                                        </div>



                                        {/* Question */}

                                        <div className="p-4">

                                            <h3 className="text-lg md:text-xl font-bold leading-relaxed mb-4">
                                                {question.questionText}
                                            </h3>



                                            {/* Options */}

                                            <div className="space-y-3">

                                                {["A", "B", "C", "D"].map(
                                                    (option) => {

                                                        const optionText =
                                                            getOptionText(
                                                                question,
                                                                option
                                                            );


                                                        const isYourAnswer =
                                                            question.yourAnswer ===
                                                            option;


                                                        const isCorrectAnswer =
                                                            question.correctAnswer ===
                                                            option;


                                                        return (

                                                            <div
                                                                key={option}
                                                                className={`
                                                                    rounded-2xl
                                                                    border
                                                                    p-4
                                                                    flex
                                                                    items-start
                                                                    gap-3

                                                                    ${
                                                                        isCorrectAnswer
                                                                            ? "border-[#0B5D45] bg-[#E5F0EB]"
                                                                            : isYourAnswer
                                                                            ? "border-red-300 bg-red-50"
                                                                            : "border-gray-200 bg-white"
                                                                    }
                                                                `}
                                                            >

                                                                <div
                                                                    className={`
                                                                        w-5
                                                                        h-6
                                                                        rounded-lg
                                                                        shrink-0
                                                                        flex
                                                                        items-center
                                                                        justify-center
                                                                        font-bold
                                                                        text-sm

                                                                        ${
                                                                            isCorrectAnswer
                                                                                ? "bg-[#0B5D45] text-white"
                                                                                : isYourAnswer
                                                                                ? "bg-red-500 text-white"
                                                                                : "bg-[#FAF8F2] text-[#023222]"
                                                                        }
                                                                    `}
                                                                >
                                                                    {option}
                                                                </div>


                                                                <div className="flex-1">

                                                                    <p className="text-sm md:text-base text-[#023222]">

                                                                        {optionText}

                                                                    </p>


                                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                                        {isYourAnswer && (

                                                                            <span className="text-xs font-semibold text-red-600">

                                                                                Your Answer

                                                                            </span>

                                                                        )}


                                                                        {isCorrectAnswer && (

                                                                            <span className="text-xs font-semibold text-[#0B5D45]">

                                                                                Correct Answer

                                                                            </span>

                                                                        )}

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        );

                                                    }
                                                )}

                                            </div>



                                            {/* Marks */}

                                            <div className="mt-6 pt-5 border-t border-[#023222]/10 flex items-center justify-between">

                                                <div>

                                                    <p className="text-xs text-gray-500">
                                                        Marks Awarded
                                                    </p>

                                                    <p
                                                        className={`
                                                            text-lg
                                                            font-extrabold
                                                            mt-1

                                                            ${
                                                                question.marksAwarded >
                                                                0
                                                                    ? "text-[#0B5D45]"
                                                                    : "text-red-500"
                                                            }
                                                        `}
                                                    >

                                                        {question.marksAwarded > 0
                                                            ? "+"
                                                            : ""}

                                                        {question.marksAwarded}

                                                        <span className="text-sm text-gray-400 font-normal">
                                                            {" "}
                                                            / {question.marks}
                                                        </span>

                                                    </p>

                                                </div>


                                                {isCorrect && (

                                                    <div className="flex items-center gap-2 text-[#0B5D45] font-semibold text-sm">

                                                        <Trophy size={17} />

                                                        Correct response

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </article>

                                );

                            }
                        )}

                    </div>

                </section>



                {/* =================================================
                    BOTTOM ACTIONS
                ================================================== */}

                <div className="mt-9 flex flex-col sm:flex-row gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/results")
                        }
                        className="flex-1 h-12 rounded-xl border border-[#023222]/20 bg-white text-[#023222] font-bold hover:bg-[#FAF8F2] transition flex items-center justify-center gap-2"
                    >

                        <ArrowLeft size={18} />

                        Back to My Results

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/dashboard")
                        }
                        className="flex-1 h-12 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                    >

                        Back to Dashboard

                    </button>

                </div>

            </main>

        </div>

    );

};


export default ResultDetails;