import type { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { customRequest } from "../utils/types";

export async function checkUser(
  req: customRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(404).json({ message: "No headers found" });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error in user middleware", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}
