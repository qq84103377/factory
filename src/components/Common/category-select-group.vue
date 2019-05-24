<template>
<div style="position: relative;">
    <span class="dropdown-mask" v-if="disabled"></span>
    <el-dropdown  size="small" ref="category-select" menu-align="start" @visible-change="handleFocus"  style="width: 100%; position: relative;" trigger="click">
        <div class="category-select">
            <div class="category-select__tags" ref="category-select-tags">
                <el-tag
                    closable
                    :close-transition="true"
                    class="category-select__tag__item"
                    type="primary"
                    @close="handleCloseTag" v-show="selected.length > 0"><span v-for="(item,index) in selected" :key="index">{{item}}{{index==selected.length-1 ? '': "/"}}</span></el-tag>
                    <!-- <span v-for="(item,index) in selected" :key="index">{{item}}{{index==selected.length-1 ? '': "/"}}</span> -->
                <input  ref="search-input" class="category-select__input" @input="handleSearch" type="text" v-model="keyword">
            </div>
            <div class="category-select-input">
                <el-input
                    ref="category-select-input"
                    class="category-select-input__inner"
                    :disabled="disabled"
                    :placeholder="currentPlaceholder"></el-input>
            </div>
            <div class="category-select__arrow">
                <i class="el-icon-caret-bottom category-select__arrow"></i>
            </div>
        </div>
        <el-dropdown-menu slot="dropdown">
            <div class="category-select-dropdown" >
                <el-scrollbar class="parent-list">
                    <ul class="category-select-dropdown__list" :style="{'width': dropdownWidth+'px'}">
                        <li class="user-select__option add-color" @click="attrOpen(11)" v-if="getFacCommonSettings&&isAdd">新建</li>
                        <li
                            v-if="options && options.length > 0"
                            class="user-select__option"
                            v-for="(item, index) of options"
                            :key="index"
                            :class="{'is-active': activeGroupIndex === index}"
                            @click="handleSelectGroup(item, index)">
                            <span>{{ item.name }}</span>
                        </li>
                        <li
                            v-if="!options || options.length === 0"
                            class="el-select-dropdown__empty">
                            无数据
                        </li>
                    </ul>
                </el-scrollbar>
                <el-scrollbar class="parent-list first-item-border" :style="{'width': dropdownWidth+'px'}" v-if="activeGroupIndex != null">
                    <ul class="category-select-dropdown__list">
                    <li class="user-select__option add-color" @click="attrOpen(12)" v-if="getFacCommonSettings&&isAdd">新建</li>
                        <li
                            v-show="firstChildrenOptions && firstChildrenOptions.length"
                            class="user-select__option"
                            :class="{'is-active': activeFirIndex === index}"
                            v-for="(item, index) of firstChildrenOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                            @click="handleSelectFirValue(item, index)">
                                <span>{{ item.name}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
                <el-scrollbar class="children-list" :style="{'width': dropdownWidth+'px'}" v-if="activeFirIndex != null">
                    <ul class="category-select-dropdown__list">
                    <li class="user-select__option add-color"  @click="attrOpen(13)" v-if="getFacCommonSettings&&isAdd">新建</li>
                        <li
                            v-show="secondChildrenOptions.length"
                            class="user-select__option"
                            :class="{'is-active': activesedIndex === index}"
                            v-for="(item, index) of secondChildrenOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                            @click="handleSelectSedValue(item,index)">
                                <span>{{ item.name}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </el-dropdown-menu>
    </el-dropdown>
    <!--各种属性新建弹窗-->
    <attribute-dialog :title="title" :show.sync="dialogAdd" @success="getNowDataFac" :type="type" :parentId="parentId"></attribute-dialog>
</div>

</template>

<script>
import attributeDialog from '@/components/Common/attributeDialog'
export default {
    componentName: 'categorySelect',
    props: {
        value: Array,
        disabled: Boolean,
        options: {
            type: Array,
            default: []
        },
        isAdd: {
            type: Boolean,
            default: true
        },
        placeholder: {
            type: String,
            default: '全部'
        }
    },
    components: {
        attributeDialog
    },
    data() {
        return {
            dropdownWidth: '',
            firstChildrenOptions: [], // 一级子元素
            secondChildrenOptions: [], // 二级子元素
            activeGroupIndex: null,
            activeFirIndex: null,
            activesedIndex: null,
            keyword: '',
            cacheOptions: [],
            curSelect: [],
            title: '',
            dialogAdd: false,
            type: null,
            parentId1: null,
            parentId2: null,
            getFacCommonSettings:true, //十个属性新建按钮权限
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
            console.log(this.currentValue, '999')
            if (this.currentValue.length > 0) {
              this.cacheOptions.forEach((item,index) => {
                if (this.currentValue[0] === item.id && !arr.find(arrItem => arrItem.id === item.id)) {
                  arr[0] = item.name
                  this.activeGroupIndex = index
                  this.firstChildrenOptions = item.childAttrs ? item.childAttrs : []
                  this.parentId1 = item.id
                }
                if (item.childAttrs) {
                  item.childAttrs.forEach((v,$index) =>{
                    if (v.id === this.currentValue[1]) {
                      arr[1] = v.name
                      this.activeFirIndex = $index
                      this.parentId2 = v.id
                      this.secondChildrenOptions = v.childAttrs ? v.childAttrs : []
                    }
                    if (v.childAttrs) {
                      v.childAttrs.forEach((i,key) => {
                        if (i.id === this.currentValue[2]) {
                          arr[2] = i.name
                          this.activesedIndex = key
                        }
                      })
                    }
                  })
                }
              })
            }
            console.log(arr, '000')
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
                this.firstChildrenOptions = val[0];
            } else{
                this.firstChildrenOptions = []
            }
            this.$nextTick(() => {
                this.resetInputHeight();
            });

        },
        selected(v) {
            setTimeout(() => {
                this.resetInputHeight();
            }, 150);
        }
    },
    created() {
        //规格属性库权限 新建/编辑商品档案、新建/编辑设计档案中，颜色、规格、内长、十个属性中的下拉框里的“新建按钮”
        let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
        if (powerlist.indexOf('fac.common.settings.getFacCommonSettings') == -1) {
            this.getFacCommonSettings = false
        }
        if (!this.firstChildrenOptions.length) {
            this.firstChildrenOptions = (this.options[0]) || [];
        }
        this.getCacheOptions();
    },
    mounted() {
        this.getDropdownWidth();
        this.resetInputHeight();
    },
    methods: {
         //新建属性
        attrOpen(type) {
            this.$refs['category-select'].hide();
            if (type == 11) {
                this.title='品类：大类';
            } else if (type ==12) {
                this.title='品类：中类';
                this.parentId= this.parentId1
            } else {
                this.title='品类：细小分类';
                this.parentId= this.parentId2
            }
            this.type = type
            this.dialogAdd = true;
        },
        getNowDataFac (id) {
            if (this.type == 11) {
                this.$emit('success',id)
            } else if (this.type == 12) {
                this.$emit('success',id, this.parentId1)
            } else {
                this.$emit('success',id, this.parentId1,this.parentId2)
            }
            console.log(this.parentId1, '999')
            console.log(this.parentId2, '999')
        },
        getCacheOptions() {
            // if (!this.cacheOptions.length) {
                this.cacheOptions = this.options;
            // }
        },
        handleSearch() {
            this.$refs['category-select'].show();
            this.$emit('remote', this.keyword);
        },
        handleFocus(val) {
            console.log(val);

            if (val) {

                this.$refs['search-input'].focus();
            }
            else {
                this.$refs['search-input'].blur();
                console.log(this.currentValue);
                this.$emit('categorySelectChange',this.currentValue)
            }

        },
        getDropdownWidth() {
            this.dropdownWidth = this.$refs['category-select'].$el.clientWidth || '96';
        },
        resetInputHeight() {
            const height = this.$refs['category-select-tags'].clientHeight;
            const input = this.$refs['category-select-input'].$el.querySelector('input');
            input.style.height = (height || 36) + 'px';
        },
        // 父级选中
        handleSelectGroup(item, index) {
            this.firstChildrenOptions = item.childAttrs || [];
            this.activeGroupIndex = index;
            this.secondChildrenOptions = [];
            this.activeFirIndex = null;
            this.activesedIndex = null
            this.currentValue = []
            this.curSelect = []
            this.curSelect[0] = item.id
            this.parentId1 = item.id
            this.currentValue = JSON.parse(JSON.stringify(this.curSelect))
            this.$nextTick(() => {
              this.resetInputHeight();
            });

        },
        // 一级选中
        handleSelectFirValue(item, index) {
            // 清空2级子元素选中问题
            this.activesedIndex = null
            if (this.curSelect[0] == null) {
              this.curSelect[0] = this.currentValue[0]
            }
            this.curSelect[2] = ''
            // 选中一级子元素的处理
            this.secondChildrenOptions = item.childAttrs || [];
            this.activeFirIndex = index;
            this.curSelect[1] = item.id
            this.parentId2 = item.id
            this.currentValue = JSON.parse(JSON.stringify(this.curSelect))
            this.$nextTick(() => {
              this.resetInputHeight();
            });
        },
        // 二级选中
        handleSelectSedValue(item,index) {
          this.activesedIndex = index
          if (this.curSelect[0] == null) { // 初始化有选择的处理
            this.curSelect[0] = this.currentValue[0]
          }
          if (this.curSelect[1] == null) { // 初始化有选择的处理
            this.curSelect[1] = this.currentValue[1]
          }
          this.curSelect[2] = item.id
          this.currentValue = JSON.parse(JSON.stringify(this.curSelect))
          this.$nextTick(() => {
              this.resetInputHeight();
          });
            console.log(1);
            this.$refs['category-select'].hide();
            // $('.ddddd').css('display','none')
        },
        handleCloseTag() {
            const e = window.event;
            e.stopPropagation();
            this.currentValue = [];
            this.activeGroupIndex = null,
            this.activeFirIndex = null,
            this.activesedIndex = null,
            this.firstChildrenOptions = [], // 一级子元素
            this.secondChildrenOptions = [], // 二级子元素
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
    .dropdown-mask{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 2;
        &:hover{
            cursor: not-allowed;
        }
    }
.add-color{
  color:#FFA914 !important;
}
.first-item-border {
  border: 1px solid rgb(209, 216, 229);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12);
  margin:-7px 0;
}
    .category-select {
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
            // z-index: 1;
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
