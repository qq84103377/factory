<template>
	<div>
		<div id="skuTableParent">
			<div id="skuTable">
				<nf-table v-if="tableData.colors && tableData.colors.length" :tableData="tableData" :skuVal="skuVal" @setSkuVal="setSkuVal"></nf-table>
			</div>
		</div>
	</div>
</template>
<script>
	import nfTable from './table'
	export default {
		data() {
			return {
				goodsSku: {},
				skuVal: {},
				setSkuVal: {},
				copySkuVal: {},
				tableData: []
			}
		},
		props: ['data'],
		components: {
			nfTable: nfTable
		},
		methods: {
			use() {
				// console.warn(this.goodsSku);
				this.goodsSku = JSON.parse(this.data);
				this.tableData = this.regroupTaleData(this.goodsSku.goodSku);
				for(let skuItem of this.goodsSku.goodSku) {
					const id = `${skuItem.color_id}-${skuItem.size_id}${skuItem.standard_id
                            ? "-" + skuItem.standard_id
                            : ""}`;
					this.skuVal[id] = {
						colorId: skuItem.color_id,
						skuId: skuItem.id,
						quantity: 0
					};
					this.copySkuVal[id] = {
						quantity: 0
					};
					for(let nodeItem of this.goodsSku.details) {
						if(nodeItem.skuId === skuItem.id) {
							const id = `${skuItem.color_id}-${skuItem.size_id}${skuItem.standard_id
                            ? "-" + skuItem.standard_id
                            : ""}`;
							this.skuVal[id] = {
								colorId: skuItem.color_id,
								detailId: nodeItem.id,
								skuId: nodeItem.skuId,
								quantity: nodeItem.num
							};
							this.copySkuVal[id] = {
								quantity: nodeItem.num
							};
						}
					}
				}
			},
			regroupTaleData(skuList) {
				let colors = [],
					lengths = [],
					sizes = [],
					json = {};
				for(let item of skuList) {
					if(!json[item.color_name]) {
						colors.push({
							name: item.color_name,
							id: item.color_id
						});
						json[item.color_name] = item.color_name;
					}
					if(!json[item.size_value]) {
						sizes.push({
							value: item.size_value,
							id: item.size_id
						});
						//console.log(sizes)
						json[item.size_value] = item.size_value;
					}
					if (item.standard_id && !json[item.standard_id]) {
						lengths.push({
							value: item.standard_value || '无',
							id: item.standard_id
						});
						json[item.standard_id] = item.standard_id;
					}
				}
				return {
					colors: colors,
					lengths: lengths,
					sizes: sizes
				};
			},
			async skuHtml() {
				let b = await document.querySelector("#skuTableParent");
				console.log(b)
				await this.$emit('goodsSkuHtml', b.innerHTML);
			}
		},
		watch: {
			data(val) {
				this.use();
				this.skuHtml();
			}
		},
		mounted() {
			if(this.data.length > 0) {
				this.use();
				this.skuHtml();
			}
		}
	}
</script>
<style lang="scss" scoped>
	#skuTable {
		width: 100%;
		overflow: hidden;
	}
</style>