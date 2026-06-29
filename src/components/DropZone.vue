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
          <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5C9.76317 2.5 7.83928 3.83526 6.97989 5.75007C6.89728 5.93416 6.83874 6.06452 6.79362 6.15941C6.77129 6.20638 6.75451 6.23984 6.74168 6.26371C6.73213 6.28147 6.72703 6.28965 6.72588 6.29149C6.72575 6.29171 6.72567 6.29184 6.72564 6.29188C6.65664 6.38826 6.62018 6.41763 6.59892 6.4314C6.57756 6.44522 6.53559 6.46657 6.41833 6.49017C6.38281 6.49732 6.30904 6.5 6 6.5C4.067 6.5 2.5 8.067 2.5 10C2.5 11.933 4.067 13.5 6 13.5H6.67157L7.67157 12.5H6C4.61929 12.5 3.5 11.3807 3.5 10C3.5 8.61929 4.61929 7.5 6 7.5L6.05357 7.50003C6.27958 7.50021 6.46738 7.50035 6.61565 7.47051C6.79642 7.43413 6.97421 7.37969 7.1423 7.27088C7.3104 7.16208 7.43286 7.02216 7.54007 6.87214C7.59798 6.79112 7.64966 6.68782 7.69674 6.58881C7.74715 6.48277 7.81019 6.34231 7.88955 6.1655L7.88958 6.16542L7.89222 6.15954C8.59624 4.59089 10.1713 3.5 12 3.5C13.8287 3.5 15.4038 4.59089 16.1078 6.15954L16.1105 6.16566C16.1898 6.3424 16.2529 6.4828 16.3033 6.58881C16.3503 6.68782 16.402 6.79112 16.4599 6.87214C16.5671 7.02216 16.6896 7.16208 16.8577 7.27088C17.0258 7.37969 17.2036 7.43413 17.3844 7.47051C17.5326 7.50035 17.7204 7.50021 17.9464 7.50003L18 7.5C19.3807 7.5 20.5 8.61929 20.5 10C20.5 11.3807 19.3807 12.5 18 12.5H16.3284L17.3284 13.5H18C19.933 13.5 21.5 11.933 21.5 10C21.5 8.067 19.933 6.5 18 6.5C17.691 6.5 17.6172 6.49732 17.5817 6.49017C17.4644 6.46657 17.4224 6.44522 17.4011 6.4314C17.3798 6.41763 17.3434 6.38826 17.2744 6.29188L17.2741 6.2915C17.273 6.28968 17.2679 6.2815 17.2583 6.26371C17.2455 6.23984 17.2287 6.20638 17.2064 6.15941C17.1613 6.06452 17.1027 5.93416 17.0201 5.75007C16.1607 3.83526 14.2368 2.5 12 2.5Z" fill="#222222"/>
            <path d="M12 12L11.6464 11.6464L12 11.2929L12.3536 11.6464L12 12ZM12.5 21C12.5 21.2761 12.2761 21.5 12 21.5C11.7239 21.5 11.5 21.2761 11.5 21L12.5 21ZM7.64645 15.6464L11.6464 11.6464L12.3536 12.3536L8.35355 16.3536L7.64645 15.6464ZM12.3536 11.6464L16.3536 15.6464L15.6464 16.3536L11.6464 12.3536L12.3536 11.6464ZM12.5 12L12.5 21L11.5 21L11.5 12L12.5 12Z" fill="#222222"/>
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
