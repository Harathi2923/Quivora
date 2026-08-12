const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";

// ============================================================
// GET MY LEADERBOARD QUIZZES
// ============================================================

const getMyLeaderboards = async () => {

    const token =
        localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error(
            "Authentication token not found."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/leaderboard/my`,
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
            "Unable to fetch leaderboards."
        );
    }

    return data;
};

// ============================================================
// GET LEADERBOARD FOR ONE QUIZ
// ============================================================

const getLeaderboard = async (
    quizId,
    page = 1,
    limit = 10
) => {

    const token =
        localStorage.getItem("quivora_token");

    if (!token) {
        throw new Error(
            "Authentication token not found."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/leaderboard/${quizId}?page=${page}&limit=${limit}`,
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
            "Unable to fetch leaderboard."
        );
    }

    return data;
};

// ============================================================
// EXPORT
// ============================================================

const leaderboardService = {
    getMyLeaderboards,
    getLeaderboard,
};

export default leaderboardService;