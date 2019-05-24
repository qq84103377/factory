<template>
<el-dropdown size="small" ref="v-select"  menu-align="start" @visible-change="handleFocus" :hide-on-click="false" style="width: 100%; position: relative;" trigger="click">
        <div class="v-select">
            <div class="v-select__tags" ref="select-tags">
                <el-tag
                    v-for="(item, index) of selected"
                    :key="item"
                    closable
                    :close-transition="true"
                    class="v-select__tag__item"
                    type="primary"
                    @close="handleCloseTag(index)">{{ item.userName }}</el-tag>
                <input  ref="search-input" class="v-select__input" @input="handleSearch" type="text" v-model="keyword">
            </div>
            <div class="v-select-input">
                <el-input
                    ref="v-select-input"
                    class="v-select-input__inner"
                    :disabled="disabled"
                    :placeholder="currentPlaceholder"></el-input>
            </div>
            <div class="v-select__arrow">
                <i class="el-icon-caret-bottom v-select__arrow"></i>
            </div>
        </div>
    <el-dropdown-menu slot="dropdown">
        <div class="v-select-dropdown" >
            <el-scrollbar class="parent-list">
                <ul class="v-select-dropdown__list" :style="{'width': dropdownWidth+'px'}">
                    <li
                        class="user-select__option"
                        v-for="(item, index) of options"
                        :key="index"
                        :class="{'is-active': activeGroupIndex === index}"
                        @click="handleSelectGroup(item, index)">
                        <span>{{ item.groupName }}</span>
                    </li>
                </ul>
            </el-scrollbar>
             <el-scrollbar class="children-list" v-show="childrenOptions.length" :style="{'width': dropdownWidth+'px'}">
                <ul class="v-select-dropdown__list">
                    <li
                        class="user-select__option"
                        :class="{'is-active': currentValue.indexOf(item.userId) > -1}"
                        v-for="(item, index) of childrenOptions"
                        :key="index"
                        :label="item.userName"
                        :value="item.userId"
                        @click="handleSelectValue(item)">
                            <span>{{ item.loginName + '_' +item.userName }}</span>
                    </li>
                </ul>
             </el-scrollbar>
        </div>
    </el-dropdown-menu>
</el-dropdown>
</template>

<script>
// import ElScrollbar from 'element-ui/packages/scrollbar';
import SelectOptions from './option';
export default {
    componentName: 'UserSelectGroup',
    props: {
        value: Array,
        disabled: Boolean,
        options: {
            type: Array,
            default: []
        },
        placeholder: {
            type: String,
            default: '请选择'
        }
    },
    components: {
    //    SelectOptions
    },
    data() {
        return {
            dropdownWidth: '',
            childrenOptions: [],
            activeGroupIndex: 0,
            keyword: '',
            cacheOptions: []
        };
    },
    computed: {
        currentValue: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val);
            }
        },
        selected() {
            const arr = [];
            this.currentValue.forEach(userId => {
                this.cacheOptions.forEach(item => {
                    if (userId === item.userId && !arr.find(arrItem => arrItem.userId === item.userId)) {
                        arr.push(item)
                    }
                });
            });
            return arr
        },
        currentPlaceholder() {
            return !this.currentValue.length && !this.keyword ? this.placeholder : ''
        }
    },
    watch: {
        options(val) {
            if(val){
                this.getCacheOptions();
                this.childrenOptions = val[0].facUserDTOS;
            } else{
                this.childrenOptions = []
            }
            this.$nextTick(() => {
                this.resetInputHeight();
            });

        },
        selected() {
            setTimeout(() => {
                this.resetInputHeight();
            }, 150);
        }
    },
    created() {
        if (!this.childrenOptions.length) {
            this.childrenOptions = (this.options[0] && this.options[0].facUserDTOS) || [];
        }
        this.getCacheOptions();
    },
    mounted() {
        this.getDropdownWidth();
        this.resetInputHeight();
    },
    methods: {
        getCacheOptions() {
            if (!this.cacheOptions.length) {
                let arr = [];
                this.options.forEach(item => {
                    arr = arr.concat(item.facUserDTOS);
                });
                this.cacheOptions = arr;
            }
        },
        handleSearch() {
            this.$refs['v-select'].show();
            this.$emit('remote', this.keyword);
        },
        handleFocus(val) {
            //每次光标激活的时候重新计算组件宽度，因为一个页面可能存在多个此组件
            this.getDropdownWidth();
            if (val) {
                this.$refs['search-input'].focus();
            }
            else {
                this.$refs['search-input'].blur();
            }
        },
        getDropdownWidth() {
            this.dropdownWidth = this.$refs['v-select'].$el.clientWidth || '96';
        },
        resetInputHeight() {
            const height = this.$refs['select-tags'].clientHeight;
            const input = this.$refs['v-select-input'].$el.querySelector('input');
            input.style.height = (height || 36) + 'px';
        },
        handleSelectGroup(item, index) {
            this.childrenOptions = item.facUserDTOS;
            this.activeGroupIndex = index;
        },
        handleSelectValue(item) {
            const index = this.currentValue.findIndex(val => val === item.userId);
            if (index > -1) {
                this.currentValue.splice(index, 1);
            }
            else {
                this.currentValue.push(item.userId);
            }
            this.$nextTick(() => {
                this.resetInputHeight();
            });
        },
        handleCloseTag(index) {
            const e = window.event;
            e.stopPropagation();
            this.currentValue.splice(index, 1);
            this.$nextTick(() => {
                this.resetInputHeight();
            });
        }
    }
}
</script>


<style lang="scss">
    .v-select .el-input__inner {
        display: block;
        // height: 100%;
    }
</style>

<style lang="scss" scoped>
    .v-select {
        position: relative;
        display: inline-block;
        width: 100%;
        box-sizing: border-box;
        border-radius: 2px;
        cursor: pointer;
        &__input {
            width: 35px;
            border: none;
            outline: none;
            padding: 0;
            margin-left: 10px;
            color: #666;
            font-size: 14px;
            vertical-align: baseline;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            height: 28px;
            background-color: transparent;
        }
        &__placeholder {
            position: absolute;
            top: 50%;
            left: 6px;
            transform: translateY(-50%);
            z-index: 1;
            font-size: 14px;
            color: #bfcbd9
        }
        &__tags {
            position: absolute;
            top: 50%;
            left: 0;
            right: 35px;
            transform: translateY(-50%);
            z-index: 1;
        }
        &-dropdown {
            display: flex;
            position: relative;
            .children-list {
                /*position: absolute;*/
              margin-top: -7px;
              margin-bottom: -7px;
                border: 1px solid rgb(209, 216, 229);
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12);
                padding: 6px 0;
            }
            &__list {
                flex: 1;
                background: #fff;
                max-height: 274px;
            }
        }
        &__tag__item {
            margin: 3px 0 3px 6px
        }
        &__arrow {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 35px;
            height: 100%;
            right: 0;
            top: 50%;
            z-index: 1;
            color: #bfcbd9;
            transition: transform .3s;
            transform: translateY(-50%);
        }
        &__icon {
            transition: all .3s;
            font-size: 12px;
        }
    }
    .user-select__option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        font-size: 12px;
        color: rgb(72, 82, 106);
        cursor: pointer;
        padding: 8px 10px;
        height: 36px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: #fff;
        &:hover {
           background: rgb(228, 230, 241);
        }
    }
    .parent-list{
      .user-select__option{
        &.is-active{
          background: #e4e8f1;
        }
      }
    }
    .children-list{
      .user-select__option{
        &.is-active::after {
          position: absolute;
          right: 10px;
          font-family: element-icons;
          content: "\E608";
          font-size: 11px;
        }
      }
    }
</style>
