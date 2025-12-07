import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface customRequest extends Request {
  user?: JwtPayload;
}
