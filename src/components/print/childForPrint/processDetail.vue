<template>
	<div>
		<div id="processParent">
			<div class="table" id="process">
				<div class="table-th">
					<div class="table-td" style="text-align:center;width: 140px;border-right:1px solid #000;">
						节点名称
					</div>
					<div class="table-td" style="text-align:center;width: 140px;border-right:1px solid #000;">
						节点类型
					</div>
					<div class="table-td" style="text-align:center;border-right:1px solid #000;">
						负责人
					</div>
					<div class="table-td" style="text-align:center;width: 140px;border-right:1px solid #000;">
						工价
					</div>
					<!--<div class="table-td" style="text-align:center;border-right:1px solid #000;">-->
						<!--开始时间-->
					<!--</div>-->
					<div class="table-td" style="text-align:center;">
						结束时间
					</div>
				</div>
				<div class="table-tr" v-for="item of processList">
					<div class="table-td" style="width: 140px;text-align:center;">
						{{item.name}}
					</div>
					<div class="table-td" style="width: 140px;text-align:center;">
						{{item.targetType}}
					</div>
					<div class="table-td" style="width: 400px;padding-left:12px;">
						<span v-for="(item2,index) of item.nodeLeaderList" :key="index">
                        {{item2.userName}}<i v-if="index !== item.nodeLeaderList.length - 1">、</i>
                    </span>
					</div>
					<div class="table-td" style="width: 140px;text-align:center;">
						<span v-if="item.wages.length>0">{{item.wages}}</span>
						<span v-else>未设置</span>
					</div>
					<!--<div class="table-td" style="width: 150px;text-align:center;border-right:1px solid #000;">-->
						<!--{{item.beginAt}}-->
					<!--</div>-->
					<div class="table-td" style="width: 150px;text-align:center;">
						{{item.endAt}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				processList: {}
			}
		},
		props: ['data'],
		methods: {
			async processHtml() {
				await (this.processList = JSON.parse(this.data));
				console.log(this.processList, "222222")
				let b = await document.querySelector("#processParent");
				await this.$emit('processDetailHtml', b.innerHTML);
			},
		},
		watch: {
			data(val) {
				this.processHtml();
			}
		},
		mounted() {
			if(this.data.length > 0) {
				this.processHtml();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.table {
		.tips_font {
			color: #000 !important;
			width: 80%;
		}
		display: table;
		width: 100%;
		margin-top: 16px;
		font-size: 14px;
		border: 1px solid #000;
		border-bottom: none;
		.table-th,
		.table-tr {
			display: table-row;
		}
		.tbody {
			display: table;
			width: 100%;
		}
		.table-tr {
			&:hover {
				background-color: #fff;
			}
			.table-td {
				border-right: 1px solid #000;
				&:last-child {
					border-right: none;
				}
			}
		}
		.table-th {
			color: #000;
			background: #fff;
		}
		.table-td {
			display: table-cell;
			height: 36px;
			// padding-left: 16px;
			vertical-align: middle;
			border-bottom: 1px solid #000;
			.tips_font {
				color: #000;
			}
		}
		.table-input {
			width: 30px;
			padding: 0 8px;
			border-bottom: 1px solid #000;
		}
		.tips_font {
			color: #000 !important;
		}
	}
</style>