const types = {
    REMARK_ADD: 'REMARK_ADD',
    REMARK_EDIT: 'REMARK_EDIT',
    HANDLE_DIALOG: 'CLOSE_DIALOG',
    HANDLE_REPORTDIALOG: 'HANDLE_REPORTDIALOG', // 设置上报组件Id
    SET_NODEINFO: 'SET_NODEINFO' // 设置快速上报的节点信息
}
const state = {
    remarkDialogVisible: false,
    isShowReportDialog: false,
    remark: {
        type: 'new', // 添加新备注
        data: {}, // 节点详情数据
        instance: null // 节点实例
    },
    nodeInfo: {
    }
}

const mutations = {
    [types.REMARK_ADD](state, remark) {
        state.remark = remark;
    },
    [types.HANDLE_DIALOG](state, { visible }) {
        state.remarkDialogVisible = visible;
    },
    [types.REMARK_EDIT](state, remark) {
        state.remark = remark;
    },
    [types.HANDLE_REPORTDIALOG](state, isShowReportDialog) {
        state.isShowReportDialog = isShowReportDialog;
    },
    [types.SET_NODEINFO](state, data) {
        state.nodeInfo = data
    }
}

const actions = {
    remarkAdd({commit, state}, payload) {
        commit(types.REMARK_ADD, payload);
    },
    remarkEdit({commit, state}, payload) {
        commit(types.REMARK_EDIT, payload);
    },
    handleDialog({commit, state}, payload) {
        commit(types.HANDLE_DIALOG, payload);
    },
    handleReportDialog({ commit }, payload) {
        commit(types.HANDLE_REPORTDIALOG, payload);
    },
    setNodeInfo({ commit }, payload) {
        commit(types.SET_NODEINFO, payload);
    }
}

export default {
    state,
    mutations,
    actions
}
