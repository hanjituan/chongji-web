<template>
  <div class="database-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据库表管理</span>
          <el-button
            type="primary"
            :icon="Refresh"
            @click="loadAllTables"
            :loading="loading"
          >
            刷新数据
          </el-button>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <el-icon class="is-loading">
          <Loading />
        </el-icon>
        <p>正在加载数据库信息...</p>
      </div>

      <div v-else-if="error" class="error-container">
        <el-alert :title="error" type="error" :closable="false" show-icon />
        <el-button
          type="primary"
          @click="loadAllTables"
          style="margin-top: 20px"
        >
          重新加载
        </el-button>
      </div>

      <div v-else-if="tables.length > 0">
        <el-alert
          :title="`共 ${totalTables} 张表`"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
        />

        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item
            v-for="table in tables"
            :key="table.tableName"
            :name="table.tableName"
          >
            <template #title>
              <div class="table-title">
                <el-icon><Files /></el-icon>
                <span class="table-name">{{ table.tableName }}</span>
                <el-tag size="small" type="info"
                  >{{ table.recordCount }} 条记录</el-tag
                >
              </div>
            </template>

            <!-- 表结构信息 -->
            <div class="table-info">
              <h4>
                <el-icon><Grid /></el-icon>
                表结构
              </h4>
              <el-table :data="table.columns" border stripe size="small">
                <el-table-column prop="columnName" label="字段名" width="200" />
                <el-table-column prop="dataType" label="数据类型" width="150" />
                <el-table-column prop="nullable" label="可为空" width="100">
                  <template #default="{ row }">
                    <el-tag
                      :type="row.nullable === 'YES' ? 'success' : 'danger'"
                      size="small"
                    >
                      {{ row.nullable }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="columnKey" label="键类型" width="120">
                  <template #default="{ row }">
                    <el-tag
                      v-if="row.columnKey === 'PRI'"
                      type="danger"
                      size="small"
                    >
                      主键
                    </el-tag>
                    <el-tag
                      v-else-if="row.columnKey === 'UNI'"
                      type="warning"
                      size="small"
                    >
                      唯一键
                    </el-tag>
                    <el-tag
                      v-else-if="row.columnKey === 'MUL'"
                      type="info"
                      size="small"
                    >
                      索引
                    </el-tag>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 表数据 -->
            <div class="table-data">
              <h4>
                <el-icon><DocumentCopy /></el-icon>
                表数据
                <el-button
                  type="primary"
                  size="small"
                  :icon="Download"
                  @click="exportTableData(table)"
                  style="margin-left: 10px"
                >
                  导出 JSON
                </el-button>
              </h4>

              <el-alert
                v-if="table.data.length === 0"
                title="该表暂无数据"
                type="info"
                :closable="false"
                show-icon
              />

              <el-table
                v-else
                :data="table.data"
                border
                stripe
                size="small"
                max-height="400"
                style="margin-top: 10px"
              >
                <el-table-column
                  v-for="column in table.columns"
                  :key="column.columnName"
                  :prop="column.columnName"
                  :label="column.columnName"
                  :min-width="getColumnWidth(column.dataType)"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span
                      v-if="row[column.columnName] === null"
                      class="null-value"
                      >NULL</span
                    >
                    <span
                      v-else-if="typeof row[column.columnName] === 'boolean'"
                    >
                      <el-tag
                        :type="row[column.columnName] ? 'success' : 'danger'"
                        size="small"
                      >
                        {{ row[column.columnName] }}
                      </el-tag>
                    </span>
                    <span v-else>{{
                      formatValue(row[column.columnName])
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-empty v-else description="暂无数据表" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { adminDatabaseAPI } from "@/api";
import {
  Refresh,
  Loading,
  Files,
  Grid,
  DocumentCopy,
  Download,
} from "@element-plus/icons-vue";

interface TableColumn {
  columnName: string;
  dataType: string;
  nullable: string;
  columnKey: string;
}

interface TableInfo {
  tableName: string;
  recordCount: number;
  columns: TableColumn[];
  data: any[];
}

const loading = ref(false);
const error = ref("");
const tables = ref<TableInfo[]>([]);
const totalTables = ref(0);
const activeNames = ref<string>("");

/**
 * 加载所有表的信息
 */
const loadAllTables = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await adminDatabaseAPI.getAllTables();

    if (response.success) {
      tables.value = response.data;
      totalTables.value = response.totalTables;
      ElMessage.success(response.message || "加载数据库信息成功");
    } else {
      error.value = response.message || "加载失败";
      ElMessage.error(error.value);
    }
  } catch (err: any) {
    error.value = err.message || "加载数据库信息失败";
    ElMessage.error(error.value);
    console.error("加载数据库表失败:", err);
  } finally {
    loading.value = false;
  }
};

/**
 * 根据数据类型获取列宽度
 */
const getColumnWidth = (dataType: string): number => {
  const lowerType = dataType.toLowerCase();

  if (lowerType.includes("text") || lowerType.includes("json")) {
    return 300;
  } else if (lowerType.includes("varchar")) {
    return 200;
  } else if (
    lowerType.includes("datetime") ||
    lowerType.includes("timestamp")
  ) {
    return 180;
  } else if (lowerType.includes("int") || lowerType.includes("decimal")) {
    return 120;
  } else {
    return 150;
  }
};

/**
 * 格式化值显示
 */
const formatValue = (value: any): string => {
  if (value === null) return "NULL";
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
};

/**
 * 导出表数据为 JSON
 */
const exportTableData = (table: TableInfo) => {
  const dataStr = JSON.stringify(
    {
      tableName: table.tableName,
      recordCount: table.recordCount,
      columns: table.columns,
      data: table.data,
    },
    null,
    2,
  );

  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${table.tableName}_${new Date().getTime()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  ElMessage.success(`已导出 ${table.tableName} 表数据`);
};

onMounted(() => {
  loadAllTables();
});
</script>

<style scoped>
.database-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-container {
  text-align: center;
  padding: 60px 0;
}

.loading-container .el-icon {
  font-size: 48px;
  color: #409eff;
}

.loading-container p {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
}

.error-container {
  text-align: center;
  padding: 40px 0;
}

.table-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.table-name {
  font-family: "Courier New", monospace;
  font-size: 16px;
  color: #409eff;
}

.table-info {
  margin-bottom: 30px;
}

.table-info h4,
.table-data h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.table-data {
  margin-top: 30px;
}

.null-value {
  color: #999;
  font-style: italic;
}

:deep(.el-collapse-item__header) {
  font-size: 15px;
  padding: 0 20px;
}

:deep(.el-collapse-item__content) {
  padding: 20px;
  background-color: #f9f9f9;
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
}
</style>
