import axios from './config';

// quantitative 数量型
// actual-cutting 裁床数量
// total 总数型
// tail-in-store 入库型
// tail-out-store // 出库型
// material 到料型
// select_check 抽检型
export const commonNodeReport = params => {
    return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/${params.typeCode}`, params)
}