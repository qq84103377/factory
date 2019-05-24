<template>
    <el-select v-model.trim="materialSelectId" placeholder="请输入搜索并选择" :multiple="multiple" clearable filterable remote
               :remote-method="remoteMethod"
               @change="selGo"
               :loading="loading">
        <template v-if="!isQuery">
            <el-option
                    v-for="(item, index) in materialsNoList"
                    :key="index"
                    :label="item.columnValue"
                    :value="item.id">
            </el-option>
        </template>
        <template v-else-if="isQuery">
            <el-option
                    v-for="(item, index) in materialsNoList"
                    :key="index"
                    :label="item.columnValue"
                    :value="item.query">
            </el-option>
        </template>

    </el-select>
</template>

<script>
    import { searchMaterialScreen,searchMaterialStyleNoScreen } from '@/api/material.js'
    export default {
        name: "material-select",
        props:['type','value','isMaterialNo', 'isQuery','multiple'],
        /*isMaterialNo: 是否要返回款号
        isQuery: 不绑定id
        * */
        data(){
            return {
                loading:false,
                materialSelectId:'',
                typeSearch:'',
                materialsNoList:[],
                materialListMap: [],
                queryMap: []
            }
        },
        computed:{
            facId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        watch:{
            value(val){
                this.materialSelectId = val
            }
        },
        methods:{
            //远程搜索请求接口获取数据
            remoteMethod(val){
                if(val!==''){
                    // 含有物料名称和供应商
                    if(this.type==='materialSelectSearch'){
                        
                        // //下次打开选择上次选中的值
                        // if(this.materialSelectId!==''){
                        //     var ss=val.indexOf("(");
                        //     val = val.substring(0,ss);
                        // }
                        this.searchMaterialScreen(val)
                    }else {
                        this.searchMaterialStyleNoScreen(val)
                    }

                }
            },
            //接口请求
            searchMaterialScreen(key){
                this.loading = true;
                searchMaterialScreen({unitId:this.facId,key:key}).then(res=>{
                    this.loading = false;
                    this.materialsNoList = res.data.data
                    if(this.materialsNoList.length) {
                        if(this.isMaterialNo) {
                            this.materialsNoList.forEach(i => {
                                this.materialListMap[i.id] = i.columnValue
                            })
                        }
                    }
                })
            },
            searchMaterialStyleNoScreen(key){
                this.loading = true;
                searchMaterialStyleNoScreen({unitId:this.facId,key:key}).then(res=>{
                    this.loading = false;
                    this.materialsNoList = res.data.data
                    if(this.materialsNoList.length&&this.isMaterialNo) {
                        this.materialsNoList.forEach(i => {
                            this.materialListMap[i.id] = i.columnValue
                        })
                    }
                })
            },
            // 选择后 触发父级
            selGo(val){
                if(this.isMaterialNo) {
                    this.$emit('change',val, this.materialListMap[val])
                    this.$emit('input',val, this.materialListMap[val])
                }
                else {
                    this.$emit('change',val)
                    this.$emit('input',val)
                }

            },
            //重置清空筛选框内容
            reset() {
                if(this.multiple){
                    this.materialSelectId = []
                }else
                this.materialSelectId = '';

            }
        }
    }
</script>

<style scoped>

</style>
