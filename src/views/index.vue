<template>
  <h3>一些demo</h3>
  <ul>
    <li><RouterLink to="/virtualList">点击查看虚拟列表</RouterLink></li>
    <li><RouterLink to="/canvasCompress">点击查看canvas压缩</RouterLink></li>
  </ul>
  <RouterView />
</template>

<script setup>
import { ref, reactive } from "vue";
</script>

<style lang="less" scoped></style>
