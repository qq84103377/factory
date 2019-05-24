import axios from './config';
// 1. 获取数量型节点的上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/quantitative

// 2. 获取裁床数量型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/actual_cutting

// 3. 获取质检型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/quality_checking

// 4. 获取总数型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/total

// 5. 获取尾部入库型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/tail_in_store

// 6. 获取出库型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/tail_out_store

// 7. 获取物料库型节点上报记录API
// GET /new-mf-fac/v1/api/fac-mission-prcd-node-reports/工单工序节点ID/material

// 8. 抽检型节点上报记录查询
// GET /v1/api/fac-mission-prcd-node-reports/xxx(当前工单节点的id)/select_check
export const getReportRecord = params => {
    return axios.get(`/v1/api/fac-mission-prcd-node-reports/${params.instanceId}/${params.type}`,{ params: params });
};
// DELETE /new-mf-fac/v1/api/fac-mission-prcd-node-reports/undo/上报日志的ID
export const deleteReport = params => {
    return axios.delete(`/v1/api/fac-mission-prcd-node-reports/undo/${params.logId}`,{ params: params });
};