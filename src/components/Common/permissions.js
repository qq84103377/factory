import {Message} from 'element-ui'

export default {
    permissions: function (name) {
        let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
        if (powerlist.indexOf(name) == -1) {
            Message.error("抱歉，您没有操作权限");
            return false;
        }
        return true;
    },
    hasPermission: function (name) {
        let powerlist = JSON.parse(sessionStorage.getItem("user_login")).permissionList;
        return powerlist.includes(name)
    }

}
