-- Update users table to add social media fields and remove video field
ALTER TABLE `users` 
DROP COLUMN `video`,
DROP COLUMN `social_media_link`,
ADD COLUMN `facebook_link` varchar(255) DEFAULT NULL,
ADD COLUMN `instagram_link` varchar(255) DEFAULT NULL,
ADD COLUMN `twitter_link` varchar(255) DEFAULT NULL,
ADD COLUMN `linkedin_link` varchar(255) DEFAULT NULL,
ADD COLUMN `youtube_link` varchar(255) DEFAULT NULL,
ADD COLUMN `website_link` varchar(255) DEFAULT NULL; 