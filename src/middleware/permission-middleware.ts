import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    permissions: string[];
  };
}

export const checkPermission = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.permissions) {
      return res
        .status(401)
        .json({ error: "Access denied: Authentication required." });
    }

    if (req.user.permissions.includes(requiredPermission)) {
      next();
    } else {
      return res
        .status(403)
        .json({
          error:
            "Access denied: You do not have permission to perform this action.",
        });
    }
  };
};
