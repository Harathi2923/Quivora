const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";

// ============================================================
// LOGIN
// ============================================================

const login = async (email, password) => {

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed."
        );
    }

    return data;
};

// ============================================================
// REGISTER
// ============================================================

const register = async (userData) => {

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(userData),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed."
        );
    }

    return data;
};

// ============================================================
// EXPORT
// ============================================================

const authService = {
    login,
    register,
};

export default authService;