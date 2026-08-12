import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";


const AuthContext =
    createContext(null);


export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);

    const [token, setToken] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // =========================================================
    // RESTORE AUTHENTICATION
    // =========================================================

    useEffect(() => {

        const storedToken =
            localStorage.getItem(
                "quivora_token"
            );

        const storedUser =
            localStorage.getItem(
                "quivora_user"
            );


        if (
            storedToken &&
            storedUser
        ) {

            try {

                const parsedUser =
                    JSON.parse(
                        storedUser
                    );


                setToken(
                    storedToken
                );

                setUser(
                    parsedUser
                );

            } catch (error) {

                console.error(
                    "Failed to parse stored user:",
                    error
                );


                localStorage.removeItem(
                    "quivora_user"
                );

                localStorage.removeItem(
                    "quivora_token"
                );

            }

        }


        setLoading(false);

    }, []);


    // =========================================================
    // LOGIN
    // =========================================================

    const login = (loginData) => {

        const newToken =
            loginData.data.token;

        const newUser =
            loginData.data.user;


        localStorage.setItem(
            "quivora_token",
            newToken
        );


        localStorage.setItem(
            "quivora_user",
            JSON.stringify(
                newUser
            )
        );


        setToken(
            newToken
        );

        setUser(
            newUser
        );

    };


    // =========================================================
    // UPDATE USER
    //
    // IMPORTANT:
    // Merge instead of replacing the complete user object.
    // This keeps profileImage and all existing user details.
    // =========================================================

    const updateUser = (
        updatedUser
    ) => {

        setUser((currentUser) => {

            const mergedUser = {

                ...(currentUser || {}),

                ...(updatedUser || {}),

            };


            localStorage.setItem(
                "quivora_user",
                JSON.stringify(
                    mergedUser
                )
            );


            return mergedUser;

        });

    };


    // =========================================================
    // UPDATE PROFILE IMAGE ONLY
    //
    // This is useful when only the profile picture changes.
    // =========================================================

    const updateProfileImage = (
        profileImage
    ) => {

        setUser((currentUser) => {

            const updatedUser = {

                ...(currentUser || {}),

                profileImage,

            };


            localStorage.setItem(
                "quivora_user",
                JSON.stringify(
                    updatedUser
                )
            );


            return updatedUser;

        });

    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {

        localStorage.removeItem(
            "quivora_token"
        );

        localStorage.removeItem(
            "quivora_user"
        );


        setToken(null);

        setUser(null);

    };


    // =========================================================
    // PROVIDER
    // =========================================================

    return (

        <AuthContext.Provider
            value={{

                user,

                token,

                loading,

                isAuthenticated:
                    !!token,

                login,

                updateUser,

                updateProfileImage,

                logout,

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};


// =============================================================
// USE AUTH
// =============================================================

export const useAuth = () => {

    const context =
        useContext(
            AuthContext
        );


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }


    return context;

};