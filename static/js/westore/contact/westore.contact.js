/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WeStoreContact;

/**************
 * 全局参数配置 
 */
WeStoreContact = {
	
};

/**************
 * 初始化配置 
 */

//默认3秒执行一次拉取数据操作，如果拉取到时间不变，如果拉取不到，则时间值翻倍，提高效率差
var intervalTime = 3000;
var nowTime = 3000;


WeStoreContact.init = function(){
	this.bind();
};

/**************
 * 功能实现区
 */ 
 
WeStoreContact.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
    	return unescape(r[2]);
    }
    return null;
};

WeStoreContact.showQueryResult = function(data){
	var len = data.post.length;
	
	for(var i = 0;i < len;i++){
		//定义消息流
		var messageString = "<li><span class='red'>" + data.post[i].info + "</span></li><li>" + data.post[i].content + "</li>";
        $(messageString).appendTo("#senderMessagesGetter");
	}
};

WeStoreContact.checkNewMessages = function(){
	
	//调用ajax发送话语
	//注意，记得把get参数里面的sender和getter一同post过去
	var sender = WeStoreContact.getQueryString("getter");
	var getter = WeStoreContact.getQueryString("sender");
	
	var postData = "sender=" + sender + "&getter=" + getter;
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/receiveNewMessage",
		type:"POST",
		data:postData,
		dataType:"json",
		error:function(){
			alert("获取失败!请与管理员联系。");
		},
		success:function(data){
			$("[name='senderName']").text(data.senderName);
			//如果数据有返回，修改定时间隔
			if(data.totalNum > 0){
				nowTime = intervalTime;
				WeStoreContact.showQueryResult(data);
			}
			else{
				//如果拉取不到数据，则时间翻倍
				nowTime = nowTime + 1000;
			}
		}
	});
};

//监控是否有新消息送达
WeStoreContact.bindMessages = function(){
	//每隔10秒拉取一下数据
	setInterval("WeStoreContact.checkNewMessages()",nowTime);
};
 
WeStoreContact.bindButtons = function(){
	$("[name='contactSubmit']").on('click',function(){
		var words = $("[name='sendMessage']").val();
		
		//调用ajax发送话语
		//注意，记得把get参数里面的sender和getter一同post过去
		var sender = WeStoreContact.getQueryString("sender");
		var getter = WeStoreContact.getQueryString("getter");
		
		var postData = "contents=" + words + "&sender=" + sender
		+ "&getter=" + getter;
		
		//调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/addMessage",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("发送失败!请与管理员联系。");
			},
			success:function(data){
				//无符合查询条件的自动屏蔽
				if(data.code == 0){
					//定义消息流
					var messageString = "<li><span class='green'>" + data.userandtime + "</span></li><li>" + data.content + "</li>";
                    $(messageString).appendTo("#senderMessagesGetter");
                    
                    //同时，将输入框的内容清空
                    $("[name='sendMessage']").val("");
				}
				else{
					alert("发送失败！请与管理员联系。");
				}
			}
		});
	});
	
};
 
WeStoreContact.bind = function(){
	this.bindButtons();
	this.bindMessages();
};

WeStoreContact.init();
