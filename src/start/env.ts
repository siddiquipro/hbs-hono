import "dotenv/config";
import { z } from "zod";
import { join } from "path";

const rootPath = join(import.meta.dirname, "..", "..");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
  })
  .transform((data) => ({ ...data, rootPath, inProduction: data.NODE_ENV === "production" }));

export const env = envSchema.parse(process.env);
