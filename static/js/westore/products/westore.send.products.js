/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreSendProducts;

/**************
 * 全局参数配置 
 */

WestoreSendProducts = {
	
};

/**************
 * 初始化配置 
 */

WestoreSendProducts.init = function(){
	WestoreSendProducts.bind();
};

WestoreSendProducts.bind = function(){
	WestoreSendProducts.bindRefund();
	WestoreSendProducts.bindButton();
};

WestoreSendProducts.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
    	return unescape(r[2]);
    }
    return null;
};

WestoreSendProducts.bindButton = function(){
	$("[name='closeRefundFinish']").on('click',function(){
		window.opener=null;
		window.close();
	});
	
	$("[name='RefundFinishConfirm']").on('click',function(){
		window.opener=null;
		window.close();
	});
};

WestoreSendProducts.bindRefund = function(){
	//调用ajax
	//发货的动作：修改订单状态，插入订单流水
	var userNo = $.cookie("userNo");
	var orderNo = this.getQueryString("orderNo");
	postData = "userNo=" + userNo + "&orderNo=" + orderNo;
	console.log(postData);
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/sendSomeProducts",
		type:"POST",
		data:postData,
		dataType:"json",
		error:function(){
			alert("退款失败!");
		},
		success:function(data){
			//无符合查询条件的自动屏蔽
			if(data.errcode > 0){
				$(".backGround").height($(document).height()+"px");
				$(".backGround").fadeTo("slow",0.5);
						
				$("#refundFinish").removeClass("hide");
			}
			else{
				alert("退款失败!请联系管理员!");
			}
		}
	});
};

WestoreSendProducts.init();

