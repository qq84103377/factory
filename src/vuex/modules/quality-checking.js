const state = {
    editRow: {}
}

const mutations = {
    SET_EDIT_ROW(state, row) {
        state.editRow = row;
    }
}

const actions = {
    setEditRow({ state, commit }, row) {
        commit('SET_EDIT_ROW', row);
    }
}

export default {
    state,
    mutations,
    actions
}