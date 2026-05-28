CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`subject` varchar(150) NOT NULL,
	`message` text NOT NULL,
	`status` enum('Pending','Reviewed','Archived') DEFAULT 'Pending',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
