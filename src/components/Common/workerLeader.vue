<template>
    <el-select v-model="manId" filterable clearable :disabled="isDisabled" :remote='!isRemote' @change="manGet" :remote-method="keyworkLeader" :multiple="single!=='single'"  :placeholder="placeholder"
                popper-class="workerLeaderSel">
        <div    class="colorSel"
                v-for="(item,index) in manList"
                :key="item.groupId">
            <span :class="{'colorSelGroup':true,'colorSelGroupActive':selGroupId === item.groupId}"  @click="selGroupIdChange(item)">{{item.groupName}}</span>
            <div class="colorSelGroupUl" ref="refUl" v-show="item.groupId === selGroupId" :style="{'margin-top':'-'+(37+index*30)+'px'}">
                <el-option v-show="item.facUserDTOS.length>0" v-for="($item,$index) in item.facUserDTOS"   :key="$index"  :label="$item.loginName+'_'+$item.userName"
                           :value="$item.userId"></el-option>
            </div>
        </div>
    </el-select>
</template>
<script>
    import { getUnitUser,getUnitsUsers } from '../../api/api';

    export default {
        name: "workerLeader",
        props: ['placeholder','single','value','manListProps','isDisabled','isRemote', 'isSystem'],
        /*
        * single  单选的标识
        * value   父级v-model的值
        * manListProps   父级循环用这组件 性能考虑，只请求一遍接口
        * isDisabled   是否禁用
        * isSystem 是否是体系层
        * */
        data() {
            return {
                selGroupId:'',
                selGroup:{},
                manId: [],
                manList: [],
                manListBf: [],
                editTemplateL: [],

            }
        },
        watch:{
            manId(){
                this.$emit('input', this.manId); //主动触发父级的change方法，val为向父组件传递的数据
            },

            value (val) {
                if(val!==this.manId){
                    this.manId = val
                }
            },
            // manListProps(val){
            //     // 父级循环用这组件 性能考虑，只请求一遍接口
            //     if(this.manListProps && this.manListProps.length){
            //         this.manList = this.manListProps;
            //         this.manListBf = JSON.parse(JSON.stringify(this.manListProps));
            //         if(this.manList.length>0){
            //             this.selGroupId = this.manList[0].groupId;
            //             this.selGroup = this.manList[0];
            //         }
            //     }
            // },
        },
        created(){
            if(this.value){
                this.manId = this.value
            }

            // 父级循环用这组件 性能考虑，只请求一遍接口
            if(this.manListProps && this.manListProps.length){
                this.manList = this.manListProps;
                this.manListBf = JSON.parse(JSON.stringify(this.manListProps));
                if(this.manList.length>0){
                    this.selGroupId = this.manList[0].groupId;
                    this.selGroup = this.manList[0];
                }

            }else {
                this.getUnitUser();

            }
        },
        methods: {
            // 点击变化分组
            selGroupIdChange(item){
                this.selGroupId = item.groupId;
                this.selGroup = item;
                this.$emit('groupChange', item.groupId);
            },
            // 前端数据筛选
            keyworkLeader(val){
                console.log(val);
                //  单选的时候第二次点击不进行检索不请求接口
                let flag = true;
                if(this.manId.length>0 && this.single ==='single'){
                    console.log(this.manList);
                    if(this.manList){
                        for (let i = 0;i<this.manList.length;i++){
                            for (let j = 0;j<this.manList[i].facUserDTOS.length;j++){
                                if(this.manList[i].facUserDTOS[j].loginName+'_'+this.manList[i].facUserDTOS[j].userName===val){
                                    flag = false
                                    return
                                }
                            }
                        }
                    }

                    if(val===''){
                        this.manId = ''
                    }

                }
                if(!flag) return;
                let data = JSON.parse(JSON.stringify(this.manListBf));
                data.forEach(item=>{
                  let filterArr = item.facUserDTOS.filter($item=>{
                        let str = $item.loginName+'_'+$item.userName;
                        return str.indexOf(val)!==-1
                    });
                    item.facUserDTOS = filterArr
                });
                this.manList = data.filter(item=>item.facUserDTOS.length>0);
                if(this.manList.length>0){
                    this.selGroupId = this.manList[0].groupId;
                    this.selGroup = this.manList[0];
                }
            },

            // 获取工厂负责人
            getUnitUser(val) {
                if (this.isSystem) {
                    let params = {
                        unitIds: ['ALL'],
                        facId: JSON.parse(sessionStorage.getItem("last_login")).id ,
                        userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                        keyword: val
                    }
                    getUnitsUsers(params).then(res => {
                        if(res.data.code===0){
                            this.manList = res.data.data.facGroupDTOS;
                            this.manListBf = JSON.parse(JSON.stringify(res.data.data.facGroupDTOS));
                            if(this.manList.length>0){
                                this.selGroupId = this.manList[0].groupId;
                                this.selGroup = this.manList[0];
                            }
                        }else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    getUnitUser({
                        unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
                    }).then(res => {
                        if(res.data.code===0){
                            this.manList = res.data.data.facGroupDTOS;
                            this.manListBf = JSON.parse(JSON.stringify(res.data.data.facGroupDTOS));
                            if(this.manList.length>0){
                                this.selGroupId = this.manList[0].groupId;
                                this.selGroup = this.manList[0];
                            }
                        }else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }

            },
            manGet(val) {
                this.$emit('input', val);//主动触发父级的change方法，val为向父组件传递的数据
            },

        }
    }
</script>

<style  lang="scss">
    .workerLeaderSel{
        width: 200px;
        height: 274px;
        min-width: 200px !important;
        .is-horizontal{
            height: 0;
        }
        .colorSel{
            /*display: flex;*/
            .colorSelGroup{
                display: inline-block;
                width: 200px;
                height: 30px;
                line-height: 30px;
                padding-left: 10px;
                font-size: 12px;
                color: #3b3b3b;
                cursor: pointer;
                box-sizing: border-box;
                &:hover{
                    background-color: rgb(228, 230, 241)
                }
            }
            .colorSelGroupActive{
                background-color: rgb(228, 230, 241)
            }
            .colorSelGroupUl{
                /*display: none;*/
                position: fixed;
                /*right: 383px;*/
                margin-left: 200px;
                height: 272px;
                overflow-y: auto;
                width: 200px;
                background: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
                border: 1px solid rgb(209, 216, 229);
                .colorSelGroupLiNew{
                    height: 30px;
                    line-height: 30px;
                    padding-left: 10px;
                    color: #ffa914;
                    cursor: pointer;
                }
            }
        }
    }

</style>
