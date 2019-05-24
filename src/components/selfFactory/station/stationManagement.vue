<template>
    <div class="station-header" id="station">
        <div class="tabbar">
            <div :class="['tab-item', $route.path == '/home/setting/selfFacStationManager' ? 'is-active' : '']"
                 @click="handleTab('/home/setting/selfFacStationManager')">
                工位管理
            </div>
            <div :class="['tab-item', $route.path == '/home/setting/selfFacStationGroup' ? 'is-active' : '']"
                 @click="handleTab('/home/setting/selfFacStationGroup')">
                工位分组
            </div>
            <div class="label-group">
                <el-input @change="remoteSearch" v-show="$route.path == '/home/setting/selfFacStationManager'" placeholder="请输入姓名/工号" icon="search" style="width: 220px; margin-right: 8px;">
                </el-input>
                <nf-button v-if="$route.path == '/home/setting/selfFacStationManager'" type="warning" svg="icon-btn-add" @click="stationDetail">
                    新建工位
                </nf-button>
            </div>
        </div>
        <div class="wort-view">
            <router-view ref="child" :keyWord="keyWord" :groupName="groupTempName">
            </router-view>
        </div>
        <!--收费限制弹窗-->
        <warn-dialog :visible.sync="isShow" type="4" message="当前工位数已达到上限，无法再创建！" text="如有需要请联系云工厂客服或实施人员" @confirm="confirm"></warn-dialog>
    </div>
</template>

<script type="text/ecmascript-6">
    import warnDialog from '@/components/Common/dialog/warnDialog.vue'
    import {getSelfWorkList} from '../../../api/api'
    export default {
        name: "station-management",
        components:{warnDialog},
        data(){
          return{
              keyWord:'',
              groupVisible:false,
              groupName: '',
              groupTempName:'',
              isShow: false, // 收费限制弹窗
              canCreate: true, // 是否可新建
          }
        },
        methods: {
            handleTab(path) {
                this.$router.push(path)
            },
            remoteSearch(val) {
                this.keyWord = val;
            },
            confirm(){
                this.isShow = false
            },
            stationDetail(){
                if(this.canCreate) {
                    this.$router.push({path:'/selfFacStationDetail',query:{type:1}})
                } else {
                    this.isShow = true
                }
            },
            getList() {
                let params = {
                    unitId: JSON.parse(sessionStorage.getItem("last_login")).id,
                    pageNum: 1 ,
                    pageSize: 20,
                    userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
                }
                getSelfWorkList(params).then(res => {
                    this.canCreate = res.data.data.canCreate
                })
            },
        },
        created() {
            this.getList()
        }
    }
</script>
<style lang="scss" scoped>
    .tabbar {
        // padding: 0 32px;
        display: flex;
        justify-content: flex-start;
        border-radius: 2px;
        border-bottom: 1px solid #e6eaf0;
        position: relative;
        margin-bottom: 16px;
        .tab-item {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            // margin-right: 32px;
            line-height: 64px;
            color: #b3bcc7;
            font-size: 24px;
            cursor: pointer;
            width: 128px;
        }
        .is-active {
            color: #2c2c2c;
            &::after {
                position: absolute;
                bottom: 0;
                left: 0;
                display: block;
                width: 100%;
                height: 4px;
                content: '';
                background-color: #ff9c38;
            }
        }
        .label-group{
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
        .color-set {
            display: flex;
            justify-content: center;
            &.edit-group {
                padding-left: 40px;
            }
            .edit-group-title {
                margin-bottom: 16px;
            }
            .error-desc {
                color: #fa4150;
                font-size: 12px;
                margin-top: 5px;
            }
            input {
                width: 260px;
                border: 1px solid #d5d5d5;
                height: 34px;
                border-radius: 2px;
                text-indent: .2em;
                font-size: 14px;
                &::-webkit-input-placeholder {
                    color: #babdc2;
                }
            }
        }
        .el-dialog--small{
            width: 100%;
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            .cancel {
                margin-right: 16px;
            }
        }
    }

</style>
<!--<style>-->
    <!--#station .el-dialog&#45;&#45;small {-->
        <!--width: inherit;-->
    <!--}-->
<!--</style>-->
