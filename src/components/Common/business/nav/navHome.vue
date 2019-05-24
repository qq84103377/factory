<template>
    <div class="navHome">
        <div class="navHome_img">
            <img :src="imgSrc" v-errorLogo>
        </div>
        <div class="navHome_facs" @click="handleShow" v-clickoutside="handleHide">
            <p class="name">
                <span class="ellipsis_1">{{facName}}</span>
                <i class="el-icon-arrow-down"></i>
            </p>
            <div class="list show" v-show="isShow_list">
                <!-- 工厂 -->
                <div class="item">
                    <p class="title">切换工厂</p>
                    <ul>
                        <li v-for="(item,index) in facs" :key="index" @click.stop="handleSwitch(item)">
                            <span>{{item.name}}</span>
                            <icon v-if="item.name === facName" type="icon-tick" h="12" w="16"></icon>
                        </li>
                    </ul>
                </div>
                <!-- 生产准备中心 -->
                <!-- <div class="item">
                    <p class="title">切换生产准备中心</p>
                    <ul>
                        <li v-for="item in 8">
                            <span>1</span>
                        </li>
                    </ul>
                </div> -->
            </div>
        </div>
        <div class="navHome_menu">
            <el-menu router :default-active="activeSrc">
                <div v-for="(item, index) in navFilterList" :key="index">
                    <el-submenu v-if="!item.path" class="parent" :index="index">
                        <template slot="title">
                            <span class="icon_wrap">
                                <icon class="icon" :type="item.icon"></icon>
                            </span>
                            {{item.name}}
                        </template>
                        <el-menu-item-group>
                            <el-menu-item :index="e.path" v-for="(e, num) in item.child" :key="num">{{e.name}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item :index="item.path" v-if="item.path">
                        <span class="icon_wrap">
                            <icon class="icon" :type="item.icon"></icon>
                        </span>
                        {{item.name}}
                    </el-menu-item>
                </div>
            </el-menu>
        </div>
    </div>
</template>

<script>
    import data from "./data/navHome.js";
    import {mapGetters} from "vuex";
    import {switchingFactory, switchUnit} from '@/api/api';
    import {getPar} from '../../../../utils/getPar'

    export default {
        data() {
            return {
                navList: data, // 导航
                navFilterList: [],//有权限访问的导航
                imgSrc: "", // 工厂头像
                facName: "", // 工厂名称
                isShow_list: false,
                index: 0
            };
        },
        methods: {
            handleShow() {
                this.isShow_list = !this.isShow_list;
            },
            handleHide() {
                this.isShow_list = false;
            },
            async handleSwitch(obj) {
                let param = {
                    userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
                    facId: obj.id
                }
                let {data} = await switchingFactory(param);
                if (data.code === 0) {
                    sessionStorage.setItem("last_login", JSON.stringify(obj));
                    let userLogin = JSON.parse(sessionStorage.getItem('user_login'));
                    userLogin.unitId = obj.id;
                    // 如何不是老板，重新获取权限
                    if (userLogin.role === 0) {
                        let params = {
                            userId: this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId,
                            unitId: JSON.parse(sessionStorage.getItem('last_login')).id,
                        }
                        await switchUnit(params).then(res => {
                            if (res.data.code === 0) {
                                // console.log(res.data.data)
                                userLogin.firstMenus = res.data.data.firstMenus
                                userLogin.loginUnitId = res.data.data.loginUnitId
                                userLogin.permissionList = res.data.data.permissionList
                            }
                        })
                    }
                    sessionStorage.setItem("user_login", JSON.stringify(userLogin));
                    await this.setLeftMenuFirstUrl(userLogin.firstMenus);
                    //  this.$router.replace({
                    //     path:sessionStorage.getItem('leftMenuFirstUrl')?sessionStorage.getItem('leftMenuFirstUrl'):'/workorders'
                    // });
                    this.$router.replace('/workorders');
                    setTimeout(function () {
                        location.reload()
                    }, 100)
                }
            },
            setLeftMenuFirstUrl(firstMenus) {
                // 控制显示第一个有权限的菜单
                // console.log(firstMenus, 'ddbb')
                if (firstMenus && firstMenus.length > 0) {
                    for (let i = 0; i < this.navList.length; i++) {

                        if (firstMenus.find(f => f.name == this.navList[i].name)) {
                            this.leftMenuFirstUrl = this.navList[i].path;
                            sessionStorage.setItem("leftMenuFirstUrl", this.leftMenuFirstUrl);
                            break;
                        }
                    }
                } else {
                    this.leftMenuFirstUrl = '/workorders';
                }

                sessionStorage.setItem("leftMenuFirstUrl", this.leftMenuFirstUrl);
            },
            //判断是否有权限
            getPermission(name){
                let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
                if (powerlist.indexOf(name) == -1) {
                    return false;
                }
                return true;
            },
            //获取需要控制权限的二级菜单
            getPowerSecondMenu(firstMenus){
                let powerArr = [];
                firstMenus.forEach(f => {
                    f.secondMenuList.forEach(s => {
                        powerArr.push(s.name)
                    })
                })
                // console.log(powerArr,'powerArrpowerArrpowerArr');
                // if(powerArr.length){
                    this.navFilterList.forEach((item, index) => {
                        if(item.child){
                            for (let i = 0; i < item.child.length; i++) {
                                    if(powerArr.indexOf(item.child[i].name) == -1) {
                                        // 即二级菜单没有该权限,则删除该路由
                                        item.child.splice(i--,1)
                                    }
                            }
                        }
                    })
                // }
            },
        },
        computed: {
            ...mapGetters(["facs", "userInfo"]),
            activeSrc() {
                return '/' + this.$route.meta.belong;
            }
        },
        watch: {
            "facs.logo": (val) => {
                // console.log(val)
            }
        },
        async created() {
            await this.$store.dispatch("getFacs");
            if (getPar('unitId', document.location.href)) {
                await this.$store.dispatch("getUserInfo", getPar('unitId', document.location.href));
            } else {
                await this.$store.dispatch("getUserInfo");
            }
            this.facs.forEach((item, index) => {
                if (item.id === this.userInfo.lastLoginFactoryId) {
                    this.index = index;
                }
            });
            this.imgSrc = this.facs[this.index].logo;
            this.facName = this.facs[this.index].name;
            // 控制显示哪些菜单
            this.navFilterList = [];
            let firstMenus = JSON.parse(sessionStorage.getItem('user_login')).firstMenus;
            // let firstMenus = [];
            // firstMenus.push({name:'样版中心',secondMenuList:[]})

            if (firstMenus) {
                firstMenus.forEach(f => {
                   let firstItem = this.navList.find(n => n.name == f.name)
                   if(firstItem){
                       this.navFilterList.push(firstItem)
                   }
                })
            }
            //将没有权限的二级菜单删除
            this.getPowerSecondMenu(firstMenus);
            // console.log(this.navFilterList,'this.navFilterListthis.navFilterList');
        }
    };
</script>

<style lang="scss" scoped>
    .navHome {
        box-sizing: border-box;
        // width: 220px;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        color: #fff;
        background-image: linear-gradient(164deg, #4f5870, #40485c);
        &_img {
            padding: 24px 24px 0;
            img {
                width: 48px;
                height: 48px;
                border-radius: 4px;
            }
        }
        &_facs {
            padding: 0 24px;
            .name {
                display: flex;
                align-items: center;
                cursor: pointer;
                span {
                    padding-right: 10px;
                    display: inline-block;
                    max-width: 130px;
                    line-height: 30px;
                }
                .el-icon-arrow-down {
                    color: rgba(225, 225, 225, 0.5);
                    font-size: 12px;
                }
            }
            .list {
                position: absolute;
                display: flex;
                height: 258px;
                color: #3b3b3b;
                background-color: #ffffff;
                border-radius: 2px;
                box-shadow: 0 4px 10px 0 rgba(0, 17, 51, 0.1);
                z-index: 200;
                .item {
                    width: 250px;
                    height: 258px;
                    border-left: 1px solid #e6eaf0;
                    overflow-y: auto;
                    &::first-of-type {
                        border-left: 0;
                    }
                    .title {
                        padding-left: 12px;
                        font-size: 12px;
                        color: #a2abb8;
                        line-height: 36px;
                    }
                    ul {
                        li {
                            padding: 0 12px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 40px;
                            line-height: 40px;
                            cursor: pointer;
                            &:hover {
                                background-color: #ebeff5;
                            }
                        }
                    }
                }
            }
        }
        &_menu {
            margin: 16px 0;
            .icon_wrap {
                display: inline-block;
                width: 24px;
            }
            .icon {
                position: relative;
                top: -1px;
                opacity: 0.5;
            }
        }
    }

    .is-active {
        position: relative;
        background-color: rgba(255, 255, 255, 0.03) !important;
        color: rgb(255, 255, 255) !important;
        &::before {
            position: absolute;
            left: 0px;
            content: ' ';
            width: 8px;
            height: 100%;
            background-color: #ffa914;
        }
        .icon {
            opacity: 1 !important;
        }
    }

    .show {
        animation: listShow 0.2s ease alternate;
    }

    @keyframes listShow {
        from {
            height: 0;
            display: none;
        }
        to {
            height: 258px;
            display: block;
        }
    }
</style>
<style lang="scss">
    .navHome_menu {
        .el-menu {
            border-radius: 0;
            background-color: transparent;
        }
        .el-menu .el-menu-item {
            padding-left: 24px !important;
            margin-bottom: 2px;
            height: 40px;
            line-height: 40px;
        }
        .el-menu-item-group .el-menu-item {
            padding-left: 52px !important;
            height: 40px;
            line-height: 40px;
        }
        .el-submenu__title {
            margin-bottom: 2px;
            padding-left: 24px !important;
            height: 40px;
            line-height: 40px;
        }
        .el-menu-item,
        .el-submenu__title {
            color: rgba(225, 225, 225, 0.5);
        }
        .el-submenu .el-menu-item:hover,
        .el-submenu__title:hover {
            background-color: rgba(255, 255, 255, 0.03);
            color: rgb(255, 255, 255) !important;
        }
        .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item:hover,
        .el-menu--horizontal.el-menu--dark .el-submenu .el-submenu-title:hover,
        .el-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.03);
            color: rgb(255, 255, 255) !important;
        }
        .el-menu-item-group__title {
            padding-top: 0;
        }
        .is-active.parent {
            .el-submenu__title {
                background-color: rgba(255, 255, 255, 0.03);
                color: rgb(255, 255, 255) !important;
            }
            &::before {
                display: none;
            }
        }
    }
</style>
