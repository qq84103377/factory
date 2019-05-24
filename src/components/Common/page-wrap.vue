<template>
	<div class="page_wrap">
		<slot></slot>
	</div>
</template>

<script>
	export default {}
</script>

<style lang="scss" scoped>
.page_wrap {
	padding: 32px;
	min-height: 716px;
	background: #fff;
	border-radius: 2px;
	box-shadow: 0 20px 20px -20px rgba(13, 51, 128, 0.12);
}
</style>