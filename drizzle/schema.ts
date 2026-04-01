import { mysqlTable, mysqlSchema, AnyMySqlColumn, bigint, varchar, mysqlEnum, timestamp, int, date, text, decimal } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const admins = mysqlTable("admins", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	email: varchar({ length: 150 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	role: mysqlEnum(['super_admin','admin']).default('admin').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const auditLogs = mysqlTable("audit_logs", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	adminId: int("admin_id").notNull(),
	action: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const bookingServices = mysqlTable("booking_services", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	bookingId: int("booking_id").notNull(),
	serviceId: int("service_id").notNull(),
});

export const bookings = mysqlTable("bookings", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	fullName: varchar("full_name", { length: 100 }).notNull(),
	email: varchar({ length: 100 }).notNull(),
	phone: varchar({ length: 30 }).notNull(),
	tourPackage: varchar("tour_package", { length: 255 }),
	flightType: mysqlEnum("flight_type", ['Domestic Flight','International Flight','None']).default('None'),
	departureCity: varchar("departure_city", { length: 100 }),
	arrivalCity: varchar("arrival_city", { length: 100 }),
	accommodationType: mysqlEnum("accommodation_type", ['Hotel','Resort','Lodge','Camp','Apartment','None']).default('None'),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	checkinDate: date("checkin_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	checkoutDate: date("checkout_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	travelStartDate: date("travel_start_date", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	travelEndDate: date("travel_end_date", { mode: 'string' }),
	adults: int().default(1),
	children: int().default(0),
	currency: mysqlEnum(['EUR','USD','KES']).default('USD').notNull(),
	notes: text(),
	quotedPrice: decimal("quoted_price", { precision: 10, scale: 2 }),
	paymentMethod: mysqlEnum("payment_method", ['Stripe','M-Pesa','Paystack']),
	paymentReference: varchar("payment_reference", { length: 255 }),
	paymentLinkSent: mysqlEnum("payment_link_sent", ['Yes','No']).default('No'),
	managedStatus: mysqlEnum("managed_status", ['Pending','Managed']).default('Pending'),
	paymentStatus: mysqlEnum("payment_status", ['Pending','Quotation Sent','Paid','Cancelled']).default('Pending'),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
	userId: int("user_id"),
});

export const quoteItems = mysqlTable("quote_items", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	quoteId: int("quote_id").notNull(),
	itemName: varchar("item_name", { length: 150 }).notNull(),
	itemPrice: decimal("item_price", { precision: 10, scale: 2 }).notNull(),
});

export const quotes = mysqlTable("quotes", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	bookingId: int("booking_id").notNull(),
	totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
	paymentMethod: mysqlEnum("payment_method", ['Paystack','M-Pesa']).notNull(),
	paymentLink: text("payment_link"),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const services = mysqlTable("services", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	iconName: varchar("icon_name", { length: 50 }).notNull(),
	isActive: int("is_active").default(1),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});

export const tourServices = mysqlTable("tour_services", {
	tourId: int("tour_id").notNull(),
	serviceId: int("service_id").notNull(),
});

export const tours = mysqlTable("tours", {
	id: bigint({ mode: "number", unsigned: true }).autoincrement().notNull(),
	title: varchar({ length: 150 }).notNull(),
	slug: varchar({ length: 150 }).notNull(),
	description: text().notNull(),
	basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
	duration: varchar({ length: 50 }).notNull(),
	location: varchar({ length: 100 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('CURRENT_TIMESTAMP'),
});
