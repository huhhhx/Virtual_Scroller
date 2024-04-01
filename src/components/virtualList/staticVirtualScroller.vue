<script>
export default {
  name: "StaticItemHeightVersion01",
};
</script>
<script setup>
import { ref, reactive, toRefs, computed, onMounted } from "vue";
const props = defineProps({
  // 所有数据列表
  listData: {
    type: Array,
    default: [],
  },
  // 每一项的高度
  itemHeight: {
    type: Number,
    default: 30,
  },
});
const { itemHeight } = toRefs(props);
/**
 * 柱子节点盖度：总数据量*每一项的高度
 *
 * 用于撑开滚动容器的高度
 */
const pillarDomHeight = computed(() => {
  return itemHeight.value * allData.value.length;
});
/**
 * 所有数据
 */
const allData = ref([]);
/**
 * 内容容器的y轴偏移量。当渲染区域第一个元素完全移到了可视区域之外时，需要重新计算startOffset，将第一个元素移动回可视区域
 */
const startOffset = ref(0);
const styleTranslate = computed(() => {
  return `transform:translate(0,${startOffset.value}px)`;
});
/**
 * 当前视口第一个数据在allData数组的索引位置，默认为0
 */
const start = ref(0);
/**
 * 当前视口最后一个数据在allData数组的索引位置
 */
const end = computed(() => {
  return start.value + pageItemCount.value;
});
/**
 * 当前是视口需要显示的数据
 */
const renderData = computed(() => {
  //注意避免最后一个元素下标超出实际的数组长度
  const realEnd = Math.min(end.value, allData.value.length);
  return allData.value.slice(start.value, realEnd);
});
/**
 * 滚动容器. 支持显示滚动条的容器。确定虚拟列表的可视区高度
 */
const scrollerContainerRef = ref();
const scrollerContainerRefHeight = computed(() => {
  return scrollerContainerRef.value
    ? scrollerContainerRef.value.offsetHeight
    : 0;
});
/**
 * 视口可显示的元素数量： 滚动容器高度/每一项的高度，然后对结果进行向上取整，然后再+1
 *
 * 为什么要进行向上取整？
 * 如：页面高度100px，单个元素30px，那么此时100/30等于3，还多了10px，那这10px实际应该显示第4个元素的一小部分，所以需要进行向上取整
 *
 * 为什么最后还要+1？
 * 如：页面高度100px，单个元素30px，根据向上取整的方式，我们已经将这个视口渲染出了4个元素，第4个元素只有10px在视口中，剩余20px在视口之外。
 * 如果此时我们拖动滚动条，拖动25px，此时第一个元素尚未完全移出视口，最后一个元素完全进入了视口，且还有5px空白。按照通常的想法，这里应该显示第5个元素的一小部分才对。
 * 因此，最后还需要+1
 */
const pageItemCount = computed(() => {
  return Math.ceil(scrollerContainerRefHeight.value / itemHeight.value) + 1;
});
/**
 * 模拟后端大数据获取
 */
function loadData() {
  return new Promise((resolve, reject) => {
    const tepList = [];
    for (let i = 0; i < 10000; i++) {
      tepList.push(`数据${i}`);
    }
    setTimeout(() => {
      resolve(tepList);
    }, 1000);
  });
}
onMounted(() => {
  // 不直接在mounted中异步转同步，而是在init方法进行异步转同步。避免界面因为数据加载慢，导致渲染阻塞
  init();
});
async function init() {
  allData.value = await loadData();
}
// 监听太频繁
function onScroll(event) {
  //触发滚动事件的元素
  const scrollDom = event.target;
  //   相等的
  //   console.log(`output->event`, event.target);
  //   console.log(`output->event.currentTarget`, event.currentTarget);
  if (!scrollDom) return;

  // 获取滚动的距离
  //   console.log(`output->event`, event);
  const { scrollTop, scrollHeight, clientHeight } = scrollDom;
  // 根据滚动的距离，计算此时视口顶部需要显示的第一个元素
  start.value = Math.floor(scrollTop / itemHeight.value);
  startOffset.value = start.value * itemHeight.value;

  // 计算有了缓冲之后的start位置，根据有了缓冲之后的start位置来计算startOffset
  // 多缓存一页

  appendData(scrollTop, scrollHeight, clientHeight);
}
const dataLoading = ref(false);
const hasMoreData = ref(true);
/***
 * 是否滚到了底部
 */
function isScrollEnd(scrollTop, scrollHeight, clientHeight) {
  // Math.abs(scrollHeight - clientHeight - scrollTop) < 1 : 判断滚动条是否滚动到了最底部。公式来自MDN
  // return Math.abs(scrollHeight - clientHeight - scrollTop) < 1
  /*
  上面公式可以判断完全滚动到了最底部，实际更人性化的方式是，接近底部的时候就开始加载数据，让用户在无感知的情况下就加载了后续数据，因此可以将1调整到一个适合你项目的值
   */
  return Math.abs(scrollHeight - clientHeight - scrollTop) < 1000;
}
async function appendData(scrollTop, scrollHeight, clientHeight) {
  if (
    !dataLoading.value &&
    hasMoreData.value &&
    isScrollEnd(scrollTop, scrollHeight, clientHeight)
  ) {
    dataLoading.value = true;
    try {
      const dataList = await loadData();
      if (dataList && dataList.length > 0) {
        allData.value.push(...dataList);
        hasMoreData.value = true;
      } else {
        /*
         * 这里判断下次滚动到底部是否还有数据可加载，是根据最后一次请求的请求结果是否有数据来判断的，实际不应该这么做，
         *因为这会导致多发一次请求。更好的方式应该是每个请求结果中都包含一个字段用于告知前端是否还能请求后端来获取更多数据。
         */
        hasMoreData.value = false;
      }
    } catch (err) {
      alert(err);
    }
  }
}
</script>

<template>
  <!-- 实际开发中虚拟列表通常是位于某个Dom容器下的，并占满这个dom容器的真个高度 -->
  <div class="container">
    <!-- scrollerContainer 为撑开滚动条的容器，定义为整个虚拟列表的高度 -->
    <div class="scrollerContaier" ref="scrollerContainerRef" @scroll="onScroll">
      <div class="pillarDom" :style="{ height: `${pillarDomHeight}px` }"></div>
      <div class="contentList" :style="styleTranslate">
        <div class="item" v-for="item in renderData" :key="item">
          {{ item }}
        </div>
        <div class="loadingDiv" v-if="dataLoading">数据加载中...</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  height: 350px;
  width: 100%;
  border: 1px solid black;
}
.scrollerContaier {
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}
.pillarDom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.containerList {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.item {
  height: calc(v-bind(itemHeight) * 1px);
  line-height: calc(v-bind(itemHeight) * 1px);
  border-bottom: 8px solid green;
  width: 100%;
  background-color: orange;
  &:last-child {
    border-bottom: none;
  }
}
.loadingDiv {
  text-align: center;
  color: red;
  font-weight: bold;
}
</style>
