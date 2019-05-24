<template>
<div>
    <div :style="{'width':width?width+'px':'',
                'height':height?height+'px':'',
                'zIndex':zIndex?zIndex:''
            }">
        <div class="dialog-title">
            <slot name="header">
                弹窗名称
            </slot>
        </div>
        <div class="dialog-body"></div>
        <div class="dialog-footer">
            <slot name="footer">
                弹窗底部
            </slot>
        </div>
    </div>
    <div class="mask"></div>
</div>
</template>
<script>
export default {
    props: {
        width: {
            default: 300
        },
        height: {
            default: 300
        },
        zIndex: {
            default: 100
        },
        
    }
};
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 300;
    background: rgba(0, 0, 0, 0.5);
}
</style>
