<template>
    <div>
        <!--reserve-keyword-->
        <!--:remote-method="getQueryAllBillLabel"-->
        <el-select
                v-model="labelIds"
                placeholder="请选择"
                multiple
                filterable
                :loading="loading"
                @change="change"
                remote>
            <el-option
                    v-for="item in tagList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import {queryAllBillLabel} from '@/api'
    export default {
        props: ['value'],
        data () {
            return {
                tagList: [],
                labelIds: [],
                loading: false
            }
        },
        watch: {
            value(v) {
                this.labelIds = v
            }
        },
        computed:{
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId)
            },
        },
        methods: {
            // 获取选择标签的下拉列表
            getQueryAllBillLabel(keyword) {
                let params = {
                    keyword: keyword || '',
                    userId: this.userId
                }
                this.loading = true
                queryAllBillLabel(params).then(res => {
                    if (res.data.code === 0) {
                        this.tagList = res.data.data
                    }
                    this.loading = false
                })
            },
            change(val) {
                this.$emit('input', val)
            }
        },
        created() {
            this.getQueryAllBillLabel()
        }
    }
</script>