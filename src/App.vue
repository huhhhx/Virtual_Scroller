<script setup>
import { RouterLink, RouterView } from "vue-router";
import VirtualScroller from "./components/virtualList/staticVirtualScroller.vue";
</script>

<template>
  <RouterView />
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
