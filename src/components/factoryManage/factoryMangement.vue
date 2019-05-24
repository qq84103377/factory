<template>
	<div class="factory_set">
		<section class="nf-scroll-container">
			<page-title title="工厂设置">
				<nf-button type="warning" svg="icon-btn-add" @click="add">添加工厂</nf-button>
			</page-title>
			<div class="nf-scroll-view">
				<div class="container_fac" v-for="(item,facindex) of facItem">
					<div class="container_fac_header" :id="'content' + facindex" @click="showInfo(item,facindex)">
						<div class="container_fac_header_left">
							<a href="javascript:;" class="container_fac_header_right" :class="{'container_fac_header_right_rotate': item.isExpand}">
								<icon type="icon-drop-down"></icon>
							</a>
							<div class="fac_header_img">
								<img :src="item.logo" v-errorLogo>
							</div>
							<p>{{item.name}}<br><span style="color:#a2abb8;font-size:14px;">创建时间：{{item.createTime|filterTime}}</span></p>
						</div>
						<nf-button svg="icon-edit1" @click="jumpEditPage(item)" style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
					</div>
					<div class="container_fac_info_show" v-if="item.isExpand">
						<!--工厂信息-->
						<div class="base_info">
							<content-wrap title="工厂信息" type="big">
								<div class="base_info_container clearfix">
									<div class="wrap">
										<div class="item fl">
											<span class="label">工厂名称：</span>
											<span class="info ellipsis_1">{{facInfo.name}}</span>
										</div>
										<div class="item fl">
											<span class="label">联系人：</span>
											<span class="info ellipsis_1" :class="{'colorGray': !facInfo.contacts}">{{facInfo.contacts || '未填写'}}</span>
										</div>
										<div class="item fl">
											<span class="label">座机号码：</span>
                                            <span v-if="facInfo.areaCode!=undefined&&facInfo.areaCode!=''">{{facInfo.areaCode+'-'}}</span><span class="info ellipsis_1" :class="{'colorGray': !facInfo.phone}">{{facInfo.phone || '未填写'}}</span>
										</div>
										<div class="item fl">
											<span class="label">手机号码：</span>
											<span class="info ellipsis_1" :class="{'colorGray': !facInfo.telephone}">{{facInfo.telephone || '未填写'}}</span>
										</div>
										<div class="item fl">
											<span class="label">所属地区：</span>
											<span class="info ellipsis_1" :class="{'colorGray': !facInfo.contacts&&!facInfo.city&&!facInfo.area}">
                									{{facInfo.province+facInfo.city+facInfo.area || '未填写'}}
                								</span>
										</div>
										<div class="item fl">
											<span class="label">工厂地址：</span>
											<span class="info ellipsis_1" :class="{'colorGray': !facInfo.address}">{{facInfo.address || '未填写'}}</span>
										</div>
									</div>
								</div>
							</content-wrap>
						</div>
						<!-- 关联仓库 -->
						<div class="repertory_info">
							<content-wrap title="关联仓库" type="big">
								<div v-for="(e, index) in facInfo.storehouse" style="display: inline-block;">
									<span class="item_wrap">
              							<item-base>{{e.name}}</item-base>
              							<img class="tip" v-if="e.defaultTag === 1" src="../../assets/images/default_tip.png">
              						</span>
								</div>
							</content-wrap>
						</div>
                        <!-- 关联生产准备中心 -->
						<!-- <div class="repertory_info">
							<content-wrap title="关联生产准备中心" type="big">
								<div v-for="(e, index) in facInfo.procenter" style="display: inline-block;">
									<span v-if="e.status==1" class="item_wrap">
              							<item-base>{{e.name}}</item-base>
              						</span>
								</div>
							</content-wrap>
						</div> -->
						<!-- 工位分组 -->
						<!-- <div class="form_info">
							<content-wrap title="工位分组" type="big">
								<div class="form_info_container">
									<item-base class="item" v-for="(item, index) in groupItem" :key="index">
										{{item.name}}
										<em>({{item.num}}人)</em>
									</item-base>
								</div>
							</content-wrap>
						</div> -->
								<!--货品规格-->
						<!-- <div class="goodsstandard_info">
					
							<content-wrap title="货品规格" type="big">
								<div class="goodsstandard_info_container">
									<h4>颜色</h4>
									<span class="default" v-if="facData.color === undefined || facData.color.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.color" :key="index">
										{{item.name}}
									</item-base>
									<h4 style="margin-top: 24px;">尺码</h4>
									<span class="default" v-if="facData.size === undefined || facData.size.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.size" :key="index">
										{{item.value}}
									</item-base>
									<h4 style="margin-top: 24px;">内长</h4>
									<span class="default" v-if="facData.length === undefined || facData.length.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.length" :key="index">
										{{item.value}}
									</item-base>
								</div>
							</content-wrap>
						</div> -->
						<!--货品属性-->
						<!-- <div class="goodsstandard_info">
							<content-wrap title="货品属性" type="big">
								<div class="goodsstandard_info_container no-border ">
									<h4>品牌</h4>
									<span class="default" v-if="facData.brand === undefined || facData.brand.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.brand" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">设计师</h4>
									<span class="default" v-if="facData.designer === undefined || facData.designer.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.designer" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">波段</h4>
									<span class="default" v-if="facData.wave === undefined || facData.wave.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.wave" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">分类</h4>
									<span class="default" v-if="facData.kind === undefined || facData.kind.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.kind" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">季节</h4>
									<span class="default" v-if="facData.season === undefined || facData.season.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.season" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">年份</h4>
									<span class="default" v-if="facData.year === undefined || facData.year.length===0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.year" :key="index">{{item.value}}</item-base>
									<h4 style="margin-top: 24px;">标签</h4>
									<span class="default" v-if="facData.tag === undefined || facData.tag.length === 0">暂无数据</span>
									<item-base class="item" v-for="(item, index) in facData.tag" :key="index">{{item.value}}</item-base>
								</div>
							</content-wrap>
						</div> -->
					</div>
				</div>
			</div>
		</section>
		<transition name="right-move">
			<addFactory v-if="isComponentsShow" @toggle="isComponentsShow = !isComponentsShow"></addFactory>
		</transition>
		<transition name="opcity">
			<div class="cover" v-if="isComponentsShow" @click="isComponentsShow = false">
			</div>
		</transition>
		<!--收费限制弹窗-->
		<warn-dialog :visible.sync="isShow" type="4" message="当前工厂数已达到上限，无法再创建！" text="如有需要请联系云工厂客服或实施人员" @confirm="confirm"></warn-dialog>
	</div>
</template>

<script>
	import addFactory from './AddFactory';
	import { getEasyLimitFactorys, getFacInfo, getEasyGroups, getFacUnitSettings } from '../../api/api'
    import warnDialog from '@/components/Common/dialog/warnDialog.vue'
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				isComponentsShow: false, // 添加工厂组件
				//工厂列表
				facItem: [],
				showFac: false,
				showIndex: "",
				facId: "",
				groupItem: [],
				facInfo: {},
				facData: {
					size: [],
					color: [],
					length: [],
					designer: [],
					tag: [],
					year: [],
					brand: [],
					season: [],
					kind: [],
					wave: []
				},
				phone: "",
                password: "",
                userId: '',
                isShow:false, // 收费限制弹窗
                canCreate: true, // 是否可编辑
			}
		},
		components: {
			addFactory,
            warnDialog
		},
		filters: {
			filterTime(val) {
				let date = val.slice(0, 10);
				date.replace('-', '.');
				return date.replace(/-/g, '.');

			}
		},
		methods: {
		    // 新建工厂
			add(){
				if (this.canCreate) {
                    this.isComponentsShow = true
				} else {
                    this.isShow = true
				}

			},
            confirm(){
                this.isShow = false
            },
			//工厂列表
			getFacList() {
				let params = {
					"userId": this.userId
				};

                getEasyLimitFactorys(params).then(
					res => {
					    this.canCreate = res.data.data.canCreate
                        res.data.data.factorys.map(item => {
							item.isExpand = false;
						});
						this.facItem = res.data.data.factorys;
					}
				)
			},
			async showInfo(item, facindex) {
				this.facId = item.id;
                // this.facItem[facindex].isExpand = !this.facItem[facindex].isExpand;
                for(let i=0;i<this.facItem.length;i++) {
                    if(facindex == i) {
                        this.facItem[facindex].isExpand = !this.facItem[facindex].isExpand;                        
                    }else{
                        this.facItem[i].isExpand = false;
                    }
                }
			    await this.getNowDataFac();
				this.getNowFacInfo();

			},
			//获取当前工厂信息
			getNowFacInfo() {
				let params = {
					"token": "",
					"facId": this.facId || JSON.parse(sessionStorage.getItem('last_login')).id,
					"userId": this.userId
				};
				getFacInfo(params).then(
					res => {
						this.facInfo = res.data;
						// 筛选关联仓库
						this.facInfo.storehouse = this.facInfo.storehouse.filter(item => {
							return item.defaultTag !== -1;
						});
					}
				)
				let paramsGroup = {
					"facId": this.facId || JSON.parse(sessionStorage.getItem('last_login')).id,
					"token": "",
				};
				getEasyGroups(paramsGroup).then(
					res => {
						this.groupItem = res.data;
					}
				)
			},
			//获取所有的当前工厂信息
			getNowDataFac() {
				let params = {
					"facId": this.facId,
					"token": "",
					"type": "all"
				};
				getFacUnitSettings(params).then(
					res => {
						this.facData = res.data.data;
					}
				);
			},
			jumpEditPage(item) {
				this.$router.push('/editFacInfo?id=' + item.id);
			},
			reload() {}
		},
		created() {
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            
			// this.getNowDataFac();
            this.getFacList();
            
		},
	}
</script>

<style lang="scss" scoped>
	@import '~scss_vars';
	.nothing {
		color: #BABDC2;
	}
	
	.factory_set {
		overflow-y: auto;
		.colorGray {
			color: #babdc2;
		}
		width: 100%;
		/*height: 100%;*/
		.delete-facbtn {
			margin-top: 32px;
		}
		.container_fac {
			background-color: #fff;
			box-sizing: border-box;
			margin-bottom: 16px;
			box-shadow: 0 30px 20px -24px rgba(13, 51, 128, 0.1), 0 3px 10px -3px rgba(13, 51, 128, 0.1);
			.container_fac_header {
				cursor: pointer;
				padding: 0 32px 0 24px;
				background-color: #fff;
				height: 72px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.container_fac_header_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.fac_header_img {
						width: 40px;
						height: 40px;
						border-radius: 4px;
						margin-right: 24px;
						img {
							width: 100%;
							border-radius: 4px;
						}
					}
					p {
						color: #2c2c2c;
						font-size: 18px;
					}
				}
				.container_fac_header_right {
					margin-right: 12px;
				}
				.container_fac_header_right_rotate {
					transform: rotate(180deg);
					transition: all .7s;
				}
			}
			.container_fac_line {
				height: 4px;
				background-color: #f3f6fa;
			}
			.container_fac_info {
				background-color: #fff;
			}
			.container_fac_info_show {
				border-top: 1px solid #e0e6ed;
				min-height: 300px;
				box-sizing: border-box;
				padding: 0 32px 0;
				.base_info {
					margin-top: 32px;
					padding: 0 0 0 14px;
					.base_info_container {
						padding-bottom: 8px;
						border-bottom: 1px solid #e0e6ed;
						.wrap {
							width: 800px;
						}
						.item {
							margin-bottom: 16px;
							width: 350px;
							font-size: 14px;
							.label {
								width: 80px;
								color: #a2abb8;
							}
							.info {
								color: #3b3b3b;
							}
						}
					}
				}
				.repertory_info {
					margin-top: 14px;
					padding: 0 0 12px 14px;
					// border-bottom: 1px solid #e6e8eb;
					.item_wrap {
						display: inline-block;
						margin: 0 8px 8px 0;
						.tip {
							position: relative;
							top: 5px;
							padding-right: 22px;
							width: 68px;
							height: 24px;
						}
					}
				}
				.form_info {
					margin-top: 32px;
					padding: 0 0 12px 14px;
					.form_info_container {
						padding-bottom: 24px;
						border-bottom: 1px solid #e6e8eb;
						.item {
							margin-right: 6px;
							margin-bottom: 8px;
							em {
								font-style: normal;
								color: #a2abb8;
							}
						}
					}
				}
				.goodsstandard_info {
					margin-top: 8px;
					padding: 0 0 12px 14px;
					.goodsstandard_info_container {
						padding-bottom: 24px;
						border-bottom: 1px solid #e6e8eb;
						.default {
							font-size: 14px;
							color: #C4C6CC;
							line-height: 36px;
						}
					}
					.no-border {
						border-bottom: 0;
					}
					h4 {
						font-size: 16px;
						font-weight: normal;
						color: #a2abb8;
					}
					.item {
						margin-right: 6px;
						margin-top: 8px;
					}
				}
			}
			.submit {
				padding-top: 24px;
				margin-top: 24px;
				text-align: center;
				border-top: 1px solid #e6e8eb;
			}
		}
	}
	
	.right-move-enter-active,
	.right-move-leave-active {
		transition: all 0.3s ease;
		transform: translateX(0);
	}
	
	.right-move-enter,
	.right-move-leave-to {
		transform: translateX(100%);
	}
	
	.opcity-enter-active,
	.opcity-leave-active {
		transition: all 0.5s ease;
		opacity: 0.5;
	}
	
	.opcity-enter,
	.opcity-leave-to {
		opacity: 0;
	}
	
	.cover {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.5;
		top: 0;
		left: 0;
		z-index: 8;
	}
</style>