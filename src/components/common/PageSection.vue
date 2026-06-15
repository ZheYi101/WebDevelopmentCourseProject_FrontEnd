<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <el-card shadow="never" class="page-section">
    <template #header>
      <div class="page-section__header">
        <div>
          <strong>{{ title }}</strong>
          <p v-if="description">{{ description }}</p>
        </div>
        <slot name="extra" />
      </div>
    </template>
    <slot />
  </el-card>
</template>

<style scoped lang="scss">
.page-section {
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  background: var(--theme-surface);
  box-shadow: var(--theme-shadow-soft);
}

.page-section__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.page-section__header strong {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
  color: var(--theme-foreground);
}

.page-section__header p {
  color: var(--theme-foreground-secondary);
  font-size: 14px;
}
</style>
