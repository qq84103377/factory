import axios from '../config';
let base = process.env.BASE_URL + process.env.BASE_API;

export const FacEmolumentReportList = params => {
    return axios.post(
        `v1/api/fac/reportStatistics/queryFacEmolumentReportList`,
        params
    );
};

export const UnitAllUser = params => {
    return axios.post(`v1/api/unit/querySysUnitAllUser`, params);
};

export const queryProgress = params => {
    return axios.post(`v1/api/fac/reportStatistics/queryProgress`, params);
};

export const downloadExcel = params => {
    return `${base}/v1/api/fac/form/manage/downloadExcel?type=${params.type}`;
};

export const exportReport = params => {
    return `${base}/v1/api/fac/form/manage/downloadExcel?type=${params.type}`;
};
