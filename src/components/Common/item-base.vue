<template>
	<span class="item_base">
		<slot></slot>
		<icon v-if="close" class="fr" style="cursor: pointer;padding: 12px 6px;" type="icon-label-del" w="8" h="8" @click="handleClick"></icon>
	</span>
</template>

<script>
	export default {
		props: {
			close: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleClick() {
				this.$emit('close');
			}
		}
	}
</script>

<style lang="scss" scoped>
.item_base {
	display: inline-block;
	padding: 0 6px;
	min-width: 82px;
	height: 32px;
	text-align: center;
	line-height: 32px;
	font-size: 14px;
	color: #3b3b3b;
	background-color: #f2f5fa;
	border-radius: 2px;
}
</style>