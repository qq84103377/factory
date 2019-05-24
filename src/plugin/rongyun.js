var callbacks = {
    // getInstance : function(instance){
    //     RongIMLib.RongIMEmoji.init();
    //     //instance.sendMessage
    //     registerMessage("PersonMessage");
    // },
    getCurrentUser : function(userInfo){
        userId = userInfo.userId;
        alert("链接成功；userid=" + userInfo.userId);
        document.titie = ("链接成功；userid=" + userInfo.userId);
    },
    receiveNewMessage : function(message){
        //判断是否有 @ 自己的消息
        var mentionedInfo = message.content.mentionedInfo || {};
        var ids = mentionedInfo.userIdList || [];
        for(var i=0; i < ids.length; i++){
            if( ids[i] == userId){
                alert("有人 @ 了你！");
            }
        }
        // showResult("show1",message);
        messageOutput(message);
    }
};
export const RongYunInit = (params, cb, modules) => {
	var appKey = params.appKey || 'pwe86ga5pinx6';
	var token = params.token;
    var navi = params.navi || "";

	modules = modules || {};
	var RongIMLib = modules.RongIMLib || window.RongIMLib;
	var RongIMClient = RongIMLib.RongIMClient;
	var protobuf = modules.protobuf || null;

	var config = {};

	//私有云切换navi导航
	if(navi !== ""){
		config.navi = navi;
	}

	//私有云切换api
	var api = params.api || "";
	if(api !== ""){
		config.api = api;
	}

	//support protobuf url + function
	if(protobuf != null){
		config.protobuf = protobuf;
	};


	RongIMLib.RongIMClient.init(appKey,null,config);

	var instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			console.log('连接状态监听器', status);
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            cb.getInstance && cb.getInstance(instance);
				break;
				case RongIMLib.ConnectionStatus.CONNECTED:
					console.log('链接成功');
				break;
				case RongIMLib.ConnectionStatus.CONNECTING:
					console.log('正在链接');
					break;
				case RongIMLib.ConnectionStatus.DISCONNECTED:
					console.log('断开连接');
					break;
				case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
					console.log('其他设备登录');
					break;
				case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
					console.log('域名不正确');
					break;
				case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
				console.log('网络不可用');
				break;
			}
		}
	});

	/*
	文档：http://www.rongcloud.cn/docs/web.html#3、设置消息监听器

	注意事项：
		1：为了看到接收效果，需要另外一个用户向本用户发消息
		2：判断会话唯一性 ：conversationType + targetId
		3：显示消息在页面前，需要判断是否属于当前会话，避免消息错乱。
		4：消息体属性说明可参考：http://rongcloud.cn/docs/api/js/index.html
	*/
	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    // 判断消息类型
		    console.log("新消息: " + message.targetId);
            console.log(message);
            cb.getMessage && cb.getMessage(message);
            // callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			// callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
			console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			//console.log('token无效');
		},
		onError:function(errorCode){
		  console.log(errorCode);
		}
	});
}
