import { Resend } from "resend";
import { ApiError, handleApiError, ErrorTypes } from "@/lib/api/errors";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY non definita");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export function resetPasswordTemplate(resetUrl: string) {
  return {
    subject: "Reimposta la tua password",
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <h2>Reimposta la tua password</h2>
        <p>Hai richiesto di reimpostare la tua password. Clicca sul link qui sotto per sceglierne una nuova.</p>
        <p><a href="${resetUrl}" style="background: #f97316; color: white; padding: 10px 15px; border-radius: 6px; text-decoration: none;">Reimposta la password</a></p>
        <p>Questo link scade tra 1 ora.</p>
        <hr />
        <p style="font-size: 12px; color: #666;">Se non hai richiesto questa operazione, ignora questa email.</p>
      </div>
    `,
  };
}

const FROM = "Resend <onboarding@resend.dev>";

export async function sendResetPasswordEmail(to: string, token: string) {
  const resetUrl = `${
    process.env.NEXT_PUBLIC_APP_URL
  }/reset-password?token=${encodeURIComponent(token)}`;
  const { subject, html } = resetPasswordTemplate(resetUrl);

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      throw new ApiError(
        result.error.message,
        ErrorTypes.INTERNAL_ERROR.status
      );
    }

    return result;
  } catch (error) {
    return handleApiError(error);
  }
}
