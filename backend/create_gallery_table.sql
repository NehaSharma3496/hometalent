-- Create gallery table
CREATE TABLE IF NOT EXISTS `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` enum('image','video') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_remarks` text DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `admin_id` (`admin_id`),
  KEY `status` (`status`),
  KEY `sort_order` (`sort_order`),
  CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `gallery_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 