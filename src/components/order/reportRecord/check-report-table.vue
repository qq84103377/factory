<template>
    <!--判断是否是扎号型节点-->
    <div v-if="nodeAllData.associateLigation">
        <!--丢扎上报-->
        <table class="check-table" v-if="checkData.operationType === 0">
            <thead>
            <tr>
                <td>床次</td>
                <td>扎号</td>
                <td>工单号</td>
                <td>货品</td>
                <td>颜色</td>
                <td>尺码</td>
                <td>本次上报</td>
            </tr>
            </thead>
            <tbody>
            <template v-if="checkData.ligationList.length">
                <tr v-for="(item,index) in checkData.ligationList" :key="index">
                    <template v-if="item.lossSign ===1">
                        <td v-mergerows6>{{item.ligationNo}}</td>
                        <td>{{item.record}}</td>
                    </template>
                    <template v-else>
                        <td>{{item.lathe}}</td>
                        <td>{{item.ligationNo}}</td>
                        <td>{{item.orderNo}}</td>
                        <td>{{item.styleNo}}</td>
                        <td>{{item.colorName}}</td>
                        <td>{{item.sizeName}}</td>
                        <td>{{item.record}}</td>
                    </template>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td class="msg" v-mergerows7>暂无数据</td>
                </tr>
            </template>
            </tbody>
        </table>
        <div style="display: flex;">
            <defective-table :defectiveItem="checkData" :styleNo="nodeAllData.mission.styleNo"></defective-table>
        </div>
        <div style="display: flex;">
            <waste-table :wasteItem="checkData" :styleNo="nodeAllData.mission.styleNo"></waste-table>
        </div>


        <!--<table class="check-table" v-else>-->
        <!--<thead>-->
        <!--<tr>-->
        <!--<td>床次</td>-->
        <!--<td>所属扎号</td>-->
        <!--<td>货品款号</td>-->
        <!--<td>颜色</td>-->
        <!--<td>尺码</td>-->
        <!--<td>次品标签</td>-->
        <!--<td>返修次数</td>-->
        <!--<td>状态</td>-->
        <!--</tr>-->
        <!--</thead>-->
        <!--<tbody>-->
        <!--<template v-if="checkData.ligationList.length">-->
        <!--<tr v-for="(item,index) in checkData.ligationList" :key="index">-->
        <!--<td>{{item.lathe}}</td>-->
        <!--<td>{{item.ligationNo}}</td>-->
        <!--<td>{{item.styleNo}}</td>-->
        <!--<td>{{item.colorName}}</td>-->
        <!--<td>{{item.sizeName}}</td>-->
        <!--<td>{{item.defectiveLabelName}}</td>-->
        <!--<td>{{item.repairTimes}}</td>-->
        <!--<td>{{item.statusRemark}}</td>-->
        <!--</tr>-->
        <!--</template>-->
        <!--<template v-else>-->
        <!--<tr>-->
        <!--<td class="msg" v-mergerows8>暂无数据</td>-->
        <!--</tr>-->
        <!--</template>-->
        <!--</tbody>-->
        <!--</table>-->
    </div>
</template>

<script>
    import defectiveTable from '@/components/order/reportRecord/defectiveTable'
    import wasteTable from '@/components/order/reportRecord/wasteTable'

    export default {
        name: "check-record-table",
        props: ["nodeAllData", "checkData"],
        data() {
            return {};
        },
        components: {defectiveTable, wasteTable},
        directives: {
            mergerows6: {
                // 自定义合并单元格指令
                inserted: function (el) {
                    el.setAttribute("colspan", 6);
                }
            },
            mergerows7: {
                // 自定义合并单元格指令
                inserted: function (el) {
                    el.setAttribute("colspan", 7);
                }
            },
            mergerows8: {
                // 自定义合并单元格指令
                inserted: function (el) {
                    el.setAttribute("colspan", 8);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .check-table {
        width: 100%;
        border: 1px solid #dfe6ec;
        border-collapse: collapse;
        background-color: #fff;
        margin: 15px 0;
        thead {
            background-color: rgb(238, 240, 246);
            tr {
                line-height: 40px;
                td {
                    color: #97a5bd;
                    font-weight: 700;
                }
            }

        }
        tr:hover {
            background-color: rgb(238, 240, 246);
        }
        td {
            border: 1px solid #dfe6ec;
            padding: 10px 18px;
            &.msg {
                text-align: center;
            }
        }

    }
</style>