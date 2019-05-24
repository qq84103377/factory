/*
 * @Author: kuhn
 * @Description: 全局设置 - 自动编码管理
 * @Date: 2019-05-07 17:57:15
 * @Last Modified by: kuhn
 * @Last Modified time: 2019-05-20 16:39:23
 */

<template>
  <div class="auto-number">
    <header>自动编号设置</header>
    <div class="auto-number-content">
      <div class="common-block">
        <!-- 款号编号规则 -->
        <content-wrap title="款号编号规则">
          <!-- 设计款号 -->
          <div class="rule-wrap">
            <div class="rule-title">设计款号</div>
            <div class="rule-main">
              <el-radio-group v-model="designRule">
                <el-radio :label="0" class="rules">手动填写</el-radio>
                <el-radio
                  :label="1"
                  class="rules custom-rule"
                  checked="true">自定义规则生成</el-radio>
              </el-radio-group>
              <div class="rule-diy" v-if="designRule==1">
                <div class="rule-item rule-item-all">
                  <div class="rule-all-attrs">(未配任何自定义规则将退回手动填写)</div>
                  <span>适用全部属性：</span>
                  <p class="rule-tag" v-if="designTags.length > 0">
                    <span v-for="(tag,index) in designTags" :key="index">
                      {{tag}}
                      <span v-if="index+1 < designTags.length"> — </span>
                    </span>
                  </p>
                  <span @click="allBeseemEdit(1)" class="handle-btns edit-btn">编辑</span>
                </div>
                <div class="rule-item rule-item-some">
                  <span class="some-f-l">适用属性：</span>
                  <div class="some-f-l right-content">
                    <div class="some-title">
                      <span class="some-title-text" v-if="designBeseemSelected.attrName">{{designBeseemSelected.attrName}}</span>
                      <span @click="handleChangeAtts(1)" class="handle-btns edit-btn">编辑</span>
                    </div>
                    <ul class="some-list">
                      <li v-for="item in designBeseemRules" :key="item.id">
                        <div class="some-title">{{item.applyAttrName}}</div>
                        <p class="rule-tag some-tag">
                          <span>{{item.ruleName}}</span>
                        </p>
                        <span @click="editBeseemChild(1, item)" class="handle-btns edit-btn">编辑</span>
                        <span @click="delBeseemChild(1, item)" class="handle-btns del-btn">删除</span>
                      </li>
                    </ul>
                    <div
                      v-if="designBeseemShowAddBtn"
                      @click="addBeseemChild(1, designBeseemSelected)"
                      class="handle-btns add-btn">+ 添加子选项规则
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 商品款号 -->
          <div class="rule-wrap">
            <div class="rule-title">商品款号</div>
            <div class="rule-main">
              <el-radio-group v-model="goodsRule">
                <el-radio :label="0" class="rules">手动填写</el-radio>
                <el-radio
                  :label="1"
                  class="rules custom-rule"
                  checked="true">自定义规则生成</el-radio>
              </el-radio-group>
              <div class="rule-diy" v-if="goodsRule==1">
                <div class="rule-item rule-item-all">
                  <div class="rule-all-attrs">(未配任何自定义规则将退回手动填写)</div>
                  <span>适用全部属性：</span>
                  <p class="rule-tag" v-if="goodsTags.length > 0">
                    <span v-for="(tag,index) in goodsTags" :key="index">
                      {{tag}}
                      <span v-if="index+1 < goodsTags.length"> — </span>
                    </span>
                  </p>
                  <span @click="allBeseemEdit(2)" class="handle-btns edit-btn">编辑</span>
                </div>
                <div class="rule-item rule-item-some">
                  <span class="some-f-l">适用属性：</span>
                  <div class="some-f-l right-content">
                    <div class="some-title">
                      <span class="some-title-text" v-if="goodsBeseemSelected.attrName">{{goodsBeseemSelected.attrName}}</span>
                      <span @click="handleChangeAtts(2)" class="handle-btns edit-btn">编辑</span>
                    </div>
                    <ul class="some-list">
                      <li v-for="item in goodsBeseemRules" :key="item.id">
                        <div class="some-title">{{item.applyAttrName}}</div>
                        <p class="rule-tag some-tag">
                          <span>{{item.ruleName}}</span>
                        </p>
                        <span @click="editBeseemChild(2, item)" class="handle-btns edit-btn">编辑</span>
                        <span @click="delBeseemChild(2, item)" class="handle-btns del-btn">删除</span>
                      </li>
                    </ul>
                    <div
                      v-if="goodsBeseemShowAddBtn"
                      @click="addBeseemChild(2, goodsBeseemSelected)"
                      class="handle-btns add-btn">+ 添加子选项规则
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </content-wrap>
        <!-- 单号款号规则 -->
        <content-wrap title="单号编码规则">
          <div v-for="(rule,rIndex) in prdRuleList" :key="rIndex">
            <div v-if="rule.kind == 2" class="rule-wrap">
              <div class="rule-title">{{rule.modelName}}</div>
              <div class="rule-main">
                <el-radio-group v-model="rule.openRule" @change="changeRule(rule.id,$event)">
                  <el-radio :label="false" class="rules">手动填写</el-radio>
                  <el-radio
                    :label="true"
                    class="rules custom-rule"
                    checked="true">自定义规则生成</el-radio>
                </el-radio-group>
                <div style="display: inline-block;" v-if="rule.openRule">
                  <p class="order-rule" v-if="rule.commonGenerateRuleDTOs.length">
                    <span>{{rule.commonGenerateRuleDTOs[0].ruleName}}</span>
                  </p>
                  <span @click="editPrdRule(rule.modelType)" class="handle-btns edit-btn">编辑</span>
                </div>
              </div>
            </div>
          </div>

        </content-wrap>
        <!-- 物料款号编号规则 -->
        <content-wrap title="物料款号编号规则">
          <div v-for="(rule,rIndex) in prdRuleList" :key="rIndex">
            <materialRegular
              v-if="rule.kind == 3"
              :ruleInfo="rule"
              :index="rIndex"
              :selectTypeInfo="materialSelectTypeInfo"
              :materialOptions="materialOptions"
              @materialRuleChange="changeRule"
              @materialAllBeseemEdit="materialAllBeseemEdit"
              @materialChangeAtts="materialChangeAtts"
              @materialBeseemEdit="materialBeseemEdit"
              @materialBeseemDelete="materialBeseemDelete"
              @materialBeseemAdd="materialBeseemAdd" />
          </div>
        </content-wrap>
      </div>
    </div>

    <!-- 设计款号自定义规则 -->
    <auto-num-dialog
      :tableData="tableData"
      :listArr="listArr"
      :changeType="changeType"
      :visible="visible"
      :showBeseemSelect="showBeseemSelect"
      :selectAttrs="selectAttrs"
      :selectData="selectData"
      :isloading="isloading"
      @closeDialog="handleCloseDialog"
      @addRule="handleAddRule"
      @deleteRule="handleDeleteRule"
      @cancelCommit="handleCancelCommit"
      @sureCommit="handleSureCommit"
      @sort="handleSort">
    </auto-num-dialog>

    <!--自定义规则-->
    <customRuleDialog
      :attrList="attrList"
      :editList="editList"
      :changeType="changeType"
      :visible.sync="customRuleVisible"
      :isloading="isloading"
      v-if="customRuleVisible"
      @cancelCommit="handleCancelCommit"
      @sureCommit="handleSureCommit">
    </customRuleDialog>

    <!--适用属性弹窗-->
    <el-dialog
      size="tiny"
      class="select-attr"
      title="选择适用属性"
      :visible.sync="selectAttrDialog"
      :before-close="handleClose">
      <div class="select-attr-content">
        <span>适用属性：</span>
        <el-select v-model="beseemType" placeholder="请选择">
          <el-option
            v-for="item in attrOptions"
            :key="item.attrType"
            :label="item.attrName"
            :value="item.attrType">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectAttrDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeAttrs">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物料款号选择自定义属性 -->
    <selectBeseemType
      v-if="selectBeseemDialog"
      :attrOptions="selectBeseemList"
      :selectInfo="selectBeseemInfo"
      :selectAttrDialog="selectBeseemDialog"
      @handBeseemClose="selectBeseemDialog = false"
      @selectBeseemTypeChange="selectBeseemTypeChange" />

    <!-- 物料款号适用属性-自定义规则弹窗 -->
    <materialDIYRuleDialog
      v-if="materialDialog"
      :tableData="materialBeseemTableList"
      :listArr="materialListArr"
      :visible="materialDialog"
      :showBeseemSelect="materialShowBeseemSelect"
      :selectAttrs="materialSelectAttrs"
      :selectData="materialSelectData"
      :isloading="materialIsLoading"
      :isEdit="materialIsEdit"
      @closeDialog="materialDialog=false"
      @addRule="handlerAddMaterialRules"
      @deleteRule="handlerDeleteMaterialRules"
      @cancelCommit="handleCancelCommit"
      @sureCommit="handlerUpdateMaterialRules"
      @sort="handleSort" />
  </div>
</template>

<script>
// 款号编号规则-自定义规则弹窗
import autoNumDialog from './components/autoNumDialog'
// 单号编码，物料款号编码规则-自定义规则弹窗
import customRuleDialog from './components/customRuleDialog'
// 选择适用属性
import selectBeseemType from './components/selectBeseemType.vue'
// 物料款号规则 - 适用属性 - 自定义规则弹窗
import materialDIYRuleDialog from './components/materialDIYRuleDialog.vue'
// 物料款号规则
import materialRegular from './components/materailRegular.vue'
import {
  getAutoNumberSetById,
  getAutoNumberSetByUserId,
  autoNumberUpdateRule,
  autoNumberUpdate,
  getFacCommonAttrs,
  autoNumberBeseemList,
  autoNumberDeleteBeseemItem,
  autoNumberChangeBeseem,
  autoNumberGetAttrFields,
  ruleList,
  ruleCreate,
  ruleUpdate,
  updateRule,
  deleteRule,
  autoNumberDeleteBeseem, // 清空属性编码规则
  getMaterialOptionList, // 获取物料下拉选项
  getFacCommonSettings
} from '@/api/api'

export default {
  name: 'AutoNumber',
  data() {
    return {
      materialNoRule: false,
      editList: {
        commonGenerateAttrRuleDTOs: []
      },
      customRuleVisible: false, //自定义规则弹窗
      designRule: 0,
      goodsRule: 0,
      custom: false,
      editStatus: false,
      timer: null,
      visible: false,
      designId: '',
      goodsId: '',
      designTags: [],
      goodsTags: [],
      orderTags: [],
      workTags: [],
      tips: [],
      designTableData: [],
      goodsTableData: [],
      orderTableData: [],
      workTableData: [],
      tableData: [],
      selectAttrDialog: false, //适用属性弹窗
      attrOptions: [],
      beseemType: '', //适用属性type
      changeType: '', //1：设计款号， 2：商品款号
      designBeseemSelected: {}, //设计款号已选的适用属性
      goodsBeseemSelected: {}, //商品款号已选的适用属性
      designBeseemRules: [], //设计款号适用属性已选规则
      goodsBeseemRules: [], //商品款号适用属性已选规则
      designBeseemShowAddBtn: false, //设计款号是否显示添加子选项规则按钮
      goodsBeseemShowAddBtn: false, //商品款号是否显示添加子选项规则按钮
      designBeseemSelectedAttr: [], //设计款号已选下拉属性
      goodsBeseemSelectedAttr: [], //商品款号已选下拉属性
      showBeseemSelect: false, //是否显示自定义弹窗的适用选项
      selectData: [], //自定义弹窗 - 适用选项数据
      selectAttrs: [], //自定义弹窗 - 适用选项 - 已选属性数据
      attrIds: [], //自定义弹窗 - 适用选项已选数据
      editFlag: '', //编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
      editId: '', //编辑的id
      isloading: false, //防止多次点击
      listArr: {}, //自定义规则弹窗-全部属性下拉数据
      orderRules: [], //生产订单规则
      workRules: [], //生产工单规则
      prdRuleList: [], //生产订单/工单规则列表
      attrList: [], //自定义规则下拉框列表
      orderList: [], // 生产订单的规则下拉数据
      isOrderList: [], // 生产工单、预下单的规则下拉数据
      materialOptions: [], //物料款号编号规则下拉
      materialSelectTypeInfo: {}, // 物料已选适用属性名称
      selectBeseemDialog: false,
      selectBeseemInfo: {},
      selectBeseemList: [],
      selectBeseemIndex: 0,
      materialBeseemTableList: [], //物料适用属性-列表数据
      materialListArr: [], // 物料自定义弹窗-全部属性下拉数据
      materialDialog: false,
      materialShowBeseemSelect: false, //物料自定义弹窗 - 是否显示适用选项
      materialIsLoading: false,
      materialSelectData: [], //物料自定义弹窗 - 适用选项数据
      materialSelectAttrs: [], //物料自定义弹窗 - 适用选项 - 已选属性数据
      materialIsEdit: false, //物料自定义弹窗 - 是否编辑
      materialBeseemId: '' //物料适用属性编辑ID
    }
  },
  components: {
    autoNumDialog,
    customRuleDialog,
    materialRegular,
    selectBeseemType,
    materialDIYRuleDialog
  },
  computed: {
    userId() {
      return JSON.parse(sessionStorage.getItem('user_login')).userId
    },
    bossUnitId() {
      return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
    }
  },
  watch: {
    designRule() {
      this.updateRule(1)
    },
    goodsRule() {
      this.updateRule(2)
    }
  },
  methods: {
    /**
     * 物料款号，单号编号规则 - 自定义弹窗事件
     */
    editPrdRule(type) {
      this.customRuleVisible = true;
      this.changeType = type
      this.prdRuleList.forEach(i => {
        if (type == i.modelType) {
          if (type == 3) {
            this.attrList = this.orderList
          } else if (type == 6) {
            this.attrList = this.materialOptions
          } else {
            this.attrList = this.isOrderList
          }
          this.editList = i.commonGenerateRuleDTOs[0] || {
            commonGenerateAttrRuleDTOs: []
          }
        }
      })
    },
    /**
     * 物料款号编号规则，单号编号规则 更新为手动填写/自定义规则
     */
    changeRule(id, openRule) {
      return new Promise((resolve, reject) => {
        updateRule({
          id,
          openRule
        }).then(res => {
          resolve()
        })
      })
    },
    /**
     * 获取自定义规则弹框全部适用属性
     * @param modelType
     */
    getAttrOptions(modelType) {
      let params = {
        userId: this.userId,
        modelType
      };
      autoNumberGetAttrFields(params).then(res => {
        if (res.data.code === 0) {
          switch (modelType) {
            case 1:
              let data = res.data.data;
              data.forEach((item, index) => {
                //除"编号"和"流水号"外，都在属性后加"编号"
                if (index >= 2) {
                  this.tips.push(item.attrName + '编号');
                  this.listArr[item.attrName + '编号'] = item.attrType;
                } else {
                  this.tips.push(item.attrName);
                  this.listArr[item.attrName] = item.attrType;
                }
              });
              this.attrOptions = data.splice(2, data.length);
              break;
            case 2:
              this.isOrderList = res.data.data
              break
            case 3:
              this.orderList = res.data.data
              break
            case 4:
              // console.log('物料款号下拉数据')
              // console.log(res.data.data)
              this.materialOptions = res.data.data
              break
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**
     * 获取款号编号规则信息
     */
    getBeseemChild() {
      let paramsCommonMsg = {
        userId: this.userId
      };
      autoNumberBeseemList(paramsCommonMsg).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          data.forEach(item => {
            let selectArr = [];
            item.rules.forEach(val => {
              //封装属性名称格式
              let str = val.ruleName.slice(0, val.ruleName.length - 1);
              let arr = str.split(',');
              val.ruleName = arr.join(' — ');

              //统计已选数组
              selectArr.push(...val.attrIds);
            });
            item.selectedAttr = selectArr;
            //根据已选数组长度，判断是否显示添加子选项规则按钮
            if (item.totalAttr > 0 && (item.totalAttr > item.selectedAttr.length)) {
              item.showAddChileBtn = true;
            } else {
              item.showAddChileBtn = false;
            }
            //设计款号
            if (item.modelType === 1) {
              this.designBeseemSelected.attrName = item.attrName;
              this.designBeseemSelected.attrEnglishName = item.attrEnglishName;
              this.designBeseemSelected.attrType = item.attrType;
              this.designBeseemSelectedAttr = item.selectedAttr;
              this.designBeseemRules = item.rules;
              this.designBeseemShowAddBtn = item.showAddChileBtn;
            }
            //商品款号
            else if (item.modelType === 2) {
              this.goodsBeseemSelected.attrName = item.attrName;
              this.goodsBeseemSelected.attrEnglishName = item.attrEnglishName;
              this.goodsBeseemSelected.attrType = item.attrType;
              this.goodsBeseemSelectedAttr = item.selectedAttr;
              this.goodsBeseemRules = item.rules;
              this.goodsBeseemShowAddBtn = item.showAddChileBtn;
            }
          });
        }
      });
    },
    /**
     * 获取已选适用属性的 自定义弹窗 - 适用选项下拉列表值
     */
    getCommonInfoAttr(type, delArr) {
      return new Promise((resolve, reject) => {
        let selectedType = '';
        if (type === 1) {
          selectedType = this.designBeseemSelected.attrEnglishName;
        } else if (type === 2) {
          selectedType = this.goodsBeseemSelected.attrEnglishName;
        }
        let paramsCommonMsg = {
          type: selectedType,
          userId: this.userId
        };
        getFacCommonAttrs(paramsCommonMsg).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data[selectedType];
            // console.log('选项数据')
            // console.log(res.data.data)
            //在返回结果中剔除已选数组
            for (let i = 0; i < delArr.length; i++) {
              for (let j = 0; j < data.length; j++) {
                if (delArr[i] === data[j].id) {
                  data.splice(j, 1);
                  j--
                }
              }
            }
            this.selectData = data;
            resolve()
          }
        });
      })
    },
    /**
     * 适用全部属性 - 显示自定义规则弹框
     * this.editFlag 编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
     */
    allBeseemEdit(type) {
      this.showBeseemSelect = false;
      this.editFlag = 1;
      this.handleClickEdit(type);
    },
    /**
     * 适用属性子项 - 编辑
     * @param {type,item}
     *        type {1-->设计款号,2-->商品款号}
     *        item 选中的适用属性规则
     * this.editFlag 编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
     */
    editBeseemChild(type, item) {
      this.editFlag = 2;
      this.editId = item.id;
      this.selectAttrs = item.attrIds;
      //在已选数组中，剔除当前编辑的属性
      let delAttr = [];
      switch (type) {
        case 1:
          delAttr = [...this.designBeseemSelectedAttr];
          break;
        case 2:
          delAttr = [...this.goodsBeseemSelectedAttr];
          break
      }
      //在返回结果中剔除已选数组
      for (let i = 0; i < item.attrIds.length; i++) {
        for (let j = 0; j < delAttr.length; j++) {
          if (item.attrIds[i] === delAttr[j]) {
            delAttr.splice(j, 1);
            j--
          }
        }
      }
      this.getCommonInfoAttr(type, delAttr);
      this.handleClickEdit(type, item);
      this.showBeseemSelect = true;
    },
    /**
     * 适用属性子项 - 删除
     * @param {type,item}
     *        type {1-->设计款号,2-->商品款号}
     *        item 选中的适用属性规则
     */
    delBeseemChild(type, item) {
      this.changeType = type;
      let paramsCommonMsg = {
        id: item.id
      };
      autoNumberDeleteBeseemItem(paramsCommonMsg).then(res => {
        if (res.data.code === 0) {
          switch (this.changeType) {
            case 1:
              this.designBeseemRules = [];
              this.designBeseemShowAddBtn = true; //显示添加子选项规则按钮
              //在已选数组中剔除的子属性id
              for (let i = 0; i < item.attrIds.length; i++) {
                for (let j = 0; j < this.designBeseemSelectedAttr.length; j++) {
                  if (item.attrIds[i] === this.designBeseemSelectedAttr[j]) {
                    this.designBeseemSelectedAttr.splice(j, 1);
                    j--
                  }
                }
              }
              break;
            case 2:
              this.goodsBeseemRules = [];
              this.goodsBeseemShowAddBtn = true; //显示添加子选项规则按钮
              //在已选数组中剔除的子属性id
              for (let i = 0; i < item.attrIds.length; i++) {
                for (let j = 0; j < this.goodsBeseemSelectedAttr.length; j++) {
                  if (item.attrIds[i] === this.goodsBeseemSelectedAttr[j]) {
                    this.goodsBeseemSelectedAttr.splice(j, 1);
                    j--
                  }
                }
              }
              break
          }
          this.getBeseemChild();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /**
     * 添加子选项规则
     * @param {type,selected}
     *        type {1-->设计款号,2-->商品款号}
     *        selected 是否显示添加子选项规则按钮
     * this.editFlag 编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
     */
    addBeseemChild(type, selected) {
      this.selectAttrs = [];
      if (!selected.attrEnglishName) {
        this.$message.error("请先选择一条适用属性");
        return
      }
      this.editFlag = 3;
      let delArr = [];
      switch (type) {
        case 1:
          delArr = this.designBeseemSelectedAttr;
          break;
        case 2:
          delArr = this.goodsBeseemSelectedAttr;
          break
      }
      // 设置适用选项列表数据
      this.getCommonInfoAttr(type, delArr).then(() => {
        // 设置列表数据
        this.handleClickEdit(type);
        this.showBeseemSelect = true;
      })
    },
    /**
     * 选择适用属性
     */
    changeAttrs() {
      let selectedObj = {};
      selectedObj = this.attrOptions.find(item => {
        return item.attrType === this.beseemType
      });
      //设计款号
      if (this.changeType === 1) {
        //选择了相同的适用属性，不请求接口
        if (this.beseemType === this.designBeseemSelected.attrType) {
          this.selectAttrDialog = false;
          return
        }
        this.designBeseemSelected = selectedObj;
        this.designBeseemShowAddBtn = true; //显示添加子选项规则按钮
      }
      //商品款号
      else if (this.changeType === 2) {
        //选择了相同的适用属性，不请求接口
        if (this.beseemType === this.goodsBeseemSelected.attrType) {
          this.selectAttrDialog = false;
          return
        }
        this.goodsBeseemSelected = selectedObj;
        this.goodsBeseemShowAddBtn = true; //显示添加子选项规则按钮
      }
      let paramsCommonMsg = {
        userId: this.userId,
        modelType: this.changeType,
        attrType: selectedObj.attrType
      };
      autoNumberChangeBeseem(paramsCommonMsg).then(res => {
        if (res.data.code === 0) {
          if (this.changeType === 1) {
            this.designBeseemRules = [];
          } else if (this.changeType === 2) {
            this.goodsBeseemRules = [];
          }
          this.getBeseemChild();
        } else {
          this.$message.error(res.data.msg);
        }
      });
      this.selectAttrDialog = false;
    },
    /**
     * 显示适用属性弹窗
     * @param type {1-->设计款号,2-->商品款号}
     */
    handleChangeAtts(type) {
      this.changeType = type;
      this.selectAttrDialog = true;
    },
    /**
     * 根据ID获取全部属性详细信息
     * @param changeType 1-设计款号 2-商品款号
     */
    getListById(changeType) {
      let params = {}
      if (changeType == 1) {
        params.id = this.designId
      } else {
        params.id = this.goodsId
      }
      getAutoNumberSetById(params).then(
        res => {
          if (res.data.code == 0) {
            let data = res.data.data
            let temp = data.ruleName ? data.ruleName.split(',') : ''
            if (temp[temp.length - 1] == "") {
              temp.splice(-1, 1)
            }
            if (changeType == 1) {
              this.designTags = temp
            } else {
              this.goodsTags = temp
            }
          }
        }
      )
    },
    /**
     * 初始化款号编号规则
     */
    getListByUserId() {
      let params = {
        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
      };
      getAutoNumberSetByUserId(params).then(res => {
        if (res.data.code === 0) {
          let data = res.data.data;
          let designData = {};
          let goodsData = {};

          if (data.length) {
            data.forEach(item => {
              //设计款号
              if (item.modelType === 1) {
                designData = item;
                this.designRule = designData.userDefinedRule ? 1 : 0;
                if (designData.id) {
                  this.designId = designData.id;
                  this.getListById(1);
                }
                if (designData.attrs) {
                  for (let index in designData.attrs) {
                    designData.attrs[index].checked = this.tips[designData.attrs[index].type] ? this.tips[designData.attrs[index].type] : ''
                  }
                  // 设置设计款号自定义规则列表数据
                  this.designTableData = designData.attrs;
                }
              }
              //商品款号
              else if (item.modelType === 2) {
                goodsData = item;
                this.goodsRule = goodsData.userDefinedRule ? 1 : 0;
                if (goodsData.id) {
                  this.goodsId = goodsData.id;
                  this.getListById(2);
                }
                if (goodsData.attrs) {
                  for (let index in goodsData.attrs) {
                    goodsData.attrs[index].checked = this.tips[goodsData.attrs[index].type] ? this.tips[goodsData.attrs[index].type] : ''
                  }
                  // 设置商品款号自定义规则列表数据
                  this.goodsTableData = goodsData.attrs;
                }
              }
            })
          }
        }
      })
    },
    updateRule(changeType) {
      let params = {}
      params.userId = this.userId;
      if (changeType == 1) {
        params.id = this.designId
        params.userDefinedRule = this.designRule
        params.modelType = 1
      } else {
        params.id = this.goodsId
        params.userDefinedRule = this.goodsRule
        params.modelType = 2
      }
      autoNumberUpdateRule(params).then(res => {
        // console.log('updateRule: ', res)
      })
    },
    /**
     * 提交更新自定义规则
     * @param changeType 更新类型 1-设计款号  2-商品款号
     * this.editFlag 编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
     */
    update(changeType, arr) {
      this.isloading = true;
      let params, prdParams;
      if (changeType == 1 || changeType == 2) {
        params = {
          userId: this.userId,
          attrs: this.getAttrs(changeType),
          modelType: changeType,
          attrIds: this.attrIds,
        }
        //设计款号
        if (changeType == 1) {
          //适用全部属性
          if (this.editFlag === 1) {
            params.id = this.designId ? this.designId : '';
            params.attrType = 0;
          }
          //适用属性子项
          else if (this.editFlag === 2) {
            params.id = this.editId;
            params.attrType = this.designBeseemSelected.attrType;
          }
          //适用属性-添加子选项规则
          else if (this.editFlag === 3) {
            params.id = '';
            params.attrType = this.designBeseemSelected.attrType;
          }
        }
        //商品款号
        else if (changeType == 2) {
          //适用全部属性
          if (this.editFlag === 1) {
            params.id = this.goodsId ? this.goodsId : '';
            params.attrType = 0;
          }
          //适用属性子项
          else if (this.editFlag === 2) {
            params.id = this.editId;
            params.attrType = this.goodsBeseemSelected.attrType;
          }
          //适用属性-添加子选项规则
          else if (this.editFlag === 3) {
            params.id = '';
            params.attrType = this.goodsBeseemSelected.attrType;
          }
        }
        autoNumberUpdate(params).then(res => {
          if (res.data.code === 0) {
            this.getListByUserId(changeType);
            this.getBeseemChild();
            this.visible = false;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
          this.isloading = false;
        })
      } else {
        let ruleName = '';
        arr.commonGenerateAttrRuleDTOs.forEach((v, i) => {
          ruleName += `${v.name+(i<arr.commonGenerateAttrRuleDTOs.length-1?'-':'')}`
        })
        let ruleId = this.prdRuleList.find(i => changeType == i.modelType)
        prdParams = {
          commonRuleId: ruleId.id,
          ruleName,
          attrType: 0,
          commonGenerateAttrRuleDTOs: arr.commonGenerateAttrRuleDTOs
        }
        if (arr.id) {
          //编辑
          prdParams.id = arr.id
          // console.log(prdParams, '参数');
          ruleUpdate(prdParams).then(res => {
            this.isloading = false;
            if (res.data.code == 0) {
              this.customRuleVisible = false
              this.$message.success(res.data.msg);
              this.getRuleList();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        } else {
          //新建
          // console.log(prdParams, '参数');
          ruleCreate(prdParams).then(res => {
            this.isloading = false;
            if (res.data.code == 0) {
              this.customRuleVisible = false
              this.$message.success(res.data.msg);
              this.getRuleList();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }
      }

    },
    /**
     * 设置自定义规则列表数据
     * this.editFlag 编辑标识 1:适用全部属性-编辑;  2:适用属性子项-编辑;  3:适用属性-添加子选项规则
     */
    handleClickEdit(changeType, item) {
      this.visible = true;
      this.changeType = changeType;

      switch (changeType) {
        // 设计款号
        case 1:
          //适用属性子项
          if (this.editFlag === 2) {
            this.designTableData = item.attrs;
          }
          //适用属性-添加子选项规则
          else if (this.editFlag === 3) {
            this.designTableData = [];
          }
          this.tableData = this.designTableData;
          break;
          // 商品款号
        case 2:
          //适用属性子项
          if (this.editFlag === 2) {
            this.goodsTableData = item.attrs;
          }
          //适用属性-添加子选项规则
          else if (this.editFlag === 3) {
            this.goodsTableData = [];
          }
          this.tableData = this.goodsTableData;
          break
          //生产订单
        case 3:
          this.tableData = this.orderTableData
          break
          //生产工单
        case 4:
          this.tableData = this.workTableData
          break
      }
    },
    handleCloseDialog(changeType) {
      this.visible = false
      this.getListByUserId()
    },
    /**
     * 款号编码规则 - 自定义规则弹框 - 新增列表数据
     * @param changeType 1-设计款号 2-商品款号
     */
    handleAddRule(changeType) {
      let initObj = {
        date: '',
        name: this.tips,
        checked: '',
        address: '',
        type: undefined
      }
      switch (changeType) {
        case 1:
          this.designTableData.push(initObj)
          break;

        case 2:
          this.goodsTableData.push(initObj)
          break;
      }
    },
    /**
     * 自定义规则弹框 - 删除列表数据
     * @param params
     */
    handleDeleteRule(params) {
      if (params.changeType == 1) {
        this.designTableData.splice(params.index, 1)
      } else if (params.changeType == 2) {
        this.goodsTableData.splice(params.index, 1)
      } else if (params.changeType == 3) {
        this.orderTableData.splice(params.index, 1)
      } else if (params.changeType == 4) {
        this.workTableData.splice(params.index, 1)
      }
    },
    handleCancelCommit() {
      this.editStatus = false
    },
    // 自定义规则弹框确定，更新界面
    handleSureCommit(changeType, idArr) {
      this.attrIds = idArr;
      this.update(changeType, idArr)
    },
    handleSort(changeType, attrs) {
      if (changeType == 1) {
        this.designTableData = attrs;
      } else {
        this.goodsTableData = attrs;
      }
    },
    getAttrs(changeType) {
      let res = []
      let tbData
      if (changeType == 1) {
        tbData = this.designTableData
      } else if (changeType == 2) {
        tbData = this.goodsTableData
      } else if (changeType == 3) {
        tbData = this.orderTableData
      } else if (changeType == 4) {
        tbData = this.workTableData
      }
      for (let index in tbData) {
        let temp = {};
        temp.value = tbData[index].value || '';
        if (changeType == 1 || changeType == 2) {
          temp.type = tbData[index].type;
          if (tbData[index].type >= 26) {
            // 属性678的type值比index大8
            tbData[index].type = tbData[index].type - 8
          }
          temp.typeName = this.tips[tbData[index].type];
        } else {
          temp.commonAttrFieldId = tbData[index].id
        }
        res.push(temp)
      }
      return res
    },
    /**
     * 获取单号编码规则，物料编码规则信息
     */
    getRuleList() {
      return new Promise((resolve, reject) => {
        ruleList({
          userId: this.userId
        }).then(res => {
          // console.log('物料编码信息',res.data.data)
          this.prdRuleList = res.data.data
          // 物料款号数据初始化
          this.materialInit()
          resolve()
        })
      })

    },
    // 物料款号初始化
    materialInit() {
      const materialList = this.prdRuleList.filter(item => {
        return item.kind === 3
      })[0] || {}
      materialList.commonGenerateRuleDTOs = materialList.commonGenerateRuleDTOs || []
      const beseemList = materialList.commonGenerateRuleDTOs.filter(item => {
        return Number(item.attrType) !== 0
      })
      // 设置物料已选择属性信息
      if (beseemList.length > 0) {
        this.materialSelectTypeInfo = this.materialOptions.filter(item => {
          return beseemList[0].attrType === item.id
        })[0] || {}
      }
    },
    /**
     * 物料款号规则适用全部属性-自定义规则弹框
     */
    materialAllBeseemEdit(type, allInfo) {
      this.customRuleVisible = true
      this.changeType = type
      this.attrList = this.materialOptions
      this.editList = allInfo
    },
    /**
     * 更新物料款号规则
     */
    updateMaterialBeseemList(changeType, upList, options, attrType = 0) {
      const ruleInfo = this.prdRuleList.find(i => changeType == i.modelType)
      const params = {
        commonRuleId: ruleInfo.id, //规则id（第一次新增是没值的，编辑才有值）
        ruleName: '', //规则名称
        attrType: attrType, //0：适用全部属性，非0适应对应属性的attrType
        commonGenerateAttrRuleDTOs: upList.commonGenerateAttrRuleDTOs,
        id: upList.id,
        applyAttrs: []
      }
      // 适用属性-适用选项
      if (options) {
        options.forEach(item => {
          params.applyAttrs.push({
            id: item.id,
            name: item.name
          })
          params.ruleName += item.name + '、'
        })
      }
      this.isloading = true
      this.materialDialog = true
      ruleUpdate(params).then(res => {
        this.isloading = false
        this.materialDialog = false
        if (res.data.code == 0) {
          this.customRuleVisible = false
          this.$message.success(res.data.msg);
          this.getRuleList();
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    /**
     * 物料款号编号规则-选择适用属性
     */
    materialChangeAtts(selectInfo) {
      // console.log('适用属性', selectInfo)
      this.selectBeseemDialog = true
      this.selectBeseemList = this.materialOptions
      this.selectBeseemInfo = selectInfo
      // console.log(this.materialSelectTypeInfo)
      if (this.materialSelectTypeInfo) {
        this.selectBeseemInfo = this.materialSelectTypeInfo
      }

    },
    /**
     * 物料款号适用属性更新
     */
    selectBeseemTypeChange(selectInfo) {
      // console.log('适用属性更新',selectInfo)
      const params = {
        bossUnitId: this.bossUnitId,
        modelType: 6 //1-设计款号、2-商品款号、3-生产订单、4-生产工单、5-订单预下单、6-物料款号
      }
      autoNumberDeleteBeseem(params).then(res => {
        this.selectBeseemDialog = false
        if (res.data.code === 0) {
          this.materialSelectTypeInfo = selectInfo
          if(!selectInfo.attrType){
            this.materialSelectTypeInfo.attrType = selectInfo.id
            this.materialSelectTypeInfo.id = null
          }
          // console.log('已选物料款号', selectInfo)
          this.getRuleList()
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    /**
     * 添加子选项规则
     */
    materialBeseemAdd(selectAttrs) {
      const params = {
        bossUnitId: this.bossUnitId
      }
      // console.log('添加子选项????')
      //businessId：”KIND”-物料分类,”SPEC”-规格，”gfdes654esgftds432e”-自定义属性的id
      const selectInfo = selectAttrs.attrType ? selectAttrs : this.materialSelectTypeInfo
      // console.log('子选项数据信息',selectInfo)
      switch (Number(selectInfo.attrType)) {
        case 24:
          params.businessId = 'KIND'
          break;
        case 26:
          params.businessId = 'SPEC'
          break
        case 31:
          params.businessId = 'SUPPLIER'
          break
        case 25:
          return this.materialGetColorOptionList()
        default:
          params.businessId = selectInfo.attrType
          break;
      }
      getMaterialOptionList(params).then(res => {
        if (res.data.code === 0) {
          this.materialIsEdit = false
          this.materialBeseemId = ''
          this.materialShowBeseemSelect = true
          // this.materialSelectData = res.data.data
          this.materialSelectData = this.materialFilterOptions(res.data.data || [])
          // 设置编码类型选项
          this.materialListArr = this.materialOptions
          this.materialBeseemTableList = []
          this.materialDialog = true
          this.materialSelectAttrs = []
          this.getRuleList()
        }
      })
    },
    /**
     * 物料适用属性-新增列表数据
     */
    handlerAddMaterialRules() {
      const params = {
        commonAttrFieldId: '',
        attrType: '',
        value: '',
        name: ''
      }
      // console.log('属性新增_____',params)
      this.materialBeseemTableList.push(params)
    },
    /**
     * 物料适用属性-删除列表数据
     */
    handlerDeleteMaterialRules(index) {
      this.materialBeseemTableList.splice(index, 1)
    },
    /**
     * 物料适用属性-自定义规则，新增
     */
    handlerUpdateMaterialRules(tableList, options) {
      // console.log('新增适应', this.materialSelectTypeInfo.attrType)
      if (this.materialIsEdit) {
        const upList = {
          commonGenerateAttrRuleDTOs: tableList,
          id: this.materialBeseemId
        }
        // console.log('编辑参数', upList)
        return this.updateMaterialBeseemList(6, upList, options, this.materialSelectTypeInfo.attrType || this.materialSelectTypeInfo.id)
      } else {
        const upList = {
          commonGenerateAttrRuleDTOs: tableList,
          id: ''
        }
        return this.addMaterialBeseemList(6, upList, options, this.materialSelectTypeInfo.attrType || this.materialSelectTypeInfo.id)
      }
    },
    /**
     * 新增物料款号规则
     */
    addMaterialBeseemList(changeType, upList, options, attrType = 0) {
      const ruleInfo = this.prdRuleList.find(i => changeType == i.modelType)
      const params = {
        commonRuleId: ruleInfo.id, //规则id（第一次新增是没值的，编辑才有值）
        ruleName: '', //规则名称
        attrType: attrType, //0：适用全部属性，非0适应对应属性的attrType
        commonGenerateAttrRuleDTOs: upList.commonGenerateAttrRuleDTOs,
        id: upList.id,
        applyAttrs: [], //适用选项集合
      }
      // 适用属性-适用选项
      if (options) {
        options.forEach(item => {
          params.applyAttrs.push({
            id: item.id,
            name: item.name
          })
          params.ruleName += item.name + '、'
        })
      }
      this.isloading = true
      this.materialDialog = true
      ruleCreate(params).then(res => {
        this.isloading = false
        this.materialDialog = false
        if (res.data.code == 0) {
          this.customRuleVisible = false
          this.$message.success(res.data.msg);
          this.getRuleList();
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    /**
     * 物料款号 - 适用属性 - 自定义弹框
     */
    materialBeseemEdit(selectAttrs, selectInfo) {
      // console.log('选择的适用属性', selectAttrs)
      const params = {
        bossUnitId: this.bossUnitId
      }
      switch (Number(selectAttrs.attrType)) {
        case 24:
          params.businessId = 'KIND'
          break;
        case 26:
          params.businessId = 'SPEC'
          break
        case 31:
          params.businessId = 'SUPPLIER'
          break
        case 25:
          return this.materialGetColorOptionList(selectInfo)
        default:
          params.businessId = selectAttrs.attrType
          break;
      }
      getMaterialOptionList(params).then(res => {
        if (res.data.code === 0) {
          this.materialIsEdit = true
          this.materialBeseemId = selectInfo.id
          this.materialShowBeseemSelect = true
          this.materialSelectData = this.materialFilterOptions(res.data.data || [], selectInfo.applyAttrs)
          this.materialListArr = this.materialOptions
          // 设置列表数据
          this.materialBeseemTableList = selectInfo.commonGenerateAttrRuleDTOs || []
          // 设置适用选项值
          const selectAttrsList = []
          selectInfo.applyAttrs.forEach(item => {
            selectAttrsList.push(item.id)
          })
          this.materialSelectAttrs = selectAttrsList
          // 自定义规则弹窗
          this.materialDialog = true
        }
      })
    },
    /**
     * 物料获取颜色下拉项
     */
    materialGetColorOptionList(selectInfo) {
      let params = {
        userId: this.userId,
        type: "color"
      }
      getFacCommonSettings(params).then(res => {
        if (res.data.code === 0) {
          const colorList = res.data.data.color
          const materialColorList = []
          colorList.forEach(item => {
            materialColorList.push(...item.colorList)
          })
          this.materialShowBeseemSelect = true
          this.materialDialog = true
          this.materialListArr = this.materialOptions
          // 编辑
          if (selectInfo) {
            this.materialSelectData = this.materialFilterOptions(materialColorList, selectInfo.applyAttrs)
            this.materialIsEdit = true
            this.materialBeseemId = selectInfo.id
            // 设置列表数据
            this.materialBeseemTableList = selectInfo.commonGenerateAttrRuleDTOs || []
            // 设置适用选项值
            const selectAttrsList = []
            selectInfo.applyAttrs.forEach(item => {
              selectAttrsList.push(item.id)
            })
            this.materialSelectAttrs = selectAttrsList
          } else {
            // 新增
            this.materialIsEdit = false
            this.materialBeseemId = ''
            this.materialSelectData = this.materialFilterOptions(materialColorList)
            this.materialBeseemTableList = []
            this.materialSelectAttrs = []
            this.getRuleList()
          }

        }
      })
    },
    /**
     * 物料款号 - 适用属性 - 删除
     */
    materialBeseemDelete(item) {
      const params = {}
      params.id = item.id
      deleteRule(params).then(res => {
        if (res.data.code === 0) {
          const materialInfo = this.prdRuleList.filter(item => {
            return item.kind === 3
          })[0] || {}
          materialInfo.commonGenerateRuleDTOs = materialInfo.commonGenerateRuleDTOs || []
          const beseemList = materialInfo.commonGenerateRuleDTOs.filter(item => {
            return Number(item.attrType) !== 0
          })
          if (beseemList.length - 1 <= 0) {
            this.materialSelectTypeInfo = {}
          }
          this.getRuleList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    /**
     * 物料款号规则-过滤已选选项
     */
    materialFilterOptions(list = [], falseList) {
      // console.log('自定义选项', list)
      const materialList = this.prdRuleList.filter(item => {
        return item.kind === 3
      })[0]

      const beseemList = materialList.commonGenerateRuleDTOs.filter(item => {
        return Number(item.attrType) !== 0
      })

      if (beseemList.length > 0) {
        let selectOptions = []
        // 编辑时不过滤已选选项
        let falseIdList = []
        if (falseList) {
          falseList.forEach(item => {
            falseIdList.push(item.id)
          })
        }
        beseemList.forEach(item => {
          item.applyAttrs.forEach(info => {
            if (!falseIdList.includes(info.id)) {
              selectOptions.push(info.id)
            }
          })
        })
        selectOptions = [...new Set(selectOptions)]

        const selectList = list.filter(item => {
          return !(selectOptions.includes(item.id))
        })
        // console.log('过滤后选项', selectList)
        return selectList
      }
      return list
    }
  },
  async mounted() {
    // 获取自定义规则弹框全部适用属性
    await this.getAttrOptions(1);
    await this.getAttrOptions(2);
    await this.getAttrOptions(3);
    await this.getAttrOptions(4);
    // 获取单号编码规则，物料编码规则信息
    this.getRuleList().then(() => {
      // 物料款号没有配置任何规则时，需回退到手动填写
      const materialList = this.prdRuleList.filter(item => {
        return item.kind === 3
      })[0] || {}
      if (materialList.commonGenerateRuleDTOs&&materialList.commonGenerateRuleDTOs.length <= 0) {
        this.changeRule(materialList.id, false).then(() => {
          this.getRuleList()
        })
      }
    })
    this.$nextTick(() => {
      // 获取初始化款号编号设置
      this.getListByUserId();
      // 获取初始化款号设置适用属性子列表
      this.getBeseemChild();
    });
  },
}
</script>

<style lang="scss" scoped>
.auto-number {
  header {
    font-size: 16px;
    color: #3B3B3B;
    margin-bottom: 20px;
  }

  .auto-number-content {
    position: relative;

    .common-block {
      padding: 25px;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 2px;

      .content_wrap--head {
        font-size: 14px;
      }

    }

    .rule-wrap {
      background: #F7F9FC;
      border: 1px solid #DFE6EC;
      margin-left: 12px;
      padding: 12px;
      margin-bottom: 10px;

      .rule-title {
        margin-bottom: 10px;
        font-weight: bold;
        font-size: 12px;
      }

      .rule-main {
        font-size: 12px;

        .rule-diy {
          margin-left: 120px;

          .rule-item {
            margin: 10px 0;

            .rule-all-attrs {
              margin-bottom: 5px;
              color: #FA4150;
            }

            &.rule-item-some {
              overflow: hidden;

              .some-f-l {
                float: left;

                &.right-content {
                  margin-left: 15px;
                }
              }

              .some-title {
                margin-bottom: 10px;
              }

              .some-list {
                li {
                  margin-top: 10px;
                }

                .some-tag {
                  margin-left: 0;
                  margin-right: 10px;
                }
              }
            }
          }

        }

        .rule-tag,
        .order-rule {
          display: inline-block;
          padding: 2px 5px;
          margin: 0 10px;
          border: 1px solid #DFE6EC;
          background-color: #EBEFF5;
        }

        .some-title-text {
          margin-right: 10px;
        }

        .handle-btns {
          margin-right: 10px;
          text-decoration: underline;
          cursor: pointer;

          &.edit-btn {
            color: #1CA1FF;
          }

          &.del-btn {
            color: #FA4150;
          }

          &.add-btn {
            display: inline-block;
            margin-top: 10px;
            color: #FFA914;
          }
        }
      }
    }
  }

  .select-attr {
    .el-dialog--tiny {
      width: 500px;

      .el-dialog__header {
        text-align: center;
      }

      .select-attr-content {
        padding: 30px 0;
        text-align: center;
        border-top: 1px solid #DFE6EC;
        border-bottom: 1px solid #DFE6EC;
      }
    }
  }
}
</style><style lang="scss">
.auto-number {
  .auto-number-content {
    .common-block {
      .content_wrap--head {
        font-size: 14px;
      }
    }

    .el-radio__label {
      font-size: 12px;
    }
  }

  .select-attr {
    .el-dialog--tiny {
      width: 500px;

      .el-dialog__header {
        text-align: center;
      }

      .el-dialog__body {
        padding: 15px 0;
      }
    }
  }
}
</style>
