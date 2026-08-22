-- Adds global-travel fields to `cities` (country_code, latitude, longitude, timezone)
-- and currency fields to `activities`/`expenses`. Columns are added nullable,
-- backfilled for existing seed rows, then tightened to NOT NULL, since the
-- tables already contain data (a plain "ADD COLUMN ... NOT NULL" without a
-- default is rejected by MySQL 8 strict mode on non-empty tables).

-- Step 1: add columns nullable
ALTER TABLE `cities`
  ADD COLUMN `country_code` CHAR(2) NULL,
  ADD COLUMN `latitude` DECIMAL(9, 6) NULL,
  ADD COLUMN `longitude` DECIMAL(9, 6) NULL,
  ADD COLUMN `timezone` VARCHAR(64) NULL;

ALTER TABLE `activities`
  ADD COLUMN `currency_code` CHAR(3) NULL;

ALTER TABLE `expenses`
  ADD COLUMN `currency_code` CHAR(3) NULL;

-- Step 2: backfill existing cities (name is unique among the seeded rows)
UPDATE `cities` SET `country_code` = 'FR', `latitude` = 48.856613, `longitude` = 2.352222,    `timezone` = 'Europe/Paris'       WHERE `name` = 'Paris';
UPDATE `cities` SET `country_code` = 'GB', `latitude` = 51.507351, `longitude` = -0.127758,   `timezone` = 'Europe/London'      WHERE `name` = 'London';
UPDATE `cities` SET `country_code` = 'NL', `latitude` = 52.367573, `longitude` = 4.904139,    `timezone` = 'Europe/Amsterdam'   WHERE `name` = 'Amsterdam';
UPDATE `cities` SET `country_code` = 'AE', `latitude` = 25.204849, `longitude` = 55.270782,   `timezone` = 'Asia/Dubai'         WHERE `name` = 'Dubai';
UPDATE `cities` SET `country_code` = 'JP', `latitude` = 35.689487, `longitude` = 139.691711,  `timezone` = 'Asia/Tokyo'         WHERE `name` = 'Tokyo';
UPDATE `cities` SET `country_code` = 'IN', `latitude` = 19.075983, `longitude` = 72.877655,   `timezone` = 'Asia/Kolkata'       WHERE `name` = 'Mumbai';
UPDATE `cities` SET `country_code` = 'IN', `latitude` = 15.299326, `longitude` = 74.123993,   `timezone` = 'Asia/Kolkata'       WHERE `name` = 'Goa';
UPDATE `cities` SET `country_code` = 'IN', `latitude` = 28.613939, `longitude` = 77.209023,   `timezone` = 'Asia/Kolkata'       WHERE `name` = 'Delhi';
UPDATE `cities` SET `country_code` = 'SG', `latitude` = 1.352083,  `longitude` = 103.819839,  `timezone` = 'Asia/Singapore'     WHERE `name` = 'Singapore';
UPDATE `cities` SET `country_code` = 'ID', `latitude` = -8.340539, `longitude` = 115.091949,  `timezone` = 'Asia/Makassar'      WHERE `name` = 'Bali';
UPDATE `cities` SET `country_code` = 'US', `latitude` = 40.712776, `longitude` = -74.005974,  `timezone` = 'America/New_York'   WHERE `name` = 'New York';
UPDATE `cities` SET `country_code` = 'IT', `latitude` = 41.902782, `longitude` = 12.496366,   `timezone` = 'Europe/Rome'        WHERE `name` = 'Rome';

-- Step 3: backfill activity currency from its city's currency
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'EUR' WHERE c.`name` = 'Paris';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'GBP' WHERE c.`name` = 'London';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'EUR' WHERE c.`name` = 'Amsterdam';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'AED' WHERE c.`name` = 'Dubai';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'JPY' WHERE c.`name` = 'Tokyo';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'INR' WHERE c.`name` = 'Mumbai';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'INR' WHERE c.`name` = 'Goa';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'INR' WHERE c.`name` = 'Delhi';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'SGD' WHERE c.`name` = 'Singapore';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'IDR' WHERE c.`name` = 'Bali';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'USD' WHERE c.`name` = 'New York';
UPDATE `activities` a JOIN `cities` c ON a.`city_id` = c.`id` SET a.`currency_code` = 'EUR' WHERE c.`name` = 'Rome';

-- Step 4: backfill expenses (demo trip tracked in the traveler's home currency)
UPDATE `expenses` SET `currency_code` = 'INR';

-- Step 5: enforce NOT NULL now that every row has a value
ALTER TABLE `cities`
  MODIFY `country_code` CHAR(2) NOT NULL,
  MODIFY `latitude` DECIMAL(9, 6) NOT NULL,
  MODIFY `longitude` DECIMAL(9, 6) NOT NULL,
  MODIFY `timezone` VARCHAR(64) NOT NULL;

ALTER TABLE `activities`
  MODIFY `currency_code` CHAR(3) NOT NULL;

ALTER TABLE `expenses`
  MODIFY `currency_code` CHAR(3) NOT NULL;

-- Step 6: supporting index
CREATE INDEX `cities_country_code_idx` ON `cities`(`country_code`);
