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
  boolean, // Drizzle handles this as tinyint(1) for MySQL
} from "drizzle-orm/mysql-core";

/* =======================
   ADMINS
======================= */
export const admins = mysqlTable("admins", {
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
  image: varchar("image", { length: 255 }),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   POSTS/BLOGS (Fixed for MySQL)
======================= */
export const posts = mysqlTable("posts", {
  id: int("id").primaryKey().autoincrement(),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  author: varchar("author", { length: 100 }).default("Lynvista Team"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/* =======================
   SERVICES & OTHER TABLES
======================= */
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon_name: varchar("icon_name", { length: 50 }).notNull(),
  is_active: int("is_active").default(1),
  created_at: timestamp("created_at").defaultNow(),
});

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

export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  tour_package: varchar("tour_package", { length: 255 }),
  travel_start_date: date("travel_start_date"),
  travel_end_date: date("travel_end_date"),
  adults: int("adults").default(1),
  children: int("children").default(0),
  flight_type: varchar("flight_type", { length: 255 }),
  departure_city: varchar("departure_city", { length: 255 }),
  arrival_city: varchar("arrival_city", { length: 255 }),
  accommodation_type: varchar("accommodation_type", { length: 255 }),
  currency: mysqlEnum("currency", ["EUR", "USD", "KES"])
    .notNull()
    .default("USD"),
  notes: text("notes"),
  admin_notes: text("admin_notes"),
  quoted_price: decimal("quoted_price", { precision: 10, scale: 2 }),
  payment_method: mysqlEnum("payment_method", [
    "Bank Transfer",
    "M-Pesa",
    "Card",
    "Other",
  ]).default("Bank Transfer"),
  payment_reference: varchar("payment_reference", { length: 255 }),
  payment_proof_url: varchar("payment_proof_url", { length: 500 }),
  payment_link_sent: mysqlEnum("payment_link_sent", ["Yes", "No"]).default(
    "No",
  ),
  managed_status: mysqlEnum("managed_status", ["Pending", "Managed"]).default(
    "Pending",
  ),
  payment_status: mysqlEnum("payment_status", [
    "Pending",
    "Quotation Sent",
    "Awaiting Verification",
    "Paid",
    "Cancelled",
  ]).default("Pending"),
  created_at: timestamp("created_at").defaultNow(),
  user_id: int("user_id"),
});

export const quotes = mysqlTable("quotes", {
  id: int("id").primaryKey().autoincrement(),
  booking_id: int("booking_id").notNull(),
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  payment_method: mysqlEnum("payment_method", [
    "Paystack",
    "M-Pesa",
    "Card",
    "Bank Transfer",
  ]).notNull(),
  payment_link: text("payment_link"),
  created_at: timestamp("created_at").defaultNow(),
});

export const quoteItems = mysqlTable("quote_items", {
  id: int("id").primaryKey().autoincrement(),
  quote_id: int("quote_id").notNull(),
  item_name: varchar("item_name", { length: 150 }).notNull(),
  item_price: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
});

export const bookingServices = mysqlTable("booking_services", {
  id: int("id").primaryKey().autoincrement(),
  booking_id: int("booking_id").notNull(),
  service_id: int("service_id").notNull(),
});

export const inquiries = mysqlTable("inquiries", {
  id: int("id").primaryKey().autoincrement(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 150 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["Pending", "Reviewed", "Archived"]).default(
    "Pending",
  ),
  created_at: timestamp("created_at").defaultNow(),
});

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").primaryKey().autoincrement(),
  admin_id: int("admin_id").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
