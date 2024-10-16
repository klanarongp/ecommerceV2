-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 16, 2024 at 05:39 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web_ecommerce_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `email` varchar(50) NOT NULL,
  `street_address` text NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `postal_code` varchar(50) NOT NULL,
  `country` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `address`
--

INSERT INTO `address` (`email`, `street_address`, `city`, `state`, `postal_code`, `country`, `phone`) VALUES
('user4@hot', '1234 Main St', 'Your City1', 'Your State1', '12345', 'Your Country', '123-456-7890'),
('test@example.com', '1234 Main St', 'Your City', 'Your State', '12345', 'Your Country', '123-456-7890'),
('user5@hot', '88/99923', 'ลำลูกกา', 'ปทุมธานี', '12150', 'ไทย', '445698999'),
('user1234567@hot', '777/8899', 'City77', 'State77', '12345', 'Country77', '123-456-7890');

-- --------------------------------------------------------

--
-- Table structure for table `billing`
--

CREATE TABLE `billing` (
  `order_id` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `promotion_id` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `vat` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing`
--

INSERT INTO `billing` (`order_id`, `email`, `promotion_id`, `amount`, `vat`, `price`, `total_price`) VALUES
('12345', 'user@example.com', 'promo_001', 100, 7, 93, 100),
('order_001', 'user@example.com', 'promo_001', 100, 7, 1000, 1070),
('order_002', 'user@example.com', 'promo_002', 100, 7, 1000, 1070);

-- --------------------------------------------------------

--
-- Table structure for table `billing_list`
--

CREATE TABLE `billing_list` (
  `product_id` varchar(50) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `unit` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billing_list`
--

INSERT INTO `billing_list` (`product_id`, `order_id`, `unit`, `price`, `total_price`, `quantity`) VALUES
('product_001', 'order_002', 2, 100, 200, 2),
('product_001', 'order_002', 1, 100, 200, 2);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `unit` varchar(50) NOT NULL,
  `price` double NOT NULL,
  `img` longblob NOT NULL,
  `size` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `discount_price` double NOT NULL,
  `is_on_promotion` tinyint(1) NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `description`, `unit`, `price`, `img`, `size`, `type`, `discount_price`, `is_on_promotion`, `quantity`) VALUES
('product_001', 'เชิตฟ้า', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383634363335303030372d3434353934343231382e6a7067, 'XL', 'เสื้อเชิต', 0, 0, 1),
('product_002', 'เชิตกรม', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383634363436343336362d3339373532353638392e6a7067, 'XL', 'เสื้อเชิต', 0, 0, 1),
('product_003', 'A sample product3', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383438373937313538302d3532373137343639352e6a7067, 'Large', 'เสื้อฮาวาย', 0, 0, 1),
('product_004', 'A sample product4', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383438393131383136342d3934303830323431332e6a7067, 'Large', 'เสื้อฮาวาย', 0, 0, 1),
('product_005', 'ฮาวายส้ม', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383634313833333734302d3435303831373935332e6a7067, 'XL', 'เสื้อฮาวาย', 0, 0, 1),
('product_006', 'ฮาวายแดง', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383634333234303836322d3232393130373537352e6a7067, 'XL', 'เสื้อฮาวาย', 0, 0, 1),
('product_007', 'เชิตน้ำเงิน', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383634363532383136372d3133313230373733302e6a7067, 'XL', 'เสื้อเชิต', 0, 0, 1),
('product_008', 'เชิตดำ', 'ตัว', 199, 0x75706c6f6164735c696d672d313732383634363536363730392d3636373836303530302e6a7067, 'XL', 'เสื้อเชิต', 0, 0, 2),
('product_009', 'เชิตเขียว', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383634373030353531312d3333373030363139352e706e67, 'XL', 'เสื้อเชิต', 0, 0, 2),
('product_010', 'เชิตเทา', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383634373232313232392d3839323336353131302e706e67, 'XL', 'เสื้อเชิต', 0, 0, 2),
('product_011', 'เชิตแดง', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383634373530333138342d3634353334353739312e706e67, 'XL', 'เสื้อเชิต', 0, 0, 2),
('product_012', 'ยืดmcสีน้ำเงิน', 'ตัว', 150, 0x75706c6f6164735c696d672d313732383634373730303831322d3939353732323435372e706e67, 'XL', 'เสื้อยืด', 0, 0, 3),
('product_013', 'ยืดmcสีเหลือง', 'ตัว', 150, 0x75706c6f6164735c696d672d313732383634373733313337362d3337383732393239362e706e67, 'XL', 'เสื้อยืด', 0, 0, 4),
('product_014', 'ฮาวายดำ', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383731303431313231392d3438323037373632352e6a7067, 'XL', 'เสื้อฮาวาย', 0, 0, 5),
('product_015', 'ฮาวายใบไม้', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383731303838353936392d3738323636333232312e6a7067, 'XL', 'เสื้อฮาวาย', 150, 1, 5),
('product_019', 'ฮาวายตัวอย่าง3', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383732333436313737362d3730363232343736302e6a7067, 'XL', 'เสื้อฮาวาย', 150, 1, 5),
('product_020', 'ยืดผญ', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383837373835373130342d3936313538303534392e706e67, 'XL', 'เสื้อยืด', 0, 0, 10),
('product_021', 'ยืดผญ2', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383837383733393838302d3630393238333135382e6a7067, 'XL', 'เสื้อยืด', 0, 0, 10),
('product_022', 'ยืดผญ4', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383838333739343233362d3438323832323630392e6a7067, 'XL', 'เสื้อยืด', 150, 0, 10),
('product_023', 'ยืดผญ5', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383838333939343539332d3237393837353137332e6a7067, 'XL', 'เสื้อยืด', 150, 0, 10),
('product_024', 'ยืดผญ6', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383838343230373637342d3635353637393531352e6a7067, 'XL', 'เสื้อยืด', 150, 1, 10),
('product_026', 'ยืดผญ7', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383838393834383635382d3634363130313837322e77656270, 'XL', 'เสื้อยืด', 150, 1, 10),
('product_027', 'เสื้อยืดสีกรม', 'ตัว', 200, 0x75706c6f6164735c696d672d313732383839363739333937382d3835323631393636352e6a7067, 'XL', 'เสื้อยืด', 150, 1, 10),
('product_028', 'test', 'ตัว', 200, 0x75706c6f6164735c696d672d313732393039313834363930332d3335323335383930372e6a7067, 'XL', 'test', 150, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `promotion`
--

CREATE TABLE `promotion` (
  `id` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `discount` int(2) NOT NULL,
  `start_duedate` timestamp NULL DEFAULT NULL,
  `end_duedate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion`
--

INSERT INTO `promotion` (`id`, `description`, `status`, `discount`, `start_duedate`, `end_duedate`) VALUES
('promotions-test', 'โปรโมชั่นลด 20%', 'active', 5, '2024-09-30 17:00:00', '2024-10-14 17:00:00'),
('promotions-test2', 'โปรโมชั่นลด 20%', 'active', 5, '2024-10-09 17:00:00', '2024-10-19 17:00:00'),
('promotions-test3', 'โปรโมชั่นลด 30%', 'active', 5, '2024-10-09 17:00:00', '2024-10-19 17:00:00'),
('TEST-Promotion', 'TEST-Promotion1', 'active', 5, '2024-09-30 17:00:00', '2024-10-14 17:00:00'),
('TEST-PromotionNG', 'TEST-PromotionNG12', 'active', 5, '2024-09-29 20:00:00', '2024-09-29 20:00:00'),
('test110', 'test100', 'active', 15, '2024-09-30 17:00:00', '2024-10-15 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_mapping`
--

CREATE TABLE `promotion_mapping` (
  `promotion_id` varchar(50) NOT NULL,
  `product_id` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `discount_percentage` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promotion_mapping`
--

INSERT INTO `promotion_mapping` (`promotion_id`, `product_id`, `status`, `discount_percentage`) VALUES
('promo_001', 'product_001', 'active', 0),
('promo_002', 'product_002', 'active', 0),
('promo_003', 'product_003', 'active', 0),
('PromotionTest123', 'ProductTest123', 'active', 0),
('promotions001', 'product_016', 'active', 15);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `role` varchar(50) DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `role`) VALUES
('admin', '$2b$10$PjQkr980yI77WyHQehDXFeROCqu/5aAZhIzuwWLWg8tS0dPnu2HIG', 'admin'),
('test@example.com', '123456', 'Admin'),
('testuser@example.com', '123456', 'user'),
('user1234567@hot', '$2b$10$FcnAB2TBLsy6tr/HLEzFrualVpm1p84P30fubiYN.NYGHaE85YcCO', 'City'),
('user123456@hot', '$2b$10$dFlK5aWxUfWwlAL3V89QF.dC58bLPd9rlqZd1SK4K29', 'user'),
('user12345@hot', '$2b$10$zDgLfiSlsZhdT5RFqMvpg.4I/zy4bzHToWbp/3bKGII', 'user'),
('user1@hot', '$2b$10$1vPtvNm6dvUrEm0VME4OMOfpVOxHm6OWKUKqoiVTKZk', 'user'),
('user3@hot', '$2b$10$oHzyxjxp9CKAV1HCWkleSOoGre0IryAkd4WE6Jn777KvD7a5F/zXK', 'user'),
('user4@hot', '$2b$10$2JMWmXyQMQkDq./aYUn16.dry.fHrvBQRRBlvPS0KtQ/JDyJojiJS', 'user'),
('user5@hot', '$2b$10$VQAScbvTk.wmWK4aZP0sp.XNSR2601v4WjWapZZJlynjo6a/lqXxO', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD KEY `fk_address` (`email`);

--
-- Indexes for table `billing`
--
ALTER TABLE `billing`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_billing_promotion_id` (`promotion_id`);

--
-- Indexes for table `billing_list`
--
ALTER TABLE `billing_list`
  ADD KEY `fk_billing_list_product` (`product_id`),
  ADD KEY `fk_billing_list_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion`
--
ALTER TABLE `promotion`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promotion_mapping`
--
ALTER TABLE `promotion_mapping`
  ADD KEY `fk_promotion` (`promotion_id`),
  ADD KEY `fk_product` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `fk_address` FOREIGN KEY (`email`) REFERENCES `users` (`email`);

--
-- Constraints for table `billing_list`
--
ALTER TABLE `billing_list`
  ADD CONSTRAINT `fk_billing_list_order` FOREIGN KEY (`order_id`) REFERENCES `billing` (`order_id`),
  ADD CONSTRAINT `fk_billing_list_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
