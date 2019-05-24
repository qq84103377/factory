<template>
  <div>
    <script :id=id type="text/plain"></script>
  </div>
</template>
<script>
  import '../../../static/UE/ueditor.config'
  import '../../../static/UE/ueditor.all'
  import '../../../static/UE/lang/zh-cn/zh-cn'
  export default {
    name: 'UE',
    data () {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      },
      id: {
        type: String
      },
      index:{
        type: Number
      },
      item:{
        type: Object
      }
    },
    mounted() {

      this.editor = UE.getEditor(this.id, this.config); // 初始化UE

      this.editor.addListener("contentChange", this.contentChange,);
        // console.log(this.editor,'editoreditoreditor');
        let _this = this;

        if(this.defaultMsg){
            this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        }
    },
      watch:{
        'defaultMsg':function (val) {
            // console.log(val);
            this.editor.setContent(val); // 确保UE加载完成后，放入内容。
        }
      },
    methods: {
      setDisabled() { // 禁用富文本方法
          this.editor.addListener("ready", () => {
              this.editor.setDisabled(); // 确保UE加载完成后，禁用富文本。
          });
      },
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
      setUEContent(string) { // 写入内容方法
        return this.editor.setContent(string)
      },
      getPlainTxt() {
        return this.editor.getPlainTxt()
      },
      getAllHtml(string) {
        return this.editor.getAllHtml(string);
      },
      render(el,dom) {
        return this.editor.render(el,dom);
      },
      contentChange() {
          // 不知道为什么要 this.item&& 先注释掉
          // this.item && this.$emit('htmlData',this.index,this.item);
          // this.$emit('htmlData',this.index,this.item);
      }
    },
    destroyed() {
      this.editor.destroy();
    }
  }
</script>
