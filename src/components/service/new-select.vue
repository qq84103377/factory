<template>
<div class="select">
        <p>
            <!-- <icon :type="icon" w="20" height="20"></icon> -->
            <span style="vertical-align: middle">{{title}}</span></p>
        <div>
            <span class="select-item" v-for="(label, index) in selectLabel" :key="index">
                {{label.text}}
                <icon v-if="label.canDel" type="icon-baobiao_shanchu" w="10" h="10" @click.native="handleDel(index)"></icon>
            </span>
            <el-popover
            placement="top"
            width="140"
            popper-class="select-popper"
            v-model="personVisible"
            trigger="click">
                <div class="select-list">
                    <div class="handle">
                        <span class="handle-type">选择{{title}}</span>
                        <span class="handle-sure" @click="handleGetPersonVal">确定</span>
                    </div>
                    <div class="select-multiple">
                        <ul class="lists">
                            <li class="no-data" v-if="!options.length">没有数据</li>
                            <li 
                            v-for="(item, index) in options" :key="index"
                            :class="{'is-select': currentVal.includes(item[selectKey]) || currentVal.includes(item['instanceWorkflowId']) }" 
                            @click="handleSelectPerson(item, index)">
                                <span>{{item[label]}}</span>
                                <i class="icon el-icon-check"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <i class="icon el-icon-plus" slot="reference"></i>
            </el-popover>
        </div>           
    </div>
</template>

<script>
import { getUploadToken, getLeadersOfNode } from "../../api/api";
export default {
    props: {
        title: {
            type: String,
            default: '关联人员'
        },
        icon: {
            type: String,
            default: 'icon-guanlianrenyuan'
        },
        options: {
            type: Array,
            default: () => []
        },
        label: {
            type: String,
            default: ''
        },
        selectKey: {
            type: String,
            default: 'id'
        },
        selectVal: {
            type: String,
            default: ''
        },
        value: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            personVisible: false,

        }
    },
    computed: {
        currentVal: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', this.currentVal);
                this.$emit('handleChange', this.currentVal);
            }
        },
        selectLabel() {
            const arr = [];
            for (let idItem of this.currentVal) {
                for (let currentItem of this.options) {
                    const canPush = (idItem === currentItem[this.selectKey] || idItem === currentItem['instanceWorkflowId'])
                    if (canPush) {
                        arr.push({
                            text: currentItem[this.label],
                            canDel: true
                        });
                    }
                }
            }
            return arr;
        }
    },
    methods: {
        handleSelectPerson(item) {
            const index = this.currentVal.indexOf(item[this.selectKey]);
            if (index === -1) {
                this.currentVal.push(item[this.selectKey]);
                // this.currentName.push(item[this.label]);
            }
            else {
                this.currentVal.splice(index, 1);
                // this.currentName.splice(index, 1);
            }
            this.$emit('change', item);
        },
        handleDel(index) {
            //console.log(index)
            this.currentVal.splice(index, 1);
            // this.selectLabel.splice(index, 1);
        },
        handleGetPersonVal() {
            this.personVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.select {
    display: flex;
    align-items: center;
    padding-top: 10px;
    color: #636363;
    font-size: 14px;
    div {
        flex: 1;
    }
    p {
        svg {
            margin-right: 8px;
        }
    }
    i.icon,
    span.select-item {
        display: inline-block;
        padding: 7px;
        background-color: #e7edf2;
        svg {
            margin-left: 5px;
            cursor: pointer;
        }
    }
    i.icon {
        margin-right: 8px;
    }
    span.select-item {
        margin-left: 8px;
        margin-bottom: 5px;
    }
    .el-icon-plus {
        font-size: 12px;
        color: #b2b8c2;
        margin-left: 8px;
        cursor: pointer;
        vertical-align: middle;
        background-color: #e7edf2;
        &:hover {
            opacity: .7
        }
    }
}
.select-list {
    max-height: 300px;
    overflow-y: auto;
    .handle {     
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        .handle-type {
            color: #a2abb8
        }
        .handle-sure {
            color: #1f96ff;
            cursor: pointer;
        }
        // line-height: 30px;
    }
}  
.lists {
    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        line-height: 40px;
        padding: 10px;
        box-sizing: border-box;
        font-size: 14px;
        cursor: pointer;
        i {
            font-size: 12px;
            display: none;
        }
        &:hover {
            background: #f5f7fa;
        }
        &.is-select {
            color: #ff9c38;
            i {
                display: inline-block;
            }
        }
    }
}

.no-data {
    color: #a2abb8
}  
</style>