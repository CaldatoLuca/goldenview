import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { registerSchema } from "@/lib/api/validations/userSchema";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await validate(registerSchema, req);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email già registrata", ErrorTypes.CONFLICT.status);
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
