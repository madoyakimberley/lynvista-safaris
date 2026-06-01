import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// 1. Create a global cache to ensure the pool is not recreated on HMR
const globalForDb = global;

if (!globalForDb.pool) {
  globalForDb.pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || "lynvista",
    port: Number(process.env.DB_PORT) || 4000,
    ssl: {
      rejectUnauthorized: true,
    },
    // 🛡️ CRITICAL: Keep connection alive and handle timeouts
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });
}

export const db = drizzle(globalForDb.pool);
