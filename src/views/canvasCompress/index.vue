<template>
  <h3>use canvas to compress image</h3>
  <canvasCompress />
</template>

<script setup>
import { ref, reactive } from "vue";
import canvasCompress from "@/components/canvasCompress/index.vue";
</script>

<style lang="less" scoped>
h3 {
  text-align: center;
  line-height: 30px;
}
</style>
