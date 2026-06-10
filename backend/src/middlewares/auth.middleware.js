import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { ResponseError } from "../models/error.models.js";

const SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * Middleware to authenticate token
 * Checks if Authorization header is present and validates JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ResponseError(401, "Token tidak ditemukan");
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, SECRET);
      
      if (!decoded.id || !decoded.email || !decoded.role) {
        throw new ResponseError(401, "Token tidak valid");
      }

      // Validate token in database
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
          userToken: token,
        },
      });

      if (!user) {
        throw new ResponseError(401, "Token tidak valid atau sudah kedaluwarsa");
      }

      // Attach user info to request
      req.user = {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ResponseError(401, "Token sudah kedaluwarsa");
      } else if (err.name === "JsonWebTokenError") {
        throw new ResponseError(401, "Token tidak valid");
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user is admin
 * Must be used after authenticateToken middleware
 */
export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      throw new ResponseError(401, "Autentikasi diperlukan");
    }

    if (req.user.role !== "admin") {
      throw new ResponseError(403, "Akses ditolak. Hanya admin yang dapat mengakses endpoint ini");
    }

    next();
  } catch (error) {
    next(error);
  }
};
