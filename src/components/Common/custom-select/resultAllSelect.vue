<template>
    <div class="check-all">
        <el-select
                v-model="value"
                placeholder="请选择或搜索"
                :multiple='multiple'
                clearable
                filterable
                remote
                :remote-method="remoteMethod"
                @change="handleChange">
            <el-option v-if="options.length" value="">
                <div class="check-all-btn" @click="handleCheckAll">全选</div>
            </el-option>
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "resultAllSelect",
        props:['value','multiple','options'],
        /******************
         *
         * multiple  是否支持多选 （单选的时候返回字符串，多选返回数组）
         * options 下拉列表（需要特别注意，必须要有id和name属性）
         *        [{
         *            id: 'xxx',
         *            name: 'xxx',
         *        }]
         *
         * ****************/
        data(){
            return{
            }
        },
        methods:{
            //远程搜索
            remoteMethod(query) {
                this.$emit('remoteMethod', query);
            },
            //全选
            handleCheckAll(){
                let idArr = this.options.map(item => item.id);
                this.$nextTick(() => {
                    this.$emit('input', idArr);
                });
            },
            //单选
            handleChange(val){
                this.$emit('input', val);
            }
        },
        created(){
        }
    }
</script>

<style lang="scss" scoped>
    .check-all{

    }
    .check-all-btn{
        color: #FFA914;
    }
</style>