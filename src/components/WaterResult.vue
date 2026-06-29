<script setup lang="ts">
defineProps<{
  totalWater: number
}>()
</script>

<template>
  <div class="water-result">
    <div class="flex items-center gap-4">
      <!-- Water icon -->
      <div class="water-icon-wrapper">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" class="water-svg">
          <path
            d="M16 3C10 9 6 14 6 19a10 10 0 0020 0c0-5-4-10-10-16z"
            fill="url(#water-drop-gradient)"
            stroke="rgba(96, 165, 250, 0.5)"
            stroke-width="1.5"
          />
          <defs>
            <linearGradient id="water-drop-gradient" x1="6" y1="3" x2="26" y2="29">
              <stop stop-color="#60a5fa" />
              <stop offset="1" stop-color="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Result text -->
      <div>
        <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Tổng lượng nước hứng được</p>
        <div class="flex items-baseline gap-2">
          <span class="water-number">{{ totalWater }}</span>
          <span class="water-unit">đơn vị vuông</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.water-result {
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.15);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 0 30px rgba(59, 130, 246, 0.06);
  }
}

.water-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  flex-shrink: 0;
}

.water-svg {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.water-number {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #60a5fa, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: countUp 0.5s ease-out;
}

@keyframes countUp {
  0% { opacity: 0; transform: scale(0.5); }
  60% { transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}

.water-unit {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}
</style>
