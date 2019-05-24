const state = {
    visitedViews: [],
    keepAliveArr: [],
    excludeAlive: []
}

const mutations = {
    ADD_VISITE_VIEW(state, view) {
        const index = state.visitedViews.findIndex(item => view.path === item.path );
        if (index === -1) {
            state.visitedViews.push(view);
        }
        else {
            state.visitedViews.splice(index, 1, view);
        }
    },
    DEL_VISITE_VIEW(state, view) {
        const index = state.visitedViews.findIndex(item => item.path === view.path);
        if (index > -1) {
            state.visitedViews.splice(index, 1);
        }
    },
    DEL_OTHERS_VIEW(state, view) {
        state.visitedViews = state.visitedViews.filter(item => item.path === view.path);
    },
    DEL_ALL_VIEW(state) {
        state.visitedViews = [];
    },
    ADD_KEEP_LIVE(state, name) {
        const bol = state.keepAliveArr.some(item => name === item) ;
        if (!bol) {
            state.keepAliveArr.push(name);
        }
    },
    DEL_VISITE_LIVE(state, name) {
        const index = state.keepAliveArr.findIndex(item => item === name);
        if (index > -1) {
            state.keepAliveArr.splice(index, 1);
            // state.excludeAlive
        }
    },
    DEL_KEEP_LIVE(state) {
        state.keepAliveArr = [];
    }
}

const actions = {
    addVisitedView({ commit }, view) {
        commit('ADD_VISITE_VIEW', view);
    },
    deleteVisitedView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_VISITE_VIEW', view);
            resolve([...state.visitedViews]);
        });
    },
    deleteOthersView({ commit, state }, view) {
        return new Promise(resolve => {
            commit('DEL_OTHERS_VIEW', view);
            resolve([...state.visitedViews]);
        });
    },
    deleteAllView({ commit, state }) {
        commit('DEL_ALL_VIEW');
    },
    addKeepLive({ commit }, view) {
        commit('ADD_KEEP_LIVE', view);
    },
    deleteVisitedLive({ commit }, name) {
        commit('DEL_VISITE_LIVE', name);
    },
    deleteKeepLive({ commit, state }) {
        commit('DEL_KEEP_LIVE');
    },
}

export default {
    state,
    mutations,
    actions
}