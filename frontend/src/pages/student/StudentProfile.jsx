import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    User,
    Mail,
    Phone,
    CalendarDays,
    Camera,
    Pencil,
    LockKeyhole,
    Eye,
    EyeOff,
    Settings,
    Moon,
    Sun,
    Bell,
    Save,
    X,
    ShieldCheck,
} from "lucide-react";



import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo/quivora-logo.png";


const API_BASE_URL =
    "https://quivora-backend.onrender.com/api/v1";


const StudentProfile = () => {

    const navigate = useNavigate();

    const {
        user,
        updateUser,
    } = useAuth();


    // =========================================================
    // PROFILE DATA
    // =========================================================

    const [profile, setProfile] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        dateOfBirth: user?.dateOfBirth
            ? user.dateOfBirth.split("T")[0]
            : "",
    });


    const [editingProfile, setEditingProfile] =
        useState(false);


    const [savingProfile, setSavingProfile] =
        useState(false);


    // =========================================================
    // PASSWORD
    // =========================================================

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);


    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    const [changingPassword, setChangingPassword] =
        useState(false);


    // =========================================================
    // PROFILE IMAGE
    // =========================================================

    const getProfileImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("blob:")) return imagePath;
        return `https://quivora-backend.onrender.com${imagePath}`;
    };

    const [profileImage, setProfileImage] =
        useState(getProfileImageUrl(user?.profileImage));


    // =========================================================
    // SETTINGS
    // =========================================================

    const [darkMode, setDarkMode] =
        useState(
            localStorage.getItem("quivora_theme") === "dark"
        );


    const [notifications, setNotifications] =
        useState(
            localStorage.getItem(
                "quivora_notifications"
            ) !== "off"
        );


    // =========================================================
    // UPDATE PROFILE WHEN USER CHANGES
    // =========================================================

    useEffect(() => {

        setProfile({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dateOfBirth: user?.dateOfBirth
                ? user.dateOfBirth.split("T")[0]
                : "",
        });


        setProfileImage(
            getProfileImageUrl(user?.profileImage)
        );

    }, [user]);


    // =========================================================
    // DARK MODE
    // =========================================================

    useEffect(() => {

        if (darkMode) {

            document.documentElement.classList.add(
                "dark"
            );

            localStorage.setItem(
                "quivora_theme",
                "dark"
            );

        } else {

            document.documentElement.classList.remove(
                "dark"
            );

            localStorage.setItem(
                "quivora_theme",
                "light"
            );

        }

    }, [darkMode]);


    // =========================================================
    // NOTIFICATIONS
    // =========================================================

    useEffect(() => {

        localStorage.setItem(
            "quivora_notifications",
            notifications
                ? "on"
                : "off"
        );

    }, [notifications]);


    // =========================================================
    // PROFILE INPUT
    // =========================================================

    const handleProfileChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================================
    // PASSWORD INPUT
    // =========================================================

    const handlePasswordChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setPasswordData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // =========================================================
    // SAVE PROFILE
    // =========================================================

    const handleSaveProfile = async () => {

        if (!profile.firstName.trim()) {

            toast.error(
                "First name cannot be empty."
            );

            return;

        }


        if (!profile.lastName.trim()) {

            toast.error(
                "Last name cannot be empty."
            );

            return;

        }


        if (!profile.email.trim()) {

            toast.error(
                "Email cannot be empty."
            );

            return;

        }


        try {

            setSavingProfile(true);


            const token =
                localStorage.getItem(
                    "quivora_token"
                );


            if (!token) {

                throw new Error(
                    "Authentication token not found."
                );

            }


            const response = await fetch(
                `${API_BASE_URL}/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        firstName:
                            profile.firstName.trim(),

                        lastName:
                            profile.lastName.trim(),

                        email:
                            profile.email
                                .trim()
                                .toLowerCase(),

                        phone:
                            profile.phone?.trim()
                            || null,

                        dateOfBirth:
                            profile.dateOfBirth
                            || null,

                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update profile."
                );

            }


            const updatedUser =
                data.data;


            // =================================================
            // UPDATE AUTH CONTEXT
            // =================================================

            if (updateUser) {

                updateUser(updatedUser);

            } else {

                localStorage.setItem(
                    "quivora_user",
                    JSON.stringify(
                        updatedUser
                    )
                );

            }


            // =================================================
            // UPDATE LOCAL PROFILE STATE
            // =================================================

            setProfile({

                firstName:
                    updatedUser.firstName
                    || "",

                lastName:
                    updatedUser.lastName
                    || "",

                email:
                    updatedUser.email
                    || "",

                phone:
                    updatedUser.phone
                    || "",

                dateOfBirth:
                    updatedUser.dateOfBirth
                        ? updatedUser.dateOfBirth
                            .split("T")[0]
                        : "",

            });


            setProfileImage(
                getProfileImageUrl(updatedUser.profileImage)
            );


            setEditingProfile(false);


            toast.success(
                data.message ||
                "Profile updated successfully."
            );


        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );


            toast.error(
                error.message ||
                "Unable to update profile."
            );


        } finally {

            setSavingProfile(false);

        }

    };


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    const handleChangePassword = async () => {

        if (
            !passwordData.currentPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            toast.error(
                "Please fill in all password fields."
            );

            return;

        }


        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            toast.error(
                "New password and confirm password do not match."
            );

            return;

        }


        if (
            passwordData.newPassword.length < 8
        ) {

            toast.error(
                "New password must be at least 8 characters."
            );

            return;

        }


        try {

            setChangingPassword(true);


            const token =
                localStorage.getItem(
                    "quivora_token"
                );


            if (!token) {

                throw new Error(
                    "Authentication token not found."
                );

            }


            const response = await fetch(
                `${API_BASE_URL}/users/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({

                        currentPassword:
                            passwordData.currentPassword,

                        newPassword:
                            passwordData.newPassword,

                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to change password."
                );

            }


            // =================================================
            // CLEAR PASSWORD FIELDS
            // =================================================

            setPasswordData({

                currentPassword: "",
                newPassword: "",
                confirmPassword: "",

            });


            setShowCurrentPassword(false);

            setShowNewPassword(false);

            setShowConfirmPassword(false);


            toast.success(
                data.message ||
                "Password changed successfully."
            );


        } catch (error) {

            console.error(
                "Failed to change password:",
                error
            );


            toast.error(
                error.message ||
                "Unable to change password."
            );


        } finally {

            setChangingPassword(false);

        }

    };


    // =========================================================
    // PROFILE IMAGE UPLOAD
    // =========================================================

    const handleProfileImage = async (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Please select a JPG, PNG, or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Profile image must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        try {
            const token = localStorage.getItem("quivora_token");

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const previewUrl = URL.createObjectURL(file);
            setProfileImage(previewUrl);

            const formData = new FormData();
            formData.append("profileImage", file);

            const response = await fetch(
                `${API_BASE_URL}/users/profile-picture`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to upload profile picture."
                );
            }

            const updatedUser = data.data;

            if (updatedUser?.profileImage) {
                setProfileImage(
                    getProfileImageUrl(updatedUser.profileImage)
                );
            }

            if (updateUser) {
                updateUser(updatedUser);
            } else {
                const currentUser = JSON.parse(
                    localStorage.getItem("quivora_user") || "{}"
                );

                localStorage.setItem(
                    "quivora_user",
                    JSON.stringify({
                        ...currentUser,
                        ...updatedUser,
                    })
                );
            }

            URL.revokeObjectURL(previewUrl);

            toast.success(
                data.message || "Profile picture updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to upload profile picture:",
                error
            );

            toast.error(
                error.message || "Unable to upload profile picture."
            );

            setProfileImage(
                getProfileImageUrl(user?.profileImage)
            );
        } finally {
            event.target.value = "";
        }

    };


    // =========================================================
    // REMOVE IMAGE
    // =========================================================

    const handleRemoveImage = () => {

        setProfileImage(null);

        toast.info(
            "Image removed from preview."
        );

    };


    // =========================================================
    // FULL NAME
    // =========================================================

    const fullName =
        `${profile.firstName} ${profile.lastName}`
            .trim()
        || "Student";


    // =========================================================
    // INITIALS
    // =========================================================

    const initials =
        `${profile.firstName?.charAt(0) || ""}
        ${profile.lastName?.charAt(0) || ""}`
            .trim()
            .toUpperCase()
        || "U";


    // =========================================================
    // INPUT CLASS
    // =========================================================

    const inputClass =
        "w-full h-12 rounded-xl border border-[#023222]/10 bg-[#FAF8F2] px-4 text-[#023222] outline-none focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20 transition disabled:opacity-70 disabled:cursor-not-allowed";


    // =========================================================
    // RETURN
    // =========================================================

    return (

        <div className="min-h-screen bg-[#FAF8F2] text-[#023222]">

            <div className="flex min-h-screen">

                {/* =================================================
                    SIDEBAR
                ================================================== */}

                <aside className="hidden lg:flex fixed left-0 top-0 z-40 w-50 h-screen bg-[#023222] text-white flex-col shadow-xl">

                    {/* LOGO */}

                     <div className=" py-5 border-b border-white/10 shrink-0 flex">
                                            
                                                                    <img
                                                                        src={logo}
                                                                        alt="Quivora"
                                                                        className="h-14 w-auto object-contain"
                                                                    />
                                                                    <h3 className="text-[25px] font-bold">Quivora
                                                                        <p className="text-[10px] font-semibold">Learn. Practice. Excel</p>
                                                                    </h3>
                                                                </div>


                    {/* NAVIGATION */}

                    <nav className="px-4 pt-6">

                        <p className="px-4 mb-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Workspace
                        </p>


                        {/* Dashboard */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/dashboard"
                                )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <User size={19} />

                            Dashboard

                        </button>


                        {/* My Quizzes */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/quizzes"
                                )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <User size={19} />

                            My Quizzes

                        </button>


                        {/* My Results */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/results"
                                )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <User size={19} />

                            My Results

                        </button>


                        {/* Leaderboard */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/student/leaderboard"
                                )
                            }
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition"
                        >

                            <User size={19} />

                            Leaderboard

                        </button>


                        {/* Profile */}

                        <button
                            type="button"
                            className="w-full flex items-center gap-3 px-4 py-3.5 mt-2 rounded-xl bg-[#D4A017] text-[#023222] font-semibold shadow-lg"
                        >

                            <User size={19} />

                            Profile

                        </button>

                    </nav>


                    {/* PROFILE */}

                    <div className="mt-auto px-4 pb-5">

                        <div className="border-t border-white/10 pt-4">

                            <div className="flex items-center gap-3 px-3 py-2">

                                <div className="w-10 h-10 rounded-full bg-[#F5E9D0] text-[#023222] flex items-center justify-center font-bold overflow-hidden">

                                    {profileImage ? (

                                        <img
                                            src={profileImage}
                                            alt={fullName}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        initials

                                    )}

                                </div>


                                <div className="min-w-0">

                                    <p className="font-semibold truncate">
                                        {fullName}
                                    </p>

                                    <p className="text-xs text-white/50 truncate">
                                        {profile.email}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </aside>


                {/* =================================================
                    MAIN CONTENT
                ================================================== */}

                <main className="flex-1 lg:ml-50">

                    {/* =================================================
                        TOP NAVBAR
                    ================================================== */}

                    <header className="sticky top-0 z-30 h-20 bg-white border-b border-[#023222]/10 px-6 md:px-8 flex items-center justify-between">

                        <div>

                            <p className="text-sm text-gray-500">
                                Student Workspace
                            </p>

                            <h2 className="text-xl font-bold">
                                Profile
                            </h2>

                        </div>


                        <div className="flex items-center gap-4">

                            <div className="hidden sm:block text-right">

                                <p className="font-semibold">
                                    {fullName}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Student
                                </p>

                            </div>


                            <div className="w-11 h-11 rounded-full bg-[#F5E9D0] text-[#023222] flex items-center justify-center font-bold overflow-hidden">

                                {profileImage ? (

                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />

                                ) : (

                                    initials

                                )}

                            </div>

                        </div>

                    </header>


                    {/* =================================================
                        CONTENT
                    ================================================== */}

                    <div className="p-5 md:p-4 max-w-[1100px] mx-auto">

                        {/* =================================================
                            PAGE HEADER
                        ================================================== */}

                        <section className="relative overflow-hidden rounded-2xl bg-[#023222] text-white p-7 mb-4">

                            <div className="relative z-10">

                                <p className="text-[#D4A017] text-sm font-semibold tracking-wide mb-2">
                                    ACCOUNT
                                </p>

                                <h1 className="text-3xl md:text-4xl font-extrabold">
                                    My Profile
                                </h1>

                                <p className="text-white/70 mt-2">
                                    Manage your personal information,
                                    security, and preferences.
                                </p>

                            </div>


                            <div className="absolute -right-16 -bottom-20 w-64 h-64 rounded-full bg-[#D4A017]/15" />

                            <div className="absolute right-20 -top-24 w-48 h-48 rounded-full bg-white/5" />

                        </section>


                        {/* =================================================
                            PROFILE OVERVIEW
                        ================================================== */}

                        <section className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-8 mb-6">

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                <div className="flex items-center gap-5">

                                    {/* PROFILE IMAGE */}

                                    <div className="relative">

                                        <div className="w-24 h-24 rounded-3xl bg-[#F5E9D0] text-[#023222] flex items-center justify-center text-3xl font-extrabold overflow-hidden">

                                            {profileImage ? (

                                                <img
                                                    src={profileImage}
                                                    alt={fullName}
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                initials

                                            )}

                                        </div>


                                        <label
                                            htmlFor="profileImage"
                                            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#D4A017] text-[#023222] flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition"
                                        >

                                            <Camera size={17} />

                                        </label>


                                        <input
                                            id="profileImage"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={
                                                handleProfileImage
                                            }
                                        />

                                    </div>


                                    <div>

                                        <h2 className="text-2xl font-extrabold">
                                            {fullName}
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            {profile.email}
                                        </p>

                                        <p className="text-sm text-[#0B5D45] mt-2 font-medium">
                                            Student Account
                                        </p>

                                    </div>

                                </div>


                                <div className="flex gap-2 flex-wrap">

                                    {profileImage && (

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveImage
                                            }
                                            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition text-sm font-semibold"
                                        >

                                            Remove Photo

                                        </button>

                                    )}


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingProfile(
                                                !editingProfile
                                            )
                                        }
                                        className="px-5 py-2.5 rounded-xl bg-[#023222] text-white hover:bg-[#0B5D45] transition flex items-center gap-2 font-semibold"
                                    >

                                        {editingProfile ? (

                                            <>
                                                <X size={17} />
                                                Cancel
                                            </>

                                        ) : (

                                            <>
                                                <Pencil size={17} />
                                                Edit Profile
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </section>


                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================== */}

                        <section className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-8 mb-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#E5F0EB] text-[#0B5D45] flex items-center justify-center">

                                    <User size={21} />

                                </div>


                                <div>

                                    <h2 className="text-xl font-extrabold">
                                        Personal Information
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Your basic account information
                                    </p>

                                </div>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* FIRST NAME */}

                                <div>

                                    <label className="block text-sm font-semibold mb-2">
                                        First Name
                                    </label>

                                    <input
                                        name="firstName"
                                        value={
                                            profile.firstName
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        disabled={
                                            !editingProfile
                                        }
                                        className={
                                            inputClass
                                        }
                                    />

                                </div>


                                {/* LAST NAME */}

                                <div>

                                    <label className="block text-sm font-semibold mb-2">
                                        Last Name
                                    </label>

                                    <input
                                        name="lastName"
                                        value={
                                            profile.lastName
                                        }
                                        onChange={
                                            handleProfileChange
                                        }
                                        disabled={
                                            !editingProfile
                                        }
                                        className={
                                            inputClass
                                        }
                                    />

                                </div>


                                {/* EMAIL */}

                                <div>

                                    <label className="block text-sm font-semibold mb-2">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            name="email"
                                            type="email"
                                            value={
                                                profile.email
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            disabled={
                                                !editingProfile
                                            }
                                            className={`${inputClass} pl-11`}
                                        />

                                    </div>

                                </div>


                                {/* PHONE */}

                                <div>

                                    <label className="block text-sm font-semibold mb-2">
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <Phone
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            name="phone"
                                            type="tel"
                                            value={
                                                profile.phone
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            disabled={
                                                !editingProfile
                                            }
                                            placeholder="Enter phone number"
                                            className={`${inputClass} pl-11`}
                                        />

                                    </div>

                                </div>


                                {/* DATE OF BIRTH */}

                                <div>

                                    <label className="block text-sm font-semibold mb-2">
                                        Date of Birth
                                    </label>

                                    <div className="relative">

                                        <CalendarDays
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={
                                                profile.dateOfBirth
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            disabled={
                                                !editingProfile
                                            }
                                            className={`${inputClass} pl-11`}
                                        />

                                    </div>

                                </div>

                            </div>


                            {editingProfile && (

                                <div className="flex justify-end mt-6">

                                    <button
                                        type="button"
                                        onClick={
                                            handleSaveProfile
                                        }
                                        disabled={
                                            savingProfile
                                        }
                                        className="px-6 py-3 rounded-xl bg-[#D4A017] text-[#023222] font-bold flex items-center gap-2 hover:brightness-95 transition disabled:opacity-50"
                                    >

                                        <Save size={18} />

                                        {savingProfile
                                            ? "Saving..."
                                            : "Save Changes"}

                                    </button>

                                </div>

                            )}

                        </section>


                        {/* =================================================
                            SECURITY
                        ================================================== */}

                        <section className="bg-white rounded-3xl border border-[#023222]/10 shadow-sm p-6 md:p-8 mb-6">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="w-11 h-11 rounded-xl bg-[#F5E9D0] text-[#9A7100] flex items-center justify-center">

                                    <LockKeyhole size={21} />

                                </div>


                                <div>

                                    <h2 className="text-xl font-extrabold">
                                        Security
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Keep your Quivora account secure
                                    </p>

                                </div>

                            </div>


                            <div className="bg-[#FAF8F2] rounded-2xl p-5">

                                <div className="flex items-center gap-3 mb-5">

                                    <ShieldCheck
                                        size={20}
                                        className="text-[#0B5D45]"
                                    />

                                    <h3 className="font-bold">
                                        Change Password
                                    </h3>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    {/* CURRENT PASSWORD */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            Current Password
                                        </label>

                                        <div className="relative">

                                            <input
                                                type={
                                                    showCurrentPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="currentPassword"
                                                value={
                                                    passwordData.currentPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                className={`${inputClass} pr-11`}
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >

                                                {showCurrentPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* NEW PASSWORD */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            New Password
                                        </label>

                                        <div className="relative">

                                            <input
                                                type={
                                                    showNewPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="newPassword"
                                                value={
                                                    passwordData.newPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                className={`${inputClass} pr-11`}
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowNewPassword(
                                                        !showNewPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >

                                                {showNewPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}

                                            </button>

                                        </div>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div>

                                        <label className="block text-sm font-semibold mb-2">
                                            Confirm Password
                                        </label>

                                        <div className="relative">

                                            <input
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="confirmPassword"
                                                value={
                                                    passwordData.confirmPassword
                                                }
                                                onChange={
                                                    handlePasswordChange
                                                }
                                                className={`${inputClass} pr-11`}
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword(
                                                        !showConfirmPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            >

                                                {showConfirmPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}

                                            </button>

                                        </div>

                                    </div>

                                </div>


                                <div className="flex justify-end mt-5">

                                    <button
                                        type="button"
                                        onClick={
                                            handleChangePassword
                                        }
                                        disabled={
                                            changingPassword
                                        }
                                        className="px-6 py-3 rounded-xl bg-[#023222] text-white font-bold hover:bg-[#0B5D45] transition disabled:opacity-50"
                                    >

                                        {changingPassword
                                            ? "Updating..."
                                            : "Update Password"}

                                    </button>

                                </div>

                            </div>

                        </section>


                       


                        {/* =================================================
                            FOOTER
                        ================================================== */}

                        <footer className="pt-6 border-t border-[#023222]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-500">

                            <p>
                                © 2026 Quivora. Learn. Practice. Excel.
                            </p>

                            <p>
                                Secure Assessment Platform
                            </p>

                        </footer>

                    </div>

                </main>

            </div>

        </div>

    );

};

export default StudentProfile;