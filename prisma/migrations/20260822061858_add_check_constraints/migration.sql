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
