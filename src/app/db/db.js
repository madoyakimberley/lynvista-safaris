import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

/**
 * 💡 WHY THIS FIXES ETIMEDOUT:
 * We store the pool in 'global' so that Next.js reuse the same
 * 10 connections even when the code reloads during development.
 */

const poolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Check if a pool already exists in this environment
const globalForDb = global;
const pool = globalForDb.mysqlPool || mysql.createPool(poolConfig);

// If we are not in production, save the pool to the global object
if (process.env.NODE_ENV !== "production") {
  globalForDb.mysqlPool = pool;
}

export const db = drizzle(pool);
