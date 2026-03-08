import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  decimal,
  timestamp,
  datetime,
  date,
  mysqlEnum,
  primaryKey,
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
  is_active: int("is_active").default(1), // tinyint(1)
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
  ]),

  departure_city: varchar("departure_city", { length: 100 }),
  arrival_city: varchar("arrival_city", { length: 100 }),

  accommodation_type: mysqlEnum("accommodation_type", [
    "Hotel",
    "Resort",
    "Lodge",
    "Camp",
    "Apartment",
  ]),

  checkin_date: date("checkin_date"),
  checkout_date: date("checkout_date"),
  travel_start_date: date("travel_start_date"),
  travel_end_date: date("travel_end_date"),

  travelers: int("travelers").default(1),

  currency: mysqlEnum("currency", ["EUR", "USD", "KES"]).notNull(),

  notes: text("notes"),

  created_at: timestamp("created_at").defaultNow(),

  user_id: int("user_id"),

  payment_status: mysqlEnum("payment_status", [
    "Pending",
    "Paid",
    "Cancelled",
  ]).default("Pending"),
});

/* =======================
   BOOKING SERVICES
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
