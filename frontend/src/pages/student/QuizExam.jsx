import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
    Clock3,
    ChevronLeft,
    ChevronRight,
    Send,
    AlertTriangle,
    ShieldCheck,
    Camera,
    Mic,
} from "lucide-react";

import { toast } from "react-toastify";

import quizAttemptService from "../../services/quizAttemptService";

import logo from "../../assets/logo/quivora-logo.png";


const QuizExam = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { attemptId, quizId } = useParams();

    const quizFromState = location.state?.quiz;

    const attemptFromState = location.state?.attempt;


    const videoRef = useRef(null);

    const streamRef = useRef(null);

    const submittingRef = useRef(false);


    const [questions, setQuestions] = useState([]);

    const [quiz, setQuiz] = useState(
        quizFromState || null
    );

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [answers, setAnswers] = useState({});

    const [timeLeft, setTimeLeft] = useState(
        attemptFromState?.duration
            ? attemptFromState.duration * 60
            : 0
    );

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    // In-page submit confirmation modal
    const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

    const [fullscreenWarning, setFullscreenWarning]=
        useState(false);

    const [tabWarning, setTabWarning] =
        useState(false);

    const [proctoringReady, setProctoringReady] =
        useState(false);

    const [cameraReady, setCameraReady] =
        useState(false);

    const [microphoneReady, setMicrophoneReady] =
        useState(false);

    const [tabSwitchCount, setTabSwitchCount] =
        useState(0);


    // =========================================================
    // CONNECT EXISTING CAMERA STREAM
    // =========================================================

    useEffect(() => {

        const existingStream =
            window.quivoraExamStream;


        if (!existingStream) {

            return;

        }


        streamRef.current =
            existingStream;


        if (videoRef.current) {

            videoRef.current.srcObject =
                existingStream;

        }


        const videoTracks =
            existingStream.getVideoTracks();


        const audioTracks =
            existingStream.getAudioTracks();


        setCameraReady(
            videoTracks.length > 0 &&
            videoTracks[0].readyState === "live"
        );


        setMicrophoneReady(
            audioTracks.length > 0 &&
            audioTracks[0].readyState === "live"
        );


        setProctoringReady(
            videoTracks.length > 0 &&
            audioTracks.length > 0
        );

    }, []);


    // =========================================================
    // FETCH QUESTIONS
    // =========================================================

    useEffect(() => {

        const fetchQuestions = async () => {

            try {

                setLoading(true);


                const response =
                    await quizAttemptService.getQuizQuestions(
                        attemptId
                    );


                const data =
                    response.data;


                setQuestions(
                    data.questions || []
                );


                if (!quizFromState) {

                    setQuiz({
                        id: data.quizId,
                        title: data.title,
                        duration: data.duration,
                    });

                }


                if (
                    !attemptFromState?.duration &&
                    data.duration
                ) {

                    setTimeLeft(
                        data.duration * 60
                    );

                }

            } catch (error) {

                console.error(
                    "Unable to fetch questions:",
                    error
                );


                toast.error(
                    error.message ||
                    "Unable to load quiz questions."
                );


                navigate("/student/dashboard");

            } finally {

                setLoading(false);

            }

        };


        fetchQuestions();

    }, [attemptId]);


    // =========================================================
    // FULLSCREEN / TAB MONITORING
    // =========================================================

    useEffect(() => {

        const handleVisibilityChange = () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                setTabSwitchCount(
                    (previous) =>
                        previous + 1
                );

                setTabWarning(true);

            }

        };


        const handleFullscreenChange = () => {

            if (!document.fullscreenElement) {

                setFullscreenWarning(true);

            } else {

                setFullscreenWarning(false);

            }

        };


        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );


        return () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );


            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );

        };

    }, []);


    // =========================================================
    // TIMER
    // =========================================================

    useEffect(() => {

        if (
            loading ||
            submitting ||
            timeLeft <= 0
        ) {

            return;

        }


        const timer =
            setInterval(() => {

                setTimeLeft(
                    (previousTime) =>
                        previousTime - 1
                );

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [
        loading,
        submitting,
        timeLeft,
    ]);


    // =========================================================
    // AUTO SUBMIT WHEN TIMER REACHES ZERO
    // =========================================================

    useEffect(() => {

        if (
            !loading &&
            timeLeft <= 0 &&
            !submittingRef.current
        ) {

            handleSubmit(true);

        }

    }, [
        timeLeft,
        loading,
    ]);


    // =========================================================
    // FORMAT TIMER
    // =========================================================

    const formattedTime = useMemo(() => {

        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;


        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

    }, [timeLeft]);


    // =========================================================
    // SELECT ANSWER
    // =========================================================

    const handleAnswerSelect = (answer) => {

        const question =
            questions[currentQuestion];


        if (!question) {

            return;

        }


        setAnswers(
            (previousAnswers) => ({

                ...previousAnswers,

                [question.id]: answer,

            })
        );

    };


    // =========================================================
    // NEXT
    // =========================================================

    const handleNext = () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                (previous) =>
                    previous + 1
            );

        }

    };


    // =========================================================
    // PREVIOUS
    // =========================================================

    const handlePrevious = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                (previous) =>
                    previous - 1
            );

        }

    };


    // =========================================================
    // RE-ENTER FULLSCREEN
    // =========================================================

    const handleReturnToFullscreen = async () => {

        try {

            await document.documentElement.requestFullscreen();

            setFullscreenWarning(false);

        } catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );

            toast.error(
                "Please allow fullscreen mode to continue."
            );

        }

    };


    // =========================================================
    // SUBMIT QUIZ
    // =========================================================

    async function handleSubmit(
        automaticSubmit = false,
        confirmedSubmit = false
    ) {

        if (submittingRef.current) {

            return;

        }


        // Show our own in-page confirmation instead of the browser popup.
        // Automatic submission (timer reaches zero) skips confirmation.
        if (!automaticSubmit && !confirmedSubmit) {

            setSubmitConfirmOpen(true);

            return;

        }


        setSubmitConfirmOpen(false);


        try {

            submittingRef.current = true;

            setSubmitting(true);


            const formattedAnswers =
                Object.entries(
                    answers
                ).map(
                    ([
                        questionId,
                        selectedAnswer,
                    ]) => ({

                        questionId,

                        selectedAnswer,

                    })
                );


            const response =
                await quizAttemptService.submitQuiz(
                    attemptId,
                    formattedAnswers
                );




            toast.success(
                automaticSubmit
                    ? "Time is over. Quiz submitted automatically."
                    : "Quiz submitted successfully."
            );


            /*
             * Stop camera and microphone.
             */

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );

            }


            window.quivoraExamStream = null;


            /*
             * Leave fullscreen.
             */

            if (document.fullscreenElement) {

                await document.exitFullscreen();

            }


            navigate(
                `/student/quiz/${quizId}/result/${attemptId}`,
                {
                    state: {
                        result: response.data,
                    },
                }
            );


        } catch (error) {

            console.error(
                "Quiz submission error:",
                error
            );


            toast.error(
                error.message ||
                "Unable to submit quiz."
            );


            submittingRef.current = false;

            setSubmitting(false);

        }

    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin mx-auto mb-5" />

                    <p className="text-[#023222] font-semibold">
                        Preparing your examination...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // NO QUESTIONS
    // =========================================================

    if (questions.length === 0) {

        return (

            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-5">

                <div className="bg-white rounded-3xl border border-[#023222]/10 p-8 text-center max-w-md w-full">

                    <AlertTriangle
                        size={45}
                        className="mx-auto text-[#D4A017] mb-4"
                    />


                    <h1 className="text-2xl font-extrabold text-[#023222] mb-2">
                        No questions available
                    </h1>


                    <p className="text-gray-500 mb-6">
                        There are no questions available
                        for this examination.
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


    const question =
        questions[currentQuestion];


    const selectedAnswer =
        answers[question.id];


    const answeredCount =
        Object.keys(answers).length;


    const isLastQuestion =
        currentQuestion ===
        questions.length - 1;


    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">


            {/* =================================================
                HIDDEN CAMERA ELEMENT

                Camera is active for the proctoring stream.
                It is not displayed to the student.
            ================================================== */}

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="hidden"
            />



            {/* =================================================
                FULLSCREEN WARNING
            ================================================== */}

            {fullscreenWarning && (

                <div className="fixed inset-0 z-[100] bg-[#023222]/95 flex items-center justify-center px-5">

                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">

                        <AlertTriangle
                            size={48}
                            className="mx-auto text-red-500 mb-5"
                        />

                        <h2 className="text-2xl font-extrabold mb-3">
                            Fullscreen Required
                        </h2>

                        <p className="text-gray-500 mb-6">

                            Please return to fullscreen mode
                            to continue your examination.

                        </p>


                        <button
                            type="button"
                            onClick={
                                handleReturnToFullscreen
                            }
                            className="w-full h-12 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition"
                        >

                            Return to Fullscreen

                        </button>

                    </div>

                </div>

            )}



            {/* =================================================
                TAB SWITCH WARNING
            ================================================== */}

            {tabWarning && (

                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-32px)] max-w-lg">

                    <div className="bg-red-600 text-white rounded-2xl shadow-xl p-5">

                        <div className="flex items-start gap-3">

                            <AlertTriangle
                                size={22}
                                className="shrink-0 mt-0.5"
                            />


                            <div className="flex-1">

                                <p className="font-bold mb-1">
                                    Examination Warning
                                </p>


                                <p className="text-sm text-white/90">
                                    Leaving the examination tab or
                                    window has been detected.
                                </p>


                                <p className="text-xs text-white/70 mt-1">
                                    Detected switches:{" "}
                                    {tabSwitchCount}
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setTabWarning(false)
                                }
                                className="text-white/80 hover:text-white"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* =================================================
                SUBMIT CONFIRMATION MODAL
            ================================================== */}

            {submitConfirmOpen && (

                <div className="fixed inset-0 z-[120] bg-[#023222]/70 backdrop-blur-sm flex items-center justify-center px-5">

                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 md:p-8">

                        <div className="w-14 h-14 rounded-2xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mx-auto mb-5">

                            <Send size={25} />

                        </div>

                        <h2 className="text-2xl font-extrabold text-[#023222] text-center mb-2">
                            Submit Quiz?
                        </h2>

                        <p className="text-gray-500 text-center leading-relaxed mb-7">
                            Are you sure you want to submit the quiz?
                            You will not be able to change your answers
                            after submission.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setSubmitConfirmOpen(false)
                                }
                                disabled={submitting}
                                className="flex-1 h-12 rounded-xl border border-[#023222]/20 text-[#023222] font-bold hover:bg-[#F7FAF8] transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleSubmit(false, true)
                                }
                                disabled={submitting}
                                className="flex-1 h-12 rounded-xl bg-[#D4A017] text-[#023222] font-extrabold hover:bg-[#E7B52B] transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                {submitting
                                    ? "Submitting..."
                                    : "Yes, Submit Quiz"}
                            </button>

                        </div>

                    </div>

                </div>

            )}



            {/* =================================================
                HEADER
            ================================================== */}

            <header className="sticky top-0 z-50 bg-[#023222] text-white shadow-lg">

                <div className="max-w-7xl mx-auto px-5 md:px-8 h-20 flex items-center justify-between">


                    {/* Logo + Quiz */}

                    <div className="flex items-center gap-4">

                        <img
                            src={logo}
                            alt="Quivora"
                            className="h-12 w-auto object-contain"
                        />


                        <div className="hidden sm:block border-l border-white/20 pl-4">

                            <p className="text-xs text-white/50">
                                Examination
                            </p>

                            <p className="font-bold">
                                {quiz?.title || "Quiz"}
                            </p>

                        </div>

                    </div>



                    {/* Proctoring + Timer */}

                    <div className="flex items-center gap-3">


                        {/* Proctoring status */}

                        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10">

                            <span className="relative flex h-2.5 w-2.5">

                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />

                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />

                            </span>


                            <span className="text-xs font-semibold">
                                Monitoring Active
                            </span>

                        </div>



                        {/* Camera */}

                        <div className="hidden sm:flex items-center gap-1.5 text-white/60">

                            <Camera size={16} />

                            {cameraReady && (
                                <span className="text-green-400 text-xs">
                                    ON
                                </span>
                            )}

                        </div>



                        {/* Microphone */}

                        <div className="hidden sm:flex items-center gap-1.5 text-white/60">

                            <Mic size={16} />

                            {microphoneReady && (
                                <span className="text-green-400 text-xs">
                                    ON
                                </span>
                            )}

                        </div>



                        {/* Timer */}

                        <div
                            className={`
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2
                                rounded-xl
                                font-bold

                                ${
                                    timeLeft <= 60
                                        ? "bg-red-500 text-white animate-pulse"
                                        : "bg-white/10 text-white"
                                }
                            `}
                        >

                            <Clock3 size={19} />

                            <span className="font-mono">
                                {formattedTime}
                            </span>

                        </div>

                    </div>

                </div>

            </header>



            {/* =================================================
                MAIN
            ================================================== */}

            <main className="max-w-5xl mx-auto px-5 md:px-8 py-8">


                {/* =================================================
                    TOP INFORMATION
                ================================================== */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">


                    <div>

                        <p className="text-sm text-gray-500">
                            Question
                        </p>


                        <h1 className="text-2xl font-extrabold">

                            {currentQuestion + 1}

                            <span className="text-gray-400">
                                {" "}/ {questions.length}
                            </span>

                        </h1>

                    </div>


                    <div className="px-4 py-2 rounded-xl bg-white border border-[#023222]/10 text-sm font-semibold">

                        {answeredCount} of{" "}
                        {questions.length} answered

                    </div>

                </div>



                {/* =================================================
                    QUESTION CARD
                ================================================== */}

                <section className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-8">


                    {/* Question */}

                    <div className="mb-8">

                        <p className="text-sm font-semibold text-[#0B5D45] mb-3">
                            Question {currentQuestion + 1}
                        </p>


                        <h2 className="text-xl md:text-2xl font-bold leading-relaxed">
                            {question.questionText}
                        </h2>

                    </div>



                    {/* =================================================
                        OPTIONS
                    ================================================== */}

                    <div className="space-y-4">


                        {[
                            {
                                key: "A",
                                text: question.optionA,
                            },
                            {
                                key: "B",
                                text: question.optionB,
                            },
                            {
                                key: "C",
                                text: question.optionC,
                            },
                            {
                                key: "D",
                                text: question.optionD,
                            },
                        ].map((option) => {

                            const isSelected =
                                selectedAnswer ===
                                option.key;


                            return (

                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() =>
                                        handleAnswerSelect(
                                            option.key
                                        )
                                    }
                                    className={`
                                        w-full
                                        text-left
                                        flex
                                        items-center
                                        gap-4
                                        p-4
                                        rounded-2xl
                                        border
                                        transition-all

                                        ${
                                            isSelected
                                                ? "border-[#D4A017] bg-[#F5E9D0]"
                                                : "border-gray-200 bg-white hover:border-[#0B5D45] hover:bg-[#F7FAF8]"
                                        }
                                    `}
                                >

                                    <span
                                        className={`
                                            w-10
                                            h-10
                                            shrink-0
                                            rounded-full
                                            flex
                                            items-center
                                            justify-center
                                            font-bold

                                            ${
                                                isSelected
                                                    ? "bg-[#D4A017] text-[#023222]"
                                                    : "bg-[#E5F0EB] text-[#023222]"
                                            }
                                        `}
                                    >
                                        {option.key}
                                    </span>


                                    <span className="text-base font-medium">
                                        {option.text}
                                    </span>

                                </button>

                            );

                        })}

                    </div>



                    {/* =================================================
                        NAVIGATION
                    ================================================== */}

                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between">


                        {/* Previous */}

                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={
                                currentQuestion === 0
                            }
                            className="h-12 px-5 rounded-xl border border-[#023222]/20 font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7FAF8] transition"
                        >

                            <ChevronLeft size={19} />

                            Previous

                        </button>



                        {/* Next / Submit */}

                        {!isLastQuestion ? (

                            <button
                                type="button"
                                onClick={handleNext}
                                className="h-12 px-7 rounded-xl bg-[#023222] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0B5D45] transition"
                            >

                                Next

                                <ChevronRight size={19} />

                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={() =>
                                    handleSubmit(false)
                                }
                                disabled={submitting}
                                className="h-12 px-7 rounded-xl bg-[#D4A017] text-[#023222] font-extrabold flex items-center justify-center gap-2 hover:bg-[#E7B52B] transition disabled:opacity-50"
                            >

                                <Send size={18} />

                                {submitting
                                    ? "Submitting..."
                                    : "Submit Quiz"}

                            </button>

                        )}

                    </div>

                </section>



                {/* =================================================
                    QUESTION NAVIGATION
                ================================================== */}

                <section className="mt-6 bg-white rounded-2xl border border-[#023222]/10 p-5">

                    <div className="flex items-center justify-between mb-4">

                        <p className="text-sm font-semibold">
                            Questions
                        </p>


                        <div className="flex items-center gap-2 text-xs text-gray-500">

                            <span className="w-3 h-3 rounded bg-[#D4A017]" />

                            Answered

                        </div>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        {questions.map(
                            (item, index) => {

                                const answered =
                                    answers[item.id];


                                return (

                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() =>
                                            setCurrentQuestion(
                                                index
                                            )
                                        }
                                        className={`
                                            w-10
                                            h-10
                                            rounded-xl
                                            text-sm
                                            font-bold
                                            transition

                                            ${
                                                index ===
                                                currentQuestion
                                                    ? "bg-[#023222] text-white"
                                                    : answered
                                                    ? "bg-[#D4A017] text-[#023222]"
                                                    : "bg-[#F0F2EF] text-gray-600 hover:bg-[#E5F0EB]"
                                            }
                                        `}
                                    >

                                        {index + 1}

                                    </button>

                                );

                            }
                        )}

                    </div>

                </section>



                {/* =================================================
                    PROCTORING STATUS
                ================================================== */}

                <div className="mt-5 flex items-center justify-center gap-5 text-xs text-gray-500">

                    <div className="flex items-center gap-1.5">

                        <ShieldCheck
                            size={15}
                            className="text-[#0B5D45]"
                        />

                        Exam environment active

                    </div>


                    <div className="hidden sm:block">
                        •
                    </div>


                    <div>
                        Tab switches detected:{" "}
                        {tabSwitchCount}
                    </div>

                </div>

            </main>

        </div>

    );

};


export default QuizExam;