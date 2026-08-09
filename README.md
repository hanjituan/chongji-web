# Vue3 后台管理系统(宠记)

这是一个基于 Vue3 + TypeScript + Element Plus 的现代化后台管理系统。

## 技术栈

- **前端框架**: Vue 3.5
- **构建工具**: Vite 6
- **编程语言**: TypeScript 5.7
- **UI 组件库**: Element Plus 2.9
- **路由管理**: Vue Router 4.5
- **状态管理**: Pinia 2.3
- **图表库**: ECharts 5.6

## 功能特性

- ✅ 用户认证登录
- ✅ 仪表盘数据可视化（统计卡片、图表分析）
- ✅ 用户管理（列表查询、新增、编辑、删除）
- ✅ 日记管理（查看、删除）
- ✅ 系统设置
- ✅ 响应式布局
- ✅ 侧边栏折叠
- ✅ 完整的 API 接口封装（错误处理、拦截器）

## 默认账号

```
用户名: admin
密码: admin123
```

## API 接口

### 后端接口地址配置

在 `.env.development` 中配置开发环境 API 地址：

```env
VITE_API_BASE_URL=http://localhost:3001
```

### 接口列表

所有管理端接口统一前缀：`/api/admin`

#### 1. 用户管理 `/api/admin/users`

- `GET /api/admin/users` - 获取用户列表（支持分页）
- `GET /api/admin/users/:id` - 获取用户详情
- `POST /api/admin/users` - 创建用户
- `PUT /api/admin/users/:id` - 更新用户
- `DELETE /api/admin/users/:id` - 删除用户
- `POST /api/admin/users/batch-delete` - 批量删除用户

#### 2. 日记管理 `/api/admin/diaries`

- `GET /api/admin/diaries` - 获取日记列表（支持分页）
- `GET /api/admin/diaries/:id` - 获取日记详情
- `DELETE /api/admin/diaries/:id` - 删除日记
- `POST /api/admin/diaries/batch-delete` - 批量删除日记
- `PUT /api/admin/diaries/:id/status` - 更新日记状态

#### 3. 统计分析 `/api/admin/stats`

- `GET /api/admin/stats` - 获取所有统计数据
- `GET /api/admin/stats/user-growth?days=7` - 获取用户增长趋势
- `GET /api/admin/stats/diary-publish?days=7` - 获取日记发布趋势
- `GET /api/admin/stats/user-type-distribution` - 获取用户类型分布
- `GET /api/admin/stats/monthly` - 获取月度数据统计

### API 响应格式

所有接口统一返回格式：

```typescript
{
  success: boolean,      // 操作是否成功
  message: string,       // 提示消息
  data: T,              // 返回数据
  total?: number,       // 总数（分页接口）
  page?: number,        // 当前页（分页接口）
  pageSize?: number     // 每页大小（分页接口）
}
```

### 错误处理

API 已内置完整的错误处理机制：

- 401: 未授权，自动清除 token
- 403: 无权限访问
- 404: 资源不存在
- 500: 服务器错误
- 网络错误时自动降级使用模拟数据（开发阶段）

## 安装与运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
chongji-web/
├── src/
│   ├── api/              # API 接口
│   ├── components/       # 公共组件
│   │   └── Layout.vue    # 布局组件
│   ├── router/           # 路由配置
│   ├── store/            # Pinia 状态管理
│   │   └── auth.ts       # 认证状态
│   ├── types/            # TypeScript 类型定义
│   ├── views/            # 页面组件
│   │   ├── Login.vue     # 登录页
│   │   ├── Dashboard.vue # 仪表盘
│   │   ├── Users.vue     # 用户管理
│   │   ├── Logs.vue      # 日志管理
│   │   └── Settings.vue  # 系统设置
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── style.css         # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 主要页面

### 登录页面

- 用户名密码登录
- 表单验证
- 默认账号提示

### 仪表盘

- 统计卡片（用户、访问量、文档、异常）
- 访问趋势折线图
- 用户分布饼图
- 数据统计柱状图

### 用户管理

- 用户列表展示
- 搜索与筛选
- 添加/编辑/删除用户
- 用户状态管理

### 日志管理

- 日志列表
- 多条件筛选
- 日志详情查看
- 导出功能

### 系统设置

- 基本设置
- 安全设置
- 通知设置
- 系统信息

## 开发说明

所有数据为模拟数据，实际项目中需要替换为真实的后端 API 接口。

## License

MIT
