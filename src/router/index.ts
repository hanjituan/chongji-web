import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/Login.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "Layout",
      component: () => import("@/components/Layout.vue"),
      redirect: "/dashboard",
      meta: { requiresAuth: true },
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: () => import("@/views/Dashboard.vue"),
          meta: { title: "仪表盘" },
        },
        {
          path: "users",
          name: "Users",
          component: () => import("@/views/Users.vue"),
          meta: { title: "用户管理" },
        },
        {
          path: "logs",
          name: "Logs",
          component: () => import("@/views/Logs.vue"),
          meta: { title: "日志管理" },
        },
        {
          path: "pets",
          name: "Pets",
          component: () => import("@/views/Pets.vue"),
          meta: { title: "宠物管理" },
        },
        {
          path: "settings",
          name: "Settings",
          component: () => import("@/views/Settings.vue"),
          meta: { title: "系统设置" },
        },
        {
          path: "database",
          name: "Database",
          component: () => import("@/views/Database.vue"),
          meta: { title: "数据库管理" },
        },
      ],
    },
  ],
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next("/login");
  } else if (to.path === "/login" && authStore.isLoggedIn) {
    next("/");
  } else {
    next();
  }
});

export default router;
