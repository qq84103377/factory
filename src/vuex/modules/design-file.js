const state = {
    designStyleNo: ''
}

const mutations = {
    SET_STYLE_NO(state, data) {
        state.designStyleNo = data;
    }
}

const actions = {
    setDesignStyleNo({ state, commit }, data) {
        commit('SET_STYLE_NO', data);
    }
}

export default {
    state,
    mutations,
    actions
}