// import babelpolyfill from 'babel-polyfill';
// import config from './config/index';
// import Vue from 'vue';
// import VueRouter from 'vue-router';
// import Vuex from 'vuex';
import App from './App';
import Vue from 'vue';
import ElementUI from 'element-ui';
import {componentInstall} from './package';
import './assets/theme/theme-deepblue/index.css';
import './assets/style/public.scss';
import store from './vuex/store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import routes from './router';
import Clickoutside from '@/directive/clickoutside';
import 'font-awesome/css/font-awesome.min.css';
import permissions from '@/components/Common/permissions';
import {getPar} from './utils/getPar'
import {doLoginToFactory, getMyInfo, getFacInfo} from './api/api';
import config from "./config/index";
import $common from './utils/common.js';

//权限
Vue.prototype.powerJudgement = permissions;
// 全局配置
Vue.prototype.$globalConfig = config;
// 全局通用函数
Vue.prototype.$common = $common;


// common组件
import RicoComponents from '@/components/Common/index';
// 注册全局公共组件
Vue.use(RicoComponents);

// common自定义指令
import * as directive from './directive/';

Object.keys(directive).forEach(k => Vue.directive(k, directive[k]));

//条形码
import VueBarcode from 'vue-barcode';

Vue.use(VueBarcode)
Vue.use(ElementUI)
// Vue.use(VueRouter)
// Vue.use(Vuex)
Vue.directive('clickoutside', Clickoutside);


componentInstall(Vue);
NProgress.configure({showSpinner: false});

const router = new VueRouter({
    routes,
    mode: '',

})


router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem('user_login') && to.path !== '/login' && to.path !== '/register' && to.path !== '/resetPassword') {
        // 从中台跳转过来
        if (getPar('jumpTarget', to.fullPath)) {
            if (to.path === '/workermanager'
                || to.path === '/workorders'
                || to.path === '/detailPurchase' //采购单详情
                || to.path === '/materialDetail' //到料单详情
                || to.path === '/return/detail' //退料单详情
                || to.path === '/allReportBillDetail' //外发完成单详情
                || to.path === '/stockDetail' // 发货单详情、退货单详情
            ) {
                var obj = {
                    userId: getPar('useId', to.fullPath),
                    unitId: getPar('unitId', to.fullPath),
                }
                doLoginToFactory(obj).then(res => {
                    /**
                     * res.code //0登录成功
                     */
                    if (res.data.code == 0) {
                        let isLogin = {
                            isLogin: true,
                            userId: res.data.userId
                        };
                        sessionStorage.setItem("isLogin", JSON.stringify(isLogin));
                        sessionStorage.setItem(
                            "user_login",
                            JSON.stringify(res.data)
                        );

                        if (res.data.unitId) {
                            //token后台暂时提供不了
                            let params = {
                                appId: config.appId.appId,
                                token: "",
                                userId: res.data.userId
                            };
                            //根据返回的字段查询默认工厂的具体信息
                            getMyInfo(params).then(async (res) => {
                                if (res.data.code == 0) {
                                    //成功
                                    // _this.user_info = res.data.data;
                                    sessionStorage.setItem(
                                        "user_info",
                                        JSON.stringify(res.data.data)
                                    );
                                    // 报存信息在store
                                    store.dispatch('getFacs');
                                    store.dispatch('getUserInfo', obj.unitId);
                                }
                            });
                        }
                        //获取最后登录的工厂信息
                        let params = {
                            token: "",
                            userId: res.data.userId,
                            // facId: 'c41773628bc14927bfa3cdc22d728b5f'
                            facId: res.data.unitId
                        };
                        getFacInfo(params).then(res => {
                            sessionStorage.setItem("last_login", JSON.stringify(res.data));

                            // 获取last_login后再让跳转，防止报错
                            NProgress.start()
                            next();
                        });
                    } else {
                        next({
                            path: '/login',
                            query: {redirect: to.fullPath}
                        })
                    }

                })
            }
        } else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }

    } else {
        NProgress.start()
        next();
    }

})
router.afterEach((transition) => {
    NProgress.done();
});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    components: {'barcode': VueBarcode},
    render: h => h(App)
}).$mount('#app')


