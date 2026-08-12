import dotenv from "dotenv";
import app from "./app.js";
import createAdmin from "./utils/createAdmin.js";

dotenv.config();

console.log(
  "JWT_EXPIRES_IN:",
  process.env.JWT_EXPIRES_IN
);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  async () => {

    console.log(
      `🚀 Server running on port ${PORT}`
    );

    await createAdmin();

  }
);