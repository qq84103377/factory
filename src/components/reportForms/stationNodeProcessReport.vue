<template>
<div id="node-staffs">
    <!--头部begin-->
    <page-title title="工位-节点进度报表" bg>
        <div class="report-wrap">
            <nf-button class="go-back" @click="goBackClick">返回上级</nf-button>
        </div>
    </page-title>
    <!--头部end-->
<header class="filter-bar">
    <div class="filter-row">
        <div class="filter-item-wrap">
            <div class="filter-title">上报时间</div>
            <div class="filter-item">
                <el-date-picker v-model="filterParams.dateRange" align="right" 
                type="datetimerange" placeholder="请选择时间范围" 
                :picker-options="pickerOptions2" 
                style="width:100%;">
                </el-date-picker>
            </div>
        </div>
        <div class="filter-item-wrap" style="justify-content:center;">
            <div class="filter-title">选择工位</div>
            <div class="filter-item">
                <station-selector v-model="workIdArr"></station-selector>
            </div>
        </div>
        <div class="filter-item-wrap" style="justify-content:flex-end;">
            <div class="filter-title">工序节点</div>
            <div class="filter-item">
                <el-select v-model="filterParams.nodeIds" filterable @change="goodsGet" multiple placeholder="全部" :multiple-limit="12" style="width:100%">
                    <template>
                        <el-option style="cursor:pointer;" :value="''" :label="'全部'">
                        </el-option>
                    </template>
                    <el-option v-for="(item,index) in nodeList" :key="index" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>                
            </div>
        </div>
    </div>
    <div class="filter-row">
        <div class="filter-item-wrap">
            <div class="filter-title">货品款号</div>
            <div class="filter-item">
                <el-input placeholder="请输入货品款号号搜索" v-model="filterParams.styleNo"></el-input>
            </div>
        </div>
        <div class="filter-item-wrap" style="justify-content:center;">
            <div class="filter-title">工单搜索</div>
            <div class="filter-item">
                <el-input placeholder="请输入工单号搜索" v-model="filterParams.orderNo"></el-input>
            </div>
        </div>
        <div class="filter-item-wrap" style="justify-content:flex-end;">
            <nf-button type="filter" style="margin-right:12px;" width='72' fsize='14' @click="selects">筛选</nf-button>
            <nf-button width="98" @click="excelDownLoad">导出报表</nf-button>
        </div>
    </div> 
</header>
<section class="tab__select">
    <div @click="chargerData" :class="['tab__default-style',dataType===1?'tab__gray-style':'']">工位视图</div>
    <div @click="nodeData" :class="['tab__default-style',dataType===0?'tab__gray-style':'']">节点视图</div>
</section>
<div class="report__table-container">
    <template>
        <el-table v-if="dataType===0" :data="staffsData" border style="width: 100%;margin-bottom:24px;">
            <el-table-column  prop="nodeName" label="节点" align="center">
            </el-table-column>
            <el-table-column  prop="total" label="总上报数" align="center">
            </el-table-column>                        
            <el-table-column  label="工位" align="center">
                <template slot-scope="scope">
                    <div class="staff" :style="{'height':'40'*item.missions.length+'px'}" v-for="item in scope.row.staffs" :key="item.staffId">{{ item.staffName }}</div>
                </template>
            </el-table-column>                        
            <el-table-column  prop="styleNo" label="款号" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div 
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}" 
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.styleNo}}
                        </div>
                    </div>
                </template>                    
            </el-table-column>                        
            <el-table-column  prop="orderNo" label="工单号" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div 
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                             
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.orderNo}}
                        </div>
                    </div>
                </template>                    
            </el-table-column>   
            <el-table-column  prop="colorNo" label="工价(元/件)" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div 
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                                                         
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.labourCost}}
                        </div>
                    </div>
                </template>    
            </el-table-column>                          
            <el-table-column  prop="colorName" label="工单上报数" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                                                                                      
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.quantity}}
                        </div>
                    </div>
                </template>                        
            </el-table-column>                        
            <el-table-column  prop="sizeName" label="合格率" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                                                                                                                   
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            <span v-if="items.qualifiedRate!==''">{{items.qualifiedRate + '%'}}</span>
                        </div>
                    </div>
                </template>                                            
            </el-table-column>                        
            <el-table-column  prop="standardName" label="节点状态" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div 
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                                                                                                                                                                           
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.status | filterStatus}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>
            <el-table-column  prop="finishUserName" label="节点当前进度" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div 
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1}"                                                                                                                                               
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.completed}}/{{items.total}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>                
            <el-table-column  prop="finishDate" label="节点期限" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.staffs" :key="item.staffId">
                        <div
                        :class="{'boder-none':scope.row.staffs&&staffIndex==scope.row.staffs.length-1&&index==item.missions.length-1,
                        'red':items.delay}"                                                                                                                                                                            
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.dateEnd |filterEndTime}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>
        </el-table>
    </template>
    <template>
        <el-table v-if="dataType===1" :data="nodeDataLists" border style="width: 100%;margin-bottom:24px;">
            <el-table-column  prop="staffName" label="工位" align="center">
            </el-table-column>
            <el-table-column  prop="total" label="总上报数" align="center">
            </el-table-column>                        
            <el-table-column  label="节点" align="center">
                <template slot-scope="scope">
                    <div class="staff" :style="{'height':'40'*item.missions.length+'px'}" v-for="item in scope.row.nodes" :key="item.nodeId">{{ item.nodeName }}</div>
                </template>
            </el-table-column>                        
            <el-table-column  prop="styleNo" label="款号" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div 
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}" 
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.styleNo}}
                        </div>
                    </div>
                </template>                    
            </el-table-column>                        
            <el-table-column  prop="orderNo" label="工单号" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div 
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                             
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.orderNo}}
                        </div>
                    </div>
                </template>                    
            </el-table-column>   
            <el-table-column  prop="colorNo" label="工价(元/件)" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div 
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                                                         
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.labourCost}}
                        </div>
                    </div>
                </template>    
            </el-table-column>                          
            <el-table-column  prop="colorName" label="工单上报数" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                                                                                      
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.quantity}}
                        </div>
                    </div>
                </template>                        
            </el-table-column>                        
            <el-table-column  prop="sizeName" label="合格率" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                                                                                                                   
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            <span v-if="items.qualifiedRate!==''">{{items.qualifiedRate + '%'}}</span>
                        </div>
                    </div>
                </template>                                            
            </el-table-column>                        
            <el-table-column  prop="standardName" label="节点状态" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div 
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                                                                                                                                                                           
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.status | filterStatus}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>
            <el-table-column  prop="finishUserName" label="节点当前进度" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div 
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1}"                                                                                                                                               
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                            {{items.completed}}/{{items.total}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>                
            <el-table-column  prop="finishDate" label="节点期限" align="center">
                <template slot-scope="scope">
                    <div v-for="(item,staffIndex) in scope.row.nodes" :key="item.nodeId">
                        <div
                        :class="{'boder-none':scope.row.nodes&&staffIndex==scope.row.nodes.length-1&&index==item.missions.length-1,
                        'red':items.delay==true}"                                                                                                                                                                            
                        class="cell__row" v-for="(items,index) in item.missions" :key="items.missionId">
                             {{items.dateEnd |filterEndTime}}
                        </div>
                    </div>
                </template>                                                                
            </el-table-column>
        </el-table>
    </template>
    <div class="page">
        <el-pagination @current-change="nextPage" :current-page.sync="nowPage" :page-size="20" layout="total, prev, pager, next" :total="total">
        </el-pagination>
    </div>
</div>
</div>
</template>

<script>
import { getGoodsListByUnitIds,getAllNodeList,staffDataList,nodeDataList,excelStaff,excelNode } from '../../api/api';
import StationSelector from './stationSelector/stationSelector';
const fun  = require('../Common/commonFun.js')
export default {
    data() {
        return {
            // 筛选条件
            filterParams: {
                dateRange: [fun.dateFormatter(new Date(new Date().setDate(1)),true),
                    fun.dateFormatter(new Date(),true)
                ],
                goodsOrderId: [],
                nodeIds:[],
                styleNo: '',
                orderNo:'',
                // 时间控件快捷选项
            },
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
                },
            workIdArr:[],
            nodeList:[],
            goodsList:[],
            nowPage:1,
            missionIds:[],
            dataType:1,
            staffsData:[],
            nodeDataLists:[],
            fileData:"",
            total:""         
        }
    },
    components: {
        StationSelector,
    },
    filters:{
        filterStatus(val) {
            if(val == 0) {
                return "未开始"
            } 
            if(val == 1) {
                return "进行中"
            } 
            if(val == 2) {
                return "已完成"
            } 
        },
        filterEndTime(val) {
            if(val) {
                return val.slice(0, 11);
            }else {
                return "未设置"
            }
        }
    },
    //这个地方，后台的名字获取是写错的，node的是工位获取，staff的是节点，到下载导出的时候才更正过来了
    methods:{
        //返回上一层
        goBackClick() {
            this.$router.push("/reportManage");
        },
        selects() {
            if(this.dataType===1) {
                this.nodeDataList();            
            }else if(this.dataType==0) {
                this.staffDataList();          
            }
        },
        // 获取货品款号
        getGoodsList() {
            let params = {
                userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                facId: JSON.parse(sessionStorage.getItem('last_login')).id,
                keyword: '',
                unitIds: [JSON.parse(sessionStorage.getItem('last_login')).id]
            };
            return getGoodsListByUnitIds(params).then(res => {
                this.goodsList = res.data.goodsList;
            });
        },
        getAllNodeList() {
            let params = {
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
            };
            getAllNodeList(params).then(res => {
                this.nodeList = res.data.prcdNodes;
            });            
        },
        staffDataList() {
            if(fun.contains(this.filterParams.nodeIds,'')){
                this.filterParams.nodeIds = [];
            }
            if(this.filterParams.dateRange) {
                console.log(fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11));
                let a = fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11);
                if(a == '00:00:00') {
                    var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true).replace(a,'23:59:59');
                }else {
                        var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true);
                    }
            }
            let params = {
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                dateReportedStart: this.filterParams.dateRange&&this.filterParams.dateRange[0]!==null
                ?fun.dateFormatter(this.filterParams.dateRange[0],true):'',
                dateReportedEnd: this.filterParams.dateRange&&this.filterParams.dateRange[1]!==null
                ?dateEnd:'',
                chargerIds:this.workIdArr, 
                nodeIds:this.filterParams.nodeIds,
                styleNo:this.filterParams.styleNo,
                orderNo:this.filterParams.orderNo,
                pageNo:this.nowPage
            };
            staffDataList(params).then(res => {
                console.log(res);
                this.staffsData = res.data.nodes.list;
                this.total = res.data.nodes.totalCount;
            })
        },
        nodeDataList() {
            console.log(this.filterParams.dateRange,456,fun.contains(this.filterParams.nodeIds,''));
            if(fun.contains(this.filterParams.nodeIds,'')){
                this.filterParams.nodeIds = [];
            }
            if(this.filterParams.dateRange) {
                console.log(fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11));
                let a = fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11);
                if(a == '00:00:00') {
                    var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true).replace(a,'23:59:59');
                }else {
                    var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true);
                }
            }
            let params = {
                unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                dateReportedStart:this.filterParams.dateRange&&this.filterParams.dateRange[0]!==null
                ?fun.dateFormatter(this.filterParams.dateRange[0],true):'',
                dateReportedEnd: this.filterParams.dateRange&&this.filterParams.dateRange[1]!==null
                ?dateEnd:'',
                chargerIds:this.workIdArr, 
                nodeIds:this.filterParams.nodeIds,
                styleNo:this.filterParams.styleNo,
                orderNo:this.filterParams.orderNo,
                pageNo:this.nowPage                                    
            };
            nodeDataList(params).then(res => {
                console.log(res);
                this.nodeDataLists = res.data.staffs.list;
                this.total = res.data.staffs.totalCount;                
            })
        },
        nodeData() {
            this.dataType = 0;
            this.staffDataList();          
        },
        chargerData() {
            this.dataType = 1;
            this.nodeDataList();            
        },
        excelDownLoad() {
            if(fun.contains(this.filterParams.nodeIds,'')){
                this.filterParams.nodeIds = [];
            }
            if(this.dataType===0) {
                if(this.filterParams.dateRange) {
                    console.log(fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11));
                    let a = fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11);
                    if(a == '00:00:00') {
                        var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true).replace(a,'23:59:59');
                    }else {
                        var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true);
                    }
                }
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    dateReportedStart: this.filterParams.dateRange?fun.dateFormatter(this.filterParams.dateRange[0],true):'',
                    dateReportedEnd: this.filterParams.dateRange?dateEnd:'',
                    chargerIds:this.workIdArr, 
                    nodeIds:this.filterParams.nodeIds,
                    styleNo:this.filterParams.styleNo,
                    orderNo:this.filterParams.orderNo            
                };
                excelStaff(params).then(res => {
                    console.log(res);
                    this.fileData =res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','节点-工位上报数量统计报表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            }else if(this.dataType===1){
                if(this.filterParams.dateRange) {
                    console.log(fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11));
                    let a = fun.dateFormatter(this.filterParams.dateRange[1],true).slice(11);
                    if(a == '00:00:00') {
                        var dateEnd = fun.dateFormatter(this.filterParams.dateRange[1],true).replace(a,'23:59:59');
                    }
                }
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                    dateReportedStart:this.filterParams.dateRange?fun.dateFormatter(this.filterParams.dateRange[0],true):'',
                    dateReportedEnd: this.filterParams.dateRange?dateEnd:'',
                    chargerIds:this.workIdArr, 
                    nodeIds:this.filterParams.nodeIds,
                    styleNo:this.filterParams.styleNo,
                    orderNo:this.filterParams.orderNo            
                };
                excelNode(params).then(res => {
                    console.log(res);
                    this.fileData =res.data;
                    //在这里利用则可以直接的生成作为下载用的url，但是在其他代码环境下，可能需要new一个Blob对象，例如
                    //var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    let url = window.URL.createObjectURL(res.data);
                    console.log(url);
                    let a = window.document.createElement('a');
                    a.setAttribute('href',url);
                    a.setAttribute('download','工位-节点上报数量统计报表.xls');
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                })
            }
        },
        // 加载下一页
        nextPage(val) {
            this.nowPage = val;
            if(this.dataType===1) {
                this.nodeDataList();
            }else if(this.dataType==0) {
                this.staffDataList();
            }
        },
    },
    created() {
        this.getAllNodeList();
        this.getGoodsList();
        this.nodeDataList();
    }
}
</script>

<style lang="scss" scoped>
    #node-staffs{
        .filter-bar {
            padding: 24px 32px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
        }
        .filter-row {
            display: flex;
            margin-bottom: 16px;
            justify-content: space-between;
            width:100%;
            .filter-item-wrap {
                display: flex;
                align-items: center;
                width:33.3%;
                margin-right: 32px;
                .filter-title {
                    color: #3b3b3b;
                    margin-right: 12px;
                    font-size: 12px;
                }
                .filter-item {
                    width: 70%;
                }
            }
        }
        .space-between {
            justify-content: flex-end;
            flex: 1;
        }
        .tab__select{
            display:flex;
            justify-content: flex-start;
            margin: 16px 0;
            cursor: pointer;
            font-size: 12px;
            .tab__default-style {
                display:flex;
                justify-content: center;
                align-items: center;
                width:80px;
                height:32px;
                background-color: #fff;
                border: 1px solid #939FB8;
                color: #939FB8;
                &:last-child{
                    margin-left:-1px;
                }
            }
            .tab__gray-style{
                background-color: #939FB8;
                color: #fff;
            }
        }
        .report__table-container {
            background-color: #fff;
            padding-bottom:16px;
            .page {
                margin: 20px 0;
                text-align: right;
                margin-right: 32px;
            }
        }
        .cell__row {
            height: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            word-break: break-all;
            border-bottom: 1px solid #E6EAF0;
            box-sizing: border-box;
        }
        .staff {
            display:flex;
            flex-direction: column;
            justify-content: center;
            &:not(:last-child) {
                border-bottom: 1px solid #E6EAF0;
            }
        }
        .boder-none {
            border: none;
        }
        .red {
            color: red;
        }




    }

</style>
<style lang="scss">
    #node-staffs{
        .page_title--head {
            font-size: 16px;
            line-height: 32px;
        }
        .report-wrap {
            .nf-button{
                width: 72px;
                font-size: 12px !important;
            }
        }
        .el-table{
            td{
                .cell{
                    line-height: 18px;
                    padding: 0;
                    .cell__row {
                        .el-table td {
                            border-bottom: 1px solid rgb(223, 228, 236);
                        }
                    }
                }
            }
        }
        .el-input__inner{
            font-size: 12px;
        }
        .nf-button{
            font-size: 12px !important;
        }
        .dialog-wrap {
            .dialog-header{
                .input-title{
                    font-size: 12px;
                }
            }

        }
        .el-checkbox__label{
            font-size: 12px;
        }

    }





</style>

