<template>
	<div class="page_title clearfix" :class="{'bg': bg}">
		<div class="page_title--head fl">
			<slot name="title">{{title}}</slot>
		</div>
		<div class="page_title--content fr">
			<slot></slot>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
			    type: String,
			    default: '标题'
			},
			bg: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
.page_title {
	padding-bottom: 8px;
	// height: 64px;
	// line-height: 64px;
	border-radius: 2px;
	&--head {
		font-size: 16px;
        line-height: 36px;
		color: #2c2c2c;
	}
}
</style>
