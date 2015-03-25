/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var  WestoreAddProducts;

/**************
 * 全局参数配置 
 */

WestoreAddProducts = {
	
};

/**************
 * 初始化配置 
 */

WestoreAddProducts.init = function(){
	//先将所有菜单收起来
	$("dt").removeClass("open");
	//再将增加库存一栏打开并且选中功能
	$("[name='m_products']").addClass("open");
	$("[name='m_addProducts']").addClass("on");
	WestoreAddProducts.bind();
};


WestoreAddProducts.checkProductCode = function(value){
	var reg=new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
	if(reg.test(value)){
		return true;
	}else{
		return false;
	}
};

WestoreAddProducts.checkMoney = function(value){
	var regu = "(^[1-9]+[\.][0-9]{1,2}?$)|(^[0-9]+?$)|(^[0]$)|(^[0][\.][0-9]{1,2}?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

//校验整数
WestoreAddProducts.checkNumber = function(value){
	var regu = "(^[0-9]+?$)";
	var re = new RegExp(regu);
	if(re.test(value)) {
		return true;
	}else{
		return false;
	}
};

WestoreAddProducts.bindInputs = function(){
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
		if(productCode.length < 8 || !WestoreAddProducts.checkProductCode(productCode)){
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
		else if(!WestoreAddProducts.checkMoney(unitPrice)){
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
		else if(!WestoreAddProducts.checkNumber(inventory)){
			$("[name='inventoryAlert']").html("库存数量必须为数字！");
			$("[name='inventoryAlert']").removeClass("hide");
		}
		else{
			$("[name='inventoryAlert']").addClass("hide");
		}
	});
	
};

WestoreAddProducts.bindButtons = function(){
	
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
		else if(productCode.length < 8 || !WestoreAddProducts.checkProductCode(productCode)){
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
		else if(!WestoreAddProducts.checkMoney(unitPrice)){
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
		else if(!WestoreAddProducts.checkNumber(inventory)){
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
			
			//文件上传
			$.ajaxFileUpload({
				url:"/WeStoreOperation/index.php/westore/receiveSomeProducts",
				secureuri:false,
				fileElementId:'productPicture',
				dataType: 'json',
				data:{name:'logan', id:'id'},
				success: function (data, status){
					if(typeof(data.error) != 'undefined'){
						if(data.error != ''){
							alert(data.error);
						}
						else{
							
							fileName = data.msg;
							console.log(fileName);
							
							//调用ajax
							var postData = "fileName=" + fileName + "&productName=" + productName + "&productCode=" + productCode
							+ "&productStatus=" + productStatus + "&unitPrice=" + unitPrice + "&inventory=" + inventory + "&productRemark=" + productRemark;
							
							
							//console.log(postData);
							//调用ajax
							$.ajax({
								url:"/WeStoreOperation/index.php/westore/addSomeProducts",
								type:"POST",
								data:postData,
								dataType:"json",
								error:function(){
									alert("查询失败!");
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
										var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/addProducts';",1000);
									}
									//插入失败
									else{
										alert("插入失败！");
									}
								}
							});
						}	
					}
				},
				error: function (data, status, e){
					alert(e);
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
	
	
	
};

WestoreAddProducts.bindSelects = function(){
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


WestoreAddProducts.bind = function(){
	this.bindButtons();
	this.bindInputs();
	this.bindSelects();
};

WestoreAddProducts.init();

