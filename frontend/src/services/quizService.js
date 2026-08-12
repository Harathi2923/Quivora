const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";

// ============================================================
// GET PUBLISHED QUIZZES
// ============================================================

const getPublishedQuizzes = async () => {

    const token =
        localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error(
            "Authentication token not found."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/quizzes`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch quizzes."
        );
    }

    return data;
};

// ============================================================
// EXPORT
// ============================================================

const quizService = {
    getPublishedQuizzes,
};

export default quizService;