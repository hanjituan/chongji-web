/**
 * 统计分析相关 API
 */

import { request, APIError } from "./base";
import type { AdminStats } from "./types";

/**
 * 统计分析 API
 */
export const adminStatsAPI = {
  /**
   * 获取所有统计数据
   */
  getAllStats: async () => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: AdminStats;
      }>("/api/admin/stats/overview", {
        method: "GET",
      });
    } catch (error) {
      // 如果是业务错误（APIError），直接抛出
      if (error instanceof APIError) {
        throw error;
      }

      // 网络错误时使用模拟数据
      console.warn("获取统计数据网络错误，使用模拟数据", error);
      return {
        success: true,
        message: "获取成功（模拟数据）",
        data: {
          totalUsers: 1234,
          activeUsers: 856,
          totalDiaries: 5678,
          todayDiaries: 45,
          totalPets: 2345,
          todayNewUsers: 12,
        },
      };
    }
  },

  /**
   * 获取用户增长趋势
   */
  getUserGrowthTrend: async (days: number = 7) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: Record<string, number>;
      }>(`/api/admin/stats/user-growth?days=${days}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取日记发布趋势
   */
  getDiaryTrend: async (days: number = 7) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: Record<string, number>;
      }>(`/api/admin/stats/diary-trend?days=${days}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取用户性别比例
   */
  getGenderRatio: async () => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: {
          total: number;
          genderStats: Array<{
            gender: string;
            count: number;
            percentage: string;
          }>;
        };
      }>("/api/admin/stats/gender-ratio", {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取宠物品种比例
   */
  getPetBreedRatio: async () => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: {
          total: number;
          distribution: Array<{
            breed: string;
            count: number;
            percentage: string;
          }>;
        };
      }>("/api/admin/stats/pet-breed-ratio", {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },
};
