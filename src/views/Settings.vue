<template>
  <div class="settings-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本设置" name="basic">
          <el-form
            :model="basicForm"
            label-width="120px"
            style="max-width: 600px"
          >
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.systemName" />
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="basicForm.version" disabled />
            </el-form-item>
            <el-form-item label="管理员邮箱">
              <el-input v-model="basicForm.adminEmail" />
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input
                v-model="basicForm.description"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="安全设置" name="security">
          <el-form
            :model="securityForm"
            label-width="120px"
            style="max-width: 600px"
          >
            <el-form-item label="密码最小长度">
              <el-input-number
                v-model="securityForm.minPasswordLength"
                :min="6"
                :max="20"
              />
            </el-form-item>
            <el-form-item label="登录失败次数">
              <el-input-number
                v-model="securityForm.maxLoginAttempts"
                :min="3"
                :max="10"
              />
            </el-form-item>
            <el-form-item label="会话超时(分钟)">
              <el-input-number
                v-model="securityForm.sessionTimeout"
                :min="10"
                :max="120"
              />
            </el-form-item>
            <el-form-item label="启用双因素认证">
              <el-switch v-model="securityForm.enableTwoFactor" />
            </el-form-item>
            <el-form-item label="强制HTTPS">
              <el-switch v-model="securityForm.forceHttps" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveSecurity">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notification">
          <el-form
            :model="notificationForm"
            label-width="120px"
            style="max-width: 600px"
          >
            <el-form-item label="邮件通知">
              <el-switch v-model="notificationForm.emailNotification" />
            </el-form-item>
            <el-form-item label="短信通知">
              <el-switch v-model="notificationForm.smsNotification" />
            </el-form-item>
            <el-form-item label="系统通知">
              <el-switch v-model="notificationForm.systemNotification" />
            </el-form-item>
            <el-form-item label="通知频率">
              <el-select v-model="notificationForm.frequency">
                <el-option label="实时" value="realtime" />
                <el-option label="每小时" value="hourly" />
                <el-option label="每天" value="daily" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveNotification">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="关于系统" name="about">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统名称">
              后台管理系统-宠记
            </el-descriptions-item>
            <el-descriptions-item label="版本号"> v1.0.0 </el-descriptions-item>
            <el-descriptions-item label="开发框架">
              Vue 3 + TypeScript
            </el-descriptions-item>
            <el-descriptions-item label="UI框架">
              Element Plus
            </el-descriptions-item>
            <el-descriptions-item label="图表库">
              ECharts
            </el-descriptions-item>
            <el-descriptions-item label="构建工具"> Vite </el-descriptions-item>
            <el-descriptions-item label="状态管理">
              Pinia
            </el-descriptions-item>
            <el-descriptions-item label="路由">
              Vue Router
            </el-descriptions-item>
            <el-descriptions-item label="最后更新">
              2024-03-01
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";

const activeTab = ref("basic");

const basicForm = reactive({
  systemName: "宠记",
  version: "v1.0.0",
  adminEmail: "admin@example.com",
  description: "这是一个基于Vue3的后台宠记 管理系统",
});

const securityForm = reactive({
  minPasswordLength: 6,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
  enableTwoFactor: false,
  forceHttps: true,
});

const notificationForm = reactive({
  emailNotification: true,
  smsNotification: false,
  systemNotification: true,
  frequency: "realtime",
});

const handleSaveBasic = () => {
  ElMessage.success("基本设置保存成功");
};

const handleSaveSecurity = () => {
  ElMessage.success("安全设置保存成功");
};

const handleSaveNotification = () => {
  ElMessage.success("通知设置保存成功");
};
</script>

<style scoped>
.settings-page {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
