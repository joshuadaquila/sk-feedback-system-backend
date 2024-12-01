-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2024 at 08:58 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `feedbacksystemdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventId` int(11) NOT NULL,
  `eventName` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` int(11) NOT NULL,
  `place` varchar(255) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eventId`, `eventName`, `description`, `createdAt`, `userId`, `place`, `status`, `startDate`, `endDate`) VALUES
(2, 'Barangay Day', 'For the people', '2024-12-01 07:22:49', 2, 'Plaza', 'active', '2002-11-21 01:00:00', '2002-11-21 02:00:00'),
(3, 'Sample Event', 'aadsfdsdfv', '2024-12-01 07:57:00', 3, 'Plaza', 'active', '2024-12-01 15:56:00', '2024-12-01 16:56:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `extensionName` varchar(50) DEFAULT NULL,
  `birthday` date NOT NULL,
  `purok` varchar(255) NOT NULL,
  `civilStatus` varchar(50) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `gender` enum('male', 'female') NOT NULL
  `userType` enum('admin', 'user') NOT NULL DEFAULT 'user';
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` VARCHAR(20) NOT NULL DEFAULT 'active';
  `educationBackground` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `firstName`, `middleName`, `lastName`, `extensionName`, `birthday`, `purok`, `civilStatus`, `userName`, `userType`, `password`, `createdAt`, `status`, `educationBackground`) VALUES
(2, 'Joshua ', 'Nomong', 'Daquila', '', '2002-01-24', '1', 'Single', 'joshuadaquila', 'user', '$2b$10$JZ/OytNAJF.iKkba0UwsVuDpddA4Unpb2XV3iNea2HHdiRTd1Tf3i', '2024-12-01 07:02:28', 'active', 'College Graduate'),
(3, 'Joshua ', 'Nomong', 'Daquila', '', '2002-01-24', '4', 'Single', 'adminJoshua', 'admin', '$2b$10$j7E1tCyR3q9n3HKfLFb.fezbMb3YcSnSJ9nSeCQ/VY1g6loKe4IOm', '2024-12-01 07:05:26', 'active', 'College Level');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;



-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `announcementId` int(11) NOT NULL AUTO_INCREMENT,
  `audience` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`announcementId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Indexes for dumped tables

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`announcementId`);

-- AUTO_INCREMENT for dumped tables

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `announcementId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

COMMIT;
