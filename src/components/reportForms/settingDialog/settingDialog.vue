<template>
  <div>
      <div class="dialog-wrap">
          <div class="dialog-title">
              货品生产进度报表-配置
          </div>
          <div class="dialog-main">
              <div class="main-item-wrap">
                  <span class="name-title">自定义报表名称</span>
                  <el-input placeholder="默认名称为“货品生产进度报表”" class="name-input" v-model="formName"></el-input>
              </div>
              <div class="main-item-wrap">
                  <div class="item-title">
                    <span class="left-title">列数据：工序节点</span>
                    <span class="right-title">拖动标签可调整排序</span>
                  </div>
                  <div class="item-group">
                        <div class="flex">
                            <draggable v-model="nodeObjList" class="flex" :move='changeNodeItemArr'>
                            <div v-for="(item,index) of nodeObjList" class="item-div">
                                <item-base :close='true' @close='delNodeItem(index)'>{{item.name}}</item-base>
                            </div>
                        </draggable>
                        <div class="item item-div" @click="setBePassArr(1)">
                            + 添加
                        </div>
                        </div>
                  </div>
              </div>
              <div class="main-item-wrap">
                  <div class="item-title">
                    <span class="left-title">行数据：货品属性</span>
                  </div>
                  <div class="item-group">
                      <div class="radio-wrap">
                          <el-radio label="0" v-model="linkType">
                              按货品统计
                          </el-radio>
                      </div>
                      <div class="radio-wrap">
                          <el-radio label="1" v-model="linkType" >按货品属性统计</el-radio>
                      </div>
                  </div>
                  <div class="item-group" v-show="linkType=='1'" id="selector">
                        <el-select v-model="goodsType" placeholder="请选择货品属性" @change="changeAttrType">
                            <el-option label="设计师" value="designer">
                            </el-option>
                            <el-option label="波段" value="wave">
                            </el-option>
                            <el-option label="分类" value="kind">
                            </el-option>
                            <el-option label="季节" value="season">
                            </el-option>
                            <el-option label="年份" value="year">
                            </el-option>
                            <el-option label="标签" value="tag">
                            </el-option>
                            <el-option label="品牌" value="brand">
                            </el-option>
                        </el-select>
                  </div>
                  <div class="item-group" v-if="linkType=='1'">
                       <div class="flex">
                            <draggable v-model="unitInfoObjList" class="flex" :move='changeAttrItemArr'>
                            <div v-for="(item,index) of unitInfoObjList" class="item-div">
                                <item-base :close='true' @close='delAttrItem(index)'>{{item.name}}</item-base>
                            </div>
                        </draggable>
                        <div class="item item-div" @click="setBePassArr(2)">
                            + 添加
                        </div>
                       </div>
                  </div>
              </div>
          </div>
          <div class="dialog-footer-1">
              <div class="btn-group">
                    <nf-button width='130' @click="passData">取消</nf-button>
                    <nf-button width='130' type='warning' @click="submitData">确定</nf-button>
              </div>
          </div>
      </div>
      <checkbox-search v-if="isNodeDialogShow" @passData='listenNodeData' :arr='bePassArr'  :checkArr='nodeIdList'>
      </checkbox-search>
      <checkbox-search v-if="isAttrDialogShow" @passData='listenAttrData' :arr='bePassArr'  :checkArr='attrs'>
      </checkbox-search>
      <div class="mask" @click="passData"></div>
  </div>
</template>
<script>
import checkboxSearch from './checkboxSearch';
import itemBase from '../../Common/item-base';
import { getEasyTaskNodeList, getFacUnitSettings } from '../../../api/api';
import draggable from 'vuedraggable';
export default {
    props: ['formObj'],
    data() {
        return {
            isNodeDialogShow: false,
            isAttrDialogShow: false,
            // 全部节点的列表
            nodeList: [],
            // 传递至子组件的列表
            bePassArr: [],
            // 选择的节点的id集合
            nodeIdList: [],
            // 已选择的节点对象列表
            nodeObjList: [],
            // 0按货品统计 1按货品属性统计
            linkType: '0',
            // 选择的货品属性的id集合
            attrs: [],
            // 货品属性
            goodsType: '',
            // 全部货品属性的列表
            allUnitInfoList: [],
            // 存储根据下拉框选择变化的货品属性列表
            unitInfoObjList: [],
            formName: '',
            formId: ''
        };
    },
    methods: {
        listenNodeData(val) {
            if (val) {
                this.nodeIdList = val;
                this.nodeObjList = [];
                this.nodeList.forEach(item => {
                    this.nodeIdList.forEach(elm => {
                        if (item.id == elm) {
                            this.nodeObjList.push(item);
                        }
                    });
                });
            }
            this.isNodeDialogShow = false;
        },
        listenAttrData(val) {
            if (val) {
                this.attrs = val;
                this.unitInfoObjList = [];
                console.log(this.attrs);
                this.allUnitInfoList.forEach(item => {
                    this.attrs.forEach(elm => {
                        if (item.id == elm) {
                            this.unitInfoObjList.push(item);
                        }
                    });
                });
            }
            this.isAttrDialogShow = false;
        },
        // 获取节点列表
        getNodeList() {
            let params = {
                facId: JSON.parse(sessionStorage.getItem('last_login')).id
            };
            return getEasyTaskNodeList(params)
                .then(res => {
                    // 存储全部节点数据到本地
                    this.nodeList = res.data.data.taskNodes;
                    // 默认显示全部节点数据
                    this.nodeObjList = [...res.data.data.taskNodes];
                    this.nodeList.forEach(item => {
                        this.nodeIdList.push(item.id)
                    })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 设置传递去子组件的数组
        setBePassArr(type) {
            this.bePassArr = [];
            if (type == 1) {
                if (this.jundgeDialogStatus() == 'edit') {
                    let params = {
                        facId: JSON.parse(sessionStorage.getItem('last_login')).id
                    }
                    getEasyTaskNodeList(params).then(res => {
                        this.isNodeDialogShow = true;
                        this.nodeList = res.data.data.taskNodes;
                        this.bePassArr = this.nodeList;
                    }).catch(err => {
                        console.log(err)
                    })
                }
                this.isNodeDialogShow = true;
                this.bePassArr = this.nodeList;
            } else {
                this.isAttrDialogShow = true;
                if (this.goodsType != '') {
                    let params = {
                        facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                        type: this.goodsType == '' ? 'all' : this.goodsType,
                        token: ''
                    };
                    return getFacUnitSettings(params)
                        .then(res => {
                            let obj = res.data.data;
                            delete obj.bossUnitId;
                            delete obj.facId;
                            delete obj.color;
                            delete obj.size;
                            delete obj.length;
                            this.formatUnitInfo(obj);
                            this.bePassArr = this.allUnitInfoList;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }
        },
        // 删除单个已选择节点
        delNodeItem(index) {
            console.log(index);
            this.nodeIdList.splice(index, 1);
            console.log(this.nodeIdList);
            this.nodeObjList.splice(index, 1);
        },
        delAttrItem(index) {
            this.attrs.splice(index, 1);
            this.unitInfoObjList.splice(index, 1);
        },
        // 获取组织层信息
        getUnitInfo(_type) {
            let params = {
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                type: this.goodsType == '' ? 'all' : this.goodsType,
                token: ''
            };
            return getFacUnitSettings(params)
                .then(res => {
                    let obj = res.data.data;
                    delete obj.bossUnitId;
                    delete obj.facId;
                    delete obj.color;
                    delete obj.size;
                    delete obj.length;
                    this.formatUnitInfo(obj, _type);
                    // 格式化后调用方法使每次切换属性显示默认值
                    this.showPropDefaultVal();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 格式化组织层信息
        formatUnitInfo(target, _type) {
            this.allUnitInfoList = [];
            for (let i in target) {
                for (let j in target[i]) {
                    let obj = {
                        id: target[i][j].id,
                        name:
                            target[i][j].value && target[i][j].value != ''
                                ? target[i][j].value
                                : target[i][j].name
                    };
                    this.allUnitInfoList.push(obj);
                }
            }
        },
        // 传递数组到报表管理页面
        passData(val) {
            this.$emit('passData');
        },
        submitData() {
            if (
                (this.linkType == '1' && !this.attrs.length) ||
                (this.linkType == '1' && this.goodsType == '')
            ) {
                this.$message.error('货品属性不能为空');
            } else {
                this.listenNodeData(this.nodeIdList);
                let params = {
                    linkType: this.linkType,
                    type:
                        this.linkType == '0'
                            ? '0'
                            : this.goodsType == 'designer'
                                ? '2'
                                : this.goodsType == 'wave'
                                    ? '3'
                                    : this.goodsType == 'kind'
                                        ? '4'
                                        : this.goodsType == 'season'
                                            ? '5'
                                            : this.goodsType == 'year'
                                                ? '6'
                                                : this.goodsType == 'tag'
                                                    ? '7'
                                                    : this.goodsType == 'brand' ? '8' : '',
                    formName: this.formName,
                    nodes: this.nodeIdList,
                    attrs: this.attrs,
                    formId: this.formId
                };
                this.$emit('passData', params);
            }
        },
        // 合并编辑时传入的对象信息至本组件
        mergeObjInfo() {
            switch (this.formObj.type) {
                case 2: {
                    this.goodsType = 'designer';
                    break;
                }
                case 3: {
                    this.goodsType = 'wave';
                    break;
                }
                case 4: {
                    this.goodsType = 'kind';
                    break;
                }
                case 5: {
                    this.goodsType = 'season';
                    break;
                }
                case 6: {
                    this.goodsType = 'year';
                    break;
                }
                case 7: {
                    this.goodsType = 'tag';
                    break;
                }
                case 8: {
                    this.goodsType = 'brand';
                    break;
                }
            }
            this.formName = this.formObj.formsName;
            this.formObj.factoryFormsGpconfigGattrs.forEach(item => {
                this.attrs.push(item.attrId);
                let obj = {
                    id: item.attrId,
                    name: item.attrName
                };
                this.unitInfoObjList.push(obj);
            });
            this.formObj.factoryFormsGpconfigNodes.forEach(item => {
                this.nodeIdList.push(item.nodeId);
                let obj = {
                    id: item.nodeId,
                    name: item.nodeName
                };
                this.nodeObjList.push(obj);
            });
            this.linkType = this.formObj.linkType.toString();
            this.formId = this.formObj.formId;
        },
        // 切换货品属性统计事件
        changeAttrType(val) {
            this.unitInfoObjList = [];
            this.attrs = [];
            this.allUnitInfoList = [];
            this.getUnitInfo();
        },
        // 根据拖拽更换数组顺序
        changeNodeItemArr(evt) {
            let draggedItem = this.nodeIdList[evt.draggedContext.index];
            let raplaceItem = this.nodeIdList[evt.relatedContext.index];
            this.nodeIdList[evt.relatedContext.index] = draggedItem;
            this.nodeIdList[evt.draggedContext.index] = raplaceItem;
        },
        changeAttrItemArr(evt) {
            console.log(evt);
            let draggedItem = this.attrs[evt.draggedContext.index];
            let raplaceItem = this.attrs[evt.relatedContext.index];
            this.attrs[evt.relatedContext.index] = draggedItem;
            this.attrs[evt.draggedContext.index] = raplaceItem;
        },
        // 显示货品属性默认值
        showPropDefaultVal() {
            if (this.goodsType != '') {
                this.unitInfoObjList = [...this.allUnitInfoList];
                // 将默认值的ID传入将用于传递给后台创建报表的货品属性数组
                this.unitInfoObjList.forEach(item => {
                    this.attrs.push(item.id)
                })
            }
        },
        // 判断本组件是编辑状态还是新建状态
        jundgeDialogStatus() {
            if (JSON.stringify(this.formObj) != '{}') {
                return 'edit'
            } else {
                return 'create'
            }
        }
    },
    created() {
        if (this.jundgeDialogStatus() == 'edit') {
            this.mergeObjInfo();
        } else {
            Promise.all([this.getNodeList(), this.getUnitInfo()])
        }

    },
    computed: {},
    components: {
        checkboxSearch,
        itemBase,
        draggable
    }
};
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 300;
    background: rgba(0, 0, 0, 0.5);
}
.dialog-wrap {
    width: 936px;
    height: 471px;
    border-radius: 2px;
    background-color: #ffffff;
    box-shadow: 0 26px 12px -15px rgba(0, 0, 0, 0.25);
    position: fixed;
    left: 55%;
    top: 50%;
    z-index: 301;
    transform: translate(-50%, -50%);
    padding: 19px 32px;
    overflow-y: scroll;
    .dialog-main {
        padding-left: 32px;
        padding-top: 32px;
    }
}
.main-item-wrap {
    margin-bottom: 33px;
    .name-title {
        font-size: 14px;
        color: #3b3b3b;
    }
    .name-input {
        width: 250px;
        height: 36px;
    }
    .item-title {
        .left-title {
            font-size: 16px;
            margin-right: 32px;
            color: #3b3b3b;
            &::before {
                content: '';
                width: 5px;
                height: 16px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 8px;
                background-color: #ffa914;
            }
        }
        .right-title {
            font-size: 14px;
            color: #a2abb8;
        }
    }
    .item-group {
        margin-top: 16px;
        display: flex;
        .item-div {
            margin-right: 8px;
            margin-bottom: 8px;
        }
        .item {
            width: 82px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #808080;
            border-radius: 2px;
            background-color: #fafafa;
            border: solid 1px #dce0e6;
            cursor: pointer;
        }
        .radio-wrap {
            margin-right: 32px;
        }
    }
}
.flex {
    display: flex;
    flex-wrap: wrap;
}
.dialog-footer-1 {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 24px;
}
</style>
