<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <el-card shadow="never" class="page-section">
    <template #header>
      <div class="page-section__header">
        <div>
          <strong>{{ title }}</strong>
          <p>{{ description }}</p>
        </div>
        <slot name="extra" />
      </div>
    </template>
    <slot />
  </el-card>
</template>
