import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    User,
    Mail,
    ShieldCheck,
    LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {

    const navigate = useNavigate();

    const {
        user,
        logout,
    } = useAuth();

    const [loggingOut, setLoggingOut] = useState(false);

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {

        setLoggingOut(true);

        logout();

        toast.success("Logged out successfully.");

        setTimeout(() => {
            navigate("/login");
        }, 500);

    };

    // =========================================================
    // BACK TO DASHBOARD
    // =========================================================

    const handleBack = () => {
        navigate("/admin/dashboard");
    };

    // =========================================================
    // PROFILE IMAGE
    // =========================================================

    const getProfileImageUrl = (profileImage) => {

        if (!profileImage) {
            return null;
        }

        if (
            profileImage.startsWith("http://") ||
            profileImage.startsWith("https://")
        ) {
            return profileImage;
        }

        return `http://localhost:5000${profileImage}`;
    };

    const profileImage = getProfileImageUrl(
        user?.profileImage
    );

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="h-10 bg-white border-b border-[#023222]/10 flex items-center px-5 md:px-8">

                <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#0B5D45] transition"
                >
                    <ArrowLeft size={18} />

                    <span className="font-medium">
                        Back to Dashboard
                    </span>
                </button>

            </header>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <main className="max-w-4xl mx-auto px-2 md:px-2 py-2">

                {/* TITLE */}

                <div className="mb-2">

                    <p className="text-[#D4A017] text-sm font-semibold tracking-wide">
                        ADMIN PROFILE
                    </p>

                    <h1 className="text-3xl md:text-3xl font-extrabold mt-1">
                        My Profile
                    </h1>

                    <p className="text-gray-500 mt-2">
                        View your administrator account details.
                    </p>

                </div>


                {/* =================================================
                    PROFILE CARD
                ================================================== */}

                <div className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm overflow-hidden">

                    {/* PROFILE HEADER */}

                    <div className="bg-[#023222] px-4 md:px-4 py-4">

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                            {/* PROFILE IMAGE */}

                            <div className="w-20 h-20 rounded-full bg-[#F5E9D0] text-[#023222] flex items-center justify-center font-bold text-3xl overflow-hidden border-4 border-white/20">

                                {profileImage ? (

                                    <img
                                        src={profileImage}
                                        alt="Admin profile"
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    user?.firstName?.charAt(0)?.toUpperCase() ||
                                    "A"

                                )}

                            </div>


                            {/* NAME */}

                            <div className="text-center sm:text-left">

                                <h2 className="text-xl font-extrabold text-white">

                                    {user?.firstName || ""}{" "}
                                    {user?.lastName || ""}

                                </h2>

                                <p className="text-white/70 mt-1">

                                    {user?.email || "No email available"}

                                </p>


                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-[#D4A017] text-[#023222] text-xs font-bold">

                                    <ShieldCheck size={14} />

                                    Administrator

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ACCOUNT DETAILS
                    ================================================== */}

                    <div className="p-3 md:p-2">

                        <h3 className="text-lg font-extrabold mb-1">
                            Account Details
                        </h3>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* NAME */}

                            <div className="border border-gray-200 rounded-2xl p-3">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                        <User size={19} />

                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="font-semibold mt-1">

                                            {user?.firstName || ""}{" "}
                                            {user?.lastName || ""}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="border border-gray-200 rounded-2xl p-4">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                        <Mail size={19} />

                                    </div>

                                    <div className="min-w-0">

                                        <p className="text-xs text-gray-500">
                                            Email Address
                                        </p>

                                        <p className="font-semibold mt-1 break-all">

                                            {user?.email ||
                                                "No email available"}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="border border-gray-200 rounded-2xl p-2">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-xl bg-[#EEE9F7] text-[#66538F] flex items-center justify-center">

                                        <ShieldCheck size={19} />

                                    </div>

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Account Role
                                        </p>

                                        <p className="font-semibold mt-1">
                                            Administrator
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            LOGOUT
                        ================================================== */}

                        <div className="mt-2 pt-2 border-t border-gray-100">

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center justify-center gap-2 w-full md:w-auto px-4 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-semibold hover:bg-red-100 transition disabled:opacity-60"
                            >

                                <LogOut size={18} />

                                {loggingOut
                                    ? "Logging out..."
                                    : "Logout"}

                            </button>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );
};

export default AdminProfile;