<template>
  <div class="public_edit">
    <section>
      <page-title style="margin-top:8px;margin-bottom:24px;line-height:1;height:24px;" title="规格属性库">
		</page-title>
      <div>
        <div class="container_public">
            <div class="container_header">
                <span class="container_header_left">
                  <span class="line_yellow"></span>
                  <span class="container_header_left_text">面料规格</span>
                  <span style="font-size:14px;margin-left:16px;color:rgb(162, 171, 184);">提示：长按标签可拖动调整顺序</span>
                </span>
                <span>
                        <nf-button v-if="!show.showMClothes" svg="icon-edit1" @click='show.showMClothes=true' style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
      	                <nf-button v-if="show.showMClothes" style="width: 98px;" @click="cancelMColor">取消</nf-button>
                        <nf-button v-if="show.showMClothes" style="width: 98px;" type="warning" @click="sureMColor">确定</nf-button>
                </span>
            </div>
            <div class="container_set">
                <div class="container_set_specific">
                    <div class="container_set_specific_header">色号</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.fabriccolorno">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.fabriccolorno" :key="item.value+index">
                            		{{item.name}}<span v-if="item.value">-</span>{{item.value}}
                            </item-base>
                            <span v-if="show.showMClothes" class="container_set_specific_add" :key="1">
                                <span @click="addColors=true"><i class="el-icon-plus"></i>&nbsp;添加</span>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
          <!-- 辅料规格 -->
        <div class="container_public">
            <div class="container_header">
                <span class="container_header_left">
                  <span class="line_yellow"></span>
                  <span class="container_header_left_text">辅料规格</span>
                  <span style="font-size:14px;margin-left:16px;color:rgb(162, 171, 184);">提示：长按标签可拖动调整顺序</span>
                </span>
                <span>
                        <nf-button v-if="!show.showAccClothes" svg="icon-edit1" @click='show.showAccClothes=true' style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
      	                <nf-button v-if="show.showAccClothes" style="width: 98px;" @click="cancelAccColor">取消</nf-button>
                        <nf-button v-if="show.showAccClothes" style="width: 98px;" type="warning" @click="sureAccColor">确定</nf-button>
                </span>
            </div>
            <div class="container_set">
                <div class="container_set_specific">
                    <div class="container_set_specific_header">颜色</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.acccolor">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.acccolor" :key="item.value+index">
                            		{{item.name}}
                            </item-base>
                            <span v-if="show.showAccClothes" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectAccColor">
                                <span @click="acccolorShow=!acccolorShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="acccolorShow" @keyup.enter="addAccColor()">
                                    <input type="text" :maxlength="13" v-model.trim="add_AccColor" placeholder="请输入新颜色名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addAccColor()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">规格</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.specifications">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.specifications" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showAccClothes" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectSpc">
                                <span @click="spcShow = !spcShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific"  v-if="spcShow" @keyup.enter="addSpc()">
                                    <input type="text" :maxlength="13" v-model.trim="add_Spc" placeholder="请输入新尺码名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addSpc()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
      	<!--货品规格-->
        <div class="container_public">
            <div class="container_header">
                <span class="container_header_left">
                  <span class="line_yellow"></span>
                  <span class="container_header_left_text">成衣货品规格</span>
                  <span style="font-size:14px;margin-left:16px;color:rgb(162, 171, 184);">提示：长按标签可拖动调整顺序</span>
                </span>
                <span>
                        <nf-button v-if="!show.showClothes" svg="icon-edit1" @click='show.showClothes=true' style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
      	                <nf-button v-if="show.showClothes" style="width: 98px;" @click="cancelGoods">取消</nf-button>
                        <nf-button v-if="show.showClothes" style="width: 98px;" type="warning" @click="sureGoods">确定</nf-button>
                </span>
            </div>
            <div class="container_set">
                <div class="container_set_specific">
                    <div class="container_set_specific_header">颜色</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.color">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.color" :key="item.name+index">
                            		{{item.name}}
                            </item-base>
                            <span v-if="show.showClothes" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectColor">
                                <span @click="colorShow=!colorShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="colorShow" @keyup.enter="addColor()">
                                    <input type="text" v-model.trim="add_Color" placeholder="请输入新颜色名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addColor()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">尺码</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.size">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.size" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothes" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectSize">
                                <span @click="sizeShow = !sizeShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific"  v-if="sizeShow" @keyup.enter="addSize()">
                                    <input type="text" v-model.trim="add_Size" placeholder="请输入新尺码名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addSize()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">内长</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.length">
                            <transition-group class="container_set_specific_thing">
                            <item-base class="item" v-for="(item,index) of facCommonInfo.length" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothes" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectLength">
                                <span @click="lengthShow=!lengthShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="lengthShow"  @keyup.enter="addLength()">
                                    <input type="text" v-model.trim="add_Length" placeholder="请输入新内长名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addLength()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
        <!--货品属性-->
        <div class="container_public">
            <div class="container_header">
                <span class="container_header_left">
                  <span class="line_yellow"></span>
                  <span class="container_header_left_text">成衣货品属性</span>
                  <span style="font-size:14px;margin-left:16px;color:rgb(162, 171, 184);">提示：长按标签可拖动调整顺序</span>
                </span>
                <span>
                        <nf-button v-if="!show.showClothesSpecific" svg="icon-edit1" @click='show.showClothesSpecific=true' style="width: 98px;height: 36px;padding: 0;">编辑</nf-button>
      	                <nf-button v-if="show.showClothesSpecific" style="width: 98px;" @click="cancelGoodsSpc">取消</nf-button>
                        <nf-button v-if="show.showClothesSpecific" style="width: 98px;" type="warning" @click="sureGoodsSpc">确定</nf-button>
                </span>
            </div>
            <div class="container_set">
                <span class="container_set_header">属性</span>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">品牌</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.brand">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.brand" :key="index">{{item.value}}
                        </span>-->
                            <item-base class="item" v-for="(item,index) of facCommonInfo.brand" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectBrand">
                                <span @click="brandShow=!brandShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="brandShow"  @keyup.enter="addBrand()">
                                    <input type="text" v-model.trim="add_Brand" placeholder="请输入新品牌名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addBrand()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">设计师</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.designer">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.designer" :key="index">{{item.value}}
                        </span>-->
                            <item-base class="item" v-for="(item,index) of facCommonInfo.designer" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectDesigner">
                                <span @click="designerShow=!designerShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="designerShow" @keyup.enter="addDesigner()">
                                    <input type="text" v-model.trim="add_Designer" placeholder="请输入新设计师名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addDesigner()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">分类</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.kind">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.kind"  :key="index">{{item.value}}
                        </span>-->
                            <item-base class="item" v-for="(item,index) of facCommonInfo.kind" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectKind">
                                <span @click="kindShow=!kindShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="kindShow"  @keyup.enter="addKind()">
                                    <input type="text" v-model.trim="add_Kind" placeholder="请输入新分类名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addKind()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>

                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">标签</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.tag">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.tag" :key="index">{{item.value}}
                        </span>-->
                        		<item-base class="item" v-for="(item,index) of facCommonInfo.tag" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add":key="1" v-clickoutside="hideSelectTag">
                                <span @click="tagShow=!tagShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="tagShow"  @keyup.enter="addTag()">
                                    <input type="text" v-model.trim="add_Tag" placeholder="请输入新标签名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addTag()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">年份</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.year" >
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.year" :key="index">{{item.value}}
                        </span>-->
                        		<item-base class="item" v-for="(item,index) of facCommonInfo.year" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectYear">
                                <span @click="yearShow=!yearShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="yearShow" @keyup.enter="addYear()">
                                    <input type="text" v-model.trim="add_Year" placeholder="请输入新年份名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addYear()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">季节</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.season">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.season" :key="index">{{item.value}}
                        </span>-->
                            <item-base class="item" v-for="(item,index) of facCommonInfo.season" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectSeason">
                                <span @click="seasonShow=!seasonShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="seasonShow"   @keyup.enter="addSeason()">
                                    <input type="text" v-model.trim="add_Season" placeholder="请输入新季节名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addSeason()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>

                    </div>
                </div>
                <div class="container_set_specific">
                    <div class="container_set_specific_header">波段</div>
                    <div class="container_set_specific_thing">
                        <draggable v-model="facCommonInfo.wave">
                            <transition-group class="container_set_specific_thing">
                        <!--<span class="container_set_specific_added" v-for="(item,index) of facCommonInfo.wave" :key="index">{{item.value}}
                        </span>-->
                            <item-base class="item" v-for="(item,index) of facCommonInfo.wave" :key="item.value+index">
                            		{{item.value}}
                            </item-base>
                            <span v-if="show.showClothesSpecific" class="container_set_specific_add" :key="1" v-clickoutside="hideSelectWave">
                                <span @click="waveShow=!waveShow"><i class="el-icon-plus"></i>&nbsp;添加</span>
                                <div class="add_specific" v-if="waveShow" @keyup.enter="addWave()">
                                    <input type="text" v-model.trim="add_Wave" placeholder="请输入新波段名称">
                                    <span class="add_specific_right">
                                        <i class="el-icon-plus"></i>
                                        <span @click="addWave()">添加</span>
                                    </span>
                                </div>
                            </span>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
    <el-dialog :visible.sync="addColors" :show-close='false' size="tiny">
        <span style="display:flex;justify-content:center;font-size:20px;" slot="title">
            面料色号
        </span>
        <div class="color-set">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="色号" prop="name">
                    <el-input :maxlength="13" v-model.trim="ruleForm.name" placeholder="请输入面料色号"></el-input>
                </el-form-item>
                <el-form-item label="色名">
                    <el-input :maxlength="13" v-model.trim="ruleForm.num" placeholder="请输入面料色名"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <nf-button @click="addColors = false" class="cancel is-plain">取消</nf-button>
            <nf-button @click="addM()" type="warning">确定</nf-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  getFacCommonSettings,
  updateBossCommonSettings
} from "../../api/api";
export default {
  data() {
    return {
        isLoading:false,
        facCommonInfo: {},
        add_AccColor:'',
        add_Color: "",
        add_Size: "",
        add_Length: "",
        add_Designer: "",
        add_Wave: "",
        add_Kind: "",
        add_Season: "",
        add_Year: "",
        add_Tag: "",
        add_Brand: "",
        add_Spc:'',
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
        acccolorShow:false,
        spcShow:false,
        settingSort: {
            colorsIds: [],
            sizeIds: [],
            lengthIds: [],
            waveIds: [],
            kindIds: [],
            seasonIds: [],
            designerIds: [],
            yearIds: [],
            tagIds: [],
            brandIds: []
        },
        show:{
            showClothes:false,
            showClothesSpecific:false,
            showAccClothes:false,
            showMClothes:false
        },
        facFunInfo:{},
        addColors:false,
        ruleForm: {
          name: '',
          num:'',
        },
        rules: {
          name: [
            { required: true, message: '色号不能为空', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
          ],
        },
        userId: ''
    };
  },
  components: {
    draggable
  },
  methods: {
    //显示隐藏
    hideSelectSpc() {
        this.spcShow = false;
    },
    hideSelectColor() {
      this.colorShow = false;
    },
    hideSelectAccColor() {
      this.acccolorShow = false;
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
    //取消按钮
    cancelAccColor() {
        this.show.showAccClothes=false;
        console.log(this.facCommonInfo);
        console.log(this.facFunInfo);
        this.facCommonInfo.acccolor = JSON.parse(sessionStorage.getItem('facData')).acccolor;
        this.facCommonInfo.specifications = JSON.parse(sessionStorage.getItem('facData')).specifications;
    },
    cancelGoods() {
        this.show.showClothes=false;
        this.facCommonInfo.color = JSON.parse(sessionStorage.getItem('facData')).color;
        this.facCommonInfo.size = JSON.parse(sessionStorage.getItem('facData')).size;
        this.facCommonInfo.length = JSON.parse(sessionStorage.getItem('facData')).length;
    },
    cancelGoodsSpc() {
        this.show.showClothesSpecific=false;
        this.facCommonInfo.brand = JSON.parse(sessionStorage.getItem('facData')).brand;
        this.facCommonInfo.kind = JSON.parse(sessionStorage.getItem('facData')).kind;
        this.facCommonInfo.tag = JSON.parse(sessionStorage.getItem('facData')).tag;
        this.facCommonInfo.season = JSON.parse(sessionStorage.getItem('facData')).season;
        this.facCommonInfo.year = JSON.parse(sessionStorage.getItem('facData')).year;
        this.facCommonInfo.designer = JSON.parse(sessionStorage.getItem('facData')).designer;
        this.facCommonInfo.wave = JSON.parse(sessionStorage.getItem('facData')).wave;
    },
    //获取工厂信息
    getFacInfo() {
      let paramsCommonMsg = {
        type: "all",
        userId: this.userId,
        token: ""
      };
      getFacCommonSettings(paramsCommonMsg).then(res => {
        console.log(res);
        sessionStorage.setItem('facData',JSON.stringify(res.data.data));
        this.facCommonInfo = res.data.data;
      });
    },
    getFacInfos() {
      let paramsCommonMsg = {
        type: "all",
        userId: this.userId,
        token: ""
      };
      getFacCommonSettings(paramsCommonMsg).then(res => {
        console.log(res);
        sessionStorage.setItem('facData',JSON.stringify(res.data.data));
      });
    },
    //增加单个属性
    addAccColor() {
        let item = this.facCommonInfo.acccolor;
        let obj = {};
        obj.name = this.add_AccColor;
        obj.value = this.add_AccColor;
        for (let i = 0; i < item.length; i++) {
            if (obj.name == item[i].name) {
            this.$message({
                message: "已经有该颜色了哟",
                duration: this.$globalConfig.elementUI.duration,
                type: "error"
            });
            this.add_AccColor = "";
            return false;
            }
        }
        if (!obj.name) {
            return false;
        } else {
            this.facCommonInfo.acccolor.push(obj);
            this.add_AccColor = "";
        }
        this.add_AccColor = "";
        this.acccolorShow = false;
    },
    addSpc() {
        let item = this.facCommonInfo.specifications;
        let obj = {};
        obj.name = this.add_Spc;
        obj.value = this.add_Spc;
        for (let i = 0; i < item.length; i++) {
            if (obj.name == item[i].name) {
            this.$message({
                message: "已经有该规格了哟",
                duration: this.$globalConfig.elementUI.duration,
                type: "error"
            });
            this.add_Spc = "";
            return false;
            }
        }
        if (!obj.name) {
            return false;
        } else {
            this.facCommonInfo.specifications.push(obj);
            this.add_Spc = "";
        }
        this.add_Spc = "";
        this.spcShow = false;
    },
    addColor() {
      if (this.add_Color.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.color;
      let obj = {};
      obj.name = this.add_Color;
      for (let i = 0; i < item.length; i++) {
        if (obj.name == item[i].name) {
          this.$message({
            message: "已经有该颜色了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Color = "";
          return false;
        }
      }
      if (!obj.name) {
        return false;
      } else {
        this.facCommonInfo.color.push(obj);
        this.add_Color = "";
      }

      this.add_Color = "";
      this.colorShow = false;
    },
    addSize() {
      if (this.add_Size.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.size;
      let obj = {};
      obj.value = this.add_Size;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该尺码了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Size = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.size.push(obj);
        this.add_Size = "";
      }

      this.add_Size = "";
      this.sizeShow = false;
    },
    addLength() {
      if (this.add_Length.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.length;
      let obj = {};
      obj.value = this.add_Length;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该内长了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Length = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.length.push(obj);
        this.add_Length = "";
      }

      this.add_Length = "";
      this.lengthShow = false;
    },
    addDesigner() {
      if (this.add_Designer.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.designer;
      let obj = {};
      obj.value = this.add_Designer;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该设计师了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Designer = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.designer.push(obj);
        this.add_Designer = "";
      }

      this.add_Designer = "";
      this.designerShow = false;
    },
    addWave() {
      if (this.add_Wave.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.wave;
      let obj = {};
      obj.value = this.add_Wave;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该波段了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Wave = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.wave.push(obj);
        this.add_Wave = "";
      }

      this.add_Wave = "";
      this.waveShow = false;
    },
    addKind() {
      if (this.add_Kind.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.kind;
      let obj = {};
      obj.value = this.add_Kind;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该分类了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Kind = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.kind.push(obj);
        this.add_Kind = "";
      }

      this.add_Kind = "";
      this.kindShow = false;
    },
    addSeason() {
      if (this.add_Season.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.season;
      let obj = {};
      obj.value = this.add_Season;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该季节了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Season = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.season.push(obj);
        this.add_Season = "";
      }

      this.add_Season = "";
      this.seasonShow = false;
    },
    addYear() {
      if (this.add_Year.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.year;
      let obj = {};
      obj.value = this.add_Year;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该年份了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Year = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.year.push(obj);
        this.add_Year = "";
      }

      this.add_Year = "";
      this.yearShow = false;
    },
    addTag() {
      if (this.add_Tag.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.tag;
      let obj = {};
      obj.value = this.add_Tag;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该标签了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Tag = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.tag.push(obj);
        this.add_Tag = "";
      }

      this.add_Tag = "";
      this.tagShow = false;
    },
    addBrand() {
      if (this.add_Brand.length > 13) {
        this.$message({
          message: "输入不能超过13个字",
          duration: this.$globalConfig.elementUI.duration,
          type: "error"
        });
        return false;
      }
      let item = this.facCommonInfo.brand;
      let obj = {};
      obj.value = this.add_Brand;
      for (let i = 0; i < item.length; i++) {
        if (obj.value == item[i].value) {
          this.$message({
            message: "已经有该品牌了哟",
            duration: this.$globalConfig.elementUI.duration,
            type: "error"
          });
          this.add_Brand = "";
          return false;
        }
      }
      if (!obj.value) {
        return false;
      } else {
        this.facCommonInfo.brand.push(obj);
        this.add_Brand = "";
      }
      this.add_Brand = "";
      this.brandShow = false;
    },
    //点击完成时添加辅料规格
    sureAccColor() {
        let params = {
            acccolor:this.facCommonInfo.acccolor,
            specifications:this.facCommonInfo.specifications,
            userId:this.userId
        };
        updateBossCommonSettings(params).then(
            res=> {
                console.log(res);
                this.show.showAccClothes=false;
                this.getFacInfos();
            }
        )
    },
    sureGoods() {
        this.show.showClothes=false;
        let params = {
            color:this.facCommonInfo.color,
            size:this.facCommonInfo.size,
            length:this.facCommonInfo.length,
            userId:this.userId
        };
        updateBossCommonSettings(params).then(
            res=> {
                console.log(res);
                this.show.showAccClothes=false;
                this.getFacInfos();
            }
        )
    },
    sureGoodsSpc() {
        this.show.showClothesSpecific=false;
        let params = {
            brand:this.facCommonInfo.brand,
            designer:this.facCommonInfo.designer,
            kind:this.facCommonInfo.kind,
            tag:this.facCommonInfo.tag,
            year:this.facCommonInfo.year,
            wave:this.facCommonInfo.wave,
            season:this.facCommonInfo.season,
            userId:this.userId
        };
        updateBossCommonSettings(params).then(
            res=> {
                console.log(res);
                this.show.showAccClothes=false;
                this.getFacInfos();
            }
        )
    },
    addM() {
        let item = this.facCommonInfo.fabriccolorno;
        let obj = {};
        obj.name = this.ruleForm.name;
        obj.value =this.ruleForm.num;
        for (let i = 0; i < item.length; i++) {
            if (obj.name == item[i].name) {
            this.$message({
                message: "已经有该色号了哟",
                duration: this.$globalConfig.elementUI.duration,
                type: "error"
            });
            this.ruleForm.name = "";
            return false;
            }
        }
        if (!obj.name) {
            this.$message({
                message: "色号不能为空",
                duration: this.$globalConfig.elementUI.duration,
                type: "error"
            });
            return false;
        } else {
            this.facCommonInfo.fabriccolorno.push(obj);
            this.ruleForm.name = "";
        }
        this.ruleForm.name = "";
        this.ruleForm.num = "";
        this.addColors= false;
    },
    cancelMColor() {
        this.show.showMClothes=false;
        console.log(JSON.parse(sessionStorage.getItem('facData')).fabriccolorno);
        this.facCommonInfo.fabriccolorno = JSON.parse(sessionStorage.getItem('facData')).fabriccolorno;
    },
    sureMColor() {
        let params = {
            fabriccolorno:this.facCommonInfo.fabriccolorno,
            userId:this.userId
        };
        updateBossCommonSettings(params).then(
            res=> {
                console.log(res);
                this.show.showMClothes=false;
                this.getFacInfos();
            }
        )
    }
  },
  created() {
    this.getFacInfo();

    this.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
.public_edit {
  width: 100%;
  height: 100%;
  .header {
    height: 64px;
    margin-bottom: 15px;
    color: #2c2c2c;
    font-size: 18px;
    padding: 20px 32px 20px 32px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    .header_right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        font-size: 14px;
        &:first-child {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 32px;
          border: 1px solid $color-btn;
          border-radius: 2px;
          background-color: $color-btn;
          color: #fff;
        }
        &:nth-child(2) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 72px;
          height: 32px;
          border: 1px solid $color-btn;
          border-radius: 2px;
          background-color: $color-btn;
          color: #fff;
        }
      }
    }
  }
  .container_public {
    background-color: #fff;
    /*min-height: 624px;*/
    margin-bottom: 16px;
    box-shadow: 0 30px 20px -24px rgba(13, 51, 128, 0.1), 0 3px 10px -3px rgba(13, 51, 128, 0.1);
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
          color: #a2abb8;
        }
        .container_set_specific_thing {
          margin-top: 6px;
          /*margin-bottom: 28px;*/
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          min-width: 90%;
          .container_set_specific_added {
            display: flex;
            border: 1px solid #d0d3d7;
            border-radius: 2px;
            color: #2c2c2c;
            height: 34px;
            min-width: 78px;
            padding: 0 10px;
            box-sizing: border-box;
            justify-content: center;
            align-items: center;
            margin-right: 16px;
            margin-bottom: 16px;
            .el-icon-circle-close {
              color: #d7d7d7;
              padding-left: 16px;
              &:hover {
                color: #999;
              }
            }
          }
          .container_set_specific_add {
            display: flex;
            border: 1px solid #dce0e6;
            border-radius: 2px;
            color: #808080;
            height: 30px;
            width: 80px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: relative;
            top: -2px;
            transition: color .3s, border .3s;
            &:hover {
              background-color: #fafafa;
            }
            .add_specific {
              position: absolute;
              top: 38px;
              left: 0;
              width: 220px;
              height: 40px;
              border: 1px solid #d3dce6;
              box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.04),
                0 2px 4px 0 rgba(0, 0, 0, 0.12);
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
        }
      }
    }
  }
  .item {
  	margin: 0 6px 6px 0;
  }
  .color-set {
      border-bottom:1px solid #e6eaf0;
      border-top:1px solid #e6eaf0;
      padding:32px 0;
      .el-form-item {
          position: relative;
          left: -24px;
      }
  }
}
</style>
<style lang='scss'>
    .public_edit{
        .el-dialog--tiny{
            // width:20%;
        }
    }
</style>



