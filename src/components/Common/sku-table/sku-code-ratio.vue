<template>
    <div class="sku-code-ratio">
        <!-- 码比数弹窗 -->
        <el-dialog :modal-append-to-body="false" size="medium" class="custom-dialog set-submit-person-dialog" title="按码比填数" :visible.sync="isShow" @close="cancel">
			<div v-if="!enabled">
				<div class="mgb8">规格：</div>
				<nf-sku-table
						ref="skuCode"
						editable
						skc
						skcCode
						skcTotal
						@change="handleSkuValueChange"
						:metadatas="metadatas"
						:totalsNum='totalsNum'
						:quantities="quantities"
						class="mgb8"></nf-sku-table>
				<div class="mgb8">码比：</div>
				<div class="nf-sku-table">
					<el-table
							:data="colorArr"
							border
							style="width: 100%">
						<el-table-column
								class-name="nf-sku-table__standard--column"
								width="100"
								align="center"
								label="尺码">
							<template slot-scope="scope">
								<div>码比</div>
							</template>
						</el-table-column>
						<!-- 渲染尺码列 -->
						<el-table-column
								width="90"
								align="center"
								:label="sizeItem.size_value"
								v-for="sizeItem in sizeArr"
								:key="sizeItem.size_id">
							<template slot-scope="scope">
								<!--不显示内长-->
								<template v-if="!isShowLength">
									<div class="hand-input">
										<!-- <nf-sku-table-input
                                            :skuVal.sync="currentSkuVal"
                                            v-bind="{
                                                sizeItem: sizeItem,
                                                colorItem: scope.row,
                                                showNum: showNum,
                                                isShowLength: isShowLength
                                            }">
                                        </nf-sku-table-input> -->
										<el-input type="number" :min="0" v-model="sizeItem.sizeNum" placeholder="0"></el-input>
									</div>
								</template>
							</template>
						</el-table-column>
						<!-- 渲染尺码列---end -->
					</el-table>
				</div>
			</div>
			<div v-if="enabled">
				<nf-sku-table
						ref="codeSizeConfigSku"
						:codeRatioConfigSel="codeRatioConfigSel"
						editable
						showNum
						sizeConfig
						@codeRatioConfigSelIsChange="codeRatioConfigSelIsChange"
						:quantities="codeRatioConfigQuantities"
						:metadatas="metadatas"
				></nf-sku-table>
			</div>

	        <div slot="footer" class="dialog-footer">
	            <el-button @click="cancel">取 消</el-button>
	            <el-button :loading="isSubmitting"  type="primary" @click="confirm">确定</el-button>
	        </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
	import mixin from './sku-table-mixin';
	import NfSkuTableInput from './sku-table-input';
	import {codeRatioConfigInfo,codeRatioListByStyleId} from '@/api'
	export default {
		/*
		metadatas:规格的数据
		isShow: 弹窗显示问题
		skuVal: 工单编辑传进来的拼接好的key
		*/
		props: ['styleId','metadatas', 'isShow', 'skuVal','quantities','totalsNum'],
		mixins: [mixin],
		components: {NfSkuTableInput},
		data () {
			return {
                codeRatioConfigSelHasChange:false,
                enabled:false,
				tableData: {},
				currentSkuVal: {},
				showNum: true,
                codeRatioConfigSel:[]

			}
		},
		methods: {
            //码比配置启用，停用
            getCodeRatioConfigInfo(){
                codeRatioConfigInfo({userId:this.userId,facId:this.unitId}).then(res=>{
                    if(res.data.code===0){
                        this.enabled = res.data.data.enabled;
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            getCodeRatioListByStyleId(){
                codeRatioListByStyleId({userId:this.userId,styleId:this.styleId}).then(res=>{
                    if(res.data.code===0){
						this.codeRatioConfigSel = res.data.data
                    }else {
                        this.$message.error(res.data.msg)
                    }
                })
            },
            codeRatioConfigSelIsChange(selId){
                if(selId){
                    this.codeRatioConfigSelHasChange = true
				}else {
                    this.codeRatioConfigSelHasChange = false
				}
			},

			//取消
			cancel() {
				this.$emit('update:isShow', false)
			},
			// 获取码比总数
			getNumber () {
				let num = 0
				this.sizeArr.forEach(i => {
					num += (i.sizeNum*1)
				})
				return num
			},
			// 获取拼接数据新建
			getKeyDate() {
				let colorDate = this.$refs['skuCode'].getColorArr()
				// extend
				let _key = ''
				let arr = []
				// `${item.color_id}-${item.size_id}-${item.standard_id}`;
				// 拼接key
				colorDate.forEach((i,k) => {
					this.sizeArr.forEach(v => {
						if (!i.lengthArr.length) {
							// 无内长
							_key = `${i.color_id}-${v.size_id}`
							arr.push({key: _key, sizeNum: v.sizeNum, totalQuality: i.num ? i.num : 0})
						} else {
							i.lengthArr.forEach(item => {
								_key = `${i.color_id}-${v.size_id}-${item.standard_id}`
								arr.push({key: _key, sizeNum: v.sizeNum, totalQuality: item.num ? item.num : 0})
							})
						}
					})
				})
				return arr
			},
			// 编辑的时候拼接数据传给规格和尺码
			getColorArr() {
				Object.keys(this.skuVal).forEach(key => {
					let keyList = key.split('-')
					this.tableData['colorArr'].forEach(i => {
						if(i.color_id == keyList[0]){
							if(!this.lengthArr.length) {
								// 无内长
								i.num = this.skuVal[key].num
							}
						}
					})
				})
				// this.$refs['skuCode'].setColorArr(this.tableData['colorArr'])
				// console.log(this.$refs, '890')
			},
			// 确认
			confirm() {

				//是否启用码比配置
                if(this.enabled){
                    // 启用
                    // if(this.codeRatioConfigSelHasChange){
                    //     //选择了码比组
                    //     this.codeRatioConfigQuantities.forEach(item => {
                    //         Object.keys(this.currentSkuVal).forEach(key => {
                    //             if (this.currentSkuVal[key].skuId === item.skuId) {
                    //                 this.currentSkuVal[key] = { ...item };
                    //             }
                    //         });
                    //     });
					// }else {
                        this.currentSkuVal = this.$refs['codeSizeConfigSku'].getSkuTableValue()
                    // }

				}else {
                    let number = this.getNumber()
                    let keyDate = this.getKeyDate()
                    let obj = {}
                    keyDate.forEach(item => {
                        Object.keys(this.currentSkuVal).forEach(key => {
                            if (item.key == key) {
                                console.log(item.totalQuality)
                                if (item.totalQuality == 0 || item.totalQuality == '' || item.sizeNum == 0 || item.sizeNum == '') {
                                    this.currentSkuVal[key].num = 0
                                } else {
                                    this.currentSkuVal[key].num = Math.round((item.sizeNum*1/number)*item.totalQuality)
                                }

                            }
                        });
                    });
				}
				this.$emit('getCodeNumber',this.currentSkuVal)
				this.$emit('update:isShow', false)

			}
		},
		watch: {
			'metadatas'(val) {
				this.tableData = this.getTableData(this.metadatas);
				if(this.enabled){
                    this.codeRatioConfigQuantities = val.map(item=>{
                        let obj = {skuId:item.id,num:0,color_id:item.color_id,standard_id:item.standard_id}
                        return obj
                    });
                    let color_ids = Array.from(new Set(this.codeRatioConfigQuantities.map(item=>item.color_id)))
                    console.log(color_ids);
                    color_ids.forEach((item,index)=>{
                        this.codeRatioConfigQuantities.forEach($item=>{
                            if(item===$item.color_id){
                                $item.rowIndex = index

                            }
                        })
                    })
				}

                this.currentSkuVal = this.tableData['skuVal'];
				this.colorArr = [this.tableData['colorArr'][0]]
				this.sizeArr = this.tableData['sizeArr']
				this.sizeArr.forEach(i => {
					this.$set(i,'sizeNum', '')
				})
			},
			'skuVal' () {
				this.getColorArr()
			},
			'styleId' () {
                this.getCodeRatioListByStyleId()
			},
		},
		computed: {
			sizeArr() {
				return this.tableData['sizeArr'];
			},
			colorArr() {
				let tableData = this.tableData['colorArr'] ? [this.tableData['colorArr'][0]] :  []
				return tableData;
			},
			lengthArr() {
				return this.tableData['lengthArr'];
			},
            userId(){
                return this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            }
		},
		created () {
		    this.getCodeRatioConfigInfo()
            this.getCodeRatioListByStyleId()
			this.tableData = this.getTableData(this.metadatas);
			this.currentSkuVal = this.tableData['skuVal'];
		}
	}
</script>
<style lang="scss">
	.sku-code-ratio{
		.hand-input{
			.el-input__inner{
				border:none;
			}
		}
		.nf-sku-table .hand-input > input{
			border-right: 1px solid #dfe4ec;
		}
	}
</style>
