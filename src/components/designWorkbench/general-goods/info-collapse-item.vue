<template>
    <!--v-if="childrenList.length>0||title!=='样衣信息'&&title!=='工艺信息'&&title!=='BOM表'"-->
        <div class="collapse-item info-collapse-item" >
        <el-row class="collapse-item__header" type="flex" align="middle" justify="space-between" >
            <div>
                <el-checkbox :disabled="checkAllDisable" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                    {{ title || 'title' }}
                </el-checkbox>
                <template v-if="tipShow">
                    <el-popover
                        popper-class="tips-popper"
                        ref="popover2"
                        placement="top-start"
                        :visible-arrow="false"
                        width="200"
                        trigger="hover">
                        <p class="tips">样衣列表只呈现已成型样衣，选中样衣后会默认联动 勾选样衣关联的BOM和工艺单。（均不可以取消勾选）</p>
                    </el-popover>
                    <icon type="icon-tongyong-tishi" v-popover:popover2 w="14" h="14" />
                </template>
            </div>
            <i class="collapse-item__arrow" :class="!isExpand ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" @click="isExpand = !isExpand"></i>
        </el-row>
        <el-row class="collapse-item__wrap" v-show="isExpand">
            <el-checkbox-group v-model="currentModel" @change="handleCheckedChange">
                <el-col class="check-item" :span="8" v-for="(item, index) of childrenList" :key="index">
                    <el-checkbox
                    :disabled="item.disabled"
                    @change="handleSingleChange(item[prop], checkType)"
                    :label="item[prop]">{{ item.label }} <span v-if="item.isDefault">(默认)</span></el-checkbox>
                    <p class="error-tip">
                      <span v-show="showSingleDosageTip(item)">尚未填单件用量</span>
                      <span v-show="showSingleDosageTip(item)&&showStyleSkuTip(item)">、</span>
                      <span v-show="showStyleSkuTip(item)">用料货品sku不完善</span>
                    </p>
                </el-col>
            </el-checkbox-group>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        prop: String,
        checkType: String,
        tipShow: Boolean,
        title: {
            type: String,
            default: ''
        },
        childrenList: {
            type: Array,
            default: []
        },
        value: []
    },
    data() {
        return {
            checkAllArr: [],
            isExpand: true,
            checkAll: false,
            isIndeterminate: false,
            checkAllDisable:false
        };
    },
    computed: {
        currentModel: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    watch: {
        currentModel(val) {
            this.checkAll = val.length && val.length === this.childrenList.length;
            this.isIndeterminate = val.length > 0 && val.length < this.childrenList.length;
        },
        childrenList:{
            // childrenList有一部分是请求接口后才返回的数据，所有在这里监听并设置全选是否可用
            handler:function (newVal) {
                if(newVal.length){
                    this.checkAllDisable=this.childrenList.every(item => item.disabled == true)
                    if(this.checkAllDisable&&this.childrenList.length){
                        this.checkAll = true
                    }
                }
            },
            deep: true
        }

    },
    methods: {
        showSingleDosageTip(item) {
            return this.checkType === 'boms' && !item.hasSingleDosage && this.currentModel.indexOf(item.id) > -1;
        },
      showStyleSkuTip(item) {
        return this.checkType === 'boms' && !item.hasStyleSku && this.currentModel.indexOf(item.id) > -1;
      },
        handleCheckAllChange(event) {
            if (this.checkType === 'boms' || this.checkType === 'processForms' || this.checkType === 'baseInfo'||
                this.checkType === 'attrsInfo'|| this.checkType === 'goodsInfo'|| this.checkType === 'templates'|| this.checkType === 'costs') {
                if (event.target.checked) {
                    this.currentModel = this.childrenList.map(item => item[this.prop])
                }
                else {
                    this.currentModel =  this.childrenList.reduce((arr, item) => {
                        item.disabled && arr.push(item[this.prop]);
                        return arr;
                    }, []);
                }
            }
            else {
                this.currentModel = event.target.checked ? this.childrenList.map(item => item[this.prop]) : [];
            }
            this.isIndeterminate = false;
            this.$emit('change-all', this.checkAll, this.checkType);
        },
        handleCheckedChange(value) {
            let checkedCount = value.length;
        },
        handleSingleChange(val, type) {
            this.$emit('change', val, type)
        }
    },
    created(){
        // childrenList有一部分是前端写死的，所有在这里监听并设置全选是否可用
        if(this.childrenList.length){
            this.checkAllDisable=this.childrenList.every(item => item.disabled == true)
            if(this.checkAllDisable&&this.childrenList.length){
                this.checkAll = true
            }
        }
    }
}
</script>

<style lang="scss">
   .info-collapse-item {
       .el-checkbox__label{
           font-size: 12px;
       }
       .el-checkbox__inner {
           width: 14px;
           height: 14px;
           border-radius: 2px;
           &::after {
               border-width: 1px;
               height: 8px;
               left: 4px;
               top: 0
           }
       }
   }
</style>

<style lang="scss" scoped>
    .collapse-item {
        border: 1px solid #E6EAF0;
        background: #fff;
        border-bottom: none;
        &__header {
            padding: 12px;
        }
        &__arrow {
            cursor: pointer;
            color: #A2ABB8
        }
        &__wrap {
            border-top: 1px solid #E6EAF0;
            padding: 12px 34px;
        }
        .check-item {
            margin-bottom: 8px;
        }
        .error-tip {
            color: #FA4150;
            margin-top: 5px;
        }
        &:last-child{
            border-bottom: 1px solid #E6EAF0;
        }
    }
    .tips {
        line-height: 18px;
        color: #fff;
    }
</style>
