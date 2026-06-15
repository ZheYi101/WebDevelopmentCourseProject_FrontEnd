<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

import PageSection from '@/components/common/PageSection.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useProjectOptionsQuery, useUserOptionsQuery } from '@/composables/use-reference-data'
import {
  useCreateTaskMutation,
  useCreateTaskProgressMutation,
  useTaskProgressQuery,
  useTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from '@/composables/use-task-management'
import { priorityMetaMap, priorityOptions, taskStatusMetaMap, taskStatusOptions } from '@/constants/options'
import type {
  CreateTaskRequest,
  PriorityLevel,
  Task,
  TaskStatus,
  UpdateTaskRequest,
} from '@/types/api'
import { formatDate, formatPercent } from '@/utils/format'

const filters = reactive({
  weekNo: '',
  projectId: undefined as number | undefined,
  assigneeId: undefined as number | undefined,
  status: undefined as TaskStatus | undefined,
  priority: undefined as PriorityLevel | undefined,
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
})

const queryParams = computed(() => ({
  weekNo: filters.weekNo || undefined,
  projectId: filters.projectId,
  assigneeId: filters.assigneeId,
  status: filters.status,
  priority: filters.priority,
  pageNo: pagination.pageNo,
  pageSize: pagination.pageSize,
}))

const tasksQuery = useTasksQuery(queryParams)
const projectOptionsQuery = useProjectOptionsQuery()
const userOptionsQuery = useUserOptionsQuery()
const createTaskMutation = useCreateTaskMutation()
const updateTaskMutation = useUpdateTaskMutation()
const updateTaskStatusMutation = useUpdateTaskStatusMutation()
const createTaskProgressMutation = useCreateTaskProgressMutation()

const dialogVisible = ref(false)
const editingTask = ref<Task | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  title: '',
  projectId: undefined as number | undefined,
  assigneeId: undefined as number | undefined,
  priority: 'MEDIUM' as PriorityLevel,
  weekNo: '',
  deadline: '',
  planStartDate: '',
  planEndDate: '',
  issueDesc: '',
})

const rules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  assigneeId: [{ required: true, message: '请选择责任人', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  weekNo: [{ required: true, message: '请输入周次标识', trigger: 'blur' }],
}

const statusDialogVisible = ref(false)
const statusTarget = ref<Task | null>(null)
const statusForm = reactive({
  status: 'TODO' as TaskStatus,
  progressRate: 0,
  issueDesc: '',
})

const progressDrawerVisible = ref(false)
const progressTask = ref<Task | null>(null)
const progressFormRef = ref<FormInstance>()
const progressForm = reactive({
  progressRate: 0,
  issueDesc: '',
  comment: '',
})

const progressRules = {
  progressRate: [{ required: true, message: '请填写进度百分比', trigger: 'change' }],
  comment: [{ required: true, message: '请填写进度说明', trigger: 'blur' }],
}

const progressQuery = useTaskProgressQuery(computed(() => progressTask.value?.id ?? null))

const tableData = computed(() => tasksQuery.data.value?.records ?? [])

function getTaskStatusMeta(status: TaskStatus) {
  return taskStatusMetaMap[status]
}

function getPriorityStatusMeta(priority: PriorityLevel) {
  return priorityMetaMap[priority]
}

function resetFilters() {
  filters.weekNo = ''
  filters.projectId = undefined
  filters.assigneeId = undefined
  filters.status = undefined
  filters.priority = undefined
  pagination.pageNo = 1
}

function resetForm() {
  form.title = ''
  form.projectId = undefined
  form.assigneeId = undefined
  form.priority = 'MEDIUM'
  form.weekNo = ''
  form.deadline = ''
  form.planStartDate = ''
  form.planEndDate = ''
  form.issueDesc = ''
  formRef.value?.clearValidate()
}

function openCreateDialog() {
  editingTask.value = null
  resetForm()
  dialogVisible.value = true
}

function openEditDialog(task: Task) {
  editingTask.value = task
  form.title = task.title
  form.projectId = task.projectId ?? undefined
  form.assigneeId = task.assigneeId
  form.priority = task.priority
  form.weekNo = task.weekNo ?? ''
  form.deadline = task.deadline ?? ''
  form.planStartDate = task.planStartDate ?? ''
  form.planEndDate = task.planEndDate ?? ''
  form.issueDesc = task.issueDesc ?? ''
  dialogVisible.value = true
}

async function submitTask() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) {
    return
  }

  if (editingTask.value) {
    const payload: UpdateTaskRequest = {
      title: form.title,
      projectId: form.projectId,
      assigneeId: form.assigneeId as number,
      priority: form.priority,
      deadline: form.deadline || undefined,
      planStartDate: form.planStartDate || undefined,
      planEndDate: form.planEndDate || undefined,
      issueDesc: form.issueDesc || undefined,
    }

    await updateTaskMutation.mutateAsync({
      taskId: editingTask.value.id,
      payload,
    })
    ElMessage.success('任务已更新')
  } else {
    const payload: CreateTaskRequest = {
      title: form.title,
      projectId: form.projectId,
      assigneeId: form.assigneeId as number,
      priority: form.priority,
      weekNo: form.weekNo,
      deadline: form.deadline || undefined,
      planStartDate: form.planStartDate || undefined,
      planEndDate: form.planEndDate || undefined,
      issueDesc: form.issueDesc || undefined,
    }

    await createTaskMutation.mutateAsync(payload)
    ElMessage.success('任务已创建')
  }

  dialogVisible.value = false
  resetForm()
}

function openStatusDialog(task: Task) {
  statusTarget.value = task
  statusForm.status = task.status
  statusForm.progressRate = task.progressRate ?? 0
  statusForm.issueDesc = task.issueDesc ?? ''
  statusDialogVisible.value = true
}

async function submitStatus() {
  if (!statusTarget.value) {
    return
  }

  await updateTaskStatusMutation.mutateAsync({
    taskId: statusTarget.value.id,
    payload: {
      status: statusForm.status,
      progressRate: statusForm.progressRate,
      issueDesc: statusForm.issueDesc || undefined,
    },
  })
  ElMessage.success('任务状态已更新')
  statusDialogVisible.value = false
}

function openProgressDrawer(task: Task) {
  progressTask.value = task
  progressForm.progressRate = task.progressRate ?? 0
  progressForm.issueDesc = task.issueDesc ?? ''
  progressForm.comment = ''
  progressDrawerVisible.value = true
}

async function submitProgress() {
  const valid = await progressFormRef.value?.validate().catch(() => false)
  if (!valid || !progressTask.value) {
    return
  }

  await createTaskProgressMutation.mutateAsync({
    taskId: progressTask.value.id,
    payload: {
      progressRate: progressForm.progressRate,
      issueDesc: progressForm.issueDesc || undefined,
      comment: progressForm.comment,
    },
  })

  ElMessage.success('进度记录已新增')
  progressForm.comment = ''
}
</script>

<template>
  <PageSection title="任务管理" description="围绕周任务、责任人、状态流转和进度记录形成闭环。">
    <div class="page-toolbar">
      <div class="page-toolbar__filters">
        <el-input v-model="filters.weekNo" placeholder="周次，如 2026-W24" clearable style="max-width: 180px" />
        <el-select v-model="filters.projectId" placeholder="全部项目" clearable style="width: 180px">
          <el-option
            v-for="item in projectOptionsQuery.data.value?.records ?? []"
            :key="item.id"
            :label="item.projectName"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="filters.assigneeId" placeholder="全部责任人" clearable style="width: 180px">
          <el-option
            v-for="item in userOptionsQuery.data.value?.records ?? []"
            :key="item.id"
            :label="item.realName"
            :value="item.id"
          />
        </el-select>
        <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 160px">
          <el-option v-for="item in taskStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="filters.priority" placeholder="全部优先级" clearable style="width: 160px">
          <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="pagination.pageNo = 1">查询</el-button>
        <el-button @click="resetFilters">重置</el-button>
      </div>

      <div class="page-toolbar__actions">
        <el-button type="primary" @click="openCreateDialog">新建任务</el-button>
      </div>
    </div>

    <el-table v-loading="tasksQuery.isLoading.value" :data="tableData">
      <el-table-column prop="title" label="任务标题" min-width="220" />
      <el-table-column prop="projectName" label="所属项目" min-width="160" />
      <el-table-column prop="assigneeName" label="责任人" min-width="120" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <StatusTag :meta="getTaskStatusMeta(row.status)" />
        </template>
      </el-table-column>
      <el-table-column label="优先级" width="110">
        <template #default="{ row }">
          <StatusTag :meta="getPriorityStatusMeta(row.priority)" />
        </template>
      </el-table-column>
      <el-table-column prop="weekNo" label="周次" min-width="110" />
      <el-table-column label="进度" width="110">
        <template #default="{ row }">
          {{ formatPercent(row.progressRate) }}
        </template>
      </el-table-column>
      <el-table-column label="截止日期" min-width="120">
        <template #default="{ row }">
          {{ formatDate(row.deadline) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="220" fixed="right">
        <template #default="{ row }">
          <div class="table-ops">
            <el-button link type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button link @click="openStatusDialog(row)">更新状态</el-button>
            <el-button link @click="openProgressDrawer(row)">进度记录</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-bar">
      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :total="tasksQuery.data.value?.total ?? 0"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
      />
    </div>
  </PageSection>

  <el-dialog v-model="dialogVisible" :title="editingTask ? '编辑任务' : '新建任务'" width="820px" @closed="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="任务标题" prop="title">
            <el-input v-model="form.title" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人" prop="assigneeId">
            <el-select v-model="form.assigneeId" placeholder="请选择责任人">
              <el-option
                v-for="item in userOptionsQuery.data.value?.records ?? []"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="所属项目">
            <el-select v-model="form.projectId" clearable placeholder="可选">
              <el-option
                v-for="item in projectOptionsQuery.data.value?.records ?? []"
                :key="item.id"
                :label="item.projectName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优先级" prop="priority">
            <el-select v-model="form.priority">
              <el-option v-for="item in priorityOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="周次" prop="weekNo">
            <el-input v-model="form.weekNo" :disabled="Boolean(editingTask)" placeholder="例如 2026-W24" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="8">
          <el-form-item label="计划开始">
            <el-date-picker v-model="form.planStartDate" type="date" value-format="YYYY-MM-DD" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束">
            <el-date-picker v-model="form.planEndDate" type="date" value-format="YYYY-MM-DD" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="截止日期">
            <el-date-picker v-model="form.deadline" type="date" value-format="YYYY-MM-DD" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="问题与备注">
        <el-input v-model="form.issueDesc" type="textarea" :rows="4" maxlength="300" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-space>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createTaskMutation.isPending.value || updateTaskMutation.isPending.value"
          @click="submitTask"
        >
          保存
        </el-button>
      </el-space>
    </template>
  </el-dialog>

  <el-dialog v-model="statusDialogVisible" title="更新任务状态" width="460px">
    <el-form label-position="top">
      <el-form-item label="任务状态">
        <el-select v-model="statusForm.status">
          <el-option v-for="item in taskStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="进度百分比">
        <el-input-number v-model="statusForm.progressRate" :min="0" :max="100" class="w-full" />
      </el-form-item>
      <el-form-item label="问题说明">
        <el-input v-model="statusForm.issueDesc" type="textarea" :rows="3" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-space>
        <el-button @click="statusDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="updateTaskStatusMutation.isPending.value" @click="submitStatus">
          保存
        </el-button>
      </el-space>
    </template>
  </el-dialog>

  <el-drawer v-model="progressDrawerVisible" title="任务进度记录" size="520px">
    <div class="mb-16 text-muted">当前任务：{{ progressTask?.title ?? '-' }}</div>

    <el-form ref="progressFormRef" :model="progressForm" :rules="progressRules" label-position="top" class="mb-16">
      <el-form-item label="进度百分比" prop="progressRate">
        <el-input-number v-model="progressForm.progressRate" :min="0" :max="100" class="w-full" />
      </el-form-item>
      <el-form-item label="问题说明">
        <el-input v-model="progressForm.issueDesc" type="textarea" :rows="3" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="进度备注" prop="comment">
        <el-input v-model="progressForm.comment" type="textarea" :rows="3" maxlength="300" show-word-limit />
      </el-form-item>
      <el-button type="primary" :loading="createTaskProgressMutation.isPending.value" @click="submitProgress">
        新增进度记录
      </el-button>
    </el-form>

    <el-timeline>
      <el-timeline-item
        v-for="item in progressQuery.data.value ?? []"
        :key="item.id"
        :timestamp="formatDate(item.updateTime)"
        placement="top"
      >
        <el-card shadow="never">
          <p>进度：{{ formatPercent(item.progressRate) }}</p>
          <p class="text-muted">备注：{{ item.comment || '-' }}</p>
          <p class="text-muted">问题：{{ item.issueDesc || '-' }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-drawer>
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

.text-muted {
  color: var(--theme-foreground-secondary);
}

@media (max-width: 768px) {
  .page-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
