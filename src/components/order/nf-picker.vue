<template>
<div>
        <el-date-picker v-if="timeSelect=='begin'" v-model="beginAt" @change="nodeBeginTime" type="date" 
        format="yyyy-MM-dd" :label="beginTime.beginAt" :value="beginTime.beginAt" placeholder="选择日期" :picker-options="pickerOptions3">
        </el-date-picker>
        <el-date-picker v-if="timeSelect=='end'" v-model="endAt" @change="nodeEndTime" type="date" 
        format="yyyy-MM-dd" :label="beginTime.endAt" :value="beginTime.endAt" placeholder="选择日期" :picker-options="pickerOptions4">
        </el-date-picker>
</div>
</template>

<script>
export default {
    props: {
        beginTime: {
            type: Object,
            default: () => {
                // console.log()
            }
        },
        timeSelect:{
            type:String,
            // default: () => {}            
        }
    },
    data(){
        return {
            pickerOptions3: {
                //下单时间不能大于交货时间
                disabledDate: deliverytime  => {
                // console.log(this.beginTime);
                    if (this.beginTime.endAt) {
                        const date = this.beginTime.endAt.replace(/-/g, "/");
                        return deliverytime.getTime() >= +new Date(date) + 8.64e7;
                    } else {
                    }
                }
            },
            pickerOptions4: {
                disabledDate: placeordertime => {
                if (this.beginTime.beginAt) {
                    const date = this.beginTime.beginAt.replace(/-/g, "/");
                    return placeordertime.getTime() <= +new Date(date) - 8.64e7;
                } else {
                    
                }
                }
            },
            beginAt: this.beginTime.beginAt,
            endAt:this.beginTime.endAt,
        }
    },
    watch:{
        'beginTime.endAt':{
            handler(val){
                this.endAt = val;
                console.warn(val,'123');
            },
            deep:true

        },
        'beginTime.beginAt':{
            handler(val){
                this.beginAt = val;
                console.warn(val,'123');
            },
            deep:true

        }
    },
    methods: {
        nodeBeginTime(val) {
            // console.log(val);
            this.$emit('beginAt',this.beginTime,val);
        },
        nodeEndTime(val) {
            this.$emit('endAt',this.beginTime,val);
        }
    },
    computed: {

    }
}
</script>

<style>

</style>
