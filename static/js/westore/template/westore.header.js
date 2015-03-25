/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WeStoreHeader;

/**************
 * 全局参数配置 
 */

WeStoreHeader = {
	
};

/**************
 * 初始化配置 
 */
WeStoreHeader.init = function(){
	this.bind();
};

/**************
 * 功能实现区
 */ 
WeStoreHeader.bind = function(){
	var userNo = $.cookie("userNo");
	if(!userNo){
		$("#first-use").removeClass("hide");
		$("#is-login").addClass("hide");
		$("#return-login").addClass("hide");
	}
	else{
		$("#is-login").removeClass("hide");
		$("#first-use").addClass("hide");
		$("#return-login").addClass("hide");
	}
	
	//设定昵称
	var headerNickname = $.cookie("nickname");
	$("[name='header-nickname']").text(headerNickname);
};

WeStoreHeader.init();

