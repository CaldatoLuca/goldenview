import { UTApi } from "uploadthing/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";
import { requireAdmin } from "@/lib/api/middleware/auth";

const utapi = new UTApi();

export async function POST(request: NextRequest) {
  await requireAdmin();

  try {
    const { fileKey } = await request.json();

    if (!fileKey) {
      throw new ApiError("File Key mancante", ErrorTypes.NOT_FOUND.status);
    }

    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
