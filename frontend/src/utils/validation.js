// Full Name Validation
export const validateName = (name) => {
    if (!name.trim()) return "Full Name is required.";

    if (!/^[A-Z][a-zA-Z ]*$/.test(name))
        return "Name must start with a capital letter and contain only alphabets.";

    if (name.trim().length < 3)
        return "Name must be at least 3 characters.";

    return "";
};

// Email Validation
export const validateEmail = (email) => {
    if (!email.trim()) return "Email Address is required.";

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
        return "Enter a valid email address.";

    return "";
};

// Password Validation
export const validatePassword = (password) => {

    if (!password)
        return "Password is required.";

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password))
        return "Password must contain uppercase, lowercase, number, special character and minimum 8 characters.";

    return "";
};

// Confirm Password
export const validateConfirmPassword = (
    password,
    confirmPassword
) => {

    if (!confirmPassword)
        return "Confirm Password is required.";

    if (password !== confirmPassword)
        return "Passwords do not match.";

    return "";
};