const state = {
    goodList: [],
    noticeNum: 0
}

const mutations = {
    setGoodList(state, data) {
        state.goodList = data;
    },
    setNoticeNum(state, data) {
        state.noticeNum = data;
    },
}

export default {
    state,
    mutations
}
