<template>
    <div class="bom-table-content">
        <table class="bom-table">
            <tr>
                <th  style="width: 12%;">物料分类</th>
                <th  style="width:8%;">物料款号</th>
                <th  style="width: 10%;">物料名称</th>
                <th  class="table-content">
                    <table class="header-table">
                        <tr>
                            <th width="10%">颜色</th>
                            <th width="15%">规格</th>
                            <th width="15%">用户货品颜色</th>
                            <th width="15%">用户货品尺码</th>
                            <th v-if="lengthShow" width="15%">用户货品内长</th>
                            <th width="10%">单件用量</th>
                            <th width="10%">默认损耗率</th>
                            <th width="10%">单位</th>
                        </tr>
                    </table>
                </th>
            </tr>
            <tr v-for="item in tableData" class="level-on-tr">
                <td class="td-padding" >{{formatLabel(item.kindsNo,item.kindsName)}}</td>
                <td class="td-padding" >{{ item.materialsNo }}</td>
                <td class="td-padding">{{ item.materialsName }}</td>
                <td class="table-content">
                    <table class="body-table">
                        <tr v-for="item in item.commonBomMaterialsSkuList" class="level-two-tr">
                            <td width="10%">{{formatLabel(item.colorValue,item.colorName)}}</td>
                            <td width="15%">{{formatLabel(item.specificationsNo,item.specificationsName)}}</td>
                            <td width="15%">{{getStyleStr(item.styleColorNameList,'color')}}</td>
                            <td width="15%" >{{getStyleStr(item.styleSizeNameList,'size')}}</td>
                            <td v-if="lengthShow" width="15%" >{{getStyleStr(item.styleStandardNameList,'length')}}</td>
                            <td width="10%">{{ item.singleDosage }}</td>
                            <td width="10%">{{ item.lossRate }}%</td>
                            <td width="10%">{{ item.stockUnitName }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr v-if = "!tableData">
                <td class="no-data" colspan="4">暂无数据</td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        materials: [],
        lengthShow:{
            type:Boolean,
            default:false
        }
    },
    computed: {
        tableData() {
            return this.materials;
        }
    },
    methods:{
        formatLabel(start,end) {
            return end===''?start:start+'-'+end
        },
        getStyleStr(list,type) {
            if(list){
                switch(type){
                    case 'size':return list[0]=='ALL'?'全部尺码':list.join('、'); break;
                    case 'color':return list[0]=='ALL'?'全部颜色':list.join('、'); break;
                    case 'length':return list[0]=='ALL'?'全部内长':list.join('、'); break;
                }

            }
            return ''

        }
    }
}
</script>
<style lang="scss" scoped>
    .bom-table-content{
        .bom-table{
            table-layout: fixed;
            width: 100%;
            border-top: 1px solid #e6e8eb;
            border-left: 1px solid #e6e8eb;
            table{
                width: 100%;
            };
            th{
                position: relative;
                vertical-align: middle;
                background-color: #f5f7fa;
                padding:13px 10px;
                text-align: left;
                color: #62758c;
                font-weight: normal;
                border-right: 1px solid #e6e8eb;
                border-bottom: 1px solid #e6e8eb;

                th{
                    border-bottom: none;
                    &:last-child{
                        border-right: none;
                    }
                }
            }
            th.table-content{
                padding: 0;
            }
            .level-on-tr{
                width: 100%;
                td{
                    position: relative;
                    vertical-align: middle;
                    text-align: left;
                    border-right: 1px solid #e6e8eb;
                    border-bottom: 1px solid #e6e8eb;
                    word-wrap:break-word;
                }
                td.table-content{
                    border-bottom: none;
                    table{
                        table-layout: fixed;
                        width: 100%;
                    }
                }
                .td-padding{
                    padding: 17px 10px;
                    word-break:keep-all;/* 不换行 */
                    white-space:nowrap;/* 不换行 */
                    overflow:hidden;/* 内容超出宽度时隐藏超出部分的内容 */
                    text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                }
            }
            .level-two-tr{
                td{
                    border: none;
                    position: relative;
                    padding: 17px 10px;
                    text-align: left;

                    &:before{
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: -1px;
                        border-bottom: 1px solid #e6e8eb;
                    }
                    &:after{
                        content: '';
                        position: absolute;
                        right: 0;
                        top: -1px;
                        bottom: -1px;
                        border-right: 1px solid #e6e8eb;
                    }
                    &:last-child:after{
                        border-right: none;
                    }
                }
            }
            .no-data{
                text-align: center;
                padding: 17px 0;
                border-right: 1px solid #e6e8eb;
                border-bottom: 1px solid #e6e8eb;
            }

        }
    }
</style>

