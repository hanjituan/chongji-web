import { defineStore } from "pinia";
import { ref } from "vue";
import { authAPI } from "@/api";
import type { AdminLoginRequest } from "@/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string>(localStorage.getItem("token") || "");
  const username = ref<string>(localStorage.getItem("username") || "");
  const nickname = ref<string>(localStorage.getItem("nickname") || "");
  const userId = ref<string>(localStorage.getItem("userId") || "");
  const email = ref<string>(localStorage.getItem("email") || "");
  const role = ref<string>(localStorage.getItem("role") || "");
  const isLoggedIn = ref<boolean>(!!token.value && role.value === "ADMIN");

  /**
   * 登录方法：调用后端 API，并只接受管理员角色会话。
   */
  const login = async (user: string, pass: string) => {
    try {
      const params: AdminLoginRequest = {
        username: user,
        password: pass,
      };

      const response = await authAPI.login(params);
      if (response.success && response.token && response.data.role === "ADMIN") {
        const displayName = response.data.nickname || response.data.username;

        token.value = response.token;
        username.value = response.data.username;
        nickname.value = displayName;
        userId.value = response.data.id;
        email.value = response.data.email;
        role.value = response.data.role;
        isLoggedIn.value = true;

        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("nickname", displayName);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);

        return { success: true, message: response.message };
      }

      return { success: false, message: response.message || "登录失败" };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "登录失败，请稍后重试",
      };
    }
  };

  const logout = () => {
    token.value = "";
    username.value = "";
    nickname.value = "";
    userId.value = "";
    email.value = "";
    role.value = "";
    isLoggedIn.value = false;

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
  };

  return {
    token,
    username,
    nickname,
    userId,
    email,
    role,
    isLoggedIn,
    login,
    logout,
  };
});
