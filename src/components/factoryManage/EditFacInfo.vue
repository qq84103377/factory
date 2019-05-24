<template>
	<div class="factory_set" id="factory_set">
		<section class="nf-scroll-container">
			<page-title title="编辑工厂">
				<nf-button @click="cancelFac" style="width: 98px;">取消</nf-button>
				<nf-button type="warning" @click="successFac" style="width: 98px;">确定</nf-button>
			</page-title>
			<div class="nf-scroll-view">
				<div class="container_addFac">
					<div class="container_header">
						<span class="container_header_left">
                            <span class="line_yellow"></span>
						<span class="container_header_left_text">工厂信息</span>
						</span>
					</div>
					<div class="container_baseInfoAdd">
						<div class="container_baseInfoAdd_left">
							<div class="container_baseInfoAdd_left_firstLine">
								<div class="fac_name">
									<!--<span class="must">*</span>-->
									<span class="fac_name_show important">工厂名称</span>
									<span class="write_facname">
                                        <el-input v-model="facBaseMsg.name" type="text" placeholder="请输入工厂名称"></el-input>
                                    </span>
								</div>
								<div class="fac_name">
									<span class="fac_name_show">联系人</span>
									<span class="write_facname">
                                      <el-input  v-model="facBaseMsg.contacts" type="text" placeholder="请输入联系人"></el-input>
                                    </span>
								</div>
							</div>
							<div class="container_baseInfoAdd_left_firstLine">
								<div class="fac_name">
									<span class="fac_name_show">座机号码</span>
									<span class="write_facname areaCode">
                                      <div class="nf-input w100">
                                          <el-input  v-model="facBaseMsg.areaCode" type="text" placeholder="区号"></el-input>
                                      </div>
                                      <span class="line">-</span>
									<div class="nf-input w140">
										<el-input v-model="facBaseMsg.phone" type="text" placeholder="座机号码"></el-input>
									</div>
									</span>
								</div>

								<div class="fac_name">
									<span class="fac_name_show">手机号码</span>
									<span class="write_facname w255">
                                        <el-input v-model="facBaseMsg.telephone" type="text" placeholder="请输入手机号码"></el-input>
                                    </span>
								</div>
							</div>
							<div class="container_baseInfoAdd_left_firstLine">
								<div class="fac_name">
									<span class="fac_name_show">所属地区</span>
									<span style="position:relative;" class="write_facname address">
										<div v-if="facBaseMsg.province&&cityName.length<=0"  style="position:absolute;left:12px;z-index:10;">{{diqu}}</div>
                                        <el-cascader show-all-levels :options="options2" @change="handleChange" :placeholder="''" @active-item-change="handleItemChange" :props="props"></el-cascader>
                                    </span>
								</div>
							</div>
							<div class="container_baseInfoAdd_left_firstLine detail">
								<span class="fac_name_show" style="color:#636363;">详细地址</span>
								<div class="fac_name">
									<span class="write_facname detail_address">
                                      <el-input v-model="facBaseMsg.address" type="text" placeholder="请输入详细的地址信息，如街道名称，门牌号码等"></el-input>

                                    </span>
								</div>
							</div>
							<div class="clearfix">
								<span class="fac_name_show fl" style="color:#636363; margin-right: 10px;">工厂logo</span>
								<div class="fac_name fl headImg">
									<div class="img_show" v-if="!logos"><img :src="facBaseMsg.logo"></div>
									<div class="img_show" v-if="logos"><img :src="logos"></div>
									<div class="bg">
										<span @click="changeLogo">更换logo</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 关联仓库 -->
				<div class="container_addFac repertory">
					<div style="padding-bottom: 10px;border-bottom: 1px solid #e0e6ed;">
						<content-wrap title="关联仓库" type="big">
							<el-checkbox-group v-model="repertoryList">
								<div class="wrap" v-for="item in facBaseMsg.storehouse">
									<el-checkbox :label="item.id" :disabled="item.defaultTag === 1" style="margin: 8px 0;">
										<span class="ellipsis_1 label">{{item.name}}</span>
									</el-checkbox>
									<span class="tip" v-if="item.defaultTag === 1"><img src="../../assets/images/default_tip.png"></span>
									<span class="button" v-else-if="repertoryList.indexOf(item.id) > -1" @click="handleDefault(item.id)">设为默认</span>
								</div>
							</el-checkbox-group>
						</content-wrap>
					</div>
				</div>
                <!-- 关联生产准备中心 -->
				<!-- <div class="container_addFac repertory">
					<div style="padding-bottom: 10px;border-bottom: 1px solid #e0e6ed;">
						<content-wrap title="关联生产准备中心" type="big">
							<el-checkbox-group v-model="proIds">
								<div class="wrap" v-for="item in facBaseMsg.procenter">
									<el-checkbox :label="item.id" :checked='item.status === 1' style="margin: 8px 0;">
										<span class="ellipsis_1 label">{{item.name}}</span>
									</el-checkbox>
								</div>
							</el-checkbox-group>
						</content-wrap>
					</div>
				</div> -->
				<!--工位分组-->
				<div class="container_addFac form">
					<div class="form_info">
						<div class="base_info_header">
							<div class="base_info_header_left">
								<div class="base_info_header_block"></div>
								<span>工位分组</span>
								<p class="tips">提示：双击标签可以修改工组名称</p>
							</div>
						</div>
						<div class="form_info_container">
							<ul>
								<li v-for="(item,index) of groupItem" :key="index" @dblclick="editForm(item,index)" :class="{'showBorder': item.isExpand}">
									<span v-if="!item.isExpand">{{item.name}}</span>
									<input v-if="item.isExpand" type="text" v-model="item.name" @change="changeForm(item,index)">
									<span v-if="!item.isExpand">（{{item.num}}人）</span>
									<icon type="icon-label-del" w="8" h="8" @click="deleteForm(item,index)" style="cursor: pointer;"></icon>
								</li>
								<li class="container_set_specific_add" @keyup.enter="addForm()" v-clickoutside="hideSelectForm">
									<span @click="colorShow=!colorShow">
                                        <i class="el-icon-plus"></i>&nbsp;添加</span>
									<div class="add_specific" v-if="colorShow">
										<input type="text" v-model.trim="add_Form" placeholder="请输入新分组名称">
										<span class="add_specific_right">
                                                <i class="el-icon-plus"></i>
                                                <span @click="addForm()">添加</span>
										</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="container_public">
					<!-- 货品规格和属性 -->

					<!-- <div class="container_header">
						<span class="container_header_left">
                            <span class="line_yellow"></span>
						<span class="container_header_left_text">货品规格</span>
						</span>
					</div> -->
					<!-- <div class="container_set" style="padding-bottom: 22px; border-bottom: 1px solid #e0e6ed;">
						<div class="container_set_specific">
							<div class="container_set_specific_header">颜色</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.color">
                                    {{item.name}}
									<icon type="icon-label-del" w="8" h="8" @click="deleteColor(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                                </span>
								<span class="container_set_specific_add" @keyup.enter="addColor()" v-clickoutside="hideSelectColor">
                            		<span @click="colorShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="formShow">
									<input type="text" v-model.trim="add_Color" placeholder="请输入新颜色名称" @keyup="searchColor">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addColor()">添加</span>
									</span>
									<div class="public-list" v-if="searchColorList.length>0">
										<div class="public-list_in" @click="clickColor(item)" v-for="item of searchColorList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">尺码</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.size">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteSize(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addSize()" v-clickoutside="hideSelectSize">
                            <span @click="sizeShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="sizeShow">
									<input type="text" v-model.trim="add_Size" placeholder="请输入新尺码名称" @keyup="searchSize">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addSize()">添加</span>
									</span>
									<div class="public-list" v-if="searchSizeList.length>0">
										<div class="public-list_in" @click="clickSize(item)" v-for="item of searchSizeList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">内长</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.length">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteLength(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addLength()" v-clickoutside="hideSelectLength">
                            <span @click="lengthShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="lengthShow">
									<input type="text" v-model.trim="add_Length" placeholder="请输入新内长名称" @keyup="searchLength">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addLength()">添加</span>
									</span>
									<div class="public-list" v-if="searchLengthList.length>0">
										<div class="public-list_in" @click="clickLength(item)" v-for="item of searchLengthList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
					</div> -->
					<!-- 货品属性 -->
					<!-- <div class="container_header" style="margin-top: 32px;">
						<span class="container_header_left">
                            <span class="line_yellow"></span>
						<span class="container_header_left_text">货品属性</span>
						</span>
					</div> -->
					<!-- <div class="container_set" style="padding-bottom: 32px; border-bottom: 1px solid #e0e6ed;">
						<div class="container_set_specific">
							<div class="container_set_specific_header">品牌</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.brand">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteBrand(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addBrand()" v-clickoutside="hideSelectBrand">
                            <span @click="brandShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="brandShow">
									<input type="text" v-model.trim="add_Brand" placeholder="请输入新品牌名称" @keyup="searchBrand">
									<span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addBrand()">添加</span>
									</span>
									<div class="public-list" v-if="searchBrandList.length>0">
										<div class="public-list_in" @click="clickBrand(item)" v-for="item of searchBrandList">{{item.value}}</div>
									</div>
								</div>
								</span>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">设计师</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.designer">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteDesigner(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addDesigner()" v-clickoutside="hideSelectDesigner">
                            <span @click="designerShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="designerShow">
									<input type="text" v-model.trim="add_Designer" placeholder="请输入新设计师名称" @keyup="searchDesigner">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addDesigner()">添加</span>
									</span>
									<div class="public-list" v-if="searchDesignerList.length>0">
										<div class="public-list_in" @click="clickDesigner(item)" v-for="item of searchDesignerList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">分类</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.kind">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteKind(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addKind()" v-clickoutside="hideSelectKind">
                            <span @click="kindShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="kindShow">
									<input type="text" v-model.trim="add_Kind" placeholder="请输入新分类名称" @keyup="searchKind">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addKind()">添加</span>

									</span>
									<div class="public-list" v-if="searchKindList.length>0">
										<div class="public-list_in" @click="clickKind(item)" v-for="item of searchKindList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">标签</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.tag">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteTag(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addTag()" v-clickoutside="hideSelectTag">
                            <span @click="tagShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="tagShow">
									<input type="text" v-model.trim="add_Tag" placeholder="请输入新标签名称" @keyup="searchTag">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addTag()">添加</span>
									</span>
									<div class="public-list" v-if="searchTagList.length>0">
										<div class="public-list_in" @click="clickTag(item)" v-for="item of searchTagList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">年份</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.year">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteYear(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addYear()" v-clickoutside="hideSelectYear">
                            <span @click="yearShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="yearShow">
									<input type="text" v-model.trim="add_Year" placeholder="请输入新年份名称" @keyup="searchYear">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addYear()">添加</span>
									</span>
									<div class="public-list" v-if="searchYearList.length>0">
										<div class="public-list_in" @click="clickYear(item)" v-for="item of searchYearList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">季节</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.season">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteSeason(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addSeason()" v-clickoutside="hideSelectSeason">
                            <span @click="seasonShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="seasonShow">
									<input type="text" v-model.trim="add_Season" placeholder="请输入新季节名称" @keyup="searchSeason">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addSeason()">添加</span>
									</span>
									<div class="public-list" v-if="searchSeasonList.length>0">
										<div class="public-list_in" @click="clickSeason(item)" v-for="item of searchSeasonList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
						<div class="container_set_specific">
							<div class="container_set_specific_header">波段</div>
							<div class="container_set_specific_thing">
								<span class="container_set_specific_added" v-for="(item,index) of facBaseInfo.wave">{{item.value}}
								<icon type="icon-label-del" w="8" h="8" @click="deleteWave(item,index)" style="cursor: pointer; margin-left: 6px;"></icon>
                        </span>
								<span class="container_set_specific_add" @keyup.enter="addWave()" v-clickoutside="hideSelectWave">
                            <span @click="waveShowSearch">
                                <i class="el-icon-plus"></i>&nbsp;添加</span>
								<div class="add_specific" v-if="waveShow">
									<input type="text" v-model.trim="add_Wave" placeholder="请输入新波段名称" @keyup="searchWave">
									<span class="add_specific_right">
                                    <i class="el-icon-plus"></i>
                                    <span @click="addWave()">添加</span>
									</span>
									<div class="public-list" v-if="searchWaveList.length>0">
										<div class="public-list_in" @click="clickWave(item)" v-for="item of searchWaveList">{{item.value}}</div>
									</div>
								</div>
								</span>
							</div>
						</div>
					</div> -->
					<nf-button @click="deleteFac = true" style="border-color:#FA4150; color: #fa4150; margin: 32px 16px;">删除/禁用</nf-button>
					<uploadpic v-if="isUpload" @getImg="handleGetImgUrl"></uploadpic>
				</div>
			</div>
			<!-- dialog-删除工厂 -->
			<!-- <el-dialog size="small" :visible.sync="deleteFac" :show-close="false" :modal-append-to-body="false">
                <div class="dialog-form">
                      	<p style="display:flex;justify-content:center;"><icon style="width:72px;height:72px;" type="icon-waring"></icon></p>
                        <p style="display:flex;justify-content:center;">确认删除“巨牛第一工厂”？</p>
                        <p style="display:flex;justify-content:center;">删除后数据不可恢复。如果确认要删除，请在下方输入密码并点击“确认删除”按钮。</p>
                </div>
				<div class="btn">
					<nf-button class="cancle-btn" style="margin-right:12px;" @click="deleteFac = false">取消</nf-button>
					<nf-button class="submit-btn" type="warning" @click="AjaxDeleteFac">确定</nf-button>
				</div>
			</el-dialog> -->
  			<el-dialog class="repertory_dialog repertory_dialog--dele"  :visible.sync="deleteFac">
  				<div class="title">确认删除“{{facBaseMsg.name}}”？</div>
  				<div class="body">
  					<icon w="80" h="80" type="icon-gongdan-jiedianjingbao-da"></icon>
  					<p>删除后数据不可恢复。如果确认要删除，请在下方输入密码并点击“确认删除”按钮。</p>
					<div style="margin: 0 auto; width: 320px;">
  						<el-input name="repertory_dele" trigger-on-focus=false v-model="editNodeData.password" type="password" placeholder="请输入密码"></el-input>
					</div>
  				</div>
  				<div class="footer">
  					<nf-button @click="deleteFac = false">取消</nf-button>
  					<nf-button type="warning" @click="AjaxDeleteFac">确定</nf-button>
  				</div>
  			</el-dialog>
		</section>
	</div>
							<!-- <el-input v-model="editNodeData.password" placeholder="请输入密码" type="password"></el-input>     -->
</template>

<script>
	import uploadpic from "../Common/UpdatePic.vue";
	import md5 from 'js-md5';
	import {
		deleteFacUnitSettings,
		getFacUnitSettings,
		getFacInfo,
		getEasyGroups,
		addFacUnitSettings,
		addCommonSkuAttr,
		updateFacInfo,
		addFacGroups,
		deleteFacGroups,
		deleteFactory,
		updateFacGroups,
		selectDifSettings,
		getPosition
	} from "../../api/api";
	export default {
		data() {
			return {
				deleteFac: false, // 删除工厂
				editNodeData: {
					phone: '',
					password: ''
				}, // 删除工厂-表单
				isLoading: false,
				groupItem: [],
				options: [],
				selectedOptions: [],
				provinceName: "",
				cityName: "",
				areaName: "",
				facBaseMsg: "",
				facBaseInfo: "",
				facIds: "",
				add_Color: "",
				add_Size: "",
				add_Length: "",
				add_Designer: "",
				add_Wave: "",
				add_Kind: "",
				add_Season: "",
				add_Year: "",
				add_Tag: "",
				add_Form: "",
				add_Brand: "",
				colorShow: false,
				sizeShow: false,
				lengthShow: false,
				designerShow: false,
				waveShow: false,
				kindShow: false,
				seasonShow: false,
				yearShow: false,
				tagShow: false,
				brandShow: false,
				formShow: false,
				isUpload: false,
				logos: "",
				showFormindex: "",
				searchColorList: {},
				searchSizeList: {},
				searchLengthList: {},
				searchDesignerList: {},
				searchWaveList: {},
				searchKindList: {},
				searchSeasonList: {},
				searchTagList: {},
				searchBrandList: {},
				searchYearList: {},
				options2: [],
				repertoryList: [], // 关联仓库
				defaultRepertory: '', // 默认仓库
				props: {
					value: "code",
					label: "label",
					children: "cities"
				},
                diqu:'',
                proIds:[],
				userId: '',
				arr:[]
			};
		},
		components: {
			uploadpic
		},
		// filters:{
		// 	filterSelect(val) {
		// 		if(this.facBaseMsg.province&&this.cityName.length>0) {
		// 			return '';
		// 		}
		// 	}
		// },
		methods: {
			// 删除工厂
			async AjaxDeleteFac() {
                    if(this.editNodeData.password.length<=0) {
					this.$message({
							message: "请输入密码",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
				}
				let params = {
					"token": "",
					"facId": this.facIds,
					"userId": this.userId,
					"phone": JSON.parse(sessionStorage.getItem("user_info")).phone,
					"password": md5(this.editNodeData.password),
				}
				try {
					let data = (await deleteFactory(params)).data;
					if(data.code === 0) {
                        this.$message({
								message: data.msg,
								duration: this.$globalConfig.elementUI.duration,
								type: "success"
						});						
						data.code === 0 && this.$store.dispatch('getFacs'); // 更新店铺list信息
						data.code === 0 && this.$router.push('/factoryMangement'); // 跳转工厂设置首页
					}else{
						this.$message({
								message: data.msg,
								duration: this.$globalConfig.elementUI.duration,
								type: "error"
							});						
					}
				
					console.log(data)
				} catch(err) {
					console.log(err);
				}
			},
			// 设为默认仓库
			handleDefault(id) {
				this.defaultRepertory = id;
				for(let i = 0; i < this.facBaseMsg.storehouse.length; i++) {
					if(this.facBaseMsg.storehouse[i].id === id) {
						this.$set(this.facBaseMsg.storehouse[i], 'defaultTag', 1);
					} else {
						this.$set(this.facBaseMsg.storehouse[i], 'defaultTag', 0);
					}
				}
			},
			hideSelectForm() {
				this.colorShow = false;
			},
			hideSelectColor() {
				this.formShow = false;
			},
			hideSelectSize() {
				this.sizeShow = false;
			},
			hideSelectLength() {
				this.lengthShow = false;
			},
			hideSelectWave() {
				this.waveShow = false;
			},
			hideSelectDesigner() {
				this.designerShow = false;
			},
			hideSelectKind() {
				this.kindShow = false;
			},
			hideSelectYear() {
				this.yearShow = false;
			},
			hideSelectTag() {
				this.tagShow = false;
			},
			hideSelectSeason() {
				this.seasonShow = false;
			},
			hideSelectBrand() {
				this.brandShow = false;
			},
			//用于判断是否存在于当前数组
			contains(arr, obj) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] == obj) {
						return true;
					}
				}
				return false;
			},
			handleChange(val) {
				console.log(val, "------------");
				console.log(this.diqu);
				this.provinceName = val[0];
				this.cityName = val[1] || "";
				this.areaName = val[2] || "";
			},
			handleItemChange(val) {
				this.change = val;
				console.log(val);
				if(val.length == 1) {
					var v = val[0];
				} else {
					v = val[1];
				}
				//用于判断是否再次添加
				let params = {
					id: v
				};
				if(this.contains(this.arr,v)){
					return false;
				}
				this.arr.push(v);					
				getPosition(params).then(res => {
					console.log(res, "地区");
					let city = [];
					if(val.length == 1) {
						for(let i = 0; i < res.data.positionList.length; i++) {
							let obj = {};
							obj.label = res.data.positionList[i].name;
							obj.value = res.data.positionList[i].id;
							obj.code = res.data.positionList[i].id;
							obj.cities = [];
							city.push(obj);
							setTimeout(_ => {
								for(let i = 0; i < this.options2.length; i++) {
									if(this.options2[i].code == v) {
										this.options2[i].cities.push(obj);
									}
								}
							}, 100);
						}
					} else {
						let areas = [];
						for(let i = 0; i < res.data.positionList.length; i++) {
							let obj = {};
							obj.label = res.data.positionList[i].name;
							obj.value = res.data.positionList[i].id;
							obj.code = res.data.positionList[i].id;
							obj.areas = [];
							obj.areas.push(obj);
							setTimeout(_ => {
								for(let i = 0; i < this.options2.length; i++) {
									if(this.options2[i].code == val[0]) {
										console.log(this.options2[i].code);
										let arr = this.options2[i];
										for(let j = 0; j < arr.cities.length; j++) {
											console.log(arr.cities[j].code, val[1]);
											if(arr.cities[j].code == val[1]) {
												console.log(arr.cities[j].code);
												arr.cities[j].cities.push(obj);
											}
										}
									}
								}
							}, 100);
						}
					}
				});
			},
			cityData() {
				getPosition({}).then(res => {
					console.log(res, "地区");
					for(let i = 0; i < res.data.positionList.length; i++) {
						let obj = {};
						obj.label = res.data.positionList[i].name;
						obj.code = res.data.positionList[i].id;
						obj.cities = [];
						this.options2.push(obj);
					}
					console.log(this.options2);
				});
			},
			//获取当前工厂的规格与属性
			getFacInfo() {
				this.facIds = this.$route.query.id;
				let paramsCommonMsg = {
					type: "all",
					token: "",
					facId: this.facIds
				};
				console.log(JSON.stringify(paramsCommonMsg));
				getFacUnitSettings(paramsCommonMsg).then(res => {
					console.log(res, "工厂规格与属性");
                    this.facBaseInfo = res.data.data;
				});
			},
			//获取当前工厂信息
			getNowFacInfo() {
				let params = {
					token: "",
					facId: this.facIds || JSON.parse(sessionStorage.getItem("last_login")).id,
					userId: this.userId
				};
				getFacInfo(params).then(res => {
                    this.facBaseMsg = res.data;
                    // this.proIds = res.data.procenter;
					// 将默认仓库id放入repertoryList;
					this.repertoryList = [];
					this.facBaseMsg.storehouse.forEach(item => {
						if(item.defaultTag !== -1) {
							this.repertoryList.push(item.id);
						}
						if(item.defaultTag === 1) {
							this.defaultRepertory = item.id;
						}
					});
					// end
					console.log(this.facBaseMsg, "工厂基本信息");
					this.selectedOptions.push(this.facBaseMsg.province);
					this.selectedOptions.push(this.facBaseMsg.city);
					this.selectedOptions.push(this.facBaseMsg.area);
					this.diqu = this.selectedOptions.join('/');
				});
				let paramsGroup = {
					facId: this.facIds || JSON.parse(sessionStorage.getItem("last_login")).id,
					token: ""
				};
				getEasyGroups(paramsGroup).then(res => {
					//console.log(res, "当前分组");
					res.data.map(item => {
						item.isExpand = false;
					});
					this.groupItem = res.data;
				});
			},
			isNotANumber(inputData) {
            　　//isNaN(inputData)不能判断空串或一个空格
            　　//如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。
            　　if (parseFloat(inputData).toString() == "NaN") {
            　　　　//alert("请输入数字……");注掉，放到调用时，由调用者弹出提示。
            　　　　return false;
            　　} else {
            　　　　return true;
            　　}
            },
			//点击完成更新工厂信息
			successFac() {
				if(this.facBaseMsg.name.length < 2 || this.facBaseMsg.name.length > 20) {
					this.$message({
						type: "error",
						duration: this.$globalConfig.elementUI.duration,
						showClose: true,
						message: "名字长度为2到20个长度"
					});
					return false;
				};
//				if(!this.isNotANumber(this.facBaseMsg.telephone)&&this.facBaseMsg.telephone.length>0) {
//					this.$message({
//						type: "error",
//						duration: this.$globalConfig.elementUI.duration,
//						showClose: true,
//						message: "手机号必须为数字"
//					});
//					return false;
//				}else if(!this.isNotANumber(this.facBaseMsg.phone)&&this.facBaseMsg.phone.length>0) {
//					this.$message({
//						type: "error",
//						duration: this.$globalConfig.elementUI.duration,
//						showClose: true,
//						message: "座机号必须为数字"
//					});
//					return false;					
//				}else if(!this.isNotANumber(this.facBaseMsg.areaCode)&&this.facBaseMsg.areaCode.length>0) {
//					this.$message({
//						type: "error",
//						duration: this.$globalConfig.elementUI.duration,
//						showClose: true,
//						message: "区号必须为数字"
//					});
//					return false;					
//				}
				//判断座机号码是否正确
				var shortphone = this.facBaseMsg.areaCode + this.facBaseMsg.phone;
				//console.log(shortphone);
				if(shortphone) {
					if (/^0\d{2,3}-?\d{7,8}$/.test(shortphone)) {
					} else {
						this.$message({
							type: 'error',
							duration: this.$globalConfig.elementUI.duration,
							showClose: true,
							message: "座机号码填写错误",
						});
						return false;
					}
				}
				//联系人姓名做长度限制
				if (this.facBaseMsg.name.length > 50) {
					this.$message({
						type: 'error',
						duration: this.$globalConfig.elementUI.duration,
						showClose: true,
						message: "联系人姓名过长",
					});
					return false;
				}
				//联系人电话做限制
					if(this.facBaseMsg.telephone) {
						if (/^1\d{10}$/.test(this.facBaseMsg.telephone)) {
						} else {
							this.$message({
								type: 'error',
								duration: this.$globalConfig.elementUI.duration,
								showClose: true,
								message: "联系人手机号码输入错误",
							});
							return false;
						}
					}
				//限制具体地址
				if (this.facBaseMsg.address.length > 300) {
					this.$message({
						type: 'error',
						duration: this.$globalConfig.elementUI.duration,
						showClose: true,
						message: "输入地址过长",
					});
					return false;
				}
				let logos = this.logos.slice(1 + this.logos.lastIndexOf("/"));
				let facBaseMsgLogo = this.facBaseMsg.logo.slice(
					1 + this.facBaseMsg.logo.lastIndexOf("/")
                );
                // if(this.proIds.length==0) {
                //     this.$message({
				// 		type: 'error',
				// 		duration: this.$globalConfig.elementUI.duration,
				// 		showClose: true,
				// 		message: "请至少勾选一个生产准备中心",
				// 	});
				// 	return false;
                // }
				let params = {
					token: "",
					facId: this.facIds,
					name: this.facBaseMsg.name,
					phone: this.facBaseMsg.phone,
					areaCode: this.facBaseMsg.areaCode,
					logo: logos || facBaseMsgLogo,
					contacts: this.facBaseMsg.contacts,
					telephone: this.facBaseMsg.telephone,
					provinceId: this.provinceName || this.facBaseMsg.provinceId,
					cityId: this.cityName || this.facBaseMsg.cityId,
					areaId: this.areaName || this.facBaseMsg.areaId,
					address: this.facBaseMsg.address,
					defaultStorehouseId: this.defaultRepertory, // 默认仓库ID
                    storehouseIds: this.repertoryList, // 需要关联的仓库ID集合
                    productPrepareCenterIds:this.proIds,
				};
				console.log(params, "修改的参数");
				updateFacInfo(params).then(res => {
					if(res.data.code == 0) {
                        console.log(res, "info");
                        this.$store.commit("UPDATAPWD");
                        this.$store.dispatch("getFacs");
                        this.$router.push("factoryMangement");
					}else{
						this.$message({
							type: "error",
							duration: this.$globalConfig.elementUI.duration,
							showClose: true,
							message: res.data.msg
						});
						return false;
                    }
				});
			},
			cancelFac() {
				this.$router.go(-1);
			},
			//====图片上传逻辑开始=====
			//拿取图片Url,
			handleGetImgUrl(url) {
				this.logos =
					 this.$globalConfig.qiniu.baseUrl + url || this.facBaseMsg.logo;
				console.log(this.logos);
			},
			changeLogo() {
				this.isUpload = !this.isUpload;
			},
			// ====图片上传逻辑结束=====
			// ====分组逻辑开始====
			editForm(item, index) {
				this.showFormindex = index;
				// this.groupItem[index].isExpand = !this.groupItem[index].isExpand;
                this.$set(this.groupItem[index], 'isExpand', !this.groupItem[index].isExpand);
				//console.log(this.groupItem[index],"要看的");
			},
			changeForm(item, index) {
				//console.log(item,index);
				let params = {
					userId: this.userId,
					facId: this.facIds,
					token: "",
					groupId: item.id,
					name: item.name
				};
				updateFacGroups(params).then(res => {
					//console.log(res,"修改分组返回");
				});
			},
			// ====分组逻辑开始====
			//删除单个属性
			deleteForm(item, index) {
				//console.log(item);
				let Params = {
					userId: this.userId,
					facId: this.facIds,
					token: "",
					groupId: item.id
				};
				//console.log(Params,"删除分组的参数");
				deleteFacGroups(Params).then(res => {
					console.log(res);
				});
				this.groupItem.splice(index, 1);
			},
			deleteColor(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "color",
					id: item.id,
					facId: this.$route.query.id
				};
				console.log(JSON.stringify(Params), "cans");
				deleteFacUnitSettings(Params).then(res => {
                    console.log(res);
                    if(res.data.code==0) {
				        this.facBaseInfo.color.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteSize(item, index) {
				//console.log(item);
				let Params = {
					userId: this.userId,
					token: "",
					type: "size",
					id: item.id,
					facId: this.$route.query.id
				};
				//console.log(Params);
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.size.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteLength(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "length",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.length.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteDesigner(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				//console.log(Params);
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.designer.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteWave(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.wave.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteKind(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.kind.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteSeason(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.season.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteYear(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.year.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteTag(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.tag.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			deleteBrand(item, index) {
				let Params = {
					userId: this.userId,
					token: "",
					type: "other",
					id: item.id,
					facId: this.$route.query.id
				};
				deleteFacUnitSettings(Params).then(res => {
					if(res.data.code==0) {
				        this.facBaseInfo.brand.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.data.msg,
                            duration: this.$globalConfig.elementUI.duration,
                            type: "error"
                        });
                    }
				});
			},
			//增加单个属性
			addForm() {
				if(this.add_Form.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.groupItem;
				let obj = {};
				obj.name = this.add_Form;
				for(let i = 0; i < item.length; i++) {
					if(obj.name == item[i].name) {
						this.$message({
							message: "已经有该分组了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Form = "";
						return false;
					}
				}
				if(!obj.name) {
					return false;
				} else {
					// this.groupItem.push(obj);
                    this.$set(this.groupItem, this.groupItem.length, obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						name: this.add_Form
					};
					addFacGroups(params).then(res => {
						//console.log(res);
//						this.getNowFacInfo();
					});
					this.add_Form = "";
				}

				this.add_Form = "";
				this.colorShow = false;
			},
			addColor() {
				if(this.add_Color.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.color;
				let obj = {};
				obj.name = this.add_Color;
				for(let i = 0; i < item.length; i++) {
					if(obj.name == item[i].name) {
						this.$message({
							message: "已经有该颜色了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Color = "";
						return false;
					}
				}
				if(!obj.name) {
					return false;
				} else {
					this.facBaseInfo.color.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 1,
						colorName: this.add_Color
					};
					addCommonSkuAttr(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Color = "";
				}
				this.add_Color = "";
				this.formShow = false;
			},
			addSize() {
				if(this.add_Size.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.size;
				let obj = {};
				obj.value = this.add_Size;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该尺码了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Size = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.size.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 2,
						value: this.add_Size
					};
					//console.log(params);
					addCommonSkuAttr(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Size = "";
				}

				this.add_Size = "";
				this.sizeShow = false;
			},
			addLength() {
				if(this.add_Length.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.length;
				let obj = {};
				obj.value = this.add_Length;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该内长了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Length = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.length.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 3,
						value: this.add_Length
					};
					addCommonSkuAttr(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Length = "";
				}

				this.add_Length = "";
				this.lengthShow = false;
			},
			addDesigner() {
				if(this.add_Designer.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.designer;
				let obj = {};
				obj.value = this.add_Designer;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该设计师了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Designer = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.designer.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 2,
						value: this.add_Designer
					};
					//console.log(params);
					addFacUnitSettings(params).then(res => {
						//console.log(res);
					});
					this.add_Designer = "";
				}

				this.add_Designer = "";
				this.designerShow = false;
			},
			addWave() {
				if(this.add_Wave.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.wave;
				let obj = {};
				obj.value = this.add_Wave;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该波段了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Wave = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.wave.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 3,
						value: this.add_Wave
					};
					//console.log(params);
					addFacUnitSettings(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Wave = "";
				}

				this.add_Wave = "";
				this.waveShow = false;
			},
			addKind() {
				if(this.add_Kind.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.kind;
				let obj = {};
				obj.value = this.add_Kind;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该分类了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Kind = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.kind.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 4,
						value: this.add_Kind
					};
					addFacUnitSettings(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Kind = "";
				}

				this.add_Kind = "";
				this.kindShow = false;
			},
			addSeason() {
				if(this.add_Season.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.season;
				let obj = {};
				obj.value = this.add_Season;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该季节了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Season = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.season.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 5,
						value: this.add_Season
					};
					addFacUnitSettings(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Season = "";
				}

				this.add_Season = "";
				this.seasonShow = false;
			},
			addYear() {
				if(this.add_Year.length > 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let item = this.facBaseInfo.year;
				let obj = {};
				obj.value = this.add_Year;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该年份了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Year = "";
						return false;
					}
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.year.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 6,
						value: this.add_Year
					};
					addFacUnitSettings(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Year = "";
				}

				this.add_Year = "";
				this.yearShow = false;
			},
			addTag() {
				let item = this.facBaseInfo.tag;
				let obj = {};
				obj.value = this.add_Tag;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该年份了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Tag = "";
						return false;
					}
				}
				if (this.add_Tag.length > 13) {
					this.$message.error('标签不能超过13个字符');
					// this.add_Tag = '';
					return;
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.tag.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 7,
						value: this.add_Tag
					};
					addFacUnitSettings(params).then(res => {
						this.getFacInfo();
					});
					this.add_Tag = "";
				}

				this.add_Tag = "";
				this.tagShow = false;
			},
			addBrand() {
				let item = this.facBaseInfo.brand;
				let obj = {};
				obj.value = this.add_Brand;
				for(let i = 0; i < item.length; i++) {
					if(obj.value == item[i].value) {
						this.$message({
							message: "已经有该品牌了哟",
							duration: this.$globalConfig.elementUI.duration,
							type: "error"
						});
						this.add_Brand = "";
						return false;
					}
				}
				if (this.add_Brand.length > 13) {
					this.$message.error('品牌不能超过13个字符');
					// this.add_Brand = '';
					return
				}
				if(!obj.value) {
					return false;
				} else {
					this.facBaseInfo.brand.push(obj);
					let params = {
						token: "",
						userId: this.userId,
						facId: this.facIds,
						type: 8,
						value: this.add_Brand
					};
					addFacUnitSettings(params).then(res => {
						//console.log(res);
						this.getFacInfo();
					});
					this.add_Brand = "";
				}

				this.add_Brand = "";
				this.brandShow = false;
			},
			searchColor() {
				let params = {
					token: "",
					keyword: this.add_Color,
					facId: this.facIds,
					type: "color"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchColorList = res.data.data.result;
				});
			},
			colorShowSearch() {
				this.formShow = !this.formShow;
				this.searchColor();
			},
			clickColor(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 1,
					colorName: val.value
				};
				addCommonSkuAttr(params).then(res => {
					this.getFacInfo();
				});
				this.add_Color = "";
				this.formShow = false;
			},
			searchSize() {
				let params = {
					token: "",
					keyword: this.add_Size,
					facId: this.facIds,
					type: "size"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchSizeList = res.data.data.result;
				});
			},
			sizeShowSearch() {
				this.sizeShow = !this.sizeShow;
				this.searchSize();
			},
			clickSize(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 2,
					value: val.value
				};
				addCommonSkuAttr(params).then(res => {
					this.getFacInfo();
				});
				this.add_Size = "";
				this.sizeShow = false;
			},
			searchLength() {
				let params = {
					token: "",
					keyword: this.add_Length,
					facId: this.facIds,
					type: "length"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchLengthList = res.data.data.result;
				});
			},
			lengthShowSearch() {
				this.lengthShow = !this.lengthShow;
				this.searchLength();
			},
			clickLength(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 3,
					value: val.value
				};
				addCommonSkuAttr(params).then(res => {
					this.getFacInfo();
				});
				this.add_Length = "";
				this.lengthShow = false;
			},
			searchDesigner() {
				let params = {
					token: "",
					keyword: this.add_Designer,
					facId: this.facIds,
					type: "designer"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchDesignerList = res.data.data.result;
				});
			},
			designerShowSearch() {
				this.designerShow = !this.designerShow;
				this.searchDesigner();
			},
			clickDesigner(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 2,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Designer = "";
				this.designerShow = false;
			},
			searchWave() {
				let params = {
					token: "",
					keyword: this.add_Wave,
					facId: this.facIds,
					type: "wave"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchWaveList = res.data.data.result;
				});
			},
			waveShowSearch() {
				this.waveShow = !this.waveShow;
				this.searchWave();
			},
			clickWave(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 3,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Wave = "";
				this.waveShow = false;
			},
			searchKind() {
				let params = {
					token: "",
					keyword: this.add_Kind,
					facId: this.facIds,
					type: "kind"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchKindList = res.data.data.result;
				});
			},
			kindShowSearch() {
				this.kindShow = !this.kindShow;
				this.searchKind();
			},
			clickKind(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 4,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Kind = "";
				this.kindShow = false;
			},
			searchSeason() {
				let params = {
					token: "",
					keyword: this.add_Color,
					facId: this.facIds,
					type: "season"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchSeasonList = res.data.data.result;
				});
			},
			seasonShowSearch() {
				this.seasonShow = !this.seasonShow;
				this.searchSeason();
			},
			clickSeason(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 5,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Season = "";
				this.seasonShow = false;
			},
			searchYear() {
				let params = {
					token: "",
					keyword: this.add_Year,
					facId: this.facIds,
					type: "year"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchYearList = res.data.data.result;
				});
			},
			yearShowSearch() {
				this.yearShow = !this.yearShow;
				this.searchColor();
			},
			clickYear(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 6,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Year = "";
				this.yearShow = false;
			},
			searchTag() {
				let params = {
					token: "",
					keyword: this.add_Tag,
					facId: this.facIds,
					type: "tag"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchTagList = res.data.data.result;
				});
			},
			tagShowSearch() {
				this.tagShow = !this.tagShow;
				this.searchTag();
			},
			clickTag(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 7,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Tag = "";
				this.tagShow = false;
			},
			searchBrand() {
				let params = {
					token: "",
					keyword: this.add_Brand,
					facId: this.facIds,
					type: "brand"
				};
				selectDifSettings(params).then(res => {
					console.log(res);
					this.searchBrandList = res.data.data.result;
				});
			},
			brandShowSearch() {
				this.brandShow = !this.brandShow;
				this.searchTag();
			},
			clickBrand(val) {
				if(val.value.length >= 13) {
					this.$message({
						message: "输入不能超过13个字",
						duration: this.$globalConfig.elementUI.duration,
						type: "error"
					});
					return false;
				}
				let params = {
					token: "",
					userId: this.userId,
					facId: this.facIds,
					type: 8,
					value: val.value
				};
				addFacUnitSettings(params).then(res => {
					this.getFacInfo();
				});
				this.add_Brand = "";
				this.brandShow = false;
			}
		},
		created() {
            this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
            
			this.cityData();
			this.getFacInfo();
            this.getNowFacInfo();

		}
	};
</script>

<style lang="scss" scoped>
	@import "~scss_vars";
	.nf-input {
		display: inline-block;
		width: auto;
	}
	
	.w100 {
		width: 100px;
	}
	
	.w255 {
		width: 255px;
	}
	
	.w140 {
		width: 140px
	}
	
	.w526 {
		width: 526px;
	}
	
	.factory_set {
		height: 100%;
		.container_addFac {
			background-color: #fff;
			box-sizing: border-box;
			padding: 32px 32px 0 32px;
			/*border-bottom: 1px solid #e0e6ed;*/
			.container_header {
				display: flex;
				justify-content: space-between;
				.container_header_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.line_yellow {
						height: 20px;
						width: 6px;
						display: inline-block;
						background-color: $color-btn;
					}
					.container_header_left_text {
						font-size: 20px;
						margin-left: 10px;
					}
				}
				.container_header_right {
					display: inline-block;
					height: 32px;
					width: 64px;
					border: 1px solid $color-btn;
					border-radius: 2px;
					box-sizing: border-box;
					text-align: center;
					line-height: 2;
					a {
						color: $color-btn;
					}
				}
			}
			.container_baseInfoAdd {
				padding-left: 16px;
				padding-top: 32px;
				padding-bottom: 32px;
				border-bottom: 1px solid #e0e6ed;
				display: flex;
				.important {
					position: relative;
					&::before {
						content: '*';
						color: #FF0000;
						position: absolute;
						left: -5px;
						top: -2px;
					}
				}
				.container_baseInfoAdd_left {
					width: 670px;
					.container_baseInfoAdd_left_firstLine {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 24px;
						.fac_name {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.line {
								padding: 0 8px;
							}
							.must {
								color: red;
								font-size: 14px;
							}
							.fac_name_show {
								width: 56px;
								font-size: 14px;
								color: #636363;
								margin-right: 10px;
								text-align: right;
							}
							.write_facname {
								display: flex;
								align-items: center;
								width: 250px;
								height: 36px;
								border-radius: 2px;
								.el-cascader {
									width: 100%;
								}
								input {
									font-size: 14px;
									text-indent: 0.6em;
									border-radius: 2px;
									border: none;
								}
							}
							.areaCode {
								input {
									&:first-child {
										background: #fff;
										width: 40px;
									}
									&:last-child {
										width: 140px;
									}
								}
							}
							.detail_address {
								margin-left: 10px;
								width: 604px;
								input {
									width: 100%;
								}
							}
						}
					}
					.detail {
						justify-content: flex-start;
					}
				}
				.container_baseInfoAdd_right {
					margin-left: 12%;
					justify-content: center;
				}
			}
			.form_info {
				/*margin-top: 32px;*/
				.base_info_header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 32px;
					.base_info_header_left {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						.base_info_header_block {
							width: 6px;
							height: 20px;
							background-color: $color-btn;
							margin-right: 10px;
						}
						span {
							font-size: 20px;
						}
					}
					.base_info_header_right {
						span {
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 14px;
							width: 64px;
							height: 32px;
							border: 1px solid $color-btn;
							border-radius: 2px;
							color: $color-btn;
						}
					}
				}
				.form_info_container {
					padding-bottom: 32px;
					padding-left: 16px;
					border-bottom: 1px solid #e0e6ed;
					ul {
						display: flex;
						justify-content: flex-start;
						flex-wrap: wrap;
						li {
							height: 32px;
							min-width: 82px;
							background: #f2f5fa;
							border-radius: 2px;
							display: flex;
							justify-content: flex-start;
							align-items: center;
							padding: 0 8px;
							margin-right: 8px;
							margin-bottom: 8px;
							input {
								width: 172px;
								font-size: 14px;
							}
							span {
								&:nth-child(2) {
									color: #a2abb8;
								}
							}
							.el-icon-circle-close {
								color: #d7d7d7;
								&:hover {
									color: #000;
								}
							}
						}
						.container_set_specific_add {
							margin: 0;
							display: flex;
							border-radius: 2px;
							color: #808080;
							height: 32px;
							width: 82px;
							justify-content: center;
							align-items: center;
							cursor: pointer;
							position: relative;
							background-color: #fff;
							border: 1px solid #dce0e6;
							&:hover {
								background: #fafafa;
							}
							.add_specific {
								position: absolute;
								top: 38px;
								left: 0;
								width: 220px;
								height: 40px;
								border: 1px solid #d3dce6;
								box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
								border-radius: 2px;
								background-color: #fff;
								input {
									width: 70%;
									height: 38px;
									text-indent: 0.4em;
									font-size: 14px;
								}
								.add_specific_right {
									border-left: 1px solid #d3dce6;
									padding-left: 8px;
								}
							}
						}
						.showBorder {
							border: 1px solid #1ca1ff;
							height: 30px;
							background: #fff;
						}
					}
				}
			}
		}
		.repertory {
			padding-left: 46px;
			padding-right: 46px;
			.label {
				display: inline-block;
				color: #3b3b3b;
				font-size: 14px;
			}
			.wrap {
				display: inline-block;
				width: 340px;
				&:hover .button {
					display: inline-block;
				}
			}
			.tip {
				position: relative;
				top: 3px;
				display: inline-block;
				width: 68px;
				img {
					width: 100%;
				}
			}
			.button {
				display: none;
				position: relative;
				top: -2px;
				font-size: 14px;
				color: #1ca1ff;
				cursor: pointer;
				&:hover {
					text-decoration: underline;
				}
			}
		}
		.container_public {
			background-color: #fff;
			min-height: 624px;
			box-sizing: border-box;
			padding: 32px;
			.container_header {
				display: flex;
				justify-content: space-between;
				.container_header_left {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					.line_yellow {
						height: 20px;
						width: 6px;
						display: inline-block;
						background-color: $color-btn;
					}
					.container_header_left_text {
						font-size: 20px;
						margin-left: 10px;
						color: #2c2c2c;
					}
				}
				.container_header_right {
					display: inline-block;
					height: 32px;
					width: 64px;
					border: 1px solid $color-btn;
					border-radius: 2px;
					box-sizing: border-box;
					text-align: center;
					line-height: 2;
					color: $color-btn;
				}
			}
			.container_set {
				box-sizing: border-box;
				margin-left: 16px;
				margin-top: 32px;
				.container_set_header {
					font-size: 18px;
				}
				.container_set_specific {
					margin-top: 16px;
					.container_set_specific_header {
						font-size: 16px;
						color: #555;
					}
					.container_set_specific_thing {
						margin-top: 16px;
						display: flex;
						justify-content: flex-start;
						align-items: center;
						flex-wrap: wrap;
						width: 90%;
						.container_set_specific_added {
							display: flex;
							/*border: 1px solid #d0d3d7;*/
							background-color: #f2f5fa;
							border-radius: 2px;
							color: #3b3b3b;
							height: 32px;
							min-width: 82px;
							padding: 0 10px;
							box-sizing: border-box;
							justify-content: center;
							align-items: center;
							margin-right: 8px;
							margin-bottom: 8px;
						}
						.container_set_specific_add {
							display: flex;
							border: 1px solid #d7d7d7;
							border-radius: 2px;
							color: #808080;
							height: 30px;
							min-width: 82px;
							justify-content: center;
							align-items: center;
							cursor: pointer;
							position: relative;
							top: -4px;
							&:hover {
								background: #fafafa;
							}
							.add_specific {
								position: absolute;
								top: 38px;
								left: 0;
								width: 220px;
								height: 40px;
								border: 1px solid #d3dce6;
								box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.06);
								border-radius: 2px;
								background-color: #fff;
								input {
									width: 70%;
									height: 38px;
									text-indent: 0.4em;
									font-size: 14px;
								}
								.add_specific_right {
									border-left: 1px solid #d3dce6;
									padding-left: 8px;
								}
								.public-list {
									position: absolute;
									left: 0;
									top: 45px;
									width: 220px;
									max-height: 244px;
									background-color: #fff;
									border: 1px solid #d3dce6;
									border-top: none;
									box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
									border-radius: 2px;
									padding: 4px 0;
									overflow: auto;
									z-index: 9999;
									.public-list_in {
										display: flex;
										align-items: center;
										height: 36px;
										width: 100%;
										padding: 4px 0;
										box-sizing: border-box;
										color: #2c2c2c;
										padding-left: 12px;
										&:first-child {
											padding-top: 0;
										}
										&:last-child {
											padding-bottom: 0;
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	
	.tips {
		font-size: 14px;
		margin-left: 16px;
		color: #a2abb8;
	}
	
	.img_show {
		height: 102px;
		width: 102px;
		background-color: #fff;
		margin-bottom: 20px;
		border-radius: 2px;
		border: 1px solid #ddd;
		img {
			width: 100%;
			height: 100%;
			border-radius: 2px;
		}
	}
	
	.headImg {
		position: relative;
		width: 102px;
		height: 102px;
		&:hover .bg {
			display: block;
		}
		.bg {
			display: none;
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: rgba(0, 0, 0, 0.6);
			color: #FFF;
			text-align: center;
			line-height: 102px;
			span {
				padding: 5px 6px;
				border: 1px solid #fff;
				border-radius: 2px;
				cursor: pointer;
				&:hover {
					background: #FFF;
					color: #3b3b3b;
				}
			}
		}
	}
    .repertory_dialog {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 0;
        }
        .title {
            width: 100%;
            height: 52px;
            text-align: center;
            line-height: 52px;
            font-size: 20px;
            color: #3b3b3b;
            border-bottom: 1px solid #e0e6ed;
        }
        .body {
            padding: 32px;
        }
        .footer {
            padding: 0 32px 32px 36px;
            button {
                margin: 0 6px;
            }
        }
    }
    .repertory_dialog--dele {
        .el-dialog {
            width: 766px;
        }
        .body {
            text-align: center;
            P {
                margin: 32px 0;
                font-size: 14px;
                color: #3b3b3b;
            }
        }
        .footer {
            display: flex;
            justify-content: center;
            padding-top: 28px;
            border-top: 1px solid #e0e6ed;
        }
    }
</style>
<style lang="scss">
	#factory_set .el-input__inner {
		// min-width: 180px;
		padding-left: 0.6em;
		&::-webkit-input-placeholder {
			color: #636363;
		}
	}
</style>