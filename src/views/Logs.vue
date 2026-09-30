<template>
  <div class="logs-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>日记管理</span>
          <el-button type="primary" @click="handleExport">
            导出表格数据
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
        <el-form-item label="宠物名">
          <el-input
            v-model="searchForm.petName"
            placeholder="请输入宠物名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="logs" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="petName" label="宠物" width="120" />
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="tags" label="标签" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag"
              size="small"
              style="margin-right: 4px"
            >
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shareToSquare" label="分享" width="80">
          <template #default="{ row }">
            <el-tag :type="row.shareToSquare ? 'success' : 'info'" size="small">
              {{ row.shareToSquare ? "已分享" : "未分享" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="likeCount"
          label="点赞"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span style="color: #f56c6c">
              <el-icon><StarFilled /></el-icon>
              {{ row.likeCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commentCount"
          label="评论"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span style="color: #409eff">
              <el-icon><ChatDotRound /></el-icon>
              {{ row.commentCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="favoriteCount"
          label="收藏"
          width="80"
          align="center"
        >
          <template #default="{ row }">
            <span style="color: #e6a23c">
              <el-icon><Star /></el-icon>
              {{ row.favoriteCount || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="diaryDate" label="日期" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
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

    <el-dialog v-model="dialogVisible" title="日记详情" width="800px">
      <el-descriptions :column="2" border v-if="currentLog">
        <el-descriptions-item label="ID">{{
          currentLog.id
        }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{
          currentLog.username
        }}</el-descriptions-item>
        <el-descriptions-item label="宠物">{{
          currentLog.petName
        }}</el-descriptions-item>
        <el-descriptions-item label="日期">{{
          currentLog.diaryDate
        }}</el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">
          {{ currentLog.content }}
        </el-descriptions-item>
        <el-descriptions-item label="标签">
          <el-tag
            v-for="tag in currentLog.tags"
            :key="tag"
            size="small"
            style="margin-right: 4px"
          >
            {{ tag }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="分享状态">
          <el-tag :type="currentLog.shareToSquare ? 'success' : 'info'">
            {{ currentLog.shareToSquare ? "已分享到广场" : "未分享" }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="媒体文件"
          :span="2"
          v-if="currentLog.media && currentLog.media.length > 0"
        >
          <div class="media-grid">
            <div
              v-for="(item, index) in currentLog.media"
              :key="index"
              class="media-item"
            >
              <el-image
                v-if="item.type === 'img'"
                :src="item.url"
                :alt="item.name"
                fit="cover"
                style="width: 100px; height: 100px"
                :preview-src-list="[item.url]"
              />
              <video
                v-else-if="item.type === 'video'"
                :src="item.url"
                controls
                style="width: 200px; height: 150px"
              />
              <div v-else>{{ item.name }}</div>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ currentLog.createdAt }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ currentLog.updatedAt }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { adminDiaryAPI, AdminDiary } from "@/api";
import dayjs from "dayjs";

const logs = ref<AdminDiary[]>([]);
const dialogVisible = ref(false);
const currentLog = ref<AdminDiary | null>(null);
const loading = ref(false);

const searchForm = reactive({
  username: "",
  petName: "",
});

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
});

onMounted(async () => {
  await loadLogs();
});

const loadLogs = async () => {
  try {
    loading.value = true;
    const params: any = {
      page: pagination.page - 1, // 后端从0开始
      size: pagination.size,
    };

    // 添加搜索条件
    if (searchForm.username) {
      params.keyword = searchForm.username;
    }

    if (searchForm.petName) {
      params.petName = searchForm.petName;
    }

    const response = await adminDiaryAPI.getAllDiaries(params);
    if (response.success) {
      logs.value = response.data;
      pagination.total = response.total;
    }
  } catch (error: any) {
    ElMessage.error(error.message || "加载日记列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.page = 1;
  loadLogs();
};

const handleReset = () => {
  searchForm.username = "";
  searchForm.petName = "";
  pagination.page = 1;
  loadLogs();
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  pagination.page = 1;
  loadLogs();
};

const handleCurrentChange = (page: number) => {
  pagination.page = page;
  loadLogs();
};

const handleView = (row: AdminDiary) => {
  currentLog.value = row;
  dialogVisible.value = true;
};

const handleDelete = (row: AdminDiary) => {
  ElMessageBox.confirm(`确定要删除这条日记吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await adminDiaryAPI.deleteDiary(row.id);
      if (response.success) {
        ElMessage.success("删除成功");
        await loadLogs();
      }
    } catch (error: any) {
      ElMessage.error(error.message || "删除失败");
    }
  });
};

const handleExport = () => {
  try {
    // 准备导出数据
    const exportData = logs.value.map((log) => ({
      ID: log.id,
      用户名: log.username || "",
      宠物名: log.petName || "",
      内容: log.content,
      标签: log.tags.join(", "),
      分享状态: log.shareToSquare ? "已分享" : "未分享",
      日记日期: log.diaryDate,
      创建时间: dayjs(log.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    }));

    // 转换为 JSON 字符串
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const link = document.createElement("a");
    link.href = url;
    link.download = `日记数据_${dayjs().format("YYYY-MM-DD_HH-mm-ss")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    ElMessage.error(error.message || "导出失败");
  }
};
</script>

<style scoped>
.logs-page {
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

.media-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.media-item {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px;
}
</style>
