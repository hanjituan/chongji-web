<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            style="width: 200px"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset" :loading="loading">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table
        :data="filteredUsers"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" min-width="100" fixed="left" />
        <el-table-column prop="username" label="用户名" min-width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="phone" label="手机号" min-width="130" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联宠物" min-width="150">
          <template #default="{ row }">
            <div v-if="row.pets && row.pets.length > 0">
              <el-tag
                v-for="(pet, index) in row.pets"
                :key="pet.id"
                type="primary"
                style="margin-right: 4px; cursor: pointer"
                @click="handleViewPet(pet)"
              >
                {{ pet.petName }}
              </el-tag>
            </div>
            <span v-else style="color: #999">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="userForm.status">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="loading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="宠物详情" size="500px">
      <el-descriptions :column="1" border v-if="currentPet">
        <el-descriptions-item label="ID">
          {{ currentPet.id }}
        </el-descriptions-item>
        <el-descriptions-item label="宠物名称">
          {{ currentPet.petName }}
        </el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag>{{ currentPet.petType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="品种">
          {{ currentPet.breed || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ currentPet.gender || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          {{ currentPet.birthday || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="体重">
          {{ currentPet.weight ? currentPet.weight + " kg" : "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="领养日期">
          {{ currentPet.adoptionDate || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(currentPet.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(currentPet.updatedAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="头像" v-if="currentPet.imageUrl">
          <el-image
            :src="currentPet.imageUrl"
            style="width: 100px; height: 100px"
            fit="cover"
            :preview-src-list="[currentPet.imageUrl]"
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { adminUserAPI } from "@/api";
import type { AdminUser } from "@/api";
import dayjs from "dayjs";

const users = ref<AdminUser[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const loading = ref(false);
const drawerVisible = ref(false);
const currentPet = ref<any>(null);

const searchForm = reactive({
  username: "",
  status: "",
});

const userForm = reactive<Partial<AdminUser>>({
  id: undefined,
  username: "",
  email: "",
  phone: "",
  role: "",
  status: 1,
});

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
});

// 不再需要前端过滤，数据由后端过滤返回
const filteredUsers = computed(() => users.value);

onMounted(async () => {
  await loadUsers();
});

const loadUsers = async () => {
  try {
    loading.value = true;
    const response = await adminUserAPI.getAllUsers({
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
    });
    if (response.success) {
      users.value = response.data;
      pagination.total = response.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "加载用户列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  try {
    loading.value = true;
    pagination.page = 1; // 搜索时重置到第一页
    const params: any = {
      page: pagination.page - 1,
      size: pagination.size,
    };

    // 添加搜索关键词
    if (searchForm.username) {
      params.keyword = searchForm.username;
    }

    // 添加状态过滤
    if (searchForm.status !== "") {
      params.status = searchForm.status;
    }

    const response = await adminUserAPI.getAllUsers(params);
    if (response.success) {
      users.value = response.data;
      pagination.total = response.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "搜索失败");
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  searchForm.username = "";
  searchForm.status = "";
  pagination.page = 1;
  loadUsers();
};

const handleAdd = () => {
  dialogTitle.value = "新增用户";
  Object.assign(userForm, {
    id: undefined,
    username: "",
    email: "",
    phone: "",
    role: "",
    status: 1,
  });
  dialogVisible.value = true;
};

const handleEdit = (row: AdminUser) => {
  dialogTitle.value = "编辑用户";
  //   先置空
  Object.assign(userForm, {
    id: undefined,
    username: "",
    email: "",
    phone: "",
    role: "",
    status: 1,
  });
  Object.assign(userForm, row);
  dialogVisible.value = true;
};

// 状态枚举映射
const STATUS_MAP = {
  0: { text: "禁用", type: "danger" },
  1: { text: "正常", type: "success" },
} as const;

// 辅助函数：获取状态类型
const getStatusType = (status: number) => {
  return STATUS_MAP[status as keyof typeof STATUS_MAP]?.type || "info";
};

// 辅助函数：获取状态文本
const getStatusText = (status: number) => {
  return STATUS_MAP[status as keyof typeof STATUS_MAP]?.text || "未知";
};

// 辅助函数：格式化日期
const formatDate = (date: string) => {
  if (!date) return "-";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const handleViewPet = (pet: any) => {
  currentPet.value = pet;
  drawerVisible.value = true;
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.page = 1;
  loadUsers();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadUsers();
};

const handleDelete = (row: AdminUser) => {
  ElMessageBox.confirm(`确定要删除用户 ${row.username} 吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await adminUserAPI.deleteUser(row.id);
      if (response.success) {
        ElMessage.success("删除成功");
        await loadUsers();
      }
    } catch (error: any) {
      ElMessage.error(error.message || "删除失败");
    }
  });
};

const handleSave = async () => {
  try {
    loading.value = true;

    // 准备提交数据
    const submitData: any = {
      username: userForm.username,
      email: userForm.email,
      phone: userForm.phone,
      status: userForm.status,
    };

    let response;

    if (userForm.id) {
      // 编辑用户
      response = await adminUserAPI.updateUser(userForm.id, submitData);
    } else {
      // 新增用户
      const createData = {
        ...submitData,
        password: "123456", // 默认密码
      };
      response = await adminUserAPI.createUser(createData);
    }

    if (response.success) {
      ElMessage.success(
        response.message || (userForm.id ? "更新成功" : "创建成功"),
      );
      dialogVisible.value = false;
      await loadUsers();
    }
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.users-page {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>
