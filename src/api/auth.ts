/**
 * 认证相关 API
 */

import { request } from "./base";
import type { AdminLoginRequest, AdminLoginResponse } from "./types";

/**
 * 认证 API
 */
export const authAPI = {
  /**
   * 管理员登录
   */
  login: async (data: AdminLoginRequest) => {
    try {
      return await request<AdminLoginResponse>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },
};
