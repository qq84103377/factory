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
//=======================外发厂档案============================
// 查询外发厂列表分页
export const outsideFactoryList = params => {
    return axios.post('/v1/api/outside/factory/page', params, config)
};
//外发厂详情页
export const outsideFactoryInfo = params => {
    return axios.get('/v1/api/outside/factory/view', {params: params}, config)
};
//获取已存在的外发厂数据
export const getoutsideFactoryForm = params => {
    return axios.get('/v1/api/outside/factory/form', {params: params}, config)
};
//外发厂新增提交
export const outsideFactoryInsert = params => {
    return axios.post('/v1/api/outside/factory/insert', params, config)
};
//外发厂编辑提交
export const outsideFactoryUpdate = params => {
    return axios.post('/v1/api/outside/factory/update', params, config)
};
//删除前查询外发厂关联的送料节点上报
export const beforeDeleteOutside = params => {
    return axios.get('/v1/api/outside/factory/relatedOutsideFactorys', {params: params}, config)
};
//加工厂商列表，停用/启用供应商
export const updateStopuse = params => {
    return axios.get('/v1/api/outside/factory/updateStopuse', {params: params}, config)
};
//删除外发厂
export const deleteOutsideFactory = params => {
    return axios.get('/v1/api/outside/factory/delete', {params: params}, config)
};
//查询外发厂名称是否重复
export const checkOutsideName = params => {
    return axios.get('/v1/api/outside/factory/queryRepeatName', {params: params}, config)
};
//查询外发厂编号是否重复
export const checkOutsideCode = params => {
    return axios.get('/v1/api/outside/factory/queryRepeatCode', {params: params}, config)
};
//导入其他厂已有的外发厂信息
export const importOutsideMes = params => {
    return axios.get('/v1/api/outside/factory/importOutsideFactory', {params: params}, config)
};
//导入其他厂已有的外发厂信息
export const getoutsideFactorySku = params => {
    return axios.get('/v1/api/fac-mission-prcd-nodes/getFacGoodsSkuForOutsideFactory', {params: params}, config)
};
