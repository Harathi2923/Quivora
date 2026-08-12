import { useLocation, useNavigate } from "react-router-dom";

import {
    Clock3,
    Award,
    ClipboardCheck,
    AlertTriangle,
    CheckCircle2,
    ArrowLeft,
    Play,
    Camera,
    Mic,
    Maximize,
    ShieldCheck,
    MonitorX,
} from "lucide-react";

import { toast } from "react-toastify";

import quizAttemptService from "../../services/quizAttemptService";

import logo from "../../assets/logo/quivora-logo.png";


const QuizInstructions = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const quiz = location.state?.quiz;


    // =========================================================
    // QUIZ NOT FOUND
    // =========================================================

    if (!quiz) {

        return (
            <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center px-5">

                <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-lg p-8 max-w-md w-full text-center">

                    <AlertTriangle
                        size={45}
                        className="mx-auto text-[#D4A017] mb-4"
                    />

                    <h1 className="text-2xl font-extrabold text-[#023222] mb-2">
                        Quiz information not found
                    </h1>

                    <p className="text-gray-500 mb-6">
                        Please return to the dashboard and select
                        the quiz again.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/student/dashboard")
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
    // START EXAMINATION
    // =========================================================

    const handleStartExam = async () => {

    let fullscreenStarted = false;
    let mediaStream = null;

    try {

        // =====================================================
        // 1. ENTER FULLSCREEN FIRST
        // =====================================================

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

            fullscreenStarted = true;

        }


        // =====================================================
        // 2. REQUEST CAMERA + MICROPHONE
        // =====================================================

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            throw new Error(
                "Camera and microphone access are not supported by this browser."
            );

        }


        mediaStream =
            await navigator.mediaDevices.getUserMedia({
                video: {
                    width: {
                        ideal: 1280,
                    },
                    height: {
                        ideal: 720,
                    },
                    facingMode: "user",
                },
                audio: true,
            });


        // =====================================================
        // 3. SAVE STREAM FOR EXAM SCREEN
        // =====================================================

        window.quivoraExamStream = mediaStream;


        // =====================================================
        // 4. START QUIZ ATTEMPT
        // =====================================================

        const response =
            await quizAttemptService.startQuiz(
                quiz.id
            );


        const attemptId =
            response.data.attemptId;


        toast.success(
            "Exam environment ready."
        );


        // =====================================================
        // 5. GO TO EXAM SCREEN
        // =====================================================

        navigate(
            `/student/quiz/${quiz.id}/attempt/${attemptId}`,
            {
                state: {
                    quiz,
                    attempt: response.data,
                },
            }
        );


    } catch (error) {

        console.error(
            "Unable to start examination:",
            error
        );


        // =====================================================
        // CLEAN UP CAMERA IF SOMETHING FAILED
        // =====================================================

        if (mediaStream) {

            mediaStream
                .getTracks()
                .forEach((track) => {
                    track.stop();
                });

        }


        window.quivoraExamStream = null;


        // =====================================================
        // EXIT FULLSCREEN IF STARTUP FAILED
        // =====================================================

        if (
            fullscreenStarted &&
            document.fullscreenElement
        ) {

            try {

                await document.exitFullscreen();

            } catch (fullscreenError) {

                console.error(
                    "Unable to exit fullscreen:",
                    fullscreenError
                );

            }

        }


        // =====================================================
        // CAMERA / MICROPHONE PERMISSION ERROR
        // =====================================================

        if (
            error.name === "NotAllowedError" ||
            error.name === "PermissionDeniedError"
        ) {

            toast.error(
                "Please allow camera and microphone access to start the examination."
            );

            return;

        }


        // =====================================================
        // CAMERA / MICROPHONE NOT FOUND
        // =====================================================

        if (
            error.name === "NotFoundError"
        ) {

            toast.error(
                "Camera or microphone was not found. Please connect the required devices."
            );

            return;

        }


        // =====================================================
        // DEVICE BUSY
        // =====================================================

        if (
            error.name === "NotReadableError"
        ) {

            toast.error(
                "Camera or microphone is already being used by another application."
            );

            return;

        }


        // =====================================================
        // SECURITY ERROR
        // =====================================================

        if (
            error.name === "SecurityError"
        ) {

            toast.error(
                "Camera and microphone access is blocked by the browser."
            );

            return;

        }


        // =====================================================
        // GENERIC ERROR
        // =====================================================

        toast.error(
            error.message ||
            "Unable to start examination."
        );

    }

};


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
                            navigate("/student/dashboard")
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
                    TITLE
                ================================================== */}

                <div className="text-center mb-8">

                    <p className="text-sm font-semibold text-[#0B5D45] uppercase tracking-wider mb-2">
                        Before You Begin
                    </p>


                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                        {quiz.title}
                    </h1>


                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Please read the following information carefully
                        before starting your examination.
                    </p>

                </div>



                {/* =================================================
                    QUIZ SUMMARY
                ================================================== */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


                    {/* Duration */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center mb-4">

                            <Clock3 size={21} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Duration
                        </p>

                        <p className="text-xl font-extrabold mt-1">
                            {quiz.duration} minutes
                        </p>

                    </div>



                    {/* Total Marks */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center mb-4">

                            <Award size={21} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Total Marks
                        </p>

                        <p className="text-xl font-extrabold mt-1">
                            {quiz.totalMarks}
                        </p>

                    </div>



                    {/* Passing Marks */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-11 h-11 rounded-xl bg-[#E8E4F2] text-[#5D4A8A] flex items-center justify-center mb-4">

                            <ClipboardCheck size={21} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Passing Marks
                        </p>

                        <p className="text-xl font-extrabold mt-1">
                            {quiz.passingMarks}
                        </p>

                    </div>



                    {/* Negative Marking */}

                    <div className="bg-white rounded-2xl border border-[#023222]/10 p-5">

                        <div className="w-11 h-11 rounded-xl bg-[#FCE8E6] text-red-600 flex items-center justify-center mb-4">

                            <AlertTriangle size={21} />

                        </div>

                        <p className="text-sm text-gray-500">
                            Negative Marking
                        </p>

                        <p className="text-xl font-extrabold mt-1">

                            {quiz.negativeMarking
                                ? `Yes (-${quiz.negativeMarks})`
                                : "No"}

                        </p>

                    </div>

                </div>



                {/* =================================================
                    ABOUT QUIZ
                ================================================== */}

                {quiz.description && (

                    <div className="bg-white rounded-3xl border border-[#023222]/10 p-6 md:p-8 mb-6">

                        <h2 className="text-xl font-extrabold mb-3">
                            About this Quiz
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            {quiz.description}
                        </p>

                    </div>

                )}



                {/* =================================================
                    GENERAL INSTRUCTIONS
                ================================================== */}

                <div className="bg-white rounded-3xl border border-[#023222]/10 p-6 md:p-8 mb-6">

                    <h2 className="text-xl font-extrabold mb-6">
                        Examination Instructions
                    </h2>

                    <div className="space-y-4">

                        <div className="flex items-start gap-3">

                            <CheckCircle2
                                size={20}
                                className="text-[#0B5D45] mt-0.5 shrink-0"
                            />

                            <p className="text-gray-600">
                                Each question contains four options.
                                Select the option you believe is correct.
                            </p>

                        </div>


                        <div className="flex items-start gap-3">

                            <CheckCircle2
                                size={20}
                                className="text-[#0B5D45] mt-0.5 shrink-0"
                            />

                            <p className="text-gray-600">
                                You can move between questions using
                                the Previous and Next buttons.
                            </p>

                        </div>


                        <div className="flex items-start gap-3">

                            <CheckCircle2
                                size={20}
                                className="text-[#0B5D45] mt-0.5 shrink-0"
                            />

                            <p className="text-gray-600">
                                The examination timer starts when you
                                click the Start Examination button.
                            </p>

                        </div>


                        <div className="flex items-start gap-3">

                            <CheckCircle2
                                size={20}
                                className="text-[#0B5D45] mt-0.5 shrink-0"
                            />

                            <p className="text-gray-600">
                                Make sure you submit the quiz before
                                the allocated time expires.
                            </p>

                        </div>
                         <div className="flex items-start gap-3">

                            <CheckCircle2
                                size={20}
                                className="text-[#0B5D45] mt-0.5 shrink-0"
                            />

                            <p className="text-gray-600">
                                Only one attempt to write this quiz.
                            </p>

                        </div>


                        {quiz.negativeMarking && (

                            <div className="flex items-start gap-3">

                                <AlertTriangle
                                    size={20}
                                    className="text-red-500 mt-0.5 shrink-0"
                                />

                                <p className="text-gray-600">
                                    Wrong answers will receive a negative
                                    mark of{" "}
                                    <strong>
                                        {quiz.negativeMarks}
                                    </strong>.
                                </p>

                            </div>

                        )}

                    </div>

                </div>



                {/* =================================================
                    PROCTORING
                ================================================== */}

                <div className="bg-[#023222] text-white rounded-3xl p-6 md:p-8 mb-8">

                    <div className="flex items-start gap-4 mb-7">

                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#D4A017] text-[#023222] flex items-center justify-center">

                            <ShieldCheck size={24} />

                        </div>

                        <div>

                            <h2 className="text-xl md:text-2xl font-extrabold mb-1">
                                AI Proctoring & Exam Environment
                            </h2>

                            <p className="text-white/60 text-sm">
                                Please prepare your device before
                                starting the examination.
                            </p>

                        </div>

                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                        {/* Camera */}

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">

                            <Camera
                                size={21}
                                className="text-[#D4A017] mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="font-semibold mb-1">
                                    Camera Access
                                </p>

                                <p className="text-sm text-white/60 leading-relaxed">
                                    Camera access is required during
                                    the examination. Keep your face
                                    clearly visible.
                                </p>

                            </div>

                        </div>



                        {/* Microphone */}

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">

                            <Mic
                                size={21}
                                className="text-[#D4A017] mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="font-semibold mb-1">
                                    Microphone Access
                                </p>

                                <p className="text-sm text-white/60 leading-relaxed">
                                    Microphone access is required
                                    during the examination.
                                </p>

                            </div>

                        </div>



                        {/* Fullscreen */}

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">

                            <Maximize
                                size={21}
                                className="text-[#D4A017] mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="font-semibold mb-1">
                                    Fullscreen Mode
                                </p>

                                <p className="text-sm text-white/60 leading-relaxed">
                                    The examination will run in
                                    fullscreen mode.
                                </p>

                            </div>

                        </div>



                        {/* Tab switching */}

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">

                            <MonitorX
                                size={21}
                                className="text-[#D4A017] mt-0.5 shrink-0"
                            />

                            <div>

                                <p className="font-semibold mb-1">
                                    Tab Switching Restricted
                                </p>

                                <p className="text-sm text-white/60 leading-relaxed">
                                    Do not switch browser tabs or
                                    windows during the examination.
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* Environment */}

                    <div className="mt-4 p-4 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/20">

                        <p className="font-semibold text-[#D4A017] mb-1">
                            Keep Your Environment Ready
                        </p>

                        <p className="text-sm text-white/70 leading-relaxed">

                            Sit in a quiet, well-lit place with a
                            clean background. Make sure your face
                            is clearly visible and your camera and
                            microphone are working properly.

                        </p>

                    </div>



                    <div className="mt-5 flex items-start gap-3">

                        <AlertTriangle
                            size={18}
                            className="text-[#D4A017] mt-0.5 shrink-0"
                        />

                        <p className="text-xs text-white/50 leading-relaxed">

                            Camera, microphone and fullscreen
                            permissions will be requested when
                            you start the examination.

                        </p>

                    </div>

                </div>



                {/* =================================================
                    START
                ================================================== */}

                <div className="bg-[#023222] rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-5">

                    <div>

                        <h2 className="text-xl font-extrabold mb-1">
                            Ready to begin?
                        </h2>

                        <p className="text-white/60 text-sm">
                            Your camera, microphone, fullscreen mode,
                            timer and exam monitoring will start.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={handleStartExam}
                        className="w-full md:w-auto min-w-[220px] h-12 px-6 rounded-xl bg-[#D4A017] text-[#023222] font-extrabold flex items-center justify-center gap-2 hover:bg-[#E7B52B] transition shadow-lg"
                    >

                        <Play
                            size={19}
                            fill="currentColor"
                        />

                        Start Examination

                    </button>

                </div>

            </main>

        </div>

    );

};


export default QuizInstructions;