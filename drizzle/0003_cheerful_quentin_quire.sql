CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`image_url` text,
	`author` varchar(100) DEFAULT 'Lynvista Team',
	`published` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `quotes` MODIFY COLUMN `payment_method` enum('Paystack','M-Pesa','Card','Bank Transfer') NOT NULL;