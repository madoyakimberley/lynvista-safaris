import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "../src/app/db/db.js";
import { admins } from "../src/app/db/schema.js";
import { eq } from "drizzle-orm"; // <-- You were missing this import

async function createSuperAdmin() {
  try {
    const email = process.env.SUPERADMIN_EMAIL;
    const password = process.env.SUPERADMIN_PASSWORD;

    console.log("Checking for existing admin...");

    // FIX: Use eq(column, value) instead of .equals()
    const existing = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email));

    if (existing.length > 0) {
      console.log(`Admin ${email} already exists. No action taken.`);
      process.exit(0);
    }

    const password_hash = await bcrypt.hash(password, 10);

    await db.insert(admins).values({
      email,
      password_hash,
      role: "super_admin",
    });

    console.log("-----------------------------------------");
    console.log(`SUCCESS! Admin created.`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
