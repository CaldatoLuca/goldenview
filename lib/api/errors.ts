import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public message: string, public status: number = 500) {
    super(message);
    this.name = "ApiError";
  }
}

export const ErrorTypes = {
  UNAUTHORIZED: { status: 401, message: "Non autorizzato" },
  FORBIDDEN: { status: 403, message: "Accesso negato" },
  NOT_FOUND: { status: 404, message: "Risorsa non trovata" },
  CONFLICT: { status: 409, message: "Risorsa già esistente" },
  INTERNAL_ERROR: { status: 500, message: "Errore del server" },
  BAD_REQUEST: { status: 400, message: "Richiesta non valida" },
} as const;

export function createErrorResponse(
  message: string,
  status: number = 500
): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return createErrorResponse(error.message, error.status);
  }

  console.error("Errore non gestito:", error);
  return createErrorResponse(
    ErrorTypes.INTERNAL_ERROR.message,
    ErrorTypes.INTERNAL_ERROR.status
  );
}
