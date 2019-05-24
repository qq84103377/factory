const NotFound = resolve => require(['../views/404.vue'], resolve);
const Home = resolve => require(['../views/Home.vue'], resolve);
const Login = resolve => require(['@/components/loginRegister/login.vue'], resolve);
const Register = resolve => require(['@/components/loginRegister/register.vue'], resolve);
const ResetPassword = resolve => require(['@/components/loginRegister/resetPassword.vue'], resolve);
const CreatedFac = resolve => require(['@/components/loginRegister/createdFac.vue'], resolve);
const AddWorker = resolve => require(['../components/worker/Addworker.vue'], resolve);
const Index = resolve => require(['../components/loginRegister/login.vue'], resolve);
const UpdatePic = resolve => require(['../components/Common/UpdatePic.vue'], resolve);
const UpdatePwd = resolve => require(['../components/loginRegister/UpdatePwd.vue'], resolve);
// const UpdateLoadPic = () => import('../components/UpdateLoadPic.vue');
const mydata2 = resolve => require(['../components/loginRegister/MyData2.vue'], resolve);
const WorkerManager = resolve => require(['../components/worker/WorkerManager.vue'], resolve);
// const Goods = () => import('../components/Goods.vue');
// 配置中心
const archives = resolve => require(['../components/configuration/archives'], resolve);//属性库
const attribute = resolve => require(['../components/configuration/attribute'], resolve);//物料档案配置
// ====== 工厂设置 =======11
const publicSet = resolve => require(['../components/publicManage/publicSet.vue'], resolve);
const AddFactory = resolve => require(['../components/factoryManage/AddFactory.vue'], resolve);
const setFctory = resolve => require(['../components/factoryManage/setFactory.vue'], resolve);
const factoryMangement = resolve => require(['../components/factoryManage/factoryMangement.vue'], resolve);
const EditPublicSet = resolve => require(['../components/publicManage/EditPublicSet.vue'], resolve);

// 仓库管理
const repertory = resolve => require(['../components/repertoryManage/storeManage'], resolve);
const ownStore = resolve => require(['../components/repertoryManage/index'], resolve);
const factoryStore = resolve => require(['../components/repertoryManage/factoryStore'], resolve);

// 生产准备中心
const prodCenter = resolve => require(['../components/prodCenter'], resolve);

//========= 商品档案 =========
const BaseGoodsInfo = resolve => require(['../components/goods/BaseGoodsInfo.vue'], resolve);
const goodsMangement = resolve => require(['../components/goods/GoodsMangement.vue'], resolve);
const addGoodsStyle = resolve => require(['../components/goods/AddGoodsStyle.vue'], resolve);
const goodsClothesDetail = resolve => require(['@/components/goods/clothesFile/detail.vue'], resolve);
const goodsClothesDetailArt = resolve => require(['@/components/goods/clothesFile/art.vue'], resolve);
const goodsClothesDetailBom = resolve => require(['@/components/goods/clothesFile/bom.vue'], resolve);
const goodsSystemImport = resolve => require(['../components/goods/systemImport.vue'], resolve);

//====supplier供应商begin====
const Supplier = resolve => require(['../components/supplier/Supplier.vue'], resolve);
const AddSupplier = resolve => require(['../components/supplier/AddSupplier.vue'], resolve);
const SupplierInfo = resolve => require(['../components/supplier/SupplierInfo.vue'], resolve);
//====供应商end====

//====customer客户=====
const Customer = resolve => require(['../components/customer/Customer.vue'], resolve);
const AddCustomer = resolve => require(['../components/customer/AddCustomer.vue'], resolve);
const CustomerInfo = resolve => require(['../components/customer/CustomerInfo.vue'], resolve);
//====customer客户=====

// ===worker工位===
const WorkerDetailed = resolve => require(['../components/worker/WorkerDetailed.vue'], resolve);
const UpdateWorker = resolve => require(['../components/worker/UpdateWorker.vue'], resolve);
// ===工位===

//===order生产工单begin==
//生产工单管理首页
const WorkOrders = resolve => require(['../components/order/WorkOrders/index.vue'], resolve);
//新建工单
const CreateOrder = resolve => require(['../components/order/CreateOrder.vue'], resolve);
//工单详情
const OrderDetailed = resolve => require(['../components/order/orderDetail/index.vue'], resolve);
//全部上报单据
const allReportBill = resolve => require(['../components/order/allReportBill/index.vue'], resolve);
const allReportBillDetail = resolve => require(['../components/order/allReportBill/billDetail.vue'], resolve);

const CuttingReport = resolve => require(['../components/order/actual-cutting-ligation-report.vue'], resolve);
const LigationList = resolve => require(['../components/order/actual-cutting-ligation-list.vue'], resolve);
// const OrderNodeDetailed = resolve => require(['../components/order/orderDetail/nodeDetail.vue'], resolve);
// const OrderNodeList = resolve => require(['../components/order/orderDetail/nodeList.vue'], resolve);

// 生产订单orderProduction
const orderProduction = resolve => require(['../components/orderProduction/index.vue'], resolve);
const orderProductionNew = resolve => require(['../components/orderProduction/order-production-new.vue'], resolve);
const orderProductioDetail = resolve => require(['../components/orderProduction/order-production-detailNew.vue'], resolve);
const adjustOrder = resolve => require(['../components/orderProduction/adjustOrder/index'], resolve);
const orderProductionConfig = resolve => require(['../components/orderProduction/order-production-config.vue'], resolve);

//编辑工单
const EditOrder = resolve => require(['../components/order/EditOrder.vue'], resolve);
// 工单BOM
const OrderBom = resolve => require(['../components/order/orderBom/index.vue'], resolve);

// 质检型节点上报
const Reporting = resolve => require(['../components/order/quality-checking-report/reporting.vue'], resolve);
//===生产工单end===

//===编辑工厂信息begin===
const EditFacInfo = resolve => require(['../components/factoryManage/EditFacInfo.vue'], resolve);
//===编辑工厂信息end===

// 工序模板
const workProcedure = resolve =>
  require(['../components/templateManage/workProcedure.vue'], resolve);
const Procedure = resolve => require(['../components/templateManage/Procedure.vue'], resolve);
const nodeManage = resolve => require(['../components/templateManage/nodeManage.vue'], resolve);
const createProcedure = resolve =>
  require(['../components/templateManage/createProcedure.vue'], resolve);
const procedureInfo = resolve =>
  require(['../components/templateManage/procedureInfo.vue'], resolve);
const EditTemplateProcedure = resolve =>
  require(['../components/templateManage/EditTemplateProcedure.vue'], resolve);

// 工作台
const Service = resolve => require(['../components/service'], resolve);
const serviceNodePlan = resolve => require(['../components/service/nodePlan'], resolve);

//报表
const ReportManage = resolve => require(['../components/reportForms/ReportManage.vue'], resolve);//本厂报表入口页
const MyReport = resolve => require(['../components/reportForms/myReport.vue'], resolve);
const FormsStatistics = resolve => require(['../components/reportForms/forms-statistics.vue'], resolve);    //工厂进度报表
const StaffSalaryReport = resolve => require(['../components/reportForms/staffSalaryReport.vue'], resolve); //员工计件工资报表
const GoodProcessReport = resolve => require(['../components/reportForms/goodsProgressReport'], resolve);   //货品生产进度报表
const stationNodeProcessReport = resolve => require(['../components/reportForms/stationNodeProcessReport'], resolve)    //工位-节点进度报表
const factoryProcesSettlement = resolve => require(['../components/reportForms/factoryProcesSettlement'], resolve)    //外工厂加工结算
const factoryProcesDetail = resolve => require(['../components/reportForms/factoryProcesDetail'], resolve)    //外工厂加工结算详情
const lineReport = resolve => require(['../views/lineReport.vue'], resolve);    //生产动线报表
const typingAchievementsReport = resolve => require(['../components/reportForms/typingAchievementsReport.vue'], resolve);    //版师绩效提成表
/**
 * @description 列表切换 printList，模板定义 printTemplate,一个父路由 index，printShow 预览模板
 */
const printIndex = resolve => require(['../components/print/index.vue'], resolve);
const printList = resolve => require(['../components/print/printList.vue'], resolve);
// const addPrintTemplate = resolve =>
//     require(['../components/print/addPrintTemplate.vue'], resolve);
const printShow = resolve => require(['../components/print/printShow.vue'], resolve);
const editPrintTemplate = resolve =>
  require(['../components/print/editPrintTemplate.vue'], resolve);

// 库存管理
const Stock = resolve => require(['../components/stock'], resolve);
const RealStock = resolve => require(['../components/stock/real-stock'], resolve);
const InStorage = resolve => require(['../components/stock/in-storage'], resolve);
const StockRecord = resolve => require(['../components/stock/stock-record'], resolve);
const StockBill = resolve => require(['../components/stock/stockBill'], resolve);
const StockNotice = resolve => require(['../components/stock/stockNotice'], resolve);
const StockDetail = resolve => require(['../components/stock/stockDetail'], resolve);
const StockDetailNew = resolve => require(['../components/stock/stockDetailNew'], resolve);

const showPDF = resolve => require(['../components/pdf/showPDF'], resolve);

//本厂设置
const roleAuthorization = resolve => require(['../components/selfFactory/roleAuthorization'], resolve);
const editRole = resolve => require(['../components/selfFactory/roleAuthorization/roleInfo'], resolve);
const selfFacTemplate = resolve => require(['../components/selfFactory/printTemplate'], resolve);
const selfFacStationGroup = resolve => require(['../components/selfFactory/station/stationGroup'], resolve);
const selfFacSetting = resolve => require(['../components/selfFactory/selfFacSetting'], resolve);
// 规格属性库
const selfFacSettingIndex = resolve => require(['../components/selfFactory/index'], resolve);

const materialWare = resolve => require(['../components/selfFactory/materialWare'],resolve) // 物料属性库

const selfField = resolve => require(['../components/selfFactory/selfField'], resolve);
const customField = resolve => require(['../components/selfFactory/customField'], resolve);
const sizeConfig = resolve => require(['../components/selfFactory/sizeConfig'], resolve);
const selfFacInferiorTag = resolve => require(['../components/selfFactory/inferiorTag'], resolve)
const selfFacStationManagement = resolve => require(['../components/selfFactory/station/stationManagement'], resolve);
const selfFacStationManager = resolve => require(['../components/selfFactory/station/stationManager'], resolve);
const selfFacStationDetail = resolve => require(['../components/selfFactory/station/stationDetail'], resolve);
const selfConfigApi = resolve => require(['../components/selfFactory/configApi'], resolve); // api配置对接

const goodsBarCodeManagement = resolve => require(['../components/goods/goodsBarCodeManagement'], resolve) //条码管理

//全局次品标签
const publicInferior = resolve => require(['../components/publicManage/publicInferior'], resolve) //条码管理

//财务账户
const financialAccount = resolve => require(['../components/financialAccount/index'], resolve)

//员工管理
const workerMangement = resolve => require(['../components/workerMangement/index'], resolve)

//当前工单的动态节点的列表
const allNodeMessage = resolve => require(['../components/order/orderDetail/allNodeMessage.vue'], resolve);

// 新建节点页
const newNode = resolve => require(['../components/templateManage/newNode.vue'], resolve);
//物料分类
const materielClassify = resolve => require(['../components/material/materielClassify'], resolve)

//物料档案
const materialArchives = resolve => require(['../components/material/materialArchives'], resolve)
const addMaterial = resolve => require(['../components/material/materialArchives/addMaterial'], resolve)
const materialInfo = resolve => require(['../components/material/materialArchives/materialInfo'], resolve)

//物料供应商
const materialSupplier = resolve => require(['../components/material/materialSupplier'], resolve)
const materialSupInfo = resolve => require(['../components/material/materialSupplier/info'], resolve)

//物料库存
const materialInventory = resolve => require(['../components/material/materialInventory'], resolve)
const matInventory = resolve => require(['../components/material/materialInventory/mat-inventory'], resolve)
const matBatch = resolve => require(['../components/material/materialInventory/mat-batch'], resolve)
const matRecord = resolve => require(['../components/material/materialInventory/mat-record'], resolve)
const matRemaind = resolve => require(['../components/material/materialInventory/mat-remaind'], resolve)

const nodeReportRecord = resolve => require(['../components/order/reportRecord'], resolve)

const missionWym = resolve => require(['../components/order/orderDetail/missionWym'], resolve)
const missionWymStatus = resolve => require(['../components/order/orderDetail/missionWymStatus'], resolve)
const cancelOrder = resolve => require(['../components/order/orderDetail/cancel-order'], resolve)

//物料采购
// const marterielPurchase = resolve => require(['../components/material/materielPurchase/index-purchase.vue'], resolve);
const purchaseNeed = resolve => require(['../components/material/materielPurchase/need-purchase/purchase-need.vue'], resolve);
const purchaseList = resolve => require(['../components/material/materielPurchase/list-purchase/purchaseIndex.vue'], resolve);
const samplePurchaseList = resolve => require(['../components/material/materielPurchase/list-purchase/samplePurchaseIndex.vue'], resolve);
const newPurchase = resolve => require(['../components/material/materielPurchase/new-purchase/new-purchase.vue'], resolve);
const detailPurchase = resolve => require(['../components/material/materielPurchase/detail-purchase/detail-purchase.vue'], resolve);
// 物料采购配置
const purchaseAllocation = resolve => require(['../components/material/purchaseAllocation/purchaseAllocation.vue'], resolve);
// 到料单
const materialList = resolve => require(['../components/material/materialList/material-list.vue'], resolve);
const materialAdd = resolve => require(['../components/material/materialList/material-add.vue'], resolve);
const materialDetail = resolve => require(['../components/material/materialList/material-detail.vue'], resolve);
// 样料到料单
const sampleMaterialList = resolve => require(['../components/material/materialList/sample-material-list.vue'], resolve);

//送料单
const marterielPayoff = resolve => require(['../components/material/materielPay-off/index-pay-off.vue'], resolve);
const marterielPayoffList = resolve => require(['../components/material/materielPay-off/list-pay-off/payOffListIndex.vue'], resolve);
const marterielNotifyPayoffList = resolve => require(['../components/material/materielPay-off/list-pay-off/notifyPayOffListIndex.vue'], resolve);
const newPayoffOrder = resolve => require(['../components/material/materielPay-off/new-pay-off/new-pay-off.vue'], resolve);
const marterielPayoffWait = resolve => require(['../components/material/materielPay-off/wait-pay-off/wait-pay-off.vue'], resolve);
// 退料单
const returnMarteriel = resolve => require(['../components/material/materielReturn/index-return.vue'], resolve);
const newReturnMarteriel = resolve => require(['../components/material/materielReturn/new-return.vue'], resolve);
const ReturnDetail = resolve => require(['../components/material/materielReturn/return-detail.vue'], resolve);
//余料入库单
const marterielFeedback = resolve => require(['../components/material/materielFeed-back/index-feed-back.vue'], resolve);
const newFeedback = resolve => require(['../components/material/materielFeed-back/new-feed-back/new-feed-back.vue'], resolve);
const feedbackDetail = resolve => require(['../components/material/materielFeed-back/feed-back-detail.vue'], resolve);
//MRP字段配置
const marterielConfig = resolve => require(['../components/material/materialConfig'], resolve);

//加工厂商档案
const outsideFactory = resolve => require(['../components/outsideFactory'], resolve)
const outsideFactoryInfo = resolve => require(['../components/outsideFactory/info'], resolve)

const payoffDetail = resolve => require(['../components/material/materielPay-off/payoff-detail.vue'], resolve)

// 样版中心
const sampleMission = resolve => require(['@/components/sampleCentre/mission/index.vue'], resolve)
const sampleCancelMission = resolve => require(['@/components/sampleCentre/cancel-mission/index.vue'], resolve)
const sampleCreate = resolve => require(['@/components/sampleCentre/create/index.vue'], resolve)
const sampleEdit = resolve => require(['@/components/sampleCentre/edit/index.vue'], resolve)
const sampleDetail = resolve => require(['@/components/sampleCentre/detail/index.vue'], resolve)
const sampleDynamic = resolve => require(['@/components/sampleCentre/dynamic/index.vue'], resolve)
// 设计节点与模板
const design = resolve => require(['@/components/sampleCentre/design/index.vue'], resolve)
const designNode = resolve => require(['@/components/sampleCentre/design/node-design.vue'], resolve)
const designNodeCreate = resolve => require(['@/components/sampleCentre/design/node-design-create.vue'], resolve)
const designTemplate = resolve => require(['@/components/sampleCentre/design/template-design.vue'], resolve)
const designTemplateCreate = resolve => require(['@/components/sampleCentre/design/template-design-create.vue'], resolve)
const designTemplateEdit = resolve => require(['@/components/sampleCentre/design/template-design-edit.vue'], resolve)
const designTemplateDetail = resolve => require(['@/components/sampleCentre/design/template-design-detail.vue'], resolve)
//设计工作台
const designWorkbench = resolve => require(['@/components/designWorkbench/index.vue'], resolve)

//审核台
const documentReview = resolve => require(['@/components/documentReview/index.vue'], resolve)
// 历史审批记录
const approvalRecord = resolve => require(['@/components/documentReview/appendagePage/approvalRecord.vue'], resolve)

//次品管理
const inferiorMamage = resolve => require(['@/components/inferiorMamage/index.vue'], resolve)
const inferiorMamageDetail = resolve => require(['@/components/inferiorMamage/detail.vue'], resolve)
const allInferiorBill = resolve => require(['@/components/inferiorMamage/allInferiorBill.vue'], resolve)

//设计档案
const designFile = resolve => require(['@/components/designFile/index.vue'], resolve)

const designFileInfo = resolve => require(['@/components/designFile/designFileInfo/index.vue'], resolve)
const createDesignFile = resolve => require(['@/components/designFile/designFileInfo/create-design-file.vue'], resolve)
const designFileDetail = resolve => require(['@/components/designFile/detail.vue'], resolve)
const designFileInfoDetail = resolve => require(['@/components/designFile/designFileInfo/designFileDetail.vue'], resolve)
// 设计档案 - 工艺信息
const technicsInfo = resolve => require(['@/components/designFile/technicsInfo'], resolve)
const bomList = resolve => require(['@/components/designFile/bom'], resolve)
const clothesFile = resolve => require(['@/components/designFile/clothesFile'], resolve)
const procedureTemplate = resolve => require(['@/components/designFile/procedure'], resolve)
const costAccounting = resolve => require(['@/components/designFile/costAccounting'], resolve)
const clothesDetail = resolve => require(['@/components/designFile/clothesFile/detail'], resolve)
const clothes = resolve => require(['@/components/designFile/clothesFile/clothes'], resolve)
const clothesArt = resolve => require(['@/components/designFile/clothesFile/art'], resolve)
const clothesBOM = resolve => require(['@/components/designFile/clothesFile/bom'], resolve)
const clothesCost = resolve => require(['@/components/designFile/clothesFile/cost'], resolve)
const costDetail = resolve => require(['@/components/designFile/costAccounting/detail'], resolve)
const patternMakingFile = resolve => require(['@/components/designFile/patternMakingFile'], resolve)

// 自动编码设置 15+30+16+5
const autoNumber = resolve => require(['@/components/autoNumber/index'], resolve)
// 商品企划模块
// 采购规划
const procurementPlan = resolve => require(['@/components/goodsPlan/procurementPlan'], resolve)
const procurementPlanList = resolve => require(['@/components/goodsPlan/procurementPlan/list'], resolve)
const procurementPlanTemplate = resolve => require(['@/components/goodsPlan/procurementPlan/template'], resolve)
const procurementPlanEditTemplate = resolve => require(['@/components/goodsPlan/procurementPlan/template/edit'], resolve)
const procurementPlanEdit = resolve => require(['@/components/goodsPlan/procurementPlan/list/edit'], resolve)
const procurementPlanDetail = resolve => require(['@/components/goodsPlan/procurementPlan/list/detail'], resolve)
const procurementPlanLevelDetail = resolve => require(['@/components/goodsPlan/procurementPlan/list/levelDetail'], resolve)
const procurementPlanLevelList = resolve => require(['@/components/goodsPlan/procurementPlan/list/levelList'], resolve)
//销售计划
const salesPlan = resolve => require(['@/components/goodsPlan/salesPlan'], resolve)
const salesPlanEdit = resolve => require(['@/components/goodsPlan/salesPlan/edit'], resolve)
const salesPlanDetail = resolve => require(['@/components/goodsPlan/salesPlan/detail'], resolve)
const salesPlanAddStore = resolve => require(['@/components/goodsPlan/salesPlan/addStore'], resolve)
// 店铺档案
const storeFiles = resolve => require(['@/components/storeFiles/index.vue'], resolve)
const storeFilesDetail = resolve => require(['@/components/storeFiles/detail.vue'], resolve)

//收费限制
const chargeLimit = resolve => require(['@/components/chargeLimit/index.vue'], resolve)


/*
* 指明该路由属于哪个模块(必填)
* 1-首页；2—全局设置; 3-生产准备中心
meta: {
    module: 1
}


*/
let home = [
  {
    path: '/index',
    component: Index,
    name: '重定向',
    hidden: true
  },
  {
    path: '/lineReport',
    component: lineReport,
    name: '生产动线报表',
    hidden: true
  },
  {
    path: '/login',
    component: Login,
    name: '登录'
  },
  {
    path: '/register',
    component: Register,
    name: '注册'
  },
  {
    path: '/resetPassword',
    component: ResetPassword,
    name: '忘记密码'
  },
  {
    path: '/createdFac',
    component: CreatedFac,
    name: '创建工厂'
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    hidden: true
  },
  {
    path: '/printShow',
    component: printShow,
    name: '跳转预览',
    key: 7
  },
  {
    path: '/showPDF',
    component: showPDF,
    name: '预览PDF',
    key: 7
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: '/repertory',
        component: repertory,
        name: '仓库管理',
        meta: {
          module: 2
        },
        children: [
          {
            path: '/home/repertory',
            component: ownStore,
            name: '自用仓库',
            meta: {
              belong: 'home/repertory',
              module: 2
            }
          },
          {
            path: '/home/repertory/factoryStore',
            component: factoryStore,
            name: '加工厂仓库',
            meta: {
              belong: 'home/repertory',
              module: 2
            }
          }
        ]
      },
      {
        path: 'prodCenter',
        component: prodCenter,
        name: '生产准备中心',
        meta: {
          belong: 'home/prodCenter',
          module: 2
        }
      },
      {
        path: '/my-data2',
        component: mydata2,
        name: '老板资料',
        meta: {
          module: 1
        }
      },
      {
        path: '/addworker',
        component: AddWorker,
        name: '添加员工',
        key: 1,
        meta: {
          belong: 'workermanager',
          module: 2
        }
      },
      {
        path: '/workermanager',
        component: WorkerManager,
        name: '工位管理',
        key: 6,
        meta: {
          belong: 'workermanager',
          module: 2
        }
      },
      {
        path: '/purchaseAllocation',
        component: purchaseAllocation,
        name: '物料采购配置',
        key: 6,
        meta: {
          belong: 'purchaseAllocation',
          module: 2
        }
      },
      {
        path: '/archives',
        component: archives,
        name: '属性库',
        key: 6,
        meta: {
          belong: 'archives',
          module: 2
        }
      },
      {
        path: '/attribute',
        component: attribute,
        name: '物料档案配置',
        key: 6,
        meta: {
          belong: 'attribute',
          module: 2
        }
      },
      {
        path: '/publicInferior',
        // component: publicInferior,
        component: selfFacInferiorTag,
        name: '标签管理',
        meta: {
          belong: 'publicInferior',
          module: 2
        }
      },
      {
        path: '/updatepwd',
        component: UpdatePwd,
        name: '修改密码',
        key: 8
      },
      {
        path: '/updatepic',
        component: UpdatePic,
        name: '修改头像',
        key: 9
      },
      {
        path: '/addfactory',
        component: AddFactory,
        name: '添加工厂',
        key: 9,
        meta: {
          belong: 'factoryMangement',
          module: 2
        }
      },
      // {
      //     path: '/publicSet',
      //     component: publicSet,
      //     name: '多厂通用设置',
      //     key: 9,
      //     meta: {
      //         belong: 'publicSet',
      //         module: 2
      //     }
      // },
      {
        path: '/publicSet',
        component: publicSet,
        name: '多厂通用设置',
        key: 9,
        meta: {
          belong: 'publicSet',
          module: 2
        },
        children: [{
          path: '/',
          component: selfFacSetting,
          name: '规格库',
          key: 9,
          meta: {
            keepAlive: true,
            belong: 'publicSet',
            module: 2
          }
        },
        {
          path: '/publicSet/selfField',
          component: selfField,
          name: '属性库',
          key: 9,
          meta: {
            keepAlive: true,
            belong: 'publicSet',
            module: 2
          }
        }
        ]
      },
      {
        path: 'setting/selfFacTemplate',
        component: selfFacTemplate,
        name: '打印模板启用',
        key: 9,
        meta: {
          belong: 'home/setting/selfFacTemplate',
          module: 1
        }
      },
      {
        path: 'setting/selfConfigApi',
        component: selfConfigApi,
        name: '中台API配置',
        key: 9,
        meta: {
            belong: 'home/setting/selfConfigApi',
            module: 1
        }
      },
      {
        path: 'setting/roleAuthorization',
        component: roleAuthorization,
        name: '角色权限',
        key: 9,
        meta: {
          belong: 'home/setting/roleAuthorization',
          module: 1
        }
      },
      {
        path: 'setting/roleAuthorization/roleInfo',
        component: editRole,
        name: '角色详情/编辑/新增',
        key: 9,
        meta: {
          belong: 'home/setting/roleAuthorization',
          module: 1
        }
      },
      {
        path: 'setting/selfFacStationManager',
        component: selfFacStationManagement,
        // name: '',
        key: 9,
        meta: {
          belong: 'home/setting/selfFacStationManager',
          module: 1
        },
        children: [
          {
            path: '/',
            component: selfFacStationManager,
            name: '工位管理',
            meta: {
              belong: 'home/setting/selfFacStationManager',
              module: 1
            }
          },
          {
            path: '/home/setting/selfFacStationGroup',
            component: selfFacStationGroup,
            name: '工位分组',
            meta: {
              belong: 'home/setting/selfFacStationManager',
              module: 1
            }
          }
        ]
      },
      {
        path: '/selfFacStationDetail',
        component: selfFacStationDetail,
        name: '工位详情',
        key: 9,
        meta: {
          belong: 'home/setting/selfFacStationManager',
          module: 1
        },
      },
      // {
      //     path: 'setting/selfFacSetting',
      //     component: selfFacSetting,
      //     name: '规格属性库',
      //     meta: {
      //         belong: 'home/setting/selfFacSetting',
      //         module: 1
      //     }
      // },
      {
        path: 'setting/selfFacSetting',
        component: selfFacSettingIndex,
        name: '规格属性库',
        meta: {
          belong: 'home/setting/selfFacSetting',
          module: 1
        },
        children: [{
          path: '/',
          component: selfFacSetting,
          name: '规格库',
          meta: {
            keepAlive: true,
            belong: 'home/setting/selfFacSetting',
            module: 1
          }
        },
        {
          path: '/selfField',
          component: selfField,
          name: '属性库',
          meta: {
            keepAlive: true,
            belong: 'home/setting/selfFacSetting',
            module: 1
          }
        },
        {
          path: 'customField',
          component: customField,
          name: '自定义字段',
          meta: {
            keepAlive: true,
            belong: 'home/setting/selfFacSetting',
            module: 1
          }
        },
        {
          path: '/materialWare',
          component: materialWare,
          name: '物料属性库',
          meta: {
            keepAlive: true,
            belong: 'home/setting/selfFacSetting',
            module: 1
          }
        }
        ]
      },
      {
        path: '/home/financialAccount',
        component: financialAccount,
        name: '财务账户',
        meta: {
          belong: 'home/setting/selfFacSetting',
          module: 1
        }
      },
      {
        path: '/sizeConfig',
        component: sizeConfig,
        name: '尺码配比配置',
        meta: {
          belong: 'home/setting/selfFacSetting',
          module: 1
        }
      },
      {
        path: 'setting/selfFacInferiorTag',
        component: selfFacInferiorTag,
        name: '标签管理',
        meta: {
          belong: 'home/setting/selfFacInferiorTag',
          module: 1
        }
      },
      {
        path: '/workingProcedure',
        component: workProcedure,
        key: 9,
        meta: {
          belong: 'workingProcedure',
          module: 1
        },
        children: [
          {
            path: '/',
            component: nodeManage,
            name: '生产工序节点',
            meta: {
              belong: 'workingProcedure',
              module: 1
            }
          },
          {
            path: '/nodeManage',
            component: Procedure,
            name: '工序模板',
            meta: {
              belong: 'workingProcedure',
              module: 1
            }
          }
        ]
      },
      {
        path: '/design',
        component: design,
        meta: {
          belong: 'design',
          module: 1
        },
        children: [
          {
            path: '',
            component: designNode,
            name: '节点信息',
            meta: {
              belong: 'design',
              module: 1
            }
          },
          {
            path: 'template',
            component: designTemplate,
            name: '工序模板',
            meta: {
              belong: 'design',
              module: 1
            }
          }
        ]
      },
      {
        path: '/design/node/create',
        component: designNodeCreate,
        name: '新建设计节点',
        meta: {
          belong: 'design',
          module: 1
        }
      },
      {
        path: '/design/template/create',
        component: designTemplateCreate,
        name: '新建设计工序模板',
        meta: {
          belong: 'design',
          module: 1
        }
      },
      {
        path: '/design/template/edit',
        component: designTemplateEdit,
        name: '编辑设计工序模板',
        meta: {
          belong: 'design',
          module: 1
        }
      },
      {
        path: '/design/template/detail',
        component: designTemplateDetail,
        name: '设计工序模板详情',
        meta: {
          belong: 'design',
          module: 1
        }
      },
      {
        path: '/newNode',
        component: newNode,
        name: '添加节点',
        key: 9,
        meta: {
          belong: 'workingProcedure',
          module: 1
        }
      },
      {
        path: '/createProcedure',
        component: createProcedure,
        name: '添加模板',
        key: 9,
        meta: {
          belong: 'workingProcedure',
          module: 1
        }
      },
      {
        path: '/procedureInfo',
        component: procedureInfo,
        name: '模板信息',
        key: 9,
        meta: {
          belong: 'workingProcedure',
          module: 1
        }
      },
      {
        path: '/editTemplateProcedure',
        component: EditTemplateProcedure,
        name: '编辑模板',
        key: 9,
        meta: {
          belong: 'workingProcedure',
          module: 1
        }
      },
      {
        path: '/editPublicSet',
        component: EditPublicSet,
        name: '编辑通用设置',
        key: 9,
        meta: {
          belong: 'publicSet',
          module: 2
        }
      },
      {
        path: '/factoryMangement',
        component: factoryMangement,
        name: '工厂管理',
        key: 9,
        meta: {
          belong: 'factoryMangement',
          module: 2
        }
      },
      {
        path: '/editFacInfo',
        component: EditFacInfo,
        name: '编辑工厂设置',
        key: 9,
        meta: {
          belong: 'factoryMangement',
          module: 2
        }
      },
      {
        path: '/goodsMangement',
        component: goodsMangement,
        name: '商品档案',
        key: 9,
        meta: {
          keepAlive: true,
          belong: 'goodsMangement',
          module: 1
        }
      },
      {
        path: '/goodsSystemImport',
        component: goodsSystemImport,
        name: '从体系导入',
        key: 9,
        meta: {
          belong: 'goodsMangement',
          module: 1
        }
      },
      {
        path: '/addGoodsStyle',
        component: addGoodsStyle,
        name: '添加货品样式',
        key: 9,
        meta: {
          belong: 'goodsMangement',
          module: 1
        }
      },
      {
        path: '/baseGoodsInfo',
        component: BaseGoodsInfo,
        name: '货品基本信息',
        key: 9,
        meta: {
          belong: 'goodsMangement',
          module: 1
        }
      },
      {
        path: '/goodsClothesDetail',
        component: goodsClothesDetail,
        name: '样衣档案详情',
        meta: {
          belong: 'goodsMangement',
          module: 1
        },
        children: [
          {
            path: '/',
            component: clothes,
            name: '样衣档案详情',
            meta: {
              belong: 'goodsMangement',
              module: 1
            }
          },
          {
            path: 'art',
            component: goodsClothesDetailArt,
            name: '样衣工艺信息',
            meta: {
              belong: 'goodsMangement',
              module: 1
            }
          },
          {
            path: 'bom',
            component: goodsClothesDetailBom,
            name: '样衣BOM表',
            meta: {
              belong: 'goodsMangement',
              module: 1
            }
          },
          {
            path: 'cost',
            component: clothesCost,
            name: '样衣成本核算',
            meta: {
              belong: 'goodsMangement',
              module: 1
            }
          }
        ]
      },
      {
        path: '/goodsBarCodeManagement',
        component: goodsBarCodeManagement,
        name: '货品条码管理',
        key: 9,
        meta: {
          belong: 'goodsBarCodeManagement',
          module: 2
        }
      },
      {
        path: '/customer',
        component: Customer,
        name: '客户管理',
        key: 10,
        children: [],
        meta: {
          belong: 'customer',
          module: 1
        }
      },
      {
        path: '/addCustomer',
        component: AddCustomer,
        name: '添加客户',
        key: 11,
        meta: {
          belong: 'customer',
          module: 1
        }
      },
      {
        path: '/customerinfo',
        component: CustomerInfo,
        name: '客户详情',
        key: 11,
        meta: {
          belong: 'customer',
          module: 1
        }
      },
      {
        path: '/supplier',
        component: Supplier,
        name: '供应商',
        key: 1,
        hidden: true,
        children: []
      },
      {
        path: '/addSupplier',
        component: AddSupplier,
        name: '添加供应商',
        meta: {
          module: 2
        }
      },
      {
        path: '/supplierInfo',
        component: SupplierInfo,
        name: '供应商详情',
        meta: {
          module: 2
        }
      },
      {
        path: '/workerdetailed',
        component: WorkerDetailed,
        name: '工位详情',
        meta: {
          belong: 'workermanager',
          module: 2
        }
      },
      {
        path: '/UpdateWorker',
        component: UpdateWorker,
        name: '更新工位',
        meta: {
          belong: 'workermanager',
          module: 2
        }
      },
      {
        path: '/workorders',
        component: WorkOrders,
        name: '生产工单',
        meta: {
          keepAlive: true,
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/reporting',
        name: '质检型节点上报',
        component: Reporting,
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/CreateOrder',
        component: CreateOrder,
        name: '新建工单',
        meta: {
          keepAlive: true,
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/editOrder',
        component: EditOrder,
        name: '编辑工单',
        meta: {
          keepAlive: true,
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/missionWym',
        component: missionWym,
        name: '工单唯一码查看',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/missionWymStatus',
        component: missionWymStatus,
        name: '唯一码状态',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/orderBom',
        component: OrderBom,
        name: '工单Bom',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/OrderDetailed',
        component: OrderDetailed,
        name: '工单详情',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/cutting/report',
        component: CuttingReport,
        name: '上报扎号',
        meta: {
          belong: 'workorders',
          module: 1,
          keepAlive: true
        }
      },
      {
        path: '/ligation/list',
        component: LigationList,
        name: '扎号列表',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/allNodeMessage',
        component: allNodeMessage,
        name: '工单节点动态',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/cancelOrder',
        component: cancelOrder,
        name: '已撤销工单',
        meta: {
          belong: 'workorders',
          module: 1,
          keepAlive: true
        }
      },
      {
        path: '/nodeReportRecord',
        component: nodeReportRecord,
        name: '上报记录',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/allReportBill',
        component: allReportBill,
        name: '全部上报单据',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: '/allReportBillDetail',
        component: allReportBillDetail,
        name: '单据详情',
        meta: {
          belong: 'workorders',
          module: 1
        }
      },
      {
        path: 'service',
        component: Service,
        name: '消息中心',
        meta: {
          belong: 'home/service',
          module: 1
        },
        children: [
          {
            path: '/serviceMission',
            name: '工作台',
            component: serviceNodePlan,
            meta: {
              belong: 'home/service',
              module: 1
            }
          }
        ]
      },
      {
        path: '/orderProduction',
        component: orderProduction,
        name: '生产订单',
        meta: {
          belong: 'orderProduction',
          module: 1,
          keepAlive: true,
        },
        query: {
          name: 'ddd'
        }
      },
      {
        path: '/adjustOrder',
        component: adjustOrder,
        name: '开调整单',
        meta: {
          belong: 'orderProduction',
          module: 1
        }
      },
      {
        path: '/orderProductionNew',
        component: orderProductionNew,
        name: '新建生产订单',
        meta: {
          keepAlive: true,
          belong: 'orderProduction',
          module: 1
        }
      },

      {
        path: '/orderProductioDetail',
        component: orderProductioDetail,
        name: '生产订单详情',
        meta: {
          belong: 'orderProduction',
          module: 1
        }
      },
      {
        path: '/orderProductionConfig',
        component: orderProductionConfig,
        name: '订单配置',
        meta: {
          belong: 'orderProduction',
          module: 1
        }
      },
      {
        path: '/reportManage',
        component: ReportManage,
        name: '本厂报表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/chargeLimit',
        component: chargeLimit,
        name: '收费限制',
        meta: {
          belong: 'chargeLimit',
          module: 1
        }
      },
      {
        path: '/reportManage/FormsStatistics',
        component: FormsStatistics,
        name: '工厂进度报表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/StaffSalaryReport',
        component: StaffSalaryReport,
        name: '员工计件工资报表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/GoodProcessReport',
        component: GoodProcessReport,
        name: '货品生产进度报表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/stationNodeProcessReport',
        component: stationNodeProcessReport,
        name: '工位-节点进度报表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/typingAchievementsReport',
        component: typingAchievementsReport,
        name: '绩效提成表',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/factoryProcesSettlement',
        component: factoryProcesSettlement,
        name: '外发厂加工结算',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/reportManage/factoryProcesDetail',
        component: factoryProcesDetail,
        name: '外发厂加工结算详情',
        meta: {
          belong: 'reportManage',
          module: 1
        }
      },
      {
        path: '/financialAccount',
        component: financialAccount,
        name: '单位管理',
        meta: {
          belong: 'financialAccount',
          module: 2
        }
      },
      {
        path: '/workerMangement',
        component: workerMangement,
        name: '员工管理',
        meta: {
          belong: 'workerMangement',
          module: 2
        }
      },
      {
        path: '/printList',
        component: printIndex,
        meta: {
          belong: 'printList',
          module: 2
        },
        children: [
          {
            path: '/',
            component: printList,
            name: '打印模板',
            meta: {
              belong: 'printList',
              module: 2
            }
          },
          // {
          //     path: '/addPrintTemplate',
          //     component: addPrintTemplate,
          //     name: '打印模板设置',
          //     meta: {
          //         belong: 'printList',
          //         module: 2
          //     }
          // },
          {
            path: '/editPrintTemplate',
            component: editPrintTemplate,
            name: '打印模板设置编辑',
            meta: {
              belong: 'printList',
              module: 2
            }
          }
        ]
      },
      {
        path: 'stock',
        component: Stock,
        meta: {
          belong: '/home/stock',
          module: 1
        },
        children: [
          {
            path: '/',
            component: RealStock,
            name: '成衣商品库存',
            meta: {
              belong: 'home/stock',
              module: 1
            }
          },
          {
            path: 'bill',
            component: StockBill,
            name: '库存单据',
            meta: {
              keepAlive: true,
              belong: 'home/stock',
              module: 1
            }
          },
          {
            path: 'notice',
            component: StockNotice,
            name: '库存通知',
            meta: {
              keepAlive: true,
              belong: 'home/stock',
              module: 1
            }
          },
          {
            path: 'stockrecord',
            component: StockRecord,
            name: '库存变动记录',
            meta: {
              belong: 'home/stock',
              module: 1
            }
          }
        ]
      },
      {
        path: '/stockDetail',
        component: StockDetail,
        name: '库存单据详情',
        meta: {
          belong: 'home/stock',
          module: 1
        }
      },
      {
        path: '/stockDetailNew',
        component: StockDetailNew,
        name: '库存单据详情',
        meta: {
          belong: 'home/stock',
          module: 1
        }
      },
      {
        path: 'instorage',
        component: InStorage,
        name: '新建库存单据',
        meta: {
          belong: 'home/stock',
          module: 1
        }
      },
      {
        path: '/materielClassify',
        component: materielClassify,
        name: '物料分类',
        meta: {
          belong: 'materielClassify',
          module: 2
        }
      },
      {
        path: '/materialArchives',
        component: materialArchives,
        name: '物料档案',
        meta: {
          keepAlive: true,
          belong: 'materialArchives',
          module: 1
        }
      },
      {
        path: '/materialSupplier',
        component: materialSupplier,
        name: '物料供应商',
        meta: {
          belong: 'materialSupplier',
          module: 1
        }
      },
      {
        path: '/materialSupplier/info/:id',
        component: materialSupInfo,
        name: '物料供应商信息',
        meta: {
          belong: 'materialSupplier',
          module: 1
        }
      },
      {
        path: '/materialInventory',
        component: materialInventory,
        meta: {
          belong: 'materialInventory',
          module: 1
        },
        children: [
          {
            path: '/',
            component: matInventory,
            name: '物料库存',
            meta: {
              belong: 'materialInventory',
              module: 1
            }
          },
          {
            path: 'matremaind',
            component: matRemaind,
            name: '余料库存',
            meta: {
              belong: 'materialInventory',
              module: 1
            }
          },
          {
            path: 'matrecord',
            component: matRecord,
            name: '库存变动记录',
            meta: {
              belong: 'materialInventory',
              module: 1
            }
          }
        ]
      }, {
        path: '/materialInventory/matBatch',
        component: matBatch,
        name: '批量出入库',
        meta: {
          belong: 'materialInventory',
          module: 1
        }
      },
      {
        path: '/materialInfo/:id',
        component: materialInfo,
        name: '物料信息',
        meta: {
          belong: 'materialArchives',
          module: 1
        }
      },
      {
        path: '/addMaterial',
        component: addMaterial,
        name: '物料操作',
        meta: {
          belong: 'materialArchives',
          module: 1
        }
      },
      // {
      //     path: '/marterielPurchase',
      //     component: marterielPurchase,
      //     name: '物料采购',
      //     meta: {
      //         belong: 'marterielPurchase',
      //         module: 1
      //     },
      //     children: [{
      //         path: '/',
      //         component: purchaseNeed,
      //         name: '采购需求看板',
      //         meta: {
      //             keepAlive: true,
      //             belong: 'marterielPurchase',
      //             module: 1
      //         }
      //     },
      //         {
      //             path: '/purchaseList',
      //             component: purchaseList,
      //             name: '采购单列表',
      //             meta: {
      //                 keepAlive: true,
      //                 belong: 'marterielPurchase',
      //                 module: 1
      //             }
      //         }
      //     ]
      // },
      {
        path: '/purchaseNeed',
        component: purchaseNeed,
        name: '采购需求看板',
        meta: {
          keepAlive: true,
          belong: 'purchaseNeed',
          module: 1
        }
      },
      {
        path: '/purchaseList',
        component: purchaseList,
        name: '采购单',
        meta: {
          keepAlive: true,
          belong: 'purchaseList',
          module: 1
        }
      },
      {
        path: '/newPurchase',
        component: newPurchase,
        name: '新建采购单',
        meta: {
          belong: 'purchaseList',
          module: 1
        }
      },
      {
        path: '/detailPurchase',
        component: detailPurchase,
        name: '采购单详情',
        meta: {
          belong: 'purchaseList',
          module: 1
        }
      },
      {
        path: '/outsideFactory',
        component: outsideFactory,
        name: '加工厂商档案',
        meta: {
          belong: 'outsideFactory',
          module: 1
        }
      },
      {
        path: '/outsideFactory/info/:id',
        component: outsideFactoryInfo,
        name: '加工厂商档案详情',
        meta: {
          belong: 'outsideFactory',
          module: 1
        }
      },
      {
        path: '/materialList',
        component: materialList,
        name: '到料单',
        meta: {
          keepAlive: true,
          belong: 'materialList',
          module: 1
        }
      },
      {
        path: '/materialAdd',
        component: materialAdd,
        name: '新建到料单',
        meta: {
          belong: 'materialList',
          module: 1
        }
      },
      {
        path: '/materialDetail',
        component: materialDetail,
        name: '到料单详情',
        meta: {
          belong: 'materialList',
          module: 1
        }
      },

      {
        path: '/marterielPayoff',
        component: marterielPayoff,
        name: '待送料看板',
        meta: {

          belong: 'marterielPayoff',
          module: 1
        },
        children: [{
          path: '/',
          component: marterielPayoffWait,
          name: '待送料看板',
          meta: {
            keepAlive: true,
            belong: 'marterielPayoff',
            module: 1
          }
        },
        {
          path: '/marterielPayoffList',
          component: marterielPayoffList,
          name: '送料单列表',
          meta: {
            keepAlive: true,
            belong: 'marterielPayoff',
            module: 1
          }
        },
        {
          path: '/marterielNotifyPayoffList',
          component: marterielNotifyPayoffList,
          name: '送料通知单列表',
          meta: {
            keepAlive: true,
            belong: 'marterielPayoff',
            module: 1
          }
        }
        ]
      }, {
        path: '/newPayoffOrder',
        component: newPayoffOrder,
        name: '新建送料单',
        meta: {
          belong: 'marterielPayoff',
          module: 1
        }
      },
      {
        path: '/returnMarteriel',
        component: returnMarteriel,
        name: '退料单列表',
        meta: {
          keepAlive: true,
          belong: 'returnMarteriel',
          module: 1
        }
      },
      {
        path: '/newReturnMarteriel',
        component: newReturnMarteriel,
        name: '新建退料单',
        meta: {
          belong: 'returnMarteriel',
          module: 1
        }
      },
      {
        path: '/return/detail',
        component: ReturnDetail,
        name: '退料单详情',
        meta: {
          belong: 'returnMarteriel',
          module: 1
        }
      },
      {
        path: '/marterielFeedback',
        component: marterielFeedback,
        name: '余料入库单列表',
        meta: {
          keepAlive: true,
          belong: 'marterielFeedback',
          module: 1
        }
      },
      {
        path: '/newFeedback',
        component: newFeedback,
        name: '新建余料入库单',
        meta: {
          belong: 'marterielFeedback',
          module: 1
        }
      },
      {
        path: '/feedbackDetail',
        component: feedbackDetail,
        name: '余料入库单详情',
        meta: {
          belong: 'marterielFeedback',
          module: 1
        }
      },
      {
        path: '/payoffDetail',
        component: payoffDetail,
        name: '送料单详情',
        meta: {
          belong: 'marterielPayoff',
          module: 1
        }
      },
      {
        path: '/marterielConfig',
        component: marterielConfig,
        name: '字段配置',
        meta: {
          belong: 'marterielConfig',
          module: 1
        }
      },
      {
        path: '/sample',
        component: sampleMission,
        name: '设计工单',
        meta: {
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/sample/cancel',
        component: sampleCancelMission,
        name: '已撤销的设计工单',
        meta: {
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/sample/create',
        component: sampleCreate,
        name: '新建设计工单',
        meta: {
          keepAlive: true,
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/sample/edit',
        component: sampleEdit,
        name: '编辑设计工单',
        meta: {
          keepAlive: true,
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/sample/detail',
        component: sampleDetail,
        name: '设计工单详情',
        meta: {
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/sample/dynamic',
        component: sampleDynamic,
        name: '工单节点动态',
        meta: {
          belong: 'sample',
          module: 1
        }
      },
      {
        path: '/designFile',
        component: designFile,
        children: [
          {
            path: '/',
            component: designFileInfo,
            name: '设计档案',
            meta: {
              keepAlive: true,
              belong: 'designFile',
              module: 1
            }
          },
          {
            path: 'createDesignFile',
            component: createDesignFile,
            name: '新建设计档案',
            meta: {
              belong: 'designFile',
              module: 1
            }
          },
          {
            path: 'costDetail',
            component: costDetail,
            name: '成本核算详情',
            meta: {
              belong: 'designFile',
              module: 1
            }
          },
          {
            path: 'designFileDetail',
            component: designFileDetail,
            name: '设计档案详情',
            meta: {
              belong: 'designFile',
              module: 1
            },
            children: [
              {
                path: '/',
                component: designFileInfoDetail,
                name: '设计档案信息',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'technicsInfo',
                component: technicsInfo,
                name: '工艺信息',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'bom',
                component: bomList,
                name: 'BOM表',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'clothesFile',
                component: clothesFile,
                name: '样衣档案信息',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'procedure',
                component: procedureTemplate,
                name: '工序模板',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'costAccounting',
                component: costAccounting,
                name: '成本核算',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'patternMakingFile',
                component: patternMakingFile,
                name: '打版文件',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              }
            ]
          },
          {
            path: 'clothesDetail',
            component: clothesDetail,
            name: '样衣档案详情',
            meta: {
              belong: 'designFile',
              module: 1
            },
            children: [
              {
                path: '/',
                component: clothes,
                name: '样衣档案详情',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'art',
                component: clothesArt,
                name: '样衣工艺信息',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'bom',
                component: clothesBOM,
                name: '样衣BOM表',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              },
              {
                path: 'cost',
                component: clothesCost,
                name: '样衣成本核算',
                meta: {
                  belong: 'designFile',
                  module: 1
                }
              }
            ]
          },

        ]
      },
      {
        path: '/designWorkbench',
        component: designWorkbench,
        name: '设计工作台',
        meta: {
          keepAlive: true,
          belong: 'designWorkbench',
          module: 1
        }
      },
      {
        path: '/documentReview',
        component: documentReview,
        name: '单据审核',
        meta: {
          belong: 'documentReview',
          module: 1
        }
      },
      {
        path: '/documentReview/appendagePage/approvalRecord',
        component: approvalRecord,
        name: '历史审批记录',
        meta: {
            belong: 'documentReview',
            module: 1
        }
    },
      {
        path: '/inferiorMamage',
        component: inferiorMamage,
        name: '次品管理',
        meta: {
          belong: 'inferiorMamage',
          module: 1
        }
      },
      {
        path: '/inferiorMamage/detail',
        component: inferiorMamageDetail,
        name: '退回返修单详情',
        meta: {
          belong: 'inferiorMamage',
          module: 1
        }
      },
      {
        path: '/allInferiorBill',
        component: allInferiorBill,
        name: '全部次品管理单据',
        meta: {
          belong: 'inferiorMamage',
          module: 1
        }
      },
      {
        path: 'autoNumber',
        component: autoNumber,
        name: '自动编号设置',
        meta: {
          belong: '/home/autonumber',
          module: 2
        }
      },
      // 样料采购
      {
        path: '/samplePurchaseList',
        component: samplePurchaseList,
        name: '样料采购单',
        meta: {
          keepAlive: true,
          belong: 'samplePurchaseList',
          module: 1
        }
      },
      {
        path: '/newSamplePurchase',
        component: newPurchase,
        name: '新建样料采购单',
        meta: {
          belong: 'samplePurchaseList',
          module: 1
        }
      },
      {
        path: '/detailSamplePurchase',
        component: detailPurchase,
        name: '样料采购单详情',
        meta: {
          belong: 'samplePurchaseList',
          module: 1
        }
      },
      {
        path: '/sampleMaterialList',
        component: sampleMaterialList,
        name: '样料到料单',
        meta: {
          keepAlive: true,
          belong: 'sampleMaterialList',
          module: 1
        }
      },
      {
        path: '/sampleMaterialAdd',
        component: materialAdd,
        name: '新建样料到料单',
        meta: {
          belong: 'sampleMaterialList',
          module: 1
        }
      },
      {
        path: '/sampleMaterialDetail',
        component: materialDetail,
        name: '样料到料单详情',
        meta: {
          belong: 'sampleMaterialList',
          module: 1
        }
      },
      {
        path: '/sampleMarterielPayoffList',
        component: marterielPayoffList,
        name: '样料送料单',
        meta: {
          keepAlive: true,
          belong: 'sampleMarterielPayoffList',
          module: 1
        }
      },
      {
        path: '/samplePayoffDetail',
        component: payoffDetail,
        name: '样料送料单详情',
        meta: {
          belong: 'sampleMarterielPayoffList',
          module: 1
        }
      },
      {
        path: '/newSamplePayoffOrder',
        component: newPayoffOrder,
        name: '新建样料送料单',
        meta: {
          belong: 'sampleMarterielPayoffList',
          module: 1
        }
      },
      {
        path: '/procurementPlan',
        redirect: '/procurementPlan/list',
        component: procurementPlan,
        meta: {
          belong: 'procurementPlan',
          module: 1
        },
        children: [
          {
            path: 'list',
            component: procurementPlanList,
            name: '采购规划',
            meta: {
              belong: 'procurementPlan',
              module: 1
            },
          },
          {
            path: 'template',
            component: procurementPlanTemplate,
            name: '采购规划模板',
            meta: {
              belong: 'procurementPlan',
              module: 1
            },
          }
        ]
      },
      {
        path: '/procurementPlan/editTemplate',
        component: procurementPlanEditTemplate,
        name: '编辑采购规划模板',
        meta: {
          belong: 'procurementPlan',
          module: 1
        }
      },
      {
        path: '/procurementPlan/edit',
        component: procurementPlanEdit,
        name: '编辑采购规划',
        meta: {
          belong: 'procurementPlan',
          module: 1
        }
      },
      {
        path: '/procurementPlan',
        component: procurementPlanDetail,
        name: '采购规划单',
        meta: {
          belong: 'procurementPlan',
          module: 1
        },
        children: [
          {
            path: 'levelDetail',
            component: procurementPlanLevelDetail,
            name: '采购规划单详情',
            meta: {
              belong: 'procurementPlan',
              module: 1
            }
          },
          {
            path: 'levelList',
            component: procurementPlanLevelList,
            name: '采购规划单中间页',
            meta: {
              belong: 'procurementPlan',
              module: 1
            }
          }
        ]
      },
      {
        path: '/storeFiles',
        component: storeFiles,
        name: '店铺档案',
        meta: {
          keepAlive: true,
          belong: 'storeFiles',
          module: 1
        }
      },
      {
        path: '/storeFiles/detail',
        component: storeFilesDetail,
        name: '店铺详情',
        meta: {
          belong: 'storeFiles',
          module: 1
        }
      },
      {
        path: '/salesPlan',
        component: salesPlan,
        name: '销售计划',
        meta: {
          belong: 'salesPlan',
          module: 1
        }
      },
      {
        path: '/salesPlan/edit',
        component: salesPlanEdit,
        name: '编辑销售计划',
        meta: {
          belong: 'salesPlan',
          module: 1
        }
      },
      {
        path: '/salesPlan/detail',
        component: salesPlanDetail,
        name: '销售计划详情',
        meta: {
          belong: 'salesPlan',
          module: 1
        }
      },
      {
        path: '/salesPlan/addStore',
        component: salesPlanAddStore,
        name: '添加门店',
        meta: {
          belong: 'salesPlan',
          module: 1
        }
      }

    ]
  },
  {
    path: '/',
    redirect: '/login'
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default home;
