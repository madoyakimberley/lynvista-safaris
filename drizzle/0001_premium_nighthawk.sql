CREATE TABLE `quote_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quote_id` int NOT NULL,
	`item_name` varchar(150) NOT NULL,
	`item_price` decimal(10,2) NOT NULL,
	CONSTRAINT `quote_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`payment_method` enum('Paystack','M-Pesa') NOT NULL,
	`payment_link` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admins` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `audit_logs` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `booking_services` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `flight_type` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `departure_city` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `arrival_city` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `accommodation_type` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` MODIFY COLUMN `payment_status` enum('Pending','Quotation Sent','Awaiting Verification','Paid','Cancelled') DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE `services` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `tours` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `bookings` ADD `admin_notes` text;--> statement-breakpoint
ALTER TABLE `bookings` ADD `quoted_price` decimal(10,2);--> statement-breakpoint
ALTER TABLE `bookings` ADD `payment_method` enum('Bank Transfer','M-Pesa','Cash','Other') DEFAULT 'Bank Transfer';--> statement-breakpoint
ALTER TABLE `bookings` ADD `payment_reference` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` ADD `payment_proof_url` varchar(500);--> statement-breakpoint
ALTER TABLE `bookings` ADD `payment_link_sent` enum('Yes','No') DEFAULT 'No';--> statement-breakpoint
ALTER TABLE `bookings` ADD `managed_status` enum('Pending','Managed') DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE `tours` ADD `image` varchar(255);--> statement-breakpoint
ALTER TABLE `bookings` DROP COLUMN `checkin_date`;--> statement-breakpoint
ALTER TABLE `bookings` DROP COLUMN `checkout_date`;--> statement-breakpoint
ALTER TABLE `tours` DROP COLUMN `main_image`;