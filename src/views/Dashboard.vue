<template>
  <div class="dashboard">
    <!-- 欢迎标题区域 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1 class="welcome-title">欢迎回来 👋</h1>
        <p class="welcome-desc">今天是 {{ currentDate }}，祝您工作愉快</p>
      </div>
      <div class="welcome-actions">
        <el-button type="primary" :icon="Refresh" @click="refreshData">
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon-wrapper">
            <el-icon class="stat-icon"><User /></el-icon>
          </div>
          <div class="stat-details">
            <p class="stat-label">用户总数</p>
            <h2 class="stat-value">{{ stats.totalUsers.toLocaleString() }}</h2>
            <p class="stat-trend">
              <el-icon><CaretTop /></el-icon>
              <span>较昨日 +12%</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon-wrapper">
            <el-icon class="stat-icon"><View /></el-icon>
          </div>
          <div class="stat-details">
            <p class="stat-label">活跃用户</p>
            <h2 class="stat-value">{{ stats.activeUsers.toLocaleString() }}</h2>
            <p class="stat-trend">
              <el-icon><CaretTop /></el-icon>
              <span>较昨日 +8%</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon-wrapper">
            <el-icon class="stat-icon"><Document /></el-icon>
          </div>
          <div class="stat-details">
            <p class="stat-label">日记总数</p>
            <h2 class="stat-value">
              {{ stats.totalDiaries.toLocaleString() }}
            </h2>
            <p class="stat-trend">
              <el-icon><CaretTop /></el-icon>
              <span>较昨日 +15%</span>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <div class="stat-card stat-card-red">
          <div class="stat-icon-wrapper">
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
          </div>
          <div class="stat-details">
            <p class="stat-label">今日新增</p>
            <h2 class="stat-value">{{ stats.todayNewUsers }}</h2>
            <p class="stat-trend">
              <el-icon><CaretTop /></el-icon>
              <span>较昨日 +5%</span>
            </p>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><DataLine /></el-icon>
                <span>日记发布趋势</span>
              </div>
              <el-tag type="info" size="small">近7天</el-tag>
            </div>
          </template>
          <div ref="visitChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><PieChart /></el-icon>
                <span>宠物品种分布</span>
              </div>
            </div>
          </template>
          <div ref="userChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="card-title">
                <el-icon><Histogram /></el-icon>
                <span>近7天数据趋势</span>
              </div>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button value="bar">柱状图</el-radio-button>
                <el-radio-button value="line">折线图</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div
            ref="barChartRef"
            class="chart-container chart-container-large"
          ></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import * as echarts from "echarts";
import type { ECharts } from "echarts";
import { adminStatsAPI } from "@/api";
import type { AdminStats } from "@/api";
import { ElMessage } from "element-plus";
import { CaretTop, Refresh } from "@element-plus/icons-vue";

const visitChartRef = ref<HTMLElement>();
const userChartRef = ref<HTMLElement>();
const barChartRef = ref<HTMLElement>();

let visitChart: ECharts | null = null;
let userChart: ECharts | null = null;
let barChart: ECharts | null = null;

// 统计数据
const stats = ref<AdminStats>({
  totalUsers: 0,
  activeUsers: 0,
  totalDiaries: 0,
  todayDiaries: 0,
  totalPets: 0,
  todayNewUsers: 0,
});

// 图表类型切换
const chartType = ref("bar");

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return now.toLocaleDateString("zh-CN", options);
});

// 监听图表类型变化
watch(chartType, () => {
  initBarChart();
});

onMounted(async () => {
  await loadStats();
  await initCharts();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  visitChart?.dispose();
  userChart?.dispose();
  barChart?.dispose();
  window.removeEventListener("resize", handleResize);
});

const handleResize = () => {
  visitChart?.resize();
  userChart?.resize();
  barChart?.resize();
};

// 刷新数据
const refreshData = async () => {
  await loadStats();
  await initCharts();
  ElMessage.success("数据已刷新");
};

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await adminStatsAPI.getAllStats();
    if (response.success) {
      stats.value = response.data;
    }
  } catch (error) {
    console.error("加载统计数据失败:", error);
  }
};

// 初始化所有图表
const initCharts = async () => {
  await initVisitChart();
  await initUserChart();
  await initBarChart();
};

const initVisitChart = async () => {
  if (!visitChartRef.value) return;

  try {
    const response = await adminStatsAPI.getDiaryTrend(7);
    const dataMap = response.data || {};

    // 将 Map 格式转换为数组
    const dates = Object.keys(dataMap).sort();
    const counts = dates.map((date) => dataMap[date]);

    visitChart = echarts.init(visitChartRef.value);

    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e4e7ed",
        borderWidth: 1,
        textStyle: {
          color: "#303133",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: "#e4e7ed",
          },
        },
        axisLabel: {
          color: "#606266",
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#f0f2f5",
            type: "dashed",
          },
        },
        axisLabel: {
          color: "#606266",
        },
      },
      series: [
        {
          data: counts,
          type: "line",
          smooth: true,
          symbolSize: 8,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(64, 158, 255, 0.3)" },
              { offset: 1, color: "rgba(64, 158, 255, 0.05)" },
            ]),
          },
          lineStyle: {
            width: 3,
            color: "#409eff",
          },
          itemStyle: {
            color: "#409eff",
            borderColor: "#fff",
            borderWidth: 2,
          },
        },
      ],
    };

    visitChart.setOption(option);
  } catch (error) {
    console.error("初始化日记趋势图表失败:", error);
  }
};

const initUserChart = async () => {
  if (!userChartRef.value) return;

  try {
    const response = await adminStatsAPI.getPetBreedRatio();
    const distribution = response.data?.distribution || [];

    // 转换为 ECharts 需要的格式
    const chartData = distribution.map((item) => ({
      name: item.breed,
      value: item.count,
    }));

    userChart = echarts.init(userChartRef.value);

    const option = {
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e4e7ed",
        borderWidth: 1,
        textStyle: {
          color: "#303133",
        },
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        bottom: "5%",
        left: "center",
        textStyle: {
          color: "#606266",
        },
      },
      color: ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399"],
      series: [
        {
          type: "pie",
          radius: ["45%", "70%"],
          center: ["50%", "45%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 3,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.3)",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    };

    userChart.setOption(option);
  } catch (error) {
    console.error("初始化宠物品种分布图表失败:", error);
  }
};

const initBarChart = async () => {
  if (!barChartRef.value) return;

  try {
    const [userGrowthRes, diaryTrendRes] = await Promise.all([
      adminStatsAPI.getUserGrowthTrend(7),
      adminStatsAPI.getDiaryTrend(7),
    ]);

    const userGrowthMap = userGrowthRes.data || {};
    const diaryTrendMap = diaryTrendRes.data || {};

    // 获取所有日期并排序
    const allDates = Array.from(
      new Set([...Object.keys(userGrowthMap), ...Object.keys(diaryTrendMap)]),
    ).sort();

    const userGrowthData = allDates.map((date) => userGrowthMap[date] || 0);
    const diaryTrendData = allDates.map((date) => diaryTrendMap[date] || 0);

    barChart = echarts.init(barChartRef.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: chartType.value === "bar" ? "shadow" : "line",
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#e4e7ed",
        borderWidth: 1,
        textStyle: {
          color: "#303133",
        },
      },
      legend: {
        top: "2%",
        textStyle: {
          color: "#606266",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "12%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: allDates,
        axisLine: {
          lineStyle: {
            color: "#e4e7ed",
          },
        },
        axisLabel: {
          color: "#606266",
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "#f0f2f5",
            type: "dashed",
          },
        },
        axisLabel: {
          color: "#606266",
        },
      },
      series: [
        {
          name: "新增用户",
          type: chartType.value,
          data: userGrowthData,
          smooth: true,
          itemStyle: {
            color: "#409eff",
            borderRadius: chartType.value === "bar" ? [4, 4, 0, 0] : 0,
          },
          lineStyle: chartType.value === "line" ? { width: 3 } : undefined,
        },
        {
          name: "日记发布",
          type: chartType.value,
          data: diaryTrendData,
          smooth: true,
          itemStyle: {
            color: "#67c23a",
            borderRadius: chartType.value === "bar" ? [4, 4, 0, 0] : 0,
          },
          lineStyle: chartType.value === "line" ? { width: 3 } : undefined,
        },
      ],
    };

    barChart.setOption(option);
  } catch (error) {
    console.error("初始化趋势统计图表失败:", error);
  }
};
</script>

<style scoped>
.dashboard {
  width: 100%;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8edf3 100%);
  min-height: calc(100vh - 120px);
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px 40px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.welcome-content .welcome-title {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-content .welcome-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片区域 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  height: 130px;
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  transition: all 0.3s;
}

.stat-card-blue::before {
  background: #409eff;
}

.stat-card-green::before {
  background: #67c23a;
}

.stat-card-orange::before {
  background: #e6a23c;
}

.stat-card-red::before {
  background: #f56c6c;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.stat-card:hover::before {
  width: 140px;
  height: 140px;
  opacity: 0.15;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.stat-card-blue .stat-icon-wrapper {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.stat-card-green .stat-icon-wrapper {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  box-shadow: 0 4px 16px rgba(103, 194, 58, 0.3);
}

.stat-card-orange .stat-icon-wrapper {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
  box-shadow: 0 4px 16px rgba(230, 162, 60, 0.3);
}

.stat-card-red .stat-icon-wrapper {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  box-shadow: 0 4px 16px rgba(245, 108, 108, 0.3);
}

.stat-icon {
  font-size: 28px;
  color: #fff;
}

.stat-details {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 8px 0;
  line-height: 1;
}

.stat-trend {
  font-size: 13px;
  color: #67c23a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend .el-icon {
  font-size: 16px;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.chart-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.chart-card :deep(.el-card__header) {
  border-bottom: 1px solid #f0f2f5;
  padding: 20px 24px;
  background: linear-gradient(to right, #fafafa, #fff);
}

.chart-card :deep(.el-card__body) {
  padding: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-title .el-icon {
  font-size: 18px;
  color: #409eff;
}

.chart-container {
  height: 320px;
  width: 100%;
}

.chart-container-large {
  height: 380px;
}

/* 响应式 */
@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 24px;
  }

  .welcome-content .welcome-title {
    font-size: 24px;
  }

  .stat-card {
    height: auto;
  }

  .stat-value {
    font-size: 24px;
  }

  .chart-container {
    height: 260px;
  }

  .chart-container-large {
    height: 300px;
  }
}
</style>
