-- Create profile_update_requests table
CREATE TABLE IF NOT EXISTS `profile_update_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendor_id` int(11) NOT NULL,
  `request_data` json NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `admin_remarks` text DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `processed_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendor_id` (`vendor_id`),
  KEY `admin_id` (`admin_id`),
  KEY `status` (`status`),
  CONSTRAINT `profile_update_requests_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profile_update_requests_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 