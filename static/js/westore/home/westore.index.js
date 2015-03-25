/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WeStoreHome;

/**************
 * 全局参数配置 
 */
WeStoreHome = {
	
};

/**************
 * 初始化配置 
 */
WeStoreHome.init = function(){
	this.bind();
};

/**************
 * 功能实现区
 */ 
WeStoreHome.bind = function(){
	//获取用户名
	if($.cookie("loginAccount")){
		$("input[name=username]").val($.cookie("loginAccount"));
		$("#memory_username").addClass("cbx-on");
	}
	
	//给登录框增加获取焦点事件
	$("input[name=username]").on('focus',function(){
		$(".login-form").removeClass("login-password-on");
    	$(".login-form").addClass("login-account-on");
    });
    $("input[name=password]").on('focus',function(){
		$(".login-form").removeClass("login-account-on");
    	$(".login-form").addClass("login-password-on");
    });
    
	//绑定点击记住帐号事件
    $("#memory_username").on('click', function() {
    	if ($(this).hasClass('cbx-on')) {
    		$(this).removeClass('cbx-on');
    	} else {
    		$(this).addClass('cbx-on');
    	}
    });
    
    //给登录按钮加事件
    $("#do_login").on('click',function(){
    	/*
    	if ($("#memory_username").hasClass('cbx-on')) {
    		$.cookie("loginAccount",$("input[name=username]").val(),{expires:600});
    	} else {  //create cookie
    		$.cookie("loginAccount",$("input[name=username]").val());
    	}*/
    	if($("input[name=username]").val() && $("input[name=password]").val()) {
    		var username = $("input[name=username]").val();
    		var password = $("input[name=password]").val();
    		
    		var postData = "username=" + username + "&password=" + password;
    		
    		//调用ajax，将数据插入数据库
    		//console.log(postData);
			//调用ajax
			$.ajax({
				url:"/WeStoreOperation/index.php/westore/submitLogin",
				type:"POST",
				data:postData,
				dataType:"json",
				error:function(){
					alert("登录失败!请联系管理员。");
				},
				success:function(data){
					if(data.errcode > 0){
						//定时跳转（跳转到主页面去)
						
						//跳转到导航页
						var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/accountView';",1000);
					}
					else{
						$("#errmsg").text('帐号或密码错误！');
					}
				}
			});
    	}
    	else{
    		$("#errmsg").text('请输入帐号和密码');
    	}
    });
    
};

WeStoreHome.init();
