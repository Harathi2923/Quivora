import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

import { toast } from "react-toastify";


const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email.trim() || !password.trim()) {

            toast.error("Please enter email and password.");

            return;
        }


        try {

            setLoading(true);


            const response = await authService.login(
                email,
                password
            );


            login(response);


            toast.success("Login successful!");


            const role = response.data.user.role;


            if (role === "ADMIN") {

                navigate("/admin/dashboard");

            } else if (role === "STUDENT") {

                navigate("/student/dashboard");

            } else {

                toast.error("Invalid user role.");

            }


        } catch (error) {

            toast.error(
                error.message || "Login failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <AuthLayout>

            <AuthCard
                title="Sign In to Quivora"
                subtitle="Access your quizzes, assessments, and learning dashboard."
            >

                <form onSubmit={handleLogin}>

                    <AuthInput
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />


                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <div className="flex justify-between items-center mt-2 mb-5">

                        <label className="flex items-center gap-2 text-sm text-white">

                            <input
                                type="checkbox"
                            />

                            Remember Me

                        </label>


                        <Link
                            to="/forgot-password"
                            className="text-[#D4A017] text-sm hover:underline"
                        >
                            Forgot Password?
                        </Link>

                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            h-12
                            rounded-2xl
                            bg-[#D4A017]
                            text-[#023222]
                            font-bold
                            text-lg
                            transition-all
                            duration-300
                            hover:bg-[#E7B52B]
                            hover:shadow-[0_0_25px_rgba(212,160,23,0.5)]
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    >

                        {loading ? "Signing In..." : "Sign In"}

                    </button>


                </form>


                <p className="text-center mt-6 text-white/70">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="ml-2 text-[#D4A017] hover:underline"
                    >
                        Create Account
                    </Link>

                </p>

            </AuthCard>

        </AuthLayout>
    );
};


export default Login;