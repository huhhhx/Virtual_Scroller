### 虚拟列表实现

#### 作用

优化某个组件有大量数据的时候，渲染非常多的dom节点，造成页面卡顿崩溃

#### 原理

使用js计算，只渲染视口内的dom节点

#### 实现方案

- 通过监听滚动事件，仅实时渲染当前视口中应该展示的数据
- 通过CSS的translateY属性修正当实际渲染数据发生变化的时候，渲染区域与可视区域偏移的问题(使用了绝对定位)
- 加入缓冲数据，缓解白屏问题(多加载几页)
- 判断是否一键滑到底部

#### 一些技术

- js获取容器、视口的高度：```Dom.offsetHeight```

- 通过```arr.slice(start,end)```截取，需要随着滚动条滚动动态展示数据
- 通过CSS的translateY属性修正渲染区域与可视区域偏移的问题
- 通过js获取scrollTop,滚动条滚动的高度

---



### 使用canvas进行图片压缩

#### 原理

- input 读取到 文件 ，使用 FileReader 将其转换为 base64 编码

- 新建 img ，使其 src 指向刚刚的 base64

- 新建 canvas ，将 img 画到 canvas 上

- 利用 canvas.toDataURL/toBlob 将 canvas 导出为 base64 或 Blob

- 将 base64 或 Blob 转化为 File

- canvas.toDataURL时涉及到图片质量设置，一般为0.92

  ref:

  https://juejin.cn/post/6940430496128040967

  https://juejin.cn/post/6844904082046451719

  https://juejin.cn/post/7263123522283651133#heading-0

---

