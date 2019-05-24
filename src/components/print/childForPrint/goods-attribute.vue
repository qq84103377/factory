<template>
	<div>
		<div id="goodsAttributeParent">
			<div id="goodsAttribute">
				<div class="goods-standard">
					<div class="standard">品牌：
						<div class="goodsname" v-if="goods.brand" v-for="(item,index) in goods.brand">{{item.value}}<i v-if="index !==goods.brand.length - 1">/</i></div>
					</div>
					<div style="border-left:1px solid #000;" class="standard">设计师：
						<div class="goodsname" v-if="goods.designer" v-for="(item,index) in goods.designer">{{item.value}}<i v-if="index !==goods.designer.length - 1">/</i></div>
					</div>
					<div style="border-left:1px solid #000;" class="standard">分类：
						<div class="goodsname" v-if="goods.kind" v-for="(item,index) in goods.kind">{{item.value}}<i v-if="index !==goods.kind.length - 1">/</i></div>
					</div>
				</div>
				<div class="goods-standard" style="border-top:none;">
					<div class="standard">标签：
						<div class="goodsname" v-if="goods.tag" v-for="(item,index) in goods.tag">{{item.value}}<i v-if="index !==goods.tag.length - 1">/</i></div>
					</div>
					<div style="border-left:1px solid #000;" class="standard">年份：
						<div class="goodsname" v-if="goods.year" v-for="(item,index) in goods.year">{{item.value}}<i v-if="index !==goods.year.length - 1">/</i></div>
					</div>
					<div style="border-left:1px solid #000;" class="standard">季节：
						<div class="goodsname" v-if="goods.season" v-for="(item,index) in goods.season">{{item.value}}<i v-if="index !==goods.season.length - 1">/</i></div>
					</div>
				</div>
				<div class="goods-standard" style="border-top:none;">
					<div class="standard">波段：
						<div class="goodsname" v-if="goods.wave" v-for="(item,index) in goods.wave">{{item.value}}<i v-if="index !==goods.wave.length - 1">/</i></div>
					</div>
					<div style="border-left:1px solid #000;" class="standard"></div>
					<div style="border-left:1px solid #000;" class="standard"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				goods: {},
			}
		},
		props: ['data'],
		methods: {
			async goodsHtml() {
				await (this.goods = JSON.parse(this.data));
				let b = await document.querySelector("#goodsAttributeParent");
				await this.$emit('goodsAttributeHtml', b.innerHTML);
			},
		},
		watch: {
			data(val) {
				this.goodsHtml();
			}
		},
		mounted() {
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
	
	.goods-standard {
		min-height: 36px;
		width: 100%;
		border: 1px solid #000;
		display: flex;
		justify-content: flex-start;
		.standard {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-left: 12px;
			width: 33.3%;
			flex-wrap: wrap;
		}
	}
</style>