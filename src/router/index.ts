import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Bai1View from '@/views/Bai1View.vue'
import Bai2View from '@/views/Bai2View.vue'
import Bai3View from '@/views/Bai3View.vue'
import Bai4View from '@/views/Bai4View.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/bai1',
  },
  {
    path: '/bai1',
    name: 'bai1',
    component: Bai1View,
    meta: { title: 'Bài 1 — Phân Tích Văn Bản' },
  },
  {
    path: '/bai2',
    name: 'bai2',
    component: Bai2View,
    meta: { title: 'Bài 2 — Trapping Rain Water' },
  },
  {
    path: '/bai3',
    name: 'bai3',
    component: Bai3View,
    meta: { title: 'Bài 3 — Đặt Bàn Nhà Hàng' },
  },
  {
    path: '/bai4',
    name: 'bai4',
    component: Bai4View,
    meta: { title: 'Bài 4 — Cơ Sở Dữ Liệu Viễn Thông' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const title = (to.meta.title as string) || 'Aimesoft Coding Test'
  document.title = title
})

export default router
