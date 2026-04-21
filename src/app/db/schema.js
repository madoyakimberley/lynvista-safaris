import {
  mysqlTable,
  varchar,
  int,
  text,
  decimal,
  timestamp,
  mysqlEnum,
  primaryKey,
  date,
} from "drizzle-orm/mysql-core";

/* =======================
   ADMINS
======================= */
export const admins = mysqlTable("admins", {
  // Using int + autoincrement instead of serial to prevent TiDB conflict
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin"]).notNull().default("admin"),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   TOURS
======================= */
export const tours = mysqlTable("tours", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description").notNull(),
  base_price: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   SERVICES
======================= */
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon_name: varchar("icon_name", { length: 50 }).notNull(),
  is_active: int("is_active").default(1),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   TOUR SERVICES (M:N)
======================= */
export const tourServices = mysqlTable(
  "tour_services",
  {
    tour_id: int("tour_id").notNull(),
    service_id: int("service_id").notNull(),
  },
  (table) => ({
    pk: primaryKey(table.tour_id, table.service_id),
  }),
);

/* =======================
   BOOKINGS (Updated)
======================= */
export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  tour_package: varchar("tour_package", { length: 255 }),

  // ... (keep flight and accommodation fields the same)

  currency: mysqlEnum("currency", ["EUR", "USD", "KES"])
    .notNull()
    .default("USD"),
  notes: text("notes"), // User notes
  admin_notes: text("admin_notes"), // NEW: Internal notes for the manual process

  quoted_price: decimal("quoted_price", { precision: 10, scale: 2 }),

  // UPDATED: Added manual methods, removed Stripe/Paystack if you're fully transitioning
  payment_method: mysqlEnum("payment_method", [
    "Bank Transfer",
    "M-Pesa",
    "Cash",
    "Other",
  ]).default(null),

  payment_reference: varchar("payment_reference", { length: 255 }), // User enters Tx ID here
  payment_proof_url: varchar("payment_proof_url", { length: 500 }), // NEW: URL to uploaded receipt image

  payment_link_sent: mysqlEnum("payment_link_sent", ["Yes", "No"]).default(
    "No",
  ),

  managed_status: mysqlEnum("managed_status", ["Pending", "Managed"]).default(
    "Pending",
  ),

  // UPDATED: Clarified statuses for manual flow
  payment_status: mysqlEnum("payment_status", [
    "Pending", // User just booked
    "Quotation Sent", // Admin sent the price
    "Awaiting Verification", // User says they paid, Admin needs to check bank
    "Paid", // Admin confirmed
    "Cancelled",
  ]).default("Pending"),

  created_at: timestamp("created_at").defaultNow(),
  user_id: int("user_id"),
});

/* =======================
   QUOTES
======================= */
export const quotes = mysqlTable("quotes", {
  id: int("id").primaryKey().autoincrement(),
  booking_id: int("booking_id").notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  payment_method: mysqlEnum("payment_method", ["Paystack", "M-Pesa"]).notNull(),
  payment_link: text("payment_link"),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   QUOTE ITEMS
======================= */
export const quoteItems = mysqlTable("quote_items", {
  id: int("id").primaryKey().autoincrement(),
  quote_id: int("quote_id").notNull(),
  item_name: varchar("item_name", { length: 150 }).notNull(),
  item_price: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
});

/* =======================
   BOOKING SERVICES (M:N)
======================= */
export const bookingServices = mysqlTable("booking_services", {
  id: int("id").primaryKey().autoincrement(),
  booking_id: int("booking_id").notNull(),
  service_id: int("service_id").notNull(),
});

/* =======================
   AUDIT LOGS
======================= */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  admin_id: int("admin_id").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
