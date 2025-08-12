import { Request, Response } from "express";
import * as authServices from "../auth/auth.service";
import { Prisma } from "@prisma/client";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      name.trim() === "" ||
      !email ||
      email.trim() === "" ||
      !password ||
      password.trim() === ""
    ) {
      return res
        .status(400)
        .json({
          error: "Name, email, and password are required and cannot be empty.",
        });
    }
    const newUser = await authServices.registerUser({
      name,
      email,
      password,
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error: any) {
    console.error("Error during user registration:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Email already in use." });
      }
    }
    return res.status(500).json({ error: "Failed to register user." });
  }
};
