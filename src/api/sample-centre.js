import axios from './config';
/*
    设计节点API
*/

// 查询所有节点类型接口
export const getDesignNodeType = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/type`, {params: params})
};

// 新建工序节点接口
export const createDesignNode = params => {
    return axios.post(`/v1/api/spl/design/prcd/node/save`, params)
};
// 配置可编辑字段弹窗数据接口
export const targetField = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/target-field`, {params: params})
};

// 工序节点列表接口
export const getDesignNodeList = params => {
    return axios.post(`/v1/api/spl/design/prcd/node/list`, params)
};

// 修改工序节点名称接口
export const editDesignNodeName = params => {
    return axios.put(`/v1/api/spl/design/prcd/node/name`, params);
};

// 删除工序节点接口
export const deleteDesignNodeName = params => {
    return axios.delete(`/v1/api/spl/design/prcd/node/${params.prcdNodeId}`, params);
};

// 新建设计工序模板
export const addDesignTemplate = params => {
    return axios.post(`/v1/api/spl/design/prcd/node/template/add`, params)
};

// 设计工序模板列表接口
export const getDesignTemplateList = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/template/list`, {params: params})
};

// 设计工序模板详情接口
export const getDesignTemplateDetail = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/template/${params.templateId}`, {params: params})
};

// 删除工序模板详情
export const deleteDesignTemplate = params => {
    return axios.delete(`/v1/api/spl/design/prcd/node/template/${params.templateId}`, params)
};

// 编辑设计工序模板
export const editDesignTemplate = params => {
    return axios.post(`/v1/api/spl/design/prcd/node/template/update/${params.templateId}`, params)
};

/*
    设计节点API--END
*/

/*
    设计工单API--START
*/
// 设计款号查重
export const queryDesignStyleNoRepeat = params => {
    return axios.get(`/v1/api/spl/designstyle/queryDesignStyleNoRepeat`, {params: params})
};

// 新建设计工单
export const addDesignMission = params => {
    return axios.post(`/v1/api/spl/design/mission/add`, params)
};

// 撤销工单
export const cancelDesignMission = params => {
    return axios.get(`/v1/api/spl/design/mission/cancel`, {params: params})
};

// 编辑设计工单
export const editDesignMission = params => {
    return axios.post(`/v1/api/spl/design/mission/update/${params.missionId}`, params)
};
// 设计工单列表
export const getDesignMissionList = params => {
    return axios.post(`/v1/api/spl/design/mission/list`, params)
};
// 设计工单表单列表
export const getDesignMissionTableList = params => {
    return axios.post(`/v1/api/spl/design/mission/tableList`, params)
};

// 设计工单详情
export const getDesignMissionDetail = params => {
    return axios.get(`/v1/api/spl/design/mission/detail/${params.missionId}`, { params: params })
};

// 设计工单工序节点详情接口
export const getDesignMissionNodeDetail = params => {
    return axios.get(`/v1/api/spl/design/mission/prcd-node/detail/${params.nodeId}`, { params: params })
};

// 修改节点信息接口
export const editDesignNodeInfo = params => {
    return axios.put(`/v1/api/spl/design/mission/prcd-node/info/${params.missionPrcdNodeId}`, params);
};

// 修改节点状态接口
export const editDesignNodeStatus = params => {
    return axios.put(`/v1/api/spl/design/mission/prcd-node/status/${params.missionPrcdNodeId}`, params);
};

// 节点备注相关接口
export const addDesignNodeRemark = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/notify/note`, params)
};

// 修改备注
export const editDesignNodeRemark = params => {
    return axios.put(`/v1/api/spl/design/mission/prcd-node/notify/note`, params)
};

//
// 备注的信息获取
export const getDesignNodeRemarkInfo = params => {
    return axios.get(`/v1/api/spl/design/mission/prcd-node/notify/info/${params.notifyId}`, { params: params })
};

// 删除备注
export const deleteDesignNodeRemark = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/notify/note/deleted`, params)
};

// 提交审核接口
export const designNodeSubmit = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/submit`, params)
};

// 审核接口
export const designNodeReview = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/review`, params)
};

// 撤销作废样衣接口
export const cancelDesignNodeSample = params => {
    return axios.put(`/v1/api/spl/design/mission/prcd-node/sample/undo/cancel`, params)
};

// 作废样衣接口
export const deleteDesignNodeSample = params => {
    return axios.put(`/v1/api/spl/design/mission/prcd-node/sample/cancel`, params)
};

// 设计工单节点查看全部动态接口
export const getDesignNodeDynamicList = params => {
    return axios.get(`/v1/api/spl/design/mission/prcd-node/log`, { params: params })
};

// 生成商品档案查询弹窗接口
export const getDesignNodeGenerateStyle = params => {
    return axios.get(`/v1/api/spl/design/mission/prcd-node/generate-style-pop`, { params: params })
};

export const createDesignNodeGenerateStyle = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/generate-style`, params)
};

// 获取工单节点列表和节点的信息
export const getEditDesignMissionNodeInfo = params => {
    return axios.get(`/v1/api/spl/design/mission/nodes/${params.missionId}`, { params: params })
};


export const updateDesignMissionPriority = params => {
    return axios.get(`/v1/api/spl/design/mission/setPriority`, { params: params })
};

// 获取体系下面的所有设计款号和id（根据工厂id）
export const getDesignStyleList = params => {
    return axios.get(`/v1/api/spl/designstyle/stylesName`, { params: params })
};
/*
    设计工单API--END
*/



/*
    设计工作台API--START
*/
// 获取设计工作台左侧菜单节点
export const designWorkbenchNodeList = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/prcd-node`, { params: params })
};

// 工作台节点数据查询
export const designWorkbenchNode = params => {
    return axios.put(`/v1/api/spl/design/mission/workspace/node`,  params)
};

// 工作台节点状态下拉数据查询接口
export const designWorkbenchNodeStatusList = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/filter-data`, { params: params })
};

// 回退节点
export const designWorkbenchBackNode = params => {
    return axios.put(`/v1/api/spl/design/mission/workspace/back`,  params)
};

//设置提报人以及设置版师以及设置样衣师接口
export const designWorkbenchSetSubmitter = params => {
    return axios.post(`/v1/api/spl/design/mission/workspace/submitter`,  params)
};

//节点通过接口
export const designWorkbenchNodePass = params => {
    return axios.put(`/v1/api/spl/design/mission/workspace/pass`,  params)
};

// 获取难度系数难度分类列表
export const designWorkbenchPatternStyleList = params => {
    return axios.get(`/v1/api/spl/designstyle/patternStyleList/${params.nodeType}`)
};

// 获取难度系数难度分类列表
export const designWorkbenchPatternDifficultyList = params => {
    return axios.get(`/v1/api/spl/designstyle/patternDifficultyList/${params.nodeType}`)
};

//分配版师
export const designWorkbenchAllocationMachinist = params => {
    return axios.post(`/v1/api/spl/designstyle/allocationMachinist`,  params)
};

//分配样衣师
export const designWorkbenchAllocationSampleDesigner = params => {
    return axios.post(`/v1/api/spl/designstyle/allocationSampleDesigner`,  params)
};

//设计档案批量淘汰
export const designWorkbenchListEliminate = params => {
    return axios.post(`/v1/api/spl/designstyle/list/eliminate`,  params)
};

//设计档案批量恢复
export const designWorkbenchListRegain = params => {
    return axios.post(`/v1/api/spl/designstyle/list/Regain`,  params)
};

// 查询所有评审意见接口
export const designWorkbenchReviewOpninoinsList = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/review/log`, {params: params})
};

// 新增或更新评审意见接口
export const designWorkbenchReviewOpninoinsUpdate = params => {
    return axios.put(`/v1/api/spl/design/mission/workspace/review/log`,  params)
};

// 删除评审意见接口
export const designWorkbenchReviewOpninoinsDelete = params => {
    return axios.delete(`/v1/api/spl/design/mission/workspace/review/log`, {params: params})
};


//修改难度系数
export const designWorkbenchUpdateDifficulty = params => {
    return axios.post(`/v1/api/spl/designstyle/updateDifficulty`,  params)
};

// 设计节点管理获取配置可编辑字段和生成商品默认字段
export const getNodeDesignDialogFields = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/editConfig`, {params: params})
};

// 获取样师报表和版师报表 reportType： sampleDesignerPaymentReport 样衣师 machinistPaymentReport版师
export const getReportType = params => {
    return axios.post(`/v1/api/spl/designstyle/${params.reportType}`,  params)
};
// 样师报表和版师报表导出
export const getReportExcel = params => {
    return axios.post(`/v1/api/spl/designstyle/exportExcelForSampleDesignerOrMachinist`,  params,{
        responseType: 'blob'
    })
};
// 样师报表和版师报表的节点下拉
export const getNodesNames = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/nodesName`, {params: params})
};
// 设计节点管理更新配置可编辑字段和生成商品默认字段
export const updateNodeDesignDialogFields = params => {
    return axios.post(`/v1/api/spl/design/prcd/node/updateConfig`,  params)
};

// 设计档案获取配置可编辑字段
export const getDesignDialogFields = params => {
    return axios.get(`/v1/api/spl/designstyle/editConfig`, {params: params})
};

// 设计档案更新配置可编辑字段
export const updateDesignDialogFields = params => {
    return axios.post(`/v1/api/spl/designstyle/updateConfig`,  params)
};

// 通过接口
export const missionWorkspacePass = params => {
    return axios.put(`/v1/api/spl/design/mission/workspace/pass`,  params)
};

// 设计档案检测必填
export const checkOnForward = params => {
    return axios.post(`/v1/api/spl/designstyle/checkOnForward`,  params)
};

// 新建设计档案提报检测必填
export const createDesignstyleCheckOnForward = params => {
    return axios.post(`/v1/api/spl/designstyle/checkOnAddDesignStyleForward?unitId=${params.unitId}`,  params)
};
//设计工序节点排序接口
export const nodeSeqencing = params => {
    return axios.get(`/v1/api/spl/design/prcd/node/seqencing`, {params:params});
}

// 批量通过设计档案并生成或更新商品接口
export const bathLastReviewPassAndUpdateGoods = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/bath-generate-style`,  params)
};

//  导出通过设计档案并生成或更新商品结果列表接口
export const bathLastReviewPassAndUpdateGoodsFailList = params => {
    return axios.post(`/v1/api/spl/design/mission/prcd-node/exportErrorExcel`,  params,{
        responseType: 'blob'
    })
};

//  设计档案导入模板下载
export const designstyleImportExcelTemplete = params => {
    return axios.post(`/v1/api/spl/designstyle/importExcelTemplete`,  params,{
        responseType: 'blob'
    })
};



/*
    设计工作台API--END
*/
