/**
 * API 统一导出入口
 *
 * 模块化结构：
 * - base.ts: 基础工具函数（请求拦截器、响应拦截器、错误处理）
 * - types.ts: 类型定义
 * - auth.ts: 认证相关 API
 * - users.ts: 用户管理 API
 * - diaries.ts: 日记管理 API
 * - stats.ts: 统计分析 API
 * - database.ts: 数据库管理 API
 */

// 导出基础工具
export { APIError, request } from "./base";

// 导出类型定义
export type {
  AdminLoginRequest,
  AdminLoginResponse,
  AdminUser,
  AdminLog,
  AdminStats,
  AdminPet,
  DiaryMediaType,
  DiaryMedia,
  AdminDiary,
  PaginationParams,
  PaginationResponse,
} from "./types";

// 导出各模块 API
export { authAPI } from "./auth";
export { adminUserAPI } from "./users";
export { adminDiaryAPI } from "./diaries";
export { adminStatsAPI } from "./stats";
export { adminDatabaseAPI } from "./database";
export { adminPetAPI } from "./pets";

/**
 * ========================================
 * 兼容旧版本的导出（保持向后兼容）
 * ========================================
 */
import { adminUserAPI } from "./users";

export const getUsers = adminUserAPI.getAllUsers;
export const getLogs = async () => {
  // 日志功能可以后续扩展
  return {
    success: true,
    message: "日志功能开发中",
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  };
};
export const deleteUser = adminUserAPI.deleteUser;
