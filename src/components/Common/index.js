// layout components
import pageTitle from './page-title.vue';
import pageWrap from './page-wrap.vue';
import contentWrap from './content-wrap.vue';
import iconButton from './icon-button.vue';
import itemBase from './item-base.vue';
import Icon from './icon.vue';
// import nfDialog from './nf-dialog.vue'
import NfSkuTable from './sku-table/sku-table.vue';
import baseBox from './base-box.vue';

import nfPreviewer from './nf-previewer.vue'
// business components
import topbar from "./business/topbar.vue";
import navHome from "./business/nav/navHome.vue";
import navUnit from "./business/nav/navUnit.vue";
import workerLeader from "./workerLeader.vue";
import InlineLoading from "./inline-loading.vue";
import imgPreview from "./imgPreview.vue";
import VUserSelect from "./user-select-group";
import materialAndGoodsBomUpdate from "./materialAndGoodsBomUpdate";
import materialSelect from "./custom-select/material-select.vue";
import designStyleNoSelect from '@/components/Common/custom-select/designStyleNoSelect.vue'
import colorSelectGroup from '@/components/Common/color-select-group'
import outsideSupplierSelect from '@/components/Common/custom-select/outside-supplier-select.vue'
import machiningSelect from '@/components/Common/custom-select/machiningSelect.vue'
import areaSelect from '@/components/Common/custom-select/areaSelect.vue'
import checkAllDialog from '@/components/Common/checkAllDialog.vue'
import goodsAttrDialog from './goodsAttrDialog' //  商品属性查询弹窗
import customer from '@/components/Common/custom-select/customer.vue'
import goodsSelect from '@/components/Common/custom-select/goodsSelect.vue'
import designGoodsSelect from '@/components/Common/custom-select/designGoodsSelect.vue'
import materialVariousOrderSelect from '@/components/Common/custom-select/materialVariousOrderSelect.vue'
import richFilter from '@/components/Common/richFilter/index.vue'
import slideFilter from '@/components/Common/slideFilter.vue'
import categorySelect from '@/components/Common/custom-select/categorySelect.vue'



const Components = {
    pageTitle,
    pageWrap,
    contentWrap,
    Icon,
    iconButton,
    itemBase,
    baseBox,
    NfSkuTable,
    topbar,
    navHome,
    navUnit,
    // nfDialog,
    nfPreviewer,
    workerLeader,
    imgPreview,
    InlineLoading,
    VUserSelect,
    materialSelect,
    designStyleNoSelect,
    materialAndGoodsBomUpdate,
    colorSelectGroup,
    goodsAttrDialog,
    outsideSupplierSelect,
    areaSelect,
    checkAllDialog,
    goodsSelect,
    designGoodsSelect,
    materialVariousOrderSelect,
    machiningSelect,
    richFilter,
        customer,
    slideFilter,
    categorySelect
};

const install = function (Vue) {
    for (let i in Components) {
        Vue.component(i, Components[i]);
    }
    ;
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
;
Components.install = install;
export default Components;
