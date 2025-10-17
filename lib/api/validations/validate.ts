import { z } from "zod";
import { ApiError, ErrorTypes } from "../errors";

export async function validate<T extends z.ZodTypeAny>(
  schema: T,
  input: Request | unknown
): Promise<z.infer<T>> {
  const data = input instanceof Request ? await input.json() : input;

  const result = schema.safeParse(data);

  if (!result.success) {
    const messages = result.error.issues.map((err) => err.message).join(", ");
    throw new ApiError(messages, ErrorTypes.BAD_REQUEST.status);
  }

  return result.data;
}
