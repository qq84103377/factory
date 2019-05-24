/*****************
 *
 *  牛厂项目通用函数，扩展需要遵从以下规范：
 *
 *  1.函数命名按驼峰格式
 *  2.注释要写明函数的作用
 *  3.业务逻辑复杂的函数，要标明参数和函数的调用方法
 *
 *
 * **************/

//获取userId
function userId(){
    let userId;
    userId = sessionStorage.getItem("user_login") ? JSON.parse(sessionStorage.getItem("user_login")).userId || this.$store.state.userInfo.id : '';
    return userId
}

/*******
 * facId（） 和 unitId（）其实是相同的，因为项目原因这两个值目前仍在使用，故写了两个方法方便调用
 * *******/

//获取facId
function facId(){
    let facId;
    facId = sessionStorage.getItem("user_login") ? JSON.parse(sessionStorage.getItem('user_login')).unitId : '';
    return facId
}

//获取unitId
function unitId(){
    let unitId;
    unitId = sessionStorage.getItem("user_login") ? JSON.parse(sessionStorage.getItem('user_login')).unitId : '';
    return unitId
}


//获取当前时间，返回格式 'YYYY-MM-DD'
function getNowDate() {
    let date = new Date();
    let link = "-";
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return (year + link + month + link + strDate)
}

/******
 *
 * 对象数组修改属性名，接收参数格式：（数据，原属性名，改后的属性名）
 * 1.修改单个属性参数示例(data, 'missionId', 'id')
 * 2.修改多个属性参数示例(data, ['missionId', 'orderNo'], ['id', 'name'])
 *
 * ******/
function changeAttr(arr, oldAttr, newAttr){
    if(arr.length && oldAttr.length && newAttr.length){
        if(typeof(oldAttr) === "string"){
            arr.map(item =>{
                item[newAttr] = item[oldAttr];
                delete item[oldAttr]
            });
        }else{
            arr.map(item =>{
                for(let i=0; i<oldAttr.length; i++){
                    item[(newAttr[i])] = item[(oldAttr[i])];
                    delete item[(oldAttr[i])]
                }
            });
        }
    }
    return arr
}

module.exports = {
    userId,
    facId,
    unitId,
    getNowDate,
    changeAttr,
};