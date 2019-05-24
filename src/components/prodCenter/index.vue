<template>
    <section>
        <!-- header -->
        <page-title title="生产准备中心">
            <nf-button type="warning" svg="icon-btn-add" style="height: 40px" @click="handleAdd">新建中心</nf-button>
        </page-title>
        <!-- list -->
        <div class="prodCenter" v-for="(item, index) in list">
            <!-- title -->
            <div class="prodCenter_title" @click="handleShow(index,item.id)">
                <div class="prodCenter_title--left">
                    <icon class="icon" :class="{'icon_transform': item.isShow}" type="icon-triangle" w="12" h="6"></icon>
                    <div>
                        <p class="title">{{item.name || '-'}}</p>
                        <p class="date">创建时间：{{item.createAt || '-'}}</p>
                    </div>
                </div>
                <div class="prodCenter_title--right">
                    <nf-button svg="icon-baobiao_quanxian" class="btn_w98" @click="handleManageWorker(item.id)">管理工位</nf-button>
                    <nf-button svg="icon-edit1" class="btn_w98" style="margin-left: 16px" @click.stop="handleEdit(item.id)">编辑信息</nf-button>
                </div>
            </div>
            <!-- content -->
            <div class="prodCenter_content" v-show="item.isShow">
                <!-- 基本信息 -->
                <content-wrap class="prodCenter_content--wrap" title="基本信息" type="big">
                    <p>
                        <span>名称</span>{{obj.name}}
                    </p>
                </content-wrap>
                <!-- 关联工厂 -->
                <content-wrap class="prodCenter_content--wrap" title="关联工厂" type="big">
                    <item-base style="margin: 0 8px 8px 0" v-for="(e, index) in obj.units" :key="index" v-if="e.status === 1">{{e.name}}</item-base>
                </content-wrap>
                <!-- 关联仓库 -->
                <content-wrap class="prodCenter_content--wrap" title="关联仓库" type="big">
                    <item-base style="margin: 0 8px 8px 0" v-for="(e, index) in obj.storehouses" :key="index" v-if="e.status === 1">{{e.name}}</item-base>
                </content-wrap>
            </div>
        </div>
        <!-- components -->
        <transition name="right-move">
            <editProdCenter v-if="isComponentsShow" :objId="id" @toggle="handleToggle"></editProdCenter>
        </transition>
        <transition name="opcity">
            <div class="cover" v-if="isComponentsShow" @click="isComponentsShow = false">
            </div>
        </transition>
        <!-- worker components -->
        <workermanage :isShow.sync="isShow_worker" :workerList="workerList" @confirm="handleWorker"></workermanage>
    </section>
</template>

<script>
import {
    queryProductPrepareCenterList,
    queryProductPrepareCenterInfo,
    productPrepareCenterStationManage,
    queryProductPrepareCenterAllUser
} from "@/api/api";
import editProdCenter from "./components/edit";
import workermanage from "./components/worker";
export default {
    data() {
        return {
            list: [], // 生产准备中心list
            obj: {
                name: "-",
                units: [],
                storehouses: []
            }, //  详情
            id: '', // editRole.vue props
            userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
            isComponentsShow: false, // 编辑／新建
            isShow_worker: false, // 管理工位
            handleId: '', // 记录操作的哪条产品中心ID
            workerList: []
        };
    },
    components: {
        editProdCenter,
        workermanage
    },
    methods: {
        //  查询生产准备中心列表
        async AjaxQueryProductPrepareCenterList() {
            try {
                let { data } = await queryProductPrepareCenterList({
                    userId: this.userId
                });
                (await data.code) === 0 && (this.list = data.sysunitList);
                await this.list.forEach(item => {
                    this.$set(item, "isShow", false);
                });
            } catch (error) {
                console.log(error);
            }
        },
        //  查询生产准备中心详细信息
        async AjaxQueryProductPrepareCenterInfo(id) {
            if (!id) {
                console.log("未传ID");
                return;
            }
            let params = {
                id: id,
                userId: this.userId
            };
            try {
                let { data } = await queryProductPrepareCenterInfo(params);
                (await data.code === 0) && (this.obj.name = data.productPrepareCenter.name);
                (await data.code === 0) && (this.obj.units = data.units);
                (await data.code === 0) && (this.obj.storehouses = data.storehouses);
            } catch (error) {
                console.log(error);
            }
        },
        // 展示详细信息
        handleShow(index, id) {
            if (!this.list[index].isShow) {
                this.list.forEach(item => {
                    item.isShow = false;
                });
                this.list[index].isShow = true;
                this.AjaxQueryProductPrepareCenterInfo(id);
                return;
            }
            this.list[index].isShow = !this.list[index].isShow;
        },
        // ajax 管理工位
        async handleWorker(ids) {
            // console.log(ids);
            let params = {
                userId: this.userId,
                productPrepareCenterId: this.handleId,
                userIds: ids
            };
            try {
                let {data} = await productPrepareCenterStationManage(params);
                (await data.code) === 0 && (this.$message.success(data.msg));
                (await data.code) !== 0 && (this.$message.error(data.msg));
                (await data.code) === 0 && (this.isShow_worker = false);
                // console.log(data);
            } catch (error) {
                console.log(error)
            }
        },
        // ajax 获取生产准备中心管理工位信息
        async AjaxQueryProductPrepareCenterAllUser(id) {
            let params = {
                userId: this.userId,
                productPrepareCenterId: id
            };
            try {
                let {data} = await queryProductPrepareCenterAllUser(params);
                (await data.code) === 0 && (this.workerList = data.productPrepareCenterUserList);
                (await data.code) !== 0 && (this.$message.error('请检查网络'));
            } catch (error) {
                console.log(error)
            }
        },
        // 管理工位
        async handleManageWorker(id) {
            await (this.handleId = id);
            await this.AjaxQueryProductPrepareCenterAllUser(id);
            await (this.isShow_worker = true);
        },
        // 新建
        handleAdd() {
            this.isComponentsShow = true;
            this.id = '';
        },
        // 编辑
        async handleEdit(id) {
            this.id = id;
            this.isComponentsShow = true;
        },
        // 切换
        handleToggle(type) {
            this.isComponentsShow = false;
            type === 1 && this.AjaxQueryProductPrepareCenterList();
        }
    },
    created() {
        this.AjaxQueryProductPrepareCenterList();
    }
};
</script>

<style lang="scss" scoped>
// other
.btn_w98 {
    width: 98px;
    font-size: 14px;
}
.icon {
    transition: all 0.6s;
}
.icon_transform {
    transform: rotate(180deg);
}
// transition
.right-move-enter-active,
.right-move-leave-active {
    transition: all 0.3s ease;
    transform: translateX(0);
}

.right-move-enter,
.right-move-leave-to {
    transform: translateX(100%);
}

.opcity-enter-active,
.opcity-leave-active {
    transition: all 0.5s ease;
    opacity: 0.5;
}

.opcity-enter,
.opcity-leave-to {
    opacity: 0;
}
// 蒙层
.cover {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.5;
    top: 0;
    left: 0;
    z-index: 8;
}
// main style
.prodCenter {
    margin-top: 16px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 6px 10px -3px rgba(13, 51, 128, 0.1);
    &_title {
        padding: 23px 32px 23px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        &--left {
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
                margin-left: 16px;
                .title {
                    margin-bottom: 8px;
                    font-size: 20px;
                    color: #3b3b3b;
                }
                .date {
                    font-size: 14px;
                    color: #a2abb8;
                }
            }
        }
    }
    &_content {
        padding: 12px 32px 10px 70px;
        border-top: 1px solid #e6eaf0;
        &--wrap {
            padding: 24px 0 14px 0;
            border-bottom: 1px solid #e6eaf0;
            &:last-of-type {
                border-bottom: 0;
            }
            p {
                font-size: 14px;
                color: #3b3b3b;
                span {
                    display: inline-block;
                    width: 44px;
                    color: #a2abb8;
                }
            }
        }
    }
}
</style>


