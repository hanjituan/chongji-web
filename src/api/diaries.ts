/**
 * 日记管理相关 API
 */

import { request, APIError } from "./base";
import type { AdminDiary, PaginationParams, PaginationResponse } from "./types";

/**
 * 日记管理 API
 */
export const adminDiaryAPI = {
  /**
   * 获取所有日记列表
   */
  getAllDiaries: async (params?: PaginationParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page !== undefined)
        queryParams.append("page", params.page.toString());
      if (params?.size !== undefined)
        queryParams.append("size", params.size.toString());
      if (params?.keyword) queryParams.append("keyword", params.keyword);
      if ((params as any)?.petName)
        queryParams.append("petName", (params as any).petName);

      const queryString = queryParams.toString();
      const endpoint = queryString
        ? `/api/admin/diaries?${queryString}`
        : "/api/admin/diaries";

      return await request<PaginationResponse<AdminDiary>>(endpoint, {
        method: "GET",
      });
    } catch (error) {
      // 如果是业务错误（APIError），直接抛出
      if (error instanceof APIError) {
        throw error;
      }

      // 网络错误时使用模拟数据
      console.warn("获取日记列表网络错误，使用模拟数据", error);
      return {
        success: true,
        message: "获取成功（模拟数据）",
        data: [
          {
            id: 1,
            petId: 1,
            petName: "小白",
            userId: 1,
            username: "张三",
            content: "今天带小白去公园玩了，它很开心！",
            media: [
              {
                name: "photo1.jpg",
                url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
                type: "img" as const,
              },
            ],
            tags: ["散步", "公园"],
            shareToSquare: true,
            diaryDate: "2024-03-01",
            createdAt: "2024-03-01 10:00:00",
            updatedAt: "2024-03-01 10:00:00",
            status: "published" as const,
          },
          {
            id: 2,
            petId: 2,
            petName: "咪咪",
            userId: 2,
            username: "李四",
            content: "咪咪今天很乖，一直在睡觉",
            media: [],
            tags: ["日常"],
            shareToSquare: false,
            diaryDate: "2024-03-02",
            createdAt: "2024-03-02 14:30:00",
            updatedAt: "2024-03-02 14:30:00",
            status: "published" as const,
          },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      };
    }
  },

  /**
   * 根据 ID 获取日记详情
   */
  getDiaryById: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminDiary;
      }>(`/api/admin/diaries/${id}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 删除日记
   */
  deleteDiary: async (id: number) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: null;
      }>(`/api/admin/diaries/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批量删除日记
   */
  batchDeleteDiaries: async (ids: number[]) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: null;
      }>("/api/admin/diaries/batch-delete", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 更新日记状态
   */
  updateDiaryStatus: async (
    id: number,
    status: "published" | "draft" | "deleted",
  ) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminDiary;
      }>(`/api/admin/diaries/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      throw error;
    }
  },
};
