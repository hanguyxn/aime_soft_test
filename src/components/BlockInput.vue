<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits<{
  update: [values: number[]]
}>()

const inputValue = ref('')
const validationError = ref('')

const validate = (value: string): { valid: boolean; values: number[]; error: string } => {
  const trimmed = value.trim()
  if (!trimmed) {
    return { valid: true, values: [], error: '' }
  }

  // Only digits and commas allowed
  if (!/^[\d,]+$/.test(trimmed)) {
    return { valid: false, values: [], error: 'Chỉ được nhập số và dấu phẩy.' }
  }

  // Split and parse
  const parts = trimmed.split(',').filter((p) => p.length > 0)
  const values: number[] = []

  for (const part of parts) {
    const num = parseInt(part, 10)
    if (isNaN(num) || num < 0) {
      return { valid: false, values: [], error: 'Giá trị phải là số tự nhiên (≥ 0).' }
    }
    values.push(num)
  }

  return { valid: true, values, error: '' }
}

watch(inputValue, (newVal) => {
  const result = validate(newVal)
  validationError.value = result.error
  if (result.valid) {
    emit('update', result.values)
  }
})

// Preset examples
const loadPreset = (preset: string) => {
  inputValue.value = preset
}

const presets = [
  { label: '3,0,2,0,4', value: '3,0,2,0,4' },
  { label: '0,1,0,2,1,0,1,3,2,1,2,1', value: '0,1,0,2,1,0,1,3,2,1,2,1' },
  { label: '4,2,0,3,2,5', value: '4,2,0,3,2,5' },
]
</script>

<template>
  <div class="space-y-3">
    <!-- Input field -->
    <div class="input-wrapper">
      <div class="input-icon">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.532a2.25 2.25 0 011.59.659l4.418 4.418A2.25 2.25 0 0117.25 8.59v7.16A2.25 2.25 0 0115 18H5.25A2.25 2.25 0 013 15.75V4.25zm2.25-.75a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h9.5a.75.75 0 00.75-.75V8.75h-3.75A1.75 1.75 0 0110 7V3.5H5.25z" clip-rule="evenodd" />
        </svg>
      </div>
      <input
        v-model="inputValue"
        type="text"
        class="block-input"
        placeholder="Nhập dãy số, ví dụ: 3,0,2,0,4"
        autocomplete="off"
        spellcheck="false"
      />
    </div>

    <!-- Validation error -->
    <p v-if="validationError" class="text-sm text-red-600 flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
      {{ validationError }}
    </p>

    <!-- Presets -->
    <div class="flex items-center gap-2 flex-wrap">
      <span class="text-xs text-slate-500 font-medium">Ví dụ:</span>
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="preset-btn"
        @click="loadPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #64748b;
  pointer-events: none;
  z-index: 1;
}

.block-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(99, 102, 241, 0.15);
  background: rgba(255, 255, 255, 0.7);
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  transition: all 0.25s ease;

  &::placeholder {
    color: #475569;
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    background: rgba(255, 255, 255, 0.95);
  }
}

.preset-btn {
  padding: 0.25rem 0.625rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  background: rgba(99, 102, 241, 0.06);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    color: var(--color-accent-start);
    background: rgba(99, 102, 241, 0.08);
  }
}
</style>
