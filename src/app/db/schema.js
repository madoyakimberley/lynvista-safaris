import {
  mysqlTable,
  serial,
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
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["super_admin", "admin"]).notNull().default("admin"),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   TOURS
======================= */
export const tours = mysqlTable("tours", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 150 }).notNull(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  description: text("description").notNull(),
  base_price: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  main_image: varchar("main_image", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   SERVICES
======================= */
export const services = mysqlTable("services", {
  id: serial("id").primaryKey(),
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
   BOOKINGS
======================= */
export const bookings = mysqlTable("bookings", {
  id: serial("id").primaryKey(),
  full_name: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  tour_package: varchar("tour_package", { length: 255 }),

  flight_type: mysqlEnum("flight_type", [
    "Domestic Flight",
    "International Flight",
    "None",
  ]).default("None"),

  departure_city: varchar("departure_city", { length: 100 }),
  arrival_city: varchar("arrival_city", { length: 100 }),

  accommodation_type: mysqlEnum("accommodation_type", [
    "Hotel",
    "Resort",
    "Lodge",
    "Camp",
    "Apartment",
    "None",
  ]).default("None"),

  checkin_date: date("checkin_date"),
  checkout_date: date("checkout_date"),
  travel_start_date: date("travel_start_date"),
  travel_end_date: date("travel_end_date"),

  adults: int("adults").default(1),
  children: int("children").default(0),

  currency: mysqlEnum("currency", ["EUR", "USD", "KES"])
    .notNull()
    .default("USD"),
  notes: text("notes"),

  quoted_price: decimal("quoted_price", { precision: 10, scale: 2 }),
  payment_method: mysqlEnum("payment_method", [
    "Stripe",
    "M-Pesa",
    "Paystack",
  ]).default(null),
  payment_reference: varchar("payment_reference", { length: 255 }),
  payment_link_sent: mysqlEnum("payment_link_sent", ["Yes", "No"]).default(
    "No",
  ),

  managed_status: mysqlEnum("managed_status", ["Pending", "Managed"]).default(
    "Pending",
  ),
  payment_status: mysqlEnum("payment_status", [
    "Pending",
    "Quotation Sent",
    "Paid",
    "Cancelled",
  ]).default("Pending"),

  created_at: timestamp("created_at").defaultNow(),
  user_id: int("user_id"),
});

/* =======================
   QUOTES
======================= */
export const quotes = mysqlTable("quotes", {
  id: serial("id").primaryKey(),
  booking_id: int("booking_id").notNull(), // should exist in bookings
  total_price: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  payment_method: mysqlEnum("payment_method", ["Paystack", "M-Pesa"]).notNull(),
  payment_link: text("payment_link"),
  created_at: timestamp("created_at").defaultNow(),
});

/* =======================
   QUOTE ITEMS
======================= */
export const quoteItems = mysqlTable("quote_items", {
  id: serial("id").primaryKey(),
  quote_id: int("quote_id").notNull(), // FK to quotes.id
  item_name: varchar("item_name", { length: 150 }).notNull(),
  item_price: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
});

/* =======================
   BOOKING SERVICES (M:N)
======================= */
export const bookingServices = mysqlTable("booking_services", {
  id: serial("id").primaryKey(),
  booking_id: int("booking_id").notNull(),
  service_id: int("service_id").notNull(),
});

/* =======================
   AUDIT LOGS
======================= */
export const auditLogs = mysqlTable("audit_logs", {
  id: serial("id").primaryKey(),
  admin_id: int("admin_id").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
