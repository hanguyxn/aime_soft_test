<script setup lang="ts">
import { ref, computed } from 'vue'
import BlockInput from '@/components/BlockInput.vue'
import BlockCanvas from '@/components/BlockCanvas.vue'
import WaterResult from '@/components/WaterResult.vue'

const heights = ref<number[]>([])

const onInputUpdate = (values: number[]) => {
  heights.value = values
}

/**
 * Trapping Rain Water algorithm using prefix max arrays.
 * Time: O(n), Space: O(n)
 */
const calculateWater = (h: number[]): { totalWater: number; waterLevels: number[] } => {
  const n = h.length
  if (n <= 2) return { totalWater: 0, waterLevels: new Array(n).fill(0) }

  const leftMax = new Array<number>(n)
  const rightMax = new Array<number>(n)

  leftMax[0] = h[0]
  for (let i = 1; i < n; i++) {
    leftMax[i] = Math.max(leftMax[i - 1], h[i])
  }

  rightMax[n - 1] = h[n - 1]
  for (let i = n - 2; i >= 0; i--) {
    rightMax[i] = Math.max(rightMax[i + 1], h[i])
  }

  const waterLevels = new Array<number>(n)
  let totalWater = 0
  for (let i = 0; i < n; i++) {
    waterLevels[i] = Math.max(0, Math.min(leftMax[i], rightMax[i]) - h[i])
    totalWater += waterLevels[i]
  }

  return { totalWater, waterLevels }
}

const waterData = computed(() => calculateWater(heights.value))
const totalWater = computed(() => waterData.value.totalWater)
const waterLevels = computed(() => waterData.value.waterLevels)
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="animate-fade-in">
      <h1 class="section-title gradient-text-blue mb-3">Bài 2: Trapping Rain Water</h1>
      <p class="section-subtitle">
        Nhập dãy số biểu diễn chiều cao các khối tường.
        Hệ thống sẽ tính toán và hiển thị lượng nước có thể hứng được giữa các khối.
      </p>
    </header>

    <!-- Input Section -->
    <section class="glass-card-static p-6 animate-slide-up" style="animation-delay: 0.1s">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="text-indigo-400">
          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
        </svg>
        Nhập dữ liệu
      </h2>
      <BlockInput @update="onInputUpdate" />
    </section>

    <!-- Canvas Section -->
    <section class="glass-card-static p-6 animate-slide-up" style="animation-delay: 0.2s">
      <h2 class="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="text-indigo-400">
          <path fill-rule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM15 5.75a.75.75 0 00-1.5 0v8.5a.75.75 0 001.5 0v-8.5zm-8.5 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0v-2.5zM8.584 9a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5a.75.75 0 01.75-.75zm3.58-1.25a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clip-rule="evenodd" />
        </svg>
        Biểu đồ
      </h2>
      <BlockCanvas :values="heights" :water-levels="waterLevels" />
    </section>

    <!-- Water Result -->
    <section v-if="heights.length > 0" class="animate-slide-up" style="animation-delay: 0.3s">
      <WaterResult :total-water="totalWater" />
    </section>
  </div>
</template>
