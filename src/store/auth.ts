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
  const isLoggedIn = ref<boolean>(!!token.value);

  /**
   * 登录方法：调用后端 API
   */
  const login = async (user: string, pass: string) => {
    try {
      const params: AdminLoginRequest = {
        username: user,
        password: pass,
      };

      const response = await authAPI.login(params);

      if (response.success && response.token) {
        // 保存 token 和用户信息
        token.value = response.token;
        username.value = response.data.username;
        nickname.value = response.data.nickname;
        userId.value = response.data.id;
        email.value = response.data.email;
        isLoggedIn.value = true;

        // 持久化到 localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("email", response.data.email);

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

  /**
   * 退出登录
   */
  const logout = () => {
    token.value = "";
    username.value = "";
    nickname.value = "";
    userId.value = "";
    email.value = "";
    isLoggedIn.value = false;

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
  };

  return {
    token,
    username,
    nickname,
    userId,
    email,
    isLoggedIn,
    login,
    logout,
  };
});
