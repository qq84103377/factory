<template>
    <div class="outside-supplier-select">
        <div class="custom-supplier-select">
            <el-select style="width: 100%"
                       :disabled="disabled"
                       popper-class="outside-supplier-bigSel"
                       v-model="value"
                       :placeholder="placeholder"
                       filterable
                       clearable
                       :multiple="multiple"
                       :loading="loading"
                       @change="handleChange">
                <el-option
                        v-if="item.groupId"
                        v-for="item in groupList"
                        :key="item.groupId"
                        :label="item.groupName"
                        :value="item.groupId">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "machining-select",
        props: ['value','multiple','disabled','groupList','placeholder'],
        data() {
            return {
                loading: false
            }
        },
        computed: {
            userId() {
                return JSON.parse(sessionStorage.getItem('user_login')).userId
            },
            factoryId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },

        },
        methods: {
            handleChange(v) {
                this.$emit('input',v)
            }
        },
        created() {
            console.log(this.groupList,'groupListgroupList');
            // this.getList()
        }
    }
</script>

<style lang="scss">
    .right-move-enter-active,
    .right-move-leave-active {
        transition: all 0.3s ease;
        transform: translateX(0);
    }

    .right-move-enter,
    .right-move-leave-to {
        transform: translateX(100%);
    }

    .opcity-enter-active,
    .opcity-leave-active {
        transition: all 0.5s ease;
        opacity: 0.5;
    }

    .opcity-enter,
    .opcity-leave-to {
        opacity: 0;
    }

    .cover {
        position: fixed;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.5;
        top: 0;
        left: 0;
        z-index: 2004;
    }
    .outside-supplier-select{
        .el-form-item{
            margin-bottom:22px !important;
        }
    }
</style>
