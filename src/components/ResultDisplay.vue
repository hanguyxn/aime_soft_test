<script setup lang="ts">
import { computed } from 'vue'

interface TopWord {
  word: string
  count: number
}

const props = defineProps<{
  totalUniqueWords: number
  top3: TopWord[]
  error?: string
}>()

// Calculate relative bar widths based on max count
const maxCount = computed(() => {
  if (props.top3.length === 0) return 1
  return props.top3[0].count
})

const barWidth = (count: number): string => {
  return `${Math.max(8, (count / maxCount.value) * 100)}%`
}

const rankColors = [
  { bg: 'from-amber-500 to-yellow-400', badge: 'bg-amber-50 text-amber-700 border-amber-200/60', icon: '🥇' },
  { bg: 'from-slate-400 to-gray-300', badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: '🥈' },
  { bg: 'from-amber-700 to-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200/60', icon: '🥉' },
]
</script>

<template>
  <div class="animate-fade-in">
    <!-- Error State -->
    <div v-if="error" class="error-box">
      <div class="flex items-start gap-3">
        <div class="error-icon flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="font-semibold text-red-700 mb-0.5">Lỗi phân tích</p>
          <p class="text-red-600 text-sm">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Success State -->
    <div v-else class="space-y-6">
      <!-- Total Unique Words Card -->
      <div class="stats-card">
        <div class="flex items-center gap-3 mb-2">
          <div class="stats-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.214 3.227a.75.75 0 00-1.156-.956 8.97 8.97 0 00-1.856 3.826.75.75 0 001.466.316 7.47 7.47 0 011.546-3.186zM16.942 2.271a.75.75 0 00-1.157.956 7.47 7.47 0 011.547 3.186.75.75 0 001.466-.316 8.971 8.971 0 00-1.856-3.826z" />
              <path fill-rule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557 33.54 33.54 0 003.9 0A2 2 0 0110 16.5z" clip-rule="evenodd" />
            </svg>
          </div>
          <span class="text-sm font-medium text-slate-400 uppercase tracking-wider">Tổng từ duy nhất</span>
        </div>
        <div class="stats-number">
          {{ totalUniqueWords }}
        </div>
      </div>

      <!-- Top 3 Words -->
      <div>
        <h3 class="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" class="text-indigo-400">
            <path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
          </svg>
          Top 3 từ xuất hiện nhiều nhất
        </h3>
        <div class="space-y-3">
          <div
            v-for="(item, index) in top3"
            :key="item.word"
            class="word-row"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="flex items-center gap-3 mb-2">
              <!-- Rank Badge -->
              <span :class="['rank-badge', rankColors[index].badge]">
                {{ rankColors[index].icon }}
              </span>
              <!-- Word -->
              <span class="word-text font-mono font-semibold text-slate-800">{{ item.word }}</span>
              <!-- Count -->
              <span class="ml-auto text-sm font-mono font-bold text-slate-700">
                {{ item.count }}<span class="text-slate-400 font-normal ml-1">lần</span>
              </span>
            </div>
            <!-- Bar -->
            <div class="bar-track">
              <div
                :class="['bar-fill bg-gradient-to-r', rankColors[index].bg]"
                :style="{ width: barWidth(item.count) }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-box {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

.error-icon {
  color: #f87171;
  margin-top: 2px;
}

.stats-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
}

.stats-icon {
  color: #818cf8;
}

.stats-number {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  animation: countUp 0.6s ease-out;
}

@keyframes countUp {
  0% { opacity: 0; transform: scale(0.5); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

.word-row {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(99, 102, 241, 0.08);
  transition: all 0.25s ease;
  animation: slideUp 0.4s ease-out both;

  &:hover {
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(99, 102, 241, 0.2);
    transform: translateX(4px);
  }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  border: 1px solid;
  flex-shrink: 0;
}

.word-text {
  font-size: 1.05rem;
}

.bar-track {
  height: 6px;
  border-radius: 3px;
  background: rgba(226, 232, 240, 0.7);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: growBar 0.8s ease-out both;
}

@keyframes growBar {
  0% { width: 0 !important; }
}
</style>
