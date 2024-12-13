-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: feedback
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
  `audience` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'All',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`announcementId`),
  KEY `fk_userId` (`userId`),
  CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES (2,'ALL','2024-12-11 02:54:28','Clean-Up Drive','m cmsx','active',NULL),(3,'ALL','2024-12-11 03:28:33','Official Meeting','Join us!','active',NULL),(5,'ALL','2024-12-11 12:07:31','Monthly Meeting','This is a reminder that our  Monthly Meeting will take place on Thursday, December 14 at 10:00 AM. Please mark your calendars and ensure your availability.','active',NULL),(6,'ALL','2024-12-11 12:39:19','ths','cm v','active',NULL),(7,'ALL','2024-12-11 12:41:10','sm cn','jmx ','active',NULL),(8,'ALL','2024-12-11 12:42:23','csm ','s vb ','active',NULL);
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
  `eventName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int NOT NULL,
  `place` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  PRIMARY KEY (`eventId`),
  KEY `userId` (`userId`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'Barangay Day','For the people','2024-12-01 07:22:49',2,'Plaza','active','2002-11-21 01:00:00','2002-11-21 02:00:00'),(3,'Sample Event','aadsfdsdfv','2024-12-01 07:57:00',3,'Plaza','active','2024-12-01 15:56:00','2024-12-01 16:56:00'),(4,'Year-end Party','Join us!','2024-12-11 11:06:39',2,'Barangay Hall','active','2024-12-19 19:06:00','2024-12-20 19:06:00'),(5,'Symposium','Join us!','2024-12-11 13:15:44',2,'Barangay Hall','active','2024-12-02 09:15:00','2024-12-09 12:15:00'),(6,'Mental Health Day','Join us!','2024-12-11 13:38:35',3,'Barangay Hall','active','2024-10-09 09:20:00','2024-10-09 12:40:00'),(7,'Year-End Party','Join us!','2024-12-12 06:33:58',3,'Plaza','active','2024-12-12 14:33:00','2024-12-12 14:33:00');
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
  `content` text COLLATE utf8mb4_general_ci,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`feedbackId`),
  KEY `userId` (`userId`),
  KEY `eventId` (`eventId`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `events` (`eventId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,4,5,'This event is a trash.','2024-12-11 13:18:50','active'),(2,2,6,'The event was informative, but it didn’t spark much interest. It was a bit too generic.','2024-12-11 13:40:34','active'),(3,4,6,'It wasn’t bad, but it didn’t leave me feeling particularly inspired or engaged.','2024-12-11 13:43:09','active'),(4,5,6,'The leadership summit exceeded my expectations. From the meticulously planned agenda to the inspirational keynote speakers, every detail was thoughtfully executed. I particularly appreciated the interactive breakout sessions, which provided valuable networking opportunities and practical insights. ','2024-12-11 14:30:20','active'),(5,6,6,'The community meeting was frustrating!. The discussions were dominated by a few individuals, leaving little room for diverse opinions. Additionally, the proposed solutions lacked feasibility, which left many attendees feeling unheard.','2024-12-11 14:34:38','active');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `middleName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `extensionName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birthday` date NOT NULL,
  `purok` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `civilStatus` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `userName` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` enum('male','female') COLLATE utf8mb4_general_ci NOT NULL,
  `userType` enum('admin','user') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `educationBackground` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'Jayrose ','Sale','Lignig','','2002-01-24','1','Single','jayroselignig','male','user','$2b$10$JZ/OytNAJF.iKkba0UwsVuDpddA4Unpb2XV3iNea2HHdiRTd1Tf3i','2024-12-01 07:02:28','active','College Graduate'),(3,'Jayrose ','Sale','Lignig','','2002-01-24','4','Single','adminJayrose','male','admin','$2b$10$j7E1tCyR3q9n3HKfLFb.fezbMb3YcSnSJ9nSeCQ/VY1g6loKe4IOm','2024-12-01 07:05:26','active','College Level'),(4,'Fritz','Mondejar','Gerald','','2024-12-11','2','single','fritzmondejar','male','user','$2b$10$sEMM8Y7Es7UxD6hFGpbqWOh058R4aivvjkRPKMGeYsa2C9Bwo3s2u','2024-12-11 13:17:44','active','College Level'),(5,'Hanna','Abao','Yumira','','2024-12-08','3','single','hannaabao','female','user','$2b$10$CT.6AV9OXRGaYoig2YP3tuaGADOswzaa7XuAYKIHbbx9RjQoXpXi6','2024-12-11 14:26:22','active','College Level'),(6,'Arielle','Lignig','Jade','','2024-11-11','4','single','ariellejade','female','user','$2b$10$veoinU0NY0SYw65lNvYK4.AiG5ASAoljAm7lhM9ZpTp8DUPUyuG2m','2024-12-11 14:32:16','active','High School Level');
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

-- Dump completed on 2024-12-12 18:46:59
