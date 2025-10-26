import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { spotSchema } from "@/lib/api/validations/spotSchema";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      name,
      description,
      public: isPublic,
      active,
    } = await validate(spotSchema, req);

    const spot = await prisma.spot.create({
      data: {
        name,
        description,
        public: isPublic ?? true,
        active: active ?? true,
        images: [],
      },
    });

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
