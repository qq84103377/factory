import axios from '../config';
let base = process.env.BASE_URL + process.env.BASE_API;

// 获取生产中的工单
export const producingWorkOrder = params => {
    return axios.get(`v1/api/dashboard/missions/producing`, {
        params: { ...params }
    });
};
// 获取工单交期/生产状态
export const orderStatus = params => {
    return axios.get(`v1/api/dashboard/missions/delivering`, { params: params });
};
// 获取今日产能
export const todayProducing = params => {
    return axios.post(`v1/api/dashboard/capacity/summary/today`, params);
};

// 获取今日产能曲线
export const todayProducingCurve = params => {
    return axios.post(`v1/api/dashboard/capacity/today`, params);
};
// 获取七日合格产能曲线
export const weekProductingCurve = params => {
    return axios.post(`v1/api/dashboard/capacity/week`, params);
};

// 获取智能提醒
export const smartReminder = params => {
    return axios.get(`v1/api/dashboard/notifications`, {
        params: { ...params }
    });
};
// v1/api/dashboard/notifications

// 判断是否有权限查看动线报表
export const permissionOfLineReport = params =>
    axios.get(`v1/api/fac/reportStatistics/facMissionLineReportFormAuth`, {
        params: { ...params }
    })
// { post } /v1/api / facUser / getWorkbayListByFactoryId         10.牛厂查询工厂下所有工位，不分页
// 参数：
// {
//     "facId": "牛厂ID"
// }
export const workbayListByFactoryId = params =>
    axios.post(`v1/api / facUser / getWorkbayListByFactoryId`, params)