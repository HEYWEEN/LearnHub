import jwt from "jsonwebtoken";
import LOG_COLOR from "../constants/logColor.js";

export const getSecretKey = () => {
  if (!process.env.SECRET_KEY) {
    return "WFlLWM0NzQtMTFmMC1hOWNlLTEwN2M2MTkwMWUxYiIsImV4cCI6MTY5ODkzOTAyMn0";
  }
  return process.env.SECRET_KEY;
};

export async function generateToken(user) {
  const SECRET_KEY = getSecretKey();
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.created_at,
    },
    SECRET_KEY,
    { expiresIn: "72h" }
  );
  return token;
}
