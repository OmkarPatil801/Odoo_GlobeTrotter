-- GlobeTrotter database schema (MySQL 8.0+)
-- Generated from Prisma migrations: prisma/migrations/*/migration.sql
-- This file is a reference export for team members who want to inspect or
-- apply the schema without going through Prisma. The Prisma migrations
-- directory is the source of truth — always run `npx prisma migrate deploy`
-- (or `migrate dev` locally) rather than applying this file directly.

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `country` VARCHAR(100) NULL,
    `profile_image_url` VARCHAR(500) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `region` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `cost_index` INTEGER NULL,
    `popularity_score` INTEGER NOT NULL DEFAULT 0,
    `image_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `cities_name_idx`(`name`),
    INDEX `cities_country_region_idx`(`country`, `region`),
    INDEX `cities_popularity_score_idx`(`popularity_score`),
    INDEX `cities_cost_index_idx`(`cost_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `duration_hours` DECIMAL(5, 2) NULL,
    `cost` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `image_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `activities_city_id_idx`(`city_id`),
    INDEX `activities_category_idx`(`category`),
    INDEX `activities_cost_idx`(`cost`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `cover_image_url` VARCHAR(500) NULL,
    `status` ENUM('PLANNED', 'ONGOING', 'COMPLETED') NOT NULL DEFAULT 'PLANNED',
    `is_public` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `trips_user_id_idx`(`user_id`),
    INDEX `trips_status_idx`(`status`),
    INDEX `trips_start_date_end_date_idx`(`start_date`, `end_date`),
    INDEX `trips_is_public_idx`(`is_public`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_stops` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `stop_order` INTEGER NOT NULL,
    `arrival_date` DATE NULL,
    `departure_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `trip_stops_trip_id_idx`(`trip_id`),
    INDEX `trip_stops_city_id_idx`(`city_id`),
    UNIQUE INDEX `trip_stops_trip_id_stop_order_key`(`trip_id`, `stop_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itinerary_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `activity_id` INTEGER NULL,
    `activity_date` DATE NOT NULL,
    `start_time` TIME NULL,
    `end_time` TIME NULL,
    `item_order` INTEGER NOT NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `itinerary_items_trip_id_activity_date_item_order_idx`(`trip_id`, `activity_date`, `item_order`),
    INDEX `itinerary_items_city_id_idx`(`city_id`),
    INDEX `itinerary_items_activity_id_idx`(`activity_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `category` ENUM('TRANSPORT', 'STAY', 'ACTIVITY', 'MEAL', 'OTHER') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(500) NULL,
    `expense_date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `expenses_trip_id_idx`(`trip_id`),
    INDEX `expenses_category_idx`(`category`),
    INDEX `expenses_trip_id_category_idx`(`trip_id`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saved_destinations` (
    `user_id` INTEGER NOT NULL,
    `city_id` INTEGER NOT NULL,
    `saved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `saved_destinations_city_id_idx`(`city_id`),
    PRIMARY KEY (`user_id`, `city_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `community_posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `trip_id` INTEGER NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `community_posts_user_id_idx`(`user_id`),
    INDEX `community_posts_created_at_idx`(`created_at`),
    INDEX `community_posts_trip_id_idx`(`trip_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_shares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trip_id` INTEGER NOT NULL,
    `share_token` VARCHAR(64) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NULL,

    UNIQUE INDEX `trip_shares_share_token_key`(`share_token`),
    INDEX `trip_shares_trip_id_idx`(`trip_id`),
    INDEX `trip_shares_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activities` ADD CONSTRAINT `activities_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trips` ADD CONSTRAINT `trips_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_stops` ADD CONSTRAINT `trip_stops_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_stops` ADD CONSTRAINT `trip_stops_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_items` ADD CONSTRAINT `itinerary_items_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_items` ADD CONSTRAINT `itinerary_items_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itinerary_items` ADD CONSTRAINT `itinerary_items_activity_id_fkey` FOREIGN KEY (`activity_id`) REFERENCES `activities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_destinations` ADD CONSTRAINT `saved_destinations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saved_destinations` ADD CONSTRAINT `saved_destinations_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_posts` ADD CONSTRAINT `community_posts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `community_posts` ADD CONSTRAINT `community_posts_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_shares` ADD CONSTRAINT `trip_shares_trip_id_fkey` FOREIGN KEY (`trip_id`) REFERENCES `trips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- Data-integrity CHECK constraints not expressible via Prisma's schema syntax.

-- Trips: end date must not precede start date
ALTER TABLE `trips`
  ADD CONSTRAINT `chk_trip_dates` CHECK (`end_date` >= `start_date`);

-- Trip stops: departure must not precede arrival (when both are set)
ALTER TABLE `trip_stops`
  ADD CONSTRAINT `chk_trip_stop_dates` CHECK (`departure_date` IS NULL OR `arrival_date` IS NULL OR `departure_date` >= `arrival_date`);

-- Itinerary items: end time must not precede start time (when both are set)
ALTER TABLE `itinerary_items`
  ADD CONSTRAINT `chk_itinerary_item_times` CHECK (`end_time` IS NULL OR `start_time` IS NULL OR `end_time` >= `start_time`);

-- Activities: cost and duration cannot be negative
ALTER TABLE `activities`
  ADD CONSTRAINT `chk_activity_cost` CHECK (`cost` >= 0);
ALTER TABLE `activities`
  ADD CONSTRAINT `chk_activity_duration` CHECK (`duration_hours` IS NULL OR `duration_hours` >= 0);

-- Expenses: amount cannot be negative
ALTER TABLE `expenses`
  ADD CONSTRAINT `chk_expense_amount` CHECK (`amount` >= 0);

-- Cities: popularity score and cost index cannot be negative
ALTER TABLE `cities`
  ADD CONSTRAINT `chk_city_popularity` CHECK (`popularity_score` >= 0);
ALTER TABLE `cities`
  ADD CONSTRAINT `chk_city_cost_index` CHECK (`cost_index` IS NULL OR `cost_index` >= 0);
