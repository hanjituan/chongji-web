/**
 * 数据库管理相关 API
 */

import { request } from "./base";

/**
 * 数据库管理 API
 */
export const adminDatabaseAPI = {
  /**
   * 获取所有表的信息
   */
  getAllTables: async () => {
    try {
      return await request<{
        success: boolean;
        message: string;
        totalTables: number;
        data: Array<{
          tableName: string;
          recordCount: number;
          columns: Array<{
            columnName: string;
            dataType: string;
            nullable: string;
            columnKey: string;
          }>;
          data: Array<any>;
        }>;
      }>("/api/admin/database/tables", {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取指定表的信息
   */
  getTableInfo: async (tableName: string) => {
    try {
      return await request<{
        success: boolean;
        message: string;
        data: {
          tableName: string;
          recordCount: number;
          columns: Array<{
            columnName: string;
            dataType: string;
            nullable: string;
            columnKey: string;
          }>;
          data: Array<any>;
        };
      }>(`/api/admin/database/tables/${tableName}`, {
        method: "GET",
      });
    } catch (error) {
      throw error;
    }
  },
};
