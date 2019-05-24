var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // BASE_URL: '"http://factory-alpha.juniusoft.com/"',
    // BASE_URL: '"http://factory-beta.juniusoft.com/"',
    // BASE_URL: '"http://factory-preprd.juniusoft.com/"',
    BASE_API: '"new-mf-fac"',
    // BASE_API: '"new-mf-fac-preprd"',
    // BASE_API: '""',
    //洪武
    // BASE_URL: '"http://192.168.31.187:8080/"',
    //宝林
    // BASE_URL: '"http://192.168.31.44:8080/"',
    // 徐信
    // BASE_URL: '"http://192.168.31.144:9080/"',
    //广新
    // BASE_URL: '"http://192.168.31.86:8081/"',
    //林柳利
    // BASE_URL: '"http://192.168.31.190:9080/"',
    // kk
    // BASE_URL: '"http://192.168.31.193:9080/"',
    // BASE_URL: '"http://kk-maiqing.ngrok.wendal.cn/"',

    // BASE_URL: '"http://47.110.76.137/"',
    BASE_URL: '"http://134.175.183.187:2080/"',
    // CENTRAL_URL: '"http://192.168.31.193:8080/"',
    CENTRAL_URL: '"http://134.175.183.187:2080/central-bill-web/"',
    // BASE_URL: '"http://134.175.183.187:3080/"',
    // BASE_URL: '"http://test.juniucloud.com:8001/"',
    // BASE_URL: '"http://47.96.167.109:18081/"',
    // CENTRAL_URL: '"http://47.96.167.109:18081/central-bill-web/"',
    RongYunKey: '"qd46yzrfqhb0f"'
});

