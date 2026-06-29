<script setup lang="ts">
import { ref } from 'vue'

import type { AnalysisResult } from '@/types'

type DropZoneState = 'idle' | 'drag-over' | 'processing' | 'done'

// Emits
const emit = defineEmits<{
  result: [data: AnalysisResult]
}>()

// State
const state = ref<DropZoneState>('idle')
const fileName = ref('')
const errorMessage = ref('')

// Drag handlers
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  state.value = 'drag-over'
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  // Only change state if leaving the drop zone itself
  const target = e.currentTarget as HTMLElement
  const related = e.relatedTarget as Node | null
  if (related && target.contains(related)) return
  state.value = 'idle'
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  state.value = 'idle'
  errorMessage.value = ''

  const files = e.dataTransfer?.files
  if (!files || files.length === 0) return

  processFile(files[0])
}

// Also support click-to-upload
const fileInput = ref<HTMLInputElement | null>(null)

const openFilePicker = () => {
  fileInput.value?.click()
}

const onFileSelected = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    processFile(input.files[0])
    // Reset input so the same file can be re-selected
    input.value = ''
  }
}

const processFile = (file: File) => {
  // Validate extension
  if (!file.name.endsWith('.txt')) {
    errorMessage.value = 'Chỉ chấp nhận file có đuôi .txt'
    emit('result', { totalUniqueWords: 0, top3: [], error: errorMessage.value })
    return
  }

  fileName.value = file.name
  state.value = 'processing'
  errorMessage.value = ''

  const reader = new FileReader()
  reader.onload = () => {
    const content = reader.result as string
    analyzeWithWorker(content)
  }
  reader.onerror = () => {
    state.value = 'idle'
    errorMessage.value = 'Không thể đọc file. Vui lòng thử lại.'
    emit('result', { totalUniqueWords: 0, top3: [], error: errorMessage.value })
  }
  reader.readAsText(file)
}

const analyzeWithWorker = (content: string) => {
  const worker = new Worker(
    new URL('../workers/text-analyzer.worker.ts', import.meta.url),
    { type: 'module' }
  )

  worker.onmessage = (event: MessageEvent<AnalysisResult>) => {
    state.value = 'done'
    emit('result', event.data)
    worker.terminate()
  }

  worker.onerror = () => {
    state.value = 'idle'
    errorMessage.value = 'Worker gặp lỗi. Vui lòng thử lại.'
    emit('result', { totalUniqueWords: 0, top3: [], error: errorMessage.value })
    worker.terminate()
  }

  worker.postMessage(content)
}
</script>

<template>
  <div
    :class="[
      'dropzone',
      state === 'drag-over' && 'dropzone--hover',
      state === 'processing' && 'dropzone--processing',
      state === 'done' && 'dropzone--done',
    ]"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="openFilePicker"
    role="button"
    tabindex="0"
    @keydown.enter="openFilePicker"
    @keydown.space.prevent="openFilePicker"
  >
    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="file"
      accept=".txt"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Animated background orbs -->
    <div class="dropzone-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center gap-4">
      <!-- Idle State -->
      <template v-if="state === 'idle' || state === 'drag-over'">
        <div class="dropzone-icon" :class="state === 'drag-over' && 'dropzone-icon--active'">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 30L24 20L34 30"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="arrow-path"
            />
            <path
              d="M24 20V42"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              class="arrow-line"
            />
            <path
              d="M40.56 34.56A10 10 0 0034 16H31.64A16 16 0 104 28.68"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="cloud-path"
            />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold text-slate-800 mb-1">
            {{ state === 'drag-over' ? 'Thả file tại đây!' : 'Kéo thả file .txt vào đây' }}
          </p>
          <p class="text-sm text-slate-500">hoặc click để chọn file</p>
        </div>
      </template>

      <!-- Processing State -->
      <template v-if="state === 'processing'">
        <div class="spinner"></div>
        <div class="text-center">
          <p class="text-lg font-semibold text-slate-800 mb-1">Đang phân tích...</p>
          <p class="text-sm text-slate-500">{{ fileName }}</p>
        </div>
      </template>

      <!-- Done State -->
      <template v-if="state === 'done'">
        <div class="done-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2.5" />
            <path d="M15 24L21 30L33 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="text-center">
          <p class="text-lg font-semibold text-emerald-600 mb-1">Phân tích hoàn tất!</p>
          <p class="text-sm text-slate-500">{{ fileName }} — Click để chọn file khác</p>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dropzone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  padding: 2rem;
  border: 2px dashed rgba(99, 102, 241, 0.25);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover,
  &:focus-visible {
    border-color: rgba(99, 102, 241, 0.45);
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.05);
  }

  &:focus-visible {
    outline: 2px solid #6366f1;
    outline-offset: 2px;
  }

  &--hover {
    border-color: rgba(99, 102, 241, 0.7) !important;
    background: rgba(99, 102, 241, 0.08) !important;
    box-shadow: 0 0 60px rgba(99, 102, 241, 0.15) !important;
    transform: scale(1.01);

    .dropzone-orbs .orb {
      opacity: 0.4;
      transform: scale(1.3);
    }
  }

  &--processing {
    border-color: rgba(99, 102, 241, 0.3);
    pointer-events: none;
  }

  &--done {
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(16, 185, 129, 0.04);

    &:hover {
      border-color: rgba(16, 185, 129, 0.5);
    }
  }
}

.dropzone-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.15;
    transition: all 0.5s ease;
  }

  .orb-1 {
    width: 200px;
    height: 200px;
    background: #6366f1;
    top: -50px;
    right: -50px;
  }

  .orb-2 {
    width: 150px;
    height: 150px;
    background: #a855f7;
    bottom: -40px;
    left: -30px;
  }
}

.dropzone-icon {
  color: #6366f1;
  transition: all 0.3s ease;

  &--active {
    color: #4f46e5;
    transform: translateY(-5px);

    .arrow-path,
    .arrow-line {
      animation: bounce-arrow 0.6s ease infinite alternate;
    }
  }
}

@keyframes bounce-arrow {
  from { transform: translateY(0); }
  to { transform: translateY(-4px); }
}

.done-icon {
  color: #10b981;
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  0% { opacity: 0; transform: scale(0.5); }
  70% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
