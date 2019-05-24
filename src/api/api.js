import axios from './config';
import md5 from 'js-md5';
// let base = process.env.BASE_API;
const _env = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';
import QiNiu from '../config/qiniu';
let Base64 = require('js-base64').Base64;
let config = {
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
  }
};
let configUpload = {
  headers: {
    'accept': 'application/json',
    'content-type': 'multipart/form-data',
  }
};

// let config = axios.create({
//     headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Cookie': ""
//     },
//     withCredentials: true // 允许携带cookie
//   })

//workbayLogin - 牛厂工位登录
export const workbayLogin = params => {
  return axios.post(`/v1/api/login/workbayLogin`, params, config)
};
//doLoginToFactory - 牛厂跳转登录登录
export const doLoginToFactory = params => {
  return axios.post(`/v1/api/login/doLoginToFactory`, params, config)
};
//doLogin - 登录牛系列产品
export const doLogin = params => {
  //添加了new-mf-dev
  return axios.post(`/v1/api/login/doLogin`, params, config)

};

//checkLoginName - 验证帐号
export const checkLoginName = params => {
  return axios.post(`/v1/api/login/checkLoginName`, params, config)
};

//checkPhone - 验证手机号
export const checkPhone = params => {
  return axios.post(`/v1/api/login/checkPhone`, params, config)
};

//createUnit - 创建牛系列组织
export const createUnit = params => {
  return axios.post(`/v1/api/Unit/createUnit`, params, config)
};


//sendMsg - 牛工厂发送短信验证码
export const sendMsg = params => {
  return axios.post(`/v1/api/register/sendMsg`, params, config);
}


// - 牛工厂验证短信验证码
export const checkPhoneCaptcha = params => {
  return axios.get(`/v1/api/register/checkPhoneCaptcha`, { params: { ...params } }, config);
}

//doRegister - 牛系列产品注册
export const doRegister = params => {
  return axios.post(`/v1/api/register/doRegister`, params, config);
};


//resetPsw - Boss找回密码
export const resetPsw = params => {
  return axios.post(`/v1/api/fac/resetPsw`, params, config);
};

//resetPsw - Boss找回密码
export const resetWorkbayPsw = params => {
  return axios.post(`/v1/api/fac/resetWorkbayPsw`, params, config);
};


//FacUser - addWorkbay 牛厂新增工位
export const addWorkbay = params => {
  return axios.post(`/v1/api/facUser/addWorkbay`, params, config);
};


//FacUser - getMyInfo 获取用户个人信息
export const getMyInfo = params => {
  //添加new-mf-dev
  return axios.post(`/v1/api/facUser/getMyInfo`, params, config);
};

//FacUser - updateMyInfo 更新用户个人信息
export const updateMyInfo = params => {
  return axios.post(`/v1/api/facUser/updateMyInfo`, params, config);
};


//Factory - 牛厂-搜索工厂分组(ZHangRui)
export const selectGroups = params => {
  return axios.post(`/v1/api/fac/selectGroups`, params, config);
};

// Users - getEasyGroups  牛厂-获取工厂分组列表
export const getEasyGroups = params => {
  return axios.get(`/v1/api/fac/getEasyGroups`, { params: { ...params } }, config);
};

//工位分组列表树（含工厂名称）
export const queryFactoryGroupListAndUnit = params => {
  return axios.post(`/v1/api/fac/queryFactoryGroupListAndUnit`, params, config);
};

// Users - getEasyFactorys  牛厂-获取工厂列表
export const getEasyFactorys = params => {
  return axios.get(`/v1/api/fac/getEasyFactorys`, { params: { ...params } }, config);
};
// 新的获取工厂列表
export const getEasyLimitFactorys = params => {
  return axios.get(`/v1/api/fac/getEasyLimitFactorys`, { params: { ...params } }, config);
};

// //FacUser - selectGroups 更新用户个人信息
// export const selectGroups = params => {
//     return axios.post(`/v1/api/facUser/selectGroups`, params, config);
// };


//获取七牛云上传token
export const getUploadToken = params => {
  return axios.get(`/v1/api/public/getUploadToken`, { params: { ...params } }, config);
};

//上传图片的接口
export const upDetailImg = (params, con) => {
  var setImgKey = function () {
    let storeId = JSON.parse(sessionStorage.getItem('user_login')).userId;
    let date = +new Date() + '';
    return storeId + '_' + _env + '_' + md5(storeId + date);
  }

  return axios.post(QiNiu.upUrl + '/putb64/-1/key/' + Base64.encode(setImgKey()) + '/', params, con)
}

export const upDetailImgs = (params, con) => {
  return axios.post(QiNiu.upUrl, params, con)
}

//获取工厂信息的接口
export const getFacInfo = params => {
  return axios.get(`/v1/api/fac/getFacInfo`, { params: { ...params } }, config);
};


//-- addFacGroups-- 新增分组接口
export const addFacGroups = params => {
  return axios.post(`/v1/api/fac/addFacGroups`, params, config);
};

//--getFacCommonSettings--  牛厂获取体系层设置信息
export const getFacCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/getFacCommonSettings`, params, config);
};

//-- checkUnitName -- 组织名称查重
export const checkUnitName = params => {
  return axios.post(`/v1/api/unit/checkUnitName`, params, config);
};
// 获取体系下面的所有外发工厂的下拉
export const getFactorys = params => {
  return axios.get(`/v1/api/outside/factory/factorys`, { params: params }, config);
};

//-- addFacCommonSettings --牛厂新增体系层设置信息（单个操作)
export const addFacCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/addFacCommonSettings`, params, config);
}
//-- getFacCustomerList  牛厂-获取客户列表
export const getFacCustomerList = params => {
  return axios.get(`/v1/api/fac/customer/getFacCustomerList`, { params: { ...params } }, config)
};


//-- FacCustomer - 牛厂-新建客户
export const addFacCustomer = params => {
  return axios.post(`/v1/api/fac/customer/addFacCustomer`, params, config);
}

//-- checkFacCustomerName  - 牛厂-客户名查重
export const checkFacCustomerName = params => {
  return axios.get(`/v1/api/fac/customer/checkFacCustomerName`, { params: { ...params } }, config)
};

//--deleteFacCommonSettings - 牛厂删除体系层设置信息
export const deleteFacCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/deleteFacCommonSettings`, params, config)
};

//--selectFacCustomer -  牛厂-搜索客户
export const selectFacCustomer = params => {
  return axios.post(`/v1/api/fac/customer/selectFacCustomer`, params, config)
}

// 搜索床次
export const selectFacLathes = params => {
  // return axios.put(`/v1/api/fac/mission/unitLathes/${params.unitId}`, params, config);
  return axios.get(`/v1/api/fac/mission/unitLathes/${params.unitId}`, { params: params }, config)
}
// 库存单据备注模糊搜索
export const selectRemarks = params => {
  // return axios.put(`/v1/api/fac/mission/unitLathes/${params.unitId}`, params, config);
  return axios.get(`/v1/stock/change/remarks/`, { params: params }, config)
}
//-- updateFacCommonSettings -- 牛厂修改体系层设置信息
export const updateFacCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/updateFacCommonSettings`, params, config)
};

// FacCustomer - 牛厂-修改客户信息

export const updateFacCustomer = params => {
  return axios.post(`/v1/api/fac/customer/updateFacCustomer`, params, config)
};

//deleteFacCustomer - 牛厂-删除客户

export const deleteFacCustomer = params => {
  return axios.get(`/v1/api/fac/customer/deleteFacCustomer`, { params: { ...params } }, config)
};


//--updateFacCommonSettingsSort -- 牛厂修改体系层设置信息排序

export const updateFacCommonSettingsSort = params => {
  return axios.post(`/v1/api/fac/common/settings/updateFacCommonSettingsSort`, params, config)
};

//工位分组排序
export const updateFactoryGroupSort = params => {
  return axios.post(`/v1/api/fac/updateFactoryGroupSort`, params, config)
};

// fac/customer/getEasyCustomerList -- 获取搜索客户列表
export const getEasyCustomerList = params => {
  return axios.post(`/v1/api/fac/customer/getEasyCustomerList`, params, config)
};
//=================供应商begin====================


//FacSupplier - 牛厂-供应商名查重
export const checkFacSupplierName = params => {
  return axios.get(`/v1/api/fac/supplier/checkFacSupplierName`, { params: { ...params } }, config)
};

//FacSupplier - 牛厂-删除供应商
export const deleteFacSupplier = params => {
  return axios.get(`/v1/api/fac/supplier/deleteFacSupplier`, { params: { ...params } }, config)
};

//FacSupplier - 牛厂-修改供应商信息
export const updateFacSupplier = params => {
  return axios.post(`/v1/api/fac/supplier/updateFacSupplier`, params, config)
};

//FacSupplier - 牛厂-搜索供应商
export const selectFacSupplier = params => {
  return axios.post(`/v1/api/fac/supplier/selectFacSupplier`, params, config)
};

//FacSupplier - 牛厂-新建供应商
export const addFacSupplier = params => {
  return axios.post(`/v1/api/fac/supplier/addFacSupplier`, params, config)
};

//=================供应商end====================

// -- updateFacInfo -- 更新工厂信息
export const updateFacInfo = params => {
  return axios.post(`/v1/api/fac/updateFacInfo`, params, config)
};

// -- fac/unit/settings/getFacUnitSettings --获取组织层设置信息
export const getFacUnitSettings = params => {
  return axios.post(`/v1/api/fac/unit/settings/getFacUnitSettings`, params, config)
};

//工位分组商品属性配置下拉
export const getGoodsAttrConfigInfoByGroupId = params => {
  return axios.post(`/v1/api/factoryGroup/goodsAttr/getGoodsAttrConfigInfoByGroupId`, params, config)
};

//工位分组商品属性配置保存
export const updateGoodsAttrConfigInfo = params => {
  return axios.post(`v1/api/factoryGroup/goodsAttr/updateGoodsAttrConfigInfo`, params, config)
};

// 工位分组商品属性移除
export const removeGoodsAttr = params => {
  return axios.get(`/v1/api/factoryGroup/goodsAttr/removeGoodsAttr `, { params: { ...params } }, config)
};

// 工位分组商品属性配置品类移除接口
export const removeCategoryAttr = params => {
  return axios.post(`/v1/api/factoryGroup/goodsAttr/removeCategoryAttr`, params, config)
};

//货品sku属性列表
export const getCommonSkuAttrList = params => {
  return axios.post(`/v1/api/fac/unit/settings/getCommonSkuAttrList `, params, config)
};

// --fac/deleteFacGroups --  删除分组
export const deleteFacGroups = params => {
  return axios.get(`/v1/api/fac/deleteFacGroups`, { params: { ...params } }, config)
};

// -- fac/updateFacGroups -- 修改分组
export const updateFacGroups = params => {
  return axios.post(`/v1/api/fac/updateFacGroups`, params, config)
};

// -- fac/unit/settings/addFacUnitSettings -- 新增工厂信息
export const addFacUnitSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/addFacCommonSettings`, params, config)
};
// 新增颜色、尺寸、内长
export const addCommonSkuAttr = params => {
  return axios.post(`/v1/api/fac/common/settings/addCommonSkuAttr`, params, config)
};

// -- fac/unit/settings/deleteFacUnitSettings -- 删除工厂管理信息
export const deleteFacUnitSettings = params => {
  return axios.post(`/v1/api/fac/unit/settings/deleteFacUnitSettings`, params, config)
};

// -- fac/common/settings/selectFacCommonSettings -- 搜索公共体系下的信息
export const selectFacCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/selectFacCommonSettings`, params, config)
};

// -- fac/goods/addFacGoodsStyle -- 添加货品样式
export const addFacGoodsStyle = params => {
  return axios.post(`/v1/api/fac/goods/addFacGoodsStyle`, params, config)
};

// -- fac/goods/selectFacGoodsStyle -- 搜索货品管理，不添加keyword就是获取全部
export const selectFacGoodsStyle = params => {
  return axios.post(`/v1/api/fac/goods/selectFacGoodsStyle`, params, config)
};

// -- fac/goods/getFacGoodsStyle -- 查询当前货品信息
export const getFacGoodsStyle = params => {
  return axios.get(`/v1/api/fac/goods/getFacGoodsStyle`, { params: { ...params } }, config)
};

// -- fac/goods/updateFacGoodsStyle -- 修改货品信息
export const updateFacGoodsStyle = params => {
  return axios.post(`/v1/api/fac/goods/updateFacGoodsStyle`, params, config)
};

// -- /v1/api/fac/goods/judgeFacDelSku -- 判断货品能否删除
export const judgeFacDelSku = params => {
  return axios.post(`/v1/api/fac/goods/judgeFacDelSku`, params, config)
};

// --fac/goods/getFacGoodsPictureList --获取当前货品列表
export const getFacGoodsPictureList = params => {
  return axios.get(`/v1/api/fac/goods/getFacGoodsPictureList`, { params: { ...params } }, config)
};
// --获取商品所属的样衣档案列表
export const getGoodsSampleList = params => {
  return axios.get(`/v1/api/spl/sample/list`, { params: params }, config)
};
// --获取商品所属样衣档案下的某个样衣的工艺单详情
export const getGoodsClothesArtDetail = params => {
  return axios.get(`/v1/api/spl/sample/detail/processForm`, { params: { ...params } }, config)
};

// --获取样衣所在商品拥有的工艺单离列表
export const getGoodsArtsForClothes = params => {
  return axios.get(`/v1/api/spl/sample/list/processForm/${params.id}`, { params: params }, config)
};

// 删除商品样衣详情下的工艺单
export const deleteGoodsClothesArt = params => {
  return axios.delete(`/v1/api/spl/sample/delete/processForm`, { params: params }, config)
};
// 将商品已有工艺单关联到样衣详情中的工艺单
export const addGoodsArtToClothesDetail = params => {
  return axios.post(`/v1/api/spl/sample/add/processForm`, params, config)
};

// 获取商品拥有到bom列表
export const getGoodsBomList = params => {
  return axios.get(`/v1/api/spl/sample/list/bom/${params.id}`, { params: params }, config)
};

// 获取商品下样衣详情中的样衣bom(按物料sku查看)
export const getBomSkuForClothesInGoods = params => {
  return axios.get(`/v1/api/spl/sample/detail/materialSku/bom`, { params: params }, config)
};

// 删除商品样衣详情下的bom
export const deleteGoodsClothesBom = params => {
  return axios.delete(`/v1/api/spl/sample/delete/bom`, { params: params }, config)
};

//将商品bom表关联到商品详情下的样衣详情的bom
export const setGoodsClothesBom = params => {
  return axios.post(`/v1/api/spl/sample/add/bom`, params, config)
};


// -- api/fac/goods/getEasyGoodsList -- 搜索所有货品
//http://market-alpha.juniusoft.com/new-mf/v1/api/fac/goods/getEasyGoodsList?facId=08b4d3f357784d7bacedf5cb9ea1d3c5&keyword=A
export const getGoodsList = params => {
  return axios.get(`/v1/api/fac/goods/getGoodsList`, { params: { ...params } }, config)
};

// -- /v1/api/facUser/getOneWorkbay FacUser - 5.牛厂查询单个工位
export const getOneWorkbay = params => {
  return axios.post(`/v1/api/facUser/getOneWorkbay`, params, config)
};


// -- /v1/api/facUser/getWorkbayList FacUser - 5.牛厂查询全部工位 分页 v1/api/facUser/getWorkbayList
export const getWorkbayList = params => {
  return axios.post(`/v1/api/facUser/getWorkbayList`, params, config)
};


// -- /v1/api/facUser/getWorkbayListByFacId  - 5.牛厂查询全部工位 不分页 v1/api/facUser/getWorkbayList
export const getWorkbayListByFacId = params => {
  return axios.post(`/v1/api/facUser/getWorkbayListByFacId`, params, config)
};


// -- /v1/api/facUser/checkWorkbay FacUser - 5.牛厂工位去重 v1/api/facUser/checkWorkbay
export const checkWorkbay = params => {
  return axios.post(`/v1/api/facUser/checkWorkbay`, params, config)
};


// banWorkbay  FacUser - 8.牛厂老板禁用解禁工位
export const banWorkbay = params => {
  return axios.post(`/v1/api/facUser/banWorkbay`, params, config)
};


// updateWorkbay  updateWorkbay - 7.牛厂修改工位信息
export const updateWorkbay = params => {
  return axios.post(`/v1/api/facUser/updateWorkbay`, params, config)
};


// api/fac/goods/deleteFacGoods - 删除货品接口
export const deleteFacGoods = params => {
  return axios.get(`/v1/api/fac/goods/deleteFacGoods`, { params: { ...params } }, config);
};

// api/fac/deleteFactory -删除工厂
export const deleteFactory = params => {
  return axios.post(`/v1/api/fac/deleteFactory`, params, config)
};

//  fac/goods/checkFacGoodsStyle - 货品查重
export const checkFacGoodsStyle = params => {
  return axios.get(`/v1/api/fac/goods/checkFacGoodsStyle`, { params: { ...params } }, config);
};

// queryFacMissionList -  4.牛厂-任务列表查询
export const queryFacMissionList = params => {
  return axios.post(`/v1/api/fac/mission/queryFacMissionList`, params, config)
};

// 查询单个货品sku
export const getGoodSkuList = params => {
  return axios.get(`/v1/api/fac/goods/getFacGoodsSku`, { params: params }, config)
};

// =======================工序模板开始=============================
// facTaskNode/addTaskNode - 1.新增任务节点
export const addTaskNode = params => {
  return axios.post(`/v1/api/facTaskNode/addTaskNode`, params, config)
};

// facTaskNode/getDicReportTypeList - 2.获取所有的数据类型
export const getDicReportTypeList = params => {
  return axios.get(`/v1/api/facTaskNode/getDicReportTypeList`, { params: { ...params } }, config)
};

// facTaskNode/queryTaskNodeList - 3.获取节点列表，也是查询的接口
export const queryTaskNodeList = params => {
  return axios.post(`/v1/api/facTaskNode/queryTaskNodeList`, params, config)
};

// fac/template/addTemplate - 4.添加节点模板
export const addTemplate = params => {
  return axios.post(`/v1/api/fac/template/addTemplate`, params, config)
};

// facTaskNode/getEasyTaskNodeList - 5.获取节点列表
export const getEasyTaskNodeList = params => {
  return axios.get(`/v1/api/facTaskNode/getEasyTaskNodeList`, { params: { ...params } }, config)
};

// facTaskNode/updateTaskNode - 6.修改节点接口
export const updateTaskNode = params => {
  return axios.post(`/v1/api/facTaskNode/updateTaskNode`, params, config)
};
//修改节点外发厂节点信息
export const updateTaskNodeFac = params => {
  return axios.post(`v1/api/fac-mission-prcd-nodes/updateOutsideFactory`, params, config)
};

// fac/template/getTemplateList - 7.获取节点模板
export const getTemplateList = params => {
  return axios.get(`/v1/api/fac/template/getTemplateList`, { params: { ...params } }, config)
};

// fac/template/getTemplate - 8.获取当个节点模板
export const getTemplate = params => {
  return axios.get(`/v1/api/fac/template/getTemplate`, { params: { ...params } }, config)
};

// fac/template/getNodeInfo - 9.获取当个节点模板中的信息
export const getNodeInfo = params => {
  return axios.get(`/v1/api/fac/template/getNodeInfo`, { params: { ...params } }, config)
};

// fac/template/deleteTemplate - 10.删除模板
export const deleteTemplate = params => {
  return axios.get(`/v1/api/fac/template/deleteTemplate`, { params: { ...params } }, config)
};

// fac/template/checkTemplateName -11.模板名查重
export const checkTemplateName = params => {
  return axios.get(`/v1/api/fac/template/checkTemplateName`, { params: { ...params } }, config)
};

// fac/template/updateTemplate - 12.修改当前模板
export const updateTemplate = params => {
  return axios.post(`/v1/api/fac/template/updateTemplate`, params, config)
};

// fac/template/getEasyTemplateList -13.获取节点模版下拉列表
export const getEasyTemplateList = params => {
  return axios.get(`/v1/api/fac/template/getEasyTemplateList`, { params: { ...params } }, config)
};
// =======================工序模板结束=============================


// ====================== 工单开始 =========================

// mission/getFacMissionNodeInfoListById - 1.获取工单详情信息
export const getFacMission = params => {
  return axios.get(`/v1/api/fac/mission/getFacMission`, { params: { ...params } }, config);
};

// mission/getFacMissionNodeInfoListById - 2.根据任务ID获取工单详情信息
export const getFacMissionNodeInfoListById = params => {
  return axios.get(`/v1/api/fac/mission/getFacMissionNodeInfoListById`, { params: { ...params } }, config);
};

// api/fac/mission/addMission 3.新建工单
export const addMission = params => {
  return axios.post(`/v1/api/fac/mission/addMission`, params, config)
};

// fac/mission/cancelMission 4.撤销工单
export const cancelMission = params => {
  return axios.post(`/v1/api/fac/mission/cancelMission`, params, config)
}
// 5.获取工序节点实例信息
export const getTaskInstanceWorkflow = params => {
  return axios.post(`/v1/api/facTaskInstanceWorkflow/getTaskInstanceWorkflow`, params, config);
};
// 6.添加节点警报
export const addNodeWarning = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/alert`, params, config);
};
// 7.节点进度修改接口
export const updateTaskInstanceWorkflow = params => {
  return axios.post(`/v1/api/fac/mission/updateTaskInstanceWorkflow`, params, config);
};

// 获取工单或工单节点警报消息
export const getMessageByMissionId = params => {
  return axios.get(`/v1/api/imMessage/getMessageByMissionId`, { params: params }, config)
}
// fac/mission/updateMission - 8.编辑工单
export const updateMission = params => {
  return axios.post(`/v1/api/fac/mission/updateMission`, params, config);
};
// 数据型节点上报接口
export const addReportDataDetail = params => {
  return axios.post(`/v1/api/fac/mission/addReportDataDetail`, params, config);
};
// 数据型节点上报数据修改接口
export const updateReportDataDetail = params => {
  return axios.post(`/v1/api/fac/mission/updateReportDataDetail`, params, config);
};

// ====================== 工单结束 =========================


// ================= 工作台开始 =======================

// 工作台
// 获取融云token
export const getRongYunToken = params => {
  return axios.get(`/v1/api/rong/getToken`, { params: params }, config)
};
// 获取工单消息列表
export const getMissionMessageList = params => {
  return axios.post(`/v1/api/imMessage/getMissionMessageList`, params, config)
};
// 获取消息列表
export const getMessageList = params => {
  return axios.post(`/v1/api/imMessage/listMessage`, params, config)
};
// 添加、推送消息
export const addMessage = params => {
  return axios.post(`/v1/api/imMessage/addMessage`, params, config)
};

// 解除警报
export const cancelNodeAlert = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/alert-cancel`, params, config)
};
// 删除消息
export const deleteMessage = params => {
  return axios.get(`/v1/api/imMessage/deleteMessage`, { params: params }, config)
};
// 编辑消息
export const editMessage = params => {
  return axios.post(`/v1/api/imMessage/editMessage`, params, config)
};
// 获取可选提醒人员列表
export const getPersonList = params => {
  return axios.get(`/v1/api/imMessage/listUserOfFac`, { params: params }, config)
};
// 可选提醒节点列表
export const getNodeList = params => {
  return axios.get(`/v1/api/imMessage/listNodesOfMission`, { params: params }, config)
};
// 获取节点负责人Id数组
export const getLeadersOfNode = params => {
  return axios.get(`/v1/api/imMessage/getLeadersOfNode`, { params: params }, config)
};

// 获取节点信息
export const getEditNode = params => {
  return axios.get(`/v1/api/spl/design/mission/editNodes`, { params: params }, config)
};

// 设计工单更新节点信息接口
export const missionUpdateNodes = params => {
  return axios.post(`/v1/api/spl/design/mission/updateNodes`, params, config)
};


// ================= 工作台结束 =======================


// 获取节点动态
export const queryFactoryMissionOpLogPage = params => {
  return axios.post(`/v1/api/fac/mission/queryFactoryMissionOpLogPage`, params, config)
};

// 获取节点动态
export const deleteReportDataDetail = params => {
  return axios.post(`/v1/api/fac/mission/deleteReportDataDetail`, params, config)
};

// -- v1/api / fac / unit / settings / selectDifSettings --
export const selectDifSettings = params => {
  return axios.post(`/v1/api/fac/unit/settings/selectDifSettings`, params, config)
};

// ================== 报表开始 ==========================
//-- /v1/api/fac/reportStatistics /queryFacMissionReportList -- 报表统计
export const queryFacMissionReportList = params => {
  return axios.post(`/v1/api/fac/reportStatistics/queryFacMissionReportList`, params, config)
};

/**
 * @description 添加报表
 * @param params
 * @returns {AxiosPromise}
 */
export const addFacForm = params => {
  return axios.post(`/v1/api/fac/form/manage/addFacForm`, params, config)
};

/**
 * @description 查询报表
 * @param params
 * @returns {AxiosPromise}
 */
export const selectFacForms = params => {
  return axios.post(`/v1/api/fac/form/manage/selectFacForms`, params, config)
};

/**
 * @description 启用/停用 报表
 * @param params
 * @returns {AxiosPromise}
 */

export const banFacForm = params => {
  return axios.post(`/v1/api/fac/form/manage/banFacForm`, params, config)
};

/**
 * @description 删除报表
 * @param params userId ,
 * @returns {AxiosPromise}
 */
export const deleteFacForm = params => {
  return axios.post(`/v1/api/fac/form/manage/deleteFacForm`, params, config)
};

/**
 * @description 获取工位权限表
 * @param params
 * @returns {AxiosPromise}
 */
export const getFormRelation = params => {
  return axios.post(`/v1/api/fac/form/manage/getFormRelation`, params, config)
};

// /v1/api/fac/customer/getEasyCustomerListByUnitIds - 获取所有的客户
export const getEasyCustomerListByUnitIds = params => {
  return axios.post(`/v1/api/fac/customer/getEasyCustomerListByUnitIds`, params, config)
};

//------------  /v1/api/fac/getUnitListByUserId - 工厂筛选 --------------
export const getUnitListByUserId = params => {
  return axios.post(`/v1/api/fac/getUnitListByUserId`, params, config)
};

// ----------- v1/api/fac/goods/getGoodsListByUnitIds 货品筛选 -----------
export const getGoodsListByUnitIds = params => {
  return axios.post(`/v1/api/fac/goods/getGoodsListByUnitIds`, params, config)
};
// --------- /v1/api/fac/mission/queryMissionLeadersByUnitIds 负责人 ---------
export const queryMissionLeadersByUnitIds = params => {
  return axios.post(`/v1/api/fac/mission/queryMissionLeadersByUnitIds`, params, config)
};
// --------- /v1/api/fac/mission/queryMissionLeadersByUnitIds 工单负责人的分组 ---------
export const getUnitUser = params => {
  return axios.get(`/v1/api/facUser/getUnitUser`, { params: params }, config)
};
// --------- /v1/api/fac/mission/queryMissionLeadersByUnitIds 根据工厂选择工单负责人的分组 ---------
export const getUnitsUsers = params => {
  return axios.post(`/v1/api/facUser/getUnitsUsers`, params, config)
};
// ============ 报表结束 ================
/**
 * @description 牛厂查询报表分组下员工信息(ZHangRui)
 * @param params
 * @returns {AxiosPromise}
 */
export const getFormGroupsUsers = params => {
  return axios.post(`/v1/api/fac/form/manage/getFormGroupsUsers`, params, config)
};


/**
 * @description 更新工位权限
 * @param params
 * @returns {AxiosPromise}
 */

export const updateFormRelation = params => {
  return axios.post(`/v1/api/fac/form/manage/updateFormRelation`, params, config)
};

// --------  /v1/api/public/getPosition?code=1101 ---------省市区获取
export const getPosition = params => {
  return axios.get(`/v1/api/public/getPosition`, { params: params }, config)
}
// -------- /v1/api/facTaskNode/deleteTaskNodeByNodeId?noceId= --------
export const deleteTaskNodeByNodeId = params => {
  return axios.get(`/v1/api/facTaskNode/deleteTaskNodeByNodeId`, { params: params }, config)
};

// --------- 打印模板开始 -------------


// 获取所有打印类型
export const getPrintTypes = params => {
  return axios.get(`/v1/api/fac/print/getPrintTypes`, { params: params }, config)
};
// 打印次数
export const getPrintCount = params => {
  return axios.put(`/v1/api/print/print-count/${params.billType}`, params, config)
};
// 样料到料单打印
export const getMaterialPrint = params => {
  return axios.get(`/v1/api/print/def-print`, { params: params }, config)
};
// 样料到料单送检单打印
export const getPrintSj = params => {
  return axios.post(`/v1/api/print/printSj`, params, config)
};
// 根据打印类型分页获取组织层打印模板
export const facTemplates = params => {
  return axios.post(`/v1/api/fac/print/facTemplates`, params, config)
};
// 根据打印类型分页获取体系层打印模板
export const templates = params => {
  return axios.post(`/v1/api/fac/print/templates`, params, config)
};
// 组织层设置打印模板的状态
export const updateStatus = params => {
  return axios.post(`/v1/api/fac/print/updateStatus`, params, config)
};
//打印数据列表以及添加编辑

export const templateAddOrUpdate = params => {
  return axios.post(`/v1/api/fac/print/templateAddOrUpdate`, params, config)
};

// 编辑和添加完成的接口,用于新增模板或者修改模板
export const addOrUpdateTemplate = params => {
  return axios.post(`/v1/api/fac/print/addOrUpdateTemplate`, params, config)
};

//删除模板的接口
export const deletePrintTemplate = params => {
  return axios.post(`/v1/api/fac/print/deleteTemplate`, params, config)
};

// 获取已启用的可打印的列表接口 搜索模板获取列表接口
export const getPrintTemplatesByType = params => {
  return axios.post(`/v1/api/fac/print/getPrintTemplatesByType`, params, config)
};

// 获取打印工单数据的接口
export const templatePrinttig = params => {
  return axios.post(`/v1/api/fac/print/templatePrinttig`, params, config)
};

//获取打印模板信息
// type:（工单） purchase(采购单) 、delivery（到料单）、arrive（送料单）、return(退料单)
export const getPrintTempDetails = params => {
  return axios.get(`/v1/api/print/temp/details/${params.type}`, { params: params }, config)
};
// 单据打印
// /v1/api/print?templateId=模板ID&businessId=单据ID&userId=当前登录用户ID&unitId=当前组织ID
export const billPrint = params => {
  return axios.post(`/v1/api/print`, params, config)
};

// 单据预览
export const billPreview = params => {
  return axios.put(`/v1/api/print/preview `, params, config)
};

// 新建打印模板
export const addPrintTemp = params => {
  return axios.post(`/v1/api/print/temp/add/${params.type}`, params, config)
};
// 更新打印模板
export const updatePrintTemp = params => {
  return axios.post(`/v1/api/print/temp/update/${params.type}`, params, config)
};


// --------- 打印模板结束 -------------

// ============ 仓库管理 ================
// 新建仓库
export const addStorehouse = params => {
  return axios.post(`/v1/api/fac/storehouse/addStorehouse`, params, config)
};
// 仓库组织关联查询
export const queryStorehouseUnitDetail = params => {
  return axios.post(`/v1/api/fac/storehouse/queryStorehouseUnitDetail`, params, config)
};
// 仓库管理列表
export const queryStorehousePage = params => {
  return axios.post(`/v1/api/fac/storehouse/queryStorehousePage`, params, config)
};
// 修改仓库名
export const updateStorehouseName = params => {
  return axios.post(`/v1/api/fac/storehouse/updateStorehouseName`, params, config)
};
// 删除仓库
export const deleteStorehouse = params => {
  return axios.get(`/v1/api/fac/storehouse/deleteStorehouse`, { params: params }, config)
};
// 批量修改组织仓库关联关系
export const setUpStorehouseUnit = params => {
  return axios.post(`/v1/api/fac/storehouse/setUpStorehouseUnit`, params, config)
};
// 查询体系下所有仓库
export const getBossStorehouses = params => {
  return axios.get(`/v1/api/fac/storehouse/getBossStorehouses`, { params: params }, config)
};


// 库存管理
//  根据款号搜索查询货款下拉列表--批量入库
export const findCommonGoodsStyleListEasy = params => {
  return axios.post(`/v1/api/fac/goods/findCommonGoodsStyleListEasy`, params, config)
};
//  查询体系层货款信息--批量入库
export const queryCommonStyleSkuBasicInfo = params => {
  return axios.post(`/v1/api/fac/goods/queryCommonStyleSkuBasicInfo`, params, config)
};

//
//  牛厂通过款号id查询库存信息--批量出库
export const queryInventoryItemByStyleId = params => {
  return axios.post(`/v1/api/fac/inventoryItem/queryInventoryItemByStyleId`, params, config)
};

//  根据用户查询工厂所有仓库--批量入库、实时库存
export const getStorehousesByUserId = params => {
  return axios.get(`/v1/api/fac/storehouse/getStorehousesByUserId`, { params: params }, config)
};
//  牛厂货品批量入库--批量入库
export const batchInStorageInventoryItem = params => {
  return axios.post(`/v1/api/fac/inventoryItem/batchInStorageInventoryItem`, params, config)
};
//  牛厂货品批量出库--批量入库
export const batchOutStorageInventoryItem = params => {
  return axios.post(`/v1/api/fac/inventoryItem/batchOutStorageInventoryItem`, params, config)
};

//  牛厂单个库存删除操作--批量入库
export const deleteInventoryItem = params => {
  return axios.post(`/v1/api/fac/inventoryItem/deleteInventoryItem`, params, config)
};
// 牛厂库存列表查询--实时库存
export const queryInventoryItemList = params => {
  return axios.post(`/v1/api/fac/inventoryItem/queryInventoryItemList`, params, config)
};
// - /v1/api/fac/inventoryItem/queryInventoryItemDetailList - 牛厂库存变动记录列表查询
export const queryInventoryItemDetailList = params => {
  return axios.post(`/v1/api/fac/inventoryItem/queryInventoryItemDetailList`, params, config)
};

///v1/api/fac/inventoryItem/queryInventoryItemOpByList - 查询操作人
export const queryInventoryItemOpByList = params => {
  return axios.post(`/v1/api/fac/inventoryItem/queryInventoryItemOpByList`, params, config)
};


// 牛厂单个库存修改_入库、出库调整操作
export const updateInventoryItem = params => {
  return axios.post(`/v1/api/fac/inventoryItem/updateInventoryItem`, params, config)
};

// -- fac/goods/selectFacGoodsStyleList -- 搜索货品管理，不添加keyword就是获取全部
export const selectFacGoodsStyleList = params => {
  return axios.post(`/v1/api/fac/goods/selectFacGoodsStyleList`, params, config);
};

// - /v1/api/fac/common/processForm/getCommonProcessForm --获取工艺单信息
export const getCommonProcessForm = params => {
  return axios.get(`/v1/api/fac/common/processForm/getCommonProcessForm`, { params: params }, config)
};

// - /v1/api/fac/common/settings/updateBossCommonSettings --修改体系下的规格属性
export const updateBossCommonSettings = params => {
  return axios.post(`/v1/api/fac/common/settings/updateBossCommonSettings`, params, config);
};

// - /v1/api/fac/common/settings/editGoodsAttr --修改规格属性下的属性库的属性
export const editGoodsAttr = params => {
  return axios.post(`/v1/api/fac/common/settings/editGoodsAttr`, params, config);
};

// - /v1/api/fac/common/settings/editGoodsSku --修改规格属性下的尺寸和内长
export const editGoodsSku = params => {
  return axios.post(`/v1/api/fac/common/settings/editGoodsSku`, params, config);
};
// 规格属性字段列表
export const getFields = params => {
  return axios.get(`/v1/api/fac/common/settings/fields`, { params: params }, config)
};
// 规格属性自定义属性名称修改
export const getEditFieldName = params => {
  return axios.put(`/v1/api/fac/common/settings/editFieldName`, params, config)
};
// - /v1/api/fac/common/settings/deleteAttr - 删除‘规格属性’下的‘属性库’的信息
export const deleteAttr = params => {
  return axios.get(`/v1/api/fac/common/settings/deleteAttr`, { params: params }, config)
};
// 获取自定义属性名称
export const getTagName = params => {
  return axios.get(`/v1/api/otb/common/tag`, { params: params }, config)
};

// /v1/api/fac/common/processForm/updateCommonProcessForm  更新货品款式的工艺单
export const updateCommonProcessForm = params => {
  return axios.post(`/v1/api/fac/common/processForm/updateCommonProcessForm`, params, config);
};

// /v1/api/fac/common/processForm/deleteCommonProcessForm  删除货品款式的工艺单
export const deleteCommonProcessForm = params => {
  return axios.get(`/v1/api/fac/common/processForm/deleteCommonProcessForm`, {
    params: params
  }, config)
};

// /v1/api/fac/common/processForm/previewCommonProcessForm PDF预览
export const previewCommonProcessForm = params => {
  return axios.post(`/v1/api/fac/common/processForm/previewCommonProcessForm`, params, config);
}
// 新建生产准备中心
export const createProductPrepareCenter = params => {
  return axios.post(`/v1/api/unit/createProductPrepareCenter`, params, config)
};
// 生产准备中心列表
export const queryProductPrepareCenterList = params => {
  return axios.post(`/v1/api/unit/queryProductPrepareCenterList`, params, config)
};
// 查询生产准备中心详情
export const queryProductPrepareCenterInfo = params => {
  return axios.post(`/v1/api/unit/queryProductPrepareCenterInfo`, params, config)
};
// 编辑生产准备中心
export const updateProductPrepareCenter = params => {
  return axios.post(`/v1/api/unit/updateProductPrepareCenter`, params, config)
};
// 获取体系层所有员工信息
export const querySysUnitAllUser = params => {
  return axios.post(`/v1/api/unit/querySysUnitAllUser`, params, config)
};
// 管理工位
export const productPrepareCenterStationManage = params => {
  return axios.post(`/v1/api/unit/productPrepareCenterStationManage`, params, config)
};
// 获取生产准备中心管理工位
export const queryProductPrepareCenterAllUser = params => {
  return axios.post(`/v1/api/unit/queryProductPrepareCenterAllUser`, params, config)
};
// 生产准备中心名称查重
export const checkProductPrepareCenter = params => {
  return axios.post(`/v1/api/unit/checkProductPrepareCenter`, params, config)
};
// 查询生产准备中心下拉列表
export const queryProductPrepareCenterListEasy = params => {
  return axios.post(`/v1/api/unit/queryProductPrepareCenterListEasy`, params, config)
};

// v1/api/fac/mission/deleteCheckTaskInstanceWorkflow 删除节点做判断
export const deleteCheckTaskInstanceWorkflow = params => {
  return axios.post(`/v1/api/fac/mission/deleteCheckTaskInstanceWorkflow`, params, config)
};

// v1/api/fac/queryFactoryGroupList 获取工位分组（带分页）
export const queryFactoryGroupList = params => {
  return axios.post(`/v1/api/fac/queryFactoryGroupList`, params, config)
};

// /v1/api/fac/unit/settings/updateUnitSettings 更新组织层
export const updateUnitSettings = params => {
  return axios.post(`/v1/api/fac/unit/settings/updateUnitSettings`, params, config)
};

//  /v1/api/fac/defectiveLabel/allFacDefectiveLabel  组织层增、删、排序所有次品标签
export const allFacDefectiveLabel = params => {
  return axios.post(`/v1/api/fac/defectiveLabel/allFacDefectiveLabel`, params, config)
};

// /v1/api/fac/defectiveLabel/facDefectiveLabels  组织层查询所有的次品标签
export const facDefectiveLabels = params => {
  return axios.get(`/v1/api/fac/defectiveLabel/facDefectiveLabels`, { params: params }, config)
};

// /v1/api/fac/unit/settings/judgeDeleteUnitSettings 判断组织层能不能删
export const judgeDeleteUnitSettings = params => {
  return axios.post(`/v1/api/fac/unit/settings/judgeDeleteUnitSettings`, params, config)
};

// /v1/api/fac/defectiveLabel/queryAllDefectiveLabel 查询全局次品标签
export const queryAllDefectiveLabel = params => {
  return axios.post(`/v1/api/fac/defectiveLabel/queryAllDefectiveLabel`, params, config)
};

// /v1/api/fac/defectiveLabel/facWouldDelete 判断次品标签组织下的删除
export const facWouldDelete = params => {
  return axios.get(`/v1/api/fac/defectiveLabel/facWouldDelete`, { params: params }, config)
};
// /v1/api/fac/defectiveLabel/allDefectiveLabel 新增体系下的次品标签
export const allDefectiveLabel = params => {
  return axios.post(`/v1/api/fac/defectiveLabel/allDefectiveLabel`, params, config)
};

// MRP标签
// 查询
export const queryAllBillLabel = params => {
  return axios.post(`/v1/api/fac/billLabel/queryAllBillLabel`, params, config)
};
// 编辑
export const editBillLabel = params => {
  return axios.post(`/v1/api/fac/billLabel/editBillLabel`, params, config)
};
// 新建
export const addBillLabel = params => {
  return axios.post(`/v1/api/fac/billLabel/addBillLabel`, params, config)
};
// 删除
export const deleteBillLabel = params => {
  return axios.post(`/v1/api/fac/billLabel/deleteBillLabel`, params, config)
};
// 排序
export const billLabelSeqencing = params => {
  return axios.post(`/v1/api/fac/billLabel/billLabelSeqencing`, params, config)
};
// MRP单据分配标签
export const allocationBillLabel = params => {
  return axios.post(`/v1/api/purchase/allocationBillLabel`, params, config)
};
// 查询单个货品sku带筛选
export const queryFacGoodsSku = params => {
  return axios.post(`/v1/api/fac/goods/queryFacGoodsSku`, params, config)
};

// 质检型节点上报
export const qcReportInfo = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/quality-checking-report`, params, config)
};


// v1/api/fac/barcode/goodsBarcodes 查询条码管理列表
export const goodsBarcodes = params => {
  return axios.post(`v1/api/fac/barcode/goodsBarcodes`, params, config)
};

// v1/api/fac/barcode/updateBarcodes 批量的修改货品条码
export const updateBarcodes = params => {
  return axios.post(`v1/api/fac/barcode/updateBarcodes`, params, config)
};

// v1/api/fac/barcode/isExist 查询单个条码是否存在
export const isExist = params => {
  return axios.get(`/v1/api/fac/barcode/isExist`, { params: params }, config)
};

// v1/api/fac/barcode/isExistBarcodes 批量生成货品条码
export const isExistBarcodes = params => {
  return axios.post(`/v1/api/fac/barcode/isExistBarcodes`, params, config)
};

// generateExcel 下载条形码
export const generateExcel = params => {
  return axios.post(`/v1/api/fac/barcode/generateExcel`, params, {
    responseType: 'blob'
  })
};
// 根据上报记录id获取质检型节点上报信息
export const qcReportInfoById = params => {
  return axios.get(`/v1/api/qcReportInfo/qcReportInfoById`, { params: params }, config)
};

// 根据上报记录id获取质检型节点上报信息
export const qcReportInfoCancel = params => {
  return axios.get(`/v1/api/qcReportInfo/qcReportInfoCancel`, { params: params }, config)
};

// 通过sku条形码获取体系层sku信息
export const getSkuBarcodeInfo = params => {
  return axios.get(`/v1/api/fac/barcode/getSkuBarcodeInfo`, { params: params }, config)
};

// 通过sku条形码获取未完成工单信息
export const getMissionInfoByBarcode = params => {
  return axios.get(`/v1/api/fac/barcode/getMissionInfoByBarcode`, { params: params }, config)
};

// 质检型节点上报信息修改
export const qcReportInfoUpdate = params => {
  return axios.post(`/v1/api/qcReportInfo/qcReportInfoUpdate`, params, config)
};

// 质检型节点次品上报记录修改
export const qcDefectiveDetailUpdate = params => {
  return axios.post(`/v1/api/qcReportInfo/qcDefectiveDetailUpdate`, params, config)
};

// /v1/api/fac/common/settings/updateCommonColor 通用颜色修改
export const updateCommonColor = params => {
  return axios.post(`/v1/api/fac/common/settings/updateCommonColor`, params, config)
};

// 根据次品上报记录id撤销质检型节点次品上报信息
export const qcDefectiveDetailCancel = params => {
  return axios.get(`/v1/api/qcReportInfo/qcDefectiveDetailCancel`, { params: params }, config)
};
// 切换工厂 /fac/switchingFactory
export const switchingFactory = params => {
  return axios.get(`/v1/api/fac/switchingFactory`, { params: params }, config)
};
// 切换工厂时重新 /fac/switchingFactory
export const switchUnit = params => {
  return axios.post(`/v1/api/login/switchUnit`, params, config)
};

// /v1/api/fac/goods/addProcessForms 添加工艺单已有的货
export const addProcessForms = params => {
  return axios.post(`/v1/api/fac/goods/addProcessForms`, params, config)
};

// /v1/api/fac/unit/settings/checkBeforeUnitColorSave 检查色号是否能加
export const checkBeforeUnitColorSave = params => {
  return axios.post(`/v1/api/fac/unit/settings/checkBeforeUnitColorSave`, params, config)
};


/**
 * 工序节点新接口如下
 * */
//GET /new-mf-fac/v1/api/prcd-node-types?unitId=UNIT_ID  节点类型获取
export const getNodeTypes = params => {
  return axios.get(`/v1/api/prcd-node-types`, { params: params }, config)
};

//POST /new-mf-fac/v1/api/prcd-node-types 添加节点
export const addNodeTypes = params => {
  return axios.post(`/v1/api/prcd-nodes`, params, config)
};

// PUT /new-mf-fac/v1/api/prcd-nodes 编辑节点
export const editNodeTypes = params => {
  return axios.put(`/v1/api/prcd-nodes`, params, config)
};

// 分页获取节点
//GET /new-mf-fac/v1/api/prcd-nodes?unitId=组织ID&keyword=查询关键字&pageNo=页码&pageSize=每页获取数量
export const getNodeLists = params => {
  return axios.get(`/v1/api/prcd-nodes`, { params: params }, config)
};

// GET /new-mf-fac/v1/api/prcd-nodes/details?unitId=组织ID 不分页获取所有节点，作用于模板
export const getAllNodeList = params => {
  return axios.get(`/v1/api/prcd-nodes/details`, { params: params }, config)
};
// POST /v1/api/prcd-templates  {unitId:组织ID, name:模板名称, chargerIds:[默认负责人ID数组], nodes:[节点数组]}
export const createNodeTemplate = params => {
  return axios.post(`/v1/api/prcd-templates`, params, config)
};

// /new-mf-fac/v1/api/prcd-templates?unitId=组织ID
export const getNodeTemplateList = params => {
  return axios.get(`/v1/api/prcd-templates`, { params: params }, config)
};

// GET /new-mf-fac/v1/api/prcd-templates/模板ID
export const templateInfo = params => {
  return axios.get(`/v1/api/prcd-templates/${params.templateId}`, params, config)
};

// DELETE  /new-mf-fac/v1/api/prcd-templates/模板ID
export const deleteNodeTemplate = params => {
  return axios.delete(`/v1/api/prcd-templates/${params.templateId}`, params, config)
};

// 编辑的接口 PUT  /v1/api/prcd-templates {id: 模板ID, unitId:组织ID, name:模板名称, chargerIds:[默认负责人ID数组], nodes:[节点数组]}
export const editNodeTemplate = params => {
  return axios.put(`/v1/api/prcd-templates`, params, config)
};

/**工单详情新接口 */
// GET /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单ID/progresses 获取节点信息
export const missionNodeInfo = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/${params.missionId}/progresses`, { params: params }, config)
};

// GET /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单ID 获取当前工单节点模板的数据
export const editMissionNodeInfo = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/${params.missionId}`, { params: params }, config)
};

// GET  /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单节点ID/progress 点击节点获取节点数据
export const instanceMissionNodeInfo = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/${params.instanceWorkflowId}/progress`, { params: params }, config)
};

// /v1/api/fac-mission-prcd-nodes/节点id（status/information） 修改工单详情节点状态或者是节点信息
export const nodeInfoEdit = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.id}/${params.editType}`, params, config)
};
// /v1/api/fac-mission-prcd-nodes/update/reason0fDelay 修改工单详情节点延误信息的原因
export const nodeInfoReason = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/update/reason0fDelay`, params, config)
};

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/quantitative 数量型节点上报接口
export const updateNumNode = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/quantitative`, params, config)
};

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/actual-cutting 裁床数量型上报接口
export const updateBedNode = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/actual-cutting`, params, config)
};

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/total  总数型上报接口
export const updateTotalNode = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/total`, params, config)
};

//单据列表接口
export const billReportList = params => {
  return axios.put(`/v1/api/bill-report/list`, params, config)
};

// 单据列表根据工单id获取该工单所有节点列表（不分页）
export const billReportNodeList = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/${params.missionId}/nodes `, { params: params }, config)
};
// 单据列表获取单据类型下拉列表
export const billReportBillType = params => {
  return axios.get(`/v1/api/bill-report/billTypes`, { params: params }, config)
};
// 单据列表获取单据状态下拉列表
export const billReportBillStatus = params => {
  return axios.get(`v1/api/bill-report/billStatus`, { params: params }, config)
};
// 单据列表根据工单节点id获取上报单据简易下拉搜索列表
export const billReportBillList = params => {
  return axios.post(`/v1/api/bill-report/listEasyBill`, params, config)
};

// 获取单据详情数据接口
export const billReportDetail = params => {
  return axios.get(`/v1/api/bill-report/detail/${params.billId}`, { params: params }, config)
};

//单据调整单撤销
export const billReportUndo = params => {
  return axios.put(`/v1/api/uflo/fac-mission-adjust/undo?billId=${params.billId}`, params, config)
};
// 单据调整单申请撤销
export const billReportAntiReview = params => {
  return axios.post(`/v1/api/uflo/fac-mission-adjust/apply-anti-review`, params, config)
};
//单据调整单撤回
export const billReportUndoStatus = params => {
  return axios.put(`/v1/api/uflo/fac-mission-adjust/undo-status?billId=${params.billId}`, params, config)
};
//单据提报
export const billReportSubmit = params => {
  return axios.post(`/v1/api/uflo/fac-mission-adjust/submit`, params, config)
};
// 单据审核
export const billReportReview = params => {
  return axios.post(`/v1/api/uflo/fac-mission-adjust/review`, params, config)
};
// 单据审核删除检测
export const checkDelete = params => {
  return axios.post(`/v1/api/bill-review-config/checkDelete`, params, config)
};

// 工单详情，获取子矩阵
export const getSubmatrixData = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/outside-factory`, { params: params }, config)
};
//获取修改节点信息的时候的外发厂的信息
export const getSubmatrixOutside = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/getOutside-factory`, { params: params }, config)
};
// PUT  /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/quality-checking-waste 把次品报废的API
export const qualityCheckingWaste = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/quality-checking-waste`, params, config)
};
// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/quality-checking-re-repair 把次品再修的API
export const qualityCheckingRepair = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/quality-checking-re-repair`, params, config)
};
// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/quality-checking-qualify 把次品变为合格品的API
export const qualityCheckingQualify = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/quality-checking-qualify`, params, config)
};

// DELETE /new-mf-fac/v1/api/prcd-nodes/节点ID 删除节点
export const deleteNode = params => {
  return axios.delete(`/v1/api/prcd-nodes/${params.nodeId}`, params, config)
};

// 体系尺码组列表信息
export const commonSizeCatagoryList = params => {
  return axios.get(`/v1/api/commonSizeCatagory/list`, { params: params }, config)
};

// 体系尺码组尺码新增
export const addCommonSize = params => {
  return axios.post(`/v1/api/commonSize/add`, params, config)
};

// 体系尺码组编辑
export const updateCommonSizeCatagory = params => {
  return axios.post(`/v1/api/commonSizeCatagory/update`, params, config)
};

// 体系尺码组新增
export const addCommonSizeCatagory = params => {
  return axios.post(`/v1/api/commonSizeCatagory/add`, params, config)
};

// 体系尺码组排序
export const updateSizeCatagorySort = params => {
  return axios.post(`/v1/api/commonSizeCatagory/updateSort`, params, config)
};

// 组织尺码组列表信息
export const orgSizeCatagoryList = params => {
  return axios.get(`/v1/api/orgSizeCatagory/list`, { params: params }, config)
};

// 组织尺码组编辑
export const updateOrgSizeCatagoryStatus = params => {
  return axios.post(`/v1/api/orgSizeCatagory/updatestatus`, params, config)
};


// 物料分类-物料分类列表
export const listMaterialsKinds = params => {
  return axios.get(`/v1/api/fac/materials/listMaterialsKinds`, { params: params }, config)
};

// 物料分类-新增/更新物料分类
export const addOrUpdateMaterialsKinds = params => {
  return axios.post(`/v1/api/fac/materials/addOrUpdateMaterialsKinds`, params, config)
};

// 物料分类-删除物料分类
export const deleteMaterialsKinds = params => {
  return axios.get(`/v1/api/fac/materials/deleteMaterialsKinds`, { params: params }, config)
};

// 体系层物料规格-物料规格列表
export const listCommonMaterialsSpecifications = params => {
  return axios.get(`/v1/api/fac/materials/listCommonMaterialsSpecifications`, { params: params }, config)
};

// 体系层物料规格-更新物料规格
export const addOrUpdateCommonMaterialsSpecifications = params => {
  return axios.post(`/v1/api/fac/materials/addOrUpdateCommonMaterialsSpecifications`, params, config)
};

// 体系层物料规格-删除规格
export const deleteCommonMaterialsSpecifications = params => {
  return axios.get(`/v1/api/fac/materials/deleteCommonMaterialsSpecifications`, { params: params }, config)
};

// 体系层物料规格-规格排序
export const sortCommonMaterialsSpecifications = params => {
  return axios.post(`/v1/api/fac/materials/sortCommonMaterialsSpecifications`, params, config)
};

// 组织层物料规格-新增物料规格
export const addOrgMaterialsSpecifications = params => {
  return axios.post(`/v1/api/fac/materials/addOrgMaterialsSpecifications`, params, config)
};

// 组织层物料规格-物料规格列表
export const listOrgMaterialsSpecifications = params => {
  return axios.get(`/v1/api/fac/materials/listOrgMaterialsSpecifications`, { params: params }, config)
};

// 组织层物料规格-删除规格
export const deleteOrgMaterialsSpecifications = params => {
  return axios.get(`/v1/api/fac/materials/deleteOrgMaterialsSpecifications`, { params: params }, config)
};

// 物料档案列表接口
export const orgListMaterials = params => {
  return axios.post(`/v1/api/fac/materials/listMaterials`, params, config)
};
// 组织层物料规格-删除规格
export const getMaterialDetail = params => {
  return axios.get(`/v1/api/fac/materials/getMaterialDetail`, { params: params }, config)
};

// 货品管理 --->  boom 表数据； add gl
// 物料属性列表
export const listCommonMaterialsAttr = params => {
  return axios.get(`/v1/api/fac/materials/listCommonMaterialsAttr`, { params: params }, config)
};
//商品档案bom表保存编辑后的物料
export const updateBomMaterialsSku = params => {
  return axios.post('/v1/api/fac/materials/updateBomMaterialsSku', params, config)
};
//设计档案bom表保存编辑后的物料
export const updateSplDesignBomMaterialsSku = params => {
  return axios.post('/v1/api/fac/materials/updateSplDesignBomMaterialsSku', params, config)
};
//工单bom表保存编辑后的物料
export const updateMissionBomMaterialsSku = params => {
  return axios.post('/v1/api/fac/materials/updateMissionBomMaterialsSku', params, config)
};
//bom表搜索行保存，新增物料
export const addMaterialsLine = params => {
  return axios.post('/v1/api/fac/materials/addMaterialsLine', params, config)
};

//订单bom表保存编辑后的物料
export const updatePrdOrderBomMaterialsSku = params => {
  return axios.post('/v1/api/fac/materials/updatePrdOrderBomMaterialsSku', params, config)
};

// 获取上传附件的默认附件名称（商品档案和设计档案）
export const attachmentListNames = params => {
  return axios.get(`/v1/api/fac/goods/attachmentListNames`, { params: params }, config)
};
// 获取上传附件的默认附件名称和自定义属性（商品档案和设计档案）
export const configNames = params => {
  return axios.get(`/v1/api/fac/goods/configNames`, { params: params }, config)
};

// 新增库存单位
export const addStockUnit = params => {
  return axios.get(`/v1/api/fac/materials/addStockUnit`, { params: params }, config)
};

// 新增库存单位
export const judgeMaterialSkuAttrDelete = params => {
  return axios.get(`/v1/api/fac/materials/judgeMaterialSkuAttrDelete`, { params: params }, config)
};

// 编辑物料
export const editMaterials = params => {
  return axios.post(`/v1/api/fac/materials/editMaterials`, params, config)
};

// 编辑物料
export const addMaterials = params => {
  return axios.post(`v1/api/fac/materials/addMaterials`, params, config)
};

// 物料款号体系层判重
export const judgeRepeatMaterialNo = params => {
  return axios.get(`/v1/api/fac/materials/judgeRepeatMaterialNo`, { params: params }, config)
};

// 导入物料到组织层
export const importMaterial = params => {
  return axios.get(`/v1/api/fac/materials/importMaterial`, { params: params }, config)
};

// 删除物料
export const deleteMaterial = params => {
  return axios.get(`/v1/api/fac/materials/deleteMaterial`, { params: params }, config)
};

// 货品管理 --->  boom 表数据；
export const goodManageBoomAllData = params => {
  return axios.get('/v1/api/fac/commonBom/list', { params: params }, config);
};
// add new boom
export const toAddBoomData = params => {
  return axios.post('/v1/api/fac/commonBom/addCommonBom', params, config);
};
// 查询boom表中物料类型；
export const searchBoomType = params => {
  return axios.get('/v1/api/fac/materials/list/', { params: params }, config);
};
//查询sku 数据接口；
export const searchSkuType = params => {
  return axios.get('/v1/api/fac/commonStyleSku/list/', { params: params }, config);
};

// GET /new-mf-fac/v1/api/storehouses/组织ID 获取仓库的下拉列表
export const storeList = params => {
  return axios.get(`/v1/api/storehouses/${params.unitId}`, params, config);
};

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/tail-in-store 入库
export const storeInReport = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/tail-in-store`, params, config)
};

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/tail-out-store 出库
export const storeOutReport = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/tail-out-store`, params, config)
}
// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/material 到料控件的 上报API
export const materialReport = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/material`, params, config)
};
// 自由送料型节点上报
export const materialFreeReport = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/freedom_material`, params, config)
};

//get 由sku查看boom信息；
export const skuCheakBoom = params => {
  return axios.get('/v1/api/fac/commonBom/commonBomSkuDetail/', { params: params }, config);
}
//post 编辑boom信息；
export const updataBoomData = params => {
  return axios.post('/v1/api/fac/commonBom/updateCommonBom', params, config);
}
//某boom数据的删除；
export const delectBomData = params => {
  return axios.get("/v1/api/fac/commonBom/deleteCommonBom", { params: params }, config);
}

//体系货品BOM列表
export const commonBomList = params => {
  return axios.get("/v1/api/fac/commonBom/list", { params: params }, config);
}

// 获取bom编辑的接口 api/fac/mission/facMissionBom?facId=2788dd44558147e
export const facMissionBomEditInfo = params => {
  return axios.get("/v1/api/fac/mission/facMissionBom", { params: params }, config);
}

// 检查生产订单bom的sku能不能删除 api/fac/mission/facMissionBom?facId=2788dd44558147e
export const canDeleteBomSku = params => {
  return axios.get("/v1/api/facPrdOrder/canDeleteBomSku", { params: params }, config);
}

// /v1/api/fac/commonBom/easyBomList 获取bomlist，用于编辑和新建工单
export const easyBomList = params => {
  return axios.get("/v1/api/fac/commonBom/easyBomList", { params: params }, config);
}

// /v1/api/fac/commonBom/bomDetail bom详情
export const bomDetail = params => {
  return axios.get("/v1/api/fac/commonBom/bomDetail", { params: params }, config);
}

// /v1/api/fac/materials/list 体系物料列表信息
export const materialCommonList = params => {
  return axios.get("/v1/api/fac/materials/list", { params: params }, config);
}
// 组织物料列表信息
export const materialOrgList = params => {
  return axios.get("/v1/api/fac/materials/orgList", { params: params }, config);
}

// 工单bom按货品SKU查看BOM
export const facMissionBomSku = params => {
  return axios.get("v1/api/fac/mission/facMissionBomSku", { params: params }, config);
}

// 编辑工单BOM信息
export const editFacMissionBom = params => {
  return axios.put(`v1/api/fac/mission/facMissionBom/${params.facMissionId}`, params, config);
}

// PUT /new-mf-fac/v1/api/fac-mission-prcd-nodes/工单工序节点ID/actual-cutting-wym 裁床唯一码上报
export const actualCuttingWym = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/actual-cutting-wym`, params, config);
}

// /v1/api/fac-mission-prcd-nodes/previewWYM 预览唯一码
export const previewWYM = params => {
  return axios.post('/v1/api/fac-mission-prcd-nodes/previewWYM', params, config);
};

// /v1/api/fac-mission-prcd-nodes/generateExcel 预览唯一码型下载
export const generateExcelWym = params => {
  return axios.post('/v1/api/fac-mission-prcd-nodes/generateExcel', params, {
    responseType: 'blob'
  });
};

// /v1/api/fac/facWorkBay/listFacWorkBay  本厂设置获取工位列表
export const getSelfWorkList = params => {
  return axios.post('/v1/api/fac/facWorkBay/listFacWorkBay', params, config);
};

// /v1/api/fac/facWorkBay/addFacWorkBay  本厂设置新建工位
export const addFacWorkBay = params => {
  return axios.post('/v1/api/fac/facWorkBay/addFacWorkBay', params, config);
};

// /v1/api/fac/facWorkBay/judgeRepeatWorkBay   本厂设置工位去重
export const judgeRepeatWorkBay = params => {
  return axios.get('/v1/api/fac/facWorkBay/judgeRepeatWorkBay', { params: params }, config);
};


// /v1/api/fac/facWorkBay/importWorkBayToFac   本厂设置引用体系层工位到组织层
export const importWorkBayToFac = params => {
  return axios.get('/v1/api/fac/facWorkBay/importWorkBayToFac', { params: params }, config);
};


// /v1/api/fac/facWorkBay/getFacWorkBayDetail   本厂设置工位详情
export const getFacWorkBayDetail = params => {
  return axios.get('/v1/api/fac/facWorkBay/getFacWorkBayDetail', { params: params }, config);
};


// /v1/api/fac/facWorkBay/updateFacWorkBay   本厂设置工位编辑
export const updateFacWorkBay = params => {
  return axios.post('/v1/api/fac/facWorkBay/updateFacWorkBay', params, config);
};


// /v1/api/fac/facWorkBay/removeWorkBayFromFac   本厂设置移出本厂
export const removeWorkBayFromFac = params => {
  return axios.get('/v1/api/fac/facWorkBay/removeWorkBayFromFac', { params: params }, config);
};

//送料节点，获取是否关联外发厂数据
export const isRelatedFabricatingPlant = params => {
  return axios.get('/v1/api/fac-mission-prcd-nodes/isRelatedFabricatingPlant', { params: params }, config);
};
//获取加工工厂列表接口
export const fabricatingPlants = params => {
  return axios.get('/v1/api/outside/factory/fabricatingPlants', { params: params }, config);
};
//送料节点，提交外发厂
export const relatedFabricatingPlant = params => {
  return axios.post('/v1/api/fac-mission-prcd-nodes/relatedFabricatingPlant', params, config);
};

//********** 角色权限相关接口开始 **********//

// 获取角色操作权限功能点列表
export const actionAuthList = params => {
  return axios.get("/v1/api/role/menus", { params: params }, config);
}
// 获取数据查看权限
export const dataAuthList = params => {
  return axios.get("/v1/api/role/moduleData", { params: params }, config);
}

// 查询工厂所有工位（不含老板，不分页）
export const workbays = params => {
  return axios.post('/v1/api/facUser/workbays', params, config);
};
// 新建角色
export const addRole = params => {
  return axios.post('/v1/api/role/', params, config);
};
// 编辑角色
export const editRole = params => {
  return axios.put('/v1/api/role/', params, config);
};
//获取角色列表
export const getRoleList = params => {
  return axios.get("/v1/api/role/pageList", { params: params }, config);
}
//获取角色详情
export const getRoleDetail = params => {
  return axios.get("/v1/api/role/details", { params: params }, config);
}
//启用角色
export const validRole = params => {
  return axios.put(`/v1/api/role/valid/${params.id}`, params, config);
}
//获取角色权限
export const getRoleAuthority = params => {
  return axios.get("/v1/api/role/list", { params: params }, config);
}

//禁用角色
export const invalidRole = params => {
  return axios.put(`/v1/api/role/invalid/${params.id}`, params, config);
}
//删除角色
export const deleteRole = params => {
  return axios.delete(`/v1/api/role/delete/${params.id}`, params, config);
}

/******************节点工序模板审核配置*********************/
//工单单据审核配置提交
export const billReviewConfigMission = params => {
  return axios.post('v1/api/bill-review-config-mission', params, config);
};
//工单单据审核配置查询
export const getReviewConfigMission = params => {
  return axios.get(`/v1/api/bill-review-config-mission`, { params: params }, config);
};
//工单单据审核配置删除
export const delReviewConfigMission = params => {
  return axios.get(`/v1/api/bill-review-config-mission/checkDelete`, { params: params }, config);
};

//********** 角色权限相关接口结束 **********//

// /v1/api/fac-mission-prcd-node-reports/repaired//工单工序节点ID/唯一码ID 再修上报唯一码
export const repairedReport = params => {
  return axios.post(` /v1/api/fac-mission-prcd-node-reports/repaired/${params.instanceId}/${params.wymId}`, params, config);
}

// /v1/api/fac-mission-prcd-nodes/WYMStatus 查看其它节点的唯一码
export const wymStatus = params => {
  return axios.post('/v1/api/fac-mission-prcd-nodes/WYMStatus', params, config);
};

// v1/api/fac-mission-prcd-nodes/WYMList 查看唯一码
export const wyMList = params => {
  return axios.post('/v1/api/fac-mission-prcd-nodes/WYMList', params, config);
};

// /v1/api/fac-mission-prcd-node-reports/manual/工单工序节点ID/唯一码ID 手动上报唯一码
export const handReport = params => {
  return axios.post(` /v1/api/fac-mission-prcd-node-reports/manual/${params.instanceId}/${params.wymId}`, params, config);
}

// /唯一码导出接口
export const exportWYMStatus = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/exportWYMStatus`, params, {
    responseType: 'blob'
  });
}

// /v1/api/fac-mission-prcd-node-reports/manual/工单工序节点ID/唯一码ID 取消上报唯一码
export const cancelReport = params => {
  return axios.post(` /v1/api/fac-mission-prcd-node-reports/canceled/${params.instanceId}/${params.wymId}`, params, config);
}

// type = qualified 合格品上报唯一码
// type = defectived 次品上报唯一码
// type = wasted 废品上报唯一码
export const prcdNodeReports = params => {
  return axios.post(` /v1/api/fac-mission-prcd-node-reports/${params.type}/${params.instanceId}/${params.wymId}`, params, config);
}

// /v1/api/commonSize/delete   体系层删除尺码
export const commonSizeDelete = params => {
  return axios.post('/v1/api/commonSize/delete', params, config);
};


// /v1/api/commonSizeCatagory/delete   体系层删除尺码组
export const commonSizeCatagoryDelete = params => {
  return axios.post('/v1/api/commonSizeCatagory/delete', params, config);
};


// /v1/api/commonSize/update   修改尺码组的尺码
export const commonSizeUpdate = params => {
  return axios.post('/v1/api/commonSize/update', params, config);
};


// /v1/api/commonSizeCatagory/updateOrgStatus   组织尺码组更新启用状态
export const updateOrgStatus = params => {
  return axios.post('/v1/api/commonSizeCatagory/updateOrgStatus', params, config);
};

///v1/api/fac/defectiveLabel/addDefectiveLabel 增加单个次品标签
export const addDefectiveLabel = params => {
  return axios.post('/v1/api/fac/defectiveLabel/addDefectiveLabel', params, config);
};

// /v1/api/fac-mission-prcd-nodes/节点ID/notify-note-add 对于工单详情里面当前节点的备注添加
export const addNotifyRemake = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/notify-note-add`, params, config);
};

// /v1/api/fac-mission-prcd-nodes/b888b3db78664e46887a6dc62bf9b6b8/notify-note-update 修改工单节点备注
export const updateNotifyRemake = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/notify-note-update`, params, config);
};

//  /v1/api/fac-mission-prcd-nodes/节点ID/notify-note-delete 删除备注
export const deleteNotifyRemake = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/notify-note-delete`, params, config);
};

// /v1/api/fac-mission-prcd-nodes/节点ID/notify-difference-warning-delete 删除提醒
export const deleteNotifyBalance = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes/${params.instanceId}/notify-difference-warning-delete`, params, config);
};

export const getNodeInfoByHover = params => {
  return axios.get(`/v1/api/fac/mission/${params.instanceId}/nodeInfo`, { params: params }, config);
}

// PUT /v1/api/fac/mission/工单ID/priority/[0, 1] 修改工单的
export const changePriority = params => {
  return axios.put(`/v1/api/fac/mission/${params.missionId}/priority/${params.priorityId}`, params, config);
};

// 快速上报数据
export const getReportData = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/${params.typeCode}/${params.instanceId}/fastReportDataModule`, { params: params }, config);
}
// /v1/api/fac-mission-prcd-nodes/节点ID/material-complete 点击标为完成（送料型）
export const materialChangeSuccess = params => {
  return axios.put(`/v1/api/fac-mission-prcd-nodes//${params.instanceId}/material-complete`, params, config);
};

// /v1/api/fac/form/manage/node/staff 工位-节点获取列表
export const staffDataList = params => {
  return axios.post(`/v1/api/fac/form/manage/node/staff`, params, config);
};

// /v1/api/fac/form/manage/staff/node 工位-节点获取列表
export const nodeDataList = params => {
  return axios.post(`/v1/api/fac/form/manage/staff/node`, params, config);
};

//  /v1/api/fac/form/manage/node/staff/excel 工位-节点获取列表(工位视图，参数与获取列表的一致)
export const excelStaff = params => {
  return axios.post(`/v1/api/fac/form/manage/node/staff/excel`, params, {
    responseType: 'blob'
  });
};

//  /v1/api/fac/form/manage/staff/node/excel 节点-工位获取列表(节点视图，参数与获取列表的一致)
export const excelNode = params => {
  return axios.post(`/v1/api/fac/form/manage/staff/node/excel`, params, {
    responseType: 'blob'
  });
};

//v1/api/fac-mission-prcd-node-reports/undoFinish/上报记录的id/userId=用户id 撤销物料的接口
export const deleteMateriel = params => {
  return axios.delete(`/v1/api/fac-mission-prcd-node-reports/undoFinish/${params.logId}?userId=${params.userId}`, params, config)
};

// 修改工单状态
export const changeOrderStatus = params => {
  return axios.put(`v1/api/fac/mission/${params.missionId}/status/${params.missionStatus}`, params, config);
};

// 关联扎号撤销接口
export const undoLigationNodeReport = params => {
  return axios.delete(`/v1/api/fac-mission-prcd-node-reports/undoLigationNodeReport`, { params: params });
}

// 扎号列表接口
export const ligationList = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/ligationList`, params);
}

// 获取质检节点扎号修改上报数据
export const getLigationReportData = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/ligationReport`, { params: params }, config);
}
// 扎号上报打印数据
export const ligationPrint = params => {
  return axios.post(`v1/api/fac-mission-prcd-nodes/ligationPrint`, params, config);
}
// 设计档案列表
export const designstylePage = params => {
  return axios.post(`/v1/api/spl/designstyle/list`, params, config);
}
// 设计档案重编号
export const updateDesignStyleNos = params => {
  return axios.post(`/v1/api/spl/designstyle/updateDesignStyleNos`, params, config);
}

//新建设计档案负责人和总监下拉框列表
export const designstyleFormUser = params => {
  return axios.get(`v1/api/spl/designstyle/form`, { params: params }, config);
}

//新建设计档案设计款号查重
export const queryDesignStyleNoRepeat = params => {
  return axios.get(`v1/api/spl/designstyle/queryDesignStyleNoRepeat`, { params: params }, config);
}

//新建设计档案货品款号查重
export const queryGoodStyleNoRepeat = params => {
  return axios.get(`v1/api/spl/designstyle/queryGoodStyleNoRepeat`, { params: params }, config);
}

//检查是否有商品款号自动生成规则
export const isExistGenerateStyleNo = params => {
  return axios.get(`/v1/api/style/no/isExistGenerateStyleNo`, { params: params }, config);
}

//检查获取 是否设置为自动编号
export const isExistGenerateStyleNoList = params => {
  return axios.get(`v1/api/style/no/list`, { params: params }, config);
}
// g更新款号
export const updateMissionPreview = params => {
  return axios.post(`/v1/api/spl/design/mission/preview`, params, config);
}
//获取全部颜色，尺码，内长
export const getFacCommonSettingsSku = params => {
  return axios.post(`/v1/api/fac/common/settings/getFacCommonSettingsSku`, params, config);
}
//自动生成sku条形码
export const generatorSkuBarcodes = params => {
  return axios.post(`/v1/api/fac/barcode/generatorSkuBarcodes`, params, config);
}

//检查sku自定义属性和下拉数据
export const commonStyleSkuAttrAll = params => {
  return axios.get(`/v1/api/fac/commonStyleSku/commonStyleSkuAttrAll`, { params: params }, config);
}


//新建设计档案
// 保存：/v1/api/spl/design/mission/add/0
// 提报：/v1/api/spl/design/mission/add/1
export const designstyleCreate = params => {
  // return axios.post(`v1/api/spl/designstyle/create`, params, config);
  return axios.post(`v1/api/spl/design/mission/add/${params.type}`, params, config);
}

// 上传样衣图
export const sampleCreatePicture = params => {
  return axios.post(`/v1/api/spl/sample/create`, params, config);
}
// 上传设计稿
export const addDesignPicture = params => {
  return axios.post(`/v1/api/spl/designstyle/addDesignPicture`, params, config);
}
// 设计档案批量提报、淘汰与恢复
export const forward = params => {
  return axios.post(`/v1/api/spl/designstyle/list/${params.type}`, params, config);
}

//设计档案列表获取编辑功能列表
export const designstyleListEdit = params => {
    return axios.get(`/v1/api/spl/designstyle/list/${params.type}?designStyleId=${params.designStyleId}&userId=${params.userId}`, params, config);
}
//货品款号/设计负责人/设计总监下拉列表

export const designstyleQueryListData = params => {
  return axios.get(`v1/api/spl/designstyle/queryListData`, { params: params }, config);
}

//获取设计款号下拉

export const stylesName = params => {
  return axios.get(`/v1/api/spl/designstyle/stylesName`, { params: params }, config);
}

//设计档案商品款号下拉

export const goodsStyleNos = params => {
  return axios.get(`/v1/api/spl/designstyle/goodsStyleNos`, { params: params }, config);
}

// 获取商品款号下拉
export const goodsStyleSimpleList = params => {
  return axios.post(`/v1/api/fac/goods/goodsStyleSimpleList`, params, config);
}

// 获取体系层商品款号下拉
export const commonGoodsStyleSimpleList = params => {
  return axios.post(`/v1/api/fac/goods/commonGoodsStyleSimpleList`, params, config);
}

// 获取设计相关的商品款号下拉
export const getGoodsStyleInfoSimpleList = params => {
  return axios.post(`/v1/api/spl/designstyle/getGoodsStyleInfoSimpleList`, params, config);
}


//设计档案详情
export const designstyleEditAndDetail = params => {
  return axios.get(`v1/api/spl/designstyle/editAndDetail`, { params: params }, config);
}
//设计档案删除
export const designstyleDelete = params => {
  return axios.get(`v1/api/spl/designstyle/delete`, { params: params }, config);
}

//编辑设计档案 / 编辑提报
export const designstyleUpdate = params => {
  return axios.post(`/v1/api/spl/designstyle/update/${params.type}`, params, config);
}

//设计档案工艺信息
export const processDetails = params => {
  return axios.get(`v1/api/spl/process/details`, { params: params }, config);
}
//财务账户列表查询（全部账户）
export const financialAccountQueryList = params => {
  return axios.post(`v1/api/config/finance/account/page`, params, config);
}
//.财务账户新增
export const financialAccountAdd = params => {
  return axios.post(`v1/api/config/finance/account/add`, params, config);
}
//.财务账户编辑
export const financialAccountEdit = params => {
  return axios.post(`v1/api/config/finance/account/update`, params, config);
}
//删除财务账户
export const accountDel = params => {
  return axios.get(`v1/api/config/finance/account/delete`, { params: params }, config);
}

// 员工管理列表
export const membersMemberPage = params => {
  return axios.post(`v1/api/config/members/memberPage`, params, config);
}
// 员工详情接口
export const membersMemberDetail = params => {
  return axios.post(`v1/api/config/members/menberDetail`, params, config);
}

// 员工编辑接口
export const membersMemberMemberUpdate = params => {
  return axios.post(`v1/api/config/members/menberUpdate`, params, config);
}

// .体系所有相关组织集
export const unitRelateGroup = params => {
  return axios.post(`v1/api/config/members/unitRelateGroup`, params, config);
}

// 员工Delete接口
export const membersMemberDelete = params => {
  return axios.post(`v1/api/config/members/menberDelete`, params, config);
}

//创建设计档案工艺信息
export const processCreate = params => {
  return axios.post(`v1/api/spl/process/create`, params, config);
}

/************************ 动态配置工单表头 ***********************/
//工单表格列表可选字段列表
export const fieldConfigList = params => {
  return axios.post(`/v1/api/fac/facFieldConfig/fieldConfigList`, params, config);
}
//工单表格列表已选字段列表
export const chooseFieldConfigList = params => {
  return axios.post(`/v1/api/fac/facFieldConfig/chooseFieldConfigList`, params, config);
}
//工单表格列表默认字段列表
export const defaultFieldConfigList = params => {
  return axios.post(`/v1/api/fac/facFieldConfig/defaultFieldConfigList`, params, config);
}
//工单表格列表选择字段保存接口
export const updateChooseFacField = params => {
  return axios.post(`/v1/api/fac/facFieldConfig/updateChooseFacField`, params, config);
}



//编辑设计档案工艺单
export const processUpdate = params => {
  return axios.post(`v1/api/spl/process/update`, params, config);
}

//删除设计档案工艺单
export const processDelete = params => {
  return axios.get(`v1/api/spl/process/delete`, { params: params }, config);
}

//设计档案工艺单预览
export const processPreview = params => {
  return axios.post(`v1/api/spl/process/preview`, params, config);
}
//财务账户列表下拉接口
export const queryList = params => {
  return axios.post(`/v1/api/config/finance/account/queryList`, params, config);
}
//倒料和退料详情对冲核销详情数据
export const getNeedPayNeedReceiveOrderByMaterialArriveOrderId = params => {
  return axios.post(`v1/api/needPayNeedReceiveOrderApi/getNeedPayNeedReceiveOrderByMaterialArriveOrderId`, params, config);
}
// 撤销流水单核销流水记录
export const revokeJournalAccountOrderVerificationRecord = params => {
  return axios.post(`/v1/api/needPayNeedReceiveOrderApi/revokeJournalAccountOrderVerificationRecord`, params, config);
}
// 撤销应付应收单对冲
export const revokeNeedPayNeedReceiveOrderHedging = params => {
  return axios.post(`/v1/api/needPayNeedReceiveOrderApi/revokeNeedPayNeedReceiveOrderHedging`, params, config);
}

//物料导入表格
export const importMaterialsSkuExcel = params => {
  return axios.post(`/v1/api/fac/materials/importMaterialsSkuExcel`, params, configUpload);
}
//供应商导入表格
export const importMaterialSupExcel = params => {
  return axios.post(`/v1/api/supplier/importExcel`, params, configUpload);
}
//设计档案导入表格
export const importDesignFileSupExcel = params => {
  return axios.post(`/v1/api/spl/designstyle/importExcel`, params, configUpload);
}
//商品导入
export const importGoodsExcel = params => {
  return axios.post(`/v1/api/fac/goods/importExcel`, params, configUpload);
}
//加工厂商导入表格
export const importOutsideExcel = params => {
  return axios.post(`/v1/api/outside/factory/importExcel`, params, configUpload);
}
//加工厂附件列表
export const getAttachmentList = params => {
  return axios.get(`/v1/api/outside/factory/getAttachmentList`, { params: params }, config);
}
//从体系导入列表表格数据
export const commonStyleListNoUnit = params => {
  return axios.post(`/v1/api/fac/goods/commonStyleListNoUnit`, params, configUpload);
}
//从体系导入范围弹窗
export const commonStyleImport = params => {
  return axios.post(`/v1/api/fac/goods/commonStyleImport`, params, configUpload);
}

//设计档案创建bom
export const bomCreate = params => {
  return axios.post(`v1/api/spl/bom/create`, params, config);
}

//设计档案编辑bom
export const bomUpadate = params => {
  return axios.post(`v1/api/spl/bom/update`, params, config);
}

//设计档案创建bom的下拉菜单列表
export const designStyleSkuList = params => {
  return axios.get(`v1/api/spl/bom/designStyleSkuList`, { params: params }, config);
}

//设计档案按货品查看bom
export const bomGoodsList = params => {
  return axios.get(`v1/api/spl/bom/bomGoodsList`, { params: params }, config);
}

//设计档案按物料查看bom
export const bomMaterialsList = params => {
  return axios.get(`v1/api/spl/bom/bomMaterialsList`, { params: params }, config);
}

//设计档案删除bom
export const bomDelete = params => {
  return axios.get(`v1/api/spl/bom/delete`, { params: params }, config);
}

//设计档案工序模板列表
export const templateFindTemplate = params => {
  return axios.get(`v1/api/spl/template/findTemplateList`, { params: params }, config);
}

//设计档案新建样衣档案
export const sampleCreate = params => {
  return axios.post(`v1/api/spl/sample/create`, params, config);
}

//设计档案样衣列表
export const sampleList = params => {
  return axios.get(`v1/api/spl/sample/list`, { params: params }, config);
}

//样衣档案详情
export const sampleDetail = params => {
  return axios.get(`v1/api/spl/sample/detail/${params.id}`, { params: params }, config);
}
//样衣档案列表刪除
export const sampleDelete = params => {
  return axios.delete(`/v1/api/spl/sample/delete`, { params: params }, config);
}

//创建工序模板
export const templateCreate = params => {
  return axios.post(`v1/api/spl/template/create`, params, config);
}
//编辑工序模板
export const templateUpdate = params => {
  return axios.post(`v1/api/spl/template/update`, params, config);
}

//样衣档案导入设计档案工序模板接口
export const sampleTemplateAdd = params => {
  return axios.post(`/v1/api/spl/sample/add/template`, params, config);
}

//样衣档案号查重
export const sampleIsExist = params => {
  return axios.get(`v1/api/spl/sample/isExist`, { params: params }, config);
}

//样衣档案模板接口
export const sampleTemplate = params => {
  return axios.get(`/v1/api/spl/sample/list/template/${params.sampleId}`, { params: params }, config);
}

//编辑样衣档案
export const sampleUpdate = params => {
  return axios.post(`v1/api/spl/sample/update/${params.id}`, params, config);
}

//样衣档案获取工艺单列表
export const sampleListProcessForm = params => {
  return axios.get(`v1/api/spl/sample/list/processForm/${params.id}`, { params: params }, config);
}

//样衣档案添加工艺单
export const sampleAddProcessForm = params => {
  return axios.post(`v1/api/spl/sample/add/processForm`, params, config);
}

//#设计档案成本核算关联删除
export const costRelationDelete = params => {
  return axios.get(`/v1/api/spl/cost/relationDelete`, { params: params }, config);
}

//#设计档案成本核算
export const costRelationEdit = params => {
  return axios.get(`/v1/api/spl/cost/relationEdit`, { params: params }, config);
}

//样衣档案获取BOM
export const sampleListBom = params => {
  return axios.get(`v1/api/spl/sample/list/bom/${params.id}`, { params: params }, config);
}

//样衣档案添加BOM
export const sampleAddBom = params => {
  return axios.post(`v1/api/spl/sample/add/bom`, params, config);
}

//样衣档案获取工艺单详情
export const sampleDetailProcessForm = params => {
  return axios.get(`v1/api/spl/sample/detail/processForm`, { params: params }, config);
}

//样衣档案删除工艺单
export const sampleDeleteProcessForm = params => {
  return axios.delete(`v1/api/spl/sample/delete/processForm`, { params: params }, config);
}

//样衣档案按物料查看BOM详情
export const sampleDetailMaterialSkuBom = params => {
  return axios.get(`v1/api/spl/sample/detail/materialSku/bom`, { params: params }, config);
}

//样衣档案按货品查看BOM详情
export const sampleDetailGoodsSkuBom = params => {
  return axios.get(`v1/api/spl/sample/detail/goodsSku/bom`, { params: params }, config);
}

//样衣档案按货品查看BOM详情
export const sampleDeleteBom = params => {
  return axios.delete(`v1/api/spl/sample/delete/bom`, { params: params }, config);
}

//获取打板文件列表
export const patternMakingList = params => {
    return axios.get(`v1/api/spl/designstyle/templeteList`,{params: params}, config);
}

//上传打板文件
export const patternMakingUpload = params => {
  return axios.post(`v1/api/spl/designstyle/templeteUpload`, params, config);
}

//更新打板文件
export const patternMakingUpdate = params => {
  return axios.post(`v1/api/spl/designstyle/templeteUpdate`, params, config);
}

//删除打板文件
export const patternMakingDelete = params => {
  return axios.get(`v1/api/spl/designstyle/templeteDelete?id=${params}`, config);
}

//工序模板删除
export const templateDelete = params => {
  return axios.get(`v1/api/spl/template/delete`, { params: params }, config);
}

//工序模板编辑准备数据
export const templateEdit = params => {
  return axios.get(`v1/api/spl/template/edit`, { params: params }, config);
}

//样衣档案成本核算
export const sampleCostAccounting = params => {
  return axios.get(`v1/api/spl/sample/costAccounting/${params.id}`, { params: params }, config);
}
//设计档案成本核算
export const costAccounting = params => {
  return axios.get(`/v1/api/spl/cost/detail`, { params: params }, config);
}

// //设计档案成本核算列表
// export const sampleCostList = params => {
//     return axios.get(`v1/api/spl/sample/costList`, {params: params}, config);
// }
//设计档案成本核算列表
export const sampleCostList = params => {
  return axios.get(`/v1/api/spl/cost/list`, { params: params }, config);
}

//设为默认设计成本核算
export const sampleCostListDefault = params => {
  return axios.get(`/v1/api/spl/cost/default`, { params: params }, config);
}

//设计档案成本核算新建
export const sampleCostCreate = params => {
  return axios.post(`/v1/api/spl/cost/create`, params, config);
}
//设计档案成本核算编辑
export const sampleCostUpdate = params => {
  return axios.post(`/v1/api/spl/cost/update`, params, config);
}
//设计档案成本核算删除
export const templateSimpleDelete = params => {
  return axios.get(`/v1/api/spl/cost/delete`, { params: params }, config);
}

//样衣档案模板列表
export const templateSimpleList = params => {
  return axios.get(`/v1/api/spl/template/simpleList`, { params: params }, config);
}

//删除颜色尺码内长验证
export const designstyleIsRefrancedSkuId = params => {
  return axios.get(`v1/api/spl/designstyle/isRefrancedSkuId`, { params: params }, config);
}

//设计档案工艺单查重
export const processQueryRepeatName = params => {
  return axios.get(`v1/api/spl/process/queryRepeatName`, { params: params }, config);
}

//设计档案BOM查重
export const bomQueryRepeatName = params => {
  return axios.get(`v1/api/spl/bom/queryRepeatName`, { params: params }, config);
}

// 外发厂下拉列表
export const outsideFactoryListForSelect = params => {
  return axios.get(`v1/api/outside/factory/list`, { params: params }, config);
}
// 节点上报弹窗外发厂下拉列表
export const nodeReportOutsideFactoryList = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/queryNodeReportOutsideFactoryList`, params, config)
}

/**
 * @description 自动编号设置
 * @param params
 * @returns {AxiosPromise}
 */

// 根据id获取自动编号设置 参数id
export const getAutoNumberSetById = params => {
  return axios.get(`/v1/api/style/no/get`, { params: params }, config)
};

// 获取体系层自动编号设置 参数userId
export const getAutoNumberSetByUserId = params => {
  return axios.get(`/v1/api/style/no/list`, { params: params }, config)
}

// 设置系统为系统自动生成或用户自定义规则
export const autoNumberUpdateRule = params => {
  return axios.get(`/v1/api/style/no/udpateRule`, { params: params }, config)
}

// 自动编号设置规则更新
export const autoNumberUpdate = params => {
  return axios.post(`/v1/api/style/no/update`, params, config)
}

//自动编号设置获取适用属性子列表
export const autoNumberBeseemList = params => {
  return axios.get(`/v1/api/style/no/otherList`, { params: params }, config);
}
//自动编号设置删除适用属性
export const autoNumberDeleteBeseemItem = params => {
  return axios.get(`/v1/api/style/no/delete`, { params: params }, config);
}
//自动编号设置切换适用属性
export const autoNumberChangeBeseem = params => {
  return axios.get(`/v1/api/style/no/deleteAll`, { params: params }, config);
}

// 自动编号设置清空属性编码规则接口
export const autoNumberDeleteBeseem = params => {
  return axios.get(`/v1/api/rule/deleteAll`, {params:params}, config);
}

//自动编号设置获取全部适用属性
export const autoNumberGetAttrFields = params => {
  return axios.get(`/v1/api/fac/common/settings/getAttrFields`, { params }, config);
}

// 自动编号设置-获取物料下拉选项
export const getMaterialOptionList = params => {
  return axios.get(`/v1/api/rule/getSubOptions`, { params }, config)
}

//生产订单列表
export const facPrdOrderPage = params => {
  return axios.post(`/v1/api/facPrdOrder/page`, params, config);
}
//审核台生产订单列表查询
export const facTaskOrderPage = params => {
  return axios.post(`/v1/api/uflo/fac-prd-order/task`, params, config);
}
//审核台工单调整单列表查询
export const orderAdjustmentPage = params => {
  return axios.post(`/v1/api/uflo/fac-mission-adjust/task`, params, config);
}
//审核配置查询接口
export const billReviewConfig = params => {
  return axios.get(`/v1/api/bill-review-config`, { params }, config);
}
//通过货款id获取最终供货价
export const getGoodsLastLastSupplyPrice = params => {
  return axios.get(`/v1/api/fac/goods/getGoodsLastLastSupplyPrice`, { params }, config);
}
//审核台左边列表接口
export const billReviewConfigBillType = params => {
  return axios.get(`/v1/api/bill-review/bill-type`, { params }, config);
}
//更新审核配置接口
export const billReviewConfigUpdate = params => {
  return axios.post(`/v1/api/bill-review-config`, params, config);
}
//生产订单审核接口
export const billReviewConfigStatus = params => {
  return axios.post(`/v1/api/uflo/fac-prd-order/review`, params, config);
}
//调整单审核接口
export const facMissionAdjustStatus = params => {
  return axios.post(`/v1/api/uflo/fac-mission-adjust/review`, params, config);
}
//生产订单反审核接口
export const applyAntiReview = params => {
  return axios.post(`/v1/api/uflo/fac-prd-order/apply-anti-review`, params, config);
}
//生产订单反审核接口
export const orderUndoStatus = params => {
  return axios.put(`/v1/api/uflo/fac-prd-order/undo-status`, params, config);
}
//生产订单提报接口
export const billReviewConfigSubmit = params => {
  return axios.post(`/v1/api/uflo/fac-prd-order/submit`, params, config);
}
//生产单查询列表
export const facPrdOrderList = params => {
  return axios.post(`/v1/api/facPrdOrder/facPrdOrderList`, params, config);
}

//生产单新增列表
export const facPrdOrderAdd = params => {
  return axios.post(`/v1/api/facPrdOrder/add`, params, config);
}
//生产单详情
export const facPrdOrderDetail = params => {
  return axios.post(`/v1/api/facPrdOrder/facPrdOrderDetail`, params, config);
}

//编辑工单货品物料
export const editFacPrdOrderGoodsMaterialSku = params => {
  return axios.post(`/v1/api/facPrdOrder/editFacPrdOrderGoodsMaterialSku`, params, config);
}


//一键转工单列表
export const orderToFacList = params => {
  return axios.post(`/v1/api/facPrdOrder/facPrdOrderGoodsCustomerList`, params, config);
}

//键转工单保存
export const orderToFacSave = params => {
  return axios.post(`/v1/api/facPrdOrder/facPrdOrderGoodsCustomerTurnMission`, params, config);
}

//手动改状态
export const updatePurchaseStatus = params => {
  return axios.post(`/v1/api/facPrdOrder/updatePurchaseStatus`, params, config);
}


//生产采购计划
export const updatePurchasePlan = params => {
  return axios.post(`/v1/api/facPrdOrder/purchasePlan`, params, config);
}

//预下单 新建
export const addAdvanceOrder = params => {
  return axios.post(`/v1/api/facPrdOrder/addAdvanceOrder`, params, config);
}

//预下单 编辑
export const updateAdvanceOrder = params => {
  return axios.post(`/v1/api/facPrdOrder/updateAdvanceOrder`, params, config);
}

//生产订单 编辑
export const updateFacPrdOrder = params => {
  return axios.post(`/v1/api/facPrdOrder/updateFacPrdOrder`, params, config);
}

//关联订单列表
export const facPrdOrderFilterList = params => {
  return axios.get(`/v1/api/facPrdOrder/getSimpleList`, { params: params }, config);
}

//订单/预下单驳回接口
export const facPrdOrderReject = params => {
  return axios.get(`/v1/api/facPrdOrder/reject`, { params: params }, config);
}

//订单/预下单驳回接口
export const facPrdOrderPass = params => {
  return axios.get(`/v1/api/facPrdOrder/pass`, { params: params }, config);
}

//订单/预下单作废接口
export const facPrdOrderCancel = params => {
  return axios.get(`/v1/api/facPrdOrder/cancel`, { params: params }, config);
}

//生产采购计划
export const facPrdOrderConfig = params => {
  return axios.get(`/v1/api/material/purchase/config/facPrdOrderConfig`, { params: params }, config);
}


//生产订单转工单获取bom表
export const frdOrderBom = params => {
  return axios.get(`/v1/api/facPrdOrder/frdOrderBom/${params.orderId}`, { params: params }, config);
}

//下单类型下拉接口
export const placeOrderTypeList = params => {
  return axios.get(`/v1/api/common-goods-attr/placeOrderTypeList`, { params: params }, config);
}
//外发厂加工结算列表
export const factoryPayList = params => {
  return axios.post(`/v1/api/outside/factory/pay/list`, params, config);
}

//外发厂付款
export const factoryPayAdd = params => {
  return axios.post(`/v1/api/outside/factory/pay/add`, params, config);
}

//外发厂付款
export const factoryPayDetails = params => {
  return axios.post(`/v1/api/outside/factory/pay/details`, params, config);
}

//获取付款记录详情导出Excel接口
export const factoryPayExportExcel = params => {
  return axios.post(`/v1/api/outside/factory/pay/exportExcel`, params, {
    responseType: 'blob'
  });
}


//厂商货号下拉接口
export const queryGoodsStyleByPlantArticleNumber = params => {
  return axios.get(`/v1/api/fac/goods/queryGoodsStyleByPlantArticleNumber`, { params: params }, config);
}

//获取颜色分组
export const findEditColors = params => {
  return axios.get(`/v1/api/fac/common/settings/findEditColors`, { params: params }, config);
}


//删除颜色分组
export const deleteCategory = params => {
  return axios.get(`/v1/api/fac/common/settings/deleteCategory`, { params: params }, config);
}

//颜色分组排序接口
export const updateCategorySort = params => {
  return axios.post(`/v1/api/fac/common/settings/updateCategorySort`, params, config);
}

//批量修改分组接口
export const updateCategorys = params => {
  return axios.post(`/v1/api/fac/common/settings/updateCategorys`, params, config);
}

//获取属性库10个属性
export const getFacCommonAttrs = params => {
  return axios.post(`/v1/api/fac/common/settings/getFacCommonAttrs`, params, config);
}

//撤销物料sku生成的采购计划
export const updateCanclePurchase = params => {
  return axios.post(`/v1/api/facPrdOrder/canclePurchase`, params, config);
}

//获取客户上报的sku列表
export const getFacGoodsForCustomerSku = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/getFacGoodsForCustomerSku`, { params: params }, config);
}


//获取配置了自由送料型节点的工单接口
export const getfreedomMissions = params => {
  return axios.get(`/v1/api/delivery/material/getfreedomMissions`, { params: params }, config);
}

//获取提报时检查项必填字段
export const getCheckData = params => {
  return axios.get(`/v1/api/spl/designstyle/getCheckData`, { params: params }, config);
}

//检查项详情接口
export const getRequiredDetail = params => {
  return axios.get(`/v1/api/spl/design/mission/workspace/getRequiredDetail`, { params: params }, config);
}

//检查项节点接口
export const getMisssionRequiredDetail = params => {
  return axios.get(`/v1/api/spl/design/mission/workspace/getMisssionRequiredDetail`, { params: params }, config);
}

//获取体系层自动编号设置接口
export const ruleList = params => {
  return axios.get(`/v1/api/rule/list`, { params: params }, config);
}

//新建生产订单/工单规则
export const ruleCreate = params => {
  return axios.post(`/v1/api/rule/create`, params, config);
}

//编辑生产订单/工单规则
export const ruleUpdate = params => {
  return axios.post(`/v1/api/rule/update`, params, config);
}

//生产订单/工单规则配置手动或自动
export const updateRule = params => {
  return axios.get(`/v1/api/rule/updateRule`, { params: params }, config);
}

//生产订单/工单规则配置删除(调试用)
export const deleteRule = params => {
  return axios.get(`/v1/api/rule/deleteRule`, { params: params }, config);
}

//获取难度系数下拉筛选
export const patternStyleAndDifficultyList = params => {
  return axios.get(`/v1/api/spl/designstyle/patternStyleAndDifficultyList`, { params: params }, config);
}

// //分配样衣师
// export const allocationSampleDesigner = params => {
//     return axios.post(`/v1/api/spl/designstyle/allocationSampleDesigner`, params, config);
// }

// //分配版师
// export const allocationMachinist = params => {
//     return axios.post(`/v1/api/spl/designstyle/allocationMachinist`, params, config);
// }

//获取难度系数左侧下拉筛选
export const patternStyleAndDifficultyLeftList = params => {
  return axios.get(`/v1/api/spl/designstyle/patternStyleAndDifficultyLeftList`, { params: params }, config);
}
//获取难度系数右侧下拉筛选
export const patternStyleAndDifficultyRightList = params => {
  return axios.get(`/v1/api/spl/designstyle/patternStyleAndDifficultyRightList`, { params: params }, config);
}
//获取难度系数右侧下拉筛选
export const getDifficulty = params => {
  return axios.get(`/v1/api/spl/designstyle/getDifficulty`, { params: params }, config);
}

//修改工作台打板/样衣节点难度系数
export const updateSampleOrMachinistDifficulty = params => {
  return axios.post(`/v1/api/spl/designstyle/updateSampleOrMachinistDifficulty`, params, config);
}

//获取难度系数编辑数据
export const getPatternStyleAndDifficulty = params => {
  return axios.get(`/v1/api/spl/designstyle/getPatternStyleAndDifficulty`, { params: params }, config);
}

//节点管理编辑难度系数时准备数据
export const getDifficultyDetail = params => {
  return axios.get(`/v1/api/spl/designstyle/getDifficultyDetail`, { params: params }, config);
}

//设计节点管理配置难度系数编辑
export const updateDifficultyDetail = params => {
  return axios.post(`/v1/api/spl/designstyle/updateDifficultyDetail`, params, config);
}

//分配/修改版师难度
export const allocationMachinist = params => {
  return axios.post(`/v1/api/spl/designstyle/allocationMachinist`, params, config);
}

//分配/修改样衣室难度
export const allocationSampleDesigner = params => {
  return axios.post(`/v1/api/spl/designstyle/allocationSampleDesigner`, params, config);
}
///节点标签更新接口
export const nodesTagUpdate = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/tag/update`, params, config);
}
///节点标签列表接口
export const nodesTagList = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/tag/list`, { params: params }, config);
}
///节点标签勾选接口
export const nodesTagCheckTag = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/tag/checkTag`, { params: params }, config);
}
///扎号打印接口
export const printLigation = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/printLigation`, params, config);
}

///收费控制列表
export const chargeManageList = params => {
  return axios.post(`/v1/api/unit/chargeManage/list`, params, config);
}

///收费权限菜单明细
export const chargeManageDetail = params => {
  return axios.get(`/v1/api/unit/chargeManage/detail`, { params: params }, config);
}

///收费权限控制账号收费
export const chargeManageUpdate = params => {
  return axios.post(`/v1/api/unit/chargeManage/update`, params, config);
}

///订单导入接口
export const facPrdOrderImportExcel = params => {
  return axios.post(`/v1/api/facPrdOrder/importExcel`, params, config);
}

///订单导出失败数据
export const exportErrorExcel = params => {
  return axios.post(`/v1/excel/import/exportErrorExcel`, params, {
    responseType: 'blob'
  });
}

//新建库存单据
export const createStockBill = params => {
  return axios.post(`/v1/stock/change/createStockBill`, params, config);
}
//编辑库存单据
export const updateStockBill = params => {
  return axios.post(`/v1/stock/change/updateStockBill`, params, config);
}

//库存单据列表
export const billList = params => {
  return axios.post(`/v1/stock/change/billList`, params, config);
}
//库存单据打印次数统计
export const printCount = params => {
  return axios.get(`/v1/stock/change/updatePrintCount`, { params: params }, config);
}
// 导出库存单据
export const exportExcelBillList = params => {
  return axios.post(`/v1/stock/change/exportExcel`, params, {
    responseType: 'blob'
  });
}

///号型列表
export const sizeTypeCategoryList = params => {
  return axios.post(`/v1/api/commonSizeCatagory/sizeTypeCategoryList`, params);
}
///addSizeTypeCategory
export const addSizeTypeCategory = params => {
  return axios.post(`/v1/api/commonSizeCatagory/addSizeTypeCategory`, params);
}
///updateSizeTypeCategory
export const updateSizeTypeCategory = params => {
  return axios.post(`/v1/api/commonSizeCatagory/updateSizeTypeCategory`, params);
}
///deleteSizeTypeCategory
export const deleteSizeTypeCategory = params => {
  return axios.get(`/v1/api/commonSizeCatagory/deleteSizeTypeCategory`, { params });
}
///号型上下移动
export const sizeTypeCategorySeqencing = params => {
  return axios.get(`/v1/api/commonSizeCatagory/sizeTypeCategorySeqencing`, { params });
}
///获取设计工序节点默认配置表头显示内容接口
export const getDefaultTitleShow = params => {
  return axios.get(`/v1/api/spl/design/prcd/node/getDefaultTitleShow`, { params });
}
///获取设计工序节点配置表头显示内容接口（非默认）
export const getTitleShowConfig = params => {
  return axios.get(`/v1/api/spl/design/prcd/node/getTitleShowConfig`, { params });
}
///更新配置表头显示内容接口
export const updateTitleShowConfig = params => {
  return axios.post(`/v1/api/spl/design/prcd/node/updateTitleShowConfig`, params);
}
///获取工位分组接口
export const getStationGroup = params => {
  return axios.get(`/v1/api/spl/design/mission/workspace/getStationGroup`, { params });
}
///更新工位分组接口
export const updateStation = params => {
  return axios.post(`/v1/api/spl/design/mission/workspace/updateStation`, params);
}
///编辑节点接口
export const prcdNodesUpdate = params => {
  return axios.put(`/v1/api/prcd-nodes/update`, params);
}

///#### 编辑用节点详情接口
export const editNodeDetail = params => {
  return axios.get(`/v1/api/prcd-nodes/${params}`);
}

///#### 查询单据所有字段接口
export const billConfigField = params => {
  return axios.get(`/v1/api/prcd-nodes/bill-config/field`, { params });
}

///#### 获取订单配置
export const getFieldConfig = params => {
  return axios.get(`/v1/api/facPrdOrder/getFieldConfig`, { params });
}

///#### getVisibleGoodsInfoByStyleId
export const getVisibleGoodsInfoByStyleId = params => {
  return axios.get(`/v1/api/fac/goods/getVisibleGoodsInfoByStyleId`, { params });
}

///####获取订单提报必填配置接口
export const orderReportGetConfig = params => {
  return axios.get(`/v1/api/facPrdOrder/target/field/getConfig`, { params });
}

///#### 修改提报必填配置接口
export const orderCreateConfig = params => {
  return axios.post(`/v1/api/facPrdOrder/target/field/createConfig`, params);
}

///#### 修改订单配置
export const updateFieldConfig = params => {
  return axios.post(`/v1/api/facPrdOrder/updateFieldConfig`, params);
}


///库存单详情
export const stockChangeDetail = params => {
  return axios.get(`/v1/stock/change/detail`, { params });
}

//单据号下拉
export const getOrderNos = params => {
  return axios.get(`/v1/stock/change/getOrderNos`, { params });
}

export const stockUndo = params => {
  return axios.post(`/v1/stock/change/undo`, params);
}

export const reviewBillStock = params => {
  return axios.post(`/v1/stock/change/reviewBillStock`, params);
}

//新建生产调整单
export const addAdjustPrdOrder = params => {
  return axios.post(`/v1/api/facPrdOrder/addAdjustPrdOrder`, params);
}

//编辑生产调整单
export const updateAdjustOrder = params => {
  return axios.post(`/v1/api/facPrdOrder/updateAdjustOrder`, params);
}
//调整单详情
export const adjustPrdOrderDetail = params => {
  return axios.get(`/v1/api/facPrdOrder/adjustPrdOrderDetail`, { params });
}

//调整单审核
export const adjustPrdOrderReview = params => {
  return axios.post(`/v1/api/uflo/fac-prd-adjust-order/review`, params);
}

//调整单撤回
export const adjustPrdOrderUndo = params => {
  return axios.put(`/v1/api/uflo/fac-prd-adjust-order/undo-status`, params, config);
}

//调整单撤回
export const adjustPrdOrderAntiReview = params => {
  return axios.post(`/v1/api/uflo/fac-prd-adjust-order/apply-anti-review`, params);
}

//调整单提报
export const adjustPrdOrderSubmit = params => {
  return axios.post(`/v1/api/uflo/fac-prd-adjust-order/submit`, params);
}

//调整单生成单据
export const doAdjustOrder = params => {
  return axios.get(`/v1/api/facPrdOrder/doAdjustOrder`, { params });
}

//调整单驳回单据
export const undoAdjustOrder = params => {
  return axios.get(`/v1/api/facPrdOrder/undoAdjustOrder`, { params });
}

//获取配置转工单必填列表
export const getAttachmentFieldConfig = params => {
  return axios.get(`/v1/api/facPrdOrder/getAttachmentFieldConfig`, { params });
}

//修改配置转工单必填列表
export const updateAttachmentFieldConfig = params => {
  return axios.post(`/v1/api/facPrdOrder/updateAttachmentFieldConfig`, params);
}

//检查转工单必填
export const checkAttachment = params => {
  return axios.get(`/v1/api/facPrdOrder/checkAttachment`, { params });
}

//修改配置转工单必填列表
export const stockBillSubmit = params => {
  return axios.post(`/v1/api/uflo/stock-bill/submit`, params);
}
//商品档案 配置商品必填列表查询
export const goodEditConfig = params => {
  return axios.get(`/v1/api/businessfield/editConfig`, { params });
}
//商品档案 配置商品必填字段保存/更新
export const goodUpdateConfig = params => {
  return axios.post(`/v1/api//businessfield/updateConfig`, params);
}
//商品档案 保存验证必填字段接口
export const goodCheckOnForward = params => {
  return axios.post(`/v1/api/fac/goods/checkOnForward`, params);
}

//审核台库存调整单/发货单
export const stockBillTask = params => {
  return axios.post(`/v1/api/uflo/stock-bill/task`, params);
}

//审核台审批库存调整单/发货单
export const stockBillReview = params => {
  return axios.post(`/v1/api/uflo/stock-bill/review`, params);
}
//新建设计档案的时候获取设计款号的必填项
export const getRequireDesignCode = params => {
  return axios.get(`/v1/api/spl/design/mission/workspace/getRequireDesignCode`, { params });
}

//库存单撤销
export const stockBillUndo = params => {
  return axios.get(`/v1/api/uflo/stock-bill/undo-status`, { params });
}

//工单号下拉列表
export const getFacMissionNos = params => {
  return axios.get(`/v1/stock/change/getFacMissionNos`, { params });
}

//加工厂商档案审核台列表
export const outsideFactoryTask = params => {
  return axios.post(`/v1/api/uflo/outside/factory/task`, params);
}


//加工厂商档案撤回
export const outsideFactoryUndoStatus = params => {
  return axios.get(`/v1/api/uflo/outside/factory/undo-status`, { params });
}

//加工厂商档案提报
export const outsideFactorySubmit = params => {
  return axios.post(`/v1/api/uflo/outside/factory/submit`, params);
}

//加工厂商档案申请反审
export const outsideFactoryAntiReview = params => {
  return axios.post(`/v1/api/uflo/outside/factory/apply-anti-review`, params);
}

//加工厂商档案改变状态
export const outsideFactoryReviewStatus = params => {
  return axios.get(`/v1/api/outside/factory/reviewStatus`, { params });
}

//加工厂商档案审核台
export const outsideFactoryReview = params => {
  return axios.post(`/v1/api/uflo/outside/factory/review`, params);
}

//商品bom审核台列表接口
export const getBomTaskList = params => {
  return axios.post(`/v1/api/uflo/common/bom/task`, params);
}

//商品bom提报接口
export const bomTaskSubmit = params => {
  return axios.post(`/v1/api/uflo/common/bom/submit`, params);
}

//商品bom审核接口
export const bomTaskReview = params => {
  return axios.post(`/v1/api/uflo/common/bom/review`, params);
}

//商品bom申请反审接口
export const bomTaskApplyReview = params => {
  return axios.post(`/v1/api/uflo/common/bom/apply-anti-review`, params);
}

//查看全部操作记录接口
export const bomTaskLogList = params => {
  return axios.get(`/v1/api/fac/commonBom/logList`, { params });
}

//查看全部操作记录接口
export const bomTaskLogDetail = params => {
  return axios.get(`/v1/api/fac/commonBom/logDetail`, { params });
}

//商品bom撤回接口
export const bomTaskUndoStatus = params => {
  return axios.get(`/v1/api/uflo/common/bom/undo-status`, { params });
}

//获取bom字段配置接口
export const getCommonBomConfig = params => {
  return axios.get(`/v1/api/businessfield/getCommonBomConfig`, { params });
}

//获取bom字段默认配置接口
export const getCommonBomDefaultConfig = params => {
  return axios.get(`/v1/api/businessfield/getCommonBomDefaultConfig`, { params });
}

//牛厂-体系尺码组列表信息
export const commonSizeCatagory = params => {
  return axios.get(`/v1/api/commonSizeCatagory/list`, { params });
}

//牛厂-中分类列表
export const categoryMediumNotUsedList = params => {
  return axios.get(`/v1/api/goodsAttrSizeCategory/config/categoryMediumNotUsedList`, { params });
}

//牛厂-已经配置尺码组配置的中分类列表
export const categoryMediumUsedList = params => {
  return axios.get(`/v1/api/goodsAttrSizeCategory/config/categoryMediumUsedList`, { params });
}

//牛厂-尺码组配置删除接口
export const categoryMediumDelete = params => {
  return axios.get(`/v1/api/goodsAttrSizeCategory/config/delete`, { params });
}

//尺码组配置添加接口
export const goodsAttrSizeCategoryAdd = params => {
  return axios.post(`/v1/api/goodsAttrSizeCategory/config/add`, params);
}
//尺码组配置编辑接口
export const goodsAttrSizeCategoryUpdate = params => {
  return axios.post(`/v1/api/goodsAttrSizeCategory/config/update`, params);
}
//尺码组配置列表接口
export const goodsAttrSizeCategoryList = params => {
  return axios.post(`/v1/api/goodsAttrSizeCategory/config/list`, params);
}
//码比配置列表接口
export const codeRatioCategoryList = params => {
  return axios.post(`/v1/api/codeRatioCategory/config/list`, params);
}
//码比配置添加接口
export const codeRatioCategoryAdd = params => {
  return axios.post(`/v1/api/codeRatioCategory/config/add`, params);
}
//码比配置编辑接口
export const codeRatioCategoryUpdate = params => {
  return axios.post(`/v1/api/codeRatioCategory/config/update`, params);
}
//码比配置删除接口
export const codeRatioCategoryDelete = params => {
  return axios.get(`/v1/api/codeRatioCategory/config/delete`, { params });
}
//码比配置启用、停用接口
export const opCodeRatioConfig = params => {
  return axios.get(`/v1/api/codeRatioCategory/config/opCodeRatioConfig`, { params });
}
//查看配置启用、停用接口
export const codeRatioConfigInfo = params => {
  return axios.get(`/v1/api/codeRatioCategory/config/codeRatioConfigInfo`, { params });
}
//根据品类_中分类获取尺码接口
export const getSizeInfoByCategoryMediumId = params => {
  return axios.get(`/v1/api/fac/goods/getSizeInfoByCategoryMediumId`, { params });
}
//通过货款id获取码比配置列表接口
export const codeRatioListByStyleId = params => {
  return axios.get(`/v1/api/codeRatioCategory/config/codeRatioListByStyleId`, { params });
}
//更新bom字段配置接口
export const updateCommonBomConfig = params => {
  return axios.post(`/v1/api/businessfield/updateCommonBomConfig`, params);
}

//采购需求主动占用
export const stockActivePreuse = params => {
  return axios.put(`/v1/api/material/purchase-demand/stock-active-preuse`, params, config);
}
//主动占用设置查询
export const stockSkuPreuseConfig = params => {
  return axios.get(`/v1/api/stock-sku-preuse-config`, { params });
}
//主动占用设置查询
export const stockSkuPreuseConfigSetting = params => {
  return axios.put(`/v1/api/stock-sku-preuse-config`, params, config);
}

//物料款号重编辑
export const updateMaterialsNos = params => {
  return axios.post(`/v1/api/fac/materials/updateMaterialsNos`, params);
}

//物料档案下载失败列表
export const exportErrorMaterialExcel = params => {
  return axios.post(`/v1/api/fac/materials/exportErrorExcel`, params, {
    responseType: 'blob'
  });
}

//物料档案导出
export const materialExportExcel = params => {
  return axios.post(`/v1/api/fac/materials/exportExcel`, params, {
    responseType: 'blob'
  });
}
export const deleteOtbActual = params => {
  return axios.delete(`/v1/api/otb/deleteOtbActual`, { params: params });
};

//库存单据详情
export const centralStockDetail = params => {
  return axios.get(`${process.env.CENTRAL_URL}bill/stock/change/stockDetail`, { params });
}
//库存通知单列表
export const stockInformList = params => {
  return axios.post(`${process.env.CENTRAL_URL}bill/stock/change/inform/list`, params);
}
//库存通知单列表下拉
export const stockInformListId = params => {
  return axios.post(`${process.env.CENTRAL_URL}bill/stock/change/inform/list/id`, params);
}
//库存单新建
export const stockInformCreate = params => {
  return axios.post(`${process.env.CENTRAL_URL}bill/stock/change/create`, params);
}
//入库通知单关闭
export const stockInformClose = params => {
  return axios.post(`${process.env.CENTRAL_URL}bill/stock/change/close`, params);
}
//查询入库通知单数量
export const stockInformCount = params => {
  return axios.get(`${process.env.CENTRAL_URL}bill/stock/change/count`, { params });
}
//商品导入模板
export const exportExcelTemplate = params => {
  return axios.post(`/v1/api/fac/goods/exportExcelTemplate`, params, {
    responseType: 'blob'
  });
}
// // generateExcel 下载条形码
// export const generateExcel = params => {
//     return axios.post(`/v1/api/fac/barcode/generateExcel`, params, {
//         responseType: 'blob'
//     })
// };
//获取裁片组列表
export const cbsgcGetList = params => {
  return axios.get(`/v1/api/fac-mission-prcd-nodes/cbsgc/getList`, { params });
}

//获取裁片组列表
export const cbsgcGetUpdate = params => {
  return axios.post(`/v1/api/fac-mission-prcd-nodes/cbsgc/update`, params);
}


//物料档案审核台列表
export const materialsTask = params => {
  return axios.post(`/v1/api/uflo/common/materials/task`, params);
}
//物料档案审核
export const materialsReview = params => {
  return axios.post(`/v1/api/uflo/common/materials/review`, params);
}
//物料档案申请反审
export const materialsAntiReview = params => {
  return axios.post(`/v1/api/uflo/common/materials/apply-anti-review`, params);
}
//物料档案提报接口
export const materialTaskSubmit = params => {
  return axios.post(`/v1/api/uflo/common/materials/submit`, params);
}

//物料档案撤回接口
export const materialTaskUndoStatus = params => {
  return axios.get(`/v1/api/uflo/common/materials/undo-status`, { params });
}

//物料档案未配置审核台申请驳回/生成档案
export const materialTaskUndoReview = params => {
  return axios.get(`/v1/api/uflo/common/materials/undo-review`, { params });
}
//跨节点上报勾选框
export const updatePrcdNodeReportStatus = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/updatePrcdNodeReportStatus`, { params });
}

//更新节点上报权限
export const checkReportPermission = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/checkReportPermission`, { params });
}

//检查是否有节点上报权限
export const getPrcdNodeReportStatus = params => {
  return axios.get(`/v1/api/fac-mission-prcd-node-reports/getPrcdNodeReportStatus`, { params });
}

//******** 富筛选组件相关接口 START********//
// 查询弹窗所需数据接口
export const getCommonFilterDialogParams = params => {
  return axios.get(`/v1/api/common-filter/dialog`, { params });
}
//通用远程查询筛选项接口
export const commonFilterRemoteSearch = params => {
  return axios.post(`/v1/api/common-filter/remote`, params);
}

//通用远程查询筛选项接口
export const commonFilterRemoteSearchForReview = params => {
    return axios.post(`/v1/api/common-filter/remote-for-review`, params);
}

// 发起查询统一调用接口
export const commonFilterSearch = params => {
  return axios.post(`/v1/api/common-filter/search`, params);
}
//******** 富筛选组件相关接口 END********//


// 根据商品款号获取订单号下拉
export const orderNosByStyleId = params => {
  return axios.get(`/v1/api/facPrdOrder/orderNosByStyleId`, { params });
}

// 新建BOM表时检查所有的固定用料
export const defaultMaterialsSkus = params => {
  return axios.post(`/v1/api/fac/materials/defaultMaterialsSkus`, params);
}

// 审核台获取工单号下拉
export const getOrderNo = params => {
  return axios.get(`/v1/api/fac/mission/getOrderNo`, { params });
}
// 到料单按采购单添加分页查询
export const pagePurchase = params => {
  return axios.get(`/v1/api/delivery/material/pagePurchase`, { params });
}
// 到料单按物料添加分页查询
export const pageFormQueryOnMaterial = params => {
  return axios.get(`/v1/api/arrive/pageFormQueryOnMaterial`, { params });
}
// 新建到料单-查询采购单接口(弹窗点确定调用的接口)
export const queryDeliveryDemandForNewBill = params => {
  return axios.post(`/v1/api/arrive/queryDeliveryDemandForNewBill`, params);
}

// 商品档案工序模板列表
export const findTemplateList = params => {
  return axios.get(`/v1/api/goods/template/findTemplateList`, { params });
}

// 商品档案工序模板列表下拉
export const findTemplateSimpleList = params => {
  return axios.get(`/v1/api/goods/template/simpleList`, { params });
}

// // #编辑商品档案工序模板新建
export const goodsTemplateCreate = params => {
  return axios.post(`/v1/api/goods/template/create`, params);
}
// #商品档案工序模板
export const goodsTemplateDetail = params => {
  return axios.get(`/v1/api/goods/template/detail`, { params });
}

// #商品档案工序模板删除
export const goodsTemplateDelete = params => {
  return axios.get(`/v1/api/goods/template/delete`, { params });
}

// #商品成本核算列表
export const goodsCostList = params => {
  return axios.get(`/v1/api/goods/cost/list`, { params });
}

// #编辑商品档案工序模板
export const goodsTemplateUpdate = params => {
  return axios.post(`/v1/api/goods/template/update`, params);
}

// ##新建商品成本核算
export const goodsCostCreate = params => {
  return axios.post(`/v1/api/goods/cost/create`, params);
}

// ##编辑商品成本核算
export const goodsCostUpdate = params => {
  return axios.post(`/v1/api/goods/cost/update`, params);
}

// ##删除商品成本核算
export const goodsCostDelete = params => {
  return axios.get(`/v1/api/goods/cost/delete`, { params });
}

// ##删除商品成本核算
export const goodsCostDefault = params => {
  return axios.get(`/v1/api/goods/cost/default`, { params });
}

// ##设计档案成本核算更新成本信息到设计档案
export const updateCostDefault = params => {
  return axios.get(`/v1/api/spl/cost/updateCost`, { params });
}

// ##商品档案成本核算更新成本信息到商品档案
export const goodsUpdateCostDefault = params => {
  return axios.get(`/v1/api/goods/cost/updateCost`, { params });
}

// ##商品档案成本核算详情
export const goodsCostDetail = params => {
  return axios.get(`/v1/api/goods/cost/detail`, { params });
}

// ##商品成本核算（切换或新增）关联（BOM或工序模板）
export const goodsCostRelationEdit = params => {
  return axios.get(`/v1/api/goods/cost/relationEdit`, { params });
}

// ##商品成本核算（删除）关联（BOM或工序模板）
export const goodsCostRelationDelete = params => {
  return axios.get(`/v1/api/goods/cost/relationDelete`, { params });
}


// 新建商品/设计档案获取字段权限
export const getGoodsRole = params => {
  return axios.get(`/v1/api/goods/role`, { params });
}

// 获取单据反算的物料模块
export const materialGetDemands = params => {
  return axios.get(`/v1/api/material/purchase-demand/getDemands`, { params });
}

// 新建客户分组：
export const addCustomerGroup = params => {
  return axios.get(`/v1/api/fac/customer/addCustomerGroup`, { params });
}

// 获取所有客户分组（包含每个分组下的客户）：
export const getCustomerGroupLists = params => {
  return axios.get(`/v1/api/fac/customer/getCustomerGroupLists`, { params });
}

// 工单新建调整单需要的数据
export const getMissionIfoAndMetadata = params => {
  return axios.get(`/v1/api/fac/mission/getMissionIfoAndMetadata`, { params });
}

// 工单物料反算
export const adjustMission = params => {
  return axios.post(`/v1/api/fac/mission/adjustMission`, params);
}
// 获取工厂报表权限
export const formsPermission = params => {
  return axios.get(`/v1/api/fac/form/manage/formsPermission`, { params });
}

// 获取工厂报表权限
export const getCategoryList = params => {
  return axios.get(`/v1/api/fac/unit/settings/getCategoryList`, { params });
}
// 审核台获取单据号下拉
export const getBillDetails = params => {
  return axios.get(`/v1/api/bill-report/getBillDetails`, { params });
}

// 历史审批记录列表接口
export const billReviewLogList = params => {
    return axios.put(`/v1/api/bill-review-log/list`, params, config)
}
// 工作台获取节点负责组
export const getRespGroup = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/getRespGroup`, {params});
}

// 工作台评审节点获取评审人筛选
export const getReviewStatus = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/getReviewStatus`, {params});
}
//工作台回退节点下拉
export const getBackList = params => {
    return axios.get(`/v1/api/spl/design/mission/workspace/getBackList`, {params});
}

// 历史审批记录列表接口--商品BOM项查看跳转拿参
export const billReviewLogBomStyle = params => {
  return axios.get(`/v1/api/bill-review-log/bom-style`, {params});
}

// 生产单号下拉
export const deliveryPageQueryListOrderNo = params => {
  return axios.get(`/v1/api/delivery/material/deliveryPageQueryListOrderNo`, {params});
}

