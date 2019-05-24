<template>
    <div class="category-select">
        <el-select
                class="fs12"
                :disabled="disabled"
                v-model="selected"
                @change="changeSelected"
                multiple
                popper-class="category-select"
                placeholder="全部"
                @remove-tag="removeTag"
                @visible-change="visibleChange">
            <el-option>
                <div class="list-content" @click.stop>
                    <ul class="list">
                        <li v-for="item in categoryList"
                            :key="item.id"
                            :class="[item.active?'category-active':'']"
                            @click="listClick(item,'big')">
                            <div :title="item.name" class="label-text">{{item.name}}</div>
                            <el-checkbox @change="changeCategory($event,item,categoryList,'big')" @click.stop
                                         v-model="item.checked"></el-checkbox>
                        </li>
                    </ul>
                    <ul v-if="bigCategory.childAttrs&&bigCategory.childAttrs.length" class="list list-two">
                        <li v-for="item in bigCategory.childAttrs"
                            :key="bigCategory.id+item.id"
                            :class="[item.active?'category-active':'']"
                            @click="listClick(item,'middle')">
                            <div :title="item.name" class="label-text">{{item.name}}</div>
                            <el-checkbox @change="changeCategory($event,item,bigCategory,'middle')" @click.stop
                                         v-model="item.checked"></el-checkbox>
                        </li>
                    </ul>
                    <ul v-if="middleCategory.childAttrs&&middleCategory.childAttrs.length" class="list">
                        <li v-for="item in  middleCategory.childAttrs"
                            :key="middleCategory.id+item.id"
                            :class="[item.active?'category-active':'']">
                            <div :title="item.name" class="label-text">{{item.name}}</div>
                            <el-checkbox @change="changeCategory($event,item,middleCategory,'small')" @click.stop
                                         v-model="item.checked"></el-checkbox>
                        </li>
                    </ul>
                </div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
    import {getCategoryList} from "@/api"

    export default {
        props: ['value', 'disabled', 'modelName'],
        data() {
            return {
                selected: [],
                categoryList: [],
                bigCategory: {}, //当前选中的大分类
                middleCategory: {}, //当前选中的中分类
                oldValue:[] //旧的选中

            }
        },
        watch: {
            value:{
                handler(category,oldCategory){
                    console.log(category,oldCategory,'改变')
                    category = {
                        big:category.big?category.big:[],
                        middle:category.middle?category.middle:[],
                        small:category.small?category.small:[]
                    }
                    this.categoryList.forEach(bigItem => {
                        // if(category.big.includes(bigItem.id)){
                        //     bigItem.checked = true
                        // }
                        bigItem.checked = category.big.includes(bigItem.id)
                        bigItem.childAttrs.forEach(middleItem =>{
                            // if(category.middle.includes(middleItem.id)){
                            //     middleItem.checked = true
                            // }
                            middleItem.checked = category.middle.includes(middleItem.id)
                            middleItem.childAttrs.forEach(smallItem=> {
                                // if(category.small.includes(smallItem.id)){
                                //     smallItem.checked = true
                                // }
                                smallItem.checked = category.small.includes(smallItem.id)
                            })
                        })
                    })
                    this.setSelected()

                    // if(category.big.length||category.middle.length||category.small.length){
                    //
                    //     // let selectedIdsStr = this.selected.map(item =>item.id).toString()
                    //     //
                    //     // if(category.big.toString()=== selectedIdsStr ||
                    //     //     category.middle.toString()=== selectedIdsStr ||
                    //     //     category.small.toString()=== selectedIdsStr )
                    //     //     return
                    //     //
                    //     // this.categoryList.forEach(bigItem => {
                    //     //     bigItem.checked = category.big.includes(bigItem.id)
                    //     //     bigItem.childAttrs.forEach(middleItem =>{
                    //     //         middleItem.checked = category.middle.includes(middleItem.id)
                    //     //         middleItem.childAttrs.forEach(smallItem=> smallItem.checked = category.small.includes(smallItem.id))
                    //     //     })
                    //     // })
                    //     // this.setSelected()
                    // } else {
                    //     this.selected = []
                    // }

                },
                deep:true
            }
        },
        computed: {
            facId() {
                return JSON.parse(sessionStorage.getItem("user_login")).unitId;
            },
            bossUnitId() {
                return JSON.parse(sessionStorage.getItem('user_login')).bossUnitId
            },
            userId() {
                return JSON.parse(sessionStorage.getItem("user_login")).userId;
            },
            // selectedLabel() {
            //     return this.selected.map(item => item.name)
            // }
        },
        methods: {
            // 删除品类
            removeTag(deleteObj) {
                let category = deleteObj.value
                let categoryArr = category.split('/')
                let type = ''
                switch (categoryArr.length) {
                    // 选中的值为大类
                    case 1:
                        type = 'big';
                        {
                            let deleteBigItem = this.categoryList.find(item => item.name === categoryArr[0]);
                            deleteBigItem.checked = false;
                            deleteBigItem.childAttrs.forEach(middleItem=>{
                                middleItem.checked = false;
                                middleItem.childAttrs.forEach(smallItem=> smallItem.checked = false)
                            });
                        }
                        break;
                    // 选中的值为大类/中类
                    case 2:
                        type = 'middle';
                        {
                            let deleteBigItem = this.categoryList.find(item => item.name === categoryArr[0]);
                            let deleteMiddleItem =  deleteBigItem.childAttrs.find(item => item.name === categoryArr[1]);
                            deleteMiddleItem.checked = false;
                            deleteMiddleItem.childAttrs.forEach(smallItem=> smallItem.checked = false);
                        }
                        break;
                    // 选中的值为大类/中类/小类
                    case 3:
                            type = 'small'
                        {
                            let deleteBigItem = this.categoryList.find(item => item.name === categoryArr[0])
                            let deleteMiddleItem =  deleteBigItem.childAttrs.find(item => item.name === categoryArr[1])
                            deleteMiddleItem.childAttrs.find(item => item.name === categoryArr[2]).checked = false
                            break;
                        }
                }
                this.setSelected()
                this.updateValue()
            },
            // 点击复选框，选择品类
            changeCategory(event,currentItem, currentCategory, type) {
                let isChecked = event.target.checked
                if(isChecked){
                    switch (type) {
                        case 'middle':
                            this.categoryList.forEach(item =>{
                                if(item.id === this.bigCategory.id){
                                    item.checked = true
                                }
                            })
                            break;
                        case 'small':
                            this.categoryList.forEach(item =>{
                                if(item.id === this.bigCategory.id){
                                    item.checked = true
                                }
                            })
                            this.bigCategory.childAttrs.forEach(item =>{
                                if(item.id === this.middleCategory.id){
                                    item.checked = true
                                }
                            })
                            break;
                    }
                } else {
                    switch (type) {
                        case 'big':
                            this.bigCategory.childAttrs.forEach(middleItem =>{
                                middleItem.checked = false
                                middleItem.childAttrs.forEach(item => item.checked = false)
                            })
                            break;
                        case 'middle':
                            this.middleCategory.childAttrs.forEach(item => item.checked = false)
                            break;
                    }
                }

                this.setSelected()
                this.updateValue()
            },
            // 重新计算选中的品类
            setSelected() {
                let newSelected = []
                let bigSelectedList = this.categoryList.filter(item => item.checked)
                bigSelectedList.forEach(bigItem=>{
                    let tempSelected = bigItem.name
                    let middleSelectedList = bigItem.childAttrs.filter(item=>item.checked)
                    if(middleSelectedList.length){
                        tempSelected = []
                        middleSelectedList.forEach(middleItem =>{
                            tempSelected =bigItem.name+'/'+middleItem.name
                            let smallSelectedList = middleItem.childAttrs.filter(item=>item.checked)
                            if(smallSelectedList.length){
                                tempSelected = []
                                smallSelectedList.forEach(smallItem =>{
                                    tempSelected.push( bigItem.name+'/'+middleItem.name+'/'+smallItem.name)

                                })
                                newSelected = [...newSelected,...tempSelected]
                            } else {
                                newSelected.push(tempSelected)

                            }
                        })
                    } else {
                        newSelected.push(tempSelected)
                    }
                })
                this.selected = newSelected

            },
            updateValue(){
                let bigSelected = []
                let middleSelected = []
                let smallSelected = []
                this.categoryList.forEach(bigItem =>{
                    if(bigItem.checked){
                        bigSelected.push(bigItem.id)
                        bigItem.childAttrs.forEach(middleItem =>{
                            if(middleItem.checked){
                                middleSelected.push(middleItem.id)
                                middleItem.childAttrs.forEach(smallItem =>{
                                    if(smallItem.checked){
                                        smallSelected.push(smallItem.id)
                                    }
                                })

                            }
                        })
                    }
                })

                let result = {
                    big:bigSelected,
                    middle: middleSelected,
                    small: smallSelected,
                }
                this.oldValue = JSON.parse(JSON.stringify(this.value))
                this.$emit('input',result)
                this.$emit('change', result,this.oldValue)
            },
            listClick(item,type) {
                // 点击大品类
                if(type ==='big'){
                    this.categoryList.forEach(item => item.active = false)
                    item.active = true
                    this.bigCategory = item
                    this.bigCategory.childAttrs.forEach(item =>item.active = false)
                    if(item.childAttrs&&item.childAttrs.length){
                        this.middleCategory = item.childAttrs[0]
                        this.middleCategory.active = true
                    } else {
                        this.middleCategory = {}
                    }

                }
                // 点击中品类
                if(type === 'middle'){
                    this.bigCategory.childAttrs.forEach(item => item.active = false)
                    item.active = true
                    this.middleCategory = item
                }
            },
            // 获取属性下拉列表
            async getCategoryList() {
                let params = {
                    userId: this.userId,
                    modelName: this.modelName,
                }
                await getCategoryList(params).then(res => {
                    let tempList = res.data.data
                    tempList.forEach(item => {
                        item.checked = false
                        item.childAttrs.forEach(middleItem=>{
                            middleItem.checked = false
                            middleItem.childAttrs.forEach(smallItem=>{
                                smallItem.checked = false
                            })
                        })
                    })
                    this.categoryList = tempList
                    this.bigCategory = this.categoryList.length?this.categoryList[0]:{}
                    this.bigCategory.active = true
                    this.middleCategory =this.bigCategory.childAttrs.length?this.bigCategory.childAttrs[0]:{}
                    this.middleCategory.active = true

                })
            },
        },
        async created() {
            await this.getCategoryList()
            let category= {
                big:this.value.big?this.value.big:[],
                middle:this.value.middle?this.value.middle:[],
                small:this.value.small?this.value.small:[]
            }
            this.categoryList.forEach(bigItem => {
                bigItem.checked = category.big.includes(bigItem.id)
                bigItem.childAttrs.forEach(middleItem =>{
                    middleItem.checked = category.middle.includes(middleItem.id)
                    middleItem.childAttrs.forEach(smallItem=> smallItem.checked = category.small.includes(smallItem.id))
                })
            })
                this.setSelected()


        }
    }
</script>
<style lang="scss">
    .category-select {
        .el-select{
            width: 100%;
        }
        .el-select-dropdown__list {
            padding: 0;
        }
        .el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
        .el-select-dropdown__item.hover,
        .el-select-dropdown__item:hover {
            background-color: #fff;
        }

        .el-select-dropdown__item {
            height: auto;
            padding: 0;
        }

        .el-select-dropdown__item span {
            line-height: 0;
        }
    }

</style>
<style lang="scss" scoped>
    .category-select {
        display: inline-block;

        .list-content {
            display: flex;
            position: relative;
            .list {
                width: 200px;
                flex: 1;
                max-height: 262px;
                overflow: auto;
                &.list-two {
                    border-left: 1px solid #e6eaf0;
                    border-right: 1px solid #e6eaf0;
                }
                li {
                    justify-content: space-between;
                    position: relative;
                    line-height: 36px;
                    padding: 0 0 0 12px;
                    &:hover {
                        background-color: rgb(228, 230, 241);
                    }
                    &.category-active {
                        background-color: rgb(228, 230, 241);
                        .checkbox {
                            display: inline-block;
                        }
                    }

                    .label-text {
                        padding-right: 30px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .el-checkbox {
                        position: absolute;
                        top: 1px;
                        right: 10px;
                        .el-checkbox__input {
                            font-size: 12px;
                            margin-bottom: -2px;
                        }
                    }
                }
            }
        }
    }
</style>
