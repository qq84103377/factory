import axios from './config';
// ********采购规划接口 Start******** //

// "选择标签" 数据
export const getOtbCommonTag = params => {
    return axios.get(`/v1/api/otb/common/tag`, {params: params})
};

// 根据商品属性类型查找体系下所有该类型的商品属性
export const getCommonGoodsAttr = params => {
    return axios.get(`/v1/api/common-goods-attr`, {params: params})
};
// 根据商品属性类型查找体系下所有该类型的商品属性（编辑的时候，因为有负责人、审核人）
export const getGoodsAttrForUpdate = params => {
    return axios.get(`/v1/api/otb/template/attr-for-update`, {params: params})
};

// 采购模板新增接口
export const createOtbTemplate = params => {
    return axios.post(`/v1/api/otb/template`, params)
};

// 采购模板编辑接口
export const editOtbTemplate = params => {
    return axios.put(`/v1/api/otb/template`, params);
};

// 采购模板列表
export const getOtbTemplateList = params => {
    return axios.get(`/v1/api/otb/template`, {params: params})
};

// 采购模板详情
export const getOtbTemplateDetail = params => {
    return axios.get(`/v1/api/otb/template/${params.templateId}`, {params: params})
};

// 新建采购规划
export const createOtb = params => {
    return axios.post(`/v1/api/otb/create`, params)
};

// 更新采购规划
export const updateOtb = params => {
    return axios.post(`/v1/api/otb/update`, params)
};

// 通过模板id查询属性列表
export const getOtbListAttrsByTemplateId = params => {
    return axios.get(`/v1/api/otb/listAttrsByTemplateId`, {params: params})
};

// 采购规划列表
export const getOtbList = params => {
    return axios.get(`/v1/api/otb/getList`, {params: params})
};

// 更新采购规划
export const deleteOtb = params => {
    return axios.post(`/v1/api/otb/delete`, params)
};

// 采购规划详情
export const getOtbDetail = params => {
    return axios.get(`/v1/api/otb/getDetail`, {params: params})
};

// 采购企划单左边列表数据接口
export const getOtbActualOverview = params => {
    return axios.get(`/v1/api/otb/actual/overview`, {params: params})
};

// 第一个层级的汇总信息
export const getOtbActualSummaryFirst = params => {
    return axios.get(`/v1/api/otb/actual/summary/first`, {params: params})
};

// 普通层级的汇总信息(与第一级区分开)
export const getOtbActualSummary = params => {
    return axios.get(`/v1/api/otb/actual/summary`, {params: params})
};

// 支线拆解的汇总信息
export const getOtbActualBranchSummary = params => {
    return axios.get(`/v1/api/otb/actual/branch-supplier/summary`, {params: params})
};


// 层级拆解数据详情（非支线分支）
export const getOtbActualDetail = params => {
    return axios.post(`/v1/api/otb/actual/detail`, params)
};
// 层级拆解数据详情（支线分支）
export const getOtActualBranchDetail = params => {
    return axios.get(`/v1/api/otb/actual/branch-supplier/detail`, {params: params})
};

// 从excel导入拆解（非支线分支）
export const importApartFromExcel = params => {
    return axios.post(`/v1/api/otb/importApartFromExcel`, params)
};
// 从excel导入拆解（支线分支）
export const importBranchApartFromExcel = params => {
    return axios.post(`/v1/api/otb/importBranchApartFromExcel`, params)
};

// 导出excel拆解模板
export const exportApartExcelTemplate = params => {
    return axios.post('/v1/api/otb/exportApartExcelTemplate', params, {
        responseType: 'blob'
    })
};

// 中间页（支线拆解）
export const getBranchMiddlePageList = params => {
    return axios.get(`/v1/api/otb/actual/branch-supplier/middle-page`, {params: params})
};

// 中间页（非支线拆解）
export const getMiddlePageList = params => {
    return axios.get(`/v1/api/otb/actual/middle-page`, {params: params})
};

// 提报
export const otbDoReport = params => {
    return axios.post('/v1/api/otb/doReport', params)
};

// 审核
export const otbDoAudit = params => {
    return axios.post('/v1/api/otb/doAudit', params)
};

// 反审核
export const otbDoReAudit = params => {
    return axios.post('/v1/api/otb/doReAudit', params)
};
// ********采购规划接口 End******** //


// ********店铺档案接口 Start******** //

// 店铺属性列表
export const getStoreAttrs = params => {
    return axios.get(`/v1/api/fac/store/getStoreAttrs`, {params: params})
};

// 店铺列表
export const getStoreList = params => {
    return axios.post('/v1/api/fac/store/getList', params)
};


// 店铺详情
export const getStoreDetail = params => {
    return axios.get(`/v1/api/fac/store/getDetail`, {params: params})
};

// 店铺excel导入
export const importStoreExcel = params => {
    return axios.post('/v1/api/fac/store/importStoreExcel', params)
};

// 导出店铺模板excel
export const exportStoreExcelTemplate = params => {
    return axios.post('/v1/api/fac/store/exportStoreExcelTemplate',  params, {
        responseType: 'blob'
    })
};

// 导出失败excel
export const exportErrorExcel = params => {
    return axios.post('/v1/excel/import/exportErrorExcel', params,{
        responseType: 'blob'
    })
};


// 删除店铺
export const deleteStore = params => {
    return axios.get(`/v1/api/fac/store/deleteStore`, {params: params})
};

// 设置店铺停用启用状态
export const setStoreStatus = params => {
    return axios.get(`/v1/api/fac/store/setStatus`, {params: params})
};

// ********店铺档案接口 End******** //



// ********销售计划接口 Start******** //

// 新增销售计划
export const addSalesPlan = params => {
    return axios.post('/v1/api/fac/salePlan/add', params)
};

// 编辑销售计划
export const editSalesPlan = params => {
    return axios.post('/v1/api/fac/salePlan/edit', params)
};

// 销售计划列表
export const getSalesPlanList = params => {
    return axios.get(`/v1/api/fac/salePlan/getList`, {params: params})
};

// 销售计划详情
export const getSalesPlanDetail = params => {
    return axios.get(`/v1/api/fac/salePlan/getDetail`, {params: params})
};

// 删除销售计划
export const deleteSalesPlan = params => {
    return axios.get(`/v1/api/fac/salePlan/delete`, {params: params})
};

// 销售计划记录详情
export const getSalesPlanRecordDetail = params => {
    return axios.post('/v1/api/fac/salePlan/detail/getDetail', params)
};

// 添加店铺到销售计划
export const addStoreToSalesPlan = params => {
    return axios.post('/v1/api/fac/salePlan/detail/addStore', params)
};

// 编辑销售计划记录
export const editSalesPlanRecord = params => {
    return axios.post('/v1/api/fac/salePlan/detail/editRecord', params)
};

// 销售计划记录批量删除
export const doRecordBatchDelete = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchDelete', params)
};

// 销售计划记录批量设置负责人
export const doRecordBatchLeader = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchLeader', params)
};

// 销售计划记录批量提报
export const doRecordBatchReport = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchReport', params)
};

// 销售计划记录批量通过
export const doRecordBatchPass = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchPass', params)
};

// 销售计划记录批量驳回
export const doRecordBatchReject = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchReject', params)
};

// 销售计划记录批量反审核
export const doRecordBatchReAudit = params => {
    return axios.post('/v1/api/fac/salePlan/detail/doRecordBatchReAudit', params)
};

// 销售计划提报
export const doPlanReport = params => {
    return axios.get('/v1/api/fac/salePlan/detail/doPlanReport', {params:params})
};

// 销售计划审核
export const doPlanAudit = params => {
    return axios.get('/v1/api/fac/salePlan/detail/doPlanAudit', {params:params})
};

// 销售计划反审核
export const doPlanReAudit = params => {
    return axios.get('/v1/api/fac/salePlan/detail/doPlanReAudit', {params:params})
};

// 销售计划excel导入
export const importSalesPlanFromExcel = params => {
    return axios.post('/v1/api/fac/salePlan/detail/importFromExcel', params)
};

// 导出店铺模板excel
export const exportSalesPlanExcelTemplate = params => {
    return axios.post('/v1/api/fac/salePlan/detail/exportApartExcelTemplate',  params, {
        responseType: 'blob'
    })
};


// ********销售计划接口 End******** //



// ********企划执行工作看板 Start******** //

// 销售计划反审核
export const getOtbBackConfigList = params => {
    return axios.get('/v1/api/otb/back/config/getConfigList', {params:params})
};

// 更新组织企划回流配置
export const updateOtbBackConfig = params => {
    return axios.put(`/v1/api/otb/back/config/updateConfig`, params)
};

// 获取简单的企划列表
export const getOtbSimpleList = params => {
    return axios.get('/v1/api/otb/actual/getOtbSimpleList', {params:params})
};

// 根据层级id获取层级的数据
export const getOtbLevels = params => {
    return axios.get('/v1/api/otb/actual/getLevels', {params:params})
};

// 获取下一个标签的下拉数据
export const getNextTagAttrList = params => {
    return axios.post('/v1/api/otb/back/config/getNextTagAttrList', params)
};

// 企划回流具体配置详情
export const getOtbBackConfigDetail = params => {
    return axios.get('/v1/api/otb/back/config/detail',{params:params})
};


// 新建或者编辑企划回流的具体配置
export const updateOtbBackPanel = params => {
    return axios.post('/v1/api/otb/back/config/addOrUpdate', params)
};


// ********企划执行工作看板 End******** //


