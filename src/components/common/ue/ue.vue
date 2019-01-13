<template>
    <div>
        <script :id=id type="text/plain"/>
    </div>
</template>
<script>
    export default {
        name: 'UE',
        data() {
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
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor(this.id, this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });

        },
        /*destroyed() {
            // 将editor进行销毁
            this.editor.destroy();
        },*/
        methods: {
            destroyed() {
                // 将editor进行销毁
                this.editor.destroy();
            },
            setUEContent(content) {
                const _this = this;
                _this.editor.setContent(content);
            },
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            },
            getUEContentTxt() { // 获取纯文本内容方法
                return this.editor.getContentTxt()
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    }
</script>
