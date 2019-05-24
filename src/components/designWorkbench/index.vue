<template>
  <section class="design-workbench-index">
    <!-- 左侧检查必填的测弹窗 -->
    <transition name="right-move">
      <div class="check-detail" v-if="addDesignFileVisible">
        <!--<div class="mask" v-if="!item.required"></div>-->
        <div class="check-detail-item" style="padding-bottom: 12px;">检查项</div>
        <div
          class="check-detail-item"
          v-for="(item,index) in checkDetailList"
          :key="index">
          <div v-if="checkComponetList.indexOf(item.code)>-1">
            <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
            <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
          </div>
          <div
            :class="{'codeActive':checkCodeListData.indexOf(item.code)>-1}"
            @click="checkCodeListDataPush(item.code,row)"
            v-else
            style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</div>
          <div class="status">
            <icon
              style="margin-right: 4px;"
              w="20"
              h="20"
              :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
          </div>
        </div>
      </div>
    </transition>
    <page-title title="设计工作台"></page-title>
    <div class="main-content">
      <div class="node-menu">
        <ul>
          <li>
            <icon class="icon-workbench" type="icon-workbench"></icon>
            我的工作
          </li>
          <!--<li class="ellipsis" @click="showFile=true">设计档案</li>-->
          <li
            class="ellipsis"
            :title="item.name"
            v-for=" (item,index) in nodeList"
            :key="index"
            @click="filterParams.orderBy = 0;changeNode(index)"
            :class="{'active':currentNode.index== index}">{{item.name}}
          </li>
        </ul>
      </div>
      <div v-show="!showFile" class="detail">
        <plan-execute-work-panel :designPrcdNodeId="currentNode.id" config-code="design_style"></plan-execute-work-panel>

        <filter-form
          :checkDataList="checkDataList"
          :currentNode="currentNode"
          :workbenchStatusList="workbenchStatusList"
          ref="filterForm"
          :attrsData="attrsData"
          @on-filter="handleFilter">
        </filter-form>
        <div v-if="nodeList.length" style="margin-top:8px;">
          <nf-button
            v-if="['SUBMIT','TYPING','SAMPLE','LAST_REVIEW'].indexOf(currentNode.type)>-1"
            @click="beforeSetSubmitter"
            class="action-btn">
            {{currentNode.type==='SUBMIT'?'设置提报人':currentNode.type==='TYPING'?'分配版师':currentNode.type==='SAMPLE'?'分配样衣师':'设置可编辑人'}}
          </nf-button>
          <!-- <nf-button
            v-if="['SUBMIT','TYPING','SAMPLE','REVIEW'].indexOf(currentNode.type)>-1"
            @click="beforeSubmitNode"
            class="action-btn">{{currentNode.type==='REVIEW'?'评审通过':'提报'}}</nf-button>
          <nf-button
            :loading="btnLoading"
            @click="lastReviewShow"
            v-if="currentNode.type ==='LAST_REVIEW'"
            class="action-btn">通过</nf-button>
          <nf-button
            @click="beforeGeneralGoods(1)"
            v-if="currentNode.type ==='LAST_REVIEW'|| currentNode.type ==='REVIEW'"
            class="action-btn">生成商品</nf-button>
          <nf-button
            @click="beforeGeneralGoods(2)"
            v-if="currentNode.type ==='LAST_REVIEW'|| currentNode.type ==='REVIEW'"
            class="action-btn">更新商品</nf-button>

          <nf-button @click="beforeBackNode" class="action-btn">回退</nf-button> -->
          <nf-button
            v-if="['SUBMIT','TYPING','SAMPLE','REVIEW'].indexOf(currentNode.type)>-1"
            @click="beforeSubmitNode"
            class="action-btn">{{currentNode.type==='REVIEW'?'通过':'提报'}}</nf-button>
          <nf-button
            :loading="btnLoading"
            @click="lastReviewShow"
            v-if="currentNode.type ==='LAST_REVIEW'"
            class="action-btn">通过</nf-button>
          <nf-button
            @click="beforeGeneralGoods(1)"
            v-if="currentNode.type ==='LAST_REVIEW'|| currentNode.type ==='REVIEW'"
            class="action-btn">生成商品</nf-button>
          <nf-button
            @click="beforeGeneralGoods(2)"
            v-if="currentNode.type ==='LAST_REVIEW'|| currentNode.type ==='REVIEW'"
            class="action-btn">更新商品</nf-button>
          <nf-button
            @click="handleReview"
            v-if="currentNode.type ==='REVIEW'"
            class="action-btn">评审</nf-button>

          <nf-button @click="beforeBackNode" class="action-btn">回退</nf-button>
          <nf-button
            @click="beforeEliminate"
            v-if="['REVIEW','LAST_REVIEW'].indexOf(currentNode.type)>-1"
            class="action-btn">淘汰</nf-button>
          <nf-button
            @click="beforeRegain"
            v-if="['REVIEW','LAST_REVIEW'].indexOf(currentNode.type)>-1"
            class="action-btn">恢复</nf-button>
        </div>
        <div style="min-height: 192px;margin-top: 8px" v-loading="loading">
          <el-table
            v-show="!loading"
            class="custom-table"
            @sort-change="sortChange"
            :data="workbenchList"
            border
            @select="select"
            @select-all="selectAll"
            :key="currentNode.type"
            :row-class-name="tableRowClassName"
            style="width: 100%">
            <el-table-column type="selection" min-width="55">
            </el-table-column>
            <el-table-column
              :prop="item.code"
              :sortable="['商品款号','设计款号','商品名称','上节点提报/被驳回'].indexOf(item.name) > -1?'custom':false"
              v-for="item in titleShowConfig"
              :key="item.name"
              min-width="160"
              :label="item.name">
              <template slot-scope="scope">
                <div v-if="item.name === '商品状态'">
                  <div>{{scope.row.goodsStatus.split('\n')[0]}}</div>
                  <div>{{scope.row.goodsStatus.split('\n')[1]}}</div>
                </div>
                <div v-else-if="item.name === '检查项'">
                  <div style="display: flex;align-items: center;">{{scope.row.alreadyRequiredNum}}/{{scope.row.requiredNum}}
                    <icon
                      @click="showCheckDetail(scope.row)"
                      style="cursor: pointer !important;margin-left: 4px;"
                      w="12"
                      h="12"
                      type="icon-details"></icon>
                  </div>
                </div>
                <div v-else-if="item.name === '提报人'">
                  <div>
                    <span v-for="(item,index) in scope.row.submitters" :key="index">{{item.name}}{{index !== scope.row.submitters.length-1?'、':'' }}</span>
                  </div>
                </div>
                <div v-else-if="item.name === '设计状态'">
                  <span :class="{'blue':scope.row.designStyleStatus==0,'red':scope.row.designStyleStatus==1,'green':scope.row.designStyleStatus==2}">{{scope.row.designStyleStatus===0?'设计中':scope.row.designStyleStatus===1?'已淘汰':scope.row.designStyleStatus===2?'已完成':'草稿'}}</span>
                </div>
                <div v-else-if="item.name === '难度'">
                  <div v-if="scope.row.difficultyDegree" class="text-center">
                    <span >{{scope.row.difficultyDegree}}</span>
                    <icon
                      @click="beforeEditDiffculty(scope.row)"
                      class="pointer"
                      style="color:#808080;width:14px;height:14px;margin-right:4px;"
                      type="icon-edit"></icon>
                  </div>
                </div>
                <div v-else-if="item.name==='设计图'">
                  <img @click="handlePreviewImg(scope.row.designPictures)" v-errorlogo v-if="scope.row.designPictures&&scope.row.designPictures.length" class="design-img"  :src="scope.row.designPictures[0]"/>
                  <div v-else>
                    <div v-if="scope.row.designStyleStatus === 1">点击上传</div>
                    <div v-else>
                      <input type="file" style="display: none;" :ref="`file-upload1${scope.$index}`"
                                                       accept="image/png,image/jpeg,image/jpg,image/gif" @change="imgUpload($event,scope.row,'designPics')">
                      <label class="upload-file blue pointer" @click="beforeUpload(scope.$index,'designPics')">点击上传</label>
                    </div>
                  </div>
                </div>
                <div v-else-if="item.name==='样衣图'">
                  <img @click="handlePreviewImg(scope.row.samplePictures)" v-errorlogo v-if="(scope.row.samplePictures&&scope.row.samplePictures.length&&scope.row.samplePictures[0])" class="design-img"  :src="scope.row.samplePictures[0]"/>
                  <div v-else>
                    <div v-if="scope.row.designStyleStatus === 1">点击上传</div>
                    <div v-else>
                      <input type="file" style="display: none;" :ref="`file-upload2${scope.$index}`"
                                                       accept="image/png,image/jpeg,image/jpg,image/gif" @change="imgUpload($event,scope.row,'samplePics')">
                      <label class="upload-file blue pointer" @click="beforeUpload(scope.$index,'samplePics')" >点击上传</label>
                    </div>
                  </div>
                </div>
                <div v-else-if="item.name==='打版文件'">
                  <div v-if="scope.row.typingFileName">{{scope.row.typingFileName}}</div>
                  <div v-else>
                    <input type="file" style="display: none;" :ref="`file-upload3${scope.$index}`"
                                                   @change="imgUpload($event,scope.row,'typingFile')">
                    <label class="upload-file blue pointer" @click="beforeUpload(scope.$index,'typingFile')">点击上传</label>
                  </div>
                </div>
                <div v-else-if="item.name === '商品描述'">
                  <span v-html="scope.row.styleDesc"></span>
                </div>
                <div v-else-if="item.name==='评审意见'">
                  <div
                    class='pointer'
                    v-if="scope.row.reviewLog"
                    @click="handleClickLog(scope.row,scope.$index)">{{scope.row.reviewLog}}</div>
                  <div v-else>
                    <div v-if="scope.row.designStyleStatus === 1">点击录入</div>
                    <div
                      v-else
                      class="blue pointer"
                      @click="handleClickLog(scope.row,scope.$index)">点击录入</div>
                  </div>
                </div>
                <div v-else-if="item.name==='上节点提报/被驳回'">
                  <div v-if="scope.row.lastStatus">
                    <p>{{scope.row.lastUpdater}}[{{scope.row.lastStatus===1?'上节点提报':'驳回:'+scope.row.backRemark}}]</p>
                    <p>{{scope.row.lastUpdated}}</p>
                  </div>
                </div>
                <div v-else-if="item.name==='评审人'">
                  <div v-if="scope.row.reviewersText">
                    <div v-for="(reviewItem,index) in scope.row.reviewersText" :key="index">
                      {{reviewItem.userName}}:<span :style="{color:reviewItem.reviewStatus==1?'green':reviewItem.reviewStatus==2?'red':''}">{{reviewItem.reviewText}}</span>
                    </div>
                  </div>
                </div>
                <!--表头要改-->
                <div v-else-if="['本节点提报','打版提报','样衣提报','通过'].indexOf(item.name)>-1">
                  <div>{{scope.row.thisMissionCompleteName}}</div>
                  <div>{{scope.row.dateComplete}}</div>
                </div>
                <div v-else-if="item.code&&item.code.indexOf('customField_')>-1">
                  <div>{{scope.row.customFields[item.id]?scope.row.customFields[item.id].cloumnText:''}}</div>
                </div>
                <div v-else>
                  <span>{{scope.row[item.code]}}</span>
                </div>

              </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--width="168"-->
            <!--prop="dateComplete"-->
            <!--:label="submitTimeLabel">-->
            <!--<template slot-scope="scope">-->
            <!--<div>{{scope.row.thisMissionCompleteName}}</div>-->
            <!--<div>{{scope.row.dateComplete}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->

            <!---->
            <!--<el-table-column-->
            <!--label="上节点提报"-->
            <!--width="168">-->
            <!--<template slot-scope="scope">-->
            <!--<div>{{scope.row.lastMissionCompleteName}}</div>-->
            <!--<div>{{scope.row.lastMissionDate}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
            <!--v-if="['REVIEW','SUBMIT','TYPING','SAMPLE'].indexOf(currentNode.type)>-1"-->
            <!--label="被驳回"-->
            <!--width="168">-->
            <!--<template slot-scope="scope" v-if="scope.row.backName">-->
            <!--<div>{{scope.row.backName}}:{{scope.row.backRemark}}</div>-->
            <!--<div>{{scope.row.backDate}}</div>-->
            <!--</template>-->
            <!--</el-table-column>-->

            <el-table-column
              class-name="opera-area"
              prop="missionPrcdNodeId"
              fixed="right"
              label="操作"
              width="130"
              align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.designStyleStatus === 1">编辑</div>

                <el-dropdown v-else>
                  <div style="width: 44px !important;font-size: 12px" class="blue pointer">编辑</div>
                  <el-dropdown-menu slot="dropdown" v-if="scope.row.designStyleStatus !== 1&&scope.row.fieldConfig.kinds&&scope.row.fieldConfig.kinds.length > 0">
                    <el-dropdown-item
                      class="fs12"
                      v-for="(item,index) in scope.row.fieldConfig.kinds"
                      :key="index"
                      @click.native="editOpenDialog(item, scope.row)">{{kindsMap[item]}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <div class="blue pointer" @click="goDetail(scope.row)">设计档案</div>
                <!--<div class="blue" @click="">节点详情</div>-->
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div class="text-right pdtb15 ">
            <el-pagination
              :total="totalCount"
              @current-change="loadingMore"
              :page-size="20"
              layout="total, prev, pager, next">
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-if="showFile" style="overflow-y: auto">
        <design-file></design-file>
      </div>
    </div>
    <nf-previewer
      ref="previewer"
      value="path"
      :list="previewList">
    </nf-previewer>
    <!--回退弹出框-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog back-node-dialog"
      title="回退"
      :visible.sync="backNode.visible"
      size="tiny">
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item
              required
              label="回退原因"
              label-width="80px">
              <el-input
                type="textarea"
                :rows="4"
                :maxlength="50"
                resize="none"
                placeholder="请填写回退原因"
                v-model.trim="backNode.message">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              required
              label="回退节点"
              label-width="80px">
              <el-select v-model="backNode.nodeId" placeholder="请选择">
                <el-option
                  v-for="(item,index) in backNode.options"
                  :key="item.id"
                  :label="`${item.name}${index==0&&item.id!='designFile'?'(上节点)':''}`"
                  :value="item.id">
                  <div>{{item.name}}<span style="color: #aaa">{{index==0&&item.id!='designFile'?'(上节点)':''}}</span></div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p class="text-center pdt15" style="color: red">确认回退后，此设计档案将流转到回退节点</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backNode.visible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmBackNode">确定</el-button>
      </div>
    </el-dialog>
    <!--回退提醒弹出框-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog back-node-dialog"
      title="回退"
      :visible.sync="backNode.warning"
      size="tiny">
      <div style="text-align: center;">
        <i class="el-icon-warning" style="color: red;font-size: 80px;margin-bottom: 10px;"></i>
        <p>回退到设计档案将丢失工序模板信息，需重新进行提报是否确认回退？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backNode.warning = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmBackNode">确定</el-button>
      </div>
    </el-dialog>
    <!--设置提报人弹出框-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog set-submit-person-dialog"
      title="设置提报人"
      :visible.sync="setSubmitter.visible"
      size="tiny">
      <el-form>
        <el-form-item
          required
          label="提报人"
          label-width="80px">
          <v-user-select
            v-model="setSubmitter.submitterIds "
            :options="setSubmitter.groupOptions"
            @remote="fetchUnitUser"
            placeholder="请选择提报人"></v-user-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setSubmitter.visible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmSetSubmitter">确定</el-button>
      </div>
    </el-dialog>
    <!--是否覆盖已有的提报人弹窗提示-->
    <el-dialog
      class="custom-dialog tip-dialog is-cover-submitter-dialog"
      :visible.sync="setSubmitterIsCover"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p v-if="currentNode.type==='SUBMIT'" class="tip-text">您勾选的数据中存在已分配提报人的设计单，继续提交的话会将这些设计单的提报人重新分配为当前所选人员，是否继续？</p>
        <p v-if="currentNode.type==='TYPING'" class="tip-text">您勾选的数据中存在已分配版师的设计单，继续提交的话会将这些设计单的版师重新分配为当前所选人员，是否继续?</p>
        <p v-if="currentNode.type==='SAMPLE'" class="tip-text">您勾选的数据中存在已分配样衣师的设计单，继续提交的话会将这些设计单的样衣师重新分配为当前所选人员，是否继续？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setSubmitterIsCover = false">取 消</el-button>
        <el-button type="primary" @click="confirmCoverSubmitter">确认</el-button>
      </div>
    </el-dialog>
    <!--是否提报弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog is-submit-dialog"
      :visible.sync="submitNodeVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p v-if="currentNode.type ==='REVIEW'" class="tip-text">是否将勾中的设计档案通过评审？</p>
        <p v-else class="tip-text">是否确认提报所有已勾选的设计档案？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitNodeVisible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmSubmitNode">确认</el-button>
      </div>
    </el-dialog>

    <!--淘汰弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog is-submit-dialog"
      :visible.sync="eliminateVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">是否要将选中的设计档案全部淘汰？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="eliminateVisible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmEliminate">确认</el-button>
      </div>
    </el-dialog>
    <!--恢复弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog is-submit-dialog"
      :visible.sync="regainVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">是否要恢复选中的设计档案？</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="regainVisible = false">取 消</el-button>
        <el-button
          :loading="isSubmitting"
          type="primary"
          @click="confirmRegain">确认</el-button>
      </div>
    </el-dialog>
    <!--生成商品弹窗-->
    <general-goods
      :updateGoodsType="updateGoodsType"
      ref="generalGoods"
      v-if="generalGoods.visible"
      @designWorkbenchUpdateNode="designWorkbenchUpdateNode"
      from="designWorkbench"
      @updateNode="updateNode"
      @updateEditDesignFile="updateEditDesignFile"
      :dialogVisible.sync="generalGoods.visible"
      :missionPrcd="generalGoods.missionPrcd">
    </general-goods>
    <!--编辑难度系数-->
    <set-submitter-difficulty
      :designPrcdNodeId="currentNode.id"
      @setSubmitterSuccess="setSubmitterSuccess"
      :visible.sync="setSubmitterDiffcultyVisible"
      :nodeType="currentNode.type"
      :missionPrcdNodeIds="missionPrcdNodeIds">
    </set-submitter-difficulty>
    <!-- 修改难度弹窗 -->
    <difficulty-config
      :designStyleId="editDiffculty.styleId"
      :designPrcdNodeId="currentNode.id"
      @setSubmitterSuccess="setSubmitterSuccess"
      :visible.sync="editDiffculty.visible"
      :nodeType="currentNode.type"
      :missionPrcdNodeId="nodeId">
    </difficulty-config>

    <!-- 侧弹窗 -->
    <transition name="right-move">
      <component
        :is="currentTabComponent"
        v-if="addDesignFileVisible"
        :show.sync="addDesignFileVisible"
        @success="getDesignOrderList"
        :isEdit="isEdit"
        :designStyleId="designStyleId"
        :title="bomTitle"
        :styleId="styleId"
        @updateGoodsGo="updateGoodsType='editDesignFile';generalGoods.visible=true"
        :designPrcdNodeId="designPrcdNodeId"
        :goodsStatus="goodsStatus"
        from="designWorkbench"
        :designId="designStyleId"
        :checkDetailLists="checkDetailLists"
        :type="type"
        :designList="designList"
        :nodeId="currentNode.id"
        :checkCodeListData="checkCodeListData"
        ref="currentComponentForCheck"
        @cancel="changeArtList"
        @toggle="changeArtList"
        :artData.sync='artData'
        :editId="editId"
        :sampleId="sampleId"
        :designNo="designStyleNo">
      </component>
    </transition>
    <transition name="opcity">
      <div
        style="z-index:10 !important;"
        class="cover"
        v-if="addDesignFileVisible"
        @click="addDesignFileVisible = false">
      </div>
    </transition>
    <!-- 编辑列表弹窗 -->
    <el-dialog
      class="tip-dialog edit-dialog"
      :visible.sync="editListShow"
      :show-close="false"
      width="50%"
      :modal-append-to-body="false">
      <div slot="title">{{editTitle}}</div>
      <ul class="content" v-if="selectType != 'attachment'&&selectType != 'planCostAccounting'">
        <li @click="selectEditDiolog('add')">+新建</li>
        <li v-for="(item,index) in list" :key="index">
          <div>{{item.name}}</div>
          <div @click="selectEditDiolog('edit', item)">
            <icon type="icon-edit"></icon>编辑
          </div>
        </li>
      </ul>
      <div v-else>
        <patternTable
          v-if="selectType === 'attachment'"
          :dialogVisiblePMFile.sync="dialogVisiblePMFile"
          :dialogVisibleDelete.sync="dialogVisibleDelete"
          :loading="fileLoading"
          :tableData="list"
          @commit="uploadPMFile"
          :deleteFileId.sync="deleteFileId"
          :reUploadFile.sync="reUploadFile"></patternTable>
        <costAccounting
          @rowDelete="rowDelete"
          @rowSampleSetDefault="rowSampleSetDefault"
          @dialogOperationUpdatePrice="dialogOperationUpdatePrice"
          @dialogOperation="isUpdateDefaultVisible=false"
          ref="costAccountingRef"
          v-if="selectType === 'planCostAccounting'"
          :designId="designStyleId"></costAccounting>
        <!-- 左侧检查必填的测弹窗 -->
        <transition name="right-move">
          <div class="check-detail" style="left: -150px;">
            <!--<div class="mask" v-if="!item.required"></div>-->
            <div class="check-detail-item" style="padding-bottom: 12px;">检查项</div>
            <div
              class="check-detail-item"
              v-for="(item,index) in checkDetailList"
              :key="index">
              <div v-if="checkComponetList.indexOf(item.code)>-1">
                <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
                <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
              </div>
              <div
                :class="{'codeActive':checkCodeListData.indexOf(item.code)>-1}"
                @click="checkCodeListDataPush(item.code,row)"
                v-else
                style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</div>
              <div class="status">
                <icon
                  style="margin-right: 4px;"
                  w="20"
                  h="20"
                  :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </el-dialog>
    <!-- 上传图片 -->
    <!-- <p-m-file-upload
            @commit="uploadPMFile"
            :dialogVisiblePMFile.sync="dialogVisiblePMFile"
        ></p-m-file-upload> -->
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="dialogVisibleDelete"
      :before-close="handleClose">
      <span>确定要删除文件？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleDelete = false">取 消</el-button>
                <el-button type="primary" @click="deletePMFile">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 终审/评审意见 -->
    <review-opinions-dialog
      v-if="reviewOpinions.visible"
      :nodeType="currentNode.type"
      :missionPrcdNodeId="reviewOpinions.missionPrcdNodeId"
      :visible.sync="reviewOpinions.visible"
      :designStyleId="reviewOpinions.designStyleId"
      @hideDialog="hideReviewOpinionsDialog">
    </review-opinions-dialog>
    <!--配置可编辑字段提示弹窗-->
    <el-dialog
      class="custom-dialog tip-dialog is-submit-dialog"
      :visible.sync="designFieldVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="56"
          h="56"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text">有未填写的必填信息，无法提报！请完善设计档案。</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="designFieldVisible = false">好 的</el-button>
      </div>
    </el-dialog>
    <!--检查项详情-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog check-detail-dialog"
      title="检查项详情"
      :visible.sync="checkDetailVisible"
      size="tiny">
      <div
        class="check-detail-dialog__body"
        v-for="(item,index) in checkDetailList"
        :key="index">
        <!--<div class="mask" v-if="!item.required"></div>-->
        <!--<div>-->
        <span v-if="checkComponetList.indexOf(item.code)>-1" >
                       <span style="display: inline-block;width: 100px;">{{item.attrName}}</span>
        <span @click="notDesignEditOpenDialog(item.code, row)" style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">编辑</span>
        </span>
        <span @click="designEditOpenDialog(item.code, row)" v-else style="cursor: pointer;font-size: 12px;color: #1CA1FF;text-decoration: underline;display:inline-block;border:none;padding:0;">{{item.attrName}}</span>
        <span class="status">
                        <icon
                          style="margin-right: 4px;"
                          w="20"
                          h="20"
                          :type="item.required?'icon-check-circle':'icon-close-circle'"></icon>
                    </span>
        <!--</div>-->
      </div>
      <div slot="footer">
        <el-button type="primary" @click="checkDetailVisible = false">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--侧滑窗数据改变弹窗-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog"
      :show-close="false"
      :visible.sync="checkCodeDataChangeDialog"
      size="tiny">
      <div class="dialog-content-wrap">
        <div style="text-align: center;">
          <icon
            w="80"
            h="80"
            type="icon-gongdan-jiedianjingbao-da"></icon>
          <p style="margin-top: 10px;">是否要保存当前修改的信息？</p>
        </div>

      </div>
      <div slot="footer">
        <nf-button @click="cancelUpdateCheckData">取 消</nf-button>
        <nf-button type="warning" @click="sureUpdateCheckData">确 定</nf-button>
      </div>
    </el-dialog>

    <!--评审弹窗-->
    <el-dialog
      :modal-append-to-body="false"
      class="custom-dialog check-detail-dialog"
      title="评审"
      :visible.sync="reviewBean.visible"
      size="tiny">
      <div>
        <div style="margin-bottom: 10px;">
          <el-radio
            class="radio"
            v-model="reviewBean.radio"
            label="1">评审同意</el-radio>
          <el-radio
            class="radio"
            v-model="reviewBean.radio"
            label="2">评审不同意</el-radio>
        </div>
        <span><span style="color: red">*</span>评审意见:</span>
        <el-input
          style="margin-top: 5px;"
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model.trim="reviewBean.opinion">
        </el-input>
      </div>
      <div slot="footer">
        <el-button @click="reviewBean.visible = false">取 消
        </el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="reviewConfirm">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--终审弹窗-->
    <el-dialog
      class="custom-dialog check-detail-dialog"
      title="通过"
      :visible.sync="lastReviewDialog">
      <div style="margin-bottom: 8px;">
        <i style="color: red;font-size: 14px;" class="el-icon-warning"></i>
        <span>通过不会自动生成商品！</span>
      </div>
      <el-table
        v-loading="lastReviewDialogLoading"
        border
        :data="selectData"
        style="width: 100%;font-size: 12px;">
        <el-table-column prop="goodsStatus" label="商品状态">
          <template slot-scope="scope">
            <div :class="[{'red':scope.row.goodsStatus==='未生成商品'},{'green':scope.row.goodsStatus!=='未生成商品'}]">{{scope.row.goodsStatus.split('\n')[0]}}</div>
            <div>{{scope.row.goodsStatus.split('\n')[1]}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="designStyleNo" label="设计款号">
        </el-table-column>
        <el-table-column prop="styleName" label="商品名称">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="blue pointer" @click="beforeGeneralGoods(0,scope.$index)">{{scope.row.goodsStatus==='未生成商品'?'生成商品':'更新商品'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="lastReviewDialog = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="lastReviewPass">通过</el-button>
      </div>
    </el-dialog>
    <!--通过设计档案并且自动生产商品档案或者更新对应商品档案-->
    <el-dialog
      class="custom-dialog last-review-and-update-goods text-center"
      title="通过设计档案"
      :visible.sync="lastReviewAndUpdateGoods.visible">
      <div style="line-height: 20px">
        <div v-show="!lastReviewAndUpdateGoods.successRequest&&!lastReviewAndUpdateGoods.isSubmitting">
          <div style="margin-bottom: 8px;">
            <i style="color: red;font-size: 40px;" class="el-icon-warning"></i>
          </div>
          <div>设计档案通过后会自动生成商品档案或更新对应商品档案，是否确认通过选中的设计档案。</div>
        </div>
        <div v-show="lastReviewAndUpdateGoods.isSubmitting">
          <div v-loading="lastReviewAndUpdateGoods.isSubmitting" style="height: 150px;width: 100%"></div>
          <div>正在生成和更新商品档案</div>
        </div>
        <div v-show="lastReviewAndUpdateGoods.successRequest&&!lastReviewAndUpdateGoods.isSubmitting">
          <div class="pdb8">{{lastReviewAndUpdateGoods.successNum}}条设计档案已通过，{{lastReviewAndUpdateGoods.faithNum}}条设计档案通过失败</div>
          <div @click="downloadUpdateGoodsFailure" class="blue pointer">下载结果列表</div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="lastReviewAndUpdateGoods.visible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="lastReviewAndUpdateGoods.isSubmitting"
          @click="lastReviewPassAndUpdateGoods">确定</el-button>
      </div>
    </el-dialog>
    <!-- 设为默认窗口 -->
    <el-dialog
      class="custom-dialog"
      :title="dialogTitle"
      :visible.sync="isUpdateDefaultVisible"
      :show-close="false"
      :close-on-click-modal="false"
      size="tiny">
      <div class="text-center">
        <icon
          w="80"
          h="80"
          type="icon-gongdan-jiedianjingbao-da"></icon>
        <p class="tip-text" style="margin-top: 10px;">{{dialogText}}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="dialogType !== 'updatePrice'">
          <el-button @click="isUpdateDefaultVisible = false">取 消</el-button>
          <el-button type="primary" @click="$refs['costAccountingRef'].dialogSureGo()">确认</el-button>
        </div>
        <div v-if="dialogType === 'updatePrice'">
          <el-button @click="isUpdateDefaultVisible = false;$refs['costAccountingRef'].getList()">不更新</el-button>
          <el-button type="primary" @click="$refs['costAccountingRef'].dialogSureUpdateGo">更新</el-button>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
const _env = process.env.NODE_ENV === "production" ? "pro" : "dev";
import md5 from "js-md5";
import config from "@/config/index";

import {
  getFacUnitSettings,
  getUnitUser,
  designstyleListEdit,
  patternMakingUpdate,
  patternMakingDelete,
  patternMakingUpload,
  getUploadToken,
  upDetailImgs,
  sampleCreatePicture,
  getCheckData,
  getRequiredDetail,
  getMisssionRequiredDetail,
  getTitleShowConfig,
  getStationGroup,
  getBackList,
  addDesignPicture
} from '@/api';
import {
  designWorkbenchNodeList,
  designWorkbenchNode,
  designWorkbenchNodeStatusList,
  designWorkbenchBackNode,
  designWorkbenchSetSubmitter,
  designWorkbenchNodePass,
  designWorkbenchListEliminate,
  designWorkbenchListRegain,
  missionWorkspacePass,
  designWorkbenchUpdateDifficulty,
  getNodeDesignDialogFields,
  bathLastReviewPassAndUpdateGoods,
  designWorkbenchReviewOpninoinsUpdate,
  bathLastReviewPassAndUpdateGoodsFailList
} from '@/api/sample-centre';
import FilterForm from './filter-form';
import {
  sampleList
} from '@/api/api'
import TemplateCreateTable from "../sampleCentre/design/template-create-table";
import SetSubmitterDifficulty from "@/components/designWorkbench/set-submitter-difficulty/index";
import GeneralGoods from "@/components/designWorkbench/general-goods/index";
import CreateDesignFile from '@/components/designFile/designFileInfo/create-design-file.vue';
import selectDesignDialog from '@/components/designFile/designFileInfo/selectDesignDialog'
import CreateBomTable from "@/components/goods/goodsBom/CreateBomTable.vue";
import addClothes from '@/components/designFile/clothesFile/addClothes'
import addArt from '@/components/designFile/technicsInfo/addArt'
import procedureCreate from '@/components/designFile/procedure/create'
import patternTable from '@/components/designFile/patternMakingFile/components/patternTable'
import PMFileUpload from '@/components/designFile/patternMakingFile/components/PMFileUpload'
import ReviewOpinionsDialog from "@/components/designWorkbench/review-opinions/index"
import designFile from "@/components/designFile/designFileInfo"
import costAccounting from "@/components/designFile/costAccounting"
import difficultyConfig from "@/components/designWorkbench/difficulty-config"
import PlanExecuteWorkPanel from "@/components/goodsPlan/procurementPlan/list/components/planExecuteWorkPanel.vue";

export default {
  name: "designWorkbenchIndex",
  components: {
    TemplateCreateTable,
    FilterForm,
    SetSubmitterDifficulty,
    GeneralGoods,
    CreateDesignFile,
    selectDesignDialog,
    CreateBomTable, // bom
    addClothes, // 样衣
    addArt, // 工艺
    procedureCreate, // 工序
    patternTable, // 打版文件
    costAccounting, // 计划核算
    PMFileUpload,
    ReviewOpinionsDialog,
    designFile,
    difficultyConfig, //修改难度
    PlanExecuteWorkPanel, // 企划执行看板
  },
  data() {
    return {
      reviewBean: {
        radio: '1',
        visible: false,
        opinion: ''
      },
      updateGoodsType: '',
      sampleSetDefaultId: '',
      sampleSetDefaultName: '',
      dialogType: '',
      dialogTitle: '',
      dialogText: '',
      isUpdateDefaultVisible: false,

      positionCode: '',
      currentTabComponentNotClose: '',
      willGoType: '',
      willGoRow: {},
      checkCodeDataChangeDialog: false,
      addDesignFileVisibleAttachment: false,
      checkCodeListData: [], //检查项点击列表
      editOpenDialogCode: '',
      checkComponetList: ['bom', 'typing_file', 'sample_info', 'process_form', 'default_prcd_template', 'planCostAccounting'], //检查项是BOM 打板文件 样衣信息 工艺信息 工序模板时

      titleShowConfig: [], //表头列表
      checkDataList: [], //检查项列表
      checkDetailList: [], //检查项详情列表
      showFile: false,
      loading: false,
      attrsData: {}, // 货品属性数据
      selectPersonList: [],
      nodeList: [{
        name: "设计档案",
      }], // 左侧节点菜单栏数据
      currentNode: { //左侧菜单栏当前选中的节点
        index: 0,
        type: '',
        id: ''
      },
      workbenchStatusList: [],
      pageNo: 1,
      totalCount: 0,
      workbenchList: [],
      previewList: [], //图片预览
      backNode: { //回退弹窗相关变量
        visible: false,
        warning: false,
        message: '',
        nodeId: '',
        options: [],
      },
      isSaving: false,
      selectData: [], // 表格选中的行数据
      submitTimeLabel: '', // 提报时间列名
      submitStatusLabel: '', //提报状态列名
      setSubmitter: { // 设置提报人
        visible: false,
        submitterIds: [],
        groupOptions: '', //提交人下拉列表
      },
      missionPrcdNodeIds: [], //表格中选中的节点id
      designStyleIds: [], //表格中选中选中的设计档案id
      submitNodeVisible: false, //节点提报是否可见
      setSubmitterDiffcultyVisible: false, // 分配版师、样衣师是否可见
      setSubmitterIsCover: false, // 设置提报人、版师、样式师时，提示是否覆盖
      isSubmitting: false,
      eliminateVisible: false, //淘汰弹窗
      regainVisible: false, //恢复弹窗
      // 编辑难度系数相关变量
      editDiffculty: {
        visible: false,
        designStyleId: '', //要修改难度系数的设计档案id
        difficultyList: [],
      },
      // 生成商品相关变量
      generalGoods: {
        visible: false,
        missionPrcd: {}
      },
      kindsMap: {
        0: '编辑设计信息',
        1: '编辑BOM表',
        2: '编辑打版文件',
        3: '编辑样衣档案',
        4: '编辑工艺信息',
        5: '编辑工序模板',
      },
      currentTabComponent: '',
      addDesignFileVisible: false,
      isEdit: false, //是否编辑
      designStyleId: '',
      designPrcdNodeId: '',
      goodsStatus: '', //是否生成商品
      designList: {}, // 工作台编辑的时候
      dialogVisiblePMFile: false,
      dialogVisibleDelete: false,
      deleteFileId: '',
      reUploadFile: '',
      fileLoading: false,
      editListShow: false,
      row: {},
      designStyleNo: '',
      type: '', //bom编辑的标示
      selectType: '', // 选择到那个模板
      selectTypeMap: {
        0: 'design',
        1: 'bom',
        2: 'attachment',
        3: 'sample',
        4: 'pdf',
        5: 'template',
        // 0 设计信息 1 BOM表 2 打版文件 3 样衣档案 4 工艺信息 5 工序模板
      },
      reviewOpinions: {
        visible: false,
        missionPrcdNodeId: '',
        currentIndex: '',
        designStyleId: ''
      },
      designFieldVisible: false, //配置可编辑字段提示弹窗
      checkDetailVisible: false, //检查项详情弹窗
      nodeId: '',
      checkDetailLists: [],
      lastReviewDialog: false,
      lastReviewDialogLoading: false,
      btnLoading: false,
      filterParams: {
        orderBy: 0
      },
      lastReviewAndUpdateGoods: {
        visible: false,
        isSubmitting: false,
        successRequest: false, //已经成功发出请求，成功发出请求后再次点击确定按钮不再请求，直接关闭按钮
        failureId: '', ////失败的id（用于导出excel用）
        successNum: '', //成功条数
        faithNum: '', //失败条数
      }
    }
  },
  computed: {

    // 计算属性
    userId() {
      return JSON.parse(sessionStorage.getItem("user_login")).userId;
    },
    facId() {
      return JSON.parse(sessionStorage.getItem("user_login")).unitId;
    },
    unitId() {
      return JSON.parse(sessionStorage.getItem('last_login')).id
    },
    isWorkBench() {
      return this.$route.path == '/designWorkbench'
    },
    groupId() {
      let groupId = ''
      for (let i = 0; i < this.setSubmitter.groupOptions.length; i++) {
        if (this.setSubmitter.groupOptions[i].facUserDTOS.some(item => item.userId === this.userId)) {
          groupId = this.setSubmitter.groupOptions[i].groupId;
          break;
        }
      }
      return groupId
    }
  },
  watch: {
    'addDesignFileVisible'(val) {
      if (val) {
        this.checkDetailVisible = false
        this.addDesignFileVisibleAttachment = false;
        this.editListShow = false
      } else {
        this.currentTabComponent = '';
        this.checkCodeListData = [];
      }
    },
    'reviewBean.visible'(v) {
      if (!v) {
        this.reviewBean.radio = '1';
        this.reviewBean.opinion = ''
      }
    },
    'backNode.visible'(v) {
      if (!v) {
        this.backNode.message = '';
        this.backNode.nodeId = '';
      } else {
        // 发请求取下拉
        getBackList({
          designStyleId: this.selectData[0].designStyleId,
          missionPrcdNodeId: this.selectData[0].missionPrcdNodeId
        }).then(res => {
          if (res.data.code == 0) {
            res.data.data.push({
              id: 'designFile',
              name: '设计档案'
            })
            this.backNode.options = res.data.data || []
            this.backNode.nodeId = this.backNode.options[0].id
          }
        })
      }
    }
  },
  methods: {
    reviewConfirm() {
      if (this.reviewBean.opinion === '') {
        return this.$message.error('请输入评审意见')
      }
      this.btnLoading = true
      let params = {
        message: this.reviewBean.opinion,
        missionPrcdNodeId: this.selectData.map(v => v.missionPrcdNodeId),
        userId: this.userId,
        reviewStatus: this.reviewBean.radio
      }
      designWorkbenchReviewOpninoinsUpdate(params).then(res => {
        this.btnLoading = false
        if (res.data.code == 0) {
          this.$message.success('评审成功')
          this.getDesignOrderList()
          this.reviewBean.visible = false
        } else {
          this.$message.error(res.data.msg)
        }
      })

    },
    //点击评审按钮
    handleReview() {
      if (!this.selectData.length) {
        return this.$message.error('请选择设计档案')
      }
      if (this.selectData.some(v => v.status !== 0)) {
        return this.$message.error('请选择待处理的设计档案！')
      }
      if (!this.selectData.every(v => v.reviewers.some(_v => _v.id === this.userId))) {
        return this.$message.error('只有评审人可进行评审')
      }

      this.reviewBean.visible = true
    },
    designWorkbenchUpdateNode() {
      //更新商品档案
      this.$refs['currentComponentForCheck'].goodsDesignstyleUpdate()
    },
    //计划核算子组件触发事件
    rowDelete(row) {
      this.isUpdateDefaultVisible = true;
      this.dialogType = 'delete';
      this.dialogTitle = '删除核算单';
      this.dialogText = '是否确认删除该核算单' + row.name;
    },
    dialogOperationUpdatePrice(name) {
      this.dialogType = 'updatePrice';
      this.dialogTitle = '更新成本信息';
      this.dialogText = '是否将' + name + '的总成本，更新到设计档案的计划成本价？';
    },
    rowSampleSetDefault(id, name) {
      this.isUpdateDefaultVisible = true;
      this.sampleSetDefaultId = id;
      this.sampleSetDefaultName = name;
      this.dialogType = 'default';
      this.dialogTitle = '设为默认';
      this.dialogText = '是否将' + name + '设置为默认核算单？';
    },
    sortChange(obj) {
      console.log(obj);
      //obj.order  ascending descending  goodsStyleNo goodsName
      if (obj.prop == 'designStyleNo') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 1
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 4
        }
      } else if (obj.prop == 'styleName') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 2
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 5
        }
      } else if (obj.prop == 'styleNo') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 3
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 6
        }
      } else if (obj.prop == 'lastMissionCompleteName') {
        if (obj.order == 'ascending') {
          this.filterParams.orderBy = 8
        } else if (obj.order == 'descending') {
          this.filterParams.orderBy = 7
        }
      } else {
        this.filterParams.orderBy = 0
      }
      this.getDesignOrderList()

    },
    // 获取配置提报必填字段
    async getRequiredDetail(id) {
      return new Promise((resolve,reject)=>{
        let params = {
          prcdNodeId: id,
          unitId: this.facId
        }
        getCheckData(params).then(res => {
          this.checkDetailLists = res.data.data
          resolve()
        })
      })
      
    },
    updateEditDesignFile() {
      if (this.updateGoodsType === 'editDesignFile') {
        this.$refs.currentComponentForCheck.goodsDesignstyleUpdate().then(res => {
          if (res) {
            this.$refs.generalGoods.updateGoodsPriceGo()
          }
        })

      }
    },
    //更新节点信息
    updateNode(designStyleId) {

      if (!this.lastReviewDialog) {
        this.changeNode(this.currentNode.index, 'noChangeFilter')
      } else {
        this.lastReviewDialogLoading = true
        designWorkbenchNode({
          designStyleId,
          userId: this.userId,
          unitId: this.unitId,
          designPrcdNodeId: this.currentNode.id
        }).then(res => {
          this.lastReviewDialogLoading = false
          if (res.data.code == 0) {
            const index = this.workbenchList.findIndex(v => res.data.data.list[0].designStyleId === v.designStyleId)
            const selectDataIndex = this.selectData.findIndex(v => res.data.data.list[0].designStyleId === v.designStyleId)
            if (index !== -1 && selectDataIndex !== -1) {
              this.$set(this.workbenchList, index, res.data.data.list[0])
              this.$set(this.selectData, selectDataIndex, res.data.data.list[0])
            }
          }
        })
      }
    },
    // 获取左侧节点菜单
    async getNodeList() {
      return new Promise((resolve,reject)=>{
        let params = {
          userId: this.userId,
          unitId: this.unitId
        }
        designWorkbenchNodeList(params).then(res => {
          if (res.data.code === 0) {
            // this.nodeList = res.data.data
            this.nodeList.push(...res.data.data)
            resolve()
          }
        })
      })
      
    },
    // 切换节点
    async changeNode(index, type) {
      // console.log('触发changeNode',index,type)
      // if(index>0 || !this.powerJudgement.permissions("fac.spl.design.style.view")){
      if (index > 0) {
        this.showFile = false
      } else {
        this.showFile = true
      }
      if (this.nodeList.length > 0) {
        this.currentNode.index = index
        this.currentNode.type = this.nodeList[index].nodeType
        this.currentNode.id = this.nodeList[index].designPrcdNodeId
      }
      this.submitTimeLabel = this.getSubmitTimeLabel()
      this.submitStatusLabel = this.getSubmitStatusLabel()

      // 切换节点时，清除原来表格选中的行
      this.selectData = []
      this.missionPrcdNodeIds = []
      this.designStyleIds = []
      if (this.$refs.filterForm && type !== 'noChangeFilter') {
        //切换节点时清空筛选区
        this.$refs.filterForm.reset()
      }
      // 获取提报状态（先获取，因为要设置默认选中）
      if (type !== 'noChangeFilter') {
        await this.getWorkbenchStatusList()

      }
      if (['LAST_REVIEW', 'TYPING', 'SAMPLE', 'SUBMIT'].indexOf(this.currentNode.type) > -1) {
        this.getCheckDataList(this.currentNode.id)
      } else {
        this.getCheckDataList()
      }
      // 获取提报必填项
      await this.getRequiredDetail(this.currentNode.id)
      // 获取列表数据(模拟点击筛选)
      if (this.$refs.filterForm) {
        //切换节点时清空筛选区
        this.$refs.filterForm.submit()
      }
    },
    // 获取工单列表数据
    async getDesignOrderList() {
      if (!this.currentNode.id) return //我的工作台左侧列表选中非设计档案才触发
      this.loading = true
      let params = {
        userId: this.userId,
        unitId: this.unitId,
        designPrcdNodeId: this.currentNode.id,
        ...this.filterParams,
        pageSize: 20,
        pageNo: this.pageNo
      }
      await designWorkbenchNode(params).then(res => {
        this.loading = false
        if (res.data.code === 0) {
          console.log(res, '工作台列表')

          let tempList = res.data.data.list
          tempList.forEach(item => {
            let customFieldsObj = {}
            item.customFields.forEach(customItem => {
              customItem.cloumnText = ''
              if (customItem.customFieldType === 'TEXT') {
                customItem.cloumnText = customItem.textValue
              } else if (['SINGLE_SELECT', 'MULTI_SELECT'].includes(customItem.customFieldType)) {
                customItem.cloumnText = customItem.selectedOptions && customItem.selectedOptions.length > 0 ?
                  customItem.selectedOptions.map(selectedItem => selectedItem.optionName).join('、') : ''
              } else if (['INTEGER', 'DECIMAL'].includes(customItem.customFieldType)) {
                customItem.cloumnText = customItem.numberValue
              }
              customFieldsObj[customItem.customFieldId] = customItem
            })
            item.customFields = customFieldsObj
          })

          this.workbenchList = tempList
          this.totalCount = res.data.data.totalCount
          // 清空原来选中的表格行、设计档案id（原来选中的设计档案）
          this.selectData = []
          this.missionPrcdNodeIds = []
          this.designStyleIds = []
        }
      });
      //设计档案没有currentNode.id，不请求
      if (this.currentNode.id) {
        await getTitleShowConfig({
          userId: this.userId,
          splDesignPrcdNodeId: this.currentNode.id
        }).then(res => {
          if (res.data.code === 0) {
            this.titleShowConfig = res.data.data.config
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
      console.log(this.setSubmitter.groupOptions);
      //配置了分组的就只会出现提报人分组
      await getStationGroup({
        designPrcdNodeId: this.currentNode.id
      }).then(res => {
        if (res.data.code === 0 && res.data.data && res.data.data.length) {
          this.setSubmitter.groupOptions = this.setSubmitter.groupOptions.filter(item => {
            return res.data.data.map($item => $item.id).indexOf(item.groupId) !== -1
          })

        }

      });
      this.$refs['filterForm'].selectPersonList = this.setSubmitter.groupOptions
      // console.log(this.setSubmitter.groupOptions);
    },
    loadingMore(page) {
      this.pageNo = page
      this.getDesignOrderList()
    },
    // 设置表格行样式
    tableRowClassName(row, index) {
      if (row.designStyleStatus === 1) {
        return 'gray';
      }
      return '';
    },
    // 获取商品属性是否要保存当
    fetchFacUnitSettings() {
      const params = {
        facId: this.facId,
        type: 'all'
      };
      getFacUnitSettings(params)
        .then(res => {
          this.attrsData = res.data.data;
        });
    },
    // 获取负责人列表
    fetchUnitUser(keyword = '') {
      getUnitUser({
        keyword,
        unitId: JSON.parse(sessionStorage.getItem('user_login')).unitId,
      }).then(res => {
        if (!res.data.data.facGroupDTOS) {
          return;
        }
        this.setSubmitter.groupOptions = res.data.data.facGroupDTOS;
      });
    },
    handleFilter(filterData) {
      this.filterParams = { ...filterData,
        orderBy: this.filterParams.orderBy
      }
      console.log(this.filterParams, '筛选区参数')

      this.getDesignOrderList()
    },
    // 获取工作台节点状态列表
    async getWorkbenchStatusList() {
      //设计档案不用获取筛选组件的下拉列表
      if (!this.currentNode.id) {
        return
      }
      let params = {
        designPrcdNodeId: this.currentNode.id
      }
      await designWorkbenchNodeStatusList(params).then(res => {
        if (res.data.code === 0) {
          this.workbenchStatusList = res.data.data
          // if(this.currentNode.type !== 'LAST_REVIEW'&&this.workbenchStatusList.length){
          if (this.workbenchStatusList.length) {
            let defaultItem = this.workbenchStatusList.find(item => item.defaultSelect == true)
            this.currentNode.submitStatus = defaultItem.value
            console.log(defaultItem.value, '提报状态默认值')
          }
        }
      })
    },
    // 获取提报状态对应的列名
    getSubmitStatusLabel() {
      let statusLabel = ''
      switch (this.currentNode.type) {
        case 'SUBMIT':
          statusLabel = '提报状态';
          break;
        case 'TYPING':
          statusLabel = '打版状态';
          break;
        case 'SAMPLE':
          statusLabel = '样衣状态';
          break;
        case 'REVIEW':
          statusLabel = '评审状态';
          break;
        case 'LAST_REVIEW':
          statusLabel = '状态';
          break;
      }
      console.log(statusLabel)
      return statusLabel
    },
    // 获取提报时间对应的列名
    getSubmitTimeLabel() {
      let statusLabel = ''
      switch (this.currentNode.type) {
        case 'SUBMIT':
          statusLabel = '本节点提报';
          break;
        case 'TYPING':
          statusLabel = '打版提报';
          break;
        case 'SAMPLE':
          statusLabel = '样衣提报';
          break;
        case 'REVIEW':
          statusLabel = '评审通过';
          break;
        case 'LAST_REVIEW':
          statusLabel = '通过';
          break;
      }
      return statusLabel
    },
    // 预览图片
    handlePreviewImg(imgList) {
      this.previewList = imgList.map(item => {
        return {
          path: item
        }
      });
      this.$nextTick(() => {
        this.$refs["previewer"].show(0);
      });
    },
    // 勾选表格行
    select(selection, row) {
      this.selectData = selection
      this.missionPrcdNodeIds = []
      this.designStyleIds = []
      this.selectData.forEach(item => {
        this.missionPrcdNodeIds.push(item.missionPrcdNodeId)
        this.designStyleIds.push(item.designStyleId)
      })
    },
    //全选表格行
    selectAll(selection) {
      this.selectData = selection
      this.missionPrcdNodeIds = []
      this.designStyleIds = []
      this.selectData.forEach(item => {
        this.missionPrcdNodeIds.push(item.missionPrcdNodeId)
        this.designStyleIds.push(item.designStyleId)
      })
    },
    // 回退节点前检查
    beforeBackNode() {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.doBack")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }

      if (this.selectData.length != 1) {
        return this.$message.error('每次只能回退一个档案')
      }

      if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || v.submitters.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
        return this.$message.error(`只有负责人${this.currentNode.type === 'SUBMIT'?'或提报人':this.currentNode.type === 'SAMPLE'?'或样衣师':this.currentNode.type === 'TYPING'?'或版师':''}才可进行此操作`)
      }

      // 检查是否有已回退的数据
      let hasReported // 是否存在已提报设计档案
      if (this.currentNode.type != 'LAST_REVIEW') {
        hasReported = this.selectData.some(item => item.status != 0) // 判断是否存在已回退的数据
      } else {
        hasReported = this.selectData.some(item => item.designStyleStatus != 0) // 判断是否存在已回退的数据
      }
      // 检查能否发起回退操作
      if (hasReported) {
        let errorText = '请选择未提报的设计档案'
        switch (this.currentNode.type) {
          case 'REVIEW':
            errorText = '请选择待评审的设计档案！';
            break;
          case 'LAST_REVIEW':
            errorText = '请选择设计中的设计档案！';
            break;
        }
        this.$message.error(errorText)
        return
      } else {
        this.backNode.visible = true
      }
    },
    // 回退节点
    confirmBackNode() {

      if (!this.backNode.message) {
        return this.$message.error('请填写回退原因')
      }
      if (!this.backNode.nodeId) {
        return this.$message.error('请选择回退节点')
      }
      if (this.backNode.nodeId == 'designFile' && !this.backNode.warning) {
        this.backNode.warning = true
        return
      }
      let params = {
        userId: this.userId,
        message: this.backNode.message,
        missionPrcdNodeIds: this.missionPrcdNodeIds,
        backMissionPrcdNodeId: this.backNode.nodeId
      }
      this.isSubmitting = true
      designWorkbenchBackNode(params).then(res => {
        console.log(res, '回退节点')
        if (res.data.code === 0) {
          this.isSubmitting = false
          this.backNode.visible = false
          this.backNode.warning = false
          this.backNode.message = ''
          this.getDesignOrderList()
          this.$message.success('回退成功')
        } else {
          this.$message.error(this.data.message)
        }
      })
    },
    // 批量设置提报人、版师、样衣师前检查
    beforeSetSubmitter() {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.setSubmitter")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }
      let hasSomeSubmitter = false
      hasSomeSubmitter = this.selectData.some(item => item.submitters.length != 0) // 判断是否存在已经设置提报人的数据
      if (hasSomeSubmitter) {
        this.setSubmitterIsCover = true
        return
      }
      if (this.currentNode.type === 'SUBMIT' || this.currentNode.type === 'LAST_REVIEW') {
        this.setSubmitter.visible = true
      }
      if (this.currentNode.type === 'TYPING' || this.currentNode.type === 'SAMPLE') {
        this.setSubmitterDiffcultyVisible = true
      }
    },
    // 单个设置提报人前检查
    singleSetSubmitter(row) {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.setSubmitter")) {
        return
      }

      this.missionPrcdNodeIds = [row.missionPrcdNodeId]
      if (this.currentNode.type === 'SUBMIT' || this.currentNode.type === 'LAST_REVIEW') {
        this.setSubmitter.visible = true
      }
      if (this.currentNode.type === 'TYPING' || this.currentNode.type === 'SAMPLE') {
        this.setSubmitterDiffcultyVisible = true
      }
    },
    // 设置提报人
    confirmSetSubmitter() {
      if (!this.setSubmitter.submitterIds.length) {
        this.$message.error('请选择提报人')
        return
      }
      if (this.setSubmitter.submitterIds.length > 1) {
        this.$message.error('提报人只能选择1个')
        return
      }
      let params = {
        userId: this.userId,
        submitterIds: this.setSubmitter.submitterIds,
        missionPrcdNodeIds: this.missionPrcdNodeIds
      }
      this.isSubmitting = true
      designWorkbenchSetSubmitter(params).then(res => {
        if (res.data.code === 0) {
          this.isSubmitting = false
          this.setSubmitter.visible = false
          this.setSubmitter.submitterIds = []
          this.getDesignOrderList()
          this.$message.success('设置成功')
        } else {
          this.$message.error(this.data.message)
        }
      })
    },
    // 确定要覆盖已有提报人
    confirmCoverSubmitter() {
      this.setSubmitterIsCover = false

      if (this.currentNode.type === 'SUBMIT' || this.currentNode.type === 'LAST_REVIEW') {
        this.setSubmitter.visible = true
      }
      if (this.currentNode.type === 'TYPING' || this.currentNode.type === 'SAMPLE') {
        this.setSubmitterDiffcultyVisible = true
      }
    },
    // 提报前检查
    beforeSubmitNode() {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.doPass")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }
      if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || v.submitters.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
        return this.$message.error(`只有负责人${this.currentNode.type === 'SUBMIT'?'或提报人':this.currentNode.type === 'SAMPLE'?'或样衣师':this.currentNode.type === 'TYPING'?'或版师':''}才可进行此操作`)
      }

      if (!this.selectData.every(v => !v.reviewersText || v.reviewersText.every(item => item.reviewStatus == 1))) {
        return this.$message.error('操作失败，设计档案未评审同意')
      }

      let hasReported = this.selectData.some(item => item.status != 0) // 是否存在已提报设计档案
      // 检查能否发起回退操作
      if (hasReported) {
        let errorText = this.currentNode.type === 'REVIEW' ? '请选择待评审的设计档案' : '请选择未提报的设计档案'
        this.$message.error(errorText)
        return
      } else {
        this.submitNodeVisible = true
      }
    },
    // 确定提报
    confirmSubmitNode() {
      let params = {
        userId: this.userId,
        missionPrcdNodeIds: this.missionPrcdNodeIds,
        designStyleIds: this.designStyleIds
      }
      this.isSubmitting = true
      designWorkbenchNodePass(params).then(res => {
        if (res.data.code === 0) {
          this.isSubmitting = false;
          this.submitNodeVisible = false;
          this.getDesignOrderList();
          this.$message.success('提报成功')
        } else {
          this.isSubmitting = false;
          this.submitNodeVisible = false;
          this.designFieldVisible = true;
        }
      })
    },
    // 设置版师、样式师成功（带难度系数）
    setSubmitterSuccess() {
      this.getDesignOrderList()
      this.setSubmitterDiffcultyVisible = false
    },
    //淘汰设计单前检查
    beforeEliminate() {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.eliminate")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }
      if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
        return this.$message.error('只有负责人才可进行此操作')
      }
      let hasSomeSubmitter = false
      // 判断是否存在不是设计中或者未提报的设计档案
      hasSomeSubmitter = this.selectData.some(item => item.designStyleStatus != 0 && item.designStyleStatus != 3)
      if (hasSomeSubmitter) {
        this.$message.error('请选择还未淘汰或未完成的设计档案！')
        return
      } else {
        this.eliminateVisible = true
      }
    },
    // 确定淘汰
    confirmEliminate() {
      let styleIds = []
      this.selectData.forEach(item => {
        styleIds.push(item.designStyleId)
      })
      let params = {
        styleIds: styleIds
      }
      this.isSubmitting = true
      designWorkbenchListEliminate(params).then(res => {
        if (res.data.code === 0) {
          this.isSubmitting = false
          this.eliminateVisible = false
          this.getDesignOrderList()
          this.$message.success('淘汰成功')
        } else {
          this.$message.error(this.data.message)
        }
      })
    },
    //恢复设计档案前检查
    beforeRegain() {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.style.regain")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }
      if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
        return this.$message.error('只有负责人才可进行此操作')
      }
      let hasSomeSubmitter = false
      // 判断是否存在不是已淘汰的设计档案
      hasSomeSubmitter = this.selectData.some(item => item.designStyleStatus != 1) // 判断是否存在已经设置提报人的数据
      if (hasSomeSubmitter) {
        this.$message.error('请选择已淘汰的设计档案！')
        return
      } else {
        this.regainVisible = true
      }
    },
    // 确定恢复
    confirmRegain() {
      let styleIds = []
      this.selectData.forEach(item => {
        styleIds.push(item.designStyleId)
      })
      let params = {
        styleIds: styleIds
      }
      this.isSubmitting = true
      designWorkbenchListRegain(params).then(res => {
        if (res.data.code === 0) {
          this.isSubmitting = false
          this.regainVisible = false
          this.getDesignOrderList()
          this.$message.success('恢复成功')
        } else {
          this.$message.error(this.data.message)
        }
      })
    },
    handleDiffcultyBlur(diffculty) {
      let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
      if (diffculty !== "" && !pattern.test(diffculty)) {
        this.$message.error('难度系数最多只能输入3位小数');
        return
      }
    },
    // 修改难度系数前检查
    beforeEditDiffculty(item) {
      // 权限检查 missionPrcdNodeId
      // return
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.setSubmitter")) {
        return
      }
      this.editDiffculty.styleId = item.designStyleId
      this.editDiffculty.difficultyList = item.difficultyList
      this.editDiffculty.difficultyList.forEach(item => {
        item.newDifficulty = ''
        item.newReason = ''
      })

      this.nodeId = item.missionPrcdNodeId
      this.editDiffculty.visible = true

      // this.editInfo = item.difficultyList
    },
    // 确定修改难度系数
    confirmEditDiffculty() {
      let pattern = /^([1-9]\d{0,11})(\.\d{1,3})?$|^0(\.\d{1,3})?$/;
      for (let i = 0; i < this.editDiffculty.difficultyList.length; i++) {
        let item = this.editDiffculty.difficultyList[i]
        if (!item.newDifficulty) {
          this.$message.error('请输入要修改的难度系数')
          return
        }
        if (item.newDifficulty !== "" && !pattern.test(item.newDifficulty)) {
          this.$message.error('难度系数最多只能输入3位小数');
          return
        }

        if (!item.newReason) {
          this.$message.error('请输入原因')
          return
        }
      }

      let difficultyList = []
      this.editDiffculty.difficultyList.forEach(item => {
        difficultyList.push({
          id: item.id,
          reason: item.newReason,
          difficulty: item.newDifficulty,
        })
      })
      let params = {
        type: this.currentNode.type === 'TYPING' ? 0 : 1,
        difficultyList: difficultyList
      }
      this.isSubmitting = true
      designWorkbenchUpdateDifficulty(params).then(res => {
        if (res.data.code === 0) {
          this.isSubmitting = false
          this.getDesignOrderList()
          this.editDiffculty.visible = false
          this.$message.success('修改成功')
        } else {
          this.$message.error(this.data.msg)
        }
      })
    },
    //生成商品前检查
    beforeGeneralGoods(type, index) {
      // 权限问题
      if (!this.powerJudgement.permissions("fac.spl.design.mission.node.generate") && type == 1) {
        return
      }
      if (!this.powerJudgement.permissions("fac.spl.design.mission.node.updateGenerate") && type == 2) {
        return
      }

      if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
        return this.$message.error('只有负责人才可进行此操作')
      }

      if (!this.selectData.every(v => !v.reviewersText || v.reviewersText.every(item => item.reviewStatus == 1))) {
        return this.$message.error('操作失败，设计档案未评审同意')
      }
      // type  1 生成 2更新 0 终审弹窗里面
      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }
      if (this.selectData.length > 1 && !this.lastReviewDialog) {
        this.$message.error(`只能选择1个设计档案${type==1?'生成':'更新'}商品`)
        return
      }
      if (type == 1) {
        if (this.selectData.some(v => v.goodsStatus !== '未生成商品')) {
          return this.$message.error('请选择未生成商品的设计档案！')
        }
      }
      if (type == 2) {
        if (this.selectData.some(v => v.goodsStatus === '未生成商品')) {
          return this.$message.error('该设计档案还未生成商品，无法更新！')
        }
      }

      this.generalGoods.missionPrcd = this.selectData[index || 0]
      this.generalGoods.missionPrcd.prcdNodeId = this.currentNode.id
      this.generalGoods.visible = true
    },
    //通过
    lastReviewShow() {
      console.log(this.selectData, 3678)
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.doPass")) {
        return
      }

      if (!this.selectData.length) {
        this.$message.error('请选择设计档案')
        return
      }

      if (this.selectData.some(v => v.status !== 0)) {
        return this.$message.error('请选择未处理的设计档案！')
      }
        if (!this.selectData.every(v => v.missionChargers.some(_v => _v.id === this.userId) || v.submitters.some(_v => _v.id === this.userId) || this.groupId === v.groupId || v.chargers.some(_v => _v.id === this.userId))) {
            return this.$message.error(`只有负责人${this.currentNode.type === 'SUBMIT'?'或提报人':this.currentNode.type === 'SAMPLE'?'或样衣师':this.currentNode.type === 'TYPING'?'或版师':''}才可进行此操作`)
        }
      // 检查该设计节点的"配置生成商品默认字段"弹窗 有没有选中通过后自动生成/更新商品档案的对应字段
      let params = {
        prcdNodeId: this.currentNode.id,
        type: 2
      };
      this.btnLoading = true
      getNodeDesignDialogFields(params).then(res => {
        this.btnLoading = false
        if (res.data.code == 0) {
          if (res.data.data.some(item => item.fieldId == 0)) {
            this.lastReviewAndUpdateGoods.visible = true
            this.lastReviewAndUpdateGoods.successRequest = false
            this.lastReviewAndUpdateGoods.successNum = ""
            this.lastReviewAndUpdateGoods.faithNum = ""
            this.lastReviewAndUpdateGoods.failureId = ""
          } else {
            // 没有选中，弹出可以手动生产/更新 商品的弹窗
            this.lastReviewDialog = true;
          }
        }
      })

    },
    lastReviewPassAndUpdateGoods() {
      if (this.lastReviewAndUpdateGoods.successRequest) {
        this.lastReviewAndUpdateGoods.visible = false
      } else {
        let filterParams = JSON.parse(JSON.stringify(this.filterParams))
        filterParams.designStyleNos = []
        let missionPrcdNodeIds = []

        this.selectData.forEach(item => {
          missionPrcdNodeIds.push(item.missionPrcdNodeId)
          filterParams.designStyleNos.push(item.designStyleNo)
        })
        let params = {
          userId: this.userId,
          unitId: this.unitId,
          designPrcdNodeId: this.currentNode.id,
          missionPrcdNodeIds: missionPrcdNodeIds,
          ...filterParams
        }
        this.lastReviewAndUpdateGoods.isSubmitting = true
        bathLastReviewPassAndUpdateGoods(params).then(res => {
          if (res.data.code == 0) {
            this.lastReviewAndUpdateGoods.isSubmitting = false
            this.lastReviewAndUpdateGoods.successRequest = true
            this.lastReviewAndUpdateGoods.successNum = res.data.data.successNum
            this.lastReviewAndUpdateGoods.faithNum = res.data.data.faithNum
            this.lastReviewAndUpdateGoods.failureId = res.data.data.failureId
            this.getDesignOrderList()
          } else {
            this.lastReviewAndUpdateGoods.visible = false
            this.$message.error(res.data.msg)
          }
        })
      }

    },
    // 下载点击"通过"，然后生成或更新商品结果的列表
    downloadUpdateGoodsFailure() {
      let params = {
        failureId: this.lastReviewAndUpdateGoods.failureId
      }
      bathLastReviewPassAndUpdateGoodsFailList(params).then(res => {
        let url = window.URL.createObjectURL(res.data);
        let a = window.document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `生成或更新商品结果的列表.xls`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
    },
    lastReviewPass() {
      this.btnLoading = true
      let missionPrcdNodeIds = []
      let designStyleIds = []
      this.selectData.forEach(item => {
        missionPrcdNodeIds.push(item.missionPrcdNodeId)
        designStyleIds.push(item.designStyleId)
      })
      let params = {
        userId: JSON.parse(sessionStorage.getItem('user_login')).userId,
        missionPrcdNodeIds,
        designStyleIds,
      }
      missionWorkspacePass(params).then(res => {
        this.btnLoading = false
        if (res.data.code === 0) {
          this.lastReviewDialog = false;
          // 加载完左侧列表后，模拟点击第一个菜单
          this.changeNode(this.currentNode.index)
          this.$message.success('已通过')
        } else {
          this.$message.error(res.data.msg)
        }

      })
    },
    // 取消弹窗
    cancel(res) {
      this.addDesignFileVisible = res;
      this.getDesignOrderList()
    },
    // 打版文件 上传和删除
    uploadPMFile(fileList) {
      let params = {
        fileFullName: fileList[0].fileFullName,
        fileName: fileList[0].fileName,
        path: fileList[0].filePath,
        suffix: fileList[0].suffix,
      }
      if (this.reUploadFile) {
        params.id = this.reUploadFile.id
        params.fileCode = this.reUploadFile.fileCode
        params.version = this.reUploadFile.version
      } else {
        params.designStyleId = this.row.designStyleId
      }
      params.userId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId
      if (this.reUploadFile) {
        patternMakingUpdate(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            // this.getList()
            this.designstyleListEdit('attachment', this.row)
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }

        })
      } else {
        patternMakingUpload(params).then(res => {
          this.reUploadFile = ''
          this.deleteFileId = ''
          if (res.data.code === 0) {
            this.designstyleListEdit('attachment', this.row)
            this.$message.info(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    deletePMFile() {
      patternMakingDelete(this.deleteFileId).then(res => {
        this.dialogVisibleDelete = false
        this.reUploadFile = ''
        this.deleteFileId = ''
        if (res.data.code === 0) {
          this.designstyleListEdit('attachment', this.row)
          this.$message.info(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //取消更新
    cancelUpdateCheckData() {
      this.checkCodeDataChangeDialog = false;
      this.editOpenDialog(this.willGoType, this.willGoRow)
    },
    //确定更新
    async sureUpdateCheckData() {
      let value = false;
      this.checkCodeDataChangeDialog = false;
      //更新检查项
      if (this.currentTabComponent === 'CreateBomTable') {
        //bom表确定更新
        value = await this.$refs['currentComponentForCheck'].determine();

      } else if (this.currentTabComponent === 'addArt') {
        //工艺单确定更新
        value = await this.$refs['currentComponentForCheck'].updateCommonProcessForm();

      } else if (this.currentTabComponent === 'addClothes') {
        //样衣
        value = await this.$refs['currentComponentForCheck'].updateCommonProcessForm();
      } else if (this.currentTabComponent === 'procedureCreate') {
        //工序模板
        value = await this.$refs['currentComponentForCheck'].submit();
      } else if (this.currentTabComponent === 'CreateDesignFile') {
        //设计档案
        value = await this.$refs['currentComponentForCheck'].addFile(0);
      }
      if (!value) return;
      if (this.willGoType === 'attachment') {
        this.addDesignFileVisibleAttachment = true;
      }
      this.editOpenDialog(this.willGoType, this.willGoRow)
    },
    // 编辑
    async notDesignEditOpenDialog(type, row) {

      if (type === 'planCostAccounting') {
        this.selectType = 'planCostAccounting'
        this.editTitle = `编辑【${row.designStyleNo}】计划成本核算`
        this.editListShow = true
        this.designStyleId = row.designStyleId
        return
      }
      switch (type) {
        case 'typing_file':
          type = 'attachment';
          break;
        case 'sample_info':
          type = 'sample';
          break;
        case 'process_form':
          type = 'pdf';
          break;
        case 'default_prcd_template':
          type = 'template';
          break;

      }

      if ((this.currentTabComponent === 'CreateDesignFile' && type !== 'attachment') || (type !== 'bom' && this.currentTabComponent === 'CreateBomTable') || (type !== 'sample' && this.currentTabComponent === 'addClothes') || (type !== 'pdf' && this.currentTabComponent === 'addArt') || (type !== 'template' && this.currentTabComponent === 'procedureCreate')) {
        //侧滑窗离开bom
        let flag = await this.$refs['currentComponentForCheck'].checkIsChange();
        console.log(flag);
        if (!flag) {
          //数值没改变过
          this.editOpenDialog(type, row)
        } else {
          this.willGoType = type;
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
        }

      } else if ((type === 'bom' && this.currentTabComponent === 'CreateBomTable') || (type === 'sample' && this.currentTabComponent === 'addClothes') || (type === 'pdf' && this.currentTabComponent === 'addArt') || (type === 'template' && this.currentTabComponent === 'procedureCreate')) {
        //点击相同侧滑窗
        return
      } else {
        //第一次进入侧滑窗
        this.editOpenDialog(type, row)
      }

    },
    //设计信息点击
    designEditOpenDialog(code, row) {

      // this.editOpenDialogCode = code
      this.checkCodeListData.push(code)
      this.positionCode = code;
      this.editOpenDialog('design', row)
    },
    //设计信息点击（切换
    async checkCodeListDataPush(code, row) {
      if (this.checkCodeListData.indexOf(code) === -1) {
        this.checkCodeListData.push(code)
      }
      this.positionCode = code;

      if (this.editListShow && this.selectType === 'attachment') {
        this.editOpenDialog('design', row)
        return
      }

      if (this.currentTabComponent !== 'CreateDesignFile') {
        //侧滑窗切换到CreateDesignFile
        let flag = await this.$refs['currentComponentForCheck'].checkIsChange();
        console.log(flag);
        if (!flag) {
          //数值没改变过
          this.currentTabComponent = 'CreateDesignFile'
          this.$nextTick(function () {
            this.$refs['currentComponentForCheck'].goPosition(this.positionCode);

          })
        } else {
          this.willGoType = 'design';
          this.willGoRow = row;
          this.checkCodeDataChangeDialog = true
        }
      } else {
        this.$refs['currentComponentForCheck'].goPosition(code);
      }
    },
    // 编辑侧弹窗
    async editOpenDialog(type, row) {
      //获取检查项
      await this.showCheckDetail(row, true)
      // console.log('gzt');
      if (this.selectTypeMap[type]) {
        type = this.selectTypeMap[type]
      }
      if (type != 'design') {
        await this.designstyleListEdit(type, row)
      }
      if (type == 'design') {
        // 权限
        if (!this.powerJudgement.permissions("fac.spl.design.style.edit")) {
          return
        }
        this.isEdit = true
        this.addDesignFileVisible = true
        this.generalGoods.missionPrcd = row
        this.generalGoods.missionPrcd.prcdNodeId = this.currentNode.id
        this.currentTabComponent = 'CreateDesignFile'
        this.$nextTick(function () {
          this.$refs['currentComponentForCheck'].goPosition(this.positionCode);

        })
        this.designPrcdNodeId = row.designPrcdNodeId;
        this.goodsStatus = row.goodsStatus !== '未生成商品';
        this.designStyleId = row.designStyleId
        let designList = {}
        // console.log(row.fieldConfig)
        if (row.fieldConfig.designInfoFields && row.fieldConfig.designInfoFields.length > 0) {
          row.fieldConfig.designInfoFields.forEach((i, index) => {
            designList[i.fieldCode] = index + 1
          })
          this.designList = designList
          // console.log(this.designList, 'designList')
        }

        // console.log(this.designStyleId, 'this.designStyleId')
      }
    },
    // 获取编辑列表
    designstyleListEdit(type, row) {
      this.row = row
      let params = {
        userId: this.userId,
        type: type,
        designStyleId: row.designStyleId
      }
      this.fileLoading = true
      designstyleListEdit(params).then(res => {
        this.list = res.data.data
        this.designStyleId = row.designStyleId
        if (type == 'attachment') {
          // 权限
          if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.list")) {
            return
          }
          this.selectType = type
          this.editTitle = `编辑【${row.designStyleNo}】打版文件`
          this.editListShow = true
        } else {
          if (this.list.length == 0) {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")) {
                  return
                }
                this.bomTitle = '新建BOM表'
                this.styleId = '2c1f2e0fd03448ea8a9a86d5d7984f1f'
                this.type = ''
                this.currentTabComponent = 'CreateBomTable'
                break;
              case 'sample':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
                  return
                }
                this.artData = {}
                this.designStyleNo = row.designStyleNo
                this.sampleId = ''
                this.currentTabComponent = 'addClothes'
                break;
              case 'pdf':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.add")) {
                  return
                }
                this.artData = {}
                this.styleId = this.designStyleId
                this.currentTabComponent = 'addArt'
                break;
              case 'template':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.add")) {
                  return
                }
                this.editId = ''
                this.currentTabComponent = 'procedureCreate'
                break;
            }
            this.addDesignFileVisible = true
          } else if (this.list.length == 1) {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
                  return
                }
                this.bomTitle = '编辑BOM表'
                this.type = 'editor1'
                this.editId = this.list[0].id
                this.styleId = this.designStyleId
                this.currentTabComponent = 'CreateBomTable'
                break;
              case 'sample':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
                  return
                }
                this.sampleId = this.list[0].id
                this.designStyleNo = this.list[0].name
                this.styleId = this.designStyleId
                this.currentTabComponent = 'addClothes'
                break;
              case 'pdf':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
                  return
                }
                this.artData = {
                  id: this.list[0].id
                }
                this.currentTabComponent = 'addArt'
                break;
              case 'template':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
                  return
                }
                this.editId = this.list[0].id
                this.currentTabComponent = 'procedureCreate'
                break;
            }
            this.addDesignFileVisible = true
          } else {
            switch (type) {
              case 'bom':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】BOM表`
                break;
              case 'sample':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
                  return
                }
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】样衣档案`
                break;
              case 'pdf':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】工艺单信息`
                break;
              case 'template':
                // 权限
                if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
                  return
                }
                this.editTitle = `编辑【${row.designStyleNo}】工序模板`
                break;
            }
            this.selectType = type
            this.editListShow = true
          }
        }
        this.fileLoading = false
      })
    },
    // 弹窗的新建、编辑
    selectEditDiolog(status, row) {
      if (status == 'add') {
        switch (this.selectType) {
          case 'bom':
            // 权限
            if (!this.powerJudgement.permissions("fac.goods.bom.add") || !this.powerJudgement.permissions("fac.spl.design.style.bom.add")) {
              return
            }
            this.bomTitle = '新建BOM表'
            this.styleId = '2c1f2e0fd03448ea8a9a86d5d7984f1f'
            this.type = ''
            this.currentTabComponent = 'CreateBomTable'
            break;
          case 'sample':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
              return
            }
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
              return
            }
            this.artData = {}
            this.sampleId = ''
            this.designStyleNo = this.row.designStyleNo
            this.currentTabComponent = 'addClothes'
            break;
          case 'pdf':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.process.add")) {
              return
            }
            this.artData = {}
            this.styleId = this.designStyleId
            this.currentTabComponent = 'addArt'
            break;
          case 'template':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.template.add")) {
              return
            }
            this.editId = ''
            this.currentTabComponent = 'procedureCreate'
            break;
        }
        this.addDesignFileVisible = true
      } else {
        switch (this.selectType) {
          case 'bom':
            if (!this.powerJudgement.permissions("fac.spl.design.style.bom.edit")) {
              return
            }
            this.bomTitle = '编辑BOM表'
            this.type = 'editor1'
            this.editId = row.id
            this.styleId = this.designStyleId
            this.currentTabComponent = 'CreateBomTable'
            break;
          case 'sample':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.sample.edit") && !this.isWorkBench) {
              return
            }
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.edit") && this.isWorkBench) {
              return
            }
            this.sampleId = row.id
            this.designStyleNo = row.designStyleNo
            this.styleId = this.designStyleId
            this.currentTabComponent = 'addClothes'
            break;
          case 'pdf':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.process.edit")) {
              return
            }
            this.artData = {
              id: row.id
            }
            this.currentTabComponent = 'addArt'
            break;
          case 'template':
            // 权限
            if (!this.powerJudgement.permissions("fac.spl.design.style.template.edit")) {
              return
            }
            this.editId = row.id
            this.currentTabComponent = 'procedureCreate'
            break;
        }
        this.addDesignFileVisible = true
      }
      this.editListShow = false
    },
    changeArtList() {
      this.addDesignFileVisible = !this.addDesignFileVisible
      this.getDesignOrderList()
    },
    //查看设计详情
    goDetail(val) {
      // 权限
      if (!this.powerJudgement.permissions("fac.spl.design.style.view")) {
        return
      }
      this.$store.dispatch('setDesignStyleNo', val.designStyleNo);
      sessionStorage.setItem("setDesignStyleNo", val.designStyleNo);

      this.$router.push(`/designFile/designFileDetail?designStyleId=${val.designStyleId}&isWorkBench=1`)
    },
    imgUpload(e, row, type) {
      let params = {
        appId: this.$globalConfig.appId.appId
      };
      const file = e.target.files[0];
      if (file.size > 5000000) {
        this.$message({
          showClose: true,
          message: "图片大小超过5M!,重新上传",
          type: "error",
        });
        return false;
      }
      getUploadToken(params).then(res => {
        var params2 = new FormData();
        params2.append("file", file);
        params2.append("token", res.data.uptoken);
        params2.append("key", this.setImgKey(file.name));
        upDetailImgs(params2, {}).then(result => {
          const _imgUrl =
            config.qiniu.baseUrl + result.data.key + "?attname=" + file.name;
          // row.push(_imgUrl)
          // 设计稿
          if (type == 'designPics') {
            let params = {
              designStyleId: row.designStyleId,
              path: _imgUrl
            }
            addDesignPicture(params).then(res => {
              if (res.data.code == 0) {
                if (!row.designPictures) {
                  row.designPictures = []
                }
                row.designPictures.push(_imgUrl)
                this.$message.success(' 上传成功')
              }

            })
          }
          // 样衣图
          else if (type == 'samplePics') {
            let params = {
              userId: this.userId,
              unitId: this.facId,
              designNo: row.designStyleNo,
              designId: row.designStyleId,
              picturePath: _imgUrl
            }
            sampleCreatePicture(params).then(res => {
              if (res.data.code == 0) {
                if (!row.samplePictures) {
                  row.samplePictures = []
                }
                row.samplePictures.push(_imgUrl)
                this.$message.success(' 上传成功')
              }

            })
          }
          // 打版文件
          else {
            let params = {
              fileFullName: file.name,
              path: _imgUrl,
              designStyleId: row.designStyleId,
              userId: this.userId,
              fileName: '',
              suffix: ''
            }
            patternMakingUpload(params).then(res => {
              if (res.data.code === 0) {
                row.typingFileName = file.name
                this.$message.info(res.data.message)
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        });
      });
    },
    //md5图片上传Key的拼接
    setImgKey(name) {
      const storeId = this.$store.state.userInfo.id || JSON.parse(sessionStorage.getItem('user_login')).userId;
      const date = +new Date() + "";
      return storeId + "_" + _env + "_" + md5(storeId + date) + "_" + name;
    },
    // 点击录入
    handleClickLog(row, currentIndex) {
      // 权限检查
      if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.reviewLog")) {
        return
      }
      this.reviewOpinions.currentIndex = currentIndex
      this.reviewOpinions.missionPrcdNodeId = row.missionPrcdNodeId
      this.reviewOpinions.designStyleId = row.designStyleId

      this.reviewOpinions.visible = true
    },
    // 关闭评审意见窗口时，判断是否有更新意见，有的话，更新列表对应评审意见
    hideReviewOpinionsDialog(missionPrcdNodeId, message) {
      this.reviewOpinions.visible = false
      if (message) {
        this.$set(this.workbenchList[this.reviewOpinions.currentIndex], 'reviewLog', message)
      }
    },
    // 上传设计图、样衣图前检查权限
    beforeUpload(index, type) {
      // 设计图上传前检查 编辑设计信息权限
      if (type === 'designPics') {
        if (!this.powerJudgement.permissions("fac.spl.design.style.edit")) {
          return
        }
        this.$refs['file-upload1' + index][0].click()
      }
      if (type === 'samplePics') {
        if (!this.powerJudgement.permissions("fac.spl.design.sample.add") && !this.isWorkBench) {
          return
        }
        // 权限
        if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.sample.add") && this.isWorkBench) {
          return
        }
        this.$refs['file-upload2' + index][0].click()
      }

      if (type === 'typingFile') {
        if (!this.powerJudgement.permissions("fac.spl.design.mission.workspace.templete.upload")) {
          return
        }
        this.$refs['file-upload3' + index][0].click()
      }

    },
    getCheckDataList(id) {
      let params = {
        prcdNodeId: id,
        unitId: this.facId
      }
      getCheckData(params).then(res => {
        this.checkDataList = res.data.data
      })
    },
    showCheckDetail(item, notOpenDialog) {
      this.row = item;
      const params = {
        designPrcdNodeId: item.designPrcdNodeId,
        designStyleId: item.designStyleId,
        unitId: this.facId
      }
      getMisssionRequiredDetail(params).then(res => {
        this.checkDetailList = res.data.data
      })
      // getRequiredDetail(params).then(res => {
      //     this.checkDetailList = res.data.data
      // })
      if (notOpenDialog) return;
      this.checkDetailVisible = true
    }
  },
  async created() {
    console.log('执行created2744')
    // 设计档案权限
    let powerList = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
    if (powerList.indexOf("fac.spl.design.style") == -1) {
      this.nodeList = []
      this.showFile = false
    }
    // this.getCheckDataList()
    this.fetchFacUnitSettings()
    this.fetchUnitUser()
    // 加载完左侧列表后，模拟点击第一个菜单
    await this.getNodeList()
    await this.getRequiredDetail()
    if (this.nodeList.length) {
      this.changeNode(this.currentNode.index)
    }

  },

}
</script>

<style lang="scss">
.design-workbench-index {
  .last-review-and-update-goods .el-dialog--small {
    width: 405px;
  }
}
</style><style lang="scss">
.custom-table {
  font-size: 12px;

  &.el-table .cell,
  &.el-table th>div {
    padding: 0 8px;
  }
}

.design-workbench-index {

  .back-node-dialog,
  .set-submit-person-dialog,
  .is-cover-submitter-dialog,
  .is-submit-dialog,
  .edit-difficulty-dialog {
    .el-form-item {
      margin-bottom: 12px;
    }

    .el-dialog--tiny {
      width: 450px;
    }
  }

  .set-submit-person-dialog.custom-dialog .el-form-item__content .el-input {
    width: 100%;
  }

  td.opera-area {
    .cell {
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0;

      &>div {
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        &:first-child {
          border-left: none;
          flex: none;
          width: 44px;
        }

        border-left: 1px solid #E6EAF0;
      }
    }

  }

  .edit-dialog {
    .el-dialog__header {
      padding: 0;
      border-bottom: 1px solid #E6EAF0;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    ul {
      border: 1px solid #E6EAF0;
      line-height: 32px;

      li {
        height: 32px;
        padding: 0 12px;
        border-bottom: 1px solid #E6EAF0;
        display: flex;
        justify-content: space-between;

        &:hover {
          cursor: pointer;
        }

        &:first-child {
          background-color: #F5F7FA;
          color: #FFA914;
        }

        &:last-child {
          border: none;
        }
      }
    }
  }

  .check-detail-dialog {
    .el-dialog--tiny {
      width: 360px;
    }
  }
}
</style><style lang="scss" scoped>
.check-detail {

  position: fixed;
  z-index: 99;
  top: 0;
  /*right: 1200px;*/
  left: 0;
  width: 150px;
  max-height: 500px;
  padding-top: 20px;

  background: #fff;
  overflow-y: auto;

  .check-detail-item {
    padding-bottom: 2px;
    padding-left: 10px;
    padding-top: 10px;
    display: flex;
    border-bottom: 1px solid #E6EAF0;
    justify-content: space-between;
  }
}

.codeActive {
  color: #ff9c38 !important;
}

.design-workbench-index {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .action-btn {
    padding: 5px 16px;
    margin-right: 4px;
    background: #fff;
    font-size: 12px !important;

  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow-y: hidden;

    .node-menu {
      flex: 0 0 125px;
      margin-right: 10px;
      background: #fff;
      overflow-y: auto;

      ul>li {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;

        .icon-workbench {
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          margin-top: -2px;
          margin-right: 4px;
        }

        color: #3b3b3b;
        background-color: #fff;
        line-height: 32px;
        font-size: 12px;
        border-bottom: 1px solid #E6EAF0;
        padding: 0 3px 0 10px;
        cursor: pointer;

        &.active {
          background-color: #E6EAF0;
        }

        &:first-child {
          font-weight: bold;
        }
      }
    }

    .detail {
      flex: 1;
      overflow-y: auto;

      .design-img {
        display: inline-block;
        vertical-align: middle;
        width: 56px;
        height: 56px;
        padding: 3px 0;
      }
    }
  }

  .edit-difficulty-item {
    border-bottom: 1px solid #e6eaf0;
    margin-bottom: 16px;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  .check-detail-dialog {
    &__body {
      position: relative;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      color: #3b3b3b;
      margin-bottom: 16px;

      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, .7);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .status {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
