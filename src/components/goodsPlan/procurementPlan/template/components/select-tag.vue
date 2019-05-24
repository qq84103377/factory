<!--"选择标签"组件-->
<template>
    <div class="select-tag">
        <el-cascader v-if="selectTagOptions&&selectTagOptions.length" clearable v-model="selectedTag"
                     :props="props"
                     :options="selectTagOptions"
                     :show-all-levels="false"
                     @change="change"
        ></el-cascader>
    </div>
</template>

<script>
    export default {
        // selectTagOptions 选项标签下拉数据
        // level: 所在层级
        // index: 所在table的行的index
        // share: selectTagOptions是否为公用选项，选中后可不可以在其他地方被选择
        // from： 被谁引用   main 主线   branch 支线
        props: ['value', 'selectTagOptions', 'level', 'index', 'share', 'from', "parentLevel"],
        components: {},
        data() {
            return {
                props: {
                    value: 'type',
                    label: 'name'
                },
                selectedTag: [],
                categoryTypeList: [11, 12, 13], // 品类的三个type
            }
        },
        watch: {
            value(val) {
                let parentVal = ''
                for (let i = 0; i < this.selectTagOptions.length; i++) {
                    for (let j = 0; j < this.selectTagOptions[i].children.length; j++) {
                        if (this.selectTagOptions[i].children[j].type == val) {
                            parentVal = this.selectTagOptions[i].type
                        }
                    }
                }
                this.selectedTag = [parentVal, val]
            },
            // 通过监听选中的值的变化，修改selectTagOptions数据里的disabled，达到每个标签只能被选中一次的效果
            selectedTag: {
                handler(newValue, oldValue) {
                    if (this.share) {
                        this.setTagDisabled(newValue[1], true)
                        if (oldValue) {
                            this.setTagDisabled(oldValue[1], false)
                        }
                    }
                },
                deep: true
            }
        },
        computed: {},
        methods: {
            // 值改变的时候，如果新值是品类，判断当前层级能否选中改品类
            change(val) {
                // 如果选中了品类
                if (this.categoryTypeList.includes(val[1])) {
                    // 如果是主线选中
                    if (this.from === 'main') {
                        // 检查上面的层级有没有比选中的小的（存在level并且level小于this.level并且是item.from=main并且是品类）
                        let preSelectedTags = []
                        this.selectTagOptions[0].children.forEach(item => {
                            if (item.level && item.level < this.level &&
                                item.from && item.from === 'main' &&
                                this.categoryTypeList.includes(item.type)) {
                                preSelectedTags.push(item)
                            }
                        })
                        let isPreHasMoreSmall = preSelectedTags.some(item => item.type > val[1])
                        if (isPreHasMoreSmall) {
                            this.selectedTag = []
                            this.$emit('input', '')
                            this.$emit('change', '', this.index)
                            this.$alert('请按照大类-中类-小类的层级顺序选择品类标签，否则企划单数据将错乱！', '提示', {
                                confirmButtonText: '确定',
                            });
                            return
                        }
                        //检查下面的层级有没有比选中的大的
                        let nextSelectedTags = []
                        this.selectTagOptions[0].children.forEach(item => {
                            if (item.level && item.level > this.level &&
                                item.from && item.from === 'main' &&
                                this.categoryTypeList.includes(item.type)) {
                                nextSelectedTags.push(item)
                            }
                        })
                        let isNextHasMoreBig = nextSelectedTags.some(item => item.type < val[1])
                        if (isNextHasMoreBig) {
                            this.selectedTag = []
                            this.$emit('input', '')
                            this.$emit('change', '', this.index)
                            this.$alert('请按照大类-中类-小类的层级顺序选择品类标签，否则企划单数据将错乱！', '提示', {
                                confirmButtonText: '确定',
                            });
                            return
                        }
                    }
                    // 如果是支线选中（支线只需检查本层级和上面的层级）
                    if (this.from === 'branch') {
                        // 检查本层级和上面的层级有没有比选中的小的（存在level并且level小于this.level并且是item.from=main并且是品类）
                        let preSelectedTags = []
                        this.selectTagOptions[0].children.forEach(item => {
                            if (item.level && item.level <= this.parentLevel &&
                                item.from && item.from === 'main' &&
                                this.categoryTypeList.includes(item.type)) {
                                preSelectedTags.push(item)
                            }
                        })
                        let isPreHasMoreSmall = preSelectedTags.some(item => item.type > val[1])
                        if (isPreHasMoreSmall) {
                            this.selectedTag = []
                            this.$emit('input', '')
                            this.$emit('change', '', this.index)
                            this.$alert('请按照大类-中类-小类的层级顺序选择品类标签，否则企划单数据将错乱！', '提示', {
                                confirmButtonText: '确定',
                            });
                            return
                        }
                    }

                }
                this.$emit('change', val[1], this.index)
                this.$emit('input', val[1])
            },
            // 禁用或者启用选项标签里的某个二级选项（商品字段、订单字段为一级选项，不禁用）
            setTagDisabled(tagType, isDisabled) {
                for (let i = 0; i < this.selectTagOptions.length; i++) {
                    for (let j = 0; j < this.selectTagOptions[i].children.length; j++) {
                        if (this.selectTagOptions[i].children[j].type == tagType) {
                            this.$set(this.selectTagOptions[i].children[j], 'disabled', isDisabled)
                            // 每次选择标签的值选中，把改层级对应的level存起来，用于其他层级选中标签的时候，判断是否可以选中
                            this.$set(this.selectTagOptions[i].children[j], 'from', isDisabled ? this.from : '')
                            this.$set(this.selectTagOptions[i].children[j], 'level', isDisabled ? (this.from === 'main' ? this.level : this.parentLevel) : '')
                            this.$set(this.selectTagOptions[i].children[j], 'branchLevel', isDisabled ? (this.from === 'main' ? '' : this.level) : '')
                            return
                        }
                    }
                }
            }
        },
        created() {
            if (this.value) {
                let parentVal = ''
                for (let i = 0; i < this.selectTagOptions.length; i++) {
                    for (let j = 0; j < this.selectTagOptions[i].children.length; j++) {
                        if (this.selectTagOptions[i].children[j].type == this.value) {
                            parentVal = this.selectTagOptions[i].type
                        }
                    }
                }
                this.selectedTag = [parentVal, this.value]
            }
        }
    }
</script>
<style lang="scss">
    .select-tag {
        .el-cascader {
            background-color: #FFF9ED;
            width: 100%;
            .el-input__inner {
                line-height: 32px;
                height: 32px;
                border: none;
                background-color: #FFF9ED;

            }
        }
    }
</style>
<style lang="scss" scoped>

</style>
