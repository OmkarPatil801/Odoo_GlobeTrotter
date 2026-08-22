-- GlobeTrotter reference seed data (MySQL 8.0+)
-- This is a raw-SQL export of the data produced by `npm run db:seed`
-- (prisma/seed.ts), included for reference and for teammates who prefer to
-- load data without running Node/Prisma. The seed script (prisma/seed.ts)
-- is the source of truth and is idempotent (safe to re-run).
--
-- IDs shown here are illustrative; auto-increment values will differ on a
-- fresh database. Demo password hashes are bcrypt hashes of:
--   admin@globetrotter.app -> Admin@123
--   demo@globetrotter.app  -> Demo@123
--
-- City coordinates/timezones use IANA identifiers (e.g. Asia/Kolkata,
-- Europe/Paris, Asia/Makassar for Bali). Activity/expense currencyCode
-- values are ISO-style 3-letter codes (EUR, GBP, USD, INR, JPY, AED,
-- SGD, IDR) — plain strings, not a DB enum, so new currencies never
-- require a schema migration.

--
-- Host: localhost    Database: globetrotter
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `phone`, `country`, `profile_image_url`, `role`, `created_at`, `updated_at`) VALUES (1,'GlobeTrotter Admin','admin@globetrotter.app','$2b$10$WbWt9YWOVb86g1lXQre3COy5cfdkKYzj4A/jwMUiL0TaNdtk9kQZK',NULL,'India',NULL,'ADMIN','2026-08-22 06:20:58.705','2026-08-22 06:20:58.705'),(2,'Demo Traveler','demo@globetrotter.app','$2b$10$GHlXVv/KDLUBGbCFJNNuL.3MI3Gt7lvAh3hd4GMRfWWj2EL1ALOIW','+91-9876543210','India',NULL,'USER','2026-08-22 06:20:58.737','2026-08-22 06:20:58.737');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` (`id`, `name`, `country`, `region`, `description`, `cost_index`, `popularity_score`, `image_url`, `created_at`, `updated_at`, `country_code`, `latitude`, `longitude`, `timezone`) VALUES (1,'Paris','France','Europe','The City of Light, famed for art, fashion and cuisine.',85,98,'https://images.example.com/cities/paris.jpg','2026-08-22 06:20:58.746','2026-08-22 06:20:58.746','FR',48.856613,2.352222,'Europe/Paris'),(2,'London','United Kingdom','Europe','Historic capital blending royal heritage and modern culture.',90,95,'https://images.example.com/cities/london.jpg','2026-08-22 06:20:58.785','2026-08-22 06:20:58.785','GB',51.507351,-0.127758,'Europe/London'),(3,'Amsterdam','Netherlands','Europe','Canal city known for art, cycling and nightlife.',80,88,'https://images.example.com/cities/amsterdam.jpg','2026-08-22 06:20:58.831','2026-08-22 06:20:58.831','NL',52.367573,4.904139,'Europe/Amsterdam'),(4,'Dubai','United Arab Emirates','Middle East','Futuristic skyline, desert adventures and luxury shopping.',88,90,'https://images.example.com/cities/dubai.jpg','2026-08-22 06:20:58.874','2026-08-22 06:20:58.874','AE',25.204849,55.270782,'Asia/Dubai'),(5,'Tokyo','Japan','Asia','Ultra-modern metropolis with deep traditional roots.',82,93,'https://images.example.com/cities/tokyo.jpg','2026-08-22 06:20:58.905','2026-08-22 06:20:58.905','JP',35.689487,139.691711,'Asia/Tokyo'),(6,'Mumbai','India','Asia','India\'s financial capital, vibrant and fast-paced.',45,78,'https://images.example.com/cities/mumbai.jpg','2026-08-22 06:20:58.953','2026-08-22 06:20:58.953','IN',19.075983,72.877655,'Asia/Kolkata'),(7,'Goa','India','Asia','Coastal paradise known for beaches and nightlife.',35,85,'https://images.example.com/cities/goa.jpg','2026-08-22 06:20:59.068','2026-08-22 06:20:59.068','IN',15.299326,74.123993,'Asia/Kolkata'),(8,'Delhi','India','Asia','India\'s capital, rich in Mughal and colonial history.',40,80,'https://images.example.com/cities/delhi.jpg','2026-08-22 06:20:59.106','2026-08-22 06:20:59.106','IN',28.613939,77.209023,'Asia/Kolkata'),(9,'Singapore','Singapore','Asia','Compact city-state famed for food and futuristic gardens.',87,89,'https://images.example.com/cities/singapore.jpg','2026-08-22 06:20:59.151','2026-08-22 06:20:59.151','SG',1.352083,103.819839,'Asia/Singapore'),(10,'Bali','Indonesia','Asia','Tropical island of temples, rice terraces and surf.',42,91,'https://images.example.com/cities/bali.jpg','2026-08-22 06:20:59.189','2026-08-22 06:20:59.189','ID',-8.340539,115.091949,'Asia/Makassar'),(11,'New York','United States','North America','The city that never sleeps, a global hub of culture.',95,96,'https://images.example.com/cities/new-york.jpg','2026-08-22 06:20:59.224','2026-08-22 06:20:59.224','US',40.712776,-74.005974,'America/New_York'),(12,'Rome','Italy','Europe','The Eternal City, cradle of the Roman Empire.',78,94,'https://images.example.com/cities/rome.jpg','2026-08-22 06:20:59.264','2026-08-22 06:20:59.264','IT',41.902782,12.496366,'Europe/Rome');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` (`id`, `city_id`, `name`, `category`, `description`, `duration_hours`, `cost`, `image_url`, `created_at`, `updated_at`, `currency_code`) VALUES (2,1,'Louvre Museum','Museum','World\'s largest art museum, home to the Mona Lisa.',3.00,22.00,'https://images.example.com/activities/louvre.jpg','2026-08-22 06:20:58.761','2026-08-22 06:20:58.761','EUR'),(3,1,'Seine River Cruise','Sightseeing','Scenic boat cruise along the Seine.',1.50,18.00,'https://images.example.com/activities/seine-cruise.jpg','2026-08-22 06:20:58.771','2026-08-22 06:20:58.771','EUR'),(4,1,'Montmartre Walking Tour','Tour','Explore the historic artists\' quarter.',2.50,25.00,'https://images.example.com/activities/montmartre.jpg','2026-08-22 06:20:58.776','2026-08-22 06:20:58.776','EUR'),(5,2,'Big Ben & Westminster','Sightseeing','Iconic clock tower and Houses of Parliament.',1.50,0.00,'https://images.example.com/activities/big-ben.jpg','2026-08-22 06:20:58.795','2026-08-22 06:20:58.795','GBP'),(6,2,'British Museum','Museum','World history and culture under one roof.',3.00,0.00,'https://images.example.com/activities/british-museum.jpg','2026-08-22 06:20:58.803','2026-08-22 06:20:58.803','GBP'),(7,2,'London Eye','Sightseeing','Giant observation wheel on the South Bank.',1.00,35.00,'https://images.example.com/activities/london-eye.jpg','2026-08-22 06:20:58.812','2026-08-22 06:20:58.812','GBP'),(8,2,'West End Show','Entertainment','World-class theatre performance.',2.50,65.00,'https://images.example.com/activities/west-end.jpg','2026-08-22 06:20:58.821','2026-08-22 06:20:58.821','GBP'),(9,3,'Canal Cruise','Sightseeing','Tour the historic canal ring by boat.',1.00,20.00,'https://images.example.com/activities/canal-cruise.jpg','2026-08-22 06:20:58.838','2026-08-22 06:20:58.838','EUR'),(10,3,'Van Gogh Museum','Museum','Largest collection of Van Gogh\'s work.',2.00,20.00,'https://images.example.com/activities/van-gogh.jpg','2026-08-22 06:20:58.845','2026-08-22 06:20:58.845','EUR'),(11,3,'Anne Frank House','Museum','Historic house and biographical museum.',1.50,16.00,'https://images.example.com/activities/anne-frank.jpg','2026-08-22 06:20:58.867','2026-08-22 06:20:58.867','EUR'),(12,4,'Burj Khalifa Observation Deck','Sightseeing','Views from the world\'s tallest building.',1.50,45.00,'https://images.example.com/activities/burj-khalifa.jpg','2026-08-22 06:20:58.882','2026-08-22 06:20:58.882','AED'),(13,4,'Desert Safari','Adventure','Dune bashing, camel rides and BBQ dinner.',5.00,60.00,'https://images.example.com/activities/desert-safari.jpg','2026-08-22 06:20:58.888','2026-08-22 06:20:58.888','AED'),(14,4,'Dubai Mall & Fountain Show','Shopping','Shopping and the iconic fountain show.',3.00,0.00,'https://images.example.com/activities/dubai-mall.jpg','2026-08-22 06:20:58.898','2026-08-22 06:20:58.898','AED'),(15,5,'Senso-ji Temple','Sightseeing','Tokyo\'s oldest Buddhist temple.',1.50,0.00,'https://images.example.com/activities/sensoji.jpg','2026-08-22 06:20:58.914','2026-08-22 06:20:58.914','JPY'),(16,5,'Shibuya Crossing & Shopping','Shopping','World\'s busiest pedestrian crossing.',2.00,0.00,'https://images.example.com/activities/shibuya.jpg','2026-08-22 06:20:58.924','2026-08-22 06:20:58.924','JPY'),(17,5,'Tsukiji Outer Market Food Tour','Food','Sample the freshest sushi and street food.',2.50,40.00,'https://images.example.com/activities/tsukiji.jpg','2026-08-22 06:20:58.933','2026-08-22 06:20:58.933','JPY'),(18,5,'TeamLab Digital Art Museum','Museum','Immersive digital art installations.',3.00,30.00,'https://images.example.com/activities/teamlab.jpg','2026-08-22 06:20:58.944','2026-08-22 06:20:58.944','JPY'),(19,6,'Gateway of India','Sightseeing','Iconic colonial-era monument by the sea.',1.00,0.00,'https://images.example.com/activities/gateway-of-india.jpg','2026-08-22 06:20:58.977','2026-08-22 06:20:58.977','INR'),(20,6,'Elephanta Caves Ferry','Tour','Ancient rock-cut caves on Elephanta Island.',4.00,15.00,'https://images.example.com/activities/elephanta.jpg','2026-08-22 06:20:59.021','2026-08-22 06:20:59.021','INR'),(21,6,'Marine Drive Walk','Sightseeing','Scenic promenade along the Arabian Sea.',1.50,0.00,'https://images.example.com/activities/marine-drive.jpg','2026-08-22 06:20:59.051','2026-08-22 06:20:59.051','INR'),(22,7,'Baga Beach','Beach','Popular beach with water sports and shacks.',3.00,0.00,'https://images.example.com/activities/baga-beach.jpg','2026-08-22 06:20:59.075','2026-08-22 06:20:59.075','INR'),(23,7,'Fort Aguada','Sightseeing','17th-century Portuguese fort with lighthouse.',1.50,5.00,'https://images.example.com/activities/fort-aguada.jpg','2026-08-22 06:20:59.083','2026-08-22 06:20:59.083','INR'),(24,7,'Spice Plantation Tour','Tour','Guided walk through a working spice farm.',2.50,12.00,'https://images.example.com/activities/spice-plantation.jpg','2026-08-22 06:20:59.089','2026-08-22 06:20:59.089','INR'),(25,8,'Red Fort','Sightseeing','Historic Mughal fortress complex.',2.00,6.00,'https://images.example.com/activities/red-fort.jpg','2026-08-22 06:20:59.115','2026-08-22 06:20:59.115','INR'),(26,8,'India Gate','Sightseeing','War memorial and popular gathering spot.',1.00,0.00,'https://images.example.com/activities/india-gate.jpg','2026-08-22 06:20:59.126','2026-08-22 06:20:59.126','INR'),(27,8,'Qutub Minar','Sightseeing','Tallest brick minaret in the world.',1.50,5.00,'https://images.example.com/activities/qutub-minar.jpg','2026-08-22 06:20:59.134','2026-08-22 06:20:59.134','INR'),(28,9,'Gardens by the Bay','Sightseeing','Futuristic Supertree gardens and domes.',2.50,28.00,'https://images.example.com/activities/gardens-by-the-bay.jpg','2026-08-22 06:20:59.156','2026-08-22 06:20:59.156','SGD'),(29,9,'Sentosa Island','Adventure','Beaches, theme parks and attractions.',4.00,40.00,'https://images.example.com/activities/sentosa.jpg','2026-08-22 06:20:59.162','2026-08-22 06:20:59.162','SGD'),(30,9,'Hawker Centre Food Tour','Food','Taste iconic street food at local hawker stalls.',2.00,20.00,'https://images.example.com/activities/hawker-centre.jpg','2026-08-22 06:20:59.183','2026-08-22 06:20:59.183','SGD'),(31,10,'Tanah Lot Temple','Sightseeing','Iconic sea temple on a rock formation.',1.50,10.00,'https://images.example.com/activities/tanah-lot.jpg','2026-08-22 06:20:59.195','2026-08-22 06:20:59.195','IDR'),(32,10,'Ubud Rice Terraces','Nature','Scenic terraced rice paddies.',2.00,5.00,'https://images.example.com/activities/ubud-terraces.jpg','2026-08-22 06:20:59.213','2026-08-22 06:20:59.213','IDR'),(33,10,'Uluwatu Sunset & Kecak Dance','Entertainment','Clifftop temple with traditional dance performance.',3.00,15.00,'https://images.example.com/activities/uluwatu.jpg','2026-08-22 06:20:59.219','2026-08-22 06:20:59.219','IDR'),(34,11,'Statue of Liberty & Ellis Island','Sightseeing','Ferry tour to America\'s iconic statue.',3.00,24.00,'https://images.example.com/activities/statue-of-liberty.jpg','2026-08-22 06:20:59.229','2026-08-22 06:20:59.229','USD'),(35,11,'Central Park Walk','Nature','Iconic urban park in the heart of Manhattan.',2.00,0.00,'https://images.example.com/activities/central-park.jpg','2026-08-22 06:20:59.236','2026-08-22 06:20:59.236','USD'),(36,11,'Broadway Show','Entertainment','World-renowned live theatre.',2.50,120.00,'https://images.example.com/activities/broadway.jpg','2026-08-22 06:20:59.253','2026-08-22 06:20:59.253','USD'),(37,11,'Empire State Building','Sightseeing','Art Deco skyscraper with observation deck.',1.50,44.00,'https://images.example.com/activities/empire-state.jpg','2026-08-22 06:20:59.259','2026-08-22 06:20:59.259','USD'),(38,12,'Colosseum Tour','Sightseeing','Ancient Roman amphitheatre.',2.00,24.00,'https://images.example.com/activities/colosseum.jpg','2026-08-22 06:20:59.271','2026-08-22 06:20:59.271','EUR'),(39,12,'Vatican Museums & Sistine Chapel','Museum','Renaissance art and Michelangelo\'s masterpiece.',3.00,30.00,'https://images.example.com/activities/vatican.jpg','2026-08-22 06:20:59.278','2026-08-22 06:20:59.278','EUR'),(40,12,'Trevi Fountain','Sightseeing','Baroque fountain, the largest in Rome.',0.50,0.00,'https://images.example.com/activities/trevi-fountain.jpg','2026-08-22 06:20:59.283','2026-08-22 06:20:59.283','EUR'),(41,1,'Eiffel Tower Visit','Sightseeing','Iconic iron tower with city views.',2.00,30.00,'https://images.example.com/activities/eiffel-tower.jpg','2026-08-22 06:21:56.237','2026-08-22 06:21:56.237','EUR');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` (`id`, `user_id`, `name`, `description`, `start_date`, `end_date`, `cover_image_url`, `status`, `is_public`, `created_at`, `updated_at`) VALUES (2,2,'European Adventure','A whirlwind tour through Paris, London and Amsterdam.','2026-09-12','2026-09-16','https://images.example.com/trips/european-adventure.jpg','PLANNED',1,'2026-08-22 06:21:56.361','2026-08-22 06:21:56.361');
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `trip_stops`
--

LOCK TABLES `trip_stops` WRITE;
/*!40000 ALTER TABLE `trip_stops` DISABLE KEYS */;
INSERT INTO `trip_stops` (`id`, `trip_id`, `city_id`, `stop_order`, `arrival_date`, `departure_date`, `notes`, `created_at`, `updated_at`) VALUES (5,2,1,1,'2026-09-12','2026-09-14','Stay near the Marais district.','2026-08-22 06:21:56.372','2026-08-22 06:21:56.372'),(6,2,2,2,'2026-09-14','2026-09-15','Eurostar from Paris.','2026-08-22 06:21:56.379','2026-08-22 06:21:56.379'),(7,2,3,3,'2026-09-15','2026-09-16','Short flight from London.','2026-08-22 06:21:56.386','2026-08-22 06:21:56.386');
/*!40000 ALTER TABLE `trip_stops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `itinerary_items`
--

LOCK TABLES `itinerary_items` WRITE;
/*!40000 ALTER TABLE `itinerary_items` DISABLE KEYS */;
INSERT INTO `itinerary_items` (`id`, `trip_id`, `city_id`, `activity_id`, `activity_date`, `start_time`, `end_time`, `item_order`, `notes`, `created_at`, `updated_at`) VALUES (5,2,1,41,'2026-09-12','09:00:00',NULL,1,NULL,'2026-08-22 06:21:56.395','2026-08-22 06:21:56.395'),(6,2,1,2,'2026-09-12','13:00:00',NULL,2,NULL,'2026-08-22 06:21:56.402','2026-08-22 06:21:56.402'),(7,2,1,3,'2026-09-13','18:00:00',NULL,1,NULL,'2026-08-22 06:21:56.409','2026-08-22 06:21:56.409'),(8,2,2,5,'2026-09-14','10:00:00',NULL,1,NULL,'2026-08-22 06:21:56.418','2026-08-22 06:21:56.418');
/*!40000 ALTER TABLE `itinerary_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` (`id`, `trip_id`, `category`, `amount`, `description`, `expense_date`, `created_at`, `updated_at`, `currency_code`) VALUES (5,2,'TRANSPORT',10000.00,'Flights and Eurostar tickets','2026-09-12','2026-08-22 06:21:56.429','2026-08-22 06:21:56.429','INR'),(6,2,'STAY',25000.00,'Hotels in Paris, London, Amsterdam','2026-09-12','2026-08-22 06:21:56.429','2026-08-22 06:21:56.429','INR'),(7,2,'ACTIVITY',8000.00,'Museum and attraction tickets','2026-09-13','2026-08-22 06:21:56.429','2026-08-22 06:21:56.429','INR'),(8,2,'MEAL',5000.00,'Meals across all three cities','2026-09-14','2026-08-22 06:21:56.429','2026-08-22 06:21:56.429','INR');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `saved_destinations`
--

LOCK TABLES `saved_destinations` WRITE;
/*!40000 ALTER TABLE `saved_destinations` DISABLE KEYS */;
INSERT INTO `saved_destinations` (`user_id`, `city_id`, `saved_at`) VALUES (2,5,'2026-08-22 06:20:59.426');
/*!40000 ALTER TABLE `saved_destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `community_posts`
--

LOCK TABLES `community_posts` WRITE;
/*!40000 ALTER TABLE `community_posts` DISABLE KEYS */;
INSERT INTO `community_posts` (`id`, `user_id`, `trip_id`, `title`, `content`, `image_url`, `created_at`, `updated_at`) VALUES (1,2,NULL,'3 Days That Changed How I See Europe','Paris, London and Amsterdam in one trip — here\'s how I planned it and what I\'d do differently.','https://images.example.com/community/european-adventure-post.jpg','2026-08-22 06:20:59.439','2026-08-22 06:20:59.439');
/*!40000 ALTER TABLE `community_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `trip_shares`
--

LOCK TABLES `trip_shares` WRITE;
/*!40000 ALTER TABLE `trip_shares` DISABLE KEYS */;
INSERT INTO `trip_shares` (`id`, `trip_id`, `share_token`, `is_active`, `created_at`, `expires_at`) VALUES (2,2,'3d75d810c3c54336c08bfed51bb600592cb4d7e448a9c38d',1,'2026-08-22 06:21:56.457',NULL);
/*!40000 ALTER TABLE `trip_shares` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-22 13:09:08
