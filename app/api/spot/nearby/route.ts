import { PrismaClient, Prisma } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latitude = parseFloat(searchParams.get("latitude") || "");
    const longitude = parseFloat(searchParams.get("longitude") || "");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const active = searchParams.get("active");
    const publicParam = searchParams.get("public");

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new ApiError(
        "Latitudine e Longitudine obbligatori",
        ErrorTypes.BAD_REQUEST.status
      );
    }

    const offset = (page - 1) * limit;

    // Costruisci le condizioni WHERE dinamicamente
    const conditions: string[] = [];

    if (active !== null) {
      conditions.push(`s.active = ${active === "true"}`);
    }

    if (publicParam !== null) {
      conditions.push(`s.public = ${publicParam === "true"}`);
    }

    const whereClause =
      conditions.length > 0
        ? Prisma.sql`WHERE ${Prisma.raw(conditions.join(" AND "))}`
        : Prisma.empty;

    // Query per gli spots con distanza
    const spots = await prisma.$queryRaw`
      SELECT 
        s.*,
        ST_DistanceSphere(
          ST_MakePoint(s.longitude, s.latitude),
          ST_MakePoint(${longitude}, ${latitude})
        ) AS distance
      FROM "Spot" s
      ${whereClause}
      ORDER BY distance ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Query per il conteggio totale
    const totalResult: { count: bigint }[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Spot" s
      ${whereClause}
    `;

    const total = Number(totalResult[0]?.count || 0);

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
  } finally {
    await prisma.$disconnect();
  }
}
