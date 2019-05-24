const data = [
    {
        icon: 'icon-station',
        name: '员工管理',
        child: [
            {
                path: '/workermanager',
                name: '工位管理',
            },
            {
                path: '/workerMangement',
                name: '员工管理',
            },
        ]
    },
    {
        path: '/purchaseAllocation',
        icon: 'icon-nav-cgpz',
        name: '物料采购配置',
    },
    {
        path: '',
        icon: 'icon-materialclassificat',
        name: '配置中心',
        child: [
            {
                path: '/attribute',
                name: '资料档案配置'
            },
            {
                path: '/archives',
                name: '属性库'
            }
        ]
    },
    {
        path: '/goodsBarCodeManagement',
        icon: 'icon-goodsbarcode',
        name: '货品条码管理',
    },

    {
        path: '/factoryMangement',
        icon: 'icon-factory-management',
        name: '工厂管理',
    },
    {
        path: '/home/repertory',
        icon: 'icon-warehouse',
        name: '仓库管理'
    },
    {
        path:'/financialAccount',
        icon: 'icon-financialaccount',
        name: '财务账户',
    },
    {
        path: '/home/autoNumber',
        icon: 'icon-warehouse',
        name: '自动编码管理'
    },
    {
        path: '/printList',
        icon: 'icon-print-management',
        name: '打印模板设置'
    },
    {
        path: '/publicSet',
        icon: 'icon-attribute',
        name: '规格库'
    },
    {
        path: '/materielClassify',
        icon: 'icon-materialclassificat',
        name: '物料分类'
    },
    {
        path: '/publicInferior',
        icon: 'icon-defectivelabel',
        name: '标签管理'
    },
    // {
    //     path: '/home/prodCenter',
    //     icon: 'icon-production-centre',
    //     name: '生产准备中心'
    // }
];


export default data;