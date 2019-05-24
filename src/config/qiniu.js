
const ENV = process.env.NODE_ENV;
let baseUrl = '';
if(ENV==='sevenGB'||ENV==='SGBPRE'){
    //7gb的路径配置
    baseUrl =  'http://image7.myjuniu.com/'
}else if(ENV==='mny'){
    //梦燕客户的路径配置
    baseUrl =  'http://factoryqn.drmswlhome.com/'
}else if(ENV==='yl'){
    //雅鹿客户的路径配置
    baseUrl =  'http://yl.myjuniu.com/'
}else if(ENV==='wsn'){
    //雅鹿维斯尼的路径配置
    baseUrl =  'http://wsn.myjuniu.com/'
} else {
    baseUrl= 'https://image3.myjuniu.com/'
}
export default {
    baseDefaultUrl: 'https://image3.myjuniu.com/513d03b1665344e9a629d96dfaae6f63_dev_132a7c175a662d1dd5b3338218109174', // 巨牛默认头像
    baseUrl: baseUrl,                             // 七牛上传路径
    upUrl: 'https://upload-z2.qiniup.com',
}
