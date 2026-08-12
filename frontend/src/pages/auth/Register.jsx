import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";

import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [accepted, setAccepted] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setServerError("");

    // ============================================
    // FRONTEND VALIDATION
    // ============================================

    const newErrors = {
      firstName: validateName(firstName),
      lastName: validateName(lastName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(
        password,
        confirmPassword
      ),
    };

    setErrors(newErrors);

    if (
      newErrors.firstName ||
      newErrors.lastName ||
      newErrors.email ||
      newErrors.password ||
      newErrors.confirmPassword
    ) {
      return;
    }

    // ============================================
    // TERMS CHECK
    // ============================================

    if (!accepted) {
      toast.error("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      // ============================================
      // REGISTER API
      // ============================================

      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("Registration response:", data);

      // ============================================
      // BACKEND ERROR
      // ============================================

      if (!response.ok) {
        toast.error(
          data.message ||
            "Registration failed. Please try again."
        );

        return;
      }

      // ============================================
      // SUCCESS TOAST
      // ============================================

      toast.success("Account created successfully!");

      // Go to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>

      <AuthCard
        title="Create Your Account"
        subtitle="Join Quivora and start your learning journey."
      >

        <form onSubmit={handleRegister}>

          {/* ============================================
              FIRST NAME + LAST NAME
          ============================================ */}

          <div className="flex gap-4">

            <div className="flex-1 min-w-0">

              <AuthInput
                label="First Name"
                placeholder="Eg: Hari"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
              />

              {errors.firstName && (
                <p className="text-red-400 text-sm mb-3">
                  {errors.firstName}
                </p>
              )}

            </div>


            <div className="flex-1 min-w-0">

              <AuthInput
                label="Last Name"
                placeholder="Eg: Puli"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
              />

              {errors.lastName && (
                <p className="text-red-400 text-sm mb-3">
                  {errors.lastName}
                </p>
              )}

            </div>

          </div>


          {/* ============================================
              EMAIL
          ============================================ */}

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          {errors.email && (
            <p className="text-red-400 text-sm mb-3">
              {errors.email}
            </p>
          )}


          {/* ============================================
              PASSWORD
          ============================================ */}

          <PasswordInput
            label="Password"
            placeholder="Eg: Harathi@123 (8+ chars, A-Z, a-z, 0-9, @)"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {errors.password && (
            <p className="text-red-400 text-sm mb-3">
              {errors.password}
            </p>
          )}


          {/* ============================================
              CONFIRM PASSWORD
          ============================================ */}

          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mb-3">
              {errors.confirmPassword}
            </p>
          )}


          {/* ============================================
              TERMS
          ============================================ */}

          <div className="flex items-center gap-2 mt-2 mb-4">

            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) =>
                setAccepted(e.target.checked)
              }
            />

            <p className="text-sm text-white">

              I agree to the

              <span className="text-[#D4A017] ml-1 cursor-pointer hover:underline">
                Terms & Conditions
              </span>

            </p>

          </div>


          {/* ============================================
              SERVER ERROR
          ============================================ */}

          {serverError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-400/40">

              <p className="text-red-300 text-sm">
                {serverError}
              </p>

            </div>
          )}


          {/* ============================================
              CREATE ACCOUNT
          ============================================ */}

          <button
            type="submit"
            disabled={!accepted || loading}
            className={`w-full h-12 rounded-xl font-bold text-lg transition-all duration-300 ${
              accepted && !loading
                ? "bg-[#D4A017] text-[#023222] hover:bg-[#E7B52B]"
                : "bg-gray-500 text-white cursor-not-allowed"
            }`}
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>


          {/* ============================================
              LOGIN LINK
          ============================================ */}

          <p className="text-center mt-2 text-sm text-white/70">

            Already have an account?

            <Link
              to="/login"
              className="ml-2 text-[#D4A017] hover:underline"
            >
              Sign In
            </Link>

          </p>

        </form>

      </AuthCard>

    </AuthLayout>
  );
};

export default Register;