<template>
	<span class="icon_button" :class="{'is-disabled': disabled}" @click="clickMth">
		<svg	
			v-if="type"
			class="icon"
			:class="type"
			width="14"
			height="14"
			aria-hidden="true">
			<use :xlink:href="'#' + type"></use>
		</svg>
		<slot></slot>
	</span>
</template>

<script>
	export default {
		props: {
			type: {
				type: String
			},
			disabled: Boolean
		},
		methods: {
			clickMth() {
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped> 
	.icon_button {
		svg {
			position: relative;
			top: 1px;
		}
		font-size: 14px;
		color: #808080;
		&:hover {
			color: #3b3b3b;
			cursor: pointer;
			text-decoration: underline;
		}
		&.is-disabled {
			pointer-events: none;
			cursor: not-allowed;
			color: #bfcbd9!important;
		}
	}
</style>