<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  values: number[]
  waterLevels: number[]
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

// Color palette
const COLORS = {
  background: '#ffffff',
  gridLine: 'rgba(99, 102, 241, 0.04)',
  gridLineMajor: 'rgba(99, 102, 241, 0.09)',
  blockTop: '#cbd5e1',
  blockFace: '#94a3b8',
  blockBorder: '#64748b',
  blockHighlight: 'rgba(255, 255, 255, 0.25)',
  waterTop: 'rgba(37, 99, 235, 0.5)',
  waterFace: 'rgba(37, 99, 235, 0.3)',
  waterHighlight: 'rgba(255, 255, 255, 0.3)',
  labelText: '#475569',
  indexText: '#334155',
}

const draw = () => {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const vals = props.values
  const water = props.waterLevels
  const n = vals.length

  if (n === 0) {
    // Clear canvas
    const dpr = window.devicePixelRatio || 1
    canvas.width = container.clientWidth * dpr
    canvas.height = 200 * dpr
    canvas.style.width = `${container.clientWidth}px`
    canvas.style.height = '200px'
    ctx.scale(dpr, dpr)
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, container.clientWidth, 200)

    // Empty state message
    ctx.fillStyle = '#64748b'
    ctx.font = '14px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Nhập dãy số để hiển thị biểu đồ', container.clientWidth / 2, 105)
    return
  }

  const maxVal = Math.max(...vals.map((v, i) => v + water[i]), ...vals, 1)

  // Dimensions
  const dpr = window.devicePixelRatio || 1
  const containerWidth = container.clientWidth
  const padding = { top: 30, right: 30, bottom: 50, left: 50 }
  const drawWidth = containerWidth - padding.left - padding.right
  const drawHeight = Math.min(400, Math.max(200, maxVal * 45))
  const totalHeight = drawHeight + padding.top + padding.bottom

  canvas.width = containerWidth * dpr
  canvas.height = totalHeight * dpr
  canvas.style.width = `${containerWidth}px`
  canvas.style.height = `${totalHeight}px`
  ctx.scale(dpr, dpr)

  // Clear
  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, containerWidth, totalHeight)

  const cellW = drawWidth / n
  const cellH = drawHeight / maxVal

  // Draw grid
  ctx.lineWidth = 1
  for (let i = 0; i <= maxVal; i++) {
    const y = padding.top + drawHeight - i * cellH
    ctx.strokeStyle = i % 2 === 0 ? COLORS.gridLineMajor : COLORS.gridLine
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(containerWidth - padding.right, y)
    ctx.stroke()

    // Y-axis labels
    if (i % 2 === 0 || maxVal <= 6) {
      ctx.fillStyle = COLORS.labelText
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(String(i), padding.left - 10, y + 4)
    }
  }

  // Draw blocks and water
  for (let col = 0; col < n; col++) {
    const x = padding.left + col * cellW
    const blockH = vals[col]
    const waterH = water[col]

    // Draw wall blocks (each as individual unit square)
    for (let row = 0; row < blockH; row++) {
      const bx = x + 2
      const by = padding.top + drawHeight - (row + 1) * cellH
      const bw = cellW - 4
      const bh = cellH

      // Block gradient fill
      const grad = ctx.createLinearGradient(bx, by, bx, by + bh)
      grad.addColorStop(0, '#64748b')
      grad.addColorStop(0.3, '#475569')
      grad.addColorStop(1, '#334155')
      ctx.fillStyle = grad
      roundRect(ctx, bx, by, bw, bh, 2)
      ctx.fill()

      // Block border
      ctx.strokeStyle = COLORS.blockBorder
      ctx.lineWidth = 1
      roundRect(ctx, bx, by, bw, bh, 2)
      ctx.stroke()

      // Top highlight
      ctx.fillStyle = COLORS.blockHighlight
      ctx.fillRect(bx + 1, by + 1, bw - 2, 2)
    }

    // Draw water blocks
    for (let row = 0; row < waterH; row++) {
      const wx = x + 2
      const wy = padding.top + drawHeight - (blockH + row + 1) * cellH
      const ww = cellW - 4
      const wh = cellH

      // Water fill with gradient
      const wGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh)
      wGrad.addColorStop(0, 'rgba(96, 165, 250, 0.35)')
      wGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.25)')
      wGrad.addColorStop(1, 'rgba(37, 99, 235, 0.3)')
      ctx.fillStyle = wGrad
      roundRect(ctx, wx, wy, ww, wh, 2)
      ctx.fill()

      // Water border
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)'
      ctx.lineWidth = 1
      roundRect(ctx, wx, wy, ww, wh, 2)
      ctx.stroke()

      // Water shine highlight
      ctx.fillStyle = COLORS.waterHighlight
      ctx.fillRect(wx + 1, wy + 1, ww - 2, 2)
    }

    // Column index label
    ctx.fillStyle = COLORS.indexText
    ctx.font = '12px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(String(vals[col]), x + cellW / 2, padding.top + drawHeight + 20)

    // Column position
    ctx.fillStyle = COLORS.labelText
    ctx.font = '10px Inter, sans-serif'
    ctx.fillText(String(col), x + cellW / 2, padding.top + drawHeight + 38)
  }
}

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// Responsive resize
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  draw()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      draw()
    })
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

watch(() => [props.values, props.waterLevels], draw, { deep: true })
</script>

<template>
  <div ref="containerRef" class="canvas-container">
    <canvas ref="canvasRef" class="w-full rounded-xl"></canvas>
    <!-- Legend -->
    <div v-if="values.length > 0" class="flex items-center gap-6 mt-4 px-2">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-400"></div>
        <span class="text-xs text-slate-500 font-medium">Khối tường</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-gradient-to-b from-blue-400/40 to-blue-600/30 border border-blue-500/20"></div>
        <span class="text-xs text-slate-500 font-medium">Nước</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.canvas-container {
  border-radius: 0.75rem;
  overflow: hidden;

  canvas {
    display: block;
    border-radius: 0.75rem;
  }
}
</style>
