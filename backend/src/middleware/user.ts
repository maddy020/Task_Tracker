import type { Response, NextFunction } from "express";
export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    next();
  } catch (error) {
    console.log("Error in user middleware", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}
