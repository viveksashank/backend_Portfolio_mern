import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "pmpkpavankumar0816";

// Extend Express Request
interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

// SIGN JWT
function signJWT(payload: object): string | undefined {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "10d",
    });

    return token;
  } catch (err) {
    console.log("JWT Sign Error:", err);
    return undefined;
  }
}

// VERIFY JWT
const verifyJWT = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// AUTHORIZE ROLE
const authorizeRole = (...allowedRoles: string[]) => {
  return (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Response | void => {
    try {
      const userRole = (req.user as JwtPayload)?.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Authorization error",
        error: err.message,
      });
    }
  };
};

export { signJWT, verifyJWT, authorizeRole, CustomRequest };