/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WeStoreRegister;

/**************
 * 全局参数配置 
 */
WeStoreRegister = {
	
};

/**************
 * 初始化配置 
 */
WeStoreRegister.init = function(){
	this.bind();
	this.bindButtons();
	this.blurInputs();
};

/**************
 * 功能实现区
 */ 
WeStoreRegister.bind = function(){
	
	//先将第一次使用的提示标语隐藏，因为是注册页面
	$("#first-use").addClass("hide");
	$("#return-login").removeClass("hide");
	
	//默认初始化，处于第一步的Step
	$("#step1").addClass("on");
	$("#step2").addClass("next");
	$("#step3").addClass("nnext");
	$("#step4").addClass("nnext last");
	
	//显示第一页注册用户
	$("#registerUsers").removeClass("hide");
	//$("#registerMerchants").removeClass("hide");
	//营业开始时间
	$("input[name=starttime]").timepicker();
	
	//营业结束时间
	$("input[name=endtime]").timepicker();
};

//监听所有按钮
WeStoreRegister.bindButtons = function(){
	
	//给第一步向第二步的跳转按钮监听js动作
	$("[name='step1Tostep2']").on('click',function(){
		//先看登录名称是否为6位以上的数字和字母的组合
		var loginName = $("[name='loginName']").val();
		var password = $("[name='userPassword']").val();
		var password2 = $("[name='userPassword2']").val();
		var email = $("[name='email']").val();
		var mobile = $("[name='mobile']").val();
		var nickname = $("[name='nickname']").val();
		var contact = $("[name='contact']").val();
		var wechatNo = $("[name='wechatNo']").val();
		
		if(loginName.length < 6 || !WeStoreRegister.checkLoginName(loginName)){
			$("[name='loginNameAlert']").html("登录账号必须是6位以上的字母和数字的组合！");
			$("[name='loginNameAlert']").removeClass("hide");
		}
		//校验登录账号是否有人用过
		//返回:true——没有人用;false——已经有人用了
		else if(!WeStoreRegister.checkLoginNameRepeat(loginName)){
			$("[name='loginNameAlert']").html("这个登录账号已经有人注册！");
			$("[name='loginNameAlert']").removeClass("hide");
		}
		//看两个输入的密码是否为空
		else if(!password){
			$("[name='loginNameAlert']").addClass("hide");
			
			$("[name='userPasswordAlert']").html("密码不能为空！");
			$("[name='userPasswordAlert']").removeClass("hide");
		}
		else if(password.length < 6){
			$("[name='loginNameAlert']").addClass("hide");
			
			$("[name='userPasswordAlert']").html("密码必须6位以上！");
			$("[name='userPasswordAlert']").removeClass("hide");
		}
		else if(!password2){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			
			$("[name='userPassword2Alert']").html("密码不能为空！");
			$("[name='userPassword2Alert']").removeClass("hide");
		}
		//再看跟前面输入的密码是否一致
		else if(password2 != password){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			
			$("[name='userPassword2Alert']").html("两次输入的密码不一致！");
			$("[name='userPassword2Alert']").removeClass("hide");
		}
		else if(!email){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			
			$("[name='emailAlert']").html("邮箱地址不能为空!");
			$("[name='emailAlert']").removeClass("hide");
		}
		//判断邮箱地址格式是否正确
		else if(!WeStoreRegister.checkEmail(email)){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			
			$("[name='emailAlert']").html("邮箱地址格式错误!");
			$("[name='emailAlert']").removeClass("hide");
		}
		else if(!mobile){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
				
			$("[name='mobileAlert']").html("手机号码不能为空!");
			$("[name='mobileAlert']").removeClass("hide");
		}
		//判断电话号码是否符合规格
		else if(!WeStoreRegister.checkMobile(mobile)){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
			
			$("[name='mobileAlert']").html("手机号码格式错误!");
			$("[name='mobileAlert']").removeClass("hide");
		}
		else if(!nickname){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
			$("[name='mobileAlert']").addClass("hide");
			
			$("[name='nicknameAlert']").html("用户昵称不能为空!");
			$("[name='nicknameAlert']").removeClass("hide");
		}
		else if(!contact){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
			$("[name='mobileAlert']").addClass("hide");
			$("[name='nicknameAlert']").addClass("hide");
			
			$("[name='contactAlert']").html("联系人不能为空!");
			$("[name='contactAlert']").removeClass("hide");
		}
		else if(!wechatNo){
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
			$("[name='mobileAlert']").addClass("hide");
			$("[name='nicknameAlert']").addClass("hide");
			$("[name='contactAlert']").addClass("hide");
			
			$("[name='wechatNoAlert']").html("微信号不能为空!");
			$("[name='wechatNoAlert']").removeClass("hide");
		}
		else{
			$("[name='loginNameAlert']").addClass("hide");
			$("[name='userPasswordAlert']").addClass("hide");
			$("[name='userPassword2Alert']").addClass("hide");
			$("[name='emailAlert']").addClass("hide");
			$("[name='mobileAlert']").addClass("hide");
			$("[name='nicknameAlert']").addClass("hide");
			$("[name='contactAlert']").addClass("hide");
			$("[name='wechatAlert']").addClass("hide");
			
			//各项无误后，输出第二步的页面
			$("#registerMerchants").removeClass("hide");
			$("#registerUsers").addClass("hide");
			//第二步的step
			$("#step1").removeClass("on").addClass("prev");
			$("#step2").removeClass("next").addClass("on");
			$("#step3").removeClass("nnext").addClass("next");
		}
	});

	//如果想要注册商户
	$("[name='step2Tostep3']").on('click',function(){
		//先看商家编码是否正确
		var merchantCode = $("[name='merchantCode']").val();
		var merchantName = $("[name='merchantName']").val();
		var merchantContact = $("[name='merchantContact']").val();
		var wechatMembership = $("[name='wechatMembership']").val();
		var website = $("[name='website']").val();
		var websiteName = $("[name='websiteName']").val();
		var contactMobile = $("[name='contactMobile']").val();
		var merchantEmail = $("[name='merchantEmail']").val();
		var freight = $("[name='freight']").val();
		var minFreight = $("[name='minFreight']").val();
		var freightTime = $("[name='freightTime']").val();
		var freightArea = $("[name='freightArea']").val();
		var starttime = $("[name='starttime']").val();
		var endtime = $("[name='endtime']").val();
		var fax = $("[name='fax']").val();
		
		var start = starttime.split(":");
		var end = endtime.split(":");  //分割出时和分两个值
		
		//如果商家编码为空
		if(!merchantCode){
			$("[name='merchantCodeAlert']").html("商家编码不能为空!");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		//判断商家编码是否重复
		//返回:true——没有人用;false——已经有人用了
		else if(!WeStoreRegister.checkMerchantCodeRepeat(merchantCode)){
			$("[name='merchantCodeAlert']").html("这个商家编码已经有人注册！");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		//如果商家编码不通过校验
		else if(!WeStoreRegister.checkMerchantCode(merchantCode)){
			$("[name='merchantCodeAlert']").html("商家编码必须为8位数字和字母的组合!");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		//商家名称为空
		else if(!merchantName){
			$("[name='merchantCodeAlert']").addClass("hide");
			
			$("[name='merchantNameAlert']").html("商家名称不能为空!");
			$("[name='merchantNameAlert']").removeClass("hide");
		}
		//如果联系人为空
		else if(!merchantContact){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			
			$("[name='merchantContactAlert']").html("联系人不能为空!");
			$("[name='merchantContactAlert']").removeClass("hide");
		}
		//判断联系电话是否为空
		else if(!contactMobile){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			
			$("[name='contactMobileAlert']").html("联系电话不能为空!");
			$("[name='contactMobileAlert']").removeClass("hide");
			
		}
		//校验电话格式
		else if(!WeStoreRegister.checkMobile(contactMobile)){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			
			$("[name='contactMobileAlert']").html("联系电话格式错误!");
			$("[name='contactMobileAlert']").removeClass("hide");
		}
		//传真可以为空，就不校验了
		//判断商户邮箱地址是否为空
		else if(!merchantEmail){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			
			$("[name='merchantEmailAlert']").html("商户邮箱地址不能为空!");
			$("[name='merchantEmailAlert']").removeClass("hide");
		}
		//校验商户邮箱地址是否正确
		else if(!WeStoreRegister.checkEmail(merchantEmail)){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			
			$("[name='merchantEmailAlert']").html("商户邮箱地址格式错误!");
			$("[name='merchantEmailAlert']").removeClass("hide");
		}
		//营业开始时间为空
		else if(!starttime){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			
			$("[name='starttimeAlert']").html("营业开始时间不能为空!");
			$("[name='starttimeAlert']").removeClass("hide");
		}
		//营业结束时间为空
		else if(!endtime){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			
			$("[name='endtimeAlert']").html("营业结束时间不能为空!");
			$("[name='endtimeAlert']").removeClass("hide");
		}
		//营业结束时间必须大于营业开始时间
		else if(! (Number(end[0]) > Number(start[0]) || (Number(end[0]) == Number(start[0]) && Number(end[1]) > Number(start[1]) ))){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			
			$("[name='endtimeAlert']").html("营业结束时间不能早于营业开始时间!");
			$("[name='endtimeAlert']").removeClass("hide");
		}
		//校验运费是否为空
		else if(!freight){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='freightAlert']").html("运费一栏不能为空");
			$("[name='freightAlert']").removeClass("hide");
		}
		//看是否通过校验
		else if(!WeStoreRegister.checkMoney(freight)){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='freightAlert']").html("运费输入格式错误!");
			$("[name='freightAlert']").removeClass("hide");
		}
		//校验最低配送
		else if(!minFreight){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='minFreightAlert']").html("最低配送不能为空");
			$("[name='minFreightAlert']").removeClass("hide");
		}
		else if(!WeStoreRegister.checkMoney(minFreight)){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='minFreightAlert']").html("最低配送格式错误!");
			$("[name='minFreightAlert']").removeClass("hide");
		}
		//校验配送时间
		else if(!freightTime){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='minFreightAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='freightTimeAlert']").html("配送时间不能为空!");
			$("[name='freightTimeAlert']").removeClass("hide");
		}
		//校验配送时间
		else if(!WeStoreRegister.checkNumber(freightTime)){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='minFreightAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='freightTimeAlert']").html("配送时间格式错误!");
			$("[name='freightTimeAlert']").removeClass("hide");
		}
		else if(!freightArea){
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='minFreightAlert']").addClass("hide");
			$("[name='freightTimeAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			$("[name='freightAreaAlert']").html("配送范围不能为空!");
			$("[name='freightAreaAlert']").removeClass("hide");
		}
		else{
			$("[name='merchantCodeAlert']").addClass("hide");
			$("[name='merchantNameAlert']").addClass("hide");
			$("[name='merchantContactAlert']").addClass("hide");
			$("[name='contactMobileAlert']").addClass("hide");
			$("[name='merchantEmailAlert']").addClass("hide");
			$("[name='freightAlert']").addClass("hide");
			$("[name='minFreightAlert']").addClass("hide");
			$("[name='freightTimeAlert']").addClass("hide");
			$("[name='freightAreaAlert']").addClass("hide");
			$("[name='starttimeAlert']").addClass("hide");
			$("[name='endtimeAlert']").addClass("hide");
			
			//校验所有的信息正确无误后，跳入下一步
			$("#registerMerchants").addClass("hide");
			$("#userSet").removeClass("hide");
			//第三步的step
			$("#step1").removeClass("prev").addClass("pprev");
			$("#step2").removeClass("on").addClass("prev");
			$("#step3").removeClass("next").addClass("on");
			$("#step4").removeClass("nnext last").addClass("next");
			
		}
	});
	
	//如果只是想要注册用户，可以跳过这部分的内容
	$("[name='step2Tostep3u']").on('click',function(){
		//先清空填的没用信息，因为只是想注册用户
		$("[name='merchantCode']").val("");
		$("[name='merchantName']").val("");
		$("[name='merchantContact']").val("");
		$("[name='wechatMembership']").val("");
		$("[name='website']").val("");
		$("[name='websiteName']").val("");
		$("[name='contactMobile']").val("");
		$("[name='merchantEmail']").val("");
		$("[name='freight']").val("");
		$("[name='minFreight']").val("");
		$("[name='freightTime']").val("");
		$("[name='freightArea']").val("");
		$("[name='starttime']").val("");
		$("[name='endtime']").val("");
		$("[name='fax']").val("");
		
		//校验所有的信息正确无误后，跳入下一步
		$("#registerMerchants").addClass("hide");
		$("#userSet").removeClass("hide");
		//第三步的step
		$("#step1").removeClass("prev").addClass("pprev");
		$("#step2").removeClass("on").addClass("prev");
		$("#step3").removeClass("next").addClass("on");
		$("#step4").removeClass("nnext last").addClass("next");
	});
	
	//返回到第一步
	$("[name='step2Tostep1']").on('click',function(){
		$("#registerMerchants").addClass("hide");
		$("#registerUsers").removeClass("hide");
		
		$("#step1").removeClass("prev").addClass("on");
		$("#step2").removeClass("on").addClass("next");
		$("#step3").removeClass("next").addClass("nnext");
	});
	
	//从第三步返回到第二步
	$("[name='step3Tostep2']").on('click',function(){
		$("#userSet").addClass("hide");
		$("#registerMerchants").removeClass("hide");
		
		//返回第二步的样式
		$("#step1").removeClass("pprev").addClass("prev");
		$("#step2").removeClass("prev").addClass("on");
		$("#step3").removeClass("on").addClass("next");
		$("#step4").removeClass("next").addClass("nnext last");
	});
	
	//从第三步跳转到第四步，先通过ajax提交表单，然后定时两秒提转到主页面
	$("[name='step3Tostep4']").on('click',function(){
		
		//step1
		var loginName = $("[name='loginName']").val();
		var password = $("[name='userPassword']").val();
		var password2 = $("[name='userPassword2']").val();
		var email = $("[name='email']").val();
		var mobile = $("[name='mobile']").val();
		var nickname = $("[name='nickname']").val();
		var contact = $("[name='contact']").val();
		var wechatNo = $("[name='wechatNo']").val();
		
		//step2
		var merchantCode = $("[name='merchantCode']").val();
		var merchantName = $("[name='merchantName']").val();
		var merchantContact = $("[name='merchantContact']").val();
		var wechatMembership = $("[name='wechatMembership']").val();
		var website = $("[name='website']").val();
		var websiteName = $("[name='websiteName']").val();
		var contactMobile = $("[name='contactMobile']").val();
		var merchantEmail = $("[name='merchantEmail']").val();
		var freight = $("[name='freight']").val();
		var minFreight = $("[name='minFreight']").val();
		var freightTime = $("[name='freightTime']").val();
		var freightArea = $("[name='freightArea']").val();
		var starttime = $("[name='starttime']").val();
		var endtime = $("[name='endtime']").val();
		var fax = $("[name='fax']").val();
		
		//step3
		var userIcon = $("[name='userIcon']").val();
		var server = $("[name='server']").val();
		var database = $("[name='database']").val();
		var port = $("[name='port']").val();
		var account = $("[name='account']").val();
		var databasePassword = $("[name='databasePassword']").val();
		var bankAccountUser = $("[name='bankAccountUser']").val();
		var bankName = $("[name='bankName']").val();
		var bankInfo = $("[name='bankInfo']").val();
		var bankAccountInfo = $("[name='bankAccountInfo']").val();
		var bankAccountNo = $("[name='bankAccountNo']").val();
		var bankAccountUserName = $("[name='bankAccountUserName']").val();
		
		if(!bankAccountUser){
			$("[name='bankAccountUserAlert']").html("银行账户所有人不能为空!");
			$("[name='bankAccountUserAlert']").removeClass("hide");
		}
		else if(!bankName){
			$("[name='bankAccountUserAlert']").addClass("hide");
			
			$("[name='bankNameAlert']").html("开户银行不能为空!");
			$("[name='bankNameAlert']").removeClass("hide");
		}
		else if(!bankInfo){
			$("[name='bankAccountUserAlert']").addClass("hide");
			$("[name='bankNameAlert']").addClass("hide");
			
			$("[name='bankInfoAlert']").html("开户银行省市信息不能为空!");
			$("[name='bankInfoAlert']").removeClass("hide");
		}
		else if(!bankAccountInfo){
			$("[name='bankAccountUserAlert']").addClass("hide");
			$("[name='bankNameAlert']").addClass("hide");
			$("[name='bankInfoAlert']").addClass("hide");
			
			$("[name='bankAccountInfoAlert']").html("开户详细名称不能为空!");
			$("[name='bankAccountInfoAlert']").removeClass("hide");
		}
		else if(!bankAccountNo){
			$("[name='bankAccountUserAlert']").addClass("hide");
			$("[name='bankNameAlert']").addClass("hide");
			$("[name='bankInfoAlert']").addClass("hide");
			$("[name='bankAccountInfoAlert']").addClass("hide");
			
			$("[name='bankAccountNoAlert']").html("银行账户不能为空!");
			$("[name='bankAccountNoAlert']").removeClass("hide");
		}
		else if(!bankAccountUserName){
			$("[name='bankAccountUserAlert']").addClass("hide");
			$("[name='bankNameAlert']").addClass("hide");
			$("[name='bankInfoAlert']").addClass("hide");
			$("[name='bankAccountInfoAlert']").addClass("hide");
			$("[name='bankAccountNoAlert']").addClass("hide");
			
			$("[name='bankAccountUserNameAlert']").html("开户名称不能为空!");
			$("[name='bankAccountUserNameAlert']").removeClass("hide");
		}
		else{
			$("[name='bankAccountUserAlert']").addClass("hide");
			$("[name='bankNameAlert']").addClass("hide");
			$("[name='bankInfoAlert']").addClass("hide");
			$("[name='bankAccountInfoAlert']").addClass("hide");
			$("[name='bankAccountNoAlert']").addClass("hide");
			$("[name='bankAccountUserNameAlert']").addClass("hide");
			
			$("#userSet").addClass("hide");
			$(".backGround").height($(document).height()+"px");
			$(".backGround").fadeTo("slow",0.5);
			//第4步的step
			//$("#step1").removeClass("prev").addClass("pprev");
			$("#step2").removeClass("prev").addClass("pprev");
			$("#step3").removeClass("on").addClass("prev");
			$("#step4").removeClass("next").addClass("on");
			
			$("#registerFinish").removeClass("hide");
			
			//执行ajax操作,插入数据库，把所有信息都带过去
			var postData = "loginName=" + loginName + "&password=" + password
			+ "&email=" + email + "&mobile=" + mobile + "&nickname=" + nickname
			+ "&contact=" + contact + "&wechatNo=" + wechatNo 
			+ "&merchantCode=" + merchantCode + "&merchantName=" + merchantName
			+ "&merchantContact=" + merchantContact + "&wechatMembership=" + wechatMembership
			+ "&website=" + website + "&websiteName=" + websiteName + "&contactMobile=" + contactMobile
			+ "&merchantEmail=" + merchantEmail + "&freight=" + freight + "&minFreight=" + minFreight
			+ "&freightTime="  + freightTime + "&freightArea=" + freightArea + "&starttime=" + starttime
			+ "&endtime=" + endtime + "&fax=" + fax + "&userIcon=" + userIcon + "&server=" + server
			+ "&database=" + database + "&port=" + port + "&account=" + account 
			+ "&databasePassword=" + databasePassword +"&bankAccountUser=" + bankAccountUser
			+ "&bankName=" + bankName + "&bankInfo=" + bankInfo + "&bankAccountInfo=" + bankAccountInfo
			+ "&bankAccountNo=" + bankAccountNo + "&bankAccountUserName=" + bankAccountUserName;
			
			//打印postData
			//console.log(postData);
			
			//调用ajax，将数据插入数据库
			//调用ajax
			$.ajax({
				url:"/WeStoreOperation/index.php/westore/registerNewRole",
				type:"POST",
				data:postData,
				dataType:"json",
				error:function(){
					alert("注册失败!请联系管理员。");
				},
				success:function(data){
					if(data.errcode > 0){
						//定时跳转（跳转到主页面去)
						
						//跳转到导航页
						var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/accountView';",1000);
					}
					else{
						alert("注册失败!请联系管理员。");
					}
				}
			});
		}
		
	});
	
	//第四步关闭提示框
	$("[name='closeRegisterFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#registerFinish").addClass("hide");
	});
};

//对部分输入框进行失去焦点的事件判断操作
WeStoreRegister.blurInputs = function(){
	
	//判断输入框进行失去焦点操作
	$("[name='loginName']").blur(function(){
		var loginName = $("[name='loginName']").val();
		if(loginName.length < 6 || !WeStoreRegister.checkLoginName(loginName)){
			$("[name='loginNameAlert']").html("登录名称必须是6位以上的字母或者数字！");
			$("[name='loginNameAlert']").removeClass("hide");
		}
		else if(!WeStoreRegister.checkLoginNameRepeat(loginName)){
			$("[name='loginNameAlert']").html("这个登录账号已经有人注册！");
			$("[name='loginNameAlert']").removeClass("hide");
		}
		else{
			$("[name='loginNameAlert']").addClass("hide");
		}
	});

	$("[name='userPassword']").blur(function(){
		
		var password = $("[name='userPassword']").val();
		//看两个输入的密码是否为空
		if(!password){
			$("[name='userPasswordAlert']").html("密码不能为空！");
			$("[name='userPasswordAlert']").removeClass("hide");
		}
		else if(password.length < 6){
			$("[name='userPasswordAlert']").html("密码必须6位以上！");
			$("[name='userPasswordAlert']").removeClass("hide");
		}
		else{
			$("[name='userPasswordAlert']").addClass("hide");
		}
	});
		
	$("[name='userPassword2']").blur(function(){
		//判断密码是否前后一致
		var password = $("[name='userPassword']").val();
		var password2 = $("[name='userPassword2']").val();
		if(!password2){
			$("[name='userPassword2Alert']").html("密码不能为空！");
			$("[name='userPassword2Alert']").removeClass("hide");
		}
		//再看跟前面输入的密码是否一致
		else if(password2 != password){
			$("[name='userPassword2Alert']").html("两次输入的密码不一致！");
			$("[name='userPassword2Alert']").removeClass("hide");
		}
		else{
			$("[name='userPassword2Alert']").addClass("hide");
		}
	});
	
	$("[name='email']").blur(function(){
		//然后看邮箱地址是否符合规范
		var email = $("[name='email']").val();
		if(!email){
			$("[name='emailAlert']").html("邮箱地址不能为空!");
			$("[name='emailAlert']").removeClass("hide");
		}
		//判断邮箱地址格式是否正确
		else if(!WeStoreRegister.checkEmail(email)){
			$("[name='emailAlert']").html("邮箱地址格式错误!");
			$("[name='emailAlert']").removeClass("hide");
		}
		else{
			$("[name='emailAlert']").addClass("hide");
		}
	});
	
	$("[name='mobile']").blur(function(){
		//最后验证手机号码
		var mobile = $("[name='mobile']").val();
		if(!mobile){	
			$("[name='mobileAlert']").html("手机号码不能为空!");
			$("[name='mobileAlert']").removeClass("hide");
		}
		//判断电话号码是否符合规格
		else if(!WeStoreRegister.checkMobile(mobile)){
			$("[name='mobileAlert']").html("手机号码格式错误!");
			$("[name='mobileAlert']").removeClass("hide");
		}
		else{
			$("[name='mobileAlert']").addClass("hide");
		}
	});
	
	//判断用户昵称
	$("[name='nickname']").blur(function(){
		//判断昵称是否为空
		var nickname = $("[name='nickname']").val();
		if(!nickname){
			$("[name='nicknameAlert']").html("昵称不能为空!");
			$("[name='nicknameAlert']").removeClass("hide");
		}
		else{
			$("[name='nicknameAlert']").addClass("hide");
		}
	});
	
	//判断联系人
	$("[name='contact']").blur(function(){
		//判断联系人是否为空
		var contact = $("[name='contact']").val();
		if(!contact){
			$("[name='contactAlert']").html("联系人不能为空!");
			$("[name='contactAlert']").removeClass("hide");
		}
		else{
			$("[name='contactAlert']").addClass("hide");
		}
	});
	
	//判断微信号
	$("[name='wechatNo']").blur(function(){
		var wechatNo = $("[name='wechatNo']").val();
		//判断微信号是否为空
		if(!wechatNo){
			$("[name='wechatNoAlert']").html("微信号不能为空!");
			$("[name='wechatNoAlert']").removeClass("hide");
		}
		else{
			$("[name='wechatNoAlert']").addClass("hide");
		}
	});
	
	$("[name='merchantCode']").blur(function(){
		var merchantCode = $("[name='merchantCode']").val();
		//如果商家编码为空
		if(!merchantCode){
			$("[name='merchantCodeAlert']").html("商家编码不能为空!");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		//判断商家编码是否重复
		//返回:true——没有人用;false——已经有人用了
		else if(!WeStoreRegister.checkMerchantCodeRepeat(merchantCode)){
			$("[name='merchantCodeAlert']").html("这个商家编码已经有人注册！");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		//如果商家编码不通过校验
		else if(!WeStoreRegister.checkMerchantCode(merchantCode)){
			$("[name='merchantCodeAlert']").html("商家编码必须为8位数字和字母的组合!");
			$("[name='merchantCodeAlert']").removeClass("hide");
		}
		else{
			$("[name='merchantCodeAlert']").addClass("hide");
		}
	});
	
	$("[name='merchantName']").blur(function(){
		var merchantName = $("[name='merchantName']").val();
		if(!merchantName){
			$("[name='merchantNameAlert']").html("商家名称不能为空!");
			$("[name='merchantNameAlert']").removeClass("hide");
		}
		else{
			$("[name='merchantNameAlert']").addClass("hide");
		}
	});
	
	$("[name='merchantContact']").blur(function(){
		var contact = $("[name='merchantContact']").val();
		if(!contact){
			$("[name='merchantContactAlert']").html("联系人不能为空!");
			$("[name='merchantContactAlert']").removeClass("hide");
		}
		else{
			$("[name='merchantContactAlert']").addClass("hide");
		}
	});
	
	$("[name='contactMobile']").blur(function(){
		var contactMobile = $("[name='contactMobile']").val();
		if(!contactMobile){
			$("[name='contactMobileAlert']").html("联系电话不能为空!");
			$("[name='contactMobileAlert']").removeClass("hide");
			
		}
		//校验电话格式
		else if(!WeStoreRegister.checkMobile(contactMobile)){
			$("[name='contactMobileAlert']").html("联系电话格式错误!");
			$("[name='contactMobileAlert']").removeClass("hide");
		}
		else{
			$("[name='contactMobileAlert']").addClass("hide");
		}
	});
	
	$("[name='merchantEmail']").blur(function(){
		var merchantEmail = $("[name='merchantEmail']").val();
		if(!merchantEmail){
			$("[name='merchantEmailAlert']").html("商户邮箱地址不能为空!");
			$("[name='merchantEmailAlert']").removeClass("hide");
		}
		//校验商户邮箱地址是否正确
		else if(!WeStoreRegister.checkEmail(merchantEmail)){
			$("[name='merchantEmailAlert']").html("商户邮箱地址格式错误!");
			$("[name='merchantEmailAlert']").removeClass("hide");
		}
		else{
			$("[name='merchantEmailAlert']").addClass("hide");
		}
	});
	
	$("[name='freight']").blur(function(){
		var freight = $("[name='freight']").val();
		if(!freight){		
			$("[name='freightAlert']").html("运费一栏不能为空");
			$("[name='freightAlert']").removeClass("hide");
		}
		//看是否通过校验
		else if(!WeStoreRegister.checkMoney(freight)){
			$("[name='freightAlert']").html("运费输入格式错误!");
			$("[name='freightAlert']").removeClass("hide");
		}
		else{
			$("[name='freightAlert']").addClass("hide");
		}
	});
	
	$("[name='minFreight']").blur(function(){
		var minFreight = $("[name='minFreight']").val();
		if(!minFreight){
			$("[name='minFreightAlert']").html("最低配送不能为空");
			$("[name='minFreightAlert']").removeClass("hide");
		}
		else if(!WeStoreRegister.checkMoney(minFreight)){
			$("[name='minFreightAlert']").html("最低配送格式错误!");
			$("[name='minFreightAlert']").removeClass("hide");
		}
		else{
			$("[name='minFreightAlert']").addClass("hide");
		}
	});
	
	$("[name='freightTime']").blur(function(){
		var freightTime = $("[name='freightTime']").val();
		if(!freightTime){
			$("[name='freightTimeAlert']").html("配送时间不能为空!");
			$("[name='freightTimeAlert']").removeClass("hide");
		}
		//校验配送时间
		else if(!WeStoreRegister.checkNumber(freightTime)){
			$("[name='freightTimeAlert']").html("配送时间格式错误!");
			$("[name='freightTimeAlert']").removeClass("hide");
		}
		else{
			$("[name='freightTimeAlert']").addClass("hide");
		}
	});
	
	$("[name='freightArea']").blur(function(){
		var freightArea = $("[name='freightArea']").val();
		if(!freightArea){
			$("[name='freightAreaAlert']").html("配送范围不能为空!");
			$("[name='freightAreaAlert']").removeClass("hide");
		}
		else{
			$("[name='freightAreaAlert']").addClass("hide");
		}
	});
	
	$("[name='bankAccountUser']").blur(function(){
		var bankAccountUser = $("[name='bankAccountUser']").val();
		if(!bankAccountUser){
			$("[name='bankAccountUserAlert']").html("银行账户所有人不能为空!");
			$("[name='bankAccountUserAlert']").removeClass("hide");
		}
		else{
			$("[name='bankAccountUserAlert']").addClass("hide");
		}
	});
	
	$("[name='bankName']").blur(function(){
		var bankName = $("[name='bankName']").val();
		if(!bankName){
			$("[name='bankNameAlert']").html("开户银行不能为空!");
			$("[name='bankNameAlert']").removeClass("hide");
		}
		else{
			$("[name='bankNameAlert']").addClass("hide");
		}
	});
	
	$("[name='bankInfo']").blur(function(){
		var bankInfo = $("[name='bankInfo']").val();
		if(!bankInfo){
			$("[name='bankInfoAlert']").html("开户银行省市信息不能为空!");
			$("[name='bankInfoAlert']").removeClass("hide");
		}
		else{
			$("[name='bankInfoAlert']").addClass("hide");
		}
	});
	
	$("[name='bankAccountInfo']").blur(function(){
		var bankAccountInfo = $("[name='bankAccountInfo']").val();
		if(!bankAccountInfo){
			$("[name='bankAccountInfoAlert']").html("开户详细名称不能为空!");
			$("[name='bankAccountInfoAlert']").removeClass("hide");
		}
		else{
			$("[name='bankAccountInfoAlert']").addClass("hide");
		}
	});
	
	$("[name='bankAccountNo']").blur(function(){
		var bankAccountNo = $("[name='bankAccountNo']").val();
		if(!bankAccountNo){
			$("[name='bankAccountNoAlert']").html("银行账户不能为空!");
			$("[name='bankAccountNoAlert']").removeClass("hide");
		}
		else{
			$("[name='bankAccountNoAlert']").addClass("hide");
		}
	});
	
	$("[name='bankAccountUserName']").blur(function(){
		var bankAccountUserName = $("[name='bankAccountUserName']").val();
		if(!bankAccountUserName){
			$("[name='bankAccountUserNameAlert']").html("开户名称不能为空!");
			$("[name='bankAccountUserNameAlert']").removeClass("hide");
		}
		else{
			$("[name='bankAccountUserNameAlert']").addClass("hide");
		}
	});
};

//对登录名进行是否只含有数字或字母的判断
WeStoreRegister.checkLoginName = function(value){
	var reg=new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

//对邮箱地址是否合格进行判断
WeStoreRegister.checkEmail = function(value){
	var reg=new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

//对电话号码进行判断
WeStoreRegister.checkMobile = function(value){
	var reg=new RegExp(/^1\d{10}$/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

//校验商家编码
WeStoreRegister.checkMerchantCode = function(value){
	var reg=new RegExp(/^\d{8}$/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

//对金钱进行校验
WeStoreRegister.checkMoney = function(value){
	var regu = "(^[1-9]+[\.][0-9]{1,2}?$)|(^[0-9]+?$)|(^[0]$)|(^[0][\.][0-9]{1,2}?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

//校验整数
WeStoreRegister.checkNumber = function(value){
	var regu = "(^[0-9]+?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

WeStoreRegister.checkMerchantCodeRepeat = function(merchantCode){
	var postData = "merchantCode=" + merchantCode;
	
	//记录ajax返回的结果
	var result = false;
	//调用ajax
	//console.log(postData);
	//注意这里：由于默认的ajax是异步传输调用，所以并不能同步返回结果，除非在ajax的async设为false（设为同步传输ajax）
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/checkMerchantCodeRepeat",
		type:"POST",
		data:postData,
		dataType:"json",
		async:false,
		error:function(){
			return false;
		},
		success:function(data){
			//如果data.errcode为0，说明密码校验成功
			//console.log(data.errcode);
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

WeStoreRegister.checkLoginNameRepeat = function(loginName){
	var postData =  "loginName=" + loginName;
	
	//记录ajax返回的结果
	var result = false;
	//调用ajax
	
	//注意这里：由于默认的ajax是异步传输调用，所以并不能同步返回结果，除非在ajax的async设为false（设为同步传输ajax）
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/checkLoginNameRepeat",
		type:"POST",
		data:postData,
		dataType:"json",
		async:false,
		error:function(){
			return false;
		},
		success:function(data){
			//如果data.errcode为0，说明密码校验成功
			//console.log(data.errcode);
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

WeStoreRegister.init();
