
// 加载错误公司logo
export const errorLogo = value => {
    if (!value) {
        return;
    }
    value.onerror = function () {
        value.src = '/static/images/logo.jpg';
    }
    value.src = (!value.src)?'/static/images/logo.jpg':value.src;
}