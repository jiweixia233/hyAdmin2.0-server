/*
 Navicat MySQL Data Transfer

 Source Server         : hyAdmin2.0
 Source Server Type    : MySQL
 Source Server Version : 50720
 Source Host           : localhost:3306
 Source Schema         : hyadmin2.0

 Target Server Type    : MySQL
 Target Server Version : 50720
 File Encoding         : 65001

 Date: 23/02/2018 12:39:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for homyit_frame_access
-- ----------------------------
DROP TABLE IF EXISTS `homyit_frame_access`;
CREATE TABLE `homyit_frame_access`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` int(10) UNSIGNED NOT NULL,
  `action_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `model` char(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `status` tinyint(1) UNSIGNED NULL DEFAULT 1,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `action_role`(`role_id`, `action_id`) USING BTREE,
  INDEX `action_id`(`action_id`) USING BTREE,
  INDEX `role_id`(`role_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2152 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_frame_access
-- ----------------------------
INSERT INTO `homyit_frame_access` VALUES (1, 10, '100000,110000,210000,210100,210101,210102,210103,210104,210105,210200,210201,210202,210203,210204,20205', '', 1, '');

-- ----------------------------
-- Table structure for homyit_frame_role
-- ----------------------------
DROP TABLE IF EXISTS `homyit_frame_role`;
CREATE TABLE `homyit_frame_role`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `title` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `table` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '用户角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_frame_role
-- ----------------------------
INSERT INTO `homyit_frame_role` VALUES (10, 0, 'public', '公共', '', 1);
INSERT INTO `homyit_frame_role` VALUES (21, 10, 'student', '学生', 'student', 1);
INSERT INTO `homyit_frame_role` VALUES (22, 21, 'class', '班委', 'student', 1);
INSERT INTO `homyit_frame_role` VALUES (31, 10, 'instructor', '教工', 'teacher', 1);
INSERT INTO `homyit_frame_role` VALUES (32, 31, 'admin', '管理员', 'teacher', 1);

-- ----------------------------
-- Table structure for homyit_frame_router
-- ----------------------------
DROP TABLE IF EXISTS `homyit_frame_router`;
CREATE TABLE `homyit_frame_router`  (
  `id` int(10) UNSIGNED NOT NULL,
  `pid` int(10) UNSIGNED NULL DEFAULT 0,
  `type` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `path` char(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content_type` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `models` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `rank` int(3) UNSIGNED NULL DEFAULT 500,
  `status` tinyint(1) UNSIGNED NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_frame_router
-- ----------------------------
INSERT INTO `homyit_frame_router` VALUES (100000, 0, 'nav', 'dashboard', '', NULL, '首页', 'icon-home', 990, 1);
INSERT INTO `homyit_frame_router` VALUES (210000, 0, 'nav', '/system', NULL, NULL, '系统管理', 'icon-puzzle', 930, 1);
INSERT INTO `homyit_frame_router` VALUES (210100, 210000, 'menu', '/system/role', 'tableList', 'list', '角色管理', 'icon-user', 900, 1);
INSERT INTO `homyit_frame_router` VALUES (210101, 210100, 'url', NULL, NULL, NULL, '新增', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210102, 210100, 'url', NULL, NULL, NULL, '详情', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210103, 210100, 'url', NULL, NULL, NULL, '列表', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210104, 210100, 'url', NULL, NULL, NULL, '删除', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210105, 210100, 'url', NULL, NULL, NULL, '更新', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210205, 210200, 'url', NULL, NULL, NULL, '更新', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210204, 210200, 'url', NULL, NULL, NULL, '删除', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210203, 210200, 'url', NULL, NULL, NULL, '列表', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210202, 210200, 'url', NULL, NULL, NULL, '详情', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210201, 210200, 'url', NULL, NULL, NULL, '新增', '', 500, 1);
INSERT INTO `homyit_frame_router` VALUES (210200, 210000, 'menu', '/system/modules', 'tableList', 'list', '模块管理', 'icon-user', 900, 1);
INSERT INTO `homyit_frame_router` VALUES (110000, 100000, 'menu', '/dashboard/workplace', 'workplace', 'project,activities,chart', '工作台', 'dashboard', 500, 1);

-- ----------------------------
-- Table structure for homyit_frame_table
-- ----------------------------
DROP TABLE IF EXISTS `homyit_frame_table`;
CREATE TABLE `homyit_frame_table`  (
  `id` int(10) NOT NULL,
  `router_id` int(10) NULL DEFAULT NULL,
  `table_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_frame_table
-- ----------------------------
INSERT INTO `homyit_frame_table` VALUES (1, 210100, 'role_manage', '1');

-- ----------------------------
-- Table structure for homyit_frame_table_field
-- ----------------------------
DROP TABLE IF EXISTS `homyit_frame_table_field`;
CREATE TABLE `homyit_frame_table_field`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `field_data_index` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `field_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `field_length` double(10, 0) NULL DEFAULT NULL,
  `radix_point` int(10) NULL DEFAULT 0,
  `status` int(10) NULL DEFAULT NULL,
  `table_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `link_to` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `field_title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_frame_table_field
-- ----------------------------
INSERT INTO `homyit_frame_table_field` VALUES (1, 'name', 'varchar', 255, 0, 1, '1', 'access', NULL);
INSERT INTO `homyit_frame_table_field` VALUES (2, 'title', 'varchar', 255, 0, 1, '1', NULL, NULL);
INSERT INTO `homyit_frame_table_field` VALUES (3, 'table', 'varchar', 255, 0, 1, '1', NULL, NULL);

-- ----------------------------
-- Table structure for homyit_user
-- ----------------------------
DROP TABLE IF EXISTS `homyit_user`;
CREATE TABLE `homyit_user`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `college_id` int(10) UNSIGNED NULL DEFAULT NULL,
  `name` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `role` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '',
  `user_no` char(15) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` char(150) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` char(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` char(60) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `qq` char(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` char(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `avatar_file` char(250) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `status` int(10) UNSIGNED NULL DEFAULT 1,
  `session_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `login_last_time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `login_times` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10008 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of homyit_user
-- ----------------------------
INSERT INTO `homyit_user` VALUES (10001, 1, '郑广芬', '10', '123', 'e10adc3949ba59abbe56e057f20f883e', '女', 'encrypt_val-sFPzwFWF2WBT5un-LpVJ2IFgZ86OqH19KeqP-415F1Q', '290008544', '', '280', 1, '', '1519292187131', 134);
INSERT INTO `homyit_user` VALUES (10003, 1, '袁光梁', ',31,', '1336822509', '3p1vY4XChOW_1MsIAluZILw-9SnZCvJPrHsWpJasNojBYhguB7P7sCd56h_ZvdLArxagF9eRsFw1SppNU7kCsqQUs_rgZWGyOLDZd5jQmMwv99HlO6mL3jdtu5ZoIN-A', '女', 'encrypt_val-bAdracWaRQrPXYUiAaU_qYER_pXk-36qupduEbYvF8g', '605920410', '', '280', 1, '', '1418095465', 1);
INSERT INTO `homyit_user` VALUES (10007, 1, '宋海安', ',31,', '1719512939', 'CoxV5-ATMd60dXrvg_A_4SDNEIgDkXEox1rk6ADSdmKtR93435R7e6MZZpuZvCph4S5HlaLH2Vxbn6qai0dUjmEC1wywV2cQL6-OAZrfhXvRRAZ5jqqNUYueQVuGPOvk', '女', 'encrypt_val-X9cnOz_MaHbO9c6iCq1PGZX4OE5A38ciHMM6DGlBqck', '883105468', '', '280', 1, '', '1417957026', 4);

SET FOREIGN_KEY_CHECKS = 1;
