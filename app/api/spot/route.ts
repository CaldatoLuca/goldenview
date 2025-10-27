import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { spotSchema } from "@/lib/api/validations/spotSchema";
import { requireAdmin } from "@/lib/api/middleware/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await requireAdmin();

  try {
    const {
      name,
      description,
      public: isPublic,
      active,
      images,
    } = await validate(spotSchema, req);

    const spot = await prisma.spot.create({
      data: {
        name,
        description,
        public: isPublic ?? true,
        active: active ?? true,
        images: images ?? [],
        userId: session.user.role === "ADMIN" ? null : session.user.id,
      },
    });

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
