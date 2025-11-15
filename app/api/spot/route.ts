import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { validate } from "@/lib/api/validations/validate";
import { spotSchema } from "@/lib/api/validations/spotSchema";
import { requireAdmin } from "@/lib/api/middleware/auth";
import { generateUniqueSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const publicParam = searchParams.get("public");
    const place = searchParams.get("place");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (!session || session.user.role !== "ADMIN") {
      where.OR = [
        { public: true },
        ...(session ? [{ userId: session.user.id }] : []),
      ];
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { description: { contains: search.trim(), mode: "insensitive" } },
        { address: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (active === "true") {
      where.active = true;
    } else if (active === "false") {
      where.active = false;
    }

    if (publicParam === "true") {
      where.public = true;
    } else if (publicParam === "false") {
      where.public = false;
    }

    if (place && place.trim()) {
      where.place = { contains: place.trim(), mode: "insensitive" };
    }

    const [spots, total] = await Promise.all([
      prisma.spot.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.spot.count({ where }),
    ]);

    return NextResponse.json({
      spots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();

  try {
    const {
      name,
      description,
      public: isPublic,
      active,
      images,
      place,
      latitude,
      longitude,
      address,
    } = await validate(spotSchema, req);

    const slug = await generateUniqueSlug(name, prisma.spot);

    const spot = await prisma.spot.create({
      data: {
        name,
        description,
        public: isPublic ?? true,
        active: active ?? true,
        images: images ?? [],
        userId: session.user.role === "ADMIN" ? null : session.user.id,
        place,
        latitude,
        longitude,
        address,
        slug,
      },
    });

    return NextResponse.json(spot, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  await requireAdmin();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      throw new ApiError("Spot ID obbligatorio", ErrorTypes.BAD_REQUEST.status);
    }

    const spot = await prisma.spot.findUnique({
      where: { id },
    });

    if (!spot) {
      throw new ApiError("Spot non trovato", ErrorTypes.NOT_FOUND.status);
    }

    await prisma.spot.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Spot cancellato correttamente" },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
