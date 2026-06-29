<script setup lang="ts">
import { ref } from 'vue'
import DropZone from '@/components/DropZone.vue'
import ResultDisplay from '@/components/ResultDisplay.vue'
import type { AnalysisResult } from '@/types'

const result = ref<AnalysisResult | null>(null)

const handleResult = (data: AnalysisResult) => {
  result.value = data
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="animate-fade-in">
      <h1 class="section-title gradient-text mb-3">Bài 1: Phân Tích Văn Bản</h1>
      <p class="section-subtitle">
        Kéo thả file <code class="inline-code">.txt</code> để phân tích nội dung.
        Hệ thống sẽ đếm số từ duy nhất và tìm 3 từ xuất hiện nhiều nhất bằng Web Worker.
      </p>
    </header>

    <!-- Drop Zone -->
    <section class="animate-slide-up" style="animation-delay: 0.1s">
      <DropZone @result="handleResult" />
    </section>

    <!-- Results -->
    <section v-if="result" class="glass-card-static p-6 animate-slide-up" style="animation-delay: 0.2s">
      <ResultDisplay
        :total-unique-words="result.totalUniqueWords"
        :top3="result.top3"
        :error="result.error"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.inline-code {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  font-weight: 500;
  background: rgba(99, 102, 241, 0.12);
  color: var(--color-accent-start);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 0.375rem;
}
</style>
