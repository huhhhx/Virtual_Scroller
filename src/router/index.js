import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/index.vue"),
      children: [
        {
          path: "virtualList",
          component: () => import("@/views/VirtualList/index.vue"),
        },
        {
          path: "canvasCompress",
          component: () => import("@/views/canvasCompress/index.vue"),
        },
      ],
    },
  ],
});

export default router;
