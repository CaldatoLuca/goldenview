import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import {
  validateTokenSchema,
  resetPasswordSchema,
} from "@/lib/api/validations/userSchema";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token } = await validate(validateTokenSchema, req);

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

export async function PUT(req: Request) {
  try {
    const { password, userId, token } = await validate(
      resetPasswordSchema,
      req
    );

    const result = await prisma.$transaction(async (tx) => {
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetToken) {
        throw new ApiError("Token non trovato", ErrorTypes.BAD_REQUEST.status);
      }

      if (resetToken.expiresAt < new Date()) {
        await tx.passwordResetToken.delete({ where: { token } });
        throw new ApiError("Token scaduto", ErrorTypes.BAD_REQUEST.status);
      }

      if (resetToken.userId !== userId) {
        throw new ApiError(
          "Token non valido per questo utente",
          ErrorTypes.FORBIDDEN.status
        );
      }

      const hashedPassword = await hash(password, 10);

      const [updatedUser] = await Promise.all([
        tx.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
            updatedAt: new Date(),
          },
        }),

        tx.passwordResetToken.delete({ where: { token } }),
      ]);

      return updatedUser;
    });

    return NextResponse.json(
      { message: "Password aggiornata correttamente" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
