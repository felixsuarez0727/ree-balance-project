import dotenv from "dotenv";
dotenv.config();

export function getEnvVar(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    console.error(`[Env]: Environment variable ${key} is required`);
    process.exit(1);
  }
  return value!;
}

export function getEnvVarAsNumber(key: string, required = true): number {
  const value = getEnvVar(key, required);
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.error(`[Env]: Environment variable ${key} must be a valid number`);
    process.exit(1);
  }
  return parsed;
}

export const PORT = getEnvVarAsNumber("PORT");
export const MONGO_URI = getEnvVar("MONGO_URI");
export const NODE_ENV = getEnvVar("NODE_ENV", false) || "development";
