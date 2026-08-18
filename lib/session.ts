import jwt from "jsonwebtoken";

const SECRET = process.env.SESSION_SECRET || "dev-secret";

export function createSession(payload: any) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function decodeSession(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
