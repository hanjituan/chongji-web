<template>
  <div class="pets-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>宠物列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增宠物
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入宠物名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.petType"
            style="width: 200px"
            placeholder="请选择类型"
            clearable
          >
            <el-option label="狗" value="狗" />
            <el-option label="猫" value="猫" />
            <el-option label="其他" value="其他" />
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

      <el-table :data="pets" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="petName" label="宠物名称" min-width="120" />
        <el-table-column prop="petType" label="类型" width="100" />
        <el-table-column prop="breed" label="品种" min-width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="birthday" label="生日" width="120" />
        <el-table-column prop="weight" label="体重(kg)" width="100" />
        <el-table-column prop="username" label="主人" width="120" />
        <el-table-column label="关联用户" min-width="150">
          <template #default="{ row }">
            <div v-if="row.owners && row.owners.length > 0">
              <el-tag
                v-for="user in row.owners"
                :key="user.userId"
                type="primary"
                style="margin-right: 4px; cursor: pointer"
                @click="handleViewUser(user)"
              >
                {{ user.username }}
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
        <el-table-column label="操作" width="180" fixed="right">
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="petForm" label-width="100px">
        <el-form-item label="宠物名称" required>
          <el-input v-model="petForm.petName" placeholder="请输入宠物名称" />
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select v-model="petForm.petType" placeholder="请选择类型">
            <el-option label="狗" value="狗" />
            <el-option label="猫" value="猫" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="品种">
          <el-input v-model="petForm.breed" placeholder="请输入品种" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="petForm.gender" placeholder="请选择性别">
            <el-option label="公" value="公" />
            <el-option label="母" value="母" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="petForm.birthday"
            type="date"
            placeholder="请选择生日"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="体重(kg)">
          <el-input-number
            v-model="petForm.weight"
            :min="0"
            :max="200"
            :precision="2"
            placeholder="请输入体重"
          />
        </el-form-item>
        <el-form-item label="头像URL">
          <el-input v-model="petForm.avatar" placeholder="请输入头像URL" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="petForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="主人ID" v-if="!petForm.id">
          <el-input-number
            v-model="petForm.userId"
            :min="1"
            placeholder="请输入主人ID"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saveLoading">
          确定
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="用户详情" size="500px">
      <el-descriptions :column="1" border v-if="currentUser">
        <el-descriptions-item label="用户ID">
          {{ currentUser.userId }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ currentUser.username }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ currentUser.email || "-" }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ currentUser.phone || "-" }}
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { adminPetAPI } from "@/api";
import type { AdminPet } from "@/api";
import dayjs from "dayjs";

const pets = ref<AdminPet[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const loading = ref(false);
const saveLoading = ref(false);
const drawerVisible = ref(false);
const currentUser = ref<any>(null);

const searchForm = reactive({
  keyword: "",
  petType: "",
});

const petForm = reactive<Partial<AdminPet>>({
  id: undefined,
  petName: "",
  petType: "",
  breed: "",
  gender: "",
  birthday: "",
  weight: undefined,
  avatar: "",
  description: "",
  userId: undefined,
});

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
});

onMounted(async () => {
  await loadPets();
});

const loadPets = async () => {
  try {
    loading.value = true;
    const response = await adminPetAPI.getAllPets({
      page: pagination.page - 1,
      size: pagination.size,
    });
    if (response && response.success) {
      pets.value = response.data;
      pagination.total = response.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "加载宠物列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = async () => {
  try {
    loading.value = true;
    pagination.page = 1;
    const params: any = {
      page: pagination.page - 1,
      size: pagination.size,
    };

    if (searchForm.keyword) {
      params.keyword = searchForm.keyword;
    }

    if (searchForm.petType) {
      params.petType = searchForm.petType;
    }

    const response = await adminPetAPI.getAllPets(params);
    if (response && response.success) {
      pets.value = response.data;
      pagination.total = response.total;
      ElMessage.success("搜索完成");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "搜索失败");
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  searchForm.keyword = "";
  searchForm.petType = "";
  pagination.page = 1;
  loadPets();
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.page = 1;
  loadPets();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadPets();
};

const handleAdd = () => {
  dialogTitle.value = "新增宠物";
  Object.assign(petForm, {
    id: undefined,
    petName: "",
    petType: "",
    breed: "",
    gender: "",
    birthday: "",
    weight: undefined,
    avatar: "",
    description: "",
    userId: undefined,
  });
  dialogVisible.value = true;
};

const handleEdit = (row: AdminPet) => {
  dialogTitle.value = "编辑宠物";
  Object.assign(petForm, {
    id: undefined,
    petName: "",
    petType: "",
    breed: "",
    gender: "",
    birthday: "",
    weight: undefined,
    avatar: "",
    description: "",
    userId: undefined,
  });
  Object.assign(petForm, row);
  dialogVisible.value = true;
};

const formatDate = (date: string) => {
  if (!date) return "-";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const handleViewUser = (user: any) => {
  currentUser.value = user;
  drawerVisible.value = true;
};

const handleDelete = (row: AdminPet) => {
  ElMessageBox.confirm(`确定要删除宠物 ${row.petName} 吗?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await adminPetAPI.deletePet(row.id);
      if (response.success) {
        ElMessage.success("删除成功");
        await loadPets();
      }
    } catch (error: any) {
      ElMessage.error(error.message || "删除失败");
    }
  });
};

const handleSave = async () => {
  if (!petForm.petName) {
    ElMessage.warning("请输入宠物名称");
    return;
  }
  if (!petForm.petType) {
    ElMessage.warning("请选择宠物类型");
    return;
  }

  try {
    saveLoading.value = true;

    const submitData: any = {
      petName: petForm.petName,
      petType: petForm.petType,
      breed: petForm.breed,
      gender: petForm.gender,
      birthday: petForm.birthday,
      weight: petForm.weight,
      avatar: petForm.avatar,
      description: petForm.description,
    };

    let response;

    if (petForm.id) {
      response = await adminPetAPI.updatePet(petForm.id, submitData);
    } else {
      if (!petForm.userId) {
        ElMessage.warning("请输入主人ID");
        return;
      }
      submitData.userId = petForm.userId;
      response = await adminPetAPI.createPet(submitData);
    }

    if (response.success) {
      ElMessage.success(
        response.message || (petForm.id ? "更新成功" : "创建成功"),
      );
      dialogVisible.value = false;
      await loadPets();
    }
  } catch (error: any) {
    ElMessage.error(error.message || "操作失败");
  } finally {
    saveLoading.value = false;
  }
};
</script>

<style scoped>
.pets-page {
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
