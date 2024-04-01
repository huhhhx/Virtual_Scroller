<template>
  <div class="container">
    <div class="left">
      <h3>一些demo</h3>
      <ul>
        <li><RouterLink to="/virtualList">点击查看虚拟列表</RouterLink></li>
        <li>
          <RouterLink to="/canvasCompress">点击查看canvas压缩</RouterLink>
        </li>
      </ul>
    </div>
    <div class="right">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
</script>

<style lang="less" scoped>
.container {
  display: flex;
  padding: 30px;
}
.left {
  margin-right: 30px;
  ul {
    li {
      line-height: 30px;
    }
  }
}
.right {
  flex: auto;
}
</style>
