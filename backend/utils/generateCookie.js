import jwt from "jsonwebtoken";

const generateCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  res.cookie("session", token, {
  httpOnly: true,
  // If in development, secure must be false. If in production, must be true.
  secure: process.env.NODE_ENV === "production", 
  // "Lax" is better for local dev. "None" requires HTTPS/Secure.
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

  return token;
};

export default generateCookie;
