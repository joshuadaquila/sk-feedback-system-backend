-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: feedbacksystem
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcementId` int NOT NULL AUTO_INCREMENT,
  `audience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'All',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`announcementId`),
  KEY `fk_userId` (`userId`),
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (26,'ALL','2024-12-13 03:44:21','Monthly Meeting','Our next Monthly Meeting will be held on Wednesday, December 18th, 2024, at 10:00 AM. During the meeting, we will review key updates, discuss goals for the upcoming month, and address any important matters.','active',3),(37,'ALL','2024-12-17 01:48:48','Symposium','We are excited to announce an upcoming symposium focused on \"Mental Health and Well-Being in the Workplace,\" taking place on February 10, 2024, at Barangay Hall.','active',3);
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventId` int NOT NULL AUTO_INCREMENT,
  `eventName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int NOT NULL,
  `place` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  PRIMARY KEY (`eventId`),
  KEY `userId` (`userId`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (6,'Mental Health Day','Join us!','2024-12-11 13:38:35',3,'Barangay Hall','active','2024-10-09 09:20:00','2024-10-09 12:40:00'),(7,'Year-End Party','Join us!','2024-12-12 06:33:58',3,'Plaza','active','2024-12-12 14:33:00','2024-12-12 14:33:00'),(14,'Youth Empowerment Forum','Join us!','2024-12-17 15:33:14',3,'Barangay Plaza','active','2024-12-09 07:30:00','2024-12-09 10:30:00'),(18,'Sample','Join us!','2024-12-18 22:49:27',3,'Culasi','active','2024-12-19 07:49:00','2024-12-19 08:49:00'),(26,'asdfghj','xcvbn','2025-02-21 02:45:39',3,'wer','active','2025-02-21 10:45:00','2025-02-21 11:45:00'),(27,'Assembly Meeting','All youth','2025-02-24 05:25:24',3,'Plaza','active','2025-02-24 13:25:00','2025-02-24 17:25:00'),(28,'Zumba sa Plaza','Sample description','2025-02-24 05:26:30',3,'Plaza','active','2025-02-28 13:26:00','2025-02-28 17:26:00');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `feedbackId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `eventId` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`feedbackId`),
  KEY `userId` (`userId`),
  KEY `eventId` (`eventId`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (2,2,6,'The event was informative, but it didn’t spark much interest. It was a bit too generic.','2024-12-11 13:40:34','active'),(3,4,6,'It wasn’t bad, but it didn’t leave me feeling particularly inspired or engaged.','2024-12-11 13:43:09','active'),(4,5,6,'The leadership summit exceeded my expectations. From the meticulously planned agenda to the inspirational keynote speakers, every detail was thoughtfully executed. I particularly appreciated the interactive breakout sessions, which provided valuable networking opportunities and practical insights. ','2024-12-11 14:30:20','active'),(5,6,6,'The community meeting was frustrating!. The discussions were dominated by a few individuals, leaving little room for diverse opinions. Additionally, the proposed solutions lacked feasibility, which left many attendees feeling unheard.','2024-12-11 14:34:38','active'),(16,8,6,'This event could have been more effective if it offered clear structure and more focused resources or workshops on mental health support.','2024-12-15 12:20:56','active'),(19,9,6,'The activities were engaging and informative. Thank you for organizing such a meaningful event it truly made a positive difference.','2024-12-17 01:26:44','active'),(20,2,6,'The event was so refreshing to take back from the usual hustle and focus on our mental health in a such supportive and welcoming environment.','2024-12-17 01:30:26','active'),(21,10,6,'It was an incredibly thoughtful and impactful experience that provided valuable insights into the importance of self-care and well being.','2024-12-17 01:33:04','active'),(22,2,14,'I had a wonderful experience attending the Youth Forum. The sessions were incredibly informative, and i felt genuinely inspired by the speakers.','2024-12-17 15:41:14','active'),(23,10,14,'The speakers were knowledgeable, and i did learn some new things. However, the event could have been more interactive.','2024-12-17 15:43:19','active'),(26,4,14,'The speakers appeared unprepared, and the discussions lacked depth!.','2024-12-17 15:48:38','active'),(27,9,14,'The venue was overcrowded, which made it difficult to focus or participate.','2024-12-17 15:50:11','active'),(28,7,14,'Overall, it was a decent expert but there is a room for improvement in terms of engagement and flow.','2024-12-17 15:51:46','active'),(29,2,7,'This event is a trash!','2024-12-18 05:02:40','active'),(30,8,14,'This forum is very informative, the content was very relevant and helped me a lot.','2024-12-18 05:22:38','active'),(31,5,14,'The event was fine. The speaker\'s talk was interesting, but the event felt a bit rushed overall.','2024-12-18 05:26:52','active'),(32,2,18,'This event is a trash.','2024-12-19 01:06:24','active'),(33,2,26,'This event is just okay.','2025-02-21 03:02:07','active'),(34,2,26,'trash','2025-02-21 03:06:22','active'),(35,2,26,'Excellent ','2025-02-21 03:10:24','active'),(36,2,27,'This event is a trash.','2025-02-24 06:51:17','active'),(37,11,27,'This event is just okay.','2025-02-24 06:54:39','active');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notificationId` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`notificationId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (4,'{\"en\":\"Zumba sa Plaza\"}','event'),(5,'{\"en\":\"Youth Empowerment Forum\"}','event'),(6,'{\"en\":\"Cleaning\"}','event'),(9,'{\"en\":\"Sample\"}','event'),(10,'{\"en\":\"Sample\"}','event'),(11,'{\"en\":\"Training\"}','event'),(12,'{\"en\":\"Training V1\"}','event'),(13,'{\"en\":\"Sample Event\"}','event'),(14,'{\"en\":\"sdfghjk\"}','event'),(15,'{\"en\":\"cvbn\"}','event'),(16,'{\"en\":\"xcvbn\"}','event'),(17,'{\"en\":\"asdfghj\"}','event'),(18,'{\"en\":\"Assembly Meeting\"}','event'),(19,'{\"en\":\"Zumba sa Plaza\"}','event'),(20,'{\"en\":\"Coastal Clean Up\"}','event'),(21,'{\"en\":\"Sample Event\"}','event');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `middleName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `extensionName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date NOT NULL,
  `purok` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `civilStatus` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userType` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `educationBackground` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `lastLogin` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Jayrose ','Sale','Lignig','','2002-01-24','1','Single','jayroselignig','male','user','$2b$10$JZ/OytNAJF.iKkba0UwsVuDpddA4Unpb2XV3iNea2HHdiRTd1Tf3i','2024-12-01 07:02:28','active','College Graduate','2025-02-25 05:26:29'),(3,'Jayrose ','Sale','Lignig','','2002-01-24','4','Single','adminJayrose','male','admin','$2b$10$j7E1tCyR3q9n3HKfLFb.fezbMb3YcSnSJ9nSeCQ/VY1g6loKe4IOm','2024-12-01 07:05:26','active','College Level','2025-02-27 13:45:24'),(4,'Fritz','Mondejar','Gerald','','2024-12-11','2','single','fritzmondejar','male','user','$2b$10$sEMM8Y7Es7UxD6hFGpbqWOh058R4aivvjkRPKMGeYsa2C9Bwo3s2u','2024-12-11 13:17:44','active','College Level',NULL),(5,'Hanna','Abao','Yumira','','2024-12-08','3','single','hannaabao','female','user','$2b$10$CT.6AV9OXRGaYoig2YP3tuaGADOswzaa7XuAYKIHbbx9RjQoXpXi6','2024-12-11 14:26:22','active','College Level',NULL),(6,'Arielle','Lignig','Jade','','2024-11-11','4','single','ariellejade','female','user','$2b$10$veoinU0NY0SYw65lNvYK4.AiG5ASAoljAm7lhM9ZpTp8DUPUyuG2m','2024-12-11 14:32:16','active','High School Level',NULL),(7,'Jerry Mae','Sale','Lignig ','','2002-08-22','2','single','jerrymae','female','user','$2b$10$C4tl36qVX.86tbpkWmXe3OAcbDpwURs1l62h6Pkvc/gw/XSX6bDRS','2024-12-15 12:14:49','active','College Graduate',NULL),(8,'Jerens Marie','Sale','Lignig','','2006-01-03','4','single','jerensmarie','female','user','$2b$10$ydTaoJ5GYIRPo82TeCwu9uJb8cxwzNLx3NYRNZG5Cm4r3638dqfOm','2024-12-15 12:18:42','active','College Level',NULL),(9,'Kim Jessq','Sale','Lignig','','1999-04-10','4','married','kimjessa','female','user','$2b$10$m/0bgWrPLU.CoW4kJMlzBuIRaUeBfOGm5ebTD2Nd9TEqq2Ao1/qdO','2024-12-17 01:24:00','active','High School Graduate',NULL),(10,'Judy Leah','Sale','Lignig','','2007-11-09','4','single','judyleah','female','user','$2b$10$KyVfpAsHaNlBdzgPK7z2jOUBY5K.gkP8R5dz9Unl.NvtHIMAQVrNy','2024-12-17 01:29:03','active','High School Level',NULL),(11,'Joshuq','Nomong','Daquila','','2002-01-24','3','single','joshuadaquila','male','user','$2b$10$MchiLObCvhrqyqPZnW0JqOrdfBu5EzlU79xWO5y5Y2YeOsGgDXDUy','2025-02-24 06:53:56','active','College Level',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-27 21:52:38
