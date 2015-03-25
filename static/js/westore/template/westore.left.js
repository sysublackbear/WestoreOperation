/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreLeft;

/**************
 * 全局参数配置 
 */

WeStoreLeft = {
	
};

/**************
 * 初始化配置 
 */
WeStoreLeft.init = function(){
	this.bind();
	//this.bindMenu();
};

/**************
 * 功能实现区
 */ 
WeStoreLeft.bind = function(){
	$("dt").on('click', function() {
		if (!$(this).hasClass('no-child-dt')) {
			if ($(this).parent().hasClass('open')) {
				$(this).parent().removeClass('open');
			} else {
				$(this).parent().addClass('open');
			}
		}
	});

	$("dd").on('click', function(event) {
		$("dt.on,dd.on").removeClass('on');
		$(this).addClass('on');
	});
	
	//判断使用哪一种左边栏
	var merchantNo = $.cookie("merchantNo");
	var userNo = $.cookie("userNo");
	
	//商户版
	if(merchantNo && userNo){
		$("#merchantLeft").removeClass("hide");
		$("#UserLeft").addClass("hide");
	}
	else if(!merchantNo && userNo){
		$("#merchantLeft").addClass("hide");
		$("#UserLeft").removeClass("hide");
	}
};

WeStoreLeft.init();
