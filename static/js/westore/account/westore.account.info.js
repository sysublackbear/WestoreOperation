/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreAccountInfo;


/**************
 * 全局参数配置 
 */

WestoreAccountInfo = {
	
};

/**************
 * 初始化配置 
 */


var userTelphone = $("[name='userTelphone']").val();
var userWebsiteName = $("[name='userWebsiteName']").val();
var userWebsite = $("[name='userWebsite']").val();

var bankAccountUser = $("[name='bankAccountUser']").val();
var bankName = $("[name='bankName']").val();
var bankInfo = $("[name='bankInfo']").val();
var bankAccountInfo = $("[name='bankAccountInfo']").val();
var bankAccountNo = $("[name='bankAccountNo']").val();
var bankAccountUserName = $("[name='bankAccountUserName']").val();

WestoreAccountInfo.init = function(){
	WestoreAccountInfo.bind();
};

WestoreAccountInfo.bindButtons = function(){
	
	//点击更新结算信息按钮
	$("[name='settledUpdate']").on('click',function(){
		//先将相关按钮显示/隐藏起来
		$("[name='settledCancel']").removeClass("hide");
		$("[name='settledConfirm']").removeClass("hide");
		$("[name='settledUpdate']").addClass("hide");
		
		//先采集值，再解锁
		bankAccountUser = $("[name='bankAccountUser']").val();
		bankName = $("[name='bankName']").val();
		bankInfo = $("[name='bankInfo']").val();
		bankAccountInfo = $("[name='bankAccountInfo']").val();
		bankAccountNo = $("[name='bankAccountNo']").val();
		bankAccountUserName = $("[name='bankAccountUserName']").val();
			
		//去除输入框的readonly属性
		$("[name='bankAccountUser']").attr("readonly",false);
		$("[name='bankName']").attr("readonly",false);
		$("[name='bankInfo']").attr("readonly",false);
		$("[name='bankAccountInfo']").attr("readonly",false);
		$("[name='bankAccountNo']").attr("readonly",false);
		$("[name='bankAccountUserName']").attr("readonly",false);
		
		//打印变量
		//console.log(bankAccountUser);
		//console.log(bankName);
		//console.log(bankInfo);
		//console.log(bankAccountInfo);
		//console.log(bankAccountNo);
		//console.log(bankAccountUserName);
	});
	
	
	$("[name='infoUpdate']").on('click',function(){
		//先将相关按钮显示/隐藏起来
		$("[name='infoCancel']").removeClass("hide");
		$("[name='infoConfirm']").removeClass("hide");
		$("[name='infoUpdate']").addClass("hide");
		
		//先采集，再解锁
		userTelphone = $("[name='userTelphone']").val();
		userWebsiteName = $("[name='userWebsiteName']").val();
		userWebsite = $("[name='userWebsite']").val();
		
		//去除输入框的readonly属性
		$("[name='userTelphone']").attr("readonly",false);
		$("[name='userWebsiteName']").attr("readonly",false);
		$("[name='userWebsite']").attr("readonly",false);
		
		//打印变量
		//console.log(userTelphone);
		//console.log(userWebsiteName);
		//console.log(userWebsite);
	});
	
	//点击取消按钮
	$("[name='settledCancel']").on('click',function(){
		
		$("[name='bankAccountUser']").val(bankAccountUser);
		$("[name='bankAccountUser']").attr("readonly",true);
		
		$("[name='bankName']").val(bankName);
		$("[name='bankName']").attr("readonly",true);
		
		$("[name='bankInfo']").val(bankInfo);
		$("[name='bankInfo']").attr("readonly",true);
		
		$("[name='bankAccountInfo']").val(bankAccountInfo);
		$("[name='bankAccountInfo']").attr("readonly",true);
		
		$("[name='bankAccountNo']").val(bankAccountNo);
		$("[name='bankAccountNo']").attr("readonly",true);
		
		$("[name='bankAccountUserName']").val(bankAccountUserName);
		$("[name='bankAccountUserName']").attr("readonly",true);
		
		//再将相关按钮显示/隐藏起来
		$("[name='settledCancel']").addClass("hide");
		$("[name='settledConfirm']").addClass("hide");
		$("[name='settledUpdate']").removeClass("hide");
	});
	
	$("[name='infoCancel']").on('click',function(){

		$("[name='userTelphone']").val(userTelphone);
		$("[name='userTelphone']").attr("readonly",true);
	
		$("[name='userWebsiteName']").val(userWebsiteName);
		$("[name='userWebsiteName']").attr("readonly",true);
		
		$("[name='userWebsite']").val(userWebsite);
		$("[name='userWebsite']").attr("readonly",true);
		
		//再将相关按钮显示/隐藏起来
		$("[name='infoCancel']").addClass("hide");
		$("[name='infoConfirm']").addClass("hide");
		$("[name='infoUpdate']").removeClass("hide");
	});
	
	//点击确定按钮
	$("[name='settledConfirm']").on('click',function(){
		var tempBankAccountUser = $("[name='bankAccountUser']").val();
		var tempBankName = $("[name='bankName']").val();
		var tempBankInfo = $("[name='bankInfo']").val();
		var tempBankAccountInfo = $("[name='bankAccountInfo']").val();
		var tempBankAccountNo = $("[name='bankAccountNo']").val();
		var tempBankAccountUserName = $("[name='bankAccountUserName']").val();
	
		//打印变量
		//console.log(tempBankAccountUser);
		//console.log(tempBankName);
		//console.log(tempBankInfo);
		//console.log(tempBankAccountInfo);
		//console.log(tempBankAccountNo);
		//console.log(tempBankAccountUserName);
		
		//传参ajax
		var postData = "bankAccountUser=" + tempBankAccountUser + "&bankName=" + tempBankName
		+ "&bankInfo=" + tempBankInfo + "&bankAccountInfo=" + tempBankAccountInfo
		+ "&bankAccountNo=" + tempBankAccountNo + "&bankAccountUserName=" + tempBankAccountUserName;
		
		console.log(postData);
		
		//调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/updateUserSettled",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("修改失败!请联系管理员。");
			},
			success:function(data){
				//如果data.errcode为0，说明更新成功；否则更新失败
				if(data.errcode > 0){
					$("[name='bankAccountUser']").val(data.post.bankAccountUser);
					$("[name='bankName']").val(data.post.bankName);
					$("[name='bankInfo']").val(data.post.bankInfo);
					$("[name='bankAccountInfo']").val(data.post.bankAccountInfo);
					$("[name='bankAccountNo']").val(data.post.bankAccountNo);
					$("[name='bankAccountUserName']").val(data.post.bankAccountUserName);
					
					$("[name='bankAccountUser']").attr("readonly",true);
					$("[name='bankName']").attr("readonly",true);
					$("[name='bankInfo']").attr("readonly",true);
					$("[name='bankAccountInfo']").attr("readonly",true);
					$("[name='bankAccountNo']").attr("readonly",true);
					$("[name='bankAccountUserName']").attr("readonly",true);
					
					//弹窗和背景
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#updateSuccessFinish").removeClass("hide");
					
					//再将相关按钮显示/隐藏起来
					$("[name='settledCancel']").addClass("hide");
					$("[name='settledConfirm']").addClass("hide");
					$("[name='settledUpdate']").removeClass("hide");

				}
				//否则，保持原值
				else{
					$("[name='bankAccountUser']").val(bankAccountUser);
					$("[name='bankName']").val(bankName);
					$("[name='bankInfo']").val(bankInfo);
					$("[name='bankAccountInfo']").val(bankAccountInfo);
					$("[name='bankAccountNo']").val(bankAccountNo);
					$("[name='bankAccountUserName']").val(bankAccountUserName);
					
					$("[name='bankAccountUser']").attr("readonly",true);
					$("[name='bankName']").attr("readonly",true);
					$("[name='bankInfo']").attr("readonly",true);
					$("[name='bankAccountInfo']").attr("readonly",true);
					$("[name='bankAccountNo']").attr("readonly",true);
					$("[name='bankAccountUserName']").attr("readonly",true);
					
					//弹窗和背景
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#updateFailedFinish").removeClass("hide");
					
					//再将相关按钮显示/隐藏起来
					$("[name='settledCancel']").addClass("hide");
					$("[name='settledConfirm']").addClass("hide");
					$("[name='settledUpdate']").removeClass("hide");
				}
			}
		});
		
	});
	
	//点击确定按钮
	$("[name='infoConfirm']").on('click',function(){
		var tempUserTelphone = $("[name='userTelphone']").val();
		var tempUserWebsiteName = $("[name='userWebsiteName']").val();
		var tempUserWebsite = $("[name='userWebsite']").val();
		
		//打印变量
		//console.log(tempUserTelphone);
		//console.log(tempUserWebsiteName);
		//console.log(tempUserWebsite);
		
		//传参ajax
		var postData = "userTelphone=" + tempUserTelphone + "&userWebsiteName=" + tempUserWebsiteName
		+ "&userWebsite=" + tempUserWebsite;
		
		console.log(postData);
		
		//调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/updateUserInfo",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("修改失败!请联系管理员。");
			},
			success:function(data){
				//如果data.errcode为0，说明更新成功；否则更新失败
				if(data.errcode > 0){
				
					$("[name='userTelphone']").val(data.post.userTelphone);
					$("[name='userWebsiteName']").val(data.post.userWebsiteName);
					$("[name='userWebsite']").val(data.post.userWebsite);
					
					$("[name='userTelphone']").attr("readonly",true);
					$("[name='userWebsiteName']").attr("readonly",true);
					$("[name='userWebsite']").attr("readonly",true);
					
					//弹窗和背景
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#updateSuccessFinish").removeClass("hide");
					
					//再将相关按钮显示/隐藏起来
					$("[name='infoCancel']").addClass("hide");
					$("[name='infoConfirm']").addClass("hide");
					$("[name='infoUpdate']").removeClass("hide");

				}
				//否则，保持原值
				else{
					$("[name='userTelphone']").val(userTelphone);
					$("[name='userWebsiteName']").val(userWebsiteName);
					$("[name='userWebsite']").val(userWebsite);
					
					$("[name='userTelphone']").attr("readonly",true);
					$("[name='userWebsiteName']").attr("readonly",true);
					$("[name='userWebsite']").attr("readonly",true);
					
					//弹窗和背景
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#updateFailedFinish").removeClass("hide");
					
					//再将相关按钮显示/隐藏起来
					$("[name='infoCancel']").addClass("hide");
					$("[name='infoConfirm']").addClass("hide");
					$("[name='infoUpdate']").removeClass("hide");
				}
			}
		});
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

WestoreAccountInfo.bindMenu = function(){
	var merchantNo = $.cookie("merchantNo");
	if(!merchantNo){
		$("#merchantInfo").addClass("hide");
	}
	else{
		$("#merchantInfo").removeClass("hide");
	}
};

WestoreAccountInfo.bind = function(){
	this.bindMenu();
	this.bindButtons();
};

WestoreAccountInfo.init();
