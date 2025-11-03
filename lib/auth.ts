import jwt from "jsonwebtoken"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}
