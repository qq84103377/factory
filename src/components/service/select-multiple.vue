<template>
    <div class="select-multiple">
        <ul class="lists">
            <li class="no-data" v-if="!options.length">没有数据</li>
            <li 
            v-for="(item, index) in options" :key="index"
            :class="{'is-select': currentVal.includes(item[selectKey])}" 
            @click="handleSelectPerson(item, index)">
                <span>{{item[label]}}</span>
                <i class="el-icon-check"></i>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
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
            }
        }
    }
</script>

<style scoped lang="scss">
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