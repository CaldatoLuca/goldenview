import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { forgotPasswordSchema } from "@/lib/api/validations/userSchema";
import { createHash, randomBytes } from "crypto";
import { sendResetPasswordEmail } from "@/lib/services/resend.service";

const prisma = new PrismaClient();

const TOKEN_BYTES = 32;
const TOKEN_EXPIRATION_MS = 1000 * 60 * 60;

export async function POST(req: Request) {
  try {
    const { email } = await validate(forgotPasswordSchema, req);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(
        "Email non registrata a sistema",
        ErrorTypes.NOT_FOUND.status
      );
    }

    if (!user.password) {
      throw new ApiError(
        "Account creato con social login, impossibile reimpostare la password",
        ErrorTypes.BAD_REQUEST.status
      );
    }

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    const token = randomBytes(TOKEN_BYTES).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

    await prisma.passwordResetToken.create({
      data: {
        token: tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    await sendResetPasswordEmail(user.email!, token);

    return NextResponse.json(
      {
        message: "Email inviata con successo!",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
