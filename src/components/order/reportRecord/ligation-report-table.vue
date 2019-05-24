<template>
    <!--判断是否是扎号型节点-->
    <table class="ligation-table" v-if="nodeAllData.associateLigation">
        <thead>
            <tr>
                <td>床次</td>
                <td>扎号</td>
                <td>工单号</td>
                <td>货品</td>
                <td>颜色</td>
                <td>尺码</td>
                <td>数量</td>
                <td>本次上报</td>
            </tr>
        </thead>
        <tbody>
            <template v-if="ligationData.ligationList.length">
                <tr v-for="(item,index) in ligationData.ligationList" :key="index">
                    <template v-if="item.lossSign ===1">
                        <td v-mergerows7>{{item.ligationNo}}</td>
                        <td>{{item.num}}</td>
                    </template>
                    <template v-else>
                        <td>{{item.lathe}}</td>
                        <td>{{item.ligationNo}}</td>
                        <td>{{item.orderNo}}</td>
                        <td>{{item.styleNo}}</td>
                        <td>{{item.colorName}}</td>
                        <td>{{item.sizeName}}</td>
                        <td>{{item.quantity}}</td>
                        <td>{{item.num}}</td>
                    </template>
                </tr>
            </template>
            <template v-else>
                <tr>
                    <td class="msg" v-mergerows8>暂无数据</td>
                </tr>
            </template>
        </tbody>
    </table>
</template>
<script>
    export default {
        name: 'ligation-table',
        props:["nodeAllData","ligationData"],
        data() {
            return {
            };
        },
        directives: {
            mergerows7: {
                // 自定义合并单元格指令
                inserted: function(el) {
                    el.setAttribute("colspan", 7);
                }
            },
            mergerows8: {
                // 自定义合并单元格指令
                inserted: function(el) {
                    el.setAttribute("colspan", 8);
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    .ligation-table{
        width: 100%;
        border: 1px solid #dfe6ec;
        border-collapse: collapse;
        background-color: #fff;
        margin: 15px 0;
        thead{
            background-color: rgb(238, 240, 246);
            tr{
                line-height: 40px;
                td{
                    color: #97a5bd;
                    font-weight: 700;
                }
            }

        }
        tr:hover{
            background-color: rgb(238, 240, 246);
        }
        td{
            border: 1px solid #dfe6ec;
            padding: 10px 18px;
            &.msg{
                text-align: center;
            }
        }


    }
</style>



