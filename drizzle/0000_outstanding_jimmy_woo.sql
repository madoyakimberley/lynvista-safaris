CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(150) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('super_admin','admin') NOT NULL DEFAULT 'admin',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_services` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`booking_id` int NOT NULL,
	`service_id` int NOT NULL,
	CONSTRAINT `booking_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`full_name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`phone` varchar(30) NOT NULL,
	`tour_package` varchar(255),
	`flight_type` enum('Domestic Flight','International Flight','None') DEFAULT 'None',
	`departure_city` varchar(100),
	`arrival_city` varchar(100),
	`accommodation_type` enum('Hotel','Resort','Lodge','Camp','Apartment','None') DEFAULT 'None',
	`checkin_date` date,
	`checkout_date` date,
	`travel_start_date` date,
	`travel_end_date` date,
	`adults` int DEFAULT 1,
	`children` int DEFAULT 0,
	`currency` enum('EUR','USD','KES') NOT NULL DEFAULT 'USD',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`user_id` int,
	`payment_status` enum('Pending','Paid','Cancelled') DEFAULT 'Pending',
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon_name` varchar(50) NOT NULL,
	`is_active` int DEFAULT 1,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tour_services` (
	`tour_id` int NOT NULL,
	`service_id` int NOT NULL,
	CONSTRAINT `tour_services_tour_id_service_id_pk` PRIMARY KEY(`tour_id`,`service_id`)
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(150) NOT NULL,
	`slug` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`base_price` decimal(10,2) NOT NULL,
	`duration` varchar(50) NOT NULL,
	`location` varchar(100) NOT NULL,
	`main_image` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `tours_id` PRIMARY KEY(`id`),
	CONSTRAINT `tours_slug_unique` UNIQUE(`slug`)
);
