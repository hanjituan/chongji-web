/**
 * 用户管理相关 API
 */

import { request } from "./base";
import type { AdminUser, PaginationParams, PaginationResponse } from "./types";

/**
 * 用户管理 API
 */
export const adminUserAPI = {
  /**
   * 获取所有用户列表
   */
  getAllUsers: async (params?: PaginationParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params?.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params?.keyword) queryParams.append("keyword", params.keyword);
      if (params?.status !== undefined && params?.status !== "")
        queryParams.append("status", params.status.toString());

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/admin/users?${queryString}`
        : "/api/admin/users";

      const response = await request<PaginationResponse<AdminUser>>(endpoint, {
        method: "GET",
      });

      // 将后端返回的 name 字段映射为 username
      if (response.success && response.data) {
        response.data = response.data.map((user: any) => ({
          ...user,
          username: user.name || user.username,
        }));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 根据 ID 获取用户详情
   */
  getUserById: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminUser;
      }>(`/api/admin/users/${id}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 创建用户
   */
  createUser: async (data: Partial<AdminUser>) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminUser;
      }>("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 更新用户信息
   */
  updateUser: async (id: number, data: Partial<AdminUser>) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminUser;
      }>(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 删除用户
   */
  deleteUser: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: null;
      }>(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批量删除用户
   */
  batchDeleteUsers: async (ids: number[]) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: null;
      }>("/api/admin/users/batch-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
    } catch (error) {
      throw error;
    }
  },
};
