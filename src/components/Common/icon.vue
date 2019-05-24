<template>
    <svg 
    class="icon"
    :style="{'width': w + 'px', 'height': h + 'px'}"
    aria-hidden="true"
    @click="handleClick">
        <use :xlink:href="'#' + type"></use>
    </svg>
</template>

<script>
export default {
    props: {
        type: String,
        w: {
            type: String,
            default: '18'
        },
        h: {
            type: String,
            default: '18'
        }
    },
    methods: {
    		handleClick() {
    			this.$emit('click');
    		}
    }
}
</script>

<style scoped>
.icon {
	width: 18px;
    height: 18px;
	vertical-align: middle;
	overflow: hidden;
}
</style>
