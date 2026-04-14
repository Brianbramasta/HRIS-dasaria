-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 20, 2025 at 06:28 AM
-- Server version: 8.0.30
-- PHP Version: 8.2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hris_dasaria`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `company_office`
--

CREATE TABLE `company_office` (
  `company_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company_office`
--

INSERT INTO `company_office` (`company_id`, `office_id`) VALUES
('019ad7eb-5df0-7383-b933-c4f1c208db39', '019adab2-98de-72ed-848f-cc1c3b7639c4'),
('019add3b-a859-7231-9648-63b5aa72b372', '019add4a-82ac-70fd-9e10-dee1ee781f67'),
('019ad7eb-5df0-7383-b933-c4f1c208db39', '019ae738-4825-7227-90d5-89a73e8611ba'),
('019add3b-a859-7231-9648-63b5aa72b372', '019ae7a1-ad9e-736f-9e9b-3b48be6613cb'),
('019ae365-412f-701f-983f-b17071f92ba2', '019af2c7-93f9-734c-a4b1-6ff20255f8d3'),
('019ad7eb-5df0-7383-b933-c4f1c208db39', '019af2d5-b017-7377-8117-a24b457c26ae'),
('019add3b-a859-7231-9648-63b5aa72b372', '019af2d5-b017-7377-8117-a24b457c26ae'),
('019ad7eb-5df0-7383-b933-c4f1c208db39', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9'),
('019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', '019b2084-f3fe-7389-a651-103e0166fe03'),
('019ae21c-307b-717e-9e7b-86e2eb42e681', '019b2084-f3fe-7389-a651-103e0166fe03'),
('019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', '019b20cb-100a-7165-9278-1cff3d0f8a6e'),
('019ad7eb-5df0-7383-b933-c4f1c208db39', '019b20cb-100a-7165-9278-1cff3d0f8a6e'),
('019ae365-412f-701f-983f-b17071f92ba2', '019b20cc-c87d-721b-a6ff-f94f8547fb23'),
('019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', '019b3313-c1b6-73c1-89de-91891185e6ab'),
('019ae21c-307b-717e-9e7b-86e2eb42e681', '019b3313-c1b6-73c1-89de-91891185e6ab'),
('019ae365-412f-701f-983f-b17071f92ba2', '019b3338-85e7-7368-83d7-82eefa3fe11a');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_11_24_022823_create_personal_access_tokens_table', 1),
(5, '2025_11_29_214450_create_business_lines_table', 1),
(6, '2025_11_29_214548_create_companies_table', 1),
(7, '2025_11_29_214635_create_company_documents_table', 1),
(8, '2025_11_29_214647_create_offices_table', 1),
(9, '2025_11_29_230339_create_company_offices_table', 1),
(10, '2025_11_30_071129_rename_file_columns_in_business_lines_table', 2),
(11, '2025_11_30_071651_rename_file_columns_in_companies_table', 3),
(12, '2025_11_30_072019_rename_file_columns_in_company_documents_table', 4),
(13, '2025_11_30_072202_rename_file_columns_in_offices_table', 5),
(14, '2025_12_02_064607_create_directorate_table', 6),
(15, '2025_12_02_065042_add_new_fields_to_companies_table', 7),
(16, '2025_12_02_065503_create_division_table', 8),
(17, '2025_12_02_065525_create_departmen_table', 9),
(18, '2025_12_02_103735_create_job_title_table', 10),
(19, '2025_12_02_144139_create_position_table', 11),
(20, '2025_12_03_030241_add_logo_to_companies_table', 12),
(21, '2025_12_05_102850_alter_direct_subordinate_nullable_in_job_titles_table', 13),
(22, '2025_12_06_032317_drop_job_level_column_from_positions_table', 14),
(23, '2025_12_06_115535_add_deleted_decree_file_to_company_documents_table', 15),
(24, '2025_12_06_115826_add_deleted_decree_file_to_company_documents_table', 16),
(25, '2025_12_06_120407_add_cd_number_decree_number_to_company_documents', 17),
(26, '2025_12_06_120415_rename_deleted_decree_file_to_cd_deleted_decree_file_in_company_documents', 18),
(27, '2025_12_06_121445_alter_cd_deleted_decree_nullable_in_company_documents_table', 19),
(28, '2025_12_08_030030_change_founded_year_to_date_in_companies_table', 20),
(29, '2025_12_08_041604_create_employee_table', 21),
(30, '2025_12_08_045223_create_pktp_table', 22),
(31, '2025_12_08_064113_create_table_employeee', 23),
(32, '2025_12_08_065007_create_table_pktp', 24),
(33, '2025_12_08_065730_create_employee_table', 25),
(34, '2025_12_08_065817_create_pktp_table', 26),
(35, '2025_12_08_074223_create_employee_education_details', 27),
(36, '2025_12_08_074250_create_employee_documents', 28),
(38, '2025_12_08_092554_set_default_household_dependents_in_employees_table', 29),
(40, '2025_12_08_092604_change_bank_account_number_to_integer_in_employees_table', 30),
(41, '2025_12_08_094225_change_npwp_to_integer_in_employee_table', 31),
(42, '2025_12_08_100424_change_file_type_to_integer_in_documents_table', 32),
(44, '2025_12_08_101048_rename_file_url_to_file_in_employee_documents_table', 33),
(45, '2025_12_08_102627_add_comment_to_file_type_column_in__f_i_l_e_s__t_a_b_l_e', 34),
(48, '2025_12_08_104125_add_comment_to_education_level_column_in_employee_education_details', 35),
(49, '2025_12_09_032607_create_employee_positions', 36),
(50, '2025_12_09_085407_rename_employee_education_details_to_employee_education_formal_detail', 37),
(51, '2025_12_09_090343_create_employee_education_non_formal', 38),
(52, '2025_12_10_024853_change_bpjs_employment_and_health_numbers_to_integer', 39),
(53, '2025_12_10_025638_rename_course_name_to_certificate_name', 40),
(54, '2025_12_10_074926_create_employee_social_media_table', 41),
(55, '2025_12_10_083243_rename_file_in_employee_education_non_formal', 42),
(56, '2025_12_12_000001_refactor_schema_naming', 43),
(58, '2025_12_12_095130_rename_comment_in_field', 44),
(59, '2025_12_15_000000_add_comment_to_file_type_column_in_tr_employee_documents_table', 45),
(63, '2025_12_17_044336_add_name_file_to_tr_employee_documents_table', 46),
(64, '2025_12_17_062057_add_soft_deletes_to_tr_employee_contracts_table', 47);

-- --------------------------------------------------------

--
-- Table structure for table `mt_business_lines`
--

CREATE TABLE `mt_business_lines` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bl_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bl_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bl_description` text COLLATE utf8mb4_unicode_ci,
  `bl_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bl_delete_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bl_delete_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_business_lines`
--

INSERT INTO `mt_business_lines` (`id`, `bl_name`, `bl_decree_number`, `bl_description`, `bl_decree_file`, `bl_delete_decree_number`, `bl_delete_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019ad2e2-272f-7101-9fd5-511ce44d15d9', 'Digital Transformation Unit', 'SK/DTU/2024/001', 'Unit yang fokus pada transformasi digital perusahaan, implementasi sistem ERP, dan otomatisasi proses bisnis', 'business-lines/decree/6dc4ae0b-f781-4aad-9b31-d0350baa4422.pdf', 'SK/DTU/2024/001', 'OrganizationalStructure/business-lines/delete-decree/3d86bd8c-6eba-45e4-be2d-40d5c9d0572e.pdf', NULL, '2025-11-29 20:50:27', '2025-12-01 22:36:50'),
('019ad2e3-8ef9-729c-8230-fe84d6c5d181', 'Cloud Solutions Division', 'SK/CSD/2024/002', 'Penyedia layanan cloud computing, managed services, dan infrastruktur IT untuk enterprise', 'business-lines/decree/1cb069a8-20ee-4195-8fed-8db6f5989224.pdf', NULL, NULL, NULL, '2025-11-29 20:51:59', '2025-11-29 20:51:59'),
('019ad2e4-fb0c-711b-938f-1bb8e592869e', 'Cybersecurity & Risk Management', 'SK/CRM/2024/003', 'Layanan keamanan siber, penetration testing, risk assessment, dan compliance security', 'business-lines/decree/34293c71-d9f3-49d8-a9b4-153db447d5e7.pdf', NULL, NULL, NULL, '2025-11-29 20:53:33', '2025-11-29 20:53:33'),
('019ad2e5-7fff-73c8-8695-68dd2b2381e0', 'Data Analytics & Business Intelligence', 'SK/DABI/2024/004', 'Pengolahan data, analitik bisnis, machine learning, dan dashboard reporting untuk pengambilan keputusan', 'business-lines/decree/263d4d4d-5a78-4909-824f-60f48240ca86.pdf', NULL, NULL, NULL, '2025-11-29 20:54:07', '2025-11-29 20:54:07'),
('019ad2e5-e4c3-71f3-a4e0-affbc167b926', 'E-Commerce Platform Solutions', 'SK/EPS/2024/005', 'Pengembangan platform e-commerce, marketplace, payment gateway, dan solusi perdagangan digital', 'business-lines/decree/24253f24-955f-47d9-8138-bf2e655ffeee.pdf', NULL, NULL, NULL, '2025-11-29 20:54:33', '2025-11-29 20:54:33'),
('019ad2e6-4cd8-7287-8ad1-b752a17b9043', 'Mobile Application Development', 'SK/MAD/2024/006', 'Pengembangan aplikasi mobile iOS dan Android, progressive web apps, dan cross-platform solutions', 'business-lines/decree/33b5d12a-4201-42b3-bf93-cc5f01e4fbc0.pdf', NULL, NULL, NULL, '2025-11-29 20:54:59', '2025-11-29 20:54:59'),
('019ad2e6-b068-73fd-917b-b912011b7ad0', 'IoT & Smart City Solutions', 'SK/IOT/2024/007', 'Implementasi Internet of Things, smart city solutions, sensor networks, dan automation systems', 'business-lines/decree/19ed3076-ff2b-467c-af4f-db06311c5937.pdf', NULL, NULL, NULL, '2025-11-29 20:55:25', '2025-11-29 20:55:25'),
('019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d', 'Artificial Intelligence & Automation', 'SK/AIA/2024/008', 'Pengembangan solusi AI, robotic process automation, chatbot, dan intelligent automation', 'business-lines/decree/8f0ba547-7079-4a5c-85f3-88ecf77f3ea1.pdf', NULL, NULL, NULL, '2025-11-29 20:55:52', '2025-11-29 20:55:52'),
('019ad2e7-7d5e-70af-abdc-a25e662fc5c7', 'Financial Technology Solutions', 'SK/FTS/2024/009', 'Pengembangan aplikasi fintech, digital banking, payment systems, dan financial analytics', 'business-lines/decree/efaf4af3-83f2-472e-b809-e4abcaa78eb0.pdf', NULL, NULL, NULL, '2025-11-29 20:56:17', '2025-11-29 20:56:17'),
('019ad2e7-d958-71fe-9e8b-a626e85aec7c', 'Healthcare Technology 6', 'SK/HCT/2024/015', 'Sistem informasi rumah sakit, telemedicine, electronic medical records, dan health monitoring solutions', 'business-lines/decree/ef6bc0cd-9d4a-438f-ad5a-d544738c1162.pdf', NULL, NULL, NULL, '2025-11-29 20:56:41', '2025-11-30 00:32:49'),
('019ad3c3-3d95-7303-bb43-e73ebc5c7738', 'ini tes lini bisnis baru', 'SK/HCT/2024/010', 'tes deskripsi', 'business-lines/decree/b4d751ec-f258-4d6d-baf4-6f7d184c6662.pdf', NULL, NULL, NULL, '2025-11-30 00:56:19', '2025-11-30 00:56:19'),
('019ad3cf-2598-72ba-a1f5-9782ec3b6fbc', 'ini tes lini bisnis baru', 'SK/HCT/2024/010', 'Softwa', 'business-lines/decree/e8e83c0d-034d-4909-99b5-57b71928ef07.pdf', NULL, NULL, NULL, '2025-11-30 01:09:19', '2025-11-30 01:09:19'),
('019ad3cf-7ae4-7045-8d7b-01ac5da939fb', 'ini tes lini bisnis baru3', 'SK/HCT/2024/015', 'Internet', 'business-lines/decree/4a5ad844-794e-4f2e-a0b0-130bc41950e8.pdf', NULL, NULL, NULL, '2025-11-30 01:09:41', '2025-11-30 20:04:30'),
('019ad3d4-04fb-7039-846c-bbc166d24e27', 'ini tes lini bisnis baru  3', 'SK/HCT/2024/010', 'Softwa', 'business-lines/decree/45f3acaf-5678-4b6f-ab96-94c4fbf45a64.pdf', 'SK-HP/HCT/2024/001', 'business-lines/delete-decree/7dc084cc-6da3-410f-a39f-27cff7c03de7.pdf', '2025-11-30 20:03:47', '2025-11-30 01:14:38', '2025-11-30 20:03:47'),
('019ae838-0aa2-70f4-94cb-1c1121842665', 'ini tes lini bisnis baru10 dari brian', 'SK/HCT/2024/016', 'test', 'OrganizationalStructure/business-lines/decree/f2325475-af0a-46b3-81f8-0d5b0949a94a.pdf', NULL, NULL, NULL, '2025-12-04 00:16:18', '2025-12-18 02:06:15'),
('019b300b-4e45-7025-9698-f4d97317dfb8', 'test', '22333', 'test', 'OrganizationalStructure/Businesslines/Decree/830ddb28-9276-4c44-b325-797efc5dfbe2.pdf', 'SK-HP/HCT/2024/001', 'OrganizationalStructure/Businesslines/DeleteDecree/8934a2dd-f067-4b91-9a98-be59fc83ff96.pdf', '2025-12-18 02:05:11', '2025-12-17 23:00:05', '2025-12-18 02:05:11'),
('019b300e-587b-7095-809c-3d24c7ff6d7f', 'ini tes lini bisnis baru10', 'SK/HCT/2024/016', 'tes deskripsi', 'OrganizationalStructure/Businesslines/Decree/42a2012a-d922-4c45-9faa-63d4f3b7b3f4.pdf', 'SK-HP/HCT/2024/001', 'OrganizationalStructure/Businesslines/DeleteDecree/474e6184-50be-4e23-a435-8dd2e7b2525a.pdf', '2025-12-17 23:15:25', '2025-12-17 23:03:25', '2025-12-17 23:15:25'),
('019b30b6-30ed-727b-92c4-2ae810560fda', 'ini tes lini bisnis baru  tes dengna url baru', 'SK/HCT/2024/010', 'tes deskripsi', 'OrganizationalStructure/Businesslines/Decree/2de24e50-d4fd-4473-a84f-b1f422beeb9f.pdf', NULL, NULL, NULL, '2025-12-18 02:06:45', '2025-12-18 02:06:45');

-- --------------------------------------------------------

--
-- Table structure for table `mt_companies`
--

CREATE TABLE `mt_companies` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_description` text COLLATE utf8mb4_unicode_ci,
  `company_delete_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_delete_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_line_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `founded_year` date DEFAULT NULL,
  `company_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_companies`
--

INSERT INTO `mt_companies` (`id`, `company_name`, `company_description`, `company_delete_decree_number`, `company_delete_decree_file`, `business_line_id`, `deleted_at`, `created_at`, `updated_at`, `address`, `postal_code`, `email`, `phone`, `industry`, `founded_year`, `company_type`, `website`, `logo`) VALUES
('019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', 'PT. Fintech Payment Solutions', 'Penyedia payment gateway, digital wallet, dan solusi pembayaran digital untuk e-commerce dan retail modern', 'teest delete', 'OrganizationalStructure/company/delete-decree/1bfe9fa8-cb81-4f0e-96bd-e59ca85e5926.pdf', '019ad2e7-7d5e-70af-abdc-a25e662fc5c7', NULL, '2025-11-30 20:16:11', '2025-12-03 00:33:43', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019ad7eb-5df0-7383-b933-c4f1c208db39', 'PT. Artificial Intelligence Indonesia', 'Pengembang solusi AI dan robotic process automation untuk meningkatkan efisiensi bisnis perusahaan di Indonesia', NULL, NULL, '019ad2e7-1c4f-7056-9b0b-7b0bdf62cf2d', NULL, '2025-11-30 20:18:37', '2025-11-30 21:05:47', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019add3b-a859-7231-9648-63b5aa72b372', 'PT. Smart IoT Solutions', 'Spesialis Internet of Things untuk smart city, industrial automation, dan connected devices', NULL, NULL, '019ad2e6-b068-73fd-917b-b912011b7ad0', NULL, '2025-12-01 21:04:25', '2025-12-01 21:04:25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019ae21c-307b-717e-9e7b-86e2eb42e681', 'test company brian', 'testtttt', 'hapus', 'OrganizationalStructure/company/delete-decree/dc66811d-0447-4adc-b324-fb84ebb32505.pdf', '019ad2e3-8ef9-729c-8230-fe84d6c5d181', '2025-12-03 00:35:05', '2025-12-02 19:48:09', '2025-12-03 00:35:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019ae307-c96f-7038-b669-5118d038e0b9', 'test brian 2', 'test brian', 'test 333', 'OrganizationalStructure/company/delete-decree/9f24b3e8-0818-49de-af98-4d9c7d5f60a2.pdf', '019ad2e4-fb0c-711b-938f-1bb8e592869e', '2025-12-03 00:34:26', '2025-12-03 00:05:29', '2025-12-03 00:34:26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019ae30d-0c18-7058-b9cb-050a513baae6', 'test 3', 'test 333', NULL, NULL, '019ad2e3-8ef9-729c-8230-fe84d6c5d181', NULL, '2025-12-03 00:11:14', '2025-12-18 10:55:48', 'kaliurang jawa 1', '68124', 'tes@gmail.com', '0812', 'isp', '2025-01-01', 'pt', 'https://github.com/', NULL),
('019ae365-412f-701f-983f-b17071f92ba2', 'tes 4', 'test', NULL, NULL, '019ad2e4-fb0c-711b-938f-1bb8e592869e', NULL, '2025-12-03 01:47:35', '2025-12-12 01:05:34', 'kaliurang', '68124', 'tes@gmail.com', '0812', 'isp', '2025-01-01', 'pt', 'https://github.com/', 'OrganizationalStructure/company/img/83f932d6-bf29-498d-ad7d-8b89e9473202.jpeg'),
('019b3121-1f8a-723d-a640-2bbdc2635aa4', 'PT. Smart IoT Solutions', 'Spesialis Internet of Things untuk smart city, industrial automation, dan connected devices', 'ini sk hapus', 'OrganizationalStructure/company/delete-decree/0e9f0491-e7ab-4638-a261-779eb8d1c88e.pdf', '019ad2e6-b068-73fd-917b-b912011b7ad0', '2025-12-18 04:16:51', '2025-12-18 04:03:33', '2025-12-18 04:16:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019b3282-2da4-7004-a64c-19fb82446dea', 'PT. Smart IoT Solutions', 'Spesialis Internet of Things untuk smart city, industrial automation, dan connected devices', NULL, NULL, '019ad2e6-b068-73fd-917b-b912011b7ad0', NULL, '2025-12-18 10:29:10', '2025-12-18 10:29:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('019b3284-232b-72cd-beca-bbd44b8b4847', 'PT. Smart IoT Solutions', 'Spesialis Internet of Things untuk smart city, industrial automation, dan connected devices', 'ini sk hapus', 'OrganizationalStructure/Company/DeleteDecree/91573249-74b5-463a-b205-9abaee5292f0.pdf', '019ad2e6-b068-73fd-917b-b912011b7ad0', '2025-12-18 17:55:38', '2025-12-18 10:31:19', '2025-12-18 10:47:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mt_departments`
--

CREATE TABLE `mt_departments` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_description` text COLLATE utf8mb4_unicode_ci,
  `department_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_deleted_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_departments`
--

INSERT INTO `mt_departments` (`id`, `department_name`, `division_id`, `department_decree_number`, `department_description`, `department_decree_file`, `department_deleted_decree_file`, `department_deleted_decree_number`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019aec86-d8f9-7309-ba15-f7c3273c2a2a', 'ini departmen peternakan ikan konoha', '019ae889-6a3b-7256-8cd9-67e528a413fa', 'ini sk entah keberapa', '-', 'OrganizationalStructure/department/decree/0cae83ce-e4d2-4682-8180-fe0b97542d87.pdf', NULL, NULL, NULL, '2025-12-04 20:20:51', '2025-12-19 04:36:49'),
('019aec87-9803-715c-8223-aef1aacf85df', 'ini departmen peternakan  2', '019ae8a3-11de-7361-8643-e0e0166a1c03', 'ini sk entah keberapa', 'ini deskripsi', 'OrganizationalStructure/department/decree/a3b84f26-f1e0-4452-8323-98946ae6b548.pdf', 'OrganizationalStructure/department/delete-decree/b83dcf08-f248-488a-8e49-5e1bfc081bc8.pdf', 'tes hapus', '2025-12-04 21:03:25', '2025-12-04 20:21:40', '2025-12-04 21:03:25'),
('019aed98-eae2-7380-917a-309c0fe1d1c0', 'Human Resource Development', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', 'ini sk entah keberapa', 'ini deskripsi', 'OrganizationalStructure/department/decree/14f1b05c-c9ec-4350-86cc-2ee1cb2560d1.pdf', NULL, NULL, NULL, '2025-12-05 01:20:13', '2025-12-05 01:20:13'),
('019aed99-53bc-71af-aa7f-07b317ff29d8', 'Finance & Accounting', '019ae833-9eee-71a2-929f-918f233f6d4e', 'ini sk entah keberapa  2', 'ini deskripsi', 'OrganizationalStructure/department/decree/443d2276-6bff-45b2-8c01-ea21dd393a53.pdf', NULL, NULL, NULL, '2025-12-05 01:20:39', '2025-12-05 01:20:39'),
('019aed99-baf2-738f-9ba1-adde262af553', 'Information Technology', '019ae889-1ecb-7262-88ed-58868c0e4bf4', 'ini sk entah keberapa  3', 'ini deskripsi', 'OrganizationalStructure/department/decree/63705a88-bcde-4c4d-bf15-1b34a3b6adc1.pdf', NULL, NULL, NULL, '2025-12-05 01:21:06', '2025-12-15 00:51:34'),
('019af194-6a1a-73c5-b1b0-907252943101', 'test briiiiannn 1', '019ae833-9eee-71a2-929f-918f233f6d4e', '334455', '--ttest', 'OrganizationalStructure/department/decree/9833eaee-94fb-4b30-81f3-1a97769f25ec.pdf', 'OrganizationalStructure/Department/DeleteDecree/5f0df7fb-2c57-467f-98f2-48ddddffc0ff.pdf', 'tes hapus  hapus ya', '2025-12-19 04:35:30', '2025-12-05 19:53:46', '2025-12-19 04:35:30');

-- --------------------------------------------------------

--
-- Table structure for table `mt_directorates`
--

CREATE TABLE `mt_directorates` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_description` text COLLATE utf8mb4_unicode_ci,
  `directorate_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_deleted_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `directorate_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_directorates`
--

INSERT INTO `mt_directorates` (`id`, `directorate_name`, `directorate_decree_number`, `directorate_description`, `directorate_decree_file`, `directorate_deleted_decree_number`, `directorate_deleted_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019ae21e-7ff8-7315-80a5-a139bbc01e52', 'ini nama direktorat', 'ini sk directorat', NULL, 'OrganizationalStructure/directorate/decree/3ac1a3dc-7ea1-48ef-bb9d-cb9ac007ea80.pdf', NULL, NULL, NULL, '2025-12-02 19:50:41', '2025-12-02 19:50:41'),
('019ae265-320f-73ac-87c2-25b927de4e77', 'ini nama direktorat 2', 'ini sk directorat 2', NULL, 'storage/OrganizationalStructure/directorate/decree/2a38badc-ac91-48c3-988a-30e1c71826e0.pdf', NULL, NULL, NULL, '2025-12-02 21:07:54', '2025-12-02 21:07:54'),
('019ae273-ff4f-7384-acb7-44b31ab476f7', 'ini nama direktorat 3 jadi 4', 'ini sk directorat 3 jadi 4', 'test', 'OrganizationalStructure/directorate/decree/308c2387-22b0-4828-9eb6-9f7ee956333a.pdf', 'ini sk delete', 'OrganizationalStructure/directorate/delete-decree/66803dfb-226c-4928-a94f-6ec713cf9ca2.pdf', NULL, '2025-12-02 21:24:04', '2025-12-03 21:46:46'),
('019ae88f-cdb4-70e6-b4fa-c38cfe2e0031', 'ini nama direktorat 3', 'ini sk directorat 3', NULL, 'OrganizationalStructure/directorate/decree/40590363-d8b0-46d9-8050-ef4b397a8ddd.pdf', NULL, NULL, NULL, '2025-12-04 01:52:09', '2025-12-04 01:52:09'),
('019ae892-1d28-70f0-baa5-433f8a12794d', 'test', 'eee', 'testt', 'OrganizationalStructure/directorate/decree/4813d0c9-5855-4cea-ad98-cf94677f789f.pdf', NULL, NULL, NULL, '2025-12-04 01:54:41', '2025-12-04 01:54:41'),
('019b3481-a26b-714c-8d57-95e118c3e554', 'ini nama direktorat entah keberapa', 'ini sk directorat ini juga gak tau', NULL, 'OrganizationalStructure/directorate/decree/c3522819-d435-4274-8230-9b41827a70c3.pdf', NULL, NULL, NULL, '2025-12-18 19:47:49', '2025-12-18 19:47:49'),
('019b3482-f90b-730e-8752-422cbbd5960d', 'ini nama direktorat entah keberapa', 'ini sk directorat ini juga gak tau', NULL, 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpE803.tmp', NULL, NULL, NULL, '2025-12-18 19:49:17', '2025-12-18 19:49:17'),
('019b3483-2f16-725a-8e0e-679c16f78a19', 'ini nama direktorat entah keberapa', 'ini sk directorat ini juga gak tau', NULL, 'C:\\Users\\pc\\AppData\\Local\\Temp\\php1D3D.tmp', NULL, NULL, NULL, '2025-12-18 19:49:31', '2025-12-18 19:49:31'),
('019b348d-883f-7125-bae5-0f2a35ab8410', 'ini nama direktorat entah keberapa gak tau', 'ini sk directorat 3 jadi 4 ini sk juga ngawur', 'ngawur pokok nya', 'OrganizationalStructure/Directorate/Decree/966ca56c-05b8-4006-a898-2a948956d579.pdf', 'ini sk delete', 'OrganizationalStructure/directorate/delete-decree/5d673322-5394-40ec-a4a5-c5b7d2d85dfe.pdf', '2025-12-18 20:16:02', '2025-12-18 20:00:49', '2025-12-18 20:16:02');

-- --------------------------------------------------------

--
-- Table structure for table `mt_divisions`
--

CREATE TABLE `mt_divisions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_description` text COLLATE utf8mb4_unicode_ci,
  `division_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_deleted_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_divisions`
--

INSERT INTO `mt_divisions` (`id`, `directorate_id`, `division_name`, `division_decree_number`, `division_description`, `division_decree_file`, `division_deleted_decree_number`, `division_deleted_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019ae273-ff4f-7384-acb7-44b31ab476f7', 'ini divisi 1', 'ini sk update', 'ini deskripsi', 'C:\\Users\\pc\\AppData\\Local\\Temp\\php1A42.tmp', 'ini sk hapus', 'OrganizationalStructure/division/delete-decree/93ac3423-27e1-4515-a15b-cf6448f8852c.pdf', NULL, '2025-12-03 20:47:12', '2025-12-04 00:09:44'),
('019ae833-9eee-71a2-929f-918f233f6d4e', '019ae265-320f-73ac-87c2-25b927de4e77', 'tes gjhfjhfjyfy', 'ini sk 1 nys', 'ini deskripsi', 'OrganizationalStructure/division/decree/a58de9e7-624f-454f-8a76-2380eb10c16c.pdf', NULL, NULL, NULL, '2025-12-04 00:11:28', '2025-12-15 00:26:42'),
('019ae889-1ecb-7262-88ed-58868c0e4bf4', '019ae265-320f-73ac-87c2-25b927de4e77', 'test brian', '3344555', 'testt', 'C:\\Users\\pc\\AppData\\Local\\Temp\\php9DFE.tmp', NULL, NULL, NULL, '2025-12-04 01:44:51', '2025-12-04 01:44:51'),
('019ae889-6a3b-7256-8cd9-67e528a413fa', '019ae265-320f-73ac-87c2-25b927de4e77', 'test brian 2', '3344555', 'testt', 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpE960.tmp', NULL, NULL, NULL, '2025-12-04 01:45:11', '2025-12-04 01:50:36'),
('019ae88e-c9e8-70dd-8ae7-2355d3d078c1', '019ae21e-7ff8-7315-80a5-a139bbc01e52', 'test brian 4', '2233', 'ettte', 'C:\\Users\\pc\\AppData\\Local\\Temp\\php48FE.tmp', NULL, NULL, NULL, '2025-12-04 01:51:03', '2025-12-04 01:51:03'),
('019ae890-e026-734b-a932-dba7c8dbf88f', '019ae21e-7ff8-7315-80a5-a139bbc01e52', 'test brian 4', '2233', 'ettte', 'C:\\Users\\pc\\AppData\\Local\\Temp\\php5F0E.tmp', NULL, NULL, NULL, '2025-12-04 01:53:20', '2025-12-04 01:53:20'),
('019ae893-5b5b-7051-b8db-20af06da9b65', '019ae265-320f-73ac-87c2-25b927de4e77', 'test 5', '33222', 'aaa', 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpDA71.tmp', NULL, NULL, NULL, '2025-12-04 01:56:02', '2025-12-04 01:56:02'),
('019ae899-6d42-70cd-b822-fa36f9c42f61', '019ae265-320f-73ac-87c2-25b927de4e77', 'ini divis 2', 'ini sk 1 nys', NULL, 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpEAEF.tmp', NULL, NULL, NULL, '2025-12-04 02:02:40', '2025-12-04 02:02:40'),
('019ae89a-5755-716a-a445-ee9cf4b4156b', '019ae265-320f-73ac-87c2-25b927de4e77', 'ini divis 6', 'ini sk 1 nys', NULL, 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpD61B.tmp', NULL, NULL, NULL, '2025-12-04 02:03:40', '2025-12-04 02:03:40'),
('019ae89d-d494-71bf-8b3a-6cc3b47f1662', '019ae265-320f-73ac-87c2-25b927de4e77', 'ini divis 6', 'ini sk 1 nys', NULL, 'OrganizationalStructure/division/decree/d6f22302-dd9a-43c6-b0f2-b801964085d5.pdf', NULL, NULL, NULL, '2025-12-04 02:07:29', '2025-12-04 02:07:29'),
('019ae8a3-11de-7361-8643-e0e0166a1c03', '019ae21e-7ff8-7315-80a5-a139bbc01e52', 'tes', 'test', 'ini deskripsi', 'OrganizationalStructure/division/decree/49c8a71a-a773-4b49-9b6c-aae3643928ef.pdf', 'ini sk hapus', 'OrganizationalStructure/division/delete-decree/820e6c5e-d085-429e-92d9-cc9ede8bf8a2.pdf', NULL, '2025-12-04 02:13:12', '2025-12-15 00:43:54'),
('019b354b-efd9-702b-8529-28b11f0c1067', '019ae265-320f-73ac-87c2-25b927de4e77', 'ini divis besar', 'ini sk 1 nys', NULL, 'OrganizationalStructure/Division/Decree/cf46c30c-7e6f-4842-9b3a-b49788f5b5fa.pdf', NULL, NULL, NULL, '2025-12-18 23:28:47', '2025-12-18 23:28:47'),
('019b354c-9cc4-7318-b78e-f85abba5e033', '019ae21e-7ff8-7315-80a5-a139bbc01e52', 'ini divis besar entah entah lah apa yang diminta oleh pak bos', 'ini sk 1 nys', 'ini deskripsi', 'OrganizationalStructure/Division/Decree/87cd126a-64ec-4e9e-9d87-26b97344350d.pdf', 'ini sk hapus', 'OrganizationalStructure/Division/DeleteDecree/65bf3104-911e-4240-9d90-471a91f64534.pdf', '2025-12-18 23:52:07', '2025-12-18 23:29:31', '2025-12-18 23:52:07');

-- --------------------------------------------------------

--
-- Table structure for table `mt_employees`
--

CREATE TABLE `mt_employees` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `national_id` int DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` int DEFAULT NULL COMMENT '1 = islam, 2 = protestant, 3 = catholic, 4 = hindu, 5 = buddhist, 6 = confucianism',
  `blood_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_place` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `last_education` int DEFAULT NULL COMMENT '1 = sd, 2 = smp, 3 = sma, 4 = d1, 5 = d2, 6 = d3, 7 = s1, 8 = s2, 9 = s3',
  `marital_status` int DEFAULT NULL COMMENT '1 = single, 2 = married',
  `gender` int DEFAULT NULL COMMENT '1 = male, 2 = female',
  `household_dependents` int NOT NULL DEFAULT '0',
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Phone number',
  `current_address` text COLLATE utf8mb4_unicode_ci,
  `ktp_address` text COLLATE utf8mb4_unicode_ci,
  `bank_account_number` int DEFAULT NULL,
  `bank_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bank_account_holder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `npwp` int DEFAULT NULL,
  `ptkp_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bpjs_employment_number` int NOT NULL,
  `bpjs_employment_status` int DEFAULT NULL COMMENT '1 = active, 2 = inactive',
  `bpjs_health_number` int NOT NULL,
  `bpjs_health_status` int DEFAULT NULL COMMENT '1 = active, 2 = inactive',
  `employment_status` int DEFAULT NULL COMMENT '1=active, 2=inactive, 3=probation, 4=resigned',
  `resignation_status` int DEFAULT NULL COMMENT '1 = pending, 2 = in_progress, 3 = ditolak, 4 = di_setujui',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_employees`
--

INSERT INTO `mt_employees` (`id`, `full_name`, `national_id`, `email`, `religion`, `blood_type`, `birth_place`, `birth_date`, `last_education`, `marital_status`, `gender`, `household_dependents`, `phone_number`, `current_address`, `ktp_address`, `bank_account_number`, `bank_name`, `bank_account_holder`, `npwp`, `ptkp_id`, `bpjs_employment_number`, `bpjs_employment_status`, `bpjs_health_number`, `bpjs_health_status`, `employment_status`, `resignation_status`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b0b60-173a-7260-a049-d494f5707e8c', 'tes', 5060, 'tes@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 2, NULL, NULL, '2025-12-10 20:06:45', '2025-12-12 02:46:02'),
('019b0b63-4230-709d-9e45-3c51e9b51166', 'tes', 5061, 'tes1@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 1, NULL, NULL, '2025-12-10 20:10:13', '2025-12-10 20:10:13'),
('019b0b69-c493-7145-addc-593ee8065d05', 'tes', 5062, 'tes2@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 1, NULL, NULL, '2025-12-10 20:17:19', '2025-12-10 20:17:19'),
('019b1206-291a-706f-8f10-b6564107f57f', 'tes probation', 5063, 'tes3@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-12 03:05:52', '2025-12-12 03:05:52'),
('019b15fe-348b-7026-9221-1467f8eea5ff', 'tes probation', 5064, 'tes4@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 2, NULL, NULL, '2025-12-12 21:35:39', '2025-12-15 07:25:45'),
('019b16b8-97be-720c-8f85-13d1f727fd33', 'tes probation', 50641555, 'tes44@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 2, NULL, NULL, '2025-12-13 00:59:14', '2025-12-15 07:26:22'),
('019b2000-8fba-7040-b0c2-748d6ea5ddd2', 'Brian Bramasta', 12222, 'Brianaldybramasta@gmail.com', 2, 'B', 'Bojonegoro', '2025-12-15', 7, 1, 1, 1, '628999999999', 'tttt', 'ttt', 7766666, 'bca', 'test', 12121212, '3203aaef-d260-4263-8cf0-989bf4143768', 55556666, 1, 444444, 1, 2, NULL, '2025-12-16 23:28:30', '2025-12-14 20:14:26', '2025-12-16 23:28:30'),
('019b221a-bb6d-737d-be0e-672f8a7b2bd4', 'Aldy Bramasta', 12222333, 'Brianaldybramasta22@gmail.com', 2, 'O', 'Bojonegoro', '2000-01-27', 7, 1, 1, 1, '089999999999999', 'sukun', 'bojonegoro', 73333333, 'bca', 'test', 12121212, '3203aaef-d260-4263-8cf0-989bf4143768', 444444, 1, 555, 1, 2, NULL, NULL, '2025-12-15 06:02:15', '2025-12-15 07:31:14'),
('019b2225-7b7c-71ec-8ff4-e38df930506f', 'april', 333333, 'april@gmail.com', 2, 'B', 'Bojonegoro', '1999-12-01', 4, 1, 2, 1, '8999999', 'aaaa', 'bbb', 34444, 'bca', 'test', 12121212, '3203aaef-d260-4263-8cf0-989bf4143768', 3324444, 1, 3211111, 1, 3, NULL, NULL, '2025-12-15 06:14:00', '2025-12-15 06:14:00'),
('019b251d-7b7a-72bd-a9e9-d1e6acf89d7f', 'test33', 223333, 'test44@gmail.com', 1, 'A', 'Bojonegoro', '1999-12-08', 7, 1, 1, 1, '4455555', 'test', 'test', 443344555, 'bca', 'test', 33444, 'a96b3869-1520-4474-981b-a8cba42d8ce1', 4444, 1, 3232444, 1, 3, NULL, NULL, '2025-12-15 20:04:07', '2025-12-15 20:04:07'),
('019b2630-fa04-702c-b1cf-e20b018fd0ec', 'tes probation', 50641556, 'tes5@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-16 01:05:02', '2025-12-16 01:05:02'),
('019b2635-a1a5-71d9-a7f2-b30831cc893f', 'tes probation', 50641557, 'tes6@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd5d-709f-997e-e8a0384443e0', 'tes probation', 50641558, 'tes7@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-1026-713b-8211-466be6a8954c', 'tes probation', 50641559, 'tes8@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd65-7084-a30f-1f943a3d2e64', 'Brian Bramasta 2', 345617, 'Brianaldybramastaerrr@gmail.com', 2, 'B', 'Bojonegoro', '2025-12-01', 1, 1, 1, 1, '333333', 'aa', 'aa', 235566666, 'bca', 'test', 345678999, '91a80efc-8752-46c6-954a-0da18f1d1fa9', 123455555, 1, 123333, 1, 3, NULL, NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb59-7228-b9fb-25a4c24eff35', 'tes probation', 50641560, 'tes9@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 'tes probation', 50641561, 'tes10@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b8d-24fa-726c-a200-59d718b44a7a', 'Brian llalala', 23456542, 'bbbb@gmail.com', 2, 'A', 'Bojonegoro', '2025-12-18', 3, 2, 1, 1, '3333', 'aa', 'aa', 123434555, 'mandiri', 'test', 132323434, '91a80efc-8752-46c6-954a-0da18f1d1fa9', 452638, 1, 452638, 1, 3, NULL, NULL, '2025-12-17 02:03:48', '2025-12-17 02:03:48'),
('DSR001', 'tes probation', 50641562, 'tes11@gmail.com', 1, 'b+', 'jember', '2003-06-14', 7, 1, 1, 0, '082147xxxx', 'malang', 'jember', 34534635, 'rizal', 'morimana', 13432432, '84649b16-fa71-4074-bd90-49b36386f983', 5060, 1, 5060, 1, 3, NULL, NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `mt_job_titles`
--

CREATE TABLE `mt_job_titles` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direct_subordinate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title_description` text COLLATE utf8mb4_unicode_ci,
  `job_title_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title_deleted_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_job_titles`
--

INSERT INTO `mt_job_titles` (`id`, `job_title_name`, `grade`, `direct_subordinate`, `job_title_decree_number`, `job_title_description`, `job_title_decree_file`, `job_title_deleted_decree_number`, `job_title_deleted_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019aee3e-b586-727f-9464-6d819a5e6278', 'managet', 'gak tau grade 1', 'spv', 'ini sk manager', 'gak tau pokok kerja ya', 'OrganizationalStructure/job_titles/decrees/ddce2098-2a2d-4c4d-aa29-ef043075e6fc.pdf', NULL, NULL, NULL, '2025-12-05 04:21:18', '2025-12-05 20:38:30'),
('019aee89-c7a1-7359-ba6b-86db2d8c41e1', 'Senior Software Engineer', 'SSE-001', 'Mid Developer, Junior Developer', 'SK-ENG-2024-001', 'Lead developer dengan pengalaman 5+ tahun', 'OrganizationalStructure/job_titles/decrees/7add84f9-136d-4fae-a618-3b890187dfff.pdf', NULL, NULL, NULL, '2025-12-05 05:43:18', '2025-12-05 05:43:18'),
('019aee8a-ce5c-72d2-8bd5-f56a17758650', 'Product Manager', 'PM-001', 'Product Owner, UX Designer', 'SK-PM-2024-001', 'Mengelola product roadmap dan tim produk', 'OrganizationalStructure/job_titles/decrees/51aac80b-5071-44e0-8510-f52b3fb09aca.pdf', NULL, NULL, NULL, '2025-12-05 05:44:25', '2025-12-05 05:44:25'),
('019aee8b-ab6d-707c-8fc8-34147caf1254', 'Data Analyst', 'DA-001', 'Product Owner, UX Designer', 'SK-DA-2024-001', 'Menganalisis data untuk insights bisnis', 'OrganizationalStructure/job_titles/decrees/0d2e1a57-de48-406e-8aa2-ae3d308ccda9.pdf', NULL, NULL, NULL, '2025-12-05 05:45:22', '2025-12-05 05:45:22'),
('019af1bf-1070-72d9-b683-2fcafda9a775', 'test brian 1', 'D001', 'Manager', 'MN-TEC-010', '--test', 'OrganizationalStructure/job_titles/decrees/97079813-addd-46b6-ab0a-0f1713ffeeef.pdf', 'test delete', 'OrganizationalStructure/job_titles/delete-decrees/405932ce-4eae-4419-8e37-785c1c325e15.pdf', '2025-12-05 20:58:32', '2025-12-05 20:40:22', '2025-12-05 20:58:32'),
('019af1f7-cf50-7361-a984-fd675253deb4', 'DevOps Engineer', 'DO-001', 'System Administrator, Cloud Engineer', 'SK-DO-2024-001', 'Mengelola pipeline deployment dan infrastruktur cloud', 'OrganizationalStructure/job_titles/decrees/9f48ab52-46f7-45d2-83d4-c5a0a0f9bba9.pdf', NULL, NULL, NULL, '2025-12-05 21:42:20', '2025-12-05 21:42:20'),
('019af1fd-258e-7037-8179-f9709fd455f2', 'Financial Analyst', 'FA-001', 'Junior Financial Analyst, Accounting Assistant', 'SK-FA-2024-001', 'Melakukan analisis keuangan dan forecasting bisnis', 'OrganizationalStructure/job_titles/decrees/36dee827-1262-4cad-95cf-c6ff7ee2e08e.pdf', NULL, NULL, NULL, '2025-12-05 21:48:10', '2025-12-05 21:48:10'),
('019af1fe-3912-7152-80ed-b1fec6216e3a', 'Accounting Manager', 'ACC-MGR-001', 'Senior Accountant, Tax Specialist, Accounts Payable Officer', 'SK-ACC-2024-001', 'Mengelola tim akuntansi dan laporan keuangan', 'OrganizationalStructure/job_titles/decrees/9bc6d64d-d2b3-476a-903a-b57e813d4152.pdf', NULL, NULL, NULL, '2025-12-05 21:49:21', '2025-12-05 21:49:21'),
('019af1fe-dee9-7035-a1be-2dae0d66752d', 'HR Business Partner', 'HRBP-001', 'HR Specialist, Recruitment Specialist, Training Coordinator', 'SK-HRBP-2024-001', 'Mitra bisnis untuk manajemen SDM dan talent development', 'OrganizationalStructure/job_titles/decrees/ee0db3d6-448d-4b57-81f8-a3856c17b4d1.pdf', NULL, NULL, NULL, '2025-12-05 21:50:03', '2025-12-05 21:50:03'),
('019af1ff-9221-7025-a31b-da20807d6adb', 'Talent Acquisition Specialist', 'TAS-001', 'Recruitment Coordinator, Sourcing Specialist', 'SK-TAS-2024-001', 'Menangani proses rekrutmen dan seleksi kandidat', 'OrganizationalStructure/job_titles/decrees/cf81394c-5a78-48f4-9716-25c742e05029.pdf', NULL, NULL, NULL, '2025-12-05 21:50:49', '2025-12-05 21:50:49');

-- --------------------------------------------------------

--
-- Table structure for table `mt_offices`
--

CREATE TABLE `mt_offices` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_description` text COLLATE utf8mb4_unicode_ci,
  `office_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_employee_count` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_delete_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_delete_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_offices`
--

INSERT INTO `mt_offices` (`id`, `office_name`, `office_decree_number`, `office_description`, `office_decree_file`, `office_employee_count`, `office_delete_decree_number`, `office_delete_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019adab2-98de-72ed-848f-cc1c3b7639c4', 'ini kantor ai', 'ini sk kantor', 'ini knator di bidang ai', 'OrganizationalStructure/offices/decree/f7adae0d-e8ba-4a16-a0a1-bb2c38017594.pdf', NULL, NULL, NULL, NULL, '2025-12-01 09:15:28', '2025-12-01 09:15:28'),
('019add4a-82ac-70fd-9e10-dee1ee781f67', 'ini kantor iot', 'ini sk kantor', 'ini knator di bidang iot', 'OrganizationalStructure/offices/decree/014a0782-b304-4910-93d0-275502eca834.pdf', NULL, NULL, NULL, NULL, '2025-12-01 21:20:39', '2025-12-01 21:56:20'),
('019ae738-4825-7227-90d5-89a73e8611ba', 'test brian', '3333', 'test', 'OrganizationalStructure/offices/decree/52b56003-0ca6-42a3-b9df-8cc8857a24e5.pdf', NULL, 'test delete', 'OrganizationalStructure/office/delete-decree/c100a3d8-2fa1-4908-b04f-e1cc79c92f72.pdf', '2025-12-03 21:00:01', '2025-12-03 19:36:56', '2025-12-03 21:00:01'),
('019ae7a1-ad9e-736f-9e9b-3b48be6613cb', 'test brian', '33444', 'test', 'OrganizationalStructure/office/decree/cc53e67d-f611-4978-9c66-7545803efb94.pdf', NULL, NULL, NULL, NULL, '2025-12-03 21:32:03', '2025-12-03 21:32:03'),
('019af2c7-93f9-734c-a4b1-6ff20255f8d3', 'jadi 2 aja', 'ini ks tes', 'entah  1', 'OrganizationalStructure/office/decree/c743c520-f239-45cb-8ad5-f5a4524a2b3d.pdf', NULL, NULL, NULL, NULL, '2025-12-06 01:29:17', '2025-12-14 23:31:08'),
('019af2d5-b017-7377-8117-a24b457c26ae', 'fff', 'ee', 'aa', 'OrganizationalStructure/office/decree/5c229854-b206-40a6-b021-1e00f18ceb1c.pdf', NULL, NULL, NULL, NULL, '2025-12-06 01:44:41', '2025-12-06 01:44:41'),
('019af2d8-b94d-70ea-85ba-03c0c9be7ef9', 'test 3', '33', 'ee', 'OrganizationalStructure/office/decree/ec33551b-6e85-4b26-88f2-572daf040228.pdf', NULL, NULL, NULL, NULL, '2025-12-06 01:48:00', '2025-12-06 01:48:00'),
('019b2084-f3fe-7389-a651-103e0166fe03', 'ini kantor tes 2 perusahaan', 'ini sk kantor', 'ini knator di bidang iot', 'OrganizationalStructure/office/decree/4d048a2a-5ce6-4997-8037-fb1687621afe.pdf', NULL, NULL, NULL, NULL, '2025-12-14 22:39:02', '2025-12-14 22:39:02'),
('019b20cb-100a-7165-9278-1cff3d0f8a6e', 'test brian', '333', 'test', 'OrganizationalStructure/office/decree/c5e37e83-b611-4e35-be77-ade360a1f63e.pdf', NULL, NULL, NULL, NULL, '2025-12-14 23:55:37', '2025-12-14 23:55:37'),
('019b20cc-c87d-721b-a6ff-f94f8547fb23', 'jadi 2 aja', 'ini ks tes', 'entah  1', 'OrganizationalStructure/Office/Decree/f364c720-2df9-4f88-be06-44435861cb7c.pdf', NULL, NULL, NULL, NULL, '2025-12-14 23:57:30', '2025-12-18 13:41:42'),
('019b3313-c1b6-73c1-89de-91891185e6ab', 'ini kantor tes 2 perusahaan oke', 'ini sk kantor', 'ini knator di bidang iot', 'OrganizationalStructure/office/decree/5133ca56-cf12-44ca-baac-31125e5f5fe7.pdf', NULL, 'tes', 'OrganizationalStructure/Office/DeleteDecree/449f14b6-8ee5-4a57-94a6-25e06f24b300.pdf', '2025-12-18 13:32:54', '2025-12-18 13:08:11', '2025-12-18 13:32:54'),
('019b3338-85e7-7368-83d7-82eefa3fe11a', 'jadi 2 aja', 'ini ks tes', 'entah  1', 'OrganizationalStructure/Office/Decree/dbbc4919-e90b-47a1-8f4d-f64e8ec686d0.pdf', NULL, 'tes', 'OrganizationalStructure/Office/DeleteDecree/479905ea-69c1-4156-825b-f65c5758ef79.pdf', '2025-12-18 13:56:15', '2025-12-18 13:48:20', '2025-12-18 13:56:15');

-- --------------------------------------------------------

--
-- Table structure for table `mt_positions`
--

CREATE TABLE `mt_positions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_title_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `directorate_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `division_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_description` text COLLATE utf8mb4_unicode_ci,
  `position_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_deleted_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mt_positions`
--

INSERT INTO `mt_positions` (`id`, `position_name`, `job_title_id`, `directorate_id`, `division_id`, `department_id`, `position_decree_number`, `position_description`, `position_decree_file`, `position_deleted_decree_file`, `position_deleted_decree_number`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019af20b-ad73-7195-a2ed-68843367a8fc', 'HR Business Partner', '019af1fe-dee9-7035-a1be-2dae0d66752d', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed98-eae2-7380-917a-309c0fe1d1c0', 'POS-HRBP-2024-001', 'Mengelola hubungan manajemen dan strategi SDM dalam organisasi.', 'OrganizationalStructure/position/decree/hrbp-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:04:02', '2025-12-05 22:04:02'),
('019af20b-dc89-7153-a530-bd6f58ac0595', 'Talent Acquisition Specialist', '019af1ff-9221-7025-a31b-da20807d6adb', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed98-eae2-7380-917a-309c0fe1d1c0', 'POS-TAS-2024-001', 'Melakukan rekrutmen, screening, dan seleksi kandidat.', 'OrganizationalStructure/position/decree/tas-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:04:14', '2025-12-05 22:04:14'),
('019af20b-fabf-725a-98d8-d19d2022165c', 'Accounting Manager', '019af1fe-3912-7152-80ed-b1fec6216e3a', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019ae833-9eee-71a2-929f-918f233f6d4e', '019aed99-53bc-71af-aa7f-07b317ff29d8', 'POS-ACC-MGR-2024-001', 'test', 'OrganizationalStructure/position/decree/95c6e167-5b1e-4712-9ea9-a5632ccd00af.pdf', NULL, NULL, NULL, '2025-12-05 22:04:22', '2025-12-06 01:23:14'),
('019af20c-213a-72ac-8e34-16c50bbcb3fa', 'Financial Analyst', '019af1fd-258e-7037-8179-f9709fd455f2', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019ae833-9eee-71a2-929f-918f233f6d4e', '019aed99-baf2-738f-9ba1-adde262af553', 'POS-FA-2024-002', 'Melakukan analisis keuangan, budgeting, dan forecasting.', 'OrganizationalStructure/position/decree/fa-2024-002.pdf', NULL, NULL, NULL, '2025-12-05 22:04:32', '2025-12-05 22:04:32'),
('019af20c-4552-723a-b86f-e3efe7c75c54', 'DevOps Engineer', '019aee8b-ab6d-707c-8fc8-34147caf1254', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed99-baf2-738f-9ba1-adde262af553', 'POS-DO-2024-001', 'Menangani CI/CD pipeline dan infrastruktur cloud.', 'OrganizationalStructure/position/decree/devops-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:04:41', '2025-12-05 22:04:41'),
('019af20c-734f-7359-b7c5-c78083be508b', 'Data Analyst', '019aee8b-ab6d-707c-8fc8-34147caf1254', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed99-baf2-738f-9ba1-adde262af553', 'POS-DA-2024-001', 'Melakukan analisis data dan menyediakan insight bisnis.', 'OrganizationalStructure/position/decree/data-analyst-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:04:53', '2025-12-05 22:04:53'),
('019af20c-918f-71a7-8aa2-6902074b71ec', 'Product Manager', '019aee8a-ce5c-72d2-8bd5-f56a17758650', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019ae833-9eee-71a2-929f-918f233f6d4e', '019aed99-53bc-71af-aa7f-07b317ff29d8', 'POS-PM-2024-001', 'Mengelola lifecycle produk dan koordinasi tim product.', 'OrganizationalStructure/position/decree/pm-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:05:01', '2025-12-05 22:05:01'),
('019af20c-ae51-71e8-a11c-e8a0a53dff5d', 'Senior Software Engineer', '019aee89-c7a1-7359-ba6b-86db2d8c41e1', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019ae833-9eee-71a2-929f-918f233f6d4e', '019aed99-baf2-738f-9ba1-adde262af553', 'POS-SSE-2024-001', 'Lead pengembangan software dan mentoring developer junior.', 'OrganizationalStructure/position/decree/sse-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:05:08', '2025-12-05 22:05:08'),
('019af20c-cc23-71cd-8573-f34d20da8b8c', 'Department Manager', '019aee3e-b586-727f-9464-6d819a5e6278', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-6a3b-7256-8cd9-67e528a413fa', '019aec86-d8f9-7309-ba15-f7c3273c2a2a', 'POS-MNG-2024-001', 'Memimpin pengelolaan departemen sesuai target bisnis.', 'OrganizationalStructure/position/decree/manager-2024-001.pdf', NULL, NULL, NULL, '2025-12-05 22:05:16', '2025-12-05 22:05:16'),
('019af20c-e9e9-7052-970f-f24f5b8d638b', 'IT Support Officer', '019aee8b-ab6d-707c-8fc8-34147caf1254', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed99-baf2-738f-9ba1-adde262af553', 'POS-ITS-2024-001', 'Mengelola troubleshooting jaringan dan perangkat user.', 'OrganizationalStructure/position/decree/its-2024-001.pdf', 'OrganizationalStructure/position/delete-decree/463881fb-ab6e-4a1f-aefe-6787a68b1e0b.pdf', 'ini sk oke', '2025-12-05 23:58:18', '2025-12-05 22:05:23', '2025-12-05 23:58:18'),
('019af279-9974-73eb-9630-2d353b23bc24', 'tes update 1', '019aee8b-ab6d-707c-8fc8-34147caf1254', '019ae265-320f-73ac-87c2-25b927de4e77', '019ae889-1ecb-7262-88ed-58868c0e4bf4', '019aed99-baf2-738f-9ba1-adde262af553', 'tes', 'tes', 'OrganizationalStructure/position/decree/7804fba2-6ad6-4180-ad53-d44939c95726.pdf', NULL, NULL, NULL, '2025-12-06 00:04:06', '2025-12-14 22:40:02'),
('019af2c2-8e14-7193-802c-4715a8a6d535', 'haloo', '019aee3e-b586-727f-9464-6d819a5e6278', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019ae89a-5755-716a-a445-ee9cf4b4156b', '019aed99-baf2-738f-9ba1-adde262af553', '555444', 'aa', 'OrganizationalStructure/position/decree/f17c4bf7-91e9-4ebb-88aa-1163e78fdd16.pdf', NULL, NULL, NULL, '2025-12-06 01:23:47', '2025-12-15 00:54:09');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ref_ptkp`
--

CREATE TABLE `ref_ptkp` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ref_ptkp`
--

INSERT INTO `ref_ptkp` (`id`, `code`, `category`, `rate`, `created_at`, `updated_at`) VALUES
('0a92fe77-be40-4ba1-a578-80c40ce75a82', 'K/I/2', 'Joint Married (Husband & Wife)', 121500000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('1bc901c0-5037-47f3-bb99-449af83eba4d', 'K/I/1', 'Joint Married (Husband & Wife)', 117000000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('1d3b7db5-1580-4e28-be4e-6709039a9e72', 'K/2', 'Married', 67500000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('1e989b06-3ac6-4a84-ab19-23a0c42aa852', 'TK/3', 'Single', 67500000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('3203aaef-d260-4263-8cf0-989bf4143768', 'K/0', 'Married', 58500000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('689119c0-f646-4314-9f59-c31409fcaf32', 'K/I/0', 'Joint Married (Husband & Wife)', 112500000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('8282cf5c-06fd-452b-a5bd-e63696d4d852', 'TK/1', 'Single', 58500000, '2025-12-08 00:16:16', '2025-12-08 00:16:16'),
('84649b16-fa71-4074-bd90-49b36386f983', 'TK/0', 'Single', 54000000, '2025-12-08 00:16:16', '2025-12-08 00:16:16'),
('89b895d4-fb53-4087-8776-96ac3633becf', 'K/I/3', 'Joint Married (Husband & Wife)', 126000000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('91a80efc-8752-46c6-954a-0da18f1d1fa9', 'K/3', 'Married', 72000000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('a96b3869-1520-4474-981b-a8cba42d8ce1', 'K/1', 'Married', 63000000, '2025-12-08 00:16:17', '2025-12-08 00:16:17'),
('f0b62ef2-ed44-48e9-b239-fa97cb4fd231', 'TK/2', 'Single', 63000000, '2025-12-08 00:16:17', '2025-12-08 00:16:17');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('AmbtLNl7TIKIMurVjk3GHhNxsyYNdeLRlBJCSvUx', NULL, '192.168.1.44', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNFBXOGdEODB4b0E2Z2VUSExnVjNkaUtobldhVm1pQzJJVHlRRldKaiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjQ6Imh0dHA6Ly8xOTIuMTY4LjEuMjQ6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764643874),
('ArHyP7IMIfsO30EwYokJHrvOyr6IwCxKqr4PNHMe', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQWZjU2xsR2ZkenZNcHdyd0tETEtJWFRuRGlWbXo4TUdzNks5Znp3byI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764670646),
('dtZQcs9d3yVFKqUqG39kVK4KbTn3NIttm6sW8Gw8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidlN2Y3BwbXFSeEJ3ZHRkWlMwYU1rdjV1SWpjOFI4VTYwTmxhQkdrcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764734915),
('F6WUkDbiinaU3cegUYzguqxC3RwoKYXYkbmQCbVF', NULL, '192.168.1.24', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYmtVbG04M1RUbTZYTHYwOHh4YXJUcEt6RGFmOEFWbTF4TzBabEdsWCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjQ6Imh0dHA6Ly8xOTIuMTY4LjEuMjQ6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764650311),
('fkMs0aFRR3E2kYZpzO0wZwjrwZI47gV2Dx7cVDk0', NULL, '127.0.0.1', 'WhatsApp/2.23.20.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSkoxTU14TkgwWlZxWjBaa0IycHJYUVo4OWdKUWxoY3BvWHFuQ2dEdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764669358),
('gaFuypjzaWwkoyGcbnWf5bDsYTIkiKCU5M3DttKa', NULL, '10.12.54.83', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZkViNVJhZDFXaDlhSmVadUptSHNZZHVoeUQwTzBiUERPYWNWMXJJdCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjM6Imh0dHA6Ly8xMC4xMi41NC45ODo4MDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1765606534),
('HYZ6GiR6tQXWrkDxZZ7bFwkLiAKZcOhhEYhcsNwD', NULL, '127.0.0.1', 'WhatsApp/2.23.20.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZVBEVGk3UUdWMDFabmxSMFJhbWJ2R2xrM3h3UjdPTkFkWWtJeEQ5TyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9mOWI5ZTc5ZmI5MTAubmdyb2stZnJlZS5hcHAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764728301),
('Jp54tlaGcTlUaXe2zJbrR08pvvEcffYa8O5dSRNP', NULL, '192.168.1.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTGtiZFNvN3NnQmhMaEZvVzc3bGs4YzRNbU54WkZZbzVXTkJqZzhydyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjM6Imh0dHA6Ly8xOTIuMTY4LjEuOTo4MDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1764728840),
('K3mD3dMcgkuWyvNocANUE0SA5KN0yrzCh6U0ufku', NULL, '192.168.0.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZDNac3EweGdDaFlmaDliU25PR2lJdEhGaE9jQndLSzdkNHhPZWl2UiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xOTIuMTY4LjAuMTAzOjgwMDAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1766155571),
('kdWwvNA9ZssfmDDtZbsP0cuGfU8s4xuaVgr6XWRn', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN2Z4V2Z1U0JpUzhGb0FPMTY3UGJoTkJ0R1pRMEVIdGllZkt3clkydSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764670696),
('MBSam2Cvhtb3IgQigHJcq8YZafhEAOIINd8u41dW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRFB2S3d2ZVp6M01XenlGVWhmQ0h1c0ZpQ2pJNGRBQUlleVU4TVg5RSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9mOWI5ZTc5ZmI5MTAubmdyb2stZnJlZS5hcHAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764728493),
('nNLvuu75Ya057rnuaQSjJgQA7qheSCXKz35ucWph', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQUJOVWZlRlpzcU1XR09xT3oyejV4dHdCY09wQTY1NDNPQjBaM21LbCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly9mOWI5ZTc5ZmI5MTAubmdyb2stZnJlZS5hcHAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764728325),
('npshlhVTsFBwy34v0sKHQJkKIeDR0tcW87NbBpQs', NULL, '192.168.2.154', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM2NESXM3RXY3anpoSW1rU2hZN284VFlFTURDRHgwTXFkZ0NtT3R2bCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjU6Imh0dHA6Ly8xOTIuMTY4LjIuMTU0OjgwMDAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1766111251),
('pl0so9dgSBQYRF10A6mlZdo5eNzS0CwvIIQTUrUs', NULL, '192.168.1.9', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidGhKRTFDRWxja2dheXlNTEF3ejVCcTNqVFdNYlRYUGY5cUJhcEJHSSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjM6Imh0dHA6Ly8xOTIuMTY4LjEuOTo4MDAwIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1764748840),
('PywLzpMQSvqjQTtPD4DIz1v1mqy5y2qMfPq6G728', NULL, '127.0.0.1', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMVY2UU5vdVBDcllYd1NsN0Z4a2pZUTk4WDNVTWtMOFA2VFBORUdsbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764477459),
('smoIG56ns34IYHAPEIEAwWmcusjfArcoQLxmPUxu', NULL, '192.168.1.33', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMjZ5ejhCbjFkTXVnY2N6QVY0bFhWb21ZS2N0V0JINllFaFJWTTExTyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjQ6Imh0dHA6Ly8xOTIuMTY4LjEuMzM6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764822491),
('Sxi5JO1Kb32j3smy90ydQnKrQO4u8L7bzq6sVCV2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSVZPSEJVYkNRNzM5dnB5VUo4bnM4cm02bnZISThTRjBDanRJT2htaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly81NWUxNDAwZmE0NjUubmdyb2stZnJlZS5hcHAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764686032),
('thVurl1AOeOSZiPd3sz9KuNBAXFiuFfpQBNJqzcn', NULL, '127.0.0.1', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidlN4NmNHNHV6OHE4ZDVzbFpjbHI5VGVRWnlXTzBHTm84ZlEwUVB6MyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764649342),
('VCUgRtND822e9k0hCIJ75JB7gBkhjUu6S7QImCQM', NULL, '127.0.0.1', 'PostmanRuntime/7.49.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ2dLS1J1OWdmYWx6czNoQkRSMGR3ZFhwU1JHaVE2dnhwRkZlUFliRCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764488093),
('xBwUpIpgIXyBDipTXPdHiuqC99zwCQinN66vxXyG', NULL, '127.0.0.1', 'WhatsApp/2.23.20.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZG1RM21YcTZnekJ1bEF2Vk1VV3FvQ0RBREtINWRBMXlobmwwUkxDcCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly81NWUxNDAwZmE0NjUubmdyb2stZnJlZS5hcHAiO3M6NToicm91dGUiO047fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1764682895),
('zkKrDx2IqSV6buGS9gDdGGfy57BdH9LRIZi0TSDQ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiS2xZc2lJOXVsUUZwRkhLOUl1SjI5c3A3MkJUelB0WlUxRFhzREl2dSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1764485711);

-- --------------------------------------------------------

--
-- Table structure for table `tr_company_documents`
--

CREATE TABLE `tr_company_documents` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cd_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cd_decree_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cd_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cd_deleted_decree` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cd_deleted_decree_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_company_documents`
--

INSERT INTO `tr_company_documents` (`id`, `cd_name`, `cd_decree_number`, `cd_file`, `company_id`, `cd_deleted_decree`, `cd_deleted_decree_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019ad7e9-2351-7177-ab51-77d5849e373d', 'dokument 1', 'ini sk', 'company/decree/a88d84ef-b0aa-424e-9082-1aaf67bcc81c.pdf', '019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', NULL, NULL, '2025-12-06 05:24:03', '2025-11-30 20:16:11', '2025-12-06 05:24:03'),
('019ad7e9-2355-7328-8e60-eeefa2be5341', 'document 2', 'ini sk 2', 'company/decree/0c4ba6a4-d4a0-42a5-9801-cece9370061c.pdf', '019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', 'ini sk hapus', 'C:\\Users\\pc\\AppData\\Local\\Temp\\php3D78.tmp', '2025-12-06 05:28:50', '2025-11-30 20:16:11', '2025-12-06 05:28:50'),
('019ad7eb-5e0c-7000-8794-4cf8751c7445', 'dokument 1', 'ini sk', 'company/decree/67a22979-66d3-45ca-a361-c2fad0b61094.pdf', '019ad7eb-5df0-7383-b933-c4f1c208db39', NULL, NULL, '2025-12-06 10:51:38', '2025-11-30 20:18:37', '2025-11-30 20:18:37'),
('019ad7eb-5e11-736d-9d6b-4576682d650e', 'document 2', 'ini sk 2', 'company/decree/8ce0ac2b-99b9-478d-99fd-b01cde44f8ef.pdf', '019ad7eb-5df0-7383-b933-c4f1c208db39', 'ini sk hapus', 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpB430.tmp', '2025-12-06 05:29:19', '2025-11-30 20:18:37', '2025-12-06 05:29:19'),
('019add3b-ae10-70a3-8e0d-4c6531564850', 'dokument 1', 'ini sk', 'company/decree/92730d97-acf6-4ce1-8475-23a565b8f0fa.pdf', '019add3b-a859-7231-9648-63b5aa72b372', 'ini sk hapus', 'OrganizationalStructure/company/delete-decree-file/eca8fcd6-1dd3-458d-a768-6f347e7ebdec.pdf', '2025-12-06 05:31:54', '2025-12-01 21:04:27', '2025-12-06 05:31:54'),
('019add3b-ae13-7010-8670-c446d67dbad0', 'document 2', 'ini sk 2', 'company/decree/99fa3b6d-15dd-4d64-ac22-188ace3473c8.pdf', '019add3b-a859-7231-9648-63b5aa72b372', NULL, NULL, NULL, '2025-12-01 21:04:27', '2025-12-01 21:04:27'),
('019ae21c-341d-7362-839c-79841b0e77fd', 'Dokumen', '11222', 'OrganizationalStructure/company/decree/e6fb8a12-f715-473a-acfc-fb16cb09f520.pdf', '019ae21c-307b-717e-9e7b-86e2eb42e681', NULL, NULL, NULL, '2025-12-02 19:48:10', '2025-12-02 19:48:10'),
('019ae307-c988-7299-80f3-6c4cc4201d6b', 'Dokumen', 'cek test', 'OrganizationalStructure/company/decree/d0b7795a-6896-499a-89f8-fd682e466db2.pdf', '019ae307-c96f-7038-b669-5118d038e0b9', NULL, NULL, NULL, '2025-12-03 00:05:29', '2025-12-03 00:05:29'),
('019ae30d-0c2f-703f-81f7-cd2c05c11cfa', 'test', 'testt3', 'OrganizationalStructure/company/decree/9388be65-ba14-4b8d-be66-843741331eb7.pdf', '019ae30d-0c18-7058-b9cb-050a513baae6', NULL, NULL, NULL, '2025-12-03 00:11:14', '2025-12-03 00:11:14'),
('019ae30d-0c32-737c-94c3-6ca9f5e16e0e', 'aa', 'aa', 'OrganizationalStructure/company/decree/2b773c80-82fe-4fe6-9177-0b7b4de4d423.pdf', '019ae30d-0c18-7058-b9cb-050a513baae6', NULL, NULL, NULL, '2025-12-03 00:11:14', '2025-12-03 00:11:14'),
('019ae365-413f-728e-abd6-e52b9ffb6e38', 'test', 'tet', 'OrganizationalStructure/company/decree/1ef33d77-a9b8-416c-a0a5-7d160668a965.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-03 01:47:35', '2025-12-03 01:47:35'),
('019af37b-962d-71a3-bc09-c104d67cd4f1', 'gak tau 1', 'sk1', 'OrganizationalStructure/company/decree/8bbd780e-d1f4-4892-96ce-645cf220ae90.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:45:54', '2025-12-06 04:45:54'),
('019af37b-9632-70fb-a0f2-8b77cabf3aa9', 'gak tau 2', 'gak tau 2', 'OrganizationalStructure/company/decree/b136b10e-6861-4988-9b20-b37988ffda6e.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:45:54', '2025-12-06 04:45:54'),
('019af37c-02d4-7342-8aff-18a00784f5da', 'gak tau 2', 'sk2', 'OrganizationalStructure/company/decree/4fc48f61-76ce-44cf-ad8a-c786d7266f8a.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:46:22', '2025-12-06 04:46:22'),
('019af37c-02d9-71d0-9d00-4f48a066a940', 'gak tau 3', 'gak tau 3', 'OrganizationalStructure/company/decree/75eb2bc1-dd9f-41c8-a069-99e18143f125.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:46:22', '2025-12-06 04:46:22'),
('019af37d-fbff-73d0-a51d-783041c1518b', 'gak tau 3', 'sk3', 'OrganizationalStructure/company/decree/99c2c49e-51c9-45c7-9605-70cf9c6236b6.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:48:31', '2025-12-06 04:48:31'),
('019af37d-fc03-7142-89ec-0e8d0ad16f70', 'gak tau 4', 'gak tau 4', 'OrganizationalStructure/company/decree/d86aae53-cad3-4d1a-8711-68137e19fc46.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-06 04:48:31', '2025-12-06 04:48:31'),
('019afbd6-7a39-70d0-ada1-19db34703acc', 'brian test upload file 1', '22333', 'OrganizationalStructure/company/decree/50eb0cdf-f32f-4b3b-937a-e31082ea5b59.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-07 19:42:08', '2025-12-07 19:42:08'),
('019afbd6-7a50-7211-a167-0f02d9ffe722', 'brian test  upload dokumen 2', '334455', 'OrganizationalStructure/company/decree/87ade396-81ee-4970-a9ac-e443e6a5306c.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-07 19:42:08', '2025-12-07 19:42:08'),
('019b1198-7c49-7242-b126-15f7b42282b0', 'gak tau 3', 'sk3', 'OrganizationalStructure/company/decree/8ffd9fb0-99ac-4c07-b82a-0f0050cabc70.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-12 01:06:04', '2025-12-12 01:06:04'),
('019b1198-7c4f-71bd-8b18-48c78bd58f4a', 'gak tau 4', 'gak tau 4', 'OrganizationalStructure/company/decree/46317623-a50a-429c-8e6e-4753bb8b1718.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-12 01:06:04', '2025-12-12 01:06:04'),
('019b3121-1f9d-72a0-bf40-a07772726388', 'dokument 1', 'ini sk', 'OrganizationalStructure/company/decree/10bee901-45de-4555-a361-4b08781ca842.pdf', '019b3121-1f8a-723d-a640-2bbdc2635aa4', NULL, NULL, NULL, '2025-12-18 04:03:33', '2025-12-18 04:03:33'),
('019b3121-1fb3-7213-9746-4304e79fc92b', 'document 2', 'ini sk 2', 'OrganizationalStructure/company/decree/58466858-0db5-460d-b149-573cf91e26a7.pdf', '019b3121-1f8a-723d-a640-2bbdc2635aa4', NULL, NULL, NULL, '2025-12-18 04:03:33', '2025-12-18 04:03:33'),
('019b315c-2ca5-72bb-99ed-bdabb4982bec', 'gak tau 3', 'sk3', 'OrganizationalStructure/Company/Decree/5b0a1bce-b646-4f5b-a0f4-82106a809fb0.pdf', '019ae365-412f-701f-983f-b17071f92ba2', 'ini sk hapus', 'OrganizationalStructure/Company/Delete-Decree-File/d901add7-dcf1-461f-a3d7-f39ee767575d.pdf', '2025-12-18 11:13:54', '2025-12-18 05:08:02', '2025-12-18 11:13:54'),
('019b315c-2ca9-723d-9fc9-1e649758c525', 'gak tau 4', 'gak tau 4', 'OrganizationalStructure/Company/Decree/67cb949b-05bc-4841-a0c5-39cf49213978.pdf', '019ae365-412f-701f-983f-b17071f92ba2', 'ini sk hapus', 'OrganizationalStructure/company/delete-decree-file/93e6fb02-b40b-4a8e-8b7b-39929670f25f.pdf', '2025-12-18 05:32:59', '2025-12-18 05:08:02', '2025-12-18 05:32:59'),
('019b3282-332d-7114-bdb4-76e0decfe7d3', 'dokument 1', 'ini sk', 'OrganizationalStructure/company/decree/80d8acaf-8405-48a1-afd7-153c23aba4c5.pdf', '019b3282-2da4-7004-a64c-19fb82446dea', NULL, NULL, NULL, '2025-12-18 10:29:12', '2025-12-18 10:29:12'),
('019b3282-3331-729e-af6e-8c4e3cc910ba', 'document 2', 'ini sk 2', 'OrganizationalStructure/company/decree/d903a056-84df-4340-aad0-b22a8ab1ad97.pdf', '019b3282-2da4-7004-a64c-19fb82446dea', NULL, NULL, NULL, '2025-12-18 10:29:12', '2025-12-18 10:29:12'),
('019b3284-2344-739a-9520-612fea235083', 'dokument 1', 'ini sk', 'OrganizationalStructure/company/decree/e0e42f05-8d6e-4272-aaa8-95da97e9384f.pdf', '019b3284-232b-72cd-beca-bbd44b8b4847', NULL, NULL, NULL, '2025-12-18 10:31:19', '2025-12-18 10:31:19'),
('019b3284-234a-73fa-baf2-d7e319618c82', 'document 2', 'ini sk 2', 'OrganizationalStructure/company/decree/79e90788-41bd-462d-95d7-906e181ceb71.pdf', '019b3284-232b-72cd-beca-bbd44b8b4847', NULL, NULL, NULL, '2025-12-18 10:31:19', '2025-12-18 10:31:19'),
('019b32a7-6d35-7049-9562-3b9919ee2ad4', 'gak tau 3', 'sk3', 'OrganizationalStructure/Company/Decree/ebecfa93-4f1c-49a6-b377-f6493c0b6386.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-18 11:09:51', '2025-12-18 11:09:51'),
('019b32a7-6d3c-709f-86c6-91adc9c9ad4d', 'gak tau 4', 'gak tau 4', 'OrganizationalStructure/Company/Decree/576ee941-c559-447c-9a7d-5b5a8f233fd1.pdf', '019ae365-412f-701f-983f-b17071f92ba2', NULL, NULL, NULL, '2025-12-18 11:09:51', '2025-12-18 11:09:51');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_contracts`
--

CREATE TABLE `tr_employee_contracts` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contract_status` int NOT NULL COMMENT '1=active, 2=inactive, 3=probation, 4=resigned',
  `last_contract_signed_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `contract_type` int NOT NULL COMMENT '1 = pkwt, 2 = pkwtt',
  `contract_number` int NOT NULL,
  `file_contract` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_contracts`
--

INSERT INTO `tr_employee_contracts` (`id`, `employee_id`, `contract_status`, `last_contract_signed_date`, `end_date`, `contract_type`, `contract_number`, `file_contract`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b2b50-935d-7233-9566-ec2ff1d66ab3', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 2, '2024-01-15', '2025-01-15', 1, 1, 'C:\\Users\\pc\\AppData\\Local\\Temp\\phpE04B.tmp', NULL, '2025-12-17 00:57:39', '2025-12-17 00:57:39'),
('019b2b64-09f0-702c-815a-b56903aa3a8d', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 2, '2024-01-15', '2025-01-15', 1, 1, 'C:\\Users\\pc\\AppData\\Local\\Temp\\php56F7.tmp', NULL, '2025-12-17 01:18:55', '2025-12-17 01:18:55'),
('019b2b69-84d0-70c2-96ec-bc5fe7902888', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 2, '2024-01-15', '2025-01-15', 1, 1, 'EmployeeMasterData/DocumentContract/f8c5a84d-588d-468b-be52-dcf845bda4fd.pdf', NULL, '2025-12-17 01:24:54', '2025-12-17 01:24:54'),
('019b2f4b-bc11-7376-9814-ac938ca56764', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 1, '2024-01-15', '2025-01-15', 1, 1, 'EmployeeMasterData/DocumentContract/bc4765e2-351f-405b-a4c3-6a5fa4b6eb67.pdf', NULL, '2025-12-17 19:30:51', '2025-12-17 19:30:51'),
('019b2f82-695c-7251-9936-065843760f79', 'DSR001', 1, '2025-12-01', '2026-12-01', 1, 1, 'EmployeeMasterData/DocumentContract/573c0f87-70f0-4c59-a553-bfbb649e5ed6.pdf', NULL, '2025-12-17 20:30:34', '2025-12-17 20:30:34');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_documents`
--

CREATE TABLE `tr_employee_documents` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` int DEFAULT NULL COMMENT '1=Foto Terbaru, 2=Kartu Tanda Penduduk, 3=Ijazah Terakhir, 4=Kartu Keluarga, 5=BPJS Kesehatan, 6=BPJS Ketenagakerjaan, 7=NPWP, 8=Surat Keterangan Pengalaman Kerja, 9=Surat Perjanjian Bersama, 10=NDA, 11=Jobdesk, 12=Pakta Integritas, 13=PKWT/PKWTT',
  `name_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_documents`
--

INSERT INTO `tr_employee_documents` (`id`, `file_type`, `name_file`, `file`, `employee_id`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b0b60-1741-736d-a921-04a159d2e83c', 1, NULL, 'EmployeeMasterData/Document/30b5410c-cd62-4d13-81e1-dc731bed91bc.pdf', '019b0b60-173a-7260-a049-d494f5707e8c', NULL, '2025-12-10 20:06:45', '2025-12-10 20:06:45'),
('019b0b63-4238-7128-af02-5f8db7b4c26d', 1, NULL, 'EmployeeMasterData/Document/98dd0a3e-cf60-446c-ace5-52061aad9b15.pdf', '019b0b63-4230-709d-9e45-3c51e9b51166', NULL, '2025-12-10 20:10:13', '2025-12-10 20:10:13'),
('019b0b69-c49a-72e4-a814-e30aaa56e480', 1, NULL, 'EmployeeMasterData/Document/70b170be-5f72-4c37-a8c3-9f8753ee0d47.pdf', '019b0b69-c493-7145-addc-593ee8065d05', NULL, '2025-12-10 20:17:19', '2025-12-10 20:17:19'),
('019b1206-2922-72f6-8003-046b04bfa3bc', 1, NULL, 'EmployeeMasterData/Document/bbb2b2b5-f02e-4d06-b23e-8c68d94e4af4.pdf', '019b1206-291a-706f-8f10-b6564107f57f', NULL, '2025-12-12 03:05:52', '2025-12-12 03:05:52'),
('019b15fe-3494-724b-bd52-d647d44bd7d2', 1, NULL, 'EmployeeMasterData/Document/b671fedc-9e81-425f-b5e9-7228d378f35c.pdf', '019b15fe-348b-7026-9221-1467f8eea5ff', NULL, '2025-12-12 21:35:39', '2025-12-12 21:35:39'),
('019b16b8-9801-733d-b026-945fbdb0ee95', 1, NULL, 'EmployeeMasterData/Document/6ca8d846-0dce-4ab5-8c08-deb43e3e0c46.pdf', '019b16b8-97be-720c-8f85-13d1f727fd33', NULL, '2025-12-13 00:59:14', '2025-12-13 00:59:14'),
('019b2000-8ff3-71d4-a82f-7eb29fb1567c', 3, NULL, 'EmployeeMasterData/Document/f7c1037b-101b-4b75-ad43-d8aa28281332.pdf', '019b2000-8fba-7040-b0c2-748d6ea5ddd2', NULL, '2025-12-14 20:14:26', '2025-12-14 20:14:26'),
('019b221a-bbab-705e-8744-f15c965bb01a', 1, NULL, 'EmployeeMasterData/Document/51e280e9-b15e-4c23-90af-3598f2341559.pdf', '019b221a-bb6d-737d-be0e-672f8a7b2bd4', NULL, '2025-12-15 06:02:15', '2025-12-15 06:02:15'),
('019b2225-7b88-738e-a020-ae2b9469142f', 1, NULL, 'EmployeeMasterData/Document/0955921a-c7ad-40ab-a5c9-34fc66e53469.pdf', '019b2225-7b7c-71ec-8ff4-e38df930506f', NULL, '2025-12-15 06:14:00', '2025-12-15 06:14:00'),
('019b251d-7bb7-7162-8db2-6641b6d459c8', 2, NULL, 'EmployeeMasterData/Document/d19f7c40-3c01-4478-8647-73b6750c8231.pdf', '019b251d-7b7a-72bd-a9e9-d1e6acf89d7f', NULL, '2025-12-15 20:04:07', '2025-12-15 20:04:07'),
('019b2630-fa10-7242-b899-5b64a456d8b1', 1, NULL, 'EmployeeMasterData/Document/7d2519f9-1f09-4f4e-be1c-40e5a9fb4213.pdf', '019b2630-fa04-702c-b1cf-e20b018fd0ec', NULL, '2025-12-16 01:05:02', '2025-12-16 01:05:02'),
('019b2635-a1b1-7282-a7e6-706785b0bd7a', 1, NULL, 'EmployeeMasterData/Document/bb2ee34d-af32-4b26-b044-86364742f278.pdf', '019b2635-a1a5-71d9-a7f2-b30831cc893f', NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd66-7261-9c63-2471e4d1c7a4', 1, 'f6859868-2f52-4e27-af4b-0124fcf46435.pdf', 'EmployeeMasterData/Document/f6859868-2f52-4e27-af4b-0124fcf46435.pdf', '019b2ae4-cd5d-709f-997e-e8a0384443e0', NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-1032-7340-a7cb-eade7e735fb2', 1, 'tes1.pdf', 'EmployeeMasterData/Document/4c25a98f-89fe-4d56-8479-22cc4448aacb.pdf', '019b2aef-1026-713b-8211-466be6a8954c', NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd72-706d-b336-b15b3db5c60d', 2, 'dummy-pdf_2.pdf', 'EmployeeMasterData/Document/372552d2-5553-45ef-9f50-84e39d0cf406.pdf', '019b2b02-dd65-7084-a30f-1f943a3d2e64', NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb66-71d8-86ce-35144af96c3b', 1, 'tes1.pdf', 'EmployeeMasterData/Document/66738d05-b2c7-496f-9bd4-a815532b0d87.pdf', '019b2b0f-cb59-7228-b9fb-25a4c24eff35', NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41db-7011-9265-6ffc4ef1c1c3', 1, 'tes1.pdf', 'EmployeeMasterData/Document/df7b90e4-cd43-4b17-9257-95aba60dc825.pdf', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b8d-2501-73d3-acd5-778abdd25c8f', 2, 'dummy-pdf_2.pdf', 'EmployeeMasterData/Document/bcd42049-aec2-449a-9ba7-a408eb2ac5b7.pdf', '019b2b8d-24fa-726c-a200-59d718b44a7a', NULL, '2025-12-17 02:03:48', '2025-12-17 02:03:48'),
('019b2f63-2d69-7050-9ad9-d3aa4b7c204d', 1, 'tes1.pdf', 'EmployeeMasterData/Document/a6b7abeb-0834-4833-9f7f-f309b328532c.pdf', 'DSR001', NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_formal_educations`
--

CREATE TABLE `tr_employee_formal_educations` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `education_level` int DEFAULT NULL COMMENT '1 = sd, 2 = smp, 3 = sma, 4 = d1, 5 = d2, 6 = d3, 7 = s1, 8 = s2, 9 = s3',
  `institution_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `degree` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `final_grade` int DEFAULT NULL,
  `major` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `graduation_year` int DEFAULT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_formal_educations`
--

INSERT INTO `tr_employee_formal_educations` (`id`, `education_level`, `institution_name`, `degree`, `final_grade`, `major`, `graduation_year`, `employee_id`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b0b69-c49d-7080-9faa-f046060cfc16', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b0b69-c493-7145-addc-593ee8065d05', NULL, '2025-12-10 20:17:19', '2025-12-10 20:17:19'),
('019b1206-292b-71f2-8d58-926ae11a8753', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b1206-291a-706f-8f10-b6564107f57f', NULL, '2025-12-12 03:05:52', '2025-12-12 03:05:52'),
('019b15fe-3498-7099-9481-8cbf3d134a44', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b15fe-348b-7026-9221-1467f8eea5ff', NULL, '2025-12-12 21:35:39', '2025-12-12 21:35:39'),
('019b16b8-982e-70ad-9834-0e7286b85af6', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b16b8-97be-720c-8f85-13d1f727fd33', NULL, '2025-12-13 00:59:14', '2025-12-13 00:59:14'),
('019b2000-900e-72d6-a238-1471b2bc613b', 1, 'test', 'test', 333, 'vvvv', 2022, '019b2000-8fba-7040-b0c2-748d6ea5ddd2', NULL, '2025-12-14 20:14:26', '2025-12-14 20:14:26'),
('019b221a-bbc8-73d9-9066-923200bbaf1c', 7, 'test', 'sarjana', 4, 'teknik informatika', 2022, '019b221a-bb6d-737d-be0e-672f8a7b2bd4', NULL, '2025-12-15 06:02:16', '2025-12-15 06:02:16'),
('019b2225-7b8c-71fe-bff2-c591e39049da', 1, 'sss', 'aaaa', 444, 'aaa', 2025, '019b2225-7b7c-71ec-8ff4-e38df930506f', NULL, '2025-12-15 06:14:00', '2025-12-15 06:14:00'),
('019b251d-7bde-70e9-9c28-9b6ebcf42838', 1, 'test', 'test', 3, 'test', 2022, '019b251d-7b7a-72bd-a9e9-d1e6acf89d7f', NULL, '2025-12-15 20:04:07', '2025-12-15 20:04:07'),
('019b2630-fa14-71e4-870d-7edf862767a0', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2630-fa04-702c-b1cf-e20b018fd0ec', NULL, '2025-12-16 01:05:02', '2025-12-16 01:05:02'),
('019b2635-a1b4-7133-9079-96a54ea8ba91', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2635-a1a5-71d9-a7f2-b30831cc893f', NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd6a-708c-827f-9af0ae010878', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2ae4-cd5d-709f-997e-e8a0384443e0', NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-1035-726a-be33-4786d29a1470', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2aef-1026-713b-8211-466be6a8954c', NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd76-7255-a6ce-0a6118e45d97', 7, 'test', 'aha', 3, 'test', 2022, '019b2b02-dd65-7084-a30f-1f943a3d2e64', NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb69-7015-af30-d60da29f938c', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2b0f-cb59-7228-b9fb-25a4c24eff35', NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b0f-cb6b-709a-8f26-37f199dbb731', 2, 'tes', '4', 4, 'tes', NULL, '019b2b0f-cb59-7228-b9fb-25a4c24eff35', NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41de-7063-9048-3c01e8fe5eb4', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b20-41e0-73bc-94f3-41c0d6ba36b1', 2, 'tes', '4', 4, 'tes', 2025, '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b8d-2503-725e-b21e-4818a9f44ec4', 1, 'aaaa', 'aasss', 34, 'test', 2022, '019b2b8d-24fa-726c-a200-59d718b44a7a', NULL, '2025-12-17 02:03:48', '2025-12-17 02:03:48'),
('019b2f63-2d6e-73c6-8713-f5db4a85c8ca', 1, 'hasbu', 'strkom', 4, 'teknologi informasi', 2025, 'DSR001', NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27'),
('019b2f63-2d70-7049-a11d-91b0b3d74943', 2, 'tes', '4', 4, 'tes', 2025, 'DSR001', NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_non_formal_educations`
--

CREATE TABLE `tr_employee_non_formal_educations` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificate_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institution_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `certificate_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certificate_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_non_formal_educations`
--

INSERT INTO `tr_employee_non_formal_educations` (`id`, `employee_id`, `certificate_name`, `institution_name`, `start_date`, `end_date`, `certificate_id`, `certificate_file`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b0b60-1744-729b-bbdd-94c75011dcdb', '019b0b60-173a-7260-a049-d494f5707e8c', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', NULL, NULL, '2025-12-10 20:06:45', '2025-12-10 20:06:45'),
('019b0b63-423b-7164-a936-e646d5e8205c', '019b0b63-4230-709d-9e45-3c51e9b51166', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', NULL, NULL, '2025-12-10 20:10:13', '2025-12-10 20:10:13'),
('019b0b69-c4a2-730c-98e4-65a99e4583dc', '019b0b69-c493-7145-addc-593ee8065d05', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', NULL, NULL, '2025-12-10 20:17:19', '2025-12-10 20:17:19'),
('019b1206-2933-72e0-afd8-d84405746996', '019b1206-291a-706f-8f10-b6564107f57f', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/ed83d941-6a2d-40b1-847d-64f0965dedf0.pdf', NULL, '2025-12-12 03:05:52', '2025-12-12 03:05:52'),
('019b15fe-349b-7276-876c-2847c36151a6', '019b15fe-348b-7026-9221-1467f8eea5ff', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/7dfa2842-f686-4e5f-9ae3-33ad251f6510.pdf', NULL, '2025-12-12 21:35:39', '2025-12-12 21:35:39'),
('019b16b8-985a-73d8-ac5e-3f29f7a747df', '019b16b8-97be-720c-8f85-13d1f727fd33', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/9f33b6f7-b1d2-4007-aa40-34f476c282ea.pdf', NULL, '2025-12-13 00:59:15', '2025-12-13 00:59:15'),
('019b2225-7b90-70f0-98a5-850925278368', '019b2225-7b7c-71ec-8ff4-e38df930506f', 'ee', 'aa', '2025-12-08', '2025-12-01', '223334', 'EmployeeMasterData/Education/non-formal/fc5aae86-d710-49ed-ab05-873cd1589fc3.pdf', NULL, '2025-12-15 06:14:00', '2025-12-15 06:14:00'),
('019b2630-fa17-72a5-b893-13269df6a521', '019b2630-fa04-702c-b1cf-e20b018fd0ec', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/a731a406-129f-4bee-a142-807dfdb26c81.pdf', NULL, '2025-12-16 01:05:02', '2025-12-16 01:05:02'),
('019b2635-a1b7-73a4-960d-27628716d883', '019b2635-a1a5-71d9-a7f2-b30831cc893f', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/57ba71ce-075a-42c5-a250-57bb2f475cab.pdf', NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd6c-73a3-b45e-a5cae65a9bff', '019b2ae4-cd5d-709f-997e-e8a0384443e0', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/28d8c4f3-805f-47a3-a3e9-ab23aaf705c1.pdf', NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-1038-7096-bd6a-d879de1da8aa', '019b2aef-1026-713b-8211-466be6a8954c', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/5364422f-d344-44fe-abbb-b3682eea9004.pdf', NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd7a-700b-a21e-d80cafb8baef', '019b2b02-dd65-7084-a30f-1f943a3d2e64', 'test', 'testtttt', '2025-12-01', '2025-12-01', '55466647', 'EmployeeMasterData/Education/non-formal/f9e5fd1d-a7af-4e32-915c-1865a586e4a1.pdf', NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb6e-7192-907f-a1bd58fe3780', '019b2b0f-cb59-7228-b9fb-25a4c24eff35', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/e7a4c470-4083-4711-acdd-5828d35ad81f.pdf', NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41e2-71ad-b713-4e2b3346342d', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/a186d236-613d-4bbc-8efa-de0d28b01de8.pdf', NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2f63-2d74-70dc-aca9-c2aeaaee5d87', 'DSR001', 'ini sertifikat', 'kampus negeri', '2020-01-01', '2025-01-01', 'ini id', 'EmployeeMasterData/Education/non-formal/7ebf7a8e-08e8-4a9f-9bcc-f4f039818c8e.pdf', NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_positions`
--

CREATE TABLE `tr_employee_positions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `directorate_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `division_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job_title_id` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `position_level` int DEFAULT NULL COMMENT '1: General, 2: Junior, 3: Middle, 4: Senior',
  `user_access` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payroll_status` int DEFAULT NULL COMMENT '1: Active, 2: Inactive, 3: Suspended',
  `employee_category` int DEFAULT NULL COMMENT '1: Non-Staff, 2: Staff, 3: Partner',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_positions`
--

INSERT INTO `tr_employee_positions` (`id`, `employee_id`, `company_id`, `office_id`, `directorate_id`, `department_id`, `division_id`, `position_id`, `job_title_id`, `start_date`, `end_date`, `position_level`, `user_access`, `payroll_status`, `employee_category`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b15fe-3490-72b3-ab96-09c9e2f8f6f8', '019b15fe-348b-7026-9221-1467f8eea5ff', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-12 21:35:39', '2025-12-12 21:35:39'),
('019b16b8-97c4-7036-924f-92624ac34f31', '019b16b8-97be-720c-8f85-13d1f727fd33', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-13 00:59:14', '2025-12-13 00:59:14'),
('019b2000-8fd2-73a8-a79c-34c826779663', '019b2000-8fba-7040-b0c2-748d6ea5ddd2', '019ad7eb-5df0-7383-b933-c4f1c208db39', '019af2d5-b017-7377-8117-a24b457c26ae', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019af1fe-3912-7152-80ed-b1fec6216e3a', '2025-12-16', '2025-12-15', 1, 'no', 1, 2, NULL, '2025-12-14 20:14:26', '2025-12-14 20:14:26'),
('019b221a-bb7b-738b-b86a-0166ec612755', '019b221a-bb6d-737d-be0e-672f8a7b2bd4', '019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', '019adab2-98de-72ed-848f-cc1c3b7639c4', '019ae273-ff4f-7384-acb7-44b31ab476f7', '019aed98-eae2-7380-917a-309c0fe1d1c0', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee8b-ab6d-707c-8fc8-34147caf1254', '2025-12-01', '2026-12-01', 1, 'no', 1, 2, NULL, '2025-12-15 06:02:15', '2025-12-15 06:02:15'),
('019b2225-7b84-72da-93b1-ea079b7e7635', '019b2225-7b7c-71ec-8ff4-e38df930506f', '019ad7eb-5df0-7383-b933-c4f1c208db39', '019af2d5-b017-7377-8117-a24b457c26ae', '019ae273-ff4f-7384-acb7-44b31ab476f7', '019aed98-eae2-7380-917a-309c0fe1d1c0', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019af20b-fabf-725a-98d8-d19d2022165c', '019af1fe-3912-7152-80ed-b1fec6216e3a', '2025-12-01', '2026-02-01', 1, 'no', 1, 2, NULL, '2025-12-15 06:14:00', '2025-12-15 06:14:00'),
('019b251d-7b91-70ea-a439-01c1c9ad1176', '019b251d-7b7a-72bd-a9e9-d1e6acf89d7f', '019ad7e9-2331-71ed-8ee7-ff7af32a8cd6', '019b2084-f3fe-7389-a651-103e0166fe03', '019ae273-ff4f-7384-acb7-44b31ab476f7', '019aed98-eae2-7380-917a-309c0fe1d1c0', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019af20b-fabf-725a-98d8-d19d2022165c', '019af1fe-3912-7152-80ed-b1fec6216e3a', '2025-12-01', '2026-03-01', 1, 'no', 1, 2, NULL, '2025-12-15 20:04:07', '2025-12-15 20:04:07'),
('019b2630-fa0c-70c3-9eaf-9e2b8465bcf1', '019b2630-fa04-702c-b1cf-e20b018fd0ec', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-16 01:05:02', '2025-12-16 01:05:02'),
('019b2635-a1ae-72c7-a306-f3791f72e20d', '019b2635-a1a5-71d9-a7f2-b30831cc893f', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd62-721a-ad84-ffa6bfee949d', '019b2ae4-cd5d-709f-997e-e8a0384443e0', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-102e-73d2-9836-435aaf16b2bb', '019b2aef-1026-713b-8211-466be6a8954c', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd6c-72d3-b2f1-0d1daba3e810', '019b2b02-dd65-7084-a30f-1f943a3d2e64', '019ad7eb-5df0-7383-b933-c4f1c208db39', '019adab2-98de-72ed-848f-cc1c3b7639c4', '019ae273-ff4f-7384-acb7-44b31ab476f7', '019aed98-eae2-7380-917a-309c0fe1d1c0', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee8b-ab6d-707c-8fc8-34147caf1254', '2025-11-01', '2026-11-01', 1, 'no', 1, 2, NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb62-7315-a273-b28ab6ddeb69', '019b2b0f-cb59-7228-b9fb-25a4c24eff35', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41d8-7049-896b-33111137c07c', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b8d-24fe-70e1-a38a-e8d9be9defa3', '019b2b8d-24fa-726c-a200-59d718b44a7a', '019ad7eb-5df0-7383-b933-c4f1c208db39', '019adab2-98de-72ed-848f-cc1c3b7639c4', '019ae273-ff4f-7384-acb7-44b31ab476f7', '019aed98-eae2-7380-917a-309c0fe1d1c0', '019ae778-9bf9-7021-80ab-f7ef64e7e1a2', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee8b-ab6d-707c-8fc8-34147caf1254', '2025-12-01', '2026-12-01', 1, 'no', 1, 2, NULL, '2025-12-17 02:03:48', '2025-12-17 02:03:48'),
('019b2f63-2d5d-7370-ad74-f099d3e6137b', 'DSR001', '019ae365-412f-701f-983f-b17071f92ba2', '019af2d8-b94d-70ea-85ba-03c0c9be7ef9', '019ae21e-7ff8-7315-80a5-a139bbc01e52', '019aed99-53bc-71af-aa7f-07b317ff29d8', '019ae833-9eee-71a2-929f-918f233f6d4e', '019af20b-fabf-725a-98d8-d19d2022165c', '019aee3e-b586-727f-9464-6d819a5e6278', '2025-01-01', '2025-06-01', 1, 'no', 1, 2, NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `tr_employee_social_media`
--

CREATE TABLE `tr_employee_social_media` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facebook_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instagram_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkedin_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitter_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relative_social_media` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_relationship` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tr_employee_social_media`
--

INSERT INTO `tr_employee_social_media` (`id`, `facebook_name`, `instagram_name`, `linkedin_name`, `twitter_name`, `relative_social_media`, `emergency_contact_number`, `emergency_contact_name`, `emergency_contact_relationship`, `employee_id`, `deleted_at`, `created_at`, `updated_at`) VALUES
('019b2635-a1ba-7038-b34a-33a9f0b81130', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', '019b2635-a1a5-71d9-a7f2-b30831cc893f', NULL, '2025-12-16 01:10:07', '2025-12-16 01:10:07'),
('019b2ae4-cd6f-73bb-bcf4-4464ac5f0e3e', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', '019b2ae4-cd5d-709f-997e-e8a0384443e0', NULL, '2025-12-16 22:59:56', '2025-12-16 22:59:56'),
('019b2aef-103c-72e8-bef0-4405171b7360', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', '019b2aef-1026-713b-8211-466be6a8954c', NULL, '2025-12-16 23:11:08', '2025-12-16 23:11:08'),
('019b2b02-dd7e-7154-8620-b115a5409e54', 'https://brianaldybramasta.my.id/', 'https://brianaldybramasta.my.id/', 'https://brianaldybramasta.my.id/', 'https://brianaldybramasta.my.id/', 'https://brianaldybramasta.my.id/', '08999999999', 'siapa ya', 'oke', '019b2b02-dd65-7084-a30f-1f943a3d2e64', NULL, '2025-12-16 23:32:46', '2025-12-16 23:32:46'),
('019b2b0f-cb72-718b-8a1b-dcd4eaeddd52', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', '019b2b0f-cb59-7228-b9fb-25a4c24eff35', NULL, '2025-12-16 23:46:54', '2025-12-16 23:46:54'),
('019b2b20-41e6-7001-996f-86e71b139322', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', '019b2b20-41d2-7205-8b89-bd5d73f2a7d0', NULL, '2025-12-17 00:04:52', '2025-12-17 00:04:52'),
('019b2b8d-2505-7222-b867-493a8afec699', 'https://www.notion.so/2cb039c050b880cdbc31c5de2e329d9c?v=2cb039c050b881229dbf000c15244e06', 'https://www.notion.so/2cb039c050b880cdbc31c5de2e329d9c?v=2cb039c050b881229dbf000c15244e06', 'https://www.notion.so/2cb039c050b880cdbc31c5de2e329d9c?v=2cb039c050b881229dbf000c15244e06', 'https://www.notion.so/2cb039c050b880cdbc31c5de2e329d9c?v=2cb039c050b881229dbf000c15244e06', 'https://www.notion.so/2cb039c050b880cdbc31c5de2e329d9c?v=2cb039c050b881229dbf000c15244e06', '122222', 'lalala', 'lilili', '019b2b8d-24fa-726c-a200-59d718b44a7a', NULL, '2025-12-17 02:03:48', '2025-12-17 02:03:48'),
('019b2f63-2d7a-71d8-8ba1-44b2f849af28', 'ini facebook', 'ini  instagram', 'ini linkeid', 'ini nama twiter', 'gak ada', '0821444', 'siti nurjumaatik', 'ibu', 'DSR001', NULL, '2025-12-17 19:56:27', '2025-12-17 19:56:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `company_office`
--
ALTER TABLE `company_office`
  ADD PRIMARY KEY (`company_id`,`office_id`),
  ADD KEY `fk_company_office_mt_offices` (`office_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mt_business_lines`
--
ALTER TABLE `mt_business_lines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mt_companies`
--
ALTER TABLE `mt_companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mt_companies_mt_business_lines` (`business_line_id`);

--
-- Indexes for table `mt_departments`
--
ALTER TABLE `mt_departments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mt_departments_mt_divisions` (`division_id`);

--
-- Indexes for table `mt_directorates`
--
ALTER TABLE `mt_directorates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mt_divisions`
--
ALTER TABLE `mt_divisions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mt_divisions_mt_directorates` (`directorate_id`);

--
-- Indexes for table `mt_employees`
--
ALTER TABLE `mt_employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_national_id_unique` (`national_id`),
  ADD KEY `fk_mt_employees_ref_ptkp` (`ptkp_id`);

--
-- Indexes for table `mt_job_titles`
--
ALTER TABLE `mt_job_titles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mt_offices`
--
ALTER TABLE `mt_offices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mt_positions`
--
ALTER TABLE `mt_positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mt_positions_mt_job_titles` (`job_title_id`),
  ADD KEY `fk_mt_positions_mt_directorates` (`directorate_id`),
  ADD KEY `fk_mt_positions_mt_divisions` (`division_id`),
  ADD KEY `fk_mt_positions_mt_departments` (`department_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `ref_ptkp`
--
ALTER TABLE `ref_ptkp`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pktp_pktp_code_unique` (`code`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tr_company_documents`
--
ALTER TABLE `tr_company_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_company_documents_mt_companies` (`company_id`);

--
-- Indexes for table `tr_employee_contracts`
--
ALTER TABLE `tr_employee_contracts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tr_employee_documents`
--
ALTER TABLE `tr_employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_employee_documents_mt_employees` (`employee_id`);

--
-- Indexes for table `tr_employee_formal_educations`
--
ALTER TABLE `tr_employee_formal_educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_employee_formal_educations_mt_employees` (`employee_id`);

--
-- Indexes for table `tr_employee_non_formal_educations`
--
ALTER TABLE `tr_employee_non_formal_educations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_employee_non_formal_educations_mt_employees` (`employee_id`);

--
-- Indexes for table `tr_employee_positions`
--
ALTER TABLE `tr_employee_positions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_employee_positions_mt_employees` (`employee_id`),
  ADD KEY `fk_tr_employee_positions_mt_companies` (`company_id`),
  ADD KEY `fk_tr_employee_positions_mt_offices` (`office_id`),
  ADD KEY `fk_tr_employee_positions_mt_directorates` (`directorate_id`),
  ADD KEY `fk_tr_employee_positions_mt_departments` (`department_id`),
  ADD KEY `fk_tr_employee_positions_mt_divisions` (`division_id`),
  ADD KEY `fk_tr_employee_positions_mt_positions` (`position_id`),
  ADD KEY `fk_tr_employee_positions_mt_job_titles` (`job_title_id`);

--
-- Indexes for table `tr_employee_social_media`
--
ALTER TABLE `tr_employee_social_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tr_employee_social_media_mt_employees` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_office`
--
ALTER TABLE `company_office`
  ADD CONSTRAINT `fk_company_office_mt_companies` FOREIGN KEY (`company_id`) REFERENCES `mt_companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_company_office_mt_offices` FOREIGN KEY (`office_id`) REFERENCES `mt_offices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mt_companies`
--
ALTER TABLE `mt_companies`
  ADD CONSTRAINT `fk_mt_companies_mt_business_lines` FOREIGN KEY (`business_line_id`) REFERENCES `mt_business_lines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mt_departments`
--
ALTER TABLE `mt_departments`
  ADD CONSTRAINT `fk_mt_departments_mt_divisions` FOREIGN KEY (`division_id`) REFERENCES `mt_divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mt_divisions`
--
ALTER TABLE `mt_divisions`
  ADD CONSTRAINT `fk_mt_divisions_mt_directorates` FOREIGN KEY (`directorate_id`) REFERENCES `mt_directorates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mt_employees`
--
ALTER TABLE `mt_employees`
  ADD CONSTRAINT `fk_mt_employees_ref_ptkp` FOREIGN KEY (`ptkp_id`) REFERENCES `ref_ptkp` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `mt_positions`
--
ALTER TABLE `mt_positions`
  ADD CONSTRAINT `fk_mt_positions_mt_departments` FOREIGN KEY (`department_id`) REFERENCES `mt_departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mt_positions_mt_directorates` FOREIGN KEY (`directorate_id`) REFERENCES `mt_directorates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mt_positions_mt_divisions` FOREIGN KEY (`division_id`) REFERENCES `mt_divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mt_positions_mt_job_titles` FOREIGN KEY (`job_title_id`) REFERENCES `mt_job_titles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tr_company_documents`
--
ALTER TABLE `tr_company_documents`
  ADD CONSTRAINT `fk_tr_company_documents_mt_companies` FOREIGN KEY (`company_id`) REFERENCES `mt_companies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tr_employee_documents`
--
ALTER TABLE `tr_employee_documents`
  ADD CONSTRAINT `fk_tr_employee_documents_mt_employees` FOREIGN KEY (`employee_id`) REFERENCES `mt_employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tr_employee_formal_educations`
--
ALTER TABLE `tr_employee_formal_educations`
  ADD CONSTRAINT `fk_tr_employee_formal_educations_mt_employees` FOREIGN KEY (`employee_id`) REFERENCES `mt_employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tr_employee_non_formal_educations`
--
ALTER TABLE `tr_employee_non_formal_educations`
  ADD CONSTRAINT `fk_tr_employee_non_formal_educations_mt_employees` FOREIGN KEY (`employee_id`) REFERENCES `mt_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tr_employee_positions`
--
ALTER TABLE `tr_employee_positions`
  ADD CONSTRAINT `fk_tr_employee_positions_mt_companies` FOREIGN KEY (`company_id`) REFERENCES `mt_companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_departments` FOREIGN KEY (`department_id`) REFERENCES `mt_departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_directorates` FOREIGN KEY (`directorate_id`) REFERENCES `mt_directorates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_divisions` FOREIGN KEY (`division_id`) REFERENCES `mt_divisions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_employees` FOREIGN KEY (`employee_id`) REFERENCES `mt_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_job_titles` FOREIGN KEY (`job_title_id`) REFERENCES `mt_job_titles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_offices` FOREIGN KEY (`office_id`) REFERENCES `mt_offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tr_employee_positions_mt_positions` FOREIGN KEY (`position_id`) REFERENCES `mt_positions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tr_employee_social_media`
--
ALTER TABLE `tr_employee_social_media`
  ADD CONSTRAINT `fk_tr_employee_social_media_mt_employees` FOREIGN KEY (`employee_id`) REFERENCES `mt_employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
