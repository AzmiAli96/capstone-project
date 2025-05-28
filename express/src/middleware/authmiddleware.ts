import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface userData {
    id: string;
    name: string;
    alamat: string;
    no_hp: string;
    role: string;
    image: string;
}

interface ValidationRequest extends Request {
    userData?: userData;
}

export const accessValidation = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validationRequest = req as ValidationRequest;
    const { authorization } = req.headers;

    // Cek cookie jika tidak ada authorization header
    const token = authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Token diperlukan" });
    }

    const secret = process.env.JWT_SECRET!;

    try {
        const jwtDecode = jwt.verify(token, secret);
        if (typeof jwtDecode !== "string") {
            validationRequest.userData = jwtDecode as userData;
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

// Middleware untuk role-based authorization
export const roleAuthorization = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationRequest = req as ValidationRequest;
        
        if (!validationRequest.userData) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userRole = validationRequest.userData.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: "Forbidden: You don't have permission to access this resource",
                requiredRoles: allowedRoles,
                userRole: userRole
            });
        }

        next();
    };
};