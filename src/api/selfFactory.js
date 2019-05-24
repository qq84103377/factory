import axios from './config';
/*
    自定义字段接口 STRAT
*/

// 自定义字段列表查询接口
export const getCustomFieldList = params => {
    return axios.get(`/v1/api/custom-field/list`, {params: params})
};

// 新增自定义字段接口
export const addCustomField = params => {
    return axios.post(`/v1/api/custom-field`, params)
};


// 编辑自定义自定义字段
export const updateCustomFieldName = params => {
    return axios.put(`/v1/api/custom-field/name`, params)
};

// 自定义字段删除接口
export const deleteCustomField = params => {
    return axios.delete(`/v1/api/custom-field/${params.customFieldId}`,params );
};

// 自定义字段排序接口
export const sortCustomField = params => {
    return axios.put(`/v1/api/custom-field/sort`, params)
};



// 新增字段选项接口
export const addCustomFieldOption = params => {
    return axios.post(`/v1/api/custom-field/option`, params)
};

// 编辑字段选项接口
export const updateCustomFieldOption = params => {
    return axios.put(`/v1/api/custom-field/option`, params)
};

// 删除字段选项接口
export const deleteCustomFieldOption = params => {
    return axios.delete(`/v1/api/custom-field/option/${params.optionId}`,params );
};

// 字段选项排序接口
export const sortCustomFieldOption = params => {
    return axios.put(`/v1/api/custom-field/option/sort`, params)
};

// 中台API配置列表接口
export const facRegentCentralConfigList = params => {
    return axios.get(`/v1/api/fac-regent-central/config/list`, {params: params})
};

// 中台API配置启用接口
export const facRegentCentralConfigEnabled = params => {
    return axios.post(`/v1/api/fac-regent-central/config/enabled`, params)
};

// 中台API配置一键推送接口
export const facRegentCentralConfigFullPush = params => {
    return axios.post(`/v1/api/fac-regent-central/config/fullPush`, params)
};

// 中台API配置一键获取接口
export const facRegentCentralConfigFullReceived = params => {
    return axios.post(`/v1/api/fac-regent-central/config/fullReceived`, params)
};


/*
    自定义字段接口 END
*/
