import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new ApiError(409, "Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  async login(email, password) {

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password.");
    }

    return user;
}
}

export default new AuthService();