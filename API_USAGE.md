# API 使用说明

## 概述

本项目 API 已完整封装，包含请求拦截、响应拦截、错误处理等功能。

## API 基础配置

### 环境变量

在 `.env.development` 文件中配置开发环境 API 地址：

```env
VITE_API_BASE_URL=http://localhost:3001
```

在 `.env.production` 文件中配置生产环境 API 地址：

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## API 模块

### 1. 用户管理 API (adminUserAPI)

```typescript
import { adminUserAPI } from "@/api";

// 获取所有用户（支持分页）
const response = await adminUserAPI.getAllUsers({ page: 1, pageSize: 10 });

// 获取单个用户
const user = await adminUserAPI.getUserById(1);

// 创建用户
const newUser = await adminUserAPI.createUser({
  username: "test",
  name: "测试用户",
  email: "test@example.com",
  role: "普通用户",
  status: "active",
});

// 更新用户
const updatedUser = await adminUserAPI.updateUser(1, {
  name: "新名称",
});

// 删除用户
await adminUserAPI.deleteUser(1);

// 批量删除用户
await adminUserAPI.batchDeleteUsers([1, 2, 3]);
```

### 2. 日记管理 API (adminDiaryAPI)

```typescript
import { adminDiaryAPI } from "@/api";

// 获取所有日记（支持分页）
const response = await adminDiaryAPI.getAllDiaries({ page: 1, pageSize: 10 });

// 获取单条日记
const diary = await adminDiaryAPI.getDiaryById(1);

// 删除日记
await adminDiaryAPI.deleteDiary(1);

// 批量删除日记
await adminDiaryAPI.batchDeleteDiaries([1, 2, 3]);

// 更新日记状态
await adminDiaryAPI.updateDiaryStatus(1, "published");
```

### 3. 统计分析 API (adminStatsAPI)

```typescript
import { adminStatsAPI } from "@/api";

// 获取所有统计数据
const stats = await adminStatsAPI.getAllStats();
// 返回: { totalUsers, activeUsers, totalDiaries, todayDiaries, totalPets, todayNewUsers }

// 获取用户增长趋势（最近7天）
const userGrowth = await adminStatsAPI.getUserGrowthTrend(7);

// 获取日记发布趋势
const diaryTrend = await adminStatsAPI.getDiaryPublishTrend(7);

// 获取用户类型分布
const distribution = await adminStatsAPI.getUserTypeDistribution();

// 获取月度统计
const monthly = await adminStatsAPI.getMonthlyStats();
```

## 错误处理

### 使用 try-catch 捕获错误

```typescript
try {
  const response = await adminUserAPI.getAllUsers();
  if (response.success) {
    // 处理成功逻辑
    console.log(response.data);
  }
} catch (error: any) {
  // 错误已经在 API 层处理并格式化为 APIError
  ElMessage.error(error.message || "操作失败");
}
```

### 错误类型

API 封装了 `APIError` 类，包含以下属性：

- `message`: 错误消息
- `statusCode`: HTTP 状态码
- `response`: 原始响应数据

## 响应格式

### 成功响应

```typescript
{
  success: true,
  message: "操作成功",
  data: { /* 数据 */ }
}
```

### 分页响应

```typescript
{
  success: true,
  message: "获取成功",
  data: [/* 数据数组 */],
  total: 100,      // 总数
  page: 1,         // 当前页
  pageSize: 10     // 每页大小
}
```

### 错误响应

```typescript
{
  success: false,
  message: "错误描述",
  data: null
}
```

## 拦截器

### 请求拦截器

自动添加：

- `Content-Type: application/json`
- `Authorization: Bearer ${token}` (如果存在)

### 响应拦截器

自动处理：

- JSON 解析
- HTTP 状态码检查（401, 403, 404, 500）
- 业务状态码检查（success 字段）
- Token 过期自动清除

## 模拟数据降级

当后端接口不可用时，部分接口会自动使用模拟数据：

```typescript
// 如果请求失败，自动返回模拟数据
const response = await adminUserAPI.getAllUsers();
// 如果后端连接失败，返回预设的模拟用户数据
```

这在开发阶段特别有用，即使后端服务未启动，前端也能正常开发和测试。

## 在组件中使用示例

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { adminUserAPI } from "@/api";
import type { AdminUser } from "@/api";

const users = ref<AdminUser[]>([]);
const loading = ref(false);

const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await adminUserAPI.getAllUsers();
    if (response.success) {
      users.value = response.data;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "加载失败");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>
```

## 注意事项

1. **Token 管理**: Token 存储在 localStorage 中，过期后会自动清除
2. **错误提示**: 所有 API 错误都应该使用 try-catch 捕获并提示用户
3. **Loading 状态**: 建议在请求时显示 loading 状态，提升用户体验
4. **类型安全**: 使用 TypeScript 类型定义，确保类型安全
5. **网络降级**: 开发阶段网络错误会使用模拟数据，生产环境请确保后端可用
