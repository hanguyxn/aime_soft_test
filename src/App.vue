<script setup lang="ts">
const navItems = [
  { path: '/bai1', label: 'Bài 1', icon: 'document' },
  { path: '/bai2', label: 'Bài 2', icon: 'water' },
  { path: '/bai3', label: 'Bài 3', icon: 'table' },
  { path: '/bai4', label: 'Bài 4', icon: 'database' },
] as const
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3 group">
            <div class="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="url(#logo-gradient)" />
                <path d="M8 20L14 8L20 20H8Z" fill="white" fill-opacity="0.9" />
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                    <stop stop-color="#6366f1" />
                    <stop offset="1" stop-color="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="text-lg font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
            Aimesoft <span class="text-indigo-500 font-normal">Test</span>
          </span>
          </router-link>

          <!-- Nav Links -->
          <div class="flex items-center gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              active-class="nav-link--active"
            >
              <!-- Document Icon -->
              <svg v-if="item.icon === 'document'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <!-- Water Icon -->
              <svg v-if="item.icon === 'water'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c-4.97 4.97-7 8.03-7 11a7 7 0 1014 0c0-2.97-2.03-6.03-7-11z" />
              </svg>
              <!-- Table Icon -->
              <svg v-if="item.icon === 'table'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <!-- Database Icon -->
              <svg v-if="item.icon === 'database'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
              </svg>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </div>
      </div>
      <!-- Bottom gradient line -->
      <div class="navbar-gradient-line"></div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="text-center py-6 text-sm text-slate-500 border-t border-slate-200/85">
      <p>Aimesoft Coding Test &mdash; Built with Vue 3 + TypeScript + Tailwind CSS</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
}

.navbar-gradient-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(99, 102, 241, 0.4) 30%,
    rgba(168, 85, 247, 0.4) 70%,
    transparent 100%
  );
}

.logo-icon {
  transition: transform 0.3s ease;

  .group:hover & {
    transform: rotate(-5deg) scale(1.05);
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.25s ease;
  position: relative;
  text-decoration: none;

  &:hover {
    color: #4f46e5;
    background: rgba(99, 102, 241, 0.05);
  }

  &--active {
    color: #4f46e5 !important;
    background: rgba(99, 102, 241, 0.09);

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: linear-gradient(90deg, #4f46e5, #8b5cf6);
      border-radius: 1px;
    }
  }
}

// Page Transition
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
