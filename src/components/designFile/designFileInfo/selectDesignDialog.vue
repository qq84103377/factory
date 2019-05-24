<template>
  <div class="select-design-dialog">
    <el-dialog
      class="custom-dialog"
      title="提报-选择设计流程模板"
      :visible.sync="show"
      :modal-append-to-body="false"
      @close="selectClose"
      size="large">
      <el-form :model="process" status-icon :rules="rules" ref="process" label-width="100px" class="demo-ruleForm">
        <el-row type="flex">
          <el-form-item class="create-form__item" label="工序模板">
              <el-select
                  v-model="process.templateId"
                  :disabled="source==='missionIndex'"
                  placeholder="请选择工序模板" style="width:100%" @visible-change="visibleChange" @change="fetchTemplateList(process.templateId)">
                  <el-option
                      v-for="item in options.templateOptions"
                      :key="item.templateId"
                      :label="item.templateName"
                      :value="item.templateId">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item class="create-form__item" label="负责人" prop="leaderIds">
              <workerLeader
                      style="width: 240px;"
                      placeholder="请选择负责人"
                      :manListProps="options.groupOptions"
                      v-model="process.leaderIds">
              </workerLeader>
              <!--<v-user-select v-model="process.leaderIds" :options="options.groupOptions" @remote="fetchUnitUser" placeholder="请选择负责人"></v-user-select>-->
          </el-form-item>
        </el-row>
        <!-- 表格 -->
        <div class="table" id="flow-table" ref="flow-table">
            <div class="table-header" v-loading="tableLoading">
                <div class="table-tr">
                    <div
                        class="table-th"
                        v-for="(item, index) of tableHeaderConf"
                        :key="index"
                        :style="item.style || {}">
                        {{ item.label }}
                    </div>
                </div>
            </div>
            <draggable class="table-body" v-model="process.nodemsg" :move="checkMove" :options="{handle:'.draggable', forceFallback: false,}">
                <div class="table-tr"
                    v-for="(item, index) in process.nodemsg"
                    :key="index">
                    <div class="table-td">
                        <el-select v-model="item.nodeId" :disabled="source==='missionIndex'" filterable  placeholder="选择节点">
                            <el-option disabled>
                                <div class="option__btn--add" @click.stop="showAddNodeSlide(item)">+新建</div>
                            </el-option>
                            <el-option
                                v-for="$item of nodeOptions"
                                :key="$item.id"
                                :value="$item.id"
                                :label="$item.name"
                                >
                                <div class="nodeSelectLabel" @click="nodeChange($item,item)">{{$item.name}}</div>
                            </el-option>
                        </el-select>
                    </div>
                    <div class="table-td">
                        <workerLeader
                                placeholder="默认负责人"
                                :manListProps="options.groupOptions"
                                v-model="item.nodeUserIds" :id="index">
                        </workerLeader>
                        <!--<v-user-select-->
                            <!--v-model="item.nodeUserIds"-->
                            <!--:options="options.groupOptions"-->
                            <!--@remote="fetchUnitUser"-->
                            <!--placeholder="默认负责人" :id="index"></v-user-select>-->
                    </div>
                    <div class="table-td">
                        <charge-group-select v-model="item.nodeGroupId" :groupList="options.groupOptions"></charge-group-select>
                    </div>
                    <div class="table-td">
                        <workerLeader
                                :isDisabled="item.designPrcdNodeTypeId != 2 || source==='missionIndex'"
                                placeholder="评审人"
                                :manListProps="options.groupOptions"
                                v-model="item.nodeAuditingIds" :id="index">
                        </workerLeader>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" align="middle" type="flex">
                            <!-- <span>预计完成前</span>
                            <div class="table-input">
                                <input class="input-inner" v-model="item.daysAdvanced" type="number"  @input="handleAdvancedInput(item)" />
                            </div> -->
                            <el-date-picker
                              v-model="item.endAt"
                              type="date"
                              format="yyyy-MM-dd"
                              placeholder="选择日期">
                            </el-date-picker>
                        </el-row>
                    </div>
                    <div class="table-td">
                        <el-row class="input-wrapper" type="flex" align="middle">
                            <el-checkbox v-model="item.needDelayWarning"></el-checkbox>
                            <span v-show="item.needDelayWarning">结束前</span>
                            <div class="table-input" v-show="item.needDelayWarning">
                                <input class="input-inner" type="number" v-model="item.delayWarningNum" @input="handleWarningNumInput(item)" />
                            </div>
                        </el-row>
                    </div>
                    <div class="table-td" v-if="source !== 'missionIndex'">
                        <!--终审节点不能拖动和删除-->
                        <div class="handle">
                            <div class="draggable">
                                <icon-button class="btn" type="icon-liebiaocaozuo_tuodong">拖动</icon-button>
                            </div>
                            <div>
                                <icon-button class="btn" type="icon-liebiaocaozuo_shanchu" @click="handleDelete(index)">删除</icon-button>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>

            <div class="btn-wrapper" v-if="source !== 'missionIndex'">
                <el-button class="btn--add" type="text" @click="addListRow(null)">+添加节点</el-button>
            </div>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="selectClose">取 消</el-button>
          <el-button type="primary" @click="save" :loading="loading">确 定</el-button>
      </span>
      </el-dialog>
      <div class="node-design-slide" v-if="visible.slideShow">
        <div class="slide-wrapper">
          <node-design-create
            is-component
            @on-cancel="visible.slideShow = false"
            @on-success="handleAddNodeSuccess"></node-design-create>
        </div>
      </div>
  </div>
</template>
<script>
import { getUnitUser} from "../../../api/api";
import { getDesignTemplateList, getDesignNodeList, getDesignTemplateDetail} from '@/api/sample-centre';
import draggable from 'vuedraggable';
import NodeDesignCreate from '../../sampleCentre/design/node-design-create';
import chargeGroupSelect from '@/components/Common/custom-select/chargeGroupSelect'

const fun  = require('../../Common/commonFun.js')
export default {
    /*
    source=missionIndex是设计工单使用该组件的特定标识
    missionDisabled:设计工单已完成的状态
     */
  props: ['show', 'loading', 'formData','source','missionDisabled'],
  data () {
    return {
        visibleChangeStatus:false,
        tableLoading:false,
      rules: {
        leaderIds: [
            { type: 'array', required: true, message: '请选择负责人' }
        ]
      },
      options: {
        templateOptions: [], // 工序模板
        groupOptions: []
      },
      process: {
        templateId: '',
        leaderIds: [],
        nodemsg:[]
      },
      processBackups: {
        templateId: '',
        leaderIds: [],
        nodemsg:[]
      },
      rowData: {
        nodeId: '',
        nodeUserIds: [],
        daysAdvanced: 0,
        endAt: null,
        needDelayWarning: false,
        delayWarningNum: ''
      },
      visible: {
        dialogVisible: false,
        btnLoading: false,
        slideShow: false,
        loading: false
      },
      addNodeItem: {}, // 点击添加新节点的数据
      designPrcdNodeTypeId: '',
      tableHeaderConf: [
        {
          label: '节点名称'
        },
        {
          label: '默认负责人'
        },
        {
          label: '默认负责组'
        },
        {
          label: '评审人'
        },
        {
          label: '计划完成日期'
        },
        {
          label: '预警提醒 (天)'
        },
        {
          label: '操作',
          style: {
            width: '150px'
          }
        }
      ]
    }
  },
  components: {
    NodeDesignCreate,
    chargeGroupSelect,
    draggable
  },
  computed: {
    unitId() {
        return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    }
  },
  watch: {
    formData (v) {
      this.process = {
        templateId: v.templateId || '',
        leaderIds: v.leadersIds || [],
        nodemsg: v.nodes&&v.nodes.length ? [...v.nodes] : []
      }
    },
    show (v) {
        if (v) {
            this.addFinalRow()
        }
    },
  },
  methods: {
      nodeChange($item,item){
          this.$set(item,'designPrcdNodeTypeId',$item.designPrcdNodeTypeId)
          this.$set(item,'nodeAuditingIds',[])
      },
      // 获取工序模板详情
    fetchTemplateDetail(id) {
        if(this.formData&&this.source==='missionIndex'&&!this.visibleChangeStatus) return;
      if(id) {
          this.tableLoading = true
        getDesignTemplateDetail({ templateId: id })
        .then(res => {
            this.tableLoading = false
            this.process.nodemsg = res.data.data.nodes.map(item => {
              return {
                nodeId: item.designPrcdNodeId,
                designPrcdNodeTypeId: item.templateNodeTypeId,
                nodeUserIds: this.getUserIds(item.chargers, 'id'),
                nodeAuditingIds: this.getUserIds(item.reviewers, 'id'),
                nodeGroupId: item.group?item.group.groupId:'',
                daysAdvanced: item.dafd,
                needDelayWarning: item.needDelayWarning,
                delayWarningNum: item.delayWarningNum,
                finalNode: item.finalNode
              }
          });
        });
      }
    },
    getUserIds(arr, prop) {
      return arr.map(item => item[prop]);
    },
    async handleAddNodeSuccess(id) {
      const data = await this.fetchNodeList();
      this.addNodeItem.nodeId = id;
      this.$nextTick(() => {
          this.visible.slideShow = false;
      });
    },
    // 新建节点
    showAddNodeSlide(item) {
      this.addNodeItem = item;
      this.visible.slideShow = true;
    },
    // 获取节点列表
    fetchNodeList() {
        const params = {
            unitId: this.unitId
        }
        getDesignNodeList(params)
        .then(res => {
            const { data } = res.data;
            this.nodeOptions = data;
        });
    },
    nodeSelectDisable(id) {
        if(!this.nodeOptions || !this.nodeOptions.length) return;
      return this.nodeOptions.some(item => {
          // return this.nodemsg.some(listItem => {
        return (item.id === id && item.designPrcdNodeTypeId == 5) || this.source === 'missionIndex';
          // });
      });
    },
    // 默认增加一行终审节点
    addFinalRow() {
      const finalNode = this.nodeOptions.find(item => item.designPrcdNodeTypeId == '5');
      this.designPrcdNodeTypeId = finalNode.id;
      if(this.process.nodemsg.length == 0) {
        this.addListRow(finalNode.id);
      }

    },
    // 添加一行
    addListRow(id) {
      const cloneRow = JSON.parse(JSON.stringify(this.rowData));
      cloneRow.nodeId = id ? id : cloneRow.nodeId;
      console.log(this.process.nodemsg,'this.process.nodemsg')
      const index = this.process.nodemsg.length ? this.process.nodemsg.length - 1 : 0;
      const arr = this.process.nodemsg.slice();
      //终审节点标识
      if(id){
          cloneRow.finalNode = true;
      }else{
          cloneRow.finalNode = false;
      }
      this.process.nodemsg.splice(index, 0, cloneRow);
    },
    // 移除一行
    handleDelete(index) {
      this.process.nodemsg.splice(index, 1);
    },
    getManId(val) {
      this.process.leaderIds= val;
    },
    // 排序
    checkMove(evt, originalEvent) {
      const lastIndex  = evt.draggedContext.futureIndex;
      const id = this.process.nodemsg[lastIndex].nodeId;
      if (!id) return;
      const finalNode = this.nodeOptions.find(item => id === item.id);
      if (finalNode.designPrcdNodeTypeId == '5') {
          // 取消排序
        return false;
      }
    },
    // 结束前判断
    handleWarningNumInput(item) {
      item.delayWarningNum = item.delayWarningNum.replace(/-/g, '');
    },
    // 新建工序弹窗取消
    selectClose () {
      this.process = JSON.parse(JSON.stringify(this.processBackups))
      this.$emit('update:show', false)
      this.$emit('update:loading', false)
    },
    // 获取默认负责人下拉列表
    fetchUnitUser(keyword = '') {
        getUnitUser({
            unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
            keyword
        }).then(res => {
            this.$nextTick(() => {
                this.options.groupOptions = res.data.data.facGroupDTOS;
                console.log(this.options.groupOptions,'999')
            })
        });
    },
      visibleChange(val){
        if(val){
            this.visibleChangeStatus = true
        }
      },
    //   选择工序模板的时候默认选中负责人
    fetchTemplateList(id) {
        getDesignTemplateList({ unitId: this.unitId })
        .then(res => {
            this.options.templateOptions = res.data.data;
            this.options.templateOptions.forEach(i => {
              if(id == i.templateId) {
                  if(this.formData&&this.source==='missionIndex' &&!this.visibleChangeStatus) return;
                  let arr= []
                  i.chargers.forEach(item=>{
                      arr.push(item.id)
                  })
                  this.process.leaderIds = arr
              }
            })
            this.fetchTemplateDetail(id)
        });
    },
    save () {
      if(this.process.templateId == '') {
        return this.$message.error('请选择工序模板')
      }
      if(this.process.leaderIds.length == 0) {
        return this.$message.error('负责人不能为空')
      }
      this.process.nodemsg.forEach(i => {
        if (i.endAt) {
          i.endAt = fun.dateFormatter(i.endAt,false)
        }
      })
      // this.process.nodemsg
      if(this.formData&&this.source==='missionIndex'){
          this.$emit('save', this.process)
          return
      }
      console.log(this.process,'this.process')
      this.$emit('save', 1, this.process)
        this.process = JSON.parse(JSON.stringify(this.processBackups))
    }
  },
  async created () {
      // 设计工单点击编辑节点时，不显示操作栏
      if(this.source === 'missionIndex'){
          this.tableHeaderConf.pop();
      }
    await this.fetchUnitUser()
    await this.fetchNodeList()
    // this.addFinalRow()
    await this.fetchTemplateList()
  }
}
</script>
<style lang="scss">
    .select-design-dialog{
        .el-dialog--tiny{
            width: 50%;
        }
        .design-select{
            width:100% !important;
        }
        #flow-table {
            .table-body input {
                height: 30px;
                font-size: 12px;
                border: none
            }
            .el-checkbox__inner {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                &::after {
                    border-width: 1px;
                    height: 8px;
                    left: 4px;
                    top: 0
                }
            }
            .edit-dialog {
                .el-dialog__body {
                    position: relative;
                }
            }
        }
    }

</style>
<style lang="scss" scoped>
.table {
        $--border-color: #e6e8eb;
        box-sizing: border-box;
        display: table;
        table-layout: fixed;
        width: 100%;
        margin-top: 12px;
        font-size: 12px;
        color: #808080;
        border: 1px solid $--border-color;
        .table-tr {
            display: table-row;
            box-sizing: border-box;
        }
        .table-td,
        .table-th {
            box-sizing: border-box;
            display: table-cell;
            vertical-align: middle;
            padding: 0 10px;
            border-bottom: 1px solid $--border-color;
            &:not(:last-child) {
                border-right: 1px solid $--border-color;
            }
        }
        .table-th {
            height: 28px;
            line-height: 28px;
            background: #F7F9FC;
        }
        .table-header {
            display: table-header-group;
        }
        .table-body {
            display: table-row-group;
            .table-td {
                padding: 2px 10px;
            }
        }
        .handle {
            display: flex;
            color: #929aa6;
            div {
                display: inline-block;
                cursor: pointer;
                margin: 0 8px;
            }
            .btn {
                font-size: 12px;
            }
        }
        .btn--add {
            margin-left: 10px;
            color: #FFA914;
            font-size: 12px;
        }
    }
    .input-wrapper {
        span {
            padding: 0 5px;
        }
        .table-input {
            flex: 1
        }
        .input-inner {
            width: 100%;
            box-sizing: border-box;
            height: 24px!important;
            vertical-align: middle;
            padding: 2px 5px;
            background: #F5F7FA;
            border-radius: 2px;
        }
    }
    .option__btn--add {
        color: #FF7F14;
        cursor: pointer;
        text-align: center;
    }
    .btn--submit {
        margin-left: 12px;
    }
    .edit-dialog-form {
        margin-top: 22px;
    }
    .edit-tip {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 12px;
        padding: 5px 16px;
        color: red;
        background: #F5F7FA
    }
    .node-design-slide {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2500;
        background: rgba(0, 0, 0, .4);
        .slide-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 60%;
            background: #fff;
            height: 100%;
            box-sizing: border-box;
            padding: 32px;
        }
    }
</style>



