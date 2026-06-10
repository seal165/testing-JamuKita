import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.models.js";
import { generateToken } from "../utils/jwt.js";
import { ResponseError } from "../models/error.models.js";

export const AuthController = {
  // POST /auth/register - Register new Anggota
  async register(req, res, next) {
    try {
      let { nama, email, password } = req.body;

      // Trim input
      nama = nama?.trim();
      email = email?.trim().toLowerCase();
      password = password?.trim();

      // Check if email already exists
      const emailExists = await UserModel.emailExists(email);
      if (emailExists) {
        throw new ResponseError(400, "Email sudah terdaftar");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        nama,
        email,
        password: hashedPassword,
      });

      // Generate token
      const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Save token to database
      await UserModel.updateToken(user.id, token);

      res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
          },
          access_token: token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /auth/login - Login for Anggota and Admin
  async login(req, res, next) {
    try {
      let { email, password } = req.body;
      email = email.toLowerCase();

      // Find user by email
      const user = await UserModel.getByEmail(email);
      if (!user) {
        throw new ResponseError(401, "Email atau password salah");
      }

      // Check if user is banned
      if (user.isBanned) {
        throw new ResponseError(403, "Akun Anda telah diblokir. Silakan hubungi administrator");
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ResponseError(401, "Email atau password salah");
      }

      // Generate token
      const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Save token to database
      await UserModel.updateToken(user.id, token);

      res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            role: user.role,
          },
          access_token: token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /auth/logout - Logout (invalidate token)
  async logout(req, res, next) {
    try {
      const userId = req.user.id;

      // Clear token from database
      await UserModel.updateToken(userId, null);

      res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      next(error);
    }
  },
};
