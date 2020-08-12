-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `theme`;
CREATE TABLE `theme` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `theme` (`id`, `name`) VALUES
(1,	'Nourriture'),
(2,	'Animaux'),
(3,	'Couleurs'),
(4,	'Corps humain'),
(5,	'Famille'),
(6,	'Chiffres & Nombres'),
(7,	'Transports'),
(8,	'Professions'),
(9,	'Electronique'),
(11,	'École'),
(12,	'Géographie'),
(13,	'Loisirs & Sports');

DROP TABLE IF EXISTS `type`;
CREATE TABLE `type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8CDE57295E237E06` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `type` (`id`, `name`) VALUES
(1,	'Adjectif'),
(2,	'Adverbe'),
(8,	'Locution'),
(3,	'Nom'),
(6,	'Pronom'),
(7,	'Suffixe'),
(4,	'Verbe');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`),
  UNIQUE KEY `UNIQ_8D93D649F85E0677` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` (`id`, `email`, `username`, `roles`, `password`) VALUES
(1,	'kronix.powa@gmail.com',	'KroNawak',	'[\"ROLE_ADMIN\",\"ROLE_USER\"]',	'$argon2id$v=19$m=65536,t=4,p=1$ZyrdsQzL9EdbThXyRqwV8g$Kyk47x1eWGPvXsdfAV/iX8Emk9MKbodXuLUOQ3TIf64');

DROP TABLE IF EXISTS `verbe_groupe`;
CREATE TABLE `verbe_groupe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `suffix` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_E9E53E855E237E06` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `verbe_groupe` (`id`, `name`, `suffix`) VALUES
(1,	'Godan',	'u'),
(2,	'Ichidan',	'ru'),
(3,	'Irrégulier',	NULL);

DROP TABLE IF EXISTS `word`;
CREATE TABLE `word` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) DEFAULT NULL,
  `verbe_groupe_id` int(11) DEFAULT NULL,
  `theme_id` int(11) DEFAULT NULL,
  `kanji` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `romaji` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `francais` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `infos` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_C3F17511426F9DDC` (`kanji`),
  KEY `IDX_C3F17511C54C8C93` (`type_id`),
  KEY `IDX_C3F17511101A1138` (`verbe_groupe_id`),
  KEY `IDX_C3F1751159027487` (`theme_id`),
  CONSTRAINT `FK_C3F17511101A1138` FOREIGN KEY (`verbe_groupe_id`) REFERENCES `verbe_groupe` (`id`),
  CONSTRAINT `FK_C3F1751159027487` FOREIGN KEY (`theme_id`) REFERENCES `theme` (`id`),
  CONSTRAINT `FK_C3F17511C54C8C93` FOREIGN KEY (`type_id`) REFERENCES `type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `word` (`id`, `type_id`, `verbe_groupe_id`, `theme_id`, `kanji`, `romaji`, `francais`, `infos`, `created_at`) VALUES
(1,	6,	NULL,	NULL,	'私',	'watashi',	'je, moi',	NULL,	'2020-07-04 03:41:21'),
(2,	4,	3,	NULL,	'です',	'desu',	'être, suis, c\'est',	NULL,	'2020-07-04 03:47:11'),
(3,	3,	NULL,	NULL,	'さん',	'san',	'monsieur, madame, mademoiselle',	NULL,	'2020-07-04 19:10:58'),
(4,	3,	NULL,	11,	'本',	'hon',	'livre',	NULL,	'2020-07-04 19:11:22'),
(5,	3,	NULL,	12,	'日本',	'nihon',	'japon',	NULL,	'2020-07-04 19:13:13'),
(6,	3,	NULL,	2,	'猫',	'neko',	'chat',	NULL,	'2020-07-04 19:14:12'),
(7,	3,	NULL,	11,	'学生',	'gakusei',	'étudiant',	NULL,	'2020-07-04 19:16:03'),
(8,	6,	NULL,	NULL,	'あなた',	'anata',	'toi, tu, vous',	NULL,	'2020-07-04 19:16:51'),
(9,	3,	NULL,	NULL,	'人',	'hito',	'être humain, personne',	NULL,	'2020-07-04 19:18:10'),
(10,	2,	NULL,	NULL,	'はい',	'hai',	'oui',	NULL,	'2020-07-04 19:18:40'),
(11,	2,	NULL,	NULL,	'いいえ',	'iie',	'non',	NULL,	'2020-07-04 19:18:51'),
(12,	3,	NULL,	NULL,	'こんにちは',	'konnichiwa',	'bonjour',	NULL,	'2020-07-04 19:20:23'),
(14,	3,	NULL,	12,	'フランス',	'furansu',	'france',	NULL,	'2020-07-04 19:23:07'),
(15,	6,	NULL,	NULL,	'だれ',	'dare',	'qui',	NULL,	'2020-07-04 19:23:27'),
(16,	3,	NULL,	2,	'犬',	'inu',	'chien',	NULL,	'2020-07-04 19:23:43'),
(17,	7,	NULL,	NULL,	'-人',	'-jin',	'être humain, personne',	'suffixe',	'2020-07-04 19:25:14'),
(18,	3,	NULL,	NULL,	'趣味',	'shumi',	'passe-temps',	NULL,	'2020-07-04 19:26:58'),
(19,	3,	NULL,	13,	'音楽',	'ongaku',	'musique',	NULL,	'2020-07-04 19:27:25'),
(20,	3,	NULL,	13,	'映画',	'eiga',	'film',	NULL,	'2020-07-04 19:28:49'),
(21,	3,	NULL,	NULL,	'名前',	'namae',	'nom',	NULL,	'2020-07-04 19:29:33'),
(22,	3,	NULL,	NULL,	'国',	'kuni',	'pays',	NULL,	'2020-07-04 19:30:02'),
(23,	2,	NULL,	NULL,	'よく',	'yoku',	'souvent',	NULL,	'2020-07-04 19:30:33'),
(24,	4,	1,	NULL,	'読む',	'yomu',	'lire',	NULL,	'2020-07-04 19:32:46'),
(26,	4,	1,	NULL,	'聞く',	'kiku',	'écouter, demander',	NULL,	'2020-07-04 19:46:58'),
(27,	4,	2,	NULL,	'見る',	'miru',	'voir, regarder, observer',	NULL,	'2020-07-04 19:48:02'),
(28,	6,	NULL,	NULL,	'何',	'nan, nani',	'quel, quoi',	NULL,	'2020-07-04 19:53:26'),
(29,	3,	NULL,	NULL,	'語',	'go',	'langue',	'parlée',	'2020-07-04 19:54:12'),
(30,	3,	NULL,	2,	'魚',	'sakana',	'poisson',	NULL,	'2020-07-04 19:55:24'),
(31,	3,	NULL,	1,	'コーヒー',	'kôhî',	'café',	NULL,	'2020-07-04 19:56:00'),
(32,	3,	NULL,	1,	'パン',	'pan',	'pain',	NULL,	'2020-07-04 19:56:15'),
(33,	3,	NULL,	1,	'卵',	'tamago',	'oeuf',	NULL,	'2020-07-04 19:56:37'),
(34,	4,	1,	NULL,	'話す',	'hanasu',	'parler',	NULL,	'2020-07-04 19:58:24'),
(35,	4,	2,	NULL,	'食べる',	'taberu',	'manger',	NULL,	'2020-07-04 19:59:14'),
(36,	4,	1,	NULL,	'飲む',	'nomu',	'boire',	NULL,	'2020-07-04 19:59:45'),
(37,	4,	3,	NULL,	'する',	'suru',	'faire',	NULL,	'2020-07-04 20:02:27'),
(38,	3,	NULL,	NULL,	'今朝',	'kesa',	'ce matin',	NULL,	'2020-07-04 20:14:49'),
(39,	3,	NULL,	NULL,	'こんばんは',	'konbanwa',	'bonsoir',	NULL,	'2020-07-04 20:15:14'),
(40,	3,	NULL,	NULL,	'時',	'ji',	'heure',	NULL,	'2020-07-04 22:04:35'),
(41,	4,	1,	NULL,	'行く',	'iku',	'aller',	NULL,	'2020-07-04 22:05:28'),
(42,	4,	3,	NULL,	'来る',	'kuru',	'venir',	NULL,	'2020-07-04 22:06:24'),
(43,	4,	1,	NULL,	'帰る',	'kaeru',	'rentrer, retourner',	NULL,	'2020-07-04 22:07:50'),
(44,	6,	NULL,	NULL,	'どこ',	'doko',	'où',	NULL,	'2020-07-04 22:10:11'),
(45,	2,	NULL,	NULL,	'いつ',	'itsu',	'quand',	NULL,	'2020-07-04 22:11:18'),
(46,	2,	NULL,	NULL,	'明日',	'ashita',	'demain',	NULL,	'2020-07-04 22:12:45'),
(47,	2,	NULL,	NULL,	'今日',	'kyou',	'aujourd\'hui',	NULL,	'2020-07-04 22:13:20'),
(48,	2,	NULL,	NULL,	'今',	'ima',	'maintenant',	NULL,	'2020-07-04 22:14:01'),
(49,	3,	NULL,	13,	'映画館',	'eigakan',	'cinéma',	NULL,	'2020-07-04 22:14:29'),
(50,	3,	NULL,	NULL,	'家',	'ie',	'maison, chez soi',	NULL,	'2020-07-04 22:16:33'),
(51,	NULL,	NULL,	6,	'一',	'ichi',	'un',	NULL,	'2020-07-04 22:25:03'),
(52,	NULL,	NULL,	6,	'二',	'ni',	'deux',	NULL,	'2020-07-04 22:25:13'),
(53,	NULL,	NULL,	6,	'三',	'san',	'trois',	NULL,	'2020-07-04 22:25:24'),
(54,	NULL,	NULL,	6,	'四',	'yon, shi',	'quatre',	NULL,	'2020-07-04 22:25:48'),
(55,	NULL,	NULL,	6,	'五',	'go',	'cinq',	NULL,	'2020-07-04 22:26:01'),
(56,	NULL,	NULL,	6,	'六',	'roku',	'six',	NULL,	'2020-07-04 22:26:12'),
(57,	NULL,	NULL,	6,	'七',	'nana, shichi',	'sept',	NULL,	'2020-07-04 22:26:34'),
(58,	NULL,	NULL,	6,	'八',	'hachi',	'huit',	NULL,	'2020-07-04 22:26:58'),
(59,	NULL,	NULL,	6,	'九',	'kyuu',	'neuf',	NULL,	'2020-07-04 22:29:52'),
(60,	NULL,	NULL,	6,	'十',	'juu',	'dix',	NULL,	'2020-07-04 22:30:06'),
(61,	2,	NULL,	NULL,	'昨日',	'kinou',	'hier',	NULL,	'2020-07-04 22:34:23'),
(62,	3,	NULL,	NULL,	'友達',	'tomodachi',	'ami, amie',	NULL,	'2020-07-04 22:35:07'),
(63,	3,	NULL,	13,	'デパート',	'depâto',	'centre commercial',	NULL,	'2020-07-04 22:35:44'),
(64,	6,	NULL,	NULL,	'何か',	'nanika',	'quelque chose',	NULL,	'2020-07-04 22:36:42'),
(65,	6,	NULL,	NULL,	'何も',	'nanimo',	'rien',	NULL,	'2020-07-04 22:37:15'),
(66,	2,	NULL,	NULL,	'でも',	'demo',	'mais',	NULL,	'2020-07-04 22:37:47'),
(67,	3,	NULL,	NULL,	'今晩',	'konban',	'ce soir',	NULL,	'2020-07-04 22:38:39'),
(68,	2,	NULL,	NULL,	'また',	'mata',	'encore',	NULL,	'2020-07-04 22:39:21'),
(69,	2,	NULL,	NULL,	'一緒に',	'issho ni',	'ensemble',	NULL,	'2020-07-04 22:41:10'),
(70,	4,	1,	NULL,	'買う',	'kau',	'acheter',	NULL,	'2020-07-04 22:41:38'),
(71,	3,	NULL,	12,	'ドイツ',	'doitsu',	'allemagne',	NULL,	'2020-07-04 22:42:07'),
(72,	3,	NULL,	NULL,	'かばん',	'kaban',	'sac',	NULL,	'2020-07-04 22:50:22'),
(73,	1,	NULL,	NULL,	'大きい',	'ookii',	'gros',	NULL,	'2020-07-04 22:51:29'),
(74,	1,	NULL,	NULL,	'小さい',	'chiisai',	'petit',	NULL,	'2020-07-04 22:51:46'),
(75,	2,	NULL,	NULL,	'たぶん',	'tabun',	'peut-être',	NULL,	'2020-07-04 22:52:25'),
(76,	3,	NULL,	11,	'先生',	'sensei',	'professeur',	NULL,	'2020-07-04 22:52:44'),
(77,	3,	NULL,	7,	'車',	'kuruma',	'voiture',	NULL,	'2020-07-04 22:53:35'),
(78,	8,	NULL,	NULL,	'すみません',	'sumimasen',	'excusez-moi',	NULL,	'2020-07-04 22:55:11'),
(79,	2,	NULL,	NULL,	'いくら',	'ikura',	'combien',	NULL,	'2020-07-04 23:07:19'),
(80,	3,	NULL,	NULL,	'円',	'en',	'yen',	'￥',	'2020-07-04 23:08:05'),
(81,	8,	NULL,	NULL,	'ちょっと',	'chotto',	'un peu',	NULL,	'2020-07-04 23:08:46'),
(82,	1,	NULL,	NULL,	'高い',	'takai',	'cher',	NULL,	'2020-07-04 23:09:11'),
(83,	1,	NULL,	NULL,	'安い',	'yasui',	'pas cher',	NULL,	'2020-07-04 23:09:50'),
(84,	3,	NULL,	9,	'テレビ',	'terebi',	'télévision',	NULL,	'2020-07-04 23:10:19'),
(85,	6,	NULL,	NULL,	'これ',	'kore',	'ceci',	NULL,	'2020-07-04 23:11:01'),
(86,	6,	NULL,	NULL,	'それ',	'sore',	'cela',	NULL,	'2020-07-04 23:11:45'),
(87,	6,	NULL,	NULL,	'あれ',	'are',	'cela',	'là-bas',	'2020-07-04 23:12:20'),
(88,	6,	NULL,	NULL,	'どれ',	'dore',	'lequel, laquelle',	NULL,	'2020-07-04 23:15:31'),
(89,	1,	NULL,	NULL,	'この',	'kono',	'ce, cet, cette',	NULL,	'2020-07-04 23:16:47'),
(90,	1,	NULL,	NULL,	'その',	'sono',	'ce, cet, cette',	NULL,	'2020-07-04 23:17:07'),
(91,	1,	NULL,	NULL,	'あの',	'ano',	'ce, cet, cette',	'là-bas',	'2020-07-04 23:17:49'),
(92,	1,	NULL,	NULL,	'どの',	'dono',	'quel, quelle',	'devant un nom',	'2020-07-04 23:18:56'),
(93,	1,	NULL,	NULL,	'新しい',	'atarashii',	'nouveau',	NULL,	'2020-07-04 23:19:46'),
(94,	2,	NULL,	NULL,	'すぐ',	'sugu',	'bientôt',	NULL,	'2020-07-04 23:20:08'),
(95,	1,	NULL,	NULL,	'同じ',	'onaji',	'pareil, même',	NULL,	'2020-07-04 23:20:44'),
(96,	1,	NULL,	NULL,	'ほしい',	'hoshii',	'voulu, désiré',	NULL,	'2020-07-04 23:21:42'),
(97,	2,	NULL,	NULL,	'どんな',	'donna',	'quelle sorte de',	NULL,	'2020-07-04 23:22:44'),
(98,	1,	NULL,	NULL,	'速い',	'hayai',	'rapide',	NULL,	'2020-07-04 23:23:46'),
(99,	1,	NULL,	NULL,	'好き',	'suki',	'aimé',	NULL,	'2020-07-04 23:26:41'),
(100,	1,	NULL,	NULL,	'古い',	'furui',	'vieux',	NULL,	'2020-07-04 23:26:57'),
(101,	1,	NULL,	NULL,	'遅い',	'osoi',	'lent, tard',	NULL,	'2020-07-04 23:27:26'),
(102,	1,	NULL,	NULL,	'嫌い',	'kirai',	'détesté',	NULL,	'2020-07-04 23:27:54'),
(103,	3,	NULL,	12,	'カナダ',	'kanada',	'canada',	NULL,	'2020-07-04 23:28:10'),
(104,	1,	NULL,	NULL,	'いい',	'ii',	'bon, bien',	NULL,	'2020-07-04 23:34:00'),
(105,	3,	NULL,	NULL,	'女の人',	'onna no hito',	'femme',	NULL,	'2020-08-12 15:05:13'),
(106,	3,	NULL,	NULL,	'女の子',	'onna no ko',	'fille',	NULL,	'2020-08-12 15:05:31'),
(107,	3,	NULL,	NULL,	'男の人',	'otoko no hito',	'homme',	NULL,	'2020-08-12 15:05:58'),
(108,	3,	NULL,	NULL,	'男の子',	'otoko no ko',	'garçon',	NULL,	'2020-08-12 15:06:13'),
(109,	1,	NULL,	NULL,	'有名',	'yuumei',	'célèbre',	NULL,	'2020-08-12 15:17:48'),
(110,	3,	NULL,	NULL,	'歌手',	'kashu',	'chanteur',	NULL,	'2020-08-12 15:19:11'),
(111,	1,	NULL,	NULL,	'きれい',	'kirei',	'joli, beau, propre',	NULL,	'2020-08-12 15:19:36'),
(112,	2,	NULL,	NULL,	'とても',	'totemo',	'très, vraiment',	NULL,	'2020-08-12 15:20:15'),
(113,	1,	NULL,	NULL,	'優しい',	'yasashii',	'gentil',	NULL,	'2020-08-12 15:21:50'),
(114,	1,	NULL,	NULL,	'おいしい',	'oishii',	'délicieux, bon',	NULL,	'2020-08-12 15:22:15'),
(115,	3,	NULL,	1,	'ケーキ',	'kêki',	'gâteau',	NULL,	'2020-08-12 15:22:52'),
(116,	1,	NULL,	NULL,	'かわいい',	'kawaii',	'mignon, joli',	NULL,	'2020-08-12 15:23:15'),
(117,	3,	NULL,	NULL,	'分',	'fun, pun, bun',	'minute',	NULL,	'2020-08-12 15:37:11'),
(118,	3,	NULL,	NULL,	'秒',	'byou',	'seconde',	NULL,	'2020-08-12 15:37:56'),
(119,	2,	NULL,	NULL,	'前',	'mae',	'avant',	NULL,	'2020-08-12 15:39:06'),
(120,	2,	NULL,	NULL,	'半',	'han',	'demi, et demi',	NULL,	'2020-08-12 15:39:45'),
(121,	2,	NULL,	NULL,	'午前',	'gozen',	'dans la matinée',	NULL,	'2020-08-12 15:40:46'),
(122,	2,	NULL,	NULL,	'午後',	'gogo',	'dans l\'après-midi',	NULL,	'2020-08-12 15:42:38'),
(123,	NULL,	NULL,	6,	'百',	'hyaku',	'cent',	NULL,	'2020-08-12 15:49:57'),
(124,	NULL,	NULL,	6,	'千',	'sen',	'mille',	NULL,	'2020-08-12 15:50:20'),
(125,	NULL,	NULL,	6,	'万',	'man',	'dix mille',	NULL,	'2020-08-12 15:51:09'),
(126,	NULL,	NULL,	6,	'億',	'oku',	'cent millions',	NULL,	'2020-08-12 15:53:31');

DROP TABLE IF EXISTS `word_report`;
CREATE TABLE `word_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `word_id` int(11) NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_B6F6A30AE357438D` (`word_id`),
  CONSTRAINT `FK_B6F6A30AE357438D` FOREIGN KEY (`word_id`) REFERENCES `word` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2020-08-12 21:38:57