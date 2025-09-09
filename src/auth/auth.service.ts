import { Prisma, PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const registerUser = async (
  data: Prisma.UserCreateInput
): Promise<User> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{
  token: string;
  user: Omit<User, "password"> & { permissions: string[] };
}> => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  const permissions = user.role.permissions.map((rp) => rp.permission.name);

  const token = jwt.sign(
    {
      userId: user.id,
      permissions: permissions,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  const { password: _, ...userWithoutPassword } = user;

  return { token, user: { ...userWithoutPassword, permissions } };
};
