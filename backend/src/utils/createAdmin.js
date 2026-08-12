import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";

const createAdmin = async () => {
  try {
    const adminExists = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
    });

    if (adminExists) {
      console.log("✅ Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await prisma.user.create({
      data: {
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
      },
    });

    console.log("✅ Default Admin Created Successfully.");
  } catch (error) {
    console.error("❌ Error Creating Admin:", error.message);
  }
};

export default createAdmin;