<template>
  <div class="look-wym">
    <page-title :title="`本单已生成唯一码：${wymInfo.latheNumber} 个`">
      <nf-button @click="$router.go('-1')">返回上级</nf-button>
    </page-title>
    <div class="base-info-mission">
            <!--<div class="img">-->
                <!--<img src="../../../../static/images/girl.jpg" alt="">-->
            <!--</div>-->
            <div class="base-info-list">
                    <div class="second-info">
                        <div>
                            <span class="gray">货品款号</span>
                            <span>{{wymInfo.styleNo}}</span>
                        </div>
                        <div>
                            <span class="gray">货品名称</span>
                            <span>{{wymInfo.goodsName}}</span>
                        </div>
                        <div>
                            <span class="gray">工单号</span>
                            <span>{{wymInfo.orderNo}}</span>
                        </div>
                        <div>
                            <span class="gray">&emsp;客户</span>
                            <span>{{wymInfo.customerName}}</span>
                        </div>
                    </div>
                    <!--<div class="third-info">-->
                        <!---->
                    <!--</div>-->
            </div>
    </div>
    <div class="select-mission">
        <div class="select-mission-wym">
            <div class="bed-num">
                <span class="select-name">床次</span>
                <el-select v-model="bedNum" multiple placeholder="全部">
                    <el-option v-for="(item,index) in wymInfo.latheNames" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="bed-num">
                <span class="select-name">完成人员</span>
                <el-select v-model="man" multiple placeholder="全部">
                    <el-option v-for="item in options" :key="item.value" :label="item.userName" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div style="margin-right:20px;">
                <span class="select-name">完成日期</span>
                <el-date-picker @change="beginDate" v-model="endAt" type="daterange" align="right" unlink-panels range-separator="至"
                  placeholder="请选择日期范围"  start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                </el-date-picker>
            </div>
        </div>
        <div>
            <nf-button style="background:#54d1bc;width:72px;color:#fff;" @click="getwyMList">筛选</nf-button>
        </div>
    </div>
    <div class="wym-download">
            <div class="icon-tip" v-popover:popover1>
                <icon type="icon-tongyong-tishi" size="15" style="width:15px;height:15px;"></icon>
                <el-popover popper-class='backgroundPopover' ref="popover1" placement="right-end" trigger="click">
                    <div>点击下载默认下载本单全部唯一码。筛选后点击<br/>下载则下载筛选出的唯一码。</div>
                </el-popover>
            </div>
            <nf-button style="background:#23c811;width:98px;color:#fff;" @click="downLoad">下载</nf-button>
    </div>
    <div class="bed-list">
        <template>
            <el-table @sort-change="sortTable" :data="ywmData" border style="width: 100%;margin-bottom:24px;">
                <el-table-column  prop="lathe" label="床次" sortable="custom"  width="90">
                </el-table-column>
                <el-table-column  prop="latheNo" label="本次序号"  width="100">
                </el-table-column>
                <el-table-column  prop="WYM" sortable="custom" label="唯一码" width="100">
                </el-table-column>
                <el-table-column  prop="orderNo" label="工单号">
                </el-table-column>
                <el-table-column  prop="styleNo" label="货品款号" width="100">
                </el-table-column>
                <el-table-column  prop="colorNo" label="色号" width="160">
                </el-table-column>
                <el-table-column  prop="colorName" label="色名" width="160">
                </el-table-column>
                <el-table-column  prop="sizeName" label="尺码" width="80">
                </el-table-column>
                <el-table-column  prop="standardName" label="内长" width="80">
                </el-table-column>
                <el-table-column   v-for="(item,index) in prcdNodes" :key="index" :label="item.prcdNodeName" width="120" align="center">
                    <template slot-scope="scope">
                        <p>{{ywmData[scope.$index].prcdNodes[index].chargerName}}</p>
                        <p>{{ywmData[scope.$index].prcdNodes[index].dateCompleted}}</p>
                    </template>
                </el-table-column>
                <!--<el-table-column  prop="finishUserName" label="完成人员" width="100">-->
                <!--</el-table-column>-->
                <!--<el-table-column  prop="finishDate" label="完成时间" width="120">-->
                <!--</el-table-column>-->
            </el-table>
        </template>
        <div class="page">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="20" layout="total, prev, pager, next" :total="wymInfo.pageTotal">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { wyMList,getPersonList,generateExcelWym } from '../../../api/api'
let Base64 = require('js-base64').Base64;
export default {
    data() {
        return {
            bedNum:[],
            man:[],
            options:[
                {
                    value:1,
                    label:1,
                }
            ],
            endAt:'',
            currentPage:1,
            bedCount:0,
            ywmData:[],
            prcdNodes:[],
            wymInfo:{},
            pickerOptions2: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit('pick', [start, end]);
                        }
                    }
                ]
            },
            placeorderStartAt:'',
            placeorderEndAt:'',
            orderByLathe:"0",
            orderByWYM:"0"
        }
    },
    methods:{
        sortTable(val) {
            let sort = val.order;
            if(val.prop == 'WYM') {
                if (sort == 'ascending') {
                    this.orderByWYM = "0";
                    this.orderByLathe = "0";
                    this.getwyMList();
                    return;
                } else {
                    this.orderByWYM = "1";
                    this.orderByLathe = "0";
                    this.getwyMList();
                    return;
                }
            }
            if(val.prop == 'lathe') {
                if (sort == 'ascending') {
                    this.orderByLathe = "0";
                    this.orderByWYM = "0";
                    this.getwyMList();
                    return;
                } else {
                    this.orderByLathe = "1";
                    this.orderByWYM = "0";
                    this.getwyMList();
                    return;
                }
            }

        },
        downLoad() {
            let params = {
                lathes:this.bedNum,
                missionId:this.$route.query.missionId,
                missionNodeId:this.$route.query.instanceId,
                finishStartDate:this.placeorderStartAt,
                finishEndDate:this.placeorderEndAt,
                userIds:this.man,
                pageNo:this.currentPage,
                pageSize:20,
                excelType:1,
            }
            generateExcelWym(params).then( res => {
                this.fileData =res.data;
                var blob = new Blob([JSON.stringify(res.data)], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                let url = window.URL.createObjectURL(res.data);
                let a = window.document.createElement('a');
                a.setAttribute('href',url);
                a.setAttribute('download','生成唯一码文件.xls');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
        },
        getwyMList() {
            let params = {
                lathes:this.bedNum,
                missionId:this.$route.query.missionId,
                missionNodeId:this.$route.query.instanceId,
                finishStartDate:this.placeorderStartAt,
                finishEndDate:this.placeorderEndAt,
                userIds:this.man,
                pageNo:this.currentPage,
                pageSize:20,
                orderByLathe:this.orderByLathe,
                orderByWYM:this.orderByWYM
            };
            wyMList(params).then( res => {
                this.wymInfo = res.data.wymInfo;
                this.ywmData = res.data.wyms;
                this.prcdNodes = res.data.wyms[0].prcdNodes;
            })
        },
        handleCurrentChange(val) {
           this.getwyMList();
        },
        getPersonList() {
            let params3 = {
                userId:this.userId,
                keyword: "",
                token: "",
                unitId: JSON.parse(sessionStorage.getItem("last_login")).id
            };
            getPersonList(params3).then(res => {
                this.options = res.data;
            });
        },
        beginDate(val) {
            val.split('至');
            this.placeorderStartAt = val.split('至')[0];
            this.placeorderEndAt = val.split('至')[1];
        },
    },
    created() {
        this.userId = this.$store.state.userInfo.id ||
            JSON.parse(sessionStorage.getItem("user_login")).userId;
        this.getwyMList();
        this.getPersonList();
        console.log(Base64.encode("120@:;poklE%^&"));
    }
}
</script>

<style lang="scss" scoped>
   .look-wym {
        .base-info-mission {
            width: 100%;
            height: 80px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            padding:16px 32px;
            box-sizing: border-box;
            display:flex;
            justify-content: flex-start;
            margin-bottom: 16px;
            .img{
                width: 48px;
                height: 48px;
                border:1px solid #f0f2f5;
                img{
                    width:100%;
                    height:100%;
                }
            }
            .base-info-list {
                display:flex;
                justify-content:flex-start;
                width:100%;
                padding:0 32px;
                height:100%;
                .second-info {
                    /*height: 100%;*/
                    display: flex;
                    line-height: 48px;
                    /*justify-content: space-between;*/
                    /*align-items: stretch;*/
                    /*flex-direction: column;*/
                    margin-right: 80px;
                    &>div{
                        width: 240px;
                    }
                }
                .third-info {
                    height: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: stretch;
                    flex-direction: column;
                }
                .gray {
                    color: #a2abb8;
                    margin-right: 12px;
                }
            }
        }
        .select-mission {
            width: 100%;
            height: 76px;
            border-radius: 2px;
            background-color: #ffffff;
            box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
            box-sizing: border-box;
            padding: 16px 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .select-mission-wym {
            display: flex;
            justify-content: flex-start;
            .bed-num {
                margin-right:32px;
            }
            .select-name {
                display: inline-block;
                margin-right: 12px;
                color: #000;
            }
            .el-input__inner {
                width:250px;
            }
        }
        .wym-download {
            margin: 16px  0;
            height:36px;
            width:100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            .icon-tip {
                margin-right:12px;
            }
        }
        .bed-list {
            box-sizing: border-box;
            background-color: #fff;
            padding-bottom:24px;
            .page {
                margin: 20px 0;
                text-align: right;
                margin-right: 32px;
            }
        }
   }
</style>
<style lang="scss">
    .select-mission-wym {
        .bed-num {
            .el-input__inner {
                width:250px;
            }
        }
        .select-name,.bed-num input::-webkit-input-placeholder{
            color: #000;
        }
        .el-date-editor.el-input {
            width:250px;
        }
    }
    .backgroundPopover{
        color:#fff;
        background:#939fb8;
        border:1px solid #939fb8;
    }
    .popper__arrow::after{
        border-left-color:: #939fb8 !important;
    }
    .look-wym thead tr th {
        height:36px;
        background-color: #fff;
        .cell {
            color:#a2abb8;
            background-color: #fff;

        }
    }
</style>

