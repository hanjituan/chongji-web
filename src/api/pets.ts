/**
 * 宠物管理相关 API
 */

import { request, APIError } from "./base";
import type { AdminPet, PaginationParams, PaginationResponse } from "./types";

/**
 * 宠物管理 API
 */
export const adminPetAPI = {
  /**
   * 获取所有宠物列表
   */
  getAllPets: async (params?: PaginationParams & { petType?: string }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params?.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params?.keyword) queryParams.append("keyword", params.keyword);
      if (params?.petType) queryParams.append("petType", params.petType);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/admin/pets?${queryString}`
        : "/api/admin/pets";

      return await request<PaginationResponse<AdminPet>>(endpoint, {
        method: "GET",
      });
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
    }
  },

  /**
   * 根据 ID 获取宠物详情
   */
  getPetById: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminPet;
      }>(`/api/admin/pets/${id}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 创建宠物
   */
  createPet: async (data: Partial<AdminPet>) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminPet;
      }>("/api/admin/pets", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 更新宠物信息
   */
  updatePet: async (id: number, data: Partial<AdminPet>) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminPet;
      }>(`/api/admin/pets/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 删除宠物
   */
  deletePet: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: null;
      }>(`/api/admin/pets/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  },
};
