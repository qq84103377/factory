import axios from 'axios';
import store from '../vuex/store'

// const router  = require('../router')
import { MessageBox } from 'element-ui'

let baseUrl = process.env.BASE_URL + process.env.BASE_API;
// const Router = new VueRouter({
//     mode: "",
//     router
// })



axios.defaults.baseURL = baseUrl;
axios.defaults.withCredentials = true
axios.interceptors.request.use(
    function (config) {
        axios.defaults.withCredentials = true;

        if (sessionStorage.getItem('user_login')) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 7 * 60 * 60 * 1000);
            document.cookie = 'sid' + "=" + escape(JSON.stringify(JSON.parse(sessionStorage.getItem('user_login')).sid)) + ";expires=" + exp.toGMTString() + ";path=/";
            // config.headers.cookie = JSON.stringify(JSON.parse(sessionStorage.getItem('user_login')).sid);
            if (config.url.indexOf('/v1/api/public/getUploadToken') != -1) {
                axios.defaults.withCredentials = false
            }

            // 匹配cookie值

            // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
            var arr = document.cookie.match(new RegExp("(^| )"+'roleSignId'+"=([^;]*)(;|$)"));
            if(arr != null) {
                // 如果是在同一个浏览器账号已经被登录过了就强制退出
                // if(unescape(arr[2])> store.state.LoginTimes){
                //     sessionStorage.clear();
                //     location.reload();
                // }
            }
        }
        if (config.method === 'put' && sessionStorage.getItem('user_login')) {
            const userId = JSON.parse(sessionStorage.getItem('user_login')).userId;
            const data = config.data;
            data.userId = userId;
            config.data = data;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function(response) {
        if(response.data && response.data.code && response.data.code === 440) {
            MessageBox.alert('请重新登录', '登录超时', {
                confirmButtonText: '确定',
                callback: action => {
                    // Router.replace({
                    //     path: '/login'
                    // })
                    sessionStorage.clear();
                    location.reload();
                }
            });
            return Promise.reject('error')
        }
        else {
            return response;
        }

    },
    function (error) {
        return Promise.reject(error);
    }
);
export default axios;
