<template>
    <section class="stock-notice">
        <div class="custom-filter-form box-shadow">
            <el-form style="margin-left: -38px" :model="form" status-icon ref="ruleForm2" label-width="100px"
                     class="demo-ruleForm">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="单据号" class="filter-item">
                            <stockNoSelect :multiple="true" :storehouseId="storehouseId" selectType="notice" v-model="form.stockInformIdList"></stockNoSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="开单人" class="filter-item">
                            <workerLeader v-model="form.operaterIdList"
                                          :placeholder="'请选择或搜索开单人'"></workerLeader>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="开单日期">
                            <el-date-picker
                                    v-model="form.orderDay"
                                    type="daterange"
                                    placeholder="选择日期范围"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="商品">
                            <goods-select :multiple="true" v-model="form.styleIdList"></goods-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="出库仓库">
                            <el-select multiple filterable v-model="form.outStorehouseIdList" placeholder="请选择">
                                <el-option
                                        v-for="item in storehouseList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="6">
                        <el-form-item label="供应商">
                            <outsideSupplierSelect :multiple="true" ref="supplier" :canAdd = 'false' @getSupplierId="getSupplierId">
                            </outsideSupplierSelect>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="8">
                        <el-form-item label="单据状态">
                            <div>
                                <filter-check-group multiple v-model="form.statusList">
                                    <filter-check-item style="width: 116px;"
                                            v-for="item in options"
                                            :key="item.value"
                                            :value="item.value"
                                            :label="item.label"></filter-check-item>
                                </filter-check-group>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="8" :lg="4">
                        <div class="btn-group">
                            <el-button class="btn btn-reset" @click="reset">重置</el-button>
                            <el-button class="btn btn-submit" @click="submit">筛选</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <el-table
                v-loading="loading"
                :data="tableData" border
                style="width: 100%;margin-top: 8px;font-size: 12px;">
            <el-table-column
                    prop="orderNo"
                    label="单据号">
            </el-table-column>
            <el-table-column
                    prop="operaterName"
                    label="开单人">
            </el-table-column>
            <el-table-column
                    prop="orderDay"
                    label="开单日期">
            </el-table-column>
            <el-table-column
                    prop="stockOutStorehouseName"
                    label="出库仓库">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="关联出库单">
                <template slot-scope="scope">
                    <span style="cursor: pointer;text-decoration: underline" v-if="scope.row.stockOutId" @click="reviewDetail(scope.row.stockOutId,0)">{{scope.row.stockOutOrderNo}}</span>
                    <span v-else>无</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="入库通知数">
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="入库通知金额">
            </el-table-column>
            <el-table-column
                    label="状态">
                <template slot-scope="scope">
                    <span>{{handleStatus(scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="关联入库单">
                <template slot-scope="scope">
                    <span v-if="scope.row.stockInId" style="cursor: pointer;text-decoration: underline" @click="reviewDetail(scope.row.stockInId,1)">{{scope.row.stockInOrderNo}}</span>
                    <span v-else>未入库</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="stockInNum"
                    label="实际入库数">
            </el-table-column>
            <el-table-column
                    prop="stockInAmount"
                    label="实际入库金额">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="address"
                    label="操作">
                <template slot-scope="scope">
                    <span style="cursor: pointer;text-decoration: underline;color: blue;margin-right: 8px;" @click="reviewDetail(scope.row.stockInformId,5)">查看详情</span>
                    <span @click="edit(scope.row.stockInformId,false)" v-if="scope.row.status==0" style="cursor: pointer;text-decoration: underline;color: #23C811">确认入库</span>
                    <span @click="edit(scope.row.stockInformId,true)" v-if="scope.row.status==1||scope.row.status==2" style="cursor: pointer;text-decoration: underline;">修改入库数</span>
                </template>
            </el-table-column>
        </el-table>

        <div style="overflow: hidden;margin-top: 8px;">
            <el-pagination
                    style="float: right;"
                    layout="total, prev, pager, next"
                    :page-size="form.pageSize"
                    :current-page="form.pageNo"
                    :total="totalCount"
                    @current-change="handlePageChange">
            </el-pagination>
        </div>

        <!--修改单据侧滑窗-->
        <transition name="right-move">
            <div v-if="editDialog" style="position: fixed;top: 0;right: 0;z-index: 11;padding: 24px 36px;background: #fff;height: 100%;width: 85%;
    overflow-y: scroll;">
                <in-storage @success="editCallBack" @cancel="editDialog=false" :isEditNotice="isEditNotice" :isEdit="true" :editInfo="editInfo" ref="inStorage"></in-storage>
            </div>
        </transition>
        <transition name="opcity">
            <div style="z-index: 10" class="cover" v-show="editDialog" @click="editDialog = false"></div>
        </transition>
    </section>
</template>

<script>
    import Utils from '@/utils/format'
    import stockNoSelect from '@/components/Common/custom-select/stockNoSelect.vue'
    import FilterCheckGroup from '@/components/order/WorkOrders/filter-check-group';
    import FilterCheckItem from '@/components/order/WorkOrders/filter-check-item';
    import {getStorehousesByUserId,stockInformList,centralStockDetail} from '@/api'
    import inStorage from './in-storage'
    export default {
        name: "stock-notice",
        components: {
            stockNoSelect,
            FilterCheckGroup,
            FilterCheckItem,
            inStorage
        },
        computed:{
            storehouseId() {
                return this.$route.query.storehouseId
            },
            userId() {
                return (this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem("user_login")).userId);
            },
            unitId() {
                return JSON.parse(sessionStorage.getItem("last_login")).id
            },
        },
        data() {
          return {
              totalCount: 0,
              pageNo: 1,
              editDialog: false,
              tableData: [],
              form: {
                  stockInformIdList: [],
                  operaterIdList: [],
                  orderDay: [new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59))],
                  styleIdList: [],
                  outStorehouseIdList: [],
                  outsideFactoryIdList: [],
                  statusList: [],
                  pageNum: 1,
                  pageSize: 20
              },
              options: [
                  {label: '待入库', value: 0},
                  {label: '已入库:有差异', value: 1},
                  {label: '已入库:无差异', value: 2},
                  {label: '已关闭', value: 3},
              ],
              storehouseList: [],
              editInfo: {},
              skuValue: {},
              informTableData: [],
              detailInfo: {styleDTOList:[],operateDate:''},
              isEditNotice: false,
              loading: false
          }
        },
        watch: {
            $route(v) {
                if(v.path.indexOf('/home/stock/notice')>-1) {
                    this.getList()
                }
            }
        },
        methods: {
            handlePageChange(v) {
                this.form.pageNum = v
                this.getList()
            },
            editCallBack(id) {
                this.editDialog = false
                this.$router.push(`/stockDetailNew?id=${id}&type=1&storehouseId=${this.storehouseId}`)
            },
            getLengths(skuList) {
                let arr = [];
                for (let skuItem of skuList) {
                    const had = arr.some(item => item.id === skuItem.standardId);
                    !had && arr.push({value: skuItem.standardValue || '无', id: skuItem.standardId});
                }
                return arr;
            },
            setTableData(data = {}) {
                // const commonStyleSkuList = data['commonStyleSkuList'];
                const commonStyleSkuList = data['skuDTOList'];
                console.log(commonStyleSkuList,'commonStyleSkuListcommonStyleSkuList');
                let skuList = []
                    , colors = []
                    , sizes = []
                    , lengths = []
                    , json = {}
                    , skuValue = {}
                    , standbyValue = {};
                const lengthData = this.getLengths(commonStyleSkuList); // 用来半段是否显示‘无’内长
                const isHideLength = (lengthData.length === 1 && lengthData[0].value === '无');
                for (let item of commonStyleSkuList) {
                    item.styleId = data.styleId;
                    const skuIdStr = `${item.styleId}/${item.colorId}/${item.sizeId}/${(!isHideLength && item.standardId) ? item.standardId : ''}`
                    skuValue[skuIdStr] = {
                        num: item.quantity,
                        skuId: item.skuId,
                        styleId: item.styleId
                    }
                    standbyValue[skuIdStr] = {
                        num: item.quantity,
                        skuId: item.skuId,
                        styleId: item.styleId
                    }
                    if (!json[item.colorId]) {
                        colors.push({
                            stockNum: '',
                            colorName: item.colorNoName || item.colorName,
                            colorId: item.colorId,
                            ...data,
                            id: item.styleId || item.skuId
                        });
                        json[item.colorId] = item.colorId;
                    }
                    if (item.standardId && !json[item.standardId]) {
                        lengths.push({
                            standardValue: item.standardValue || '无',
                            standardId: item.standardId,
                            ...data,
                            id: item.styleId
                        });
                        json[item.standardId] = item.standardId;
                    }
                    // const idStr = item.sizeValue + (item.standardId ? '/' + item.standardValue : '')
                    if (!json[item.sizeId]) {
                        sizes.push({
                            ...item,
                            sizeNum: '',
                            sizeValue: item.sizeName,
                            sizeId: item.sizeId
                        });
                        json[item.sizeId] = item.sizeId;
                    }
                }
                if (isHideLength) lengths = [];
                for (let colorItem of colors) {
                    const sizeObj = {
                        ...colorItem,
                        lengths
                    };
                    skuList.push(sizeObj)
                }
                return {
                    skuList,
                    sizes,
                    skuValue,
                    standbyValue
                }
            },
            getTableDataAndSkuValue(data, v, type, isIn) {
                this.skuValue = {
                    ...this.skuValue,
                    ...data['skuValue']
                };
                console.log(this.skuValue,'this.skuValuethis.skuValue');
                // this.standbyValue = {
                //     ...this.standbyValue,
                //     ...data['standbyValue']
                // }; // 用来做弹窗备用
                let stockNum = v.skuDTOList.reduce((total,curV) => {
                    return total + curV.quantity
                },0)
                this.informTableData = this.informTableData.concat([
                    {
                        ...v,
                        ...data,
                        commonStyleSkuList: data['skuList'],
                        cost: v.stylePrice,
                        sizes: data['sizes'],
                        num: stockNum,
                        stockNum,
                        totalPrice: stockNum * Number(v.stylePrice),
                        id: v.styleId
                    }
                ]);
                console.log(this.informTableData,'this.tableData ');
            },
            async getDetail(stockId) {
                this.informTableData = []
                // this.standbyValue = {}
                this.skuValue = {}
                await centralStockDetail({stockId,unitId:this.unitId}).then(res => {
                    this.detailInfo = res.data.centralBillStockInfoDTO
                    // this.isAdjustIn = res.data.centralBillStockInfoDTO.adjustInBillId === this.id

                    this.detailInfo.styleDTOList.forEach(v => {
                        const data = this.setTableData(v);
                        this.getTableDataAndSkuValue(data, v);

                    })
                })
            },
            async edit(stockId,bol) {
                // 权限
                if(!this.powerJudgement.permissions("fac.stock.change.bill.update")&&bol){
                    return
                }

                this.editDialog = true;
                this.isEditNotice = bol;
                await this.getDetail(stockId)
                this.$set(this.editInfo,'skuValue',this.skuValue)
                this.$set(this.editInfo,'tableData',this.informTableData)
                this.$set(this.editInfo,'detail',this.detailInfo)
                this.$nextTick(() => {
                    this.$refs['inStorage'].getEditInfo();
                    if(bol){
                        this.$refs['inStorage'].getStockList([stockId]);
                    }else {
                        this.$refs['inStorage'].getStockList();
                    }
                })
            },
            reviewDetail(id,type) {
                this.$router.push(`/stockDetailNew?id=${id}&type=${type}&storehouseId=${this.storehouseId}`)
            },
            submit() {
              this.getList()
            },
            handleStatus(status) {
                switch (status) {
                    case 0: return '待入库';
                    case 1: return '已入库:有差异';
                    case 2: return '已入库:无差异';
                    case 3: return '已关闭';
                }
            },
            getSupplierId(item) {
                this.form.outsideFactoryIdList = item
            },
            reset() {
                for(let k in this.form) {
                    this.form[k] = []
                }
                this.form.orderDate = [new Date(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), new Date(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(),23, 59,59))]

                this.$refs['supplier'].reset()
                // this.submit()
            },
            getStorehousesList(){
                getStorehousesByUserId({facId:this.unitId,userId:this.userId,kind: 1}).then(res => {
                    this.storehouseList = res.data.data
                })
            },
            getList() {
                this.loading = true;
                const params = {
                    "storehouseId": this.storehouseId,
                    ...this.form,
                    orderDay:[this.form.orderDay&&this.form.orderDay[0]?Utils.formatDate(this.form.orderDay[0], 'yyyy-MM-dd'):'', this.form.orderDay&&this.form.orderDay[1]?Utils.formatDate(this.form.orderDay[1], 'yyyy-MM-dd'):''],
                    orderDayStart: this.form.orderDay&&this.form.orderDay[0]?Utils.formatDate(this.form.orderDay[0], 'yyyy-MM-dd'):'',
                    orderDayEnd: this.form.orderDay&&this.form.orderDay[1]?Utils.formatDate(this.form.orderDay[1], 'yyyy-MM-dd'):''
                }
                console.log(params);
                stockInformList(params).then(res => {
                    this.loading = false;
                    this.tableData = res.data.stockInformDTOList || []
                    this.totalCount = res.data.pagination.total
                })
            }
        },
        created() {
            this.getStorehousesList()
            this.getList()
        },
        activated() {
            this.getList()
        }
    }
</script>

<style lang="scss" scoped>
    .stock-notice{
        margin-top: 8px;
    }
</style>