-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for smart_train
CREATE DATABASE IF NOT EXISTS `smart_train` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_train`;

-- Dumping structure for table smart_train.camera
CREATE TABLE IF NOT EXISTS `camera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=342 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_train.camera: ~267 rows (approximately)
DELETE FROM `camera`;
INSERT INTO `camera` (`id`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'Non Aktif', '2025-11-25 08:03:23', '2025-11-25 12:14:32'),
	(288, 'Aktif', '2026-01-25 03:05:29', '2026-01-25 03:05:29'),
	(289, 'Nonaktif', '2026-01-25 03:05:33', '2026-01-25 03:05:33'),
	(290, 'Aktif', '2026-01-24 20:05:35', '2026-01-24 20:05:35'),
	(291, 'Aktif', '2026-01-25 03:05:35', '2026-01-25 03:05:35'),
	(292, 'Nonaktif', '2026-01-24 20:05:41', '2026-01-24 20:05:41'),
	(293, 'Nonaktif', '2026-01-25 03:05:41', '2026-01-25 03:05:41'),
	(294, 'Aktif', '2026-01-24 20:05:46', '2026-01-24 20:05:46'),
	(295, 'Aktif', '2026-01-25 03:05:45', '2026-01-25 03:05:45'),
	(296, 'Nonaktif', '2026-01-25 03:06:01', '2026-01-25 03:06:01'),
	(297, 'Aktif', '2026-01-24 20:16:22', '2026-01-24 20:16:22'),
	(298, 'Aktif', '2026-01-25 03:16:21', '2026-01-25 03:16:21'),
	(299, 'Nonaktif', '2026-01-24 20:16:24', '2026-01-24 20:16:24'),
	(300, 'Aktif', '2026-01-24 20:16:27', '2026-01-24 20:16:27'),
	(301, 'Aktif', '2026-01-25 03:16:26', '2026-01-25 03:16:26'),
	(302, 'Nonaktif', '2026-01-24 20:16:32', '2026-01-24 20:16:32'),
	(303, 'Nonaktif', '2026-01-25 03:16:31', '2026-01-25 03:16:31'),
	(304, 'Aktif', '2026-01-24 20:54:06', '2026-01-24 20:54:06'),
	(305, 'Nonaktif', '2026-01-25 01:21:15', '2026-01-25 01:21:15'),
	(306, 'Nonaktif', '2026-01-25 08:21:14', '2026-01-25 08:21:14'),
	(307, 'Aktif', '2026-01-25 01:21:17', '2026-01-25 01:21:17'),
	(308, 'Nonaktif', '2026-01-25 01:55:29', '2026-01-25 01:55:29'),
	(309, 'Nonaktif', '2026-01-25 08:55:28', '2026-01-25 08:55:28'),
	(310, 'Aktif', '2026-01-25 01:55:32', '2026-01-25 01:55:32'),
	(311, 'Nonaktif', '2026-01-25 02:24:51', '2026-01-25 02:24:51'),
	(312, 'Aktif', '2026-01-25 02:24:58', '2026-01-25 02:24:58'),
	(313, 'Nonaktif', '2026-01-25 04:24:43', '2026-01-25 04:24:43'),
	(314, 'Aktif', '2026-01-25 04:25:02', '2026-01-25 04:25:02'),
	(315, 'Nonaktif', '2026-01-25 04:26:56', '2026-01-25 04:26:56'),
	(316, 'Aktif', '2026-01-25 04:28:00', '2026-01-25 04:28:00'),
	(317, 'Aktif', '2026-01-25 11:28:00', '2026-01-25 11:28:00'),
	(318, 'Nonaktif', '2026-01-25 04:47:13', '2026-01-25 04:47:13'),
	(319, 'Aktif', '2026-01-25 13:28:01', '2026-01-25 13:28:01'),
	(320, 'Nonaktif', '2026-01-25 13:29:16', '2026-01-25 13:29:16'),
	(321, 'Aktif', '2026-01-25 06:29:20', '2026-01-25 06:29:20'),
	(322, 'Aktif', '2026-01-25 13:29:19', '2026-01-25 13:29:19'),
	(323, 'Nonaktif', '2026-01-25 06:52:40', '2026-01-25 06:52:40'),
	(324, 'Nonaktif', '2026-01-25 13:52:39', '2026-01-25 13:52:39'),
	(325, 'Aktif', '2026-01-25 06:52:43', '2026-01-25 06:52:43'),
	(326, 'Aktif', '2026-01-25 13:52:42', '2026-01-25 13:52:42'),
	(327, 'Nonaktif', '2026-01-25 06:54:28', '2026-01-25 06:54:28'),
	(328, 'Nonaktif', '2026-01-25 13:54:27', '2026-01-25 13:54:27'),
	(329, 'Aktif', '2026-01-25 06:54:31', '2026-01-25 06:54:31'),
	(330, 'Aktif', '2026-01-25 13:54:30', '2026-01-25 13:54:30'),
	(331, 'Nonaktif', '2026-01-25 13:59:48', '2026-01-25 13:59:48'),
	(332, 'Nonaktif', '2026-01-25 06:59:48', '2026-01-25 06:59:48'),
	(333, 'Aktif', '2026-01-25 06:59:51', '2026-01-25 06:59:51'),
	(334, 'Nonaktif', '2026-01-25 14:01:45', '2026-01-25 14:01:45'),
	(335, 'Aktif', '2026-01-25 20:26:11', '2026-01-25 20:26:11'),
	(336, 'Nonaktif', '2026-01-25 23:53:17', '2026-01-25 23:53:17'),
	(337, 'Aktif', '2026-01-26 00:17:17', '2026-01-26 00:17:17'),
	(338, 'Nonaktif', '2026-01-27 13:22:06', '2026-01-27 13:22:06'),
	(339, 'Aktif', '2026-01-27 13:22:49', '2026-01-27 13:22:49'),
	(340, 'Nonaktif', '2026-01-27 13:22:55', '2026-01-27 13:22:55'),
	(341, 'Aktif', '2026-01-27 13:25:46', '2026-01-27 13:25:46');

-- Dumping structure for table smart_train.palang
CREATE TABLE IF NOT EXISTS `palang` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=777 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_train.palang: ~327 rows (approximately)
DELETE FROM `palang`;
INSERT INTO `palang` (`id`, `status`, `created_at`, `updated_at`) VALUES
	(1, 'Tertutup', '2025-11-25 08:02:51', '2025-11-25 16:11:47'),
	(768, 'Terbuka', '2026-01-24 20:16:37', '2026-01-24 20:16:37'),
	(769, 'Terbuka', '2026-01-25 03:16:36', '2026-01-25 03:16:36'),
	(770, 'Tertutup', '2026-01-24 20:16:56', '2026-01-24 20:16:56'),
	(771, 'Tertutup', '2026-01-25 03:16:56', '2026-01-25 03:16:56'),
	(772, 'Terbuka', '2026-01-25 06:08:14', '2026-01-25 06:08:14'),
	(773, 'Tertutup', '2026-01-25 06:08:36', '2026-01-25 06:08:36'),
	(774, 'Terbuka', '2026-01-27 13:22:09', '2026-01-27 13:22:09'),
	(775, 'Tertutup', '2026-01-27 13:22:29', '2026-01-27 13:22:29'),
	(776, 'Terbuka', '2026-01-27 13:22:59', '2026-01-27 13:22:59');

-- Dumping structure for table smart_train.train_speed
CREATE TABLE IF NOT EXISTS `train_speed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `speed` float NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_train_speed_per_second` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2028 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_train.train_speed: ~114 rows (approximately)
DELETE FROM `train_speed`;
INSERT INTO `train_speed` (`id`, `speed`, `created_at`) VALUES
	(1787, 0.51, '2026-01-06 07:58:03'),
	(1964, 7.06, '2026-01-10 05:48:37'),
	(1966, 12.95, '2026-01-10 05:52:26'),
	(1967, 12.95, '2026-01-10 05:52:27'),
	(1968, 8.69, '2026-01-10 05:53:18'),
	(1969, 8.69, '2026-01-10 05:53:19'),
	(1970, 7.23, '2026-01-10 06:17:19'),
	(1971, 22.82, '2026-01-10 06:17:45'),
	(1972, 11.82, '2026-01-10 06:18:51'),
	(1973, 26.03, '2026-01-10 06:22:54'),
	(1974, 12.17, '2026-01-10 06:26:45'),
	(1975, 12.25, '2026-01-10 06:44:55'),
	(1976, 13.16, '2026-01-12 02:21:10'),
	(1977, 6.21, '2026-01-12 02:23:16'),
	(1978, 15.47, '2026-01-12 02:23:42'),
	(1979, 7.48, '2026-01-12 03:57:40'),
	(1980, 13.41, '2026-01-12 04:00:40'),
	(1981, 13.5, '2026-01-12 04:01:14'),
	(1982, 4.52, '2026-01-12 04:57:02'),
	(1983, 10.5, '2026-01-12 14:26:43'),
	(1984, 10.5, '2026-01-12 14:26:45'),
	(1985, 20.5, '2026-01-12 14:26:52'),
	(1986, 6.82, '2026-01-14 09:38:45'),
	(1987, 6.82, '2026-01-14 09:39:26'),
	(1988, 10, '2026-01-14 09:39:37'),
	(1989, 5, '2026-01-14 09:39:42'),
	(1990, 5, '2026-01-14 09:39:47'),
	(1991, 1, '2026-01-14 09:39:56'),
	(1995, 10, '2026-01-14 09:41:34'),
	(1996, 3.05, '2026-01-15 04:16:37'),
	(1997, 6.05, '2026-01-15 04:16:48'),
	(1998, 1.92, '2026-01-21 11:47:55'),
	(1999, 15.28, '2026-01-21 11:48:25'),
	(2000, 15.12, '2026-01-21 11:48:56'),
	(2001, 15.28, '2026-01-21 11:49:27'),
	(2002, 14.33, '2026-01-21 11:49:59'),
	(2003, 5.99, '2026-01-21 11:51:07'),
	(2004, 15.1, '2026-01-21 11:51:37'),
	(2005, 15.13, '2026-01-21 11:52:08'),
	(2006, 14.82, '2026-01-21 11:52:40'),
	(2007, 14.26, '2026-01-21 11:53:12'),
	(2008, 14.88, '2026-01-21 11:53:43'),
	(2009, 14.95, '2026-01-21 11:54:14'),
	(2010, 14.9, '2026-01-21 11:54:45'),
	(2011, 14.3, '2026-01-21 11:55:18'),
	(2012, 14.24, '2026-01-21 11:55:50'),
	(2013, 14.71, '2026-01-21 11:56:22'),
	(2014, 14.31, '2026-01-21 11:56:54'),
	(2015, 11.19, '2026-01-21 11:57:33'),
	(2016, 13.48, '2026-01-21 12:01:29'),
	(2017, 3.93, '2026-01-21 12:03:10'),
	(2018, 11.43, '2026-01-21 12:12:38'),
	(2019, 13.1, '2026-01-21 12:13:13'),
	(2020, 13.89, '2026-01-21 12:13:46'),
	(2021, 13.5, '2026-01-21 12:14:20'),
	(2022, 13.53, '2026-01-21 12:14:54'),
	(2023, 13.74, '2026-01-21 12:15:28'),
	(2024, 14.42, '2026-01-21 12:16:00'),
	(2025, 11.74, '2026-01-21 12:16:38'),
	(2026, 13.72, '2026-01-21 12:17:12'),
	(2027, 0.27, '2026-01-21 12:40:03');

-- Dumping structure for table smart_train.train_speed_realtime
CREATE TABLE IF NOT EXISTS `train_speed_realtime` (
  `id` int NOT NULL AUTO_INCREMENT,
  `segment` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `speed` double DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_segment_time` (`segment`,`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=74396 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_train.train_speed_realtime: ~63,767 rows (approximately)
DELETE FROM `train_speed_realtime`;
INSERT INTO `train_speed_realtime` (`id`, `segment`, `speed`, `created_at`) VALUES
	(1988, 'IR1_IR2', 0, '2026-01-03 13:12:09'),
	(2079, 'IR4_IR5', 0, '2026-01-03 13:12:27'),
	(2084, 'IR1_IR2', 0, '2026-01-03 13:12:28'),
	(2085, 'IR2_IR3', 0, '2026-01-03 13:12:28'),
	(2086, 'IR3_IR4', 0, '2026-01-03 13:12:28'),
	(2087, 'IR4_IR5', 0, '2026-01-03 13:12:28'),
	(2092, 'IR1_IR2', 0, '2026-01-03 13:12:30'),
	(2093, 'IR2_IR3', 14.1, '2026-01-03 13:12:30'),
	(2094, 'IR3_IR4', 0, '2026-01-03 13:12:30'),
	(2095, 'IR4_IR5', 0, '2026-01-03 13:12:30'),
	(2102, 'IR1_IR2', 0, '2026-01-03 13:12:31'),
	(2103, 'IR2_IR3', 0, '2026-01-03 13:12:31'),
	(2104, 'IR3_IR4', 0, '2026-01-03 13:12:31'),
	(2105, 'IR4_IR5', 0, '2026-01-03 13:12:31'),
	(2110, 'IR3_IR4', 26.07, '2026-01-03 13:12:32'),
	(2112, 'IR1_IR2', 0, '2026-01-03 13:12:33'),
	(2113, 'IR2_IR3', 0, '2026-01-03 13:12:33'),
	(2114, 'IR3_IR4', 0, '2026-01-03 13:12:33'),
	(2115, 'IR4_IR5', 0, '2026-01-03 13:12:33'),
	(2120, 'IR1_IR2', 0, '2026-01-03 13:12:34'),
	(2121, 'IR2_IR3', 0, '2026-01-03 13:12:34'),
	(2122, 'IR3_IR4', 0, '2026-01-03 13:12:34'),
	(2123, 'IR4_IR5', 0, '2026-01-03 13:12:34'),
	(2128, 'IR1_IR2', 0, '2026-01-03 13:12:36'),
	(2129, 'IR2_IR3', 0, '2026-01-03 13:12:36'),
	(2130, 'IR3_IR4', 0, '2026-01-03 13:12:36'),
	(2131, 'IR4_IR5', 0, '2026-01-03 13:12:36'),
	(2136, 'IR1_IR2', 0, '2026-01-03 13:12:38'),
	(2137, 'IR2_IR3', 0, '2026-01-03 13:12:38'),
	(2138, 'IR3_IR4', 0, '2026-01-03 13:12:38'),
	(2139, 'IR4_IR5', 23.86, '2026-01-03 13:12:38'),
	(2144, 'IR1_IR2', 0, '2026-01-03 13:12:39'),
	(2145, 'IR2_IR3', 0, '2026-01-03 13:12:39'),
	(2146, 'IR3_IR4', 0, '2026-01-03 13:12:39'),
	(2147, 'IR4_IR5', 0, '2026-01-03 13:12:39'),
	(2152, 'IR1_IR2', 0, '2026-01-03 13:14:35'),
	(2153, 'IR2_IR3', 0, '2026-01-03 13:14:35'),
	(2154, 'IR3_IR4', 0, '2026-01-03 13:14:35'),
	(2155, 'IR4_IR5', 0, '2026-01-03 13:14:35'),
	(2160, 'IR1_IR2', 0, '2026-01-03 13:14:37'),
	(2161, 'IR2_IR3', 0, '2026-01-03 13:14:37'),
	(2162, 'IR3_IR4', 0, '2026-01-03 13:14:37'),
	(2163, 'IR4_IR5', 0, '2026-01-03 13:14:37'),
	(2168, 'IR1_IR2', 0, '2026-01-03 13:14:38'),
	(2169, 'IR2_IR3', 0, '2026-01-03 13:14:38'),
	(2170, 'IR3_IR4', 0, '2026-01-03 13:14:38'),
	(2171, 'IR4_IR5', 0, '2026-01-03 13:14:38'),
	(2172, 'IR1_IR2', 0, '2026-01-03 13:14:39'),
	(2173, 'IR2_IR3', 0, '2026-01-03 13:14:39'),
	(2174, 'IR3_IR4', 0, '2026-01-03 13:14:39'),
	(2175, 'IR4_IR5', 0, '2026-01-03 13:14:39');

-- Dumping structure for table smart_train.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table smart_train.users: ~5 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
	(1, 'Raihan', 'raihan@gmail.com', '$2b$10$cSPCqz8mr8kFLBP2yQWbeOxfNFdnJzjFwewIGd6jgLsm1g1AIuTHC', '2025-12-02 07:42:22'),
	(2, 'admin', 'admin@gmail.com', '$2b$10$xjK9Fna.z1Z0bWDGEgBPouZcHl.4DotpsIrXxrvcV6NkvXpPzit9a', '2025-12-02 16:57:40'),
	(3, 'yospat', 'yospat@gmail.com', '$2b$10$xzWJt68ciJhK.I9mEIEcOe5vtOm1bidyqtOADVHzmE90COVwf8ABO', '2025-12-02 17:02:27'),
	(4, 'bella', 'bella@gmail.com', '$2b$10$K4Np.h0.Cw9WM3kx1PdPp.CVxtBd9J5QVqRimJovgNyN5aq7FiKPW', '2026-01-15 04:25:39'),
	(5, 'abc', 'abc@gmail.com', '$2b$10$1gnWsLTqWqlGTskJw.k2V..oXxC1P5xgGXMsz1T9.EMztGFKk7MAC', '2026-01-15 04:41:21'),
	(6, 'hasby', 'hasby@gmail.com', '$2b$10$9jBuo9VfNMjuxCqhUuufIOLuTYgDXhbsw9osRnGF6DImZoqDmcORi', '2026-01-21 00:42:31'),
	(7, 'sebastian', 'sebastian@gmail.com', '$2b$10$IP4Ig7E.VchslHIm//f9tO1znhCWIhV/wVMHfLZWPaCy2rKG3uSvy', '2026-01-23 17:30:44');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
