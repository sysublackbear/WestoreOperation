/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreLoginPassword;


/**************
 * 全局参数配置 
 */

WestoreLoginPassword = {
	
};

/**************
 * 初始化配置 
 */

WestoreLoginPassword.init = function(){
	WestoreLoginPassword.bind();
};

WestoreLoginPassword.isPInt = function(v) {
	var reg = new RegExp("^[1-9][0-9]*$");
 	return reg.test(v);
};

WestoreLoginPassword.bindInputs = function(){
	$("[name='oldPassword']").blur(function(){
		var oldPassword = $("[name='oldPassword']").val();
		//判断旧密码输入
		if(!oldPassword){
			$("[name='passwordAlert']").html("旧密码输入为空。");
			$("[name='passwordAlert']").removeClass("hide");
		}
		else if(!WestoreLoginPassword.checkPassword(oldPassword)){
			$("[name='passwordAlert']").html("旧登录密码输入错误，请重新输入。");
			$("[name='passwordAlert']").removeClass("hide");
		}
		else{
			$("[name='passwordAlert']").addClass("hide");
		}
	});
	
	$("[name='newPassword2']").blur(function(){
		var newPassword1 = $("[name='newPassword1']").val();
		var newPassword2 = $("[name='newPassword2']").val();
		
		if(!(newPassword1 && newPassword2)){
			$("[name='newPasswordAlert']").html("新的密码输入为空。");
			$("[name='newPasswordAlert']").removeClass("hide");
		}
		else if(!(newPassword2 == newPassword1)){
			$("[name='newPasswordAlert']").html("两次输入的密码不一致。");
			$("[name='newPasswordAlert']").removeClass("hide");
		}
		else{
			$("[name='newPasswordAlert']").addClass("hide");
		}
	});
};

WestoreLoginPassword.checkPassword = function(password){
	var postData = "password=" + password;
	
	//记录ajax返回的结果
	var result = false;
	//调用ajax
	
	//注意这里：由于默认的ajax是异步传输调用，所以并不能同步返回结果，除非在ajax的async设为false（设为同步传输ajax）
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/checkPassword",
		type:"POST",
		data:postData,
		dataType:"json",
		async:false,
		error:function(){
			return false;
		},
		success:function(data){
			//如果data.errcode为0，说明密码校验成功
			console.log(data.errcode);
			if(data.errcode > 0){
				result = true;
			}
			//否则，保持原值
			else{
				result = false;
			}
		}
	});
	
	return result;
};

WestoreLoginPassword.bindButtons = function(){
	
	$("[name='passwordSubmit']").on('click',function(){
		//获取密码等信息
		var oldPassword = $("[name='oldPassword']").val();
		var newPassword1 = $("[name='newPassword1']").val();
		var newPassword2 = $("[name='newPassword2']").val();
		
		//校验旧密码是否正确
		if(WestoreLoginPassword.checkPassword(oldPassword)){
			//再去看新密码是否一致
			
			//两次的密码不能为空
			if(!(newPassword1 && newPassword2)){
				$("[name='newPasswordAlert']").html("新密码的输入不能为空！");
				$("[name='newPasswordAlert']").removeClass("hide");
			}
			//两次的密码必须相等
			else if(newPassword1 != newPassword2){
				$("[name='newPasswordAlert']").html("两次输入的密码不一致！");
				$("[name='newPasswordAlert']").removeClass("hide");
			}
			else{
				//ajax修改密码
				var postData = "oldPassword=" + oldPassword + "&newPassword=" + newPassword1;
				
				//调用ajax
				$.ajax({
					url:"/WeStoreOperation/index.php/westore/updatePassword",
					type:"POST",
					data:postData,
					dataType:"json",
					error:function(){
						alert("修改失败!请联系管理员。");
					},
					success:function(data){
						//如果data.errcode为0，说明更新成功；否则更新失败
						if(data.errcode > 0){
							//弹窗和背景
							$(".backGround").height($(document).height()+"px");
							$(".backGround").fadeTo("slow",0.5);
							
							$("#updateSuccessFinish").removeClass("hide");
						}
						//否则，保持原值
						else{
							//弹窗和背景
							$(".backGround").height($(document).height()+"px");
							$(".backGround").fadeTo("slow",0.5);
							
							$("#updateFailedFinish").removeClass("hide");
						}
					}
				});
			}
		}
		else{
			$("[name='passwordAlert']").html("旧登录密码输入错误，请重新输入");
			$("[name='passwordAlert']").removeClass("hide");
		}
	});
	
	//点击成功提示的关闭按钮
	$("[name='closeUpdateSuccessFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#updateSuccessFinish").addClass("hide");
	});
	
	$("[name='updateSuccessConfirm']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#updateSuccessFinish").addClass("hide");
	});
	
	//点击失败提示的关闭按钮
	$("[name='closeUpdateFailedFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#updateFailedFinish").addClass("hide");
	});
	
	$("[name='updateFailedConfirm']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#updateFailedFinish").addClass("hide");
	});
	
 	
};

WestoreLoginPassword.showQueryResult = function(data){
	//先将数据清空
	$("#result").html("");
	
	var len = data.post.length;
	//导入数据
	var menu = new Array();
	for(var i = 0;i < len;i++){
		var item = new Array();
		item[0] = data.post[i].loginAccount;
		item[1] = data.post[i].loginName;
		item[2] = data.post[i].loginPassword;
		item[3] = data.post[i].remark;
		menu[i] = item;
	}
	var tdata = {
		isAdmin:true,
		list:menu
	};
	//利用模板导入
	var html = template('userlist',tdata);
	//先清空
	$('#result').empty();
	$(html).appendTo($('#result'));
	
	//alert(data.post[0].datetime);
};

WestoreLoginPassword.QueryUser = function(index){
	
	//注意：别忘了传页码参数过去！
	var user = "张三";
	
	var postData = "user=" + user + "&page=" + index;
	
	//console.log(postData);
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/queryUser",
		type:"POST",
		data:postData,
		dataType:"json",
		error:function(){
			alert("查询员工信息失败!请与管理员联系。");
		},
		success:function(data){
			if(data.errcode == 0){
				//无符合查询条件的自动屏蔽
				if(data.totalNum > 0){
					$("#no-user").addClass("hide");
					$("#userPage").removeClass("hide");
					$("#result").removeClass("hide");
					$("[name='pageno']").val("");
					WestoreLoginPassword.showQueryResult(data);	
					$("label[name=curpage]").text(data.curpage);
					$("label[name=total_page]").text(data.total_page);
				}
				else if(data.totalNum == 0){
					$("#result").addClass("hide");
					$("#no-user").removeClass("hide");
					$("#userPage").addClass("hide");
				}
			}
			else{
				$("#updateFailedFinish").removeClass("hide");
			}
			
		}
	});
};

WestoreLoginPassword.bindMenu = function(){
	WestoreLoginPassword.QueryUser(1);
};

WestoreLoginPassword.Do_search = function(page) {
	WestoreLoginPassword.QueryUser(page);
};

WestoreLoginPassword.bindPage = function(classname, callback) {
	var parent_div = "div.pagination." + classname + " ";
	$(parent_div + " a.page-first").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreLoginPassword.isPInt(curpage)) {
			callback(1);
		}
	});
	$(parent_div + "a.page-last").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if (total_page != curpage &&  WestoreLoginPassword.isPInt(curpage) && WestoreLoginPassword.isPInt(total_page)) {
			callback(total_page);
		}
	});
	$(parent_div + "a.page-next").on('click', function() {
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		
		if (total_page != curpage && WestoreLoginPassword.isPInt(curpage) && WestoreLoginPassword.isPInt(total_page)) {
			callback(curpage + 1);
		}
	});
	$(parent_div + "a.page-prev").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreLoginPassword.isPInt(curpage)) {
			callback(curpage - 1);
		}
	});
	$(parent_div + "a.page-go").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var go_page = parseInt($(parent_div + "input").val(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if ( WestoreLoginPassword.isPInt(curpage) && WestoreLoginPassword.isPInt(total_page) && WestoreLoginPassword.isPInt(go_page) && go_page <= total_page && go_page != curpage) {
			callback(go_page);
		}
	});
};

WestoreLoginPassword.bindPageButton = function(){
	WestoreLoginPassword.bindPage('user_page', WestoreLoginPassword.Do_search);
};

WestoreLoginPassword.bindShow = function(){
	var merchantNo = $.cookie("merchantNo");
	if(!merchantNo){
		$("#updateStaffPasswords").addClass("hide");
	}
	else{
		$("#updateStaffPasswords").removeClass("hide");
	}
};

WestoreLoginPassword.bind = function(){
	$("a.updateOtherPassword").on('click',function(){alert("hhh");});
	this.bindShow();
	this.bindPageButton();
	this.bindButtons();
	this.bindInputs();
	this.bindMenu();
};

WestoreLoginPassword.init();
