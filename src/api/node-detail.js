import axios from './config';

export const ligationStatusList = params => {
    return axios.post(`/v1/api/fac-mission-prcd-nodes/ligationStatusList`, params)
}

// 获取当前节点未上报的扎号列表
export const getLigationListWithoutReport = params => {
    return axios.get(`/v1/api/fac-mission-prcd-nodes/getLigationListWithoutReport`, { params })
}

// 数量，总数，出库，入库 节点 关联扎号上报
export const ligationNodeReport = params => {
    return axios.post(`/v1/api/fac-mission-prcd-node-reports/ligationNodeReport`, params)
}

export const exportExcelLigation = params => {
    return axios.post(`/v1/api/fac-mission-prcd-nodes/generateExcelForLigation`, params, {
        responseType: 'blob'
    });
};
// 次品列表接口
export const defectivesListReq = params =>
    axios.post(`v1/api/fac-mission-prcd-node-reports/getDefectives`, params)
// 次品列表接口-质检节点使用
export const getDefectiveoutsides = params =>
    axios.post(`v1/api/fac-mission-prcd-node-reports/getDefectiveoutsides`, params)
// 质检次品筛选页--获取床次
export const defectiveLatheList = params =>
    axios.get(`v1/api/fac-mission-prcd-node-reports/getLathe`, { params: params })

// 质检次品筛选页--获取扎号
export const defectiveLigationList = params =>
    axios.get(`v1/api/fac-mission-prcd-node-reports/getLigationNo`, { params: params })