/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var  WestoreWechatMembership;

/**************
 * 全局参数配置 
 */

WestoreWechatMembership = {
	
};

/**************
 * 初始化配置 
 */

WestoreWechatMembership.isPInt = function(v) {
	var reg = new RegExp("^[1-9][0-9]*$");
 	return reg.test(v);
};

WestoreWechatMembership.init = function(){
	//先将所有菜单收起来
	$("dt").removeClass("open");
	//再将微信会员一栏打开并且选中功能
	$("[name='m_membership']").addClass("open");
	$("[name='m_wechatMembership']").addClass("on");
	WestoreWechatMembership.bind();
};

WestoreWechatMembership.showQueryResult = function(data){
	
	//先清空数据
	$("#result").html("");
	
	var len = data.post.length;
	//导入数据
	var menu = new Array();
	for(var i = 0;i < len;i++){
		var item = new Array();
		item[0] = data.post[i].lineno;
		item[1] = data.post[i].portrait;
		item[2] = data.post[i].userName;
		item[3] = data.post[i].publicNumber;
		item[4] = data.post[i].city;
		item[5] = data.post[i].booltransport;
		item[6] = data.post[i].lastOnlineTime;
		item[7] = data.post[i].lastReplyTime;
		item[8] = data.post[i].userNo;
		menu[i] = item;
	}
	
	var tdata = {
		isAdmin:true,
		list:menu
	};
	//利用模板导入
	var html = template('wechatmembershiplist',tdata);
	//先清空
	$('#result').empty();
	$(html).appendTo($('#result'));
	
	//alert(data.post[0].datetime);
};


WestoreWechatMembership.Do_search = function(page){
	WestoreWechatMembership.QueryWechatMembership(page);
};

WestoreWechatMembership.bindButtons = function(){
	
	$("[name='wechatMembershipQuery']").on('click',function(){
		WestoreWechatMembership.QueryWechatMembership(1);
	});
	
};

WestoreWechatMembership.QueryWechatMembership = function(index){
	//微信公众号
	var wechatPublicNumber = $("[name='wechatPublicNumber']").val();
	
	//微信昵称
	var wechatUserName = $("[name='wechatUserName']").val();
	
	if(wechatPublicNumber || wechatUserName){
		
		$("[name='wechatMembershipAlert']").addClass("hide");
		
		//传递参数ajax（别忘了把页码传过去）
		var postData = "wechatPublicNumber=" + wechatPublicNumber + "&wechatUserName=" + wechatUserName
		+ "&page=" + index;
	
		console.log(postData);

		//调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/queryWechatMembership",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("查询失败!");
			},
			success:function(data){
				if(data.totalNum > 0){
					$("#no-order").addClass("hide");
					$("#productsPage").removeClass("hide");
					$("#result").removeClass("hide");
					$("[name='pageno']").val("");
					$("#wechatMembershipPage").removeClass("hide");
					WestoreWechatMembership.showQueryResult(data);
					$("label[name=curpage]").text(data.curpage);
					$("label[name=total_page]").text(data.total_page);
				}
				else if(data.totalNum == 0){
					$("#result").addClass("hide");
					$("#no-order").removeClass("hide");
					$("#productsPage").addClass("hide");
				}
			}
		});	
	}
	else{
		$("#result").addClass("hide");
		$("#no-order").removeClass("hide");
		$("#productsPage").addClass("hide");
		$("[name='wechatMembershipAlert']").html("微信公众号和微信昵称不能同时为空！");
		$("[name='wechatMembershipAlert']").removeClass("hide");
	}
};


//分页函数
WestoreWechatMembership.bindPage = function(classname, callback) {
	var parent_div = "div.pagination." + classname + " ";
	$(parent_div + " a.page-first").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreWechatMembership.isPInt(curpage)) {
			callback(1);
		}
	});
	$(parent_div + "a.page-last").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if (total_page != curpage &&  WestoreWechatMembership.isPInt(curpage) && WestoreWechatMembership.isPInt(total_page)) {
			callback(total_page);
		}
	});
	$(parent_div + "a.page-next").on('click', function() {
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		
		if (total_page != curpage && WestoreWechatMembership.isPInt(curpage) && WestoreWechatMembership.isPInt(total_page)) {
			callback(curpage + 1);
		}
	});
	$(parent_div + "a.page-prev").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreWechatMembership.isPInt(curpage)) {
			callback(curpage - 1);
		}
	});
	$(parent_div + "a.page-go").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var go_page = parseInt($(parent_div + "input").val(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if ( WestoreWechatMembership.isPInt(curpage) && WestoreWechatMembership.isPInt(total_page) && WestoreWechatMembership.isPInt(go_page) && go_page <= total_page && go_page != curpage) {
			callback(go_page);
		}
	});
};

WestoreWechatMembership.bindPageButton = function(){
	WestoreWechatMembership.bindPage('wechatMembership_page', WestoreWechatMembership.Do_search);
};

WestoreWechatMembership.bindMenu = function(){
	var merchantNo = $.cookie("merchantNo");
	if(!merchantNo){
		$("[name='fansUpdate']").addClass("hide");
	}
	else{
		$("[name='fansUpdate']").removeClass("hide");
	}
};

WestoreWechatMembership.bind = function(){
	//监听按钮
	//this.bindMenu();
	this.bindButtons();
	this.bindPageButton();
};

WestoreWechatMembership.init();
