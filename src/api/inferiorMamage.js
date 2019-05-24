import axios from './config';

let config = {
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    }
};

/*********************次品管理*********************/
// 次品返修详情
export const inferiorRepairDetails = params => {
    return axios.post('/v1/api/defectived/repairDetails', params, config)
};
// SKU(颜色、尺码、内长)列表接口
export const getSkuAttrList = params => {
    return axios.get(`/v1/api/fac/unit/settings/getSkuAttrList`, {params: {...params}}, config);
};
// 获取生产工单列表接口
export const simpleMissionList = params => {
    return axios.get(`/v1/api/fac/mission/simpleMissionList`, {params: {...params}}, config);
};
// 次品管理列表接口
export const defectivedList = params => {
    return axios.post('/v1/api/defectived/list', params, config);
};
// 数量明细型节点列表接口
export const quantityDetails = params => {
    return axios.get(`/v1/api/prcd-nodes/quantity-details`, {params: {...params}}, config);
};
// 次品管理列表接口
export const inferiorRepairConfirm = params => {
    return axios.post('/v1/api/defectived/repairConfirm', params, config);
};
// 全部次品管理单据列表接口
export const allInferiorRepairList = params => {
    return axios.post('/v1/api/bill-repair/list', params, config);
};
// 次品返修详情
export const billInferiorRepairDetails = params => {
    return axios.get(`/v1/api/bill-repair/details`, {params: {...params}}, config);
};
// 次品批量合格
export const inferiorRepairQualifyBatch = params => {
    return axios.put(`/v1/api/defectived/qualifyBatch`, params, config)
};
// 次品批量再修
export const inferiorRepairRepairBatch = params => {
    return axios.put(`/v1/api/defectived/repairBatch`, params, config)
};
// 次品批量报废
export const inferiorRepairWasteBatch = params => {
    return axios.put(`/v1/api/defectived/wasteBatch`, params, config)
};
// 质检节点查看次品返修详情
export const qualityDefectivedDetails = params => {
    return axios.get(`/v1/api/defectived/details`, {params: {...params}}, config);
};
// 次品返修单撤销
export const billRepairUndo = params => {
    return axios.get(`/v1/api/bill-repair/undo`, {params: {...params}}, config);
};




























