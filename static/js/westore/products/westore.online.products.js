/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var  WestoreOnlineProducts;

/**************
 * 全局参数配置 
 */

WestoreOnlineProducts = {
	
};

/**************
 * 初始化配置 
 */

var tempdata = new Array();
var tempunitprice = new Array();

WestoreOnlineProducts.isPInt = function(v) {
	var reg = new RegExp("^[1-9][0-9]*$");
 	return reg.test(v);
};

WestoreOnlineProducts.init = function(){
	//先将所有菜单收起来
	$("dt").removeClass("open");
	//再将在线商品一栏打开并且选中功能
	WestoreOnlineProducts.bind();
};

WestoreOnlineProducts.showQueryResult = function(data){
	
	//先清空数据
	$("#result").html("");
	
	var len = data.post.length;
	//导入数据
	var menu = new Array();
	for(var i = 0;i < len;i++){
		var item = new Array();
		item[0] = data.post[i].lineno;
		item[1] = data.post[i].productPic;
		item[2] = data.post[i].merchantCode;
		item[3] = data.post[i].merchantName;
		item[4] = data.post[i].productName;
		item[5] = data.post[i].unitprice;
		item[6] = data.post[i].productCode;
		item[7] = data.post[i].inventory;
		item[8] = data.post[i].productStatus;
		item[9] = data.post[i].productNo;
		menu[i] = item;
	}
	var tdata = {
		isAdmin:true,
		list:menu
	};
	//利用模板导入
	var html = template('productslist',tdata);
	//先清空
	$('#result').empty();
	$(html).appendTo($('#result'));
	
	//alert(data.post[0].datetime);
};

//获取当前文件名
WestoreOnlineProducts.QueryFileName = function(){
	var strUrl=window.location.href;
	var arrUrl=strUrl.split("/");
	var strPage=arrUrl[arrUrl.length-1];
	return strPage;
};

//根据筛选条件查找商品
WestoreOnlineProducts.QueryProducts = function(index){
	//商家名称
	var merchantName = $("[name='merchant']").val();
	//商品名称
	var productsName = $("[name='products']").val();
	//商品编码
	var productsCode = $("[name='productsCode']").val();
	
	var funcName = this.QueryFileName();
	
	//传递参数ajax（别忘了把页码传过去）
	var postData = "merchantName=" + merchantName + "&productsName=" + productsName
	+ "&productsCode=" + productsCode + "&page=" + index + "&funcName=" + funcName;
	
	console.log(postData);
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/queryProducts",
		type:"POST",
		data:postData,
		dataType:"json",
		error:function(){
			alert("查询失败!");
		},
		success:function(data){
			//无符合查询条件的自动屏蔽
			console.log(data.post2);
			if(data.totalNum > 0){
				$("#no-order").addClass("hide");
				$("#productsPage").removeClass("hide");
				$("#result").removeClass("hide");
				$("[name='pageno']").val("");
				WestoreOnlineProducts.showQueryResult(data);	
				$("label[name=curpage]").text(data.curpage);
				$("label[name=total_page]").text(data.total_page);
				
				//同时让相关的按钮显示（出来）
				$("[name='productsUpdate']").removeClass("hide");
				$("[name='productsExport']").removeClass("hide");
				$("[name='productsDelete']").removeClass("hide");
				$("[name='addToMyProducts']").removeClass("hide");
			}
			else if(data.totalNum == 0){
				$("#result").addClass("hide");
				$("#no-order").removeClass("hide");
				$("#productsPage").addClass("hide");
				
				//查不出结果则让各种按钮隐藏起来
				$("[name='productsUpdate']").addClass("hide");
				$("[name='productsExport']").addClass("hide");
				$("[name='productsDelete']").addClass("hide");
				$("[name='productsSave']").addClass("hide");
				$("[name='productsCancel']").addClass("hide");
				$("[name='productsConfirm']").addClass("hide");
			}
		}
	});
	
};

WestoreOnlineProducts.bindButtons = function(){
	//查询按钮
	$("[name='productsQuery']").on('click',function(){
		WestoreOnlineProducts.QueryProducts(1);
	});
	
	$("[name='closePayInfo']").on('click',function(){
		$("#payInfo").addClass("hide");
	});
	
	$("[name='finishPayInfo']").on('click',function(){
		//跳转到导航页
		var t = setTimeout("window.location.href='http://localhost/WeStoreOperation/index.php/westore/myBoughtProduct';",1000);
	});
	
	$("[name='problemPayInfo']").on('click',function(){
		$("#payInfo").addClass("hide");
		alert("支付失败!请联系管理员!");
	});
	
	
	//点击同步更新按钮
	$("[name='productsUpdate']").on('click',function(){
		$("[name='productsUpdate']").addClass("hide");
		$("[name='productsExport']").addClass("hide");
		$("[name='productsDelete']").addClass("hide");
		
		$("[name='productsSave']").removeClass("hide");
		$("[name='productsCancel']").removeClass("hide");
		
		//同时打开每个列表的输入框，使之变成可输入状态
		
		//获取tr的长度
		var trlength = $("#result").children("tr").length;
		for(var i = 0;i < trlength;i++){
			var tdlength = $("#result").children("tr").eq(i).children("td").length;
			var inputchoose = $("#result").children("tr").eq(i).children("td").eq(7).children("input");
			var unitpricechoose = $("#result").children("tr").eq(i).children("td").eq(5).children("input");
			tempunitprice[i] = unitpricechoose.attr("value");
			tempdata[i] = inputchoose.attr("value");
			inputchoose.attr("disabled",false);
			unitpricechoose.attr("disabled",false);
		} 
	});
	
	//点击加入到我的商品按钮
	$("[name='addToMyProducts']").on('click',function(){
		var addmyproductsdata = new Array();
		//获取tr的长度
		var trlength = $("#result").children("tr").length;
		var j = 0;
		for(var i = 0;i < trlength;i++){
			var temp = $("#result").children("tr").eq(i).children("td");
			var boolcheckbox = $("#result").children("tr").eq(i).children("td").eq(8).children("input");
			
			//如果checkbox被选中
			if(boolcheckbox.is(":checked") == true){
				//获取id
				addmyproductsdata[j++] = temp.eq(0).html();
			}
		}
		
		//获取完数据之后调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/addMyProducts",
			type:"POST",
			data:{'postData':addmyproductsdata},
			dataType:"json",
			error:function(){
				alert("查询失败!");
			},
			success:function(data){
				//先暂时返回更新成功的提示
				alert("add my products success!");
				//照理来说，应该先
				//console.log(data.post);
			}
		});	
	});
	
	//点击批量删除的按钮
	$("[name='productsDelete']").on('click',function(){
		$("[name='productsUpdate']").addClass("hide");
		$("[name='productsExport']").addClass("hide");
		$("[name='productsDelete']").addClass("hide");
		
		$("[name='productsConfirm']").removeClass("hide");
		$("[name='productsCancel']").removeClass("hide");
		
	});
	
	//点击取消按钮
	$("[name='productsCancel']").on('click',function(){
		$("[name='productsUpdate']").removeClass("hide");
		$("[name='productsExport']").removeClass("hide");
		$("[name='productsDelete']").removeClass("hide");
		
		$("[name='productsSave']").addClass("hide");
		$("[name='productsCancel']").addClass("hide");
		$("[name='productsConfirm']").addClass("hide");
		
		//同时还原数据
		
		//获取tr的长度
		var trlength = $("#result").children("tr").length;
		for(var i = 0;i < trlength;i++){
			var tdlength = $("#result").children("tr").eq(i).children("td").length;
			var inputchoose = $("#result").children("tr").eq(i).children("td").eq(7).children("input");
			var unitpricechoose = $("#result").children("tr").eq(i).children("td").eq(5).children("input");
			
			inputchoose.val(tempdata[i]);
			inputchoose.attr("disabled",true);
			unitpricechoose.val(tempunitprice[i]);
			unitpricechoose.attr("disabled",true);
		}
	});
	
	
	//点击保存按钮，向后台调用ajax来做update操作
	$("[name='productsSave']").on('click',function(){
		var savedata = new Array();
		//获取tr的长度
		var trlength = $("#result").children("tr").length;
		for(var i = 0;i < trlength;i++){
			var item = new Array();
			item[0] = $("#result").children("tr").eq(i).children("td").eq(0).html();
			item[1] = $("#result").children("tr").eq(i).children("td").eq(5).children("input").val();
			item[2] = $("#result").children("tr").eq(i).children("td").eq(7).children("input").val();
			savedata[i] = item;
		}
		
		//获取完数据之后调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/updateProducts",
			type:"POST",
			data:{'postData':savedata},
			dataType:"json",
			error:function(){
				alert("查询失败!");
			},
			success:function(data){
				//先暂时返回更新成功的提示
				alert("update success!");
				//照理来说，应该先
				//console.log(data.post);
			}
		});	
		//console.log(savedata[0][0]);
		//console.log(savedata[0][1]);
		//console.log(savedata[0][2]);
	});
	
	//点击确认删除按钮,向后台调用ajax来做delete操作
	$("[name='productsConfirm']").on('click',function(){
		var deletedata = new Array();
		//获取tr的长度
		var trlength = $("#result").children("tr").length;
		var j = 0;
		for(var i = 0;i < trlength;i++){
			var temp = $("#result").children("tr").eq(i).children("td");
			var boolcheckbox = $("#result").children("tr").eq(i).children("td").eq(8).children("input");
			
			//如果checkbox被选中
			if(boolcheckbox.is(":checked") == true){
				//获取id
				deletedata[j++] = temp.eq(0).html();
			}
		}
		
		//获取完数据之后调用ajax
		$.ajax({
			url:"/WeStoreOperation/index.php/westore/deleteProducts",
			type:"POST",
			data:{'postData':deletedata},
			dataType:"json",
			error:function(){
				alert("查询失败!");
			},
			success:function(data){
				//先暂时返回更新成功的提示
				alert("delete success!");
				//照理来说，应该先
				//console.log(data.post);
			}
		});	
	});
};

//分页函数
WestoreOnlineProducts.bindPage = function(classname, callback) {
	var parent_div = "div.pagination." + classname + " ";
	$(parent_div + " a.page-first").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreOnlineProducts.isPInt(curpage)) {
			callback(1);
		}
	});
	$(parent_div + "a.page-last").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if (total_page != curpage &&  WestoreOrderQuery.isPInt(curpage) && WestoreOnlineProducts.isPInt(total_page)) {
			callback(total_page);
		}
	});
	$(parent_div + "a.page-next").on('click', function() {
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		
		if (total_page != curpage && WestoreOnlineProducts.isPInt(curpage) && WestoreOnlineProducts.isPInt(total_page)) {
			callback(curpage + 1);
		}
	});
	$(parent_div + "a.page-prev").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreOnlineProducts.isPInt(curpage)) {
			callback(curpage - 1);
		}
	});
	$(parent_div + "a.page-go").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var go_page = parseInt($(parent_div + "input").val(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if ( WestoreOrderQuery.isPInt(curpage) && WestoreOnlineProducts.isPInt(total_page) && WestoreOnlineProducts.isPInt(go_page) && go_page <= total_page && go_page != curpage) {
			callback(go_page);
		}
	});
};

WestoreOnlineProducts.Do_search = function(page){
	WestoreOnlineProducts.QueryProducts(page);
};


WestoreOnlineProducts.bindPageButton = function(){
	WestoreOnlineProducts.bindPage('products_page', WestoreOnlineProducts.Do_search);
};

WestoreOnlineProducts.bind = function(){
	//监听按钮
	this.bindButtons();
	this.bindPageButton();
};

WestoreOnlineProducts.init();
