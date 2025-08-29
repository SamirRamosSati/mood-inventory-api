import { Request, Response } from "express";
import * as authServices from "../auth/auth.service";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, initials, password, roleId } = req.body;

    if (
      !name ||
      name.trim() === "" ||
      !email ||
      email.trim() === "" ||
      !password ||
      password.trim() === "" ||
      !roleId ||
      roleId.trim() === "" ||
      !!initials ||
      initials.trim() === ""
    ) {
      return res.status(400).json({
        error: "All required fields must be provided.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = {
      name,
      initials,
      email,
      password: hashedPassword,
      role: {
        connect: { id: roleId },
      },
    };

    const newUser = await authServices.registerUser(userData);

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ error: "Email or initials already in use." });
      }
    }
    return res.status(500).json({ error: "Failed to register user." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if ((!email || email.trim() === "", !password || password.trim() === "")) {
      return res.status(400).json({
        error: "Email and Password are required",
      });
    }
    const { token, user } = await authServices.loginUser(email, password);
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        initials: user.initials,
        role: user.role.name,
        permissions: user.permissions,
      },
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Failed to login." });
  }
};
