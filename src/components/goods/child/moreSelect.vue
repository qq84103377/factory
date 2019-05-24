<template>
    <div v-clickoutside="closeList">
        <div class="nf-input">
            <ul class="selected">
                <li v-for='item in selectItem'>
                    <span>{{item.name}}</span>
                    <i class="el-icon-close"></i>
                </li>
            </ul>    
            <el-input v-model="search" @focus="handSelect">
            </el-input>
        </div>
        <transition name="el-zoom-in-top">
            <ul class="search-con--list" v-show="popoverVisble">
                <li @click="add(i)" v-for="(item1, index) in item" :key="index">
                        <span>{{ item1.name }} </span>
                        <i v-if="item1.expand" class="el-icon-check"></i>
                </li>
            </ul>
        </transition>
    </div>
</template>

<script>
export default {
    props:['item','selectItem'],
    data() {
        return {
            popoverVisble:true,
            search:'',
        }
    },
    methods:{
        test() {
            for(let i=0;i<this.item.length;i++) {
                for(let j=0;this.selectItem.length;j++) {
                    if(this.item[i].name==this.selectItem[j].name) {
                        this.item[i].expand = true;
                    }else{
                        this.item[i].expand = false;                        
                    }
                }
            }    
        },
        closeList() {
            this.popoverVisble = false;
        },
        handSelect() {
            this.popoverVisble = true;            
        },
        add(i) {
            this.selectItem.push(this.item[i]);
        },
    },
    created(){
    },
    updated(){
        this.test();        
    }
}
</script>

<style lang='scss' scoped>
    .search-con--list{
        position: absolute;
        background-color: #fff;
        z-index: 10;
        width:770px;
        height: 250px;
        overflow-y: scroll;
        overflow-x: hidden;
        border:1px solid #ccc; 
        border-top:transparent;
        box-sizing: border-box;               
        li{
            padding:8px 10px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            color:#2c2c2c;
            &:hover{
                background-color: rgb(228, 230, 241);
            }
        }
		&::-webkit-scrollbar {
            width: 6px;
            height: 6px;
		}
        &::-webkit-scrollbar-thumb {
            background-color: #ccc;
            background-clip: padding-box;
            min-height: 28px;
		}
    }
    .selected{
        display: flex;
        justify-content: flex-start;
        position: absolute;
        z-index: 11;
        left: 0;
        top: 2px;
        li{
            background-color: #f2f5fa;
            cursor: pointer;
            height: 24px;
            min-width:42px;
            margin: 4px;
            padding:0  6px;
            display: flex;
            align-items: center;
            color: #2c2c2c;
            justify-content: space-between;
            .el-icon-close{
                border-radius: 50%;
                text-align: center;
                position: relative;
                cursor: pointer;
                font-size: 12px;
                -ms-transform: scale(.75, .75);
                transform: scale(.75, .75);
                height: 18px;
                width: 18px;
                line-height: 18px;
                vertical-align: middle;
                top: -1px;
                right: -2px;
                color: #bcc1cc;
                &:hover{
                    background-color: #bcc1cc;
                    color: #fff;
                }
            }
        }
    }
    .nf-input{
        position: relative;
        width:770px;
        height: 36px;
    }
</style>
