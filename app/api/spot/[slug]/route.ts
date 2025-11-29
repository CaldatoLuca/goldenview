import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError, ErrorTypes, handleApiError } from "@/lib/api/errors";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const slug = params.slug;

    if (!slug) {
      throw new ApiError("Slug obbligatorio", ErrorTypes.BAD_REQUEST.status);
    }

    const spot = await prisma.spot.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!spot) {
      throw new ApiError("Spot non trovato", ErrorTypes.NOT_FOUND.status);
    }

    const isOwner = session && spot.userId === session.user?.id;
    const isAdmin = session?.user?.role === "ADMIN";

    if (!spot.public && !isAdmin && !isOwner) {
      throw new ApiError(
        "Non hai i permessi per visualizzare questo spot",
        ErrorTypes.UNAUTHORIZED.status
      );
    }

    return NextResponse.json(spot);
  } catch (error) {
    return handleApiError(error);
  }
}
