/**
 * API 类型定义
 * 包含所有接口的请求和响应类型
 */

/**
 * 登录请求参数
 */
export interface AdminLoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    id: string;
    username: string;
    nickname?: string;
    email: string;
    role: "ADMIN";
  };
}

/**
 * 管理后台用户类型
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  status: number;
  createdAt: string;
  updatedAt?: string;
  pets?: AdminPet[];
}

/**
 * 管理后台日志类型
 */
export interface AdminLog {
  id: number;
  username: string;
  action: string;
  module: string;
  ip: string;
  timestamp: string;
  status: "success" | "warning" | "error";
  details?: string;
}

/**
 * 管理后台统计数据类型
 */
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDiaries: number;
  todayDiaries: number;
  totalPets: number;
  todayNewUsers: number;
}

/**
 * 日记媒体类型
 */
export type DiaryMediaType = "img" | "video" | "sticker";

/**
 * 日记媒体接口
 */
export interface DiaryMedia {
  name: string;
  url: string;
  type: DiaryMediaType;
}

/**
 * 管理后台日记类型
 */
export interface AdminDiary {
  id: number;
  petId: number;
  petName?: string;
  userId: number;
  username?: string;
  content: string;
  media: DiaryMedia[];
  tags: string[];
  shareToSquare: boolean;
  diaryDate: string;
  createdAt: string;
  updatedAt: string;
  status?: "published" | "draft" | "deleted";
  likeCount?: number;
  commentCount?: number;
  favoriteCount?: number;
}

/**
 * 管理后台宠物类型
 */
export interface AdminPet {
  id: number;
  userId: number;
  username?: string;
  petName: string;
  petType: string;
  breed?: string;
  gender?: string;
  birthday?: string;
  avatar?: string;
  weight?: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  users?: Array<{
    userId: string;
    username: string;
    email: string;
    phone?: string;
  }>;
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string | number;
}

/**
 * 分页响应数据
 */
export interface PaginationResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
