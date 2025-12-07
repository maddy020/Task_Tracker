import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then(() => console.log("Connected to NeonDB"))
  .catch((err) => console.error("Failed NeonDB connection:", err));

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
