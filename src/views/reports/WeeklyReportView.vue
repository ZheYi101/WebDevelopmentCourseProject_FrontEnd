<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import PageSection from '@/components/common/PageSection.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useMemberOptionsQuery } from '@/composables/use-reference-data'
import { useCreateReportMutation, useReportsQuery, useReviewReportMutation, useUpdateReportMutation } from '@/composables/use-report-management'
import { weeklyReportStatusMetaMap, weeklyReportStatusOptions } from '@/constants/options'
import { useAuthStore } from '@/stores/auth'
import type { CreateWeeklyReportRequest, ReviewWeeklyReportRequest, WeeklyReport, WeeklyReportStatus } from '@/types/api'
import { formatDateTime } from '@/utils/format'

const authStore = useAuthStore()
const canReview = computed(() => authStore.hasAnyRole(['DEPT_MANAGER', 'TECH_DIRECTOR', 'GENERAL_MANAGER']))

const filters = reactive({
  weekNo: '',
  memberId: undefined as number | undefined,
  status: undefined as WeeklyReportStatus | undefined,
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
})

const queryParams = computed(() => ({
  weekNo: filters.weekNo || undefined,
  memberId: filters.memberId,
  status: filters.status,
  pageNo: pagination.pageNo,
  pageSize: pagination.pageSize,
}))

const reportsQuery = useReportsQuery(queryParams)
const memberOptionsQuery = useMemberOptionsQuery()
const createReportMutation = useCreateReportMutation()
const updateReportMutation = useUpdateReportMutation()
const reviewReportMutation = useReviewReportMutation()

const dialogVisible = ref(false)
const editingReport = ref<WeeklyReport | null>(null)
const formRef = ref<FormInstance>()
const form = reactive({
  memberId: undefined as number | undefined,
  weekNo: '',
  summary: '',
  nextPlan: '',
})

const rules = {
  memberId: [{ required: true, message: '请选择成员', trigger: 'change' }],
  weekNo: [{ required: true, message: '请输入周次', trigger: 'blur' }],
  summary: [{ required: true, message: '请填写本周总结', trigger: 'blur' }],
  nextPlan: [{ required: true, message: '请填写下周计划', trigger: 'blur' }],
}

const reviewDialogVisible = ref(false)
const reviewTarget = ref<WeeklyReport | null>(null)
const reviewForm = reactive({
  status: 'REVIEWED' as 'REVIEWED' | 'RETURNED',
  managerComment: '',
})

const tableData = computed(() => reportsQuery.data.value?.records ?? [])

function getReportStatusMeta(status: WeeklyReportStatus) {
  return weeklyReportStatusMetaMap[status]
}

function resetFilters() {
  filters.weekNo = ''
  filters.memberId = undefined
  filters.status = undefined
  pagination.pageNo = 1
}

function resetForm() {
  form.memberId = undefined
  form.weekNo = ''
  form.summary = ''
  form.nextPlan = ''
  formRef.value?.clearValidate()
}

function openCreateDialog() {
  editingReport.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(report: WeeklyReport) {
  editingReport.value = report
  form.memberId = report.memberId
  form.weekNo = report.weekNo
  form.summary = report.summary
  form.nextPlan = report.nextPlan
  dialogVisible.value = true
}

async function submitReport() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  if (editingReport.value) {
    await updateReportMutation.mutateAsync({
      reportId: editingReport.value.id,
      payload: {
        summary: form.summary,
        nextPlan: form.nextPlan,
      },
    })
    ElMessage.success('周报已更新')
  } else {
    const payload: CreateWeeklyReportRequest = {
      memberId: form.memberId as number,
      weekNo: form.weekNo,
      summary: form.summary,
      nextPlan: form.nextPlan,
    }

    await createReportMutation.mutateAsync(payload)
    ElMessage.success('周报已创建')
  }

  dialogVisible.value = false
  resetForm()
}

function openReviewDialog(report: WeeklyReport) {
  reviewTarget.value = report
  reviewForm.status = report.status === 'RETURNED' ? 'RETURNED' : 'REVIEWED'
  reviewForm.managerComment = report.managerComment ?? ''
  reviewDialogVisible.value = true
}

async function submitReview() {
  if (!reviewTarget.value) {
    return
  }

  const payload: ReviewWeeklyReportRequest = {
    status: reviewForm.status,
    managerComment: reviewForm.managerComment || undefined,
  }

  await reviewReportMutation.mutateAsync({
    reportId: reviewTarget.value.id,
    payload,
  })
  ElMessage.success('周报评审已提交')
  reviewDialogVisible.value = false
}
</script>

<template>
  <PageSection title="周报管理" description="围绕成员周报的提交、修改和评审形成闭环。">
    <div class="page-toolbar">
      <div class="page-toolbar__filters">
        <el-input v-model="filters.weekNo" placeholder="周次，如 2026-W24" clearable style="max-width: 180px" />
        <el-select v-model="filters.memberId" placeholder="全部成员" clearable style="width: 180px">
          <el-option
            v-for="item in memberOptionsQuery.data.value?.records ?? []"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 160px">
          <el-option v-for="item in weeklyReportStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="pagination.pageNo = 1">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>
      <div class="page-toolbar__actions">
        <el-button type="primary" @click="openCreateDialog">新建周报</el-button>
      </div>
    </div>

    <el-table v-loading="reportsQuery.isLoading.value" :data="tableData">
      <el-table-column prop="memberName" label="成员" min-width="120" />
      <el-table-column prop="weekNo" label="周次" min-width="110" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <StatusTag :meta="getReportStatusMeta(row.status)" />
        </template>
      </el-table-column>
      <el-table-column label="本周总结" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="line-clamp-2">{{ row.summary }}</div>
        </template>
      </el-table-column>
      <el-table-column label="下周计划" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="line-clamp-2">{{ row.nextPlan }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="managerComment" label="评审意见" min-width="180" show-overflow-tooltip />
      <el-table-column label="更新时间" min-width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template #default="{ row }">
          <div class="table-ops">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button v-if="canReview" link @click="openReviewDialog(row)">评审</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :total="reportsQuery.data.value?.total ?? 0"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </PageSection>

  <el-dialog v-model="dialogVisible" :title="editingReport ? '编辑周报' : '新建周报'" width="760px" @closed="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="成员" prop="memberId">
            <el-select v-model="form.memberId" :disabled="Boolean(editingReport)" placeholder="请选择成员">
              <el-option
                v-for="item in memberOptionsQuery.data.value?.records ?? []"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="周次" prop="weekNo">
            <el-input v-model="form.weekNo" :disabled="Boolean(editingReport)" placeholder="例如 2026-W24" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="本周总结" prop="summary">
        <el-input v-model="form.summary" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="下周计划" prop="nextPlan">
        <el-input v-model="form.nextPlan" type="textarea" :rows="4" maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-space>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createReportMutation.isPending.value || updateReportMutation.isPending.value"
          @click="submitReport"
        >
          保存
        </el-button>
      </el-space>
    </template>
  </el-dialog>

  <el-dialog v-model="reviewDialogVisible" title="周报评审" width="520px">
    <el-form label-position="top">
      <el-form-item label="评审结果">
        <el-radio-group v-model="reviewForm.status">
          <el-radio-button label="REVIEWED">通过</el-radio-button>
          <el-radio-button label="RETURNED">退回</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="评审意见">
        <el-input v-model="reviewForm.managerComment" type="textarea" :rows="4" maxlength="300" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-space>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="reviewReportMutation.isPending.value" @click="submitReview">
          提交评审
        </el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.page-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-toolbar__filters,
.page-toolbar__actions,
.table-ops {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

@media (max-width: 768px) {
  .page-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
