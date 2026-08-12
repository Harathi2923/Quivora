import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
    Trophy,
    CheckCircle2,
    XCircle,
    Clock3,
    Award,
    ClipboardCheck,
    ArrowLeft,
    BarChart3,
    Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import quizAttemptService from "../../services/quizAttemptService";

import logo from "../../assets/logo/quivora-logo.png";


const QuizResult = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { attemptId, quizId } = useParams();


    const [result, setResult] = useState(
        location.state?.result || null
    );

    const [loading, setLoading] = useState(
        !location.state?.result
    );


    // =========================================================
    // FETCH RESULT
    // =========================================================

    useEffect(() => {

        /*
         * If the submit API already gave us the result,
         * we don't need another API call immediately.
         */

        if (location.state?.result) {

            setLoading(false);

            return;

        }


        const fetchResult = async () => {

            try {

                setLoading(true);


                const response =
                    await quizAttemptService.getQuizResult(
                        attemptId
                    );


                setResult(
                    response.data
                );


            } catch (error) {

                console.error(
                    "Unable to fetch quiz result:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to fetch quiz result."
                );


                navigate(
                    "/student/dashboard"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchResult();

    }, [attemptId]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={45}
                        className="mx-auto text-[#D4A017] animate-spin mb-4"
                    />

                    <p className="text-[#023222] font-semibold">
                        Loading your result...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // RESULT NOT FOUND
    // =========================================================

    if (!result) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-5">

                <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-lg p-8 max-w-md w-full text-center">

                    <XCircle
                        size={48}
                        className="mx-auto text-red-500 mb-4"
                    />

                    <h1 className="text-2xl font-extrabold text-[#023222] mb-2">
                        Result not available
                    </h1>

                    <p className="text-gray-500 mb-6">
                        We couldn't load the result for this
                        examination.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                        className="w-full h-12 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    // =========================================================
    // RESULT DATA
    // =========================================================

    const isPassed =
        result.result === "PASS";


    const percentage =
        result.totalMarks > 0
            ? Math.round(
                (result.score /
                    result.totalMarks) *
                100
            )
            : 0;


    const timeTaken =
        Number(result.timeTaken || 0);


    const minutes =
        Math.floor(
            timeTaken / 60
        );


    const seconds =
        timeTaken % 60;


    const formattedTime =
        `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;


    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="bg-[#023222] text-white">

                <div className="max-w-6xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">

                    <img
                        src={logo}
                        alt="Quivora"
                        className="h-14 w-auto object-contain"
                    />


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                        className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition"
                    >

                        <ArrowLeft size={17} />

                        Dashboard

                    </button>

                </div>

            </header>



            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="max-w-5xl mx-auto px-5 md:px-8 py-10">


                {/* =================================================
                    RESULT HEADER
                ================================================== */}

                <div className="text-center mb-8">

                    <div
                        className={`
                            w-20
                            h-20
                            rounded-full
                            mx-auto
                            flex
                            items-center
                            justify-center
                            mb-5

                            ${
                                isPassed
                                    ? "bg-[#E5F0EB] text-[#0B5D45]"
                                    : "bg-[#FCE8E6] text-red-500"
                            }
                        `}
                    >

                        {isPassed ? (
                            <Trophy size={38} />
                        ) : (
                            <XCircle size={38} />
                        )}

                    </div>


                    <p className="text-sm font-semibold text-[#0B5D45] uppercase tracking-wider mb-2">
                        Examination Completed
                    </p>


                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                        {result.quizTitle}
                    </h1>


                    <p
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-full
                            font-extrabold
                            text-sm

                            ${
                                isPassed
                                    ? "bg-[#E5F0EB] text-[#0B5D45]"
                                    : "bg-[#FCE8E6] text-red-600"
                            }
                        `}
                    >

                        {isPassed ? (
                            <CheckCircle2 size={17} />
                        ) : (
                            <XCircle size={17} />
                        )}

                        {result.result}

                    </p>

                </div>



                {/* =================================================
                    SCORE CARD
                ================================================== */}

                <section className="bg-[#023222] rounded-3xl p-7 md:p-10 text-white mb-6">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">


                        {/* Score */}

                        <div className="text-center md:text-left">

                            <p className="text-white/60 text-sm mb-2">
                                Your Score
                            </p>


                            <div className="flex items-baseline gap-2">

                                <span className="text-6xl font-black text-[#D4A017]">
                                    {result.score}
                                </span>

                                <span className="text-xl text-white/50">
                                    / {result.totalMarks}
                                </span>

                            </div>


                            <p className="text-white/60 text-sm mt-2">
                                Passing Marks:{" "}
                                <span className="text-white font-semibold">
                                    {result.passingMarks}
                                </span>
                            </p>

                        </div>



                        {/* Percentage */}

                        <div className="w-40 h-40 rounded-full border-[10px] border-[#D4A017]/30 flex items-center justify-center">

                            <div className="text-center">

                                <p className="text-4xl font-black">
                                    {percentage}%
                                </p>

                                <p className="text-xs text-white/50">
                                    Score
                                </p>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    STATISTICS
                ================================================== */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


                    {/* Total Questions */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mb-4">

                            <ClipboardCheck size={20} />

                        </div>


                        <p className="text-sm text-gray-500">
                            Total Questions
                        </p>


                        <p className="text-2xl font-extrabold mt-1">
                            {result.totalQuestions}
                        </p>

                    </div>



                    {/* Correct */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mb-4">

                            <CheckCircle2 size={20} />

                        </div>


                        <p className="text-sm text-gray-500">
                            Correct Answers
                        </p>


                        <p className="text-2xl font-extrabold mt-1 text-[#0B5D45]">
                            {result.correctAnswers ?? 0}
                        </p>

                    </div>



                    {/* Wrong */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] text-red-500 flex items-center justify-center mb-4">

                            <XCircle size={20} />

                        </div>


                        <p className="text-sm text-gray-500">
                            Wrong Answers
                        </p>


                        <p className="text-2xl font-extrabold mt-1 text-red-500">
                            {result.wrongAnswers ?? 0}
                        </p>

                    </div>



                    {/* Time */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-10 h-10 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mb-4">

                            <Clock3 size={20} />

                        </div>


                        <p className="text-sm text-gray-500">
                            Time Taken
                        </p>


                        <p className="text-2xl font-extrabold mt-1">
                            {formattedTime}
                        </p>

                    </div>

                </div>



                {/* =================================================
                    ANSWER SUMMARY
                ================================================== */}

                <section className="bg-white rounded-3xl border border-[#023222]/10 p-6 md:p-8 mb-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                            <BarChart3 size={20} />

                        </div>


                        <div>

                            <h2 className="font-extrabold text-lg">
                                Performance Summary
                            </h2>

                            <p className="text-sm text-gray-500">
                                Your examination performance
                            </p>

                        </div>

                    </div>


                    <div className="space-y-4">


                        {/* Correct */}

                        <div>

                            <div className="flex justify-between text-sm mb-2">

                                <span className="font-semibold">
                                    Correct Answers
                                </span>

                                <span className="text-gray-500">
                                    {result.correctAnswers ?? 0}
                                </span>

                            </div>


                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-[#0B5D45] rounded-full"
                                    style={{
                                        width:
                                            result.totalQuestions > 0
                                                ? `${(
                                                    (result.correctAnswers ?? 0) /
                                                    result.totalQuestions
                                                ) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>



                        {/* Wrong */}

                        <div>

                            <div className="flex justify-between text-sm mb-2">

                                <span className="font-semibold">
                                    Wrong Answers
                                </span>

                                <span className="text-gray-500">
                                    {result.wrongAnswers ?? 0}
                                </span>

                            </div>


                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{
                                        width:
                                            result.totalQuestions > 0
                                                ? `${(
                                                    (result.wrongAnswers ?? 0) /
                                                    result.totalQuestions
                                                ) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>



                        {/* Unanswered */}

                        <div>

                            <div className="flex justify-between text-sm mb-2">

                                <span className="font-semibold">
                                    Unanswered
                                </span>

                                <span className="text-gray-500">
                                    {result.unansweredQuestions ?? 0}
                                </span>

                            </div>


                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                                <div
                                    className="h-full bg-gray-400 rounded-full"
                                    style={{
                                        width:
                                            result.totalQuestions > 0
                                                ? `${(
                                                    (result.unansweredQuestions ?? 0) /
                                                    result.totalQuestions
                                                ) * 100}%`
                                                : "0%",
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col sm:flex-row gap-4">


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/student/leaderboard`
                            )
                        }
                        className="flex-1 h-12 rounded-xl bg-[#D4A017] text-[#023222] font-extrabold flex items-center justify-center gap-2 hover:bg-[#E7B52B] transition"
                    >

                        <Trophy size={19} />

                        View Leaderboard

                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/student/dashboard"
                            )
                        }
                        className="flex-1 h-12 rounded-xl bg-[#023222] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0B5D45] transition"
                    >

                        <ArrowLeft size={19} />

                        Back to Dashboard

                    </button>

                </div>

            </main>

        </div>

    );

};


export default QuizResult;