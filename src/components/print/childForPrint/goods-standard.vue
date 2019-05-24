<template>
	<div>
		<div id="goodsSParent">
			<div id="goods-standard">
				<div class="standard">颜色：
					<div class="goodsname" v-if="obj.colors" v-for="(item,index) in obj.colors">{{item.name}}<i v-if="index !==obj.colors.length - 1">/</i></div>
				</div>
				<div style="border-left:1px solid #000;" class="standard">尺码：
					<div class="goodsname" v-if="obj.sizes" v-for="(item,index) in obj.sizes">{{item.value}}<i v-if="index !==obj.sizes.length - 1">/</i></div>
				</div>
				<div style="border-left:1px solid #000;" class="standard">内长：
					<div class="goodsname" v-if="obj.lengths" v-for="(item,index) in obj.lengths">{{item.value}}<i v-if="index !==obj.lengths.length - 1">/</i></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				obj: {}
			}
		},
		props: ['data'],
		methods: {
			async goodsHtml() {
				await (this.obj = JSON.parse(this.data));
				let b = await document.querySelector("#goodsSParent");
				await this.$emit('goodsStandardHtml', b.innerHTML);
			},
		},
		watch: {
			data(val) {
				this.goodsHtml();
			}
		},
		created() {
			if(this.data.length > 0) {
				this.goodsHtml();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.goodsname {
		font-size: 14px;
	}
	
	#goods-standard {
		min-height: 36px;
		width: 100%;
		// background-color:pink;
		border: 1px solid #000;
		display: flex;
		justify-content: flex-start;
		.standard {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-left: 12px;
			width: 33.3%;
		}
	}
</style>