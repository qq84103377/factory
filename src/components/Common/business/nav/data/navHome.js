const data = [
    {
        path: '/home/service',
        icon: 'icon-message',
        name: '消息中心',
    },
    {
        path: '/workorders',
        icon: 'icon-work-order',
        name: '生产工单',
    },
    {
        path: '/orderProduction',
        icon: 'icon-nav-scdd',
        name: '生产订单',
    },
    {
        path: '',
        icon: 'icon-materials-file',
        name: '物料采购',
        child: [
            {
                path: '/purchaseNeed',
                name: '采购需求看板'
            },
            {
                path: '/purchaseList',
                name: '采购单'
            },
            {
                path: '/materialList',
                name: '到料单',
            },
            {
                path: '/marterielPayoff',
                name: '送料单'
            },
            {
                path: '/returnMarteriel',
                name: '退料单'
            },
            {
                path: '/marterielFeedback',
                name: '余料入库单'
            },
            {
                path: '/marterielConfig',
                name: '字段配置'
            },
        ]
    },
    {
        path: '',
        icon: 'icon-nav-ylzx',
        name: '样料采购',
        child: [
            {
                path: '/samplePurchaseList',
                name: '样料采购单',
            },
            {
                path: '/sampleMaterialList',
                name: '样料到料单',
            },
            {
                path: '/sampleMarterielPayoffList',
                name: '样料送料单',
            }
        ]
    },
    {
        path: '/documentReview',
        icon: 'icon-nav-djsh',
        name: '单据审核',
    },
    {
        path: '/inferiorMamage',
        icon: 'icon-nav-defective-products',
        name: '次品管理',
    },
    {
        icon: 'icon-templet-center',
        name: '样版中心',
        path: '',
        child: [
            {
                path: '/designWorkbench',
                name: '设计工作台'
            },
            {
                path: '/sample',
                name: '设计工单'
            },
            {
                path: '/designFile',
                name: '设计档案'
            }
        ]
    },
    {
        path: '',
        icon: 'icon-Inventory',
        name: '库存管理',
        child: [
            {
                path: '/home/stock',
                name: '成衣商品库存'
            },
            {
                path: '/materialInventory',
                name: '物料库存'
            },
        ]
    },
    {
        path: '',
        icon: 'icon-dataFile',
        name: '资料档案',
        child: [
            {
                path: '/materialArchives',
                name: '物料档案'
            },

            {
                path: '/materialSupplier',
                name: '物料供应商'
            },
            {
                path: '/goodsMangement',
                name: '商品档案'
            },
            {
                path: '/customer',
                name: '客户档案'
            },
            {
                path: '/outsideFactory',
                name: '加工厂商档案',
            },
            {
                path: '/storeFiles',
                name: '店铺档案',
            }
        ]
    },
    {
        path: '/reportManage',
        icon: 'icon-report',
        name: '工厂报表'
    },
    {
        path: '',
        icon: 'icon-node',
        name: '节点和工序模板',
        child: [
            {
                path: '/workingProcedure',
                name: '生产工序节点'
            },
            {
                path: '/design',
                name: '设计工序节点'
            }
        ]
    },
    {
        path: '',
        icon: 'icon-setting',
        name: '本厂设置',
        child: [
            {
                path: '/home/setting/selfFacStationManager',
                name: '本厂工位'
            },
            {
                path: '/home/setting/roleAuthorization',
                name: '角色权限'
            },
            {
                path: '/home/setting/selfFacSetting',
                name: '规格属性库'
            },
            {
                path: '/home/setting/selfFacTemplate',
                name: '打印模板启用'
            },
            {
                path: '/home/setting/selfFacInferiorTag',
                name: '标签管理'
            },
            {
                path: '/home/setting/selfConfigApi',
                name: '中台API配置'
            }
        ]
    },
    {
        path: '',
        icon: 'icon-Group',
        name: '商品企划',
        child: [
            {
                path: '/procurementPlan',
                name: '采购规划',
            },
            {
                path: '/salesPlan',
                name: '销售计划',
            }
        ]
    },
    {
        path: '/chargeLimit',
        icon: 'icon-setting',
        name: '收费限制'
    },
];


export default data;
