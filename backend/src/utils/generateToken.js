import jwt from "jsonwebtoken";

const generateToken = (user) => {

    console.log("SIGN SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );

    console.log("GENERATED TOKEN:", token);

    return token;
};

export default generateToken;