/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var  WestoreBuyProducts;

/**************
 * 全局参数配置 
 */

WestoreBuyProducts = {
	
};

/**************
 * 初始化配置 
 */

var orderNo = '';
var orderMoney = '';
var m_productNo = '';
var m_buyAmount='';

WestoreBuyProducts.init = function(){
	//先将所有菜单收起来
	$("dt").removeClass("open");
	//再将增加库存一栏打开并且选中功能
	$("[name='m_products']").addClass("open");
	$("[name='m_addProducts']").addClass("on");
	WestoreBuyProducts.bind();
};


WestoreBuyProducts.checkProductCode = function(value){
	var reg=new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

WestoreBuyProducts.checkMoney = function(value){
	var regu = "(^[1-9]+[\.][0-9]{1,2}?$)|(^[0-9]+?$)|(^[0]$)|(^[0][\.][0-9]{1,2}?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

//校验整数
WestoreBuyProducts.checkNumber = function(value){
	var regu = "(^[0-9]+?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

WestoreBuyProducts.bindInputs = function(){
	
	$("[name='buyAmount']").blur(function(){
		var buyAmount = $("[name='buyAmount']").val();
		var inventory = $("[name='inventory']").val();
		if(parseInt(buyAmount) > parseInt(inventory)){
			$("[name='buyAmountAlert']").html("超出库存数量!");
			$("[name='buyAmountAlert']").removeClass("hide");
		}
		else if(buyAmount == 0){
			$("[name='buyAmountAlert']").html("购买数量不能为0!");
			$("[name='buyAmountAlert']").removeClass("hide");
		}
		else{
			$("[name='buyAmountAlert']").addClass("hide");
		}
	});
	
	$("[name='productName']").blur(function(){
		var productName = $("[name='productName']").val();
		if(!productName){
			$("[name='productNameAlert']").html("商品名称不能为空!");
			$("[name='productNameAlert']").removeClass("hide");
		}
		else{
			$("[name='productNameAlert']").addClass("hide");
		}
	});
	
	$("[name='productCode']").blur(function(){
		var productCode = $("[name='productCode']").val();
		if(productCode.length < 8 || !WestoreBuyProducts.checkProductCode(productCode)){
			$("[name='productCodeAlert']").html("商品条码必须是8位以上数字和英文的组合!");
			$("[name='productCodeAlert']").removeClass("hide");
		}
		else{
			$("[name='productCodeAlert']").addClass("hide");
		}
	});
	
	$("[name='unitPrice']").blur(function(){
		var unitPrice = $("[name='unitPrice']").val();
		if(!unitPrice){
			$("[name='unitPriceAlert']").html("商品单价不能为空！");
			$("[name='unitPriceAlert']").removeClass("hide");
		}
		else if(!WestoreBuyProducts.checkMoney(unitPrice)){
			$("[name='unitPriceAlert']").html("商品单价格式错误！");
			$("[name='unitPriceAlert']").removeClass("hide");
		}
		else{
			$("[name='unitPriceAlert']").addClass("hide");
		}
	});
	
	$("[name='inventory']").blur(function(){
		var inventory = $("[name='inventory']").val();
		if(!inventory){
			$("[name='inventoryAlert']").html("库存数量不能为空！");
			$("[name='inventoryAlert']").removeClass("hide");
		}
		else if(!WestoreBuyProducts.checkNumber(inventory)){
			$("[name='inventoryAlert']").html("库存数量必须为数字！");
			$("[name='inventoryAlert']").removeClass("hide");
		}
		else{
			$("[name='inventoryAlert']").addClass("hide");
		}
	});
	
};

WestoreBuyProducts.getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
    	return unescape(r[2]);
    }
    return null;
};

WestoreBuyProducts.bindButtons = function(){
	
	$("[name='buyProducts']").on('click',function(){
		var buyAmount = $("[name='buyAmount']").val();
		var inventory = $("[name='inventory']").val();
		
		var productName = $("[name='productName']").val();
		var productCode = $("[name='productCode']").val();
		var productStatus = $("[name='productStatus']").val();
		var unitPrice = $("[name='unitPrice']").val();
		var freight = $("[name='freight']").val();
		var inventory = $("[name='inventory']").val();
		var productRemark = $("[name='productRemark']").val();
		
		if(parseInt(buyAmount) > parseInt(inventory)){
			$("[name='buyAmountAlert']").html("超出库存数量!");
			$("[name='buyAmountAlert']").removeClass("hide");
		}
		else if(buyAmount == 0){
			$("[name='buyAmountAlert']").html("购买数量不能为0!");
			$("[name='buyAmountAlert']").removeClass("hide");
		}
		else{
			$("[name='buyAmountAlert']").addClass("hide");
			
			//调用ajax
			var productNo = WestoreBuyProducts.getQueryString("productNo");
			
			var postData = "productNo=" + productNo +"&productName=" + productName + "&productCode=" + productCode
			+ "&productStatus=" + productStatus + "&unitPrice=" + unitPrice + "&inventory=" + inventory + "&productRemark=" + productRemark
			+ "&freight=" + freight + "&buyAmount=" + buyAmount;
			
			//console.log(postData);
			//调用ajax
			$.ajax({
				url:"/WeStoreOperation/index.php/westore/buySomeProducts",
				type:"POST",
				data:postData,
				dataType:"json",
				error:function(){
					alert("更改失败!");
				},
				success:function(data){
					//插入成功
					if(data.code == 0){
						//将所有的框封锁起来表示插入成功
						$("[name='productName']").attr("disabled",true);
						$("[name='productCode']").attr("disabled",true);
						$("[name='unitPrice']").attr("disabled",true);
						$("[name='inventory']").attr("disabled",true);
						$("[name='productRemark']").attr("disabled",true);
							
						$(".backGround").height($(document).height()+"px");
						$(".backGround").fadeTo("slow",0.5);
					
						$("#payProductConfirm").removeClass("hide");
						
						orderNo = data.orderNo;
						orderMoney = data.orderMoney;
						m_productNo = data.productNo;
						m_buyAmount = data.buyAmount;
						
						//console.log(orderNo);			
						//定时跳转（跳转到主页面去)
						//var t = setTimeout("window.location.href='http://www.baidu.com/';",1000);
										
						//执行插入操作(打印日志)
						//console.log(data.post);
						//跳转到导航页
						//var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/myProducts';",1000);
					}
					//插入失败
					else{
						alert("插入失败！");
					}
				}
			});

		}
	});
	
	$("[name='addProducts']").on('click',function(){
		var fileName = '';
		var productName = $("[name='productName']").val();
		var productCode = $("[name='productCode']").val();
		var productStatus = $("[name='productStatus']").text();
		var unitPrice = $("[name='unitPrice']").val();
		var inventory = $("[name='inventory']").val();
		var productRemark = $("[name='productRemark']").val();
	
	
		if(!productName){
			$("[name='productNameAlert']").html("商品名称不能为空!");
			$("[name='productNameAlert']").removeClass("hide");
		}
		else if(productCode.length < 8 || !WestoreBuyProducts.checkProductCode(productCode)){
			$("[name='productNameAlert']").addClass("hide");
			
			$("[name='productCodeAlert']").html("商品条码必须是8位以上数字和英文的组合！");
			$("[name='productCodeAlert']").removeClass("hide");
		}
		else if(!unitPrice){
			$("[name='productNameAlert']").addClass("hide");
			$("[name='productCodeAlert']").addClass("hide");
			
			$("[name='unitPriceAlert']").html("商品单价不能为空！");
			$("[name='unitPriceAlert']").removeClass("hide");
		}
		else if(!WestoreBuyProducts.checkMoney(unitPrice)){
			$("[name='productNameAlert']").addClass("hide");
			$("[name='productCodeAlert']").addClass("hide");
			
			$("[name='unitPriceAlert']").html("商品单价格式错误！");
			$("[name='unitPriceAlert']").removeClass("hide");
		}
		else if(!inventory){
			$("[name='productNameAlert']").addClass("hide");
			$("[name='productCodeAlert']").addClass("hide");
			$("[name='unitPriceAlert']").addClass("hide");
		
			$("[name='inventoryAlert']").html("库存数量不能为空！");
			$("[name='inventoryAlert']").removeClass("hide");
		}
		else if(!WestoreBuyProducts.checkNumber(inventory)){
			$("[name='productNameAlert']").addClass("hide");
			$("[name='productCodeAlert']").addClass("hide");
			$("[name='unitPriceAlert']").addClass("hide");
		
			$("[name='inventoryAlert']").html("库存数量必须为数字！");
			$("[name='inventoryAlert']").removeClass("hide");
		}
		else{
			$("[name='productNameAlert']").addClass("hide");
			$("[name='productCodeAlert']").addClass("hide");
			$("[name='unitPriceAlert']").addClass("hide");
			$("[name='inventoryAlert']").addClass("hide");
			
			
			//调用ajax
			var productNo = WestoreBuyProducts.getQueryString("productNo");
			
			var postData = "productNo=" + productNo +"&productName=" + productName + "&productCode=" + productCode
			+ "&productStatus=" + productStatus + "&unitPrice=" + unitPrice + "&inventory=" + inventory + "&productRemark=" + productRemark;
			
			//console.log(postData);
			//调用ajax
			$.ajax({
				url:"/WeStoreOperation/index.php/westore/updateSomeProducts",
				type:"POST",
				data:postData,
				dataType:"json",
				error:function(){
					alert("更改失败!");
				},
				success:function(data){
					//插入成功
					if(data.code == 0){
						//将所有的框封锁起来表示插入成功
						$("[name='productName']").attr("disabled",true);
						$("[name='productCode']").attr("disabled",true);
						$("[name='unitPrice']").attr("disabled",true);
						$("[name='inventory']").attr("disabled",true);
						$("[name='productRemark']").attr("disabled",true);
							
						$(".backGround").height($(document).height()+"px");
						$(".backGround").fadeTo("slow",0.5);
					
						$("#insertFinish").removeClass("hide");
										
						//定时跳转（跳转到主页面去)
						//var t = setTimeout("window.location.href='http://www.baidu.com/';",1000);
										
						//执行插入操作(打印日志)
						//console.log(data.post);
						//跳转到导航页
						var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/myProducts';",1000);
					}
					//插入失败
					else{
						alert("插入失败！");
					}
				}
			});

		}
	});
	
	$("[name='closeInsertFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#insertFinish").addClass("hide");
	});
	
	$("[name='InsertProductsConfirm']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#insertFinish").addClass("hide");
	});
	
	//点击删除按钮
	$("[name='deleteProducts']").on('click',function(){
		$(".backGround").height($(document).height()+"px");
		$(".backGround").fadeTo("slow",0.5);
					
		$("#deleteProductConfirm").removeClass("hide");
	});
	
	$("[name='closedeleteProduct']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#deleteProductConfirm").addClass("hide");
	});
	
	$("[name='cancelDeleteProduct']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#deleteProductConfirm").addClass("hide");
	});
	
	//确认删除按钮
	$("[name='confirmDeleteProduct']").on('click',function(){
		//调用ajax
		var productNo = WestoreBuyProducts.getQueryString("productNo");
			
		var postData = "productNo=" + productNo;
			
		//console.log(postData);
		//调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/deleteSomeProducts",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("删除失败!");
			},
			success:function(data){
				//插入成功
				if(data.code == 0){
					//将所有的框封锁起来表示插入成功
					$("[name='productName']").attr("disabled",true);
					$("[name='productCode']").attr("disabled",true);
					$("[name='unitPrice']").attr("disabled",true);
					$("[name='inventory']").attr("disabled",true);
					$("[name='productRemark']").attr("disabled",true);
							
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#deleteProductConfirm").addClass("hide");
					$("#deleteFinish").removeClass("hide");
										
					//定时跳转（跳转到主页面去)
					//var t = setTimeout("window.location.href='http://www.baidu.com/';",1000);
										
					//执行插入操作(打印日志)
					//console.log(data.post);
					//跳转到导航页
					var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/myProducts';",1000);
				}
				//插入失败
				else{
					alert("删除失败！");
				}
			}
		});
	});
	
	
	$("[name='closeDeleteFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#deleteFinish").addClass("hide");
	});
	
	$("[name='DeleteProductsConfirm']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#deleteFinish").addClass("hide");
	});
	
	$("[name='closePayProduct']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#payProductConfirm").addClass("hide");
	});
	
	$("[name='cancelPayProduct']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#payProductConfirm").addClass("hide");
	});
	
	//确认支付按钮按钮
	$("[name='confirmPayProduct']").on('click',function(){
		//调用ajax
			
		var postData = "orderNo=" + orderNo + "&orderMoney=" + orderMoney + "&productNo=" + m_productNo + "&buyAmount=" + m_buyAmount;
			
		//console.log(postData);
		//调用ajax
		//完成支付动作，插入订单流水表，修改订单状态，扣钱
		
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/finishPayProducts",
			type:"POST",
			data:postData,
			dataType:"json",
			error:function(){
				alert("支付失败!");
			},
			success:function(data){
				//插入成功
				if(data.code == 0){
					//将所有的框封锁起来表示插入成功
					$("[name='productName']").attr("disabled",true);
					$("[name='productCode']").attr("disabled",true);
					$("[name='unitPrice']").attr("disabled",true);
					$("[name='inventory']").attr("disabled",true);
					$("[name='productRemark']").attr("disabled",true);
							
					$(".backGround").height($(document).height()+"px");
					$(".backGround").fadeTo("slow",0.5);
					
					$("#payProductConfirm").addClass("hide");
					$("#payFinish").removeClass("hide");
										
					//定时跳转（跳转到主页面去)
					//var t = setTimeout("window.location.href='http://www.baidu.com/';",1000);
										
					//执行插入操作(打印日志)
					//console.log(data.post);
					//跳转到导航页
					var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/consumeManage';",1000);
				}
				else if(data.code == -1){
					$(".backGround").fadeOut("slow");
					$("#payFinish").addClass("hide");
					alert("余额不足！支付失败！");
				}
				//支付失败
				else{
					alert("支付失败！");
				}
			}
		});
	});
	
	$("[name='closePayFinish']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#payFinish").addClass("hide");
		//跳到我所购买的商品页面
		var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/consumeManage';",1000);
	});
	
	$("[name='PayFinishConfirm']").on('click',function(){
		$(".backGround").fadeOut("slow");
		$("#payFinish").addClass("hide");
		//跳到我所购买的商品页面
		var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/consumeManage';",1000);
	});
};

WestoreBuyProducts.bindSelects = function(){
	$("div.dropdown-menu").on('click', function() {
		$(this).addClass('open');

	});

	$("ul.dropdown-list").on('click', 'li', function() {
		
		var value = $(this).children("a").attr('data-target');
		var text = $(this).children("a").text();
		var drop_switch = $(this).parent().prev("a.dropdown-switch");
		drop_switch.attr('data-target', value);
		drop_switch.children('label').text(text);
		//drop_switch.children('input').val(text);
		var id = drop_switch.children('label').attr('id');
		
		var name = drop_switch.children('label').html();
		$(this).parent().parent().removeClass('open');
		
		typeof SelectCallBack == 'function' && SelectCallBack(id, name);
		return false;
		
	});
	
	$("div.dropdown-menu").mouseleave(function() {
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
		}
	});
};


WestoreBuyProducts.bind = function(){
	this.bindButtons();
	this.bindInputs();
	this.bindSelects();
};

WestoreBuyProducts.init();

