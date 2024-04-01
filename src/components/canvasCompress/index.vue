<script>
export default {
  name: "canvasCompress",
};
</script>
<script setup>
import { ref, reactive, onMounted } from "vue";
/**
 * 接受的传入的图片的类型
 */
const IMGE_TYPE = {
  "image/jpeg": "image/jpeg",
  "image/png": "image/png",
  "image/jpg": "image/jpg",
};
let imgFile = null;
let originImage = null;
let compressImage = null;
let imgFileObj = null;
//图片的质量
let quality = 90;
/**
 * FileReader 是一个在 JavaScript 中可以用来读取文件内容的 API，
 * 它允许您读取 Blob 或 File 对象中的数据，
 * 并将其转换为其他格式，比如文本、二进制数据或数据 URL。
 */
const reader = new FileReader();

const init = () => {
  bindEvent();
};
function bindEvent() {
  imgFile.addEventListener("change", handeleImgFileChange, false);
}
function handeleImgFileChange(e) {
  imgFileObj = e.target.files[0];
  // size 123824 type image/jpg
  // console.log(`output->imgFileObj`, imgFileObj);

  //文件格式判断
  if (!imgFileObj || !IMGE_TYPE[imgFileObj.type]) {
    alert("请上传图片格式的文件");
    // 文件格式错误，将上传文件赋值为空
    imgFile.value = "";
    imgFileObj = null;
    // 设置图片是否预览
    setImageVisible(originImage, false);
    setImageVisible(compressImage, false);
    return;
  }
  // 对图片进行预览，原始图片和压缩后的图片
  if (imgFileObj instanceof File) {
    // 这是一个异步事件 图片读取完才会执行
    console.log("原始图片大小为", imgFileObj.size);
    reader.onload = async () => {
      // 原始图片base64
      const originImageSrc = reader.result;
      // 这里是压缩图片
      const compressImageObj = await handleCompressImage({
        imgBase64: originImageSrc,
        type: imgFileObj.type,
        file: imgFileObj,
      });
      // console.log(`output->originImageSrc`, originImageSrc);

      originImage.src = originImageSrc;
      compressImage.src = compressImageObj.afterSrc;
      setImageVisible(originImage, true);
      setImageVisible(compressImage, true);
      console.log("压缩结果", compressImageObj);
    };

    // 获取图片的base64格式  参数为File
    reader.readAsDataURL(imgFileObj);
  }
}
/**
 * 将图片展示区域设置为可见
 */
function setImageVisible(node, visible) {
  switch (visible) {
    case true:
      node.classList.remove("hide");
      node.classList.add("show");
      break;
    case false:
      node.classList.remove("show");
      node.classList.add("hide");
      break;
    default:
      break;
  }
}
/**
 * 将原始图片压缩(可以限制触发压缩的图片最大宽度)
 * 参数：原始图片的base64,压缩的质量，输出的压缩后的图片的格式
 */
function handleCompressImage({ imgBase64, type, file }) {
  /**
   * 压缩图片的几个流程
   * 1、canvas画布
   * 2、需要一个图片对象
   * 3、把需要压缩的图片的base64交给这个图片对象
   * 4、再把这个图片对象画到canvas上面
   * 5、画完之后，拿到canvas画布上的图片，然后对其进行压缩
   *
   */
  console.log(parseInt((file.size / 1024).toFixed(2)));
  if (parseInt((file.size / 1024).toFixed(2)) < 1024) {
    quality = 0.85;
  }
  if (5 * 1024 < parseInt((file.size / 1024).toFixed(2))) {
    quality = 0.92;
  }
  if (quality) {
    quality = quality;
  }
  return new Promise((resolve) => {
    console.log("开始压缩");
    let myCanvas = document.createElement("canvas");
    let Img = document.createElement("img");
    let ctx = myCanvas.getContext("2d");

    Img.src = imgBase64;

    Img.onload = () => {
      //获取img对象的宽高
      const imgHeight = Img.height;
      const imgWidth = Img.width;

      //给画布设置宽高
      myCanvas.width = imgWidth;
      myCanvas.height = imgHeight;

      // 把图片画到canvas上面
      ctx.clearRect(0, 0, imgWidth, imgHeight);
      ctx.drawImage(Img, 0, 0, imgWidth, imgHeight);

      // 获取canvas图片进行压缩
      let res = myCanvas.toDataURL(type, quality / 100); //这里返回的是dataURL
      let arr = res.split(",");
      // let mine = arr[0].match(/:(.\*?);/)[1];
      const buffer = atob(arr[1]); // Base64 编码的字符串解码为原始字符串
      let len = buffer.length;
      const bufferArr = new Uint8Array(len);
      while (len--) {
        bufferArr[len] = buffer.charCodeAt(len);
      }
      const minFile = new File([bufferArr], "压缩后的图片", { type: type });

      resolve({
        afterFile: minFile,
        beforeFile: file,
        beforeSrc: imgBase64,
        afterSrc: res,
        beforeKB: Number((file.size / 1024).toFixed(2)),
        afterKB: Number((minFile.size / 1024).toFixed(2)),
      });
    };
  });
}

onMounted(() => {
  imgFile = document.querySelector("#imgSelector");
  originImage = document.querySelector("#originImage");
  compressImage = document.querySelector("#compressImage");
  init();
});
</script>
<template>
  <p>
    <input type="file" id="imgSelector" value="请选择图片" />
  </p>
  <p>
    <img id="originImage" alt="" class="originImage hide" />
  </p>
  <p>
    <img id="compressImage" alt="" class="originImage hide" />
  </p>
</template>

<style lang="less" scoped>
.hide {
  display: none;
}
.show {
  display: initial;
}
.originImage {
  border: 1px solid black;
  width: auto;
  height: 200px;
}
</style>
