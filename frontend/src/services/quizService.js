const API_BASE_URL = "http://localhost:5000/api/v1";


const getPublishedQuizzes = async () => {

    const token = localStorage.getItem("quivora_token");


    if (!token) {
        throw new Error("Authentication token not found.");
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


    const data = await response.json();


    if (!response.ok) {

        throw new Error(
            data.message || "Failed to fetch quizzes."
        );

    }


    return data;
};


const quizService = {
    getPublishedQuizzes,
};


export default quizService;