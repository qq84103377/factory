
import axios from './config';
import md5 from 'js-md5';

let base = process.env.BASE_API;
const _env = process.env.NODE_ENV === 'production' ? 'pro' : 'dev';

let Base64 = require('js-base64').Base64;
let config = {
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    }
};
//=======================物料档案============================
// 物料档案列表接口与查询
export const archivesList = params => {
    return axios.post(`/v1/api/fac/materials/listMaterials`, params, config)
};
// 物料档案供应商下拉列表，不分页
export const supplierList = params => {
    return axios.post(`/v1/api/supplier/list`, params, config)
};
// 物料档案物料分类下拉列表
export const classification = params => {
    return axios.get(`/v1/api/fac/materials/listMaterialsKinds`, {params: params}, config)
};
// 新建物料保存
export const savedMaterials = params => {
    return axios.post(`/v1/api/fac/materials/addMaterials`, params, config)
};
// 物料详情接口
export const materialDetails = params => {
    return axios.get(`/v1/api/fac/materials/getMaterialDetail`, {params: params}, config)
};
// 物料编辑
export const editMaterials = params => {
    return axios.post(`/v1/api/fac/materials/editMaterials`, params, config)
};
// 删除物料sku供应商前置检查
export const checkDeleteSupplier = params => {
    return axios.get(`/v1/api/fac/materials/check/delete-supplier`, {params: params}, config)
};

// 获取物料sku所有供应商
export const getMaterialsSkuSupplierList = params => {
    return axios.get(`/v1/api/fac/materials/materialsSkuSupplierList/v2`, {params: params}, config)
};

// 自动生成物料名称
export const automaticCreateMaterialName = params => {
  return axios.post(`/v1/api/fac/materials/previewMaterialsName`,params, config)
}


//=======================货品管理============================
// 货品管理 --->  新建boom表数据；
export const addcommonBom = params => {
    return axios.get(`/v1/api/fac/materials/skulist`, {params: params}, config)
};
//新建/编辑bom，筛选物料表格数据
export const materialsSkulistByStyle = params => {
    return axios.post('/v1/api/fac/materials/skulistByStyle', params, config)
};

//获取物料sku所有供应商
export const materialsSkuSupplierList = params => {
    return axios.post('/v1/api/fac/materials/materialsSkuSupplierList', params, config)
};
//新增和更新物料sku供应商
export const updateMaterialsSkuSupplier = params => {
    return axios.post('/v1/api/fac/materials/updateMaterialsSkuSupplier', params, config)
};

// 设置物料需求的供应商
export const updateMaterialPurchaseDemanSupplier = params => {
    return axios.put(`/v1/api/material/purchase-demand/supplier`, params, config)
};



//=======================物料供应商============================
// 查询供应商列表分页
export const materialSupList = params => {
    return axios.post('/v1/api/supplier/page', params, config)
};
//供应商详情页
export const materialSupInfo = params => {
    return axios.get('/v1/api/supplier/view', {params: params}, config)
};
//获取已存在的供应商数据
export const getMaterialSupForm = params => {
    return axios.get('/v1/api/supplier/form', {params: params}, config)
};
//物料供应商新增提交
export const materialSupInsert = params => {
    return axios.post('/v1/api/supplier/insert', params, config)
};
//物料供应商编辑提交
export const materialSupUpdate = params => {
    return axios.post('/v1/api/supplier/update', params, config)
};
//删除前查询供应商关联的物料sku
export const beforeDeleteSup = params => {
    return axios.get('/v1/api/supplier/getRelatedMaterials', {params: params}, config)
};
//删除供应商
export const deleteMaterialSup = params => {
    return axios.get('/v1/api/supplier/delete', {params: params}, config)
};
//查询供应商名称是否重复
export const checkMaterialSupName = params => {
    return axios.get('/v1/api/supplier/queryRepeatName', {params: params}, config)
};
//查询供应商编号是否重复
export const checkMaterialSupCode = params => {
    return axios.get('/v1/api/supplier/queryRepeatCode', {params: params}, config)
};
//导入其他厂已有的供应商信息
export const importMaterialSupMes = params => {
    return axios.get('/v1/api/supplier/importSupplier', {params: params}, config)
};

//=======================物料库存============================
// 物料分类下拉列表
export const materialTypeSelect = params => {
    return axios.get(`/v1/api/changeStock/materialTypeList`, {params: params}, config)
};
// 供应商下拉列表
export const materialSupSelect = params => {
    return axios.get(`/v1/api/changeStock/supplierList`, {params: params}, config)
};
// 物料款号下拉列表
export const materialNoSelect = params => {
    return axios.get(`/v1/api/fac/materials/materialNoList`, {params: params}, config)
};
// 变动类型列表
export const changeTypeSelect = params => {
    return axios.get(`/v1/api/changeStock/inventoryTypeList`, {params: params}, config)
};
// 操作人列表
export const operatePersonnelSelect = params => {
    return axios.get(`/v1/api/changeStock/operatorList`, {params: params}, config)
};
// 操作工厂列表
export const operateFactorySelect = params => {
    return axios.get(`/v1/api/changeStock/unitList`, {params: params}, config)
};
//物料库存列表查询，搜索
export const getMatInventoryList = params => {
    return axios.post('/v1/api/fac/stock/list', params, config)
};
// 物料库存/余料库存点击生产参考余料接口
export const queryRemaindDetail = params => {
    return axios.get(`/v1/api/fac/materials/queryRemaindDetail`, {params}, config)
};
// 送料相关 - 按物料添加分页查询
export const pageFormQueryOnMaterial = params => {
    return axios.get(`/v1/api/delivery/material/pageFormQueryOnMaterial`, {params}, config)
};
// 送料相关 - 按工单添加分页查询
export const pageQueryOnMission = params => {
    return axios.get(`/v1/api/delivery/material/pageQueryOnMission`, {params}, config)
};
// 勾选物料接口
export const queryRemaindDetails = params => {
    return axios.post('/v1/api/fac/materials/queryRemaindDetails', params, config)
};
// 勾选工单接口
export const materialsqueryRemaindDetailsOnMission = params => {
    return axios.post('/v1/api/fac/materials/queryRemaindDetailsOnMission', params, config)
};
// 新建余料单接口
export const remaindAdd = params => {
    return axios.post('/v1/bill/remaind/add', params, config)
};
// 编辑余料单接口
export const remaindEdit = params => {
    return axios.post('/v1/bill/remaind/update', params, config)
};
// 余料单列表接口
export const remaindList = params => {
    return axios.post('/v1/bill/remaind/query', params, config)
};
// 余料单详情
export const remaindDetail = params => {
    return axios.get(`/v1/bill/remaind/detail`, {params}, config)
};
// 余料单撤销
export const remaindDetailUndo = params => {
    return axios.get(`/v1/bill/remaind/undo`, {params}, config)
};
// 主动占用
export const initiativeList = params => {
    return axios.get(`/v1/api/material/purchase-demand/stock-active-preuse/getSkuPreuseQuantity`, {params}, config)
};
// 单号查重
export const remaindQueryRepeat = params => {
    return axios.get(`/v1/bill/remaind/queryRepeat`, {params}, config)
};

//批量入库
export const batchInStock = params => {
    return axios.post('/v1/api/fac/stock', params, config)
};
// 批量出库
export const batchOutStock = params => {
    return axios.put(`/v1/api/fac/stock`, params, config)
};
// 物料库存单个入库、出库、调整操作
export const singleChangeStock = params => {
    return axios.put(`/v1/api/fac/stock/single`, params, config)
};
// 物料库存编辑仓位
export const singleEditStock = params => {
    return axios.put(`/v1/api/fac/stock/position/${params.id}`, params, config)
};
//库存变动记录列表查询，搜索
export const getChangeSotckList = params => {
    return axios.post('/v1/api/changeStock/page', params, config)
};
//导出excel
export const exportStockExcel = params => {
    return axios.post('/v1/api/changeStock/exportExcel', params, {
        responseType: 'blob'
    })
};
// 撤销库存记录
export const cancelChangeStock = params => {
    return axios.get(`/v1/api/changeStock/undo/${params.id}`,  params);
};


// ========= 物料采购 ========
// /v1/api/purchase/add/demand?supplierId=供应商ID
// return axios.get(`/v1/api/purchase/add/demand/v2`, {params}, config)
export const materielSelectAdd = params => {
    return axios.post(`/v1/api/purchase/add/demand/v2`, params, config)
};
// /v1/api/fac/materials/skulist?userId=xxxx&keyWord=xxxx 搜索物料sku
export const materielSku = params => {
    return axios.get(`/v1/api/fac/materials/skulist`, {params}, config)
};

// /v1/api/purchase/add 新建物料采购单
export const newMaterielPurchase = params => {
    return axios.post(`/v1/api/purchase/add`,  params , config)
};

// /v1/api/purchase/add 批量新建物料采购单
export const batchNewMaterielPurchase = params => {
    return axios.post(`/v1/api/purchase/add/batch`,  params , config)
};

// /v1/api/purchase/update 物料采购单重编辑
export const updateMaterielPurchase = params => {
    return axios.post(`/v1/api/purchase/update`,  params , config)
};
// /v1/api/delivery/material/deliveryBoardQueryListData 物料筛选的列表和送料列表下拉
export const deliveryBoardQueryListData = params => {
    return axios.get(`/v1/api/delivery/material/deliveryBoardQueryListData`, {params}, config)
};
// /v1/api/delivery/material/purchaseMissionPage  按工单查看的采购需求看板页面
export const purchaseMissionPage = params => {
    return axios.post(`/v1/api/purchase/purchaseMissionPage`, params, config)
};
// 采购需求列表-按生产单
export const purchaseDemandList = params => {
    return axios.post(`/v1/api/purchase/purchase-demand-bill-list-v3`, params, config)
};

// 采购需求列表-标为完成/手动完成
export const manualComplete = params => {
    return axios.get(`/v1/api/material/purchase-demand/manual-complete`, {params:params}, config)
};

// /v1/api/delivery/material/purchaseSupplierPage 按供应商查看的采购需求看板
export const purchaseSupplierPage = params => {
    return axios.post(`/v1/api/purchase/purchaseSupplierPage`, params, config)
};
// 采购单详情接口—-｛get｝/v1/api/delivery/material/purchaseDetail
export const purchaseDetail = params => {
    return axios.get(`/v1/api/purchase/purchaseDetail`, {
        params
    }, config)
};
// /v1/api/delivery/material/exportExcelOnMission 物料采购导出按照工单
export const exportExcelOnMission = params => {
    return axios.post(`/v1/api/purchase/exportExcelOnMission`, params, {
        responseType: 'blob'
    })
};
// /v1/api/delivery/material/exportExcelOnSupplier 物料采购导出按照供应商
export const exportExcelOnSupplier = params => {
    return axios.post(`/v1/api/purchase/exportExcelOnSupplier`, params, {
        responseType: 'blob'
    })
};
// 商品档案导出excel
export const exportExcelGoodsStyle = params => {
    return axios.post(`/v1/api/fac/goods/exportGoodsStyle`, params, {
        responseType: 'blob'
    })
};
// 设计档案导出excel
export const exportExcelSplDesignStyle = params => {
    return axios.post(`/v1/api/spl/designstyle/exportSplDesignStyle`, params, {
        responseType: 'blob'
    })
};
// /v1/api/delivery/material/purchaseList 采购单列表接口
export const purchaseList = params => {
    return axios.post(`/v1/api/purchase/purchaseList`, params, config)
};
// 采购单列表接口新接口，上面的接口其他地方有用到，不能直接替换
export const purchaseList2 = params => {
    return axios.post(`/v1/api/purchase/purchaseList-v2`, params, config)
};

// 按采购单添加查询接口 - 新建送料单-计划外送料
export const getPurchase = params => {
    return axios.get(`/v1/api/delivery/material/purchase`, {params:params}, config)
};

// 按选择此采购单查询接口 - 新建送料单-计划外送料
export const getMaterialSku = params => {
    return axios.post(`/v1/api/delivery/material/material-sku`, params, config)
};
// /v1/api/delivery/material/purchaseQueryListData   采购单列表搜索下拉数据接口
export const purchaseQueryListData = params => {
    return axios.get(`/v1/api/purchase/purchaseQueryListData`, {
        params
    }, config)
};
// /v1/api/purchase/remit 采购单付款接口
export const remit = params => {
    return axios.post(`/v1/api/purchase/remit`, params, config)
};
// /v1/api/delivery/material/exportPurchaseListExcel 导出采购单列表
export const exportPurchaseListExcel = params => {
    return axios.post(`/v1/api/purchase/exportPurchaseListExcel`, params, {
        responseType: 'blob'
    })
};
// /v1/api/material/purchase/cancel/采购单id的值?unitId=登录工厂id  采购详情撤销
export const cancel = params => {
    return axios.get(`/v1/api/material/purchase/cancel/${params.id}`, {params:params}, config)
};
// /v1/api/purchase/remit/undo?remittanceId=流水ID&userId=当前用户ID 采购详情流水号撤销
export const purchaseUndo = params => {
    return axios.get(`/v1/api/purchase/remit/undo`, {params:params}, config)
};
// /v1/api/purchase/manual-arrive-complete
//?billMaterialPurchaseId=采购单ID&facMissionId=工单ID&materialSkuId=物料skuID 手动到齐
export const manualArriveComplete = params => {
    return axios.put(`/v1/api/purchase/manual-arrive-complete?billMaterialPurchaseId=${params.billMaterialPurchaseId}&demandSourceBillId=${params.demandSourceBillId || ''}&materialSkuId=${params.materialSkuId}`,
        params
        , config)
};

//批量设置采购需求状态接口
export const batchUpdatePurchaseDemandStatus = params => {
    return axios.put(`/v1/api/material/purchase-demand/status`,params, config)
};

// 采购单模块表头配置
export const purchaseFacFieldConfigTargetView = params => {
    return axios.get(`/v1/api/fac/facFieldConfig/facFieldConfigTargetView`, {params:params}, config)
};

// 采购单模块表头配置
export const purchaseFacFieldConfigCodeAndNameList = params => {
    return axios.get(`/v1/api/fac/facFieldConfig/fieldConfigCodeAndNameList`, {params:params}, config)
};


// 新建、编辑采购单时，按需采购/计划外采购的搜索接口
export const purchaseAddDemandSearchV3 = params => {
    return axios.post(`/v1/api/purchase/add/demand/v3`, params, config)
};

// 验证是否能分配采购员接口
export const checkAllocationPurchaser = params => {
    return axios.post(`/v1/api/purchase/checkAllocationPurchaser`, params, config)
};

// 分配采购员接口
export const allocationPurchaser = params => {
    return axios.post(`/v1/api/purchase/allocationPurchaser`, params, config)
};



//=======================配置中心============================
//==============属性库=============
// 属性库列表
export const attributeList = params => {
    return axios.get(`/v1/api/commonAttrsStore/commonAttrstoreList`, {params: params}, config)
};
// 更新属性库属性必填项
export const updateCommonAttrstoreMandatory = params => {
    return axios.get(`/v1/api/commonAttrsStore/updateCommonAttrstoreMandatory`, {params: params}, config)
};
// 某属性的选项列表
export const commonAttrstoreOptionsList = params => {
    return axios.get(`/v1/api/commonAttrsStore/commonAttrstoreOptionsList`, {params: params}, config)
};
// 某属性的新增选项
export const addCommonAttrstoreOptions = params => {
    return axios.post('/v1/api/commonAttrsStore/addCommonAttrstoreOptions', params, config)
};
// 删除属性选项
export const deleteCommonAttrstoreOptions = params => {
    return axios.get('/v1/api/commonAttrsStore/deleteCommonAttrstoreOptions', {params: params}, config)
};
// 修改属性选项名
export const updateCommonAttrstoreOptions = params => {
    return axios.post('/v1/api/commonAttrsStore/updateCommonAttrstoreOptions', params, config)
};
//==============资料档案配置=============
// 物料分类列表
export const listMaterialsKinds = params => {
    return axios.get('/v1/api/fac/materials/listMaterialsKinds', {params: params}, config)
};
// 物料分类-新增/更新物料分类
export const addOrUpdateMaterialsKinds = params => {
    return axios.post(`/v1/api/fac/materials/addOrUpdateMaterialsKinds`, params, config)
};
// 删除物料分类和属性关联
export const deleteCommonMaterialsKindsAttrs = params => {
    return axios.get('/v1/api/fac/materials/deleteCommonMaterialsKindsAttrs', {params: params}, config)
};
// 新增物料分类和属性的关联关系
export const addCommonMaterialsKindsAttrs = params => {
    return axios.post(`/v1/api/fac/materials/addCommonMaterialsKindsAttrs`, params, config)
};
// 更新物料分类和属性关联关系的排序
export const updateCommonMaterialsKindsAttrsSort = params => {
    return axios.post(`/v1/api/fac/materials/updateCommonMaterialsKindsAttrsSort`, params, config)
};

// ============== 送料单接口 =====================
// 待送料看板导出 /v1/api/delivery/material/exportWaitDelivery
export const exportWaitDelivery = params => {
    return axios.post(`/v1/api/delivery/material/exportWaitDelivery`, params, {
        responseType: 'blob'
    })
};

// 获取新建送料单时的送料仓库和送料员下拉列表
export const getStoreAndDeliveriers = params => {
    return axios.get('/v1/api/delivery/material/form', {params: params}, config)
};

// /v1/api/delivery/material/formQueryOnMaterial 物料号/物料名称/供应商/供应商款号搜索添加
export const formQueryOnMaterial = params => {
    return axios.get(`/v1/api/delivery/material/formQueryOnMaterial`, {
        params: params
    }, config)
};

// /v1/api/delivery/material/formListAddOnMaterial 按物料SKU添加
export const formListAddOnMaterial = params => {
    return axios.get(`/v1/api/delivery/material/formListAddOnMaterial`, {
        params: params
    }, config)
};
// /v1/api/delivery/materialformQueryOnMission 在新建送料页面输入成衣款号/工单号搜索添加接口(
export const formQueryOnMission = params => {
    return axios.get(`/v1/api/delivery/material/formQueryOnMission`, {
        params: params
    }, config)
};
// /v1/api/delivery/formListAddOnMission 按工单SKU添加
export const formListAddOnMission = params => {
    return axios.get(`/v1/api/delivery/material/formListAddOnMission`, {
        params: params
    }, config)
};

// /v1/api/delivery/material 新建送料
export const newPayOffMaterial = params => {
    return axios.post(`/v1/api/delivery/material/create`, params, config)
};
//编辑
export const updatePayOffMaterial = params => {
    return axios.post(`/v1/api/delivery/material/update `, params, config)
};
// v1/api/delivery/material/deliveryPageQueryListData   待送料列表下拉列表数据
export const deliveryPageQueryListData = params => {
    return axios.get(`v1/api/delivery/material/deliveryPageQueryListData`, {
        params: params
    }, config)
};
// v1/api/delivery/material/page 待送料列表
export const payOffPage = params => {
    return axios.post(`/v1/api/delivery/material/page`, params, config)
};
// v1/api/delivery/material/exportDeliveryListExcel 送料单列表导出
export const exportDeliveryListExcel = params => {
    return axios.post(`v1/api/delivery/material/exportDeliveryListExcel`, params, {
        responseType: 'blob'
    })
};
//详情 v1/api/delivery/material/detail/'id'
export const payOffDetail = params => {
    return axios.get(`v1/api/delivery/material/detail/${params.id}`, {
        params: params
    }, config)
};
// /v1/api/delivery/material/undo/送料单ID 撤销
export const undopayOff = params => {
    return axios.get(`/v1/api/delivery/material/undo/${params.id}`, {
        params: params
    }, config)
};

// 新建送料单-按物料添加分页查询
export const deliveryPageFormQueryOnMaterial = params => {
    return axios.get(`/v1/api/delivery/material/pageFormQueryOnMaterial`, {
        params: params
    }, config)
};

// 新建送料单-按工单添加分页查询
export const deliveryPageQueryOnMission = params => {
    return axios.get(`/v1/api/delivery/material/pageQueryOnMission`, {
        params: params
    }, config)
};

// 新建送料单-按采购单添加分页查询
export const deliveryPagePurchase = params => {
    return axios.get(`/v1/api/delivery/material/pagePurchase`, {
        params: params
    }, config)
};
// 新建送料单-按通知单添加分页查询
export const deliveryListBillNotify = params => {
    return axios.get(`/v1/api/delivery/material/listBillNotify`, {
        params: params
    }, config)
};


// 新建送料单-查询送料需求接口（按物料、按采购单）
export const queryDeliveryDemandForNewBillMaterial = params => {
    return axios.post(`/v1/api/delivery/material/queryDeliveryDemandForNewBillMaterial`,params, config)
};

// 新建送料单-查询送料需求接口（按通知单）
export const queryDeliveryDemandForNewBillNotify = params => {
    return axios.post(`/v1/api/delivery/material/queryDeliveryDemandForNewBillNotify`,params, config)
};

// 新建送料单-查询送料需求接口（按工单）
export const queryDeliveryDemandForNewBill = params => {
    return axios.post(`/v1/api/delivery/material/queryDeliveryDemandForNewBill`,params, config)
};





// ============== 到料单接口 =====================
// 到料单列表
export const arriveList = params => {
    return axios.post(`/v1/api/arrive/arriveList`, params, config)
};
// 到料单列表
export const createReturnOnArrive = params => {
    return axios.post(`v1/api/arrive/createReturnOnArrive`, params, config)
};

// 导出到料单
export const arriveExcel = params => {
    return axios.post(`/v1/api/arrive/arriveExcel`, params, {
        responseType: 'blob'
    })
};

// 导出样料到料单
export const sampleMaterialExcel = params => {
    return axios.post(`/v1/api/arrive/arriveExcel/sample`, params, {
        responseType: 'blob'
    })
};

// 新建
export const addArrive = params => {
    return axios.post(`/v1/api/arrive/add`, params, config)
};

// 编辑
export const updateArrive = params => {
    return axios.post(`/v1/api/arrive/update`, params, config)
};

// 到料单详情 /v1/api/arrive/detail/到料单ID
export const detail = params => {
    return axios.get(`/v1/api/arrive/detail/${params.id}`, {params}, config)
}
// /v1/api/arrive/cs/material-sku/到料单ID
// 验布和缩布的弹窗数据
export const materialSku = params => {
    return axios.get(`/v1/api/arrive/cs/material-sku/${params.id}`, params, config)
}
// 验布
export const check = params => {
    return axios.put(`/v1/api/arrive/check`, params, config)
};
// 验布
export const shrunk = params => {
    return axios.put(`/v1/api/arrive/shrunk`, params, config)
};
// 撤销验布
export const undoCheck = params => {
    return axios.get(`/v1/api/arrive/undo-check`, {params: params}, config)
};
// 撤销缩布
export const undoShrunk = params => {
    return axios.get(`/v1/api/arrive/undo-shrunk`, {params: params}, config)
};
// 撤销到料单详情
export const undo = params => {
    return axios.get(`/v1/api/arrive/undo/${params.id}/`, {
        params: params
    }, config)
};
// 退料和倒料显示隐藏
export const getFinanceConfigByUserId = params => {
    return axios.post(`/v1/api/needPayNeedReceiveOrderApi/getFinanceConfigByUserId`, params, config)
};
// ========== 退料 ============
export const pageReturn = params => {
    return axios.post(`/v1/api/return/page`, params, config)
};
// 退料单号模糊查询接口
export const orderLists = params => {
    return axios.post(`/v1/api/return`, params, config)
};
// /v1/api/return/returnExcel
export const returnExcel = params => {
    return axios.post(`/v1/api/return/returnExcel`, params, {
        responseType: 'blob'
    })
};
// /v1/api/return/detail/退料单的id
export const returnDetail = params => {
    return axios.get(`/v1/api/return/detail/${params.id}`, {
        params: params
    }, config)
};

//  /v1/api/return/collect 退料单新建收退款
export const returnCollect = params => {
    return axios.post(`/v1/api/return/collect`, params, config)
};

// /v1/api/return/undo/退料单ID?userId=当前用户ID
export const returnUndo = params => {
    return axios.get(`/v1/api/return/undo/${params.id}/`, {
        params: params
    }, config)
};
// /v1/api/return/add
export const addReturn = params => {
    return axios.post(`/v1/api/return/add`, params, config)
};

// /v1/api/return/update
export const updateReturn = params => {
    return axios.post(`/v1/api/return/update`, params, config)
};
// ========== 回料单 ============
// 回料单列表
export const refundList = params => {
    return axios.post(`/v1/api/refund/list`, params, config)
};
// 新建回料单
export const feedBackAdd = params => {
    return axios.post(`/v1/api/refund/add`, params, config)
};
// 回料单导出
export const refundExcel = params => {
    return axios.post(`/v1/api/refund/refundExcel`, params, {
        responseType: 'blob'
    })
};
// 重编辑回料单
export const refundUpdate = params => {
    return axios.post(`/v1/api/refund/update`, params, config)
};
// 新建回料单--选择工单的物料数据
export const missionMaterials = params => {
    return axios.get(`/v1/api/fac/mission/missionMaterials`, {params:params}, config)
};
// 回料单详情
export const refundDetail = params => {
    return axios.get(`/v1/api/refund/detail/${params.id}`, params, config)
};
// 回料单详情撤销
export const refundUndo = params => {
    return axios.get(`/v1/api/refund/undo/${params.id}?userId=${params.userId}`, params, config)
};
//获取配置了自由送料型节点的工单接口
export const missionIdAndNameList = params => {
    return axios.get(`/v1/api/fac/mission/missionIdAndNameList`, {params:params}, config);
}
//回料单号下拉列表
export const billIdAndNameList = params => {
    return axios.get(`/v1/api/refund/billIdAndNameList`, {params:params}, config);
}
// ========== 回料单end ============



// 按供应商名称模糊搜索供应商接口
export const searchSupplier = params => {
    return axios.put(`/v1/api/material/supplier`, params, config)
};
// 物料筛选模糊搜索接口
export const searchMaterialScreen = params => {
    return axios.get(`/v1/api/delivery/material/materialScreen`, {params:params}, config)
};

// 物料款号筛选模糊搜索接口
export const searchMaterialStyleNoScreen = params => {
    return axios.get(`/v1/api/delivery/material/materialStyleNoScreen`, {params:params}, config)
};

// ========== 采购配置 ============
// 采购配置查询接口
export const purchaseConfig = params => {
    return axios.get(`/v1/api/material/purchase/config/${params.id}`, config)
};
// 采购配置修改
export const configUpdate = params => {
    return axios.post(`/v1/api/material/purchase/config/update`, params, config)
};


//修改采购计划值
export const updatePurchaseDemand = params => {
    return axios.get(`/v1/api/purchase/updatePurchaseDemand`, {params:params}, config);
}

// ========== MRP字段配置 ============
//获取字段配置列表
export const getPrucahseFields = params => {
    return axios.get(`/v1/api/fac/facFieldConfig/prucahseFields`, {params:params}, config)
};
//提交字段配置列表
export const updateUnitFacField = params => {
    return axios.post(`/v1/api/fac/facFieldConfig/updateUnitFacField`, params, config)
};
//获取MRP字段配置数组
export const MPRFieldConfigList = params => {
    return axios.get(`/v1/api/fac/facFieldConfig/MPRFieldConfigList`, {params:params}, config)
};

// 采购单号、退料单号、到料单号、送料单号、回料单号 列表

export const getMaterialVariousOrder = params => {
    return axios.get(`/v1/api/delivery/material/orderNoScreen`, {params:params}, config)
};


//采购需求看板-按物料查看
export const purchaseMaterialsPage = params => {
    return axios.post(`/v1/api/purchase/purchaseMaterialsPage-v2`, params, config)
};

// 获取订单的所有商品接口（点击换料的时候调用）
export const getGoodsForChangeMaterial = params => {
    return axios.get(`/v1/api/facPrdOrder/goods-for-change-material`, {params:params}, config)
};

// 获取订单指定商品的bom
export const getFacPrdOrderGoodsBom = params => {
    return axios.get(`/v1/api/facPrdOrder/goods-bom?`, {params:params}, config)
};
