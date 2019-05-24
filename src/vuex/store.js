import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
import * as getters from './getters'
import Stock from './modules/stock'
import Mission from './modules/mission'
import TabView from './modules/tab-view';
import QualityChecking from './modules/quality-checking';
import DesignMission from './modules/design-mission';
import DesignFile from './modules/design-file';
import {
    getEasyFactorys,
    getMyInfo
} from '@/api/api';

// Vue.use(Vuex)

// 应用初始状态
const state = {
    updataPwdVisible: true,
    rongYunRes: {},
    missionMsg: {},
    detailed: '',
    facs: [],
    fac: {},
    userInfo: {},
    scanInfo: {},
    userLogin: {}, // 用户登录信息
    outSideFlag:'',//整单外发的标志位
    LoginTimes:100,
    outsideFactoryList:[],//节点外发厂信息
}

// 定义所需的 mutations
const mutations = {
    UPDATAPWD(state) {
        state.updataPwdVisible = !state.updataPwdVisible;
    },
    getRongYunRes(state, res) {
        res.defineHash = +new Date();
        state.rongYunRes = res;
        state.missionMsg = res;
    },
    changeNodeDetailed(state, type) {
        //alert(`当前状态 ${type} => ${type?'去列表':'去详情'}`)
        state.detailed = type;
    },
    setFacs(state, data) {
        state.facs = data;
    },
    setFac(state, data) {
        state.fac = data;
    },
    setUserInfo(state, data) {
        state.userInfo = data;
    },
    setScanInfo(state, data) {
        state.scanInfo = data;
    },
    /*
     * 项目中获取ID的方式各不相同，为保证向后兼容，同一份数据需存储多份，
     * 望后来者在需要用到userID或者unitID时统一使用mapGetters 去获取state里的userLogin，
     * 以便于统一管理该数据
     * rico. 2018.03.20
     *
     */
    setLoginData(state, data) {
        state.userLogin = data;
    },
    setLoginTimes(state,data) {
        state.LoginTimes = data;
    },
    setOutSideFlag(state,data) {
        state.outSideFlag = data;
    },
    setOutsideFactoryList(state,data) {
        state.outsideFactoryList = data;
    },
}

const actions = {
    changeNodeDetailed: ({
        commit
    }, type) => commit('changeNodeDetailed', type),
    // 获取工厂列表
    getFacs: async ({
        commit
    }, type) => {
        let user_login;
        if (!state.userLogin.userId) {
            await commit('setLoginData', JSON.parse(sessionStorage.getItem('user_login')));
        }
        let params = {
            "token": '',
            "userId": state.userLogin.userId
        }
        let data = await getEasyFactorys(params);
        commit('setFacs', data.data);
    },
    // 获取整单外发标志位
    getOutSideFlag: ({
        commit
    }, flag) => commit('setOutSideFlag', flag),
    // 获取节点外发厂具体信息
    getOutsideFactoryList: ({
        commit
    }, data) => commit('setOutsideFactoryList', data),
    // 获取用户信息
    getUserInfo: async ({
        commit
    }, ztJumpId) => {
        let user_login;
        if (!state.userLogin.userId) {
            await commit('setLoginData', JSON.parse(sessionStorage.getItem('user_login')));
        }
        let params = {
            "token": '',
            "userId": state.userLogin.userId
        }
        let data = await getMyInfo(params);
        if (data.data.code === 0) {
            if(ztJumpId){
                data.data.data.lastLoginFactoryId = ztJumpId
            }
            sessionStorage.setItem("user_info", JSON.stringify(data.data.data));
            commit('setUserInfo', data.data.data);
        }
    }
}

// 创建 store 实例
export default new Vuex.Store({
    modules: {
        Stock,
        Mission,
        TabView,
        QualityChecking,
        DesignMission,
        DesignFile
    },
    state,
    mutations,
    getters,
    actions
})
