<template>
  <h3>虚拟列表定高实现</h3>
  <VirtualScroller />
</template>

<script setup>
import { ref, reactive } from "vue";
import VirtualScroller from "@/components/virtualList/staticVirtualScroller.vue";
</script>

<style lang="less" scoped>
h3 {
  text-align: center;
  line-height: 30px;
}
</style>
