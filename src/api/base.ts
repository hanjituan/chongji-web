/**
 * API 基础工具函数
 * 包含请求拦截器、响应拦截器、错误处理等
 */

// API 基础地址，开发环境使用代理，生产环境可通过环境变量配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * 自定义错误类
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any,
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * 错误处理拦截器
 */
function handleError(error: any, endpoint: string): never {
  console.error(`[API Error] ${endpoint}:`, error);

  // 网络错误
  if (error instanceof TypeError && error.message.includes("fetch")) {
    throw new APIError("网络连接失败，请检查您的网络设置", 0, error);
  }

  // API 错误响应
  if (error instanceof APIError) {
    throw error;
  }

  // 其他错误
  throw new APIError(
    error.message || "请求失败，请稍后重试",
    error.statusCode,
    error,
  );
}

/**
 * 请求拦截器：在请求发送前添加通用处理
 */
function requestInterceptor(
  config: RequestInit,
  endpoint: string,
): RequestInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config.headers as Record<string, string>),
  };

  // 登录接口不需要 token，其他接口需要
  if (!endpoint.includes("/login")) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log(
        `[API Request] ${endpoint} - Token: ${token.substring(0, 20)}...`,
      );
    } else {
      console.warn(`[API Request] ${endpoint} - No token found!`);
    }
  } else {
    console.log(`[API Request] ${endpoint} - Login request, no token needed`);
  }

  return {
    ...config,
    headers,
  };
}

/**
 * 响应拦截器：统一处理响应数据
 */
async function responseInterceptor(response: Response, _endpoint: string) {
  // 先尝试解析 JSON
  let data;
  try {
    data = await response.json();
  } catch (e) {
    // 如果无法解析 JSON，根据状态码返回默认错误
    if (response.status === 401) {
      localStorage.removeItem("token");
      throw new APIError("登录已过期，请重新登录", 401);
    }
    if (response.status === 403) {
      throw new APIError("没有权限访问该资源", 403);
    }
    if (response.status === 404) {
      throw new APIError("请求的资源不存在", 404);
    }
    if (response.status === 500) {
      throw new APIError("服务器错误，请稍后重试", 500);
    }
    if (!response.ok) {
      throw new APIError(`请求失败 (${response.status})`, response.status);
    }
    return null;
  }

  // 处理不同的状态码（优先使用后端返回的消息）
  if (response.status === 401) {
    // 未授权，清除 token
    localStorage.removeItem("token");
    throw new APIError(data.message || "登录已过期，请重新登录", 401, data);
  }

  if (response.status === 403) {
    throw new APIError(data.message || "没有权限访问该资源", 403, data);
  }

  if (response.status === 404) {
    throw new APIError(data.message || "请求的资源不存在", 404, data);
  }

  if (response.status === 500) {
    throw new APIError(data.message || "服务器错误，请稍后重试", 500, data);
  }

  // 检查 HTTP 状态码
  if (!response.ok) {
    throw new APIError(
      data.message || `请求失败 (${response.status})`,
      response.status,
      data,
    );
  }

  // 检查业务状态码（关键：即使 HTTP 200，业务层也可能失败）
  if (data && data.success === false) {
    throw new APIError(data.message || "操作失败", response.status, data);
  }

  return data;
}

/**
 * 通用请求函数（带完整的拦截器）
 */
export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    // 请求拦截
    const config = requestInterceptor(options, endpoint);

    // 发送请求
    const response = await fetch(url, config);

    // 响应拦截
    const data = await responseInterceptor(response, endpoint);

    return data as T;
  } catch (error) {
    // 错误拦截
    return handleError(error, endpoint);
  }
}
