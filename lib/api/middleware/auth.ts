import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ApiError, ErrorTypes } from "@/lib/api/errors";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new ApiError("Non autenticato", ErrorTypes.UNAUTHORIZED.status);
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new ApiError(
      "Accesso negato. Permessi amministratore richiesti",
      ErrorTypes.FORBIDDEN.status
    );
  }

  return session;
}
