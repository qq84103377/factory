<template>
    <div class="sales-plan-edit">
        <page-title :title="type==='add'?'新建销售计划':'编辑销售计划'">
            <div class="btns">
                <nf-button  @click="$router.go(-1)">取消</nf-button>
                <nf-button :loading="isSubmitting" class="mgl8" type="warning" @click="save">保存</nf-button>
            </div>
        </page-title>

        <div v-loading="isLoadiing" class="box-shadow custom-filter-form pd24 mgt8">
            <div class="yellow-border-title">
                <div class="title">基本信息</div>
            </div>
            <el-form  style="margin-left: -18px;max-width: 920px;margin-top: 16px" label-width="85px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="计划单名称" required>
                            <el-input maxlength="20" v-model.trim="form.name"  placeholder="请填写"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="计划时段" required>
                            <el-date-picker
                                    format="yyyy-MM"
                                    v-model="form.dateRange"
                                    type="daterange"
                                    placeholder="请选择"
                                    @change="dateRangeChange">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="总负责人" required>
                            <worker-leader v-model="form.leaderId"  single="single" placeholder="请选择" ></worker-leader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="总审核人" required>
                            <worker-leader v-model="form.auditorId"  single="single" placeholder="请选择" ></worker-leader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="单位" required>
                            <el-select v-model.trim="form.unit"  placeholder="请选择">
                                <el-option label="元" value="元"></el-option>
                                <el-option label="万元" value="万元"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {addSalesPlan,editSalesPlan,getSalesPlanDetail} from '@/api/goodsPlan.js'
    import PageTitle from "@/components/Common/page-title.vue";

    export default {
        name:'salesPlanEdit',
        data() {
            return {
                form:{
                    name:'',
                    startAt:'',
                    endAt:'',
                    dateRange:'',
                    leaderId:'',
                    auditorId:'',
                    unit:''
                },
                isLoadiing:false,
                isSubmitting:false,
                detailInfo:{}
            }
        },
        components: {
            PageTitle,
        },
        computed: {
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
            type(){
                // add 、edit
                return this.$route.query.type;
            },
            salesPlanId(){
                return this.$route.query.salesPlanId;
            }
        },
        methods: {
            // 选择时间
            dateRangeChange(val){
                if(val){
                    const [start, end] = val.split(/\s-\s/g)
                    // this.form.startAt = new Date(start.replace(/\-/g,"/")).getTime()/1000
                    // this.form.endAt = new Date(end.replace(/\-/g,"/")).getTime()/1000
                    this.form.startAt = start+'-01'
                    this.form.endAt = end+'-01'
                    console.log( this.form.startAt,this.form.endAt)
                    console.log( this.form)
                }
            },
            save(){
                if(!this.form.name){
                    this.$message.error('请填写计划单名称')
                    return
                }
                if(!this.form.dateRange){
                    this.$message.error('请选择计划时段')
                    return
                }
                if(!this.form.leaderId){
                    this.$message.error('请选择总负责人')
                    return
                }
                if(!this.form.auditorId){
                    this.$message.error('请选择总审核人')
                    return
                }
                if(!this.form.unit){
                    this.$message.error('请选择单位')
                    return
                }
                let params = {
                    ...this.form,
                    unitId:this.unitId,
                    userId:this.userId
                }
                let api = addSalesPlan
                if(this.type ==='edit'){
                    api =editSalesPlan
                    params.id = this.salesPlanId
                }
                this.isSubmitting = true
                api(params).then(res => {
                    this.isSubmitting = false
                    if(res.data.code === 0){
                        this.$message.success(this.type==='add'?'新建成功':'编辑成功')
                        this.$router.go(-1)
                    } else{
                        this.$message.error(res.data.msg)
                    }
                })
                console.log("保存")
            },
            getSalesPlanDetail(){
                let params = {
                    id:this.salesPlanId
                }
                this.isloading = true
                getSalesPlanDetail(params).then(res => {
                    this.isloading = false
                    if(res.data.code ===0){
                        this.detailInfo = res.data.data
                        this.form ={
                            name:this.detailInfo.name,
                            startAt:this.detailInfo.beginDate,
                            endAt:this.detailInfo.endDate,
                            dateRange:[new Date(this.detailInfo.beginDate),new Date(this.detailInfo.endDate)],
                            leaderId:this.detailInfo.leaderId,
                            auditorId:this.detailInfo.auditorId,
                            unit:this.detailInfo.unit,
                        }
                    }
                })
            }
        },
        mounted(){

        },
        created() {
            if(this.type==="edit"){
                this.getSalesPlanDetail()
            } else {
                this.form.leaderId = this.userId

            }
        },
    }
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">

</style>

