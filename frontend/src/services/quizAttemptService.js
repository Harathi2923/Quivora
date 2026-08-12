const API_BASE_URL = "http://localhost:5000/api/v1";


// ============================================================
// START QUIZ
// ============================================================

const startQuiz = async (quizId) => {

    const token = localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error("Authentication token not found.");
    }


    const response = await fetch(
        `${API_BASE_URL}/attempts/start`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                quizId,
            }),
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Unable to start quiz."
        );

    }


    return data;
};


// ============================================================
// GET QUIZ QUESTIONS
// ============================================================

const getQuizQuestions = async (attemptId) => {

    const token = localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error("Authentication token not found.");
    }


    const response = await fetch(
        `${API_BASE_URL}/attempts/${attemptId}/questions`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Unable to fetch quiz questions."
        );

    }


    return data;
};


// ============================================================
// SUBMIT QUIZ
// ============================================================

const submitQuiz = async (attemptId, answers) => {

    const token = localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error("Authentication token not found.");
    }


    const response = await fetch(
        `${API_BASE_URL}/attempts/${attemptId}/submit`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify({
                answers,
            }),
        }
    );


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Unable to submit quiz."
        );

    }


    return data;
};


// ============================================================
// GET QUIZ RESULT
// ============================================================


const getQuizResult = async (attemptId) => {

    const token =
        localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error(
            "Authentication token not found."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/attempts/${attemptId}/result`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Unable to fetch quiz result."
        );
    }

    return data;
};


const quizAttemptService = {
    startQuiz,
    getQuizQuestions,
    submitQuiz,
    getQuizResult,
};


export default quizAttemptService;