import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { resetTokenSchema } from "@/lib/api/validations/userSchema";
import { hash, compare } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token } = await validate(resetTokenSchema, req);

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new ApiError(
        "Token non valido o scaduto",
        ErrorTypes.BAD_REQUEST.status
      );
    }

    return NextResponse.json({ userId: resetToken.userId }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
