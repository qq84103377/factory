import { getDesignMissionNodeDetail } from '@/api/sample-centre';
const state = {
    formData: {
        // designStyleNo: ''
    },
    //节点详情数据
    nodeDetailData: {}
}

const mutations = {
    SET_FORM_DATA(state, data) {
        state.formData = data;
    },
    SET_NODE_DETAil_DATA(state, data) {
        state.nodeDetailData = data;
    }
}

const actions = {
    setFormData({ state, commit }, data) {
        commit('SET_FORM_DATA', data);
    },
    async fetchDesignNodeDetail({ state, commit }, params) {
        const res = await getDesignMissionNodeDetail(params);
        commit('SET_NODE_DETAil_DATA', res.data.data);
        return res;
    }
}

export default {
    state,
    mutations,
    actions
}