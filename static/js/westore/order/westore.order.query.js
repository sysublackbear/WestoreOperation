/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreOrderQuery;

/**************
 * 全局参数配置 
 */

WestoreOrderQuery = {
	
};

/**************
 * 初始化配置 
 */

var earnbegintime = $("[name='startdate']");
var earnendtime = $("[name='enddate']");
var earnmoneymin = $("[name='earnmoney-min']");
var earnmoneymax = $("[name='earnmoney-max']");
var earnmoneyalert = $("[name='earnmoneyAlert']");
var timealert = $("[name='time-alert']");

WestoreOrderQuery.init = function(){
	//先将所有的菜单收起来
	$("dt").removeClass("open");
	WestoreOrderQuery.bind();
};

WestoreOrderQuery.isPFloat = function(v) {
	var reg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[0-9][0-9]*))$");
 	return reg.test(v);
};

WestoreOrderQuery.isPInt = function(v) {
	var reg = new RegExp("^[1-9][0-9]*$");
 	return reg.test(v);
};

WestoreOrderQuery.ChangeTwoDecimalf = function (floatvar){
	var ff = parseFloat(floatvar);
	if (isNaN(ff))
	{
		alert('function:changeTwoDecimal->parameter error');
		return false;
	}
	var fx = Math.round(ff*100)/100;
	var sx = fx.toString();
	var posdecimal = sx.indexOf('.');
	if (posdecimal < 0)
	{
		pos_decimal = sx.length;
		sx += '.00';
	}
	while (sx.length <= posdecimal + 2)
	{
		sx += '0';
	}
	return sx;
};


WestoreOrderQuery.ValidateTime = function(index) {
	var m_begin_time="";
	var m_end_time="";

	m_begin_time = earnbegintime.val();
	m_end_time = earnendtime.val();
	timealert.addClass('hide');
	if (m_begin_time != "" && typeof(m_begin_time) !="undefined" && m_end_time != "" && typeof(m_end_time) !="undefined") {
		var dt1 = WestoreOrderQuery.DateToUnix(m_begin_time);
		var dt2 = WestoreOrderQuery.DateToUnix(m_end_time);
		if(dt1 > dt2) {
			timealert.html('开始时间不能大于结束时间');
			timealert.removeClass("hide");
			return false;
		}
		var tt =  Date.parse(new Date());
		//alert(tt);
		//alert(dt1);
		if (dt1 > tt) {
			timealert.html("开始时间不能大于当前时间");
			timealert.removeClass("hide");
			return false;
		}
		timealert.addClass("hide");
		return true;
	}else{
		timealert.html("请选择查询日期");
		timealert.removeClass("hide");
		return false;
	}
};


WestoreOrderQuery.ValidateEarnMoney = function(){
	if(earnmoneymin.val().length < 1 && earnmoneymax.val().length < 1){
		earnmoneyalert.addClass("hide");
		return true;
	}
	else if(earnmoneymin.val().length >= 1 && !WestoreOrderQuery.isPFloat(earnmoneymin.val())){
		earnmoneyalert.html("请输入正确格式的入账金额");
		earnmoneyalert.removeClass("hide");
		return false;
	}
	else if(earnmoneymax.val().length >=1 && !WestoreOrderQuery.isPFloat(earnmoneymax.val())){
		earnmoneyalert.html("请输入正确格式的入账金额");
		earnmoneyalert.removeClass("hide");
		return false;
	}
	else{
		if(earnmoneymax.val().length >=1){
			earnmoneymax.val(this.ChangeTwoDecimalf(earnmoneymax.val()));
		}
		if(earnmoneymin.val().length >= 1){
			earnmoneymin.val(this.ChangeTwoDecimalf(earnmoneymin.val()));
		}
		if(earnmoneymin.val().length >= 1 && earnmoneymax.val().length >= 1 && earnmoneymin.val() >= earnmoneymax.val()){
			earnmoneyalert.html("最大金额需大于最小金额");
			earnmoneyalert.removeClass("hide");
			return false;
		}
		earnmoneyalert.addClass("hide");
		return true;
	}
};

//传入的格式:xxxx-xx-xx xx:xx
WestoreOrderQuery.DateToUnix = function(datetime){
	var date=new Date();
	date.setFullYear(datetime.substring(0,4));
	date.setMonth(Number(datetime.substring(5,7))-1);
	date.setDate(datetime.substring(8,10));
	date.setHours(Number(datetime.substring(11,13)));
	date.setMinutes(Number(datetime.substring(14,16)));
	date.setSeconds(datetime.substring(17,19));
	return Date.parse(date)/1000;
};

//分页函数
WestoreOrderQuery.bindPage = function(classname, callback) {
	var parent_div = "div.pagination." + classname + " ";
	$(parent_div + " a.page-first").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreOrderQuery.isPInt(curpage)) {
			callback(1);
		}
	});
	$(parent_div + "a.page-last").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if (total_page != curpage &&  WestoreOrderQuery.isPInt(curpage) && WestoreOrderQuery.isPInt(total_page)) {
			callback(total_page);
		}
	});
	$(parent_div + "a.page-next").on('click', function() {
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		
		if (total_page != curpage && WestoreOrderQuery.isPInt(curpage) && WestoreOrderQuery.isPInt(total_page)) {
			callback(curpage + 1);
		}
	});
	$(parent_div + "a.page-prev").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreOrderQuery.isPInt(curpage)) {
			callback(curpage - 1);
		}
	});
	$(parent_div + "a.page-go").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var go_page = parseInt($(parent_div + "input").val(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if ( WestoreOrderQuery.isPInt(curpage) && WestoreOrderQuery.isPInt(total_page) && WestoreOrderQuery.isPInt(go_page) && go_page <= total_page && go_page != curpage) {
			callback(go_page);
		}
	});
};

WestoreOrderQuery.Do_search = function(page) {
	WestoreOrderQuery.QueryFlow(page);
};

WestoreOrderQuery.bindPageButton = function(){
	WestoreOrderQuery.bindPage('order_page', WestoreOrderQuery.Do_search);
};

WestoreOrderQuery.showQueryResult = function(data){
	//先将数据清空
	$("#result").html("");
	
	var len = data.post.length;
	//导入数据
	var menu = new Array();
	for(var i = 0;i < len;i++){
		var item = new Array();
		item[0] = data.post[i].createTime;
		item[1] = data.post[i].orderNo;
		item[2] = data.post[i].orderType;
		item[3] = data.post[i].userName;
		item[4] = data.post[i].merchantName;
		item[5] = data.post[i].productMoney;
		item[6] = data.post[i].freight;
		item[7] = data.post[i].orderMoney;
		item[8] = data.post[i].productNo;
		if(item[2] == '已支付，等待商家发货'){
			item[9] = "http://localhost/WeStoreOperation/index.php/westore/refundProducts?orderNo=" + item[1];
			item[10] = '退货';
		}
		else{
			item[9] = '';
			item[10] = '';
		}
		menu[i] = item;
	}
	var tdata = {
		isAdmin:true,
		list:menu
	};
	//利用模板导入
	var html = template('orderlist',tdata);
	//先清空
	$('#result').empty();
	$(html).appendTo($('#result'));
	
	//alert(data.post[0].datetime);
};

WestoreOrderQuery.BindDownload = function(fileType){
	if(WestoreOrderQuery.ValidateEarnMoney() && WestoreOrderQuery.ValidateTime()){
		var startdate = $("[name='startdate']").val();
		startdate = startdate + ":00";
		startdate = WestoreOrderQuery.DateToUnix(startdate);
		var enddate = $("[name='enddate']").val();
		enddate = enddate + ":59";
		enddate = WestoreOrderQuery.DateToUnix(enddate);
		//单据状态
		var orderstatus = $("[name='orderStatus']").text();
		//交易单号
		var tradeorder = $("[name='tradeOrder']").val();
		//下单用户
		var tradeuser = $("[name='tradeuser']").val();
		//备注
		var remark = $("[name='remark']").val();
		//入账金额
		var minmoney = 0;
		var maxmoney = 0;
		if(earnmoneymin.val().length >= 1){
			//数据库存下来是以分为单位的
			minmoney = parseFloat(earnmoneymin.val()) * 100;
		}
		else{
			minmoney = 0;
		}
		if(earnmoneymax.val().length >= 1){
			maxmoney = parseFloat(earnmoneymax.val()) * 100;
		}
		else{
			maxmoney = 0;
		}
		
		var postData = "startdate=" + startdate + "&enddate=" + enddate
		+ "&tradeorder=" + tradeorder + "&tradeuser=" + tradeuser
		+ "&orderstatus=" + orderstatus + "&remark=" + remark + 
		+ "&earnmoneymin=" + minmoney + "&earnmoneymax=" + maxmoney;
		
		console.log(postData);
		
		//调用ajax
		window.open('/WeStoreOperation/index.php/westore/downOrderList?' + postData);
	}
	else{  //不通过校验的情况，下载空文本
		var postData = "fileType=" + fileType;
		window.open('/WeStoreOperation/index.php/westore/downOrderList?' + postData);
	}
};

WestoreOrderQuery.QueryFlow = function(index){
	var startdate = $("[name='startdate']").val();
	startdate = startdate + ":00";
	//startdate = WestoreOrderQuery.DateToUnix(startdate);
	var enddate = $("[name='enddate']").val();
	enddate = enddate + ":59";
	//enddate = WestoreOrderQuery.DateToUnix(enddate);
	//单据状态
	var orderstatus = $("[name='orderStatus']").text();
	//交易单号
	var tradeorder = $("[name='tradeOrder']").val();
	//下单用户
	var tradeuser = $("[name='tradeUser']").val();
	//备注：
	var remark = $("[name='remark']").val();
	//入账金额
	var minmoney = 0;
	var maxmoney = 0;
	if(earnmoneymin.val().length >= 1){
		//数据库存下来是以分为单位的
		minmoney = parseFloat(earnmoneymin.val()) * 100;
	}
	else{
		minmoney = 0;
	}
	if(earnmoneymax.val().length >= 1){
		maxmoney = parseFloat(earnmoneymax.val()) * 100;
	}
	else{
		maxmoney = 0;
	}
	
	//注意：别忘了传页码参数过去！
	var postData = "startdate=" + startdate + "&enddate=" + enddate 
	+ "&tradeorder=" + tradeorder + "&tradeuser=" + tradeuser 
	+ "&orderstatus=" + orderstatus + "&remark=" + remark + "&page=" + index
	+ "&earnmoneymin=" + minmoney + "&earnmoneymax=" + maxmoney;
	
	console.log(postData);
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/queryOrder",
		type:"POST",
		data:postData,
		dataType:"json",
		error:function(){
			alert("查询失败!");
		},
		success:function(data){
			//无符合查询条件的自动屏蔽
			if(data.totalNum > 0){
				$("#no-order").addClass("hide");
				$("#orderPage").removeClass("hide");
				$("#result").removeClass("hide");
				$("[name='pageno']").val("");
				console.log(data.list);
				WestoreOrderQuery.showQueryResult(data);	
				$("label[name=curpage]").text(data.curpage);
				$("label[name=total_page]").text(data.total_page);
			}
			else if(data.totalNum == 0){
				$("#result").addClass("hide");
				$("#no-order").removeClass("hide");
				$("#orderPage").addClass("hide");
			}
		}
	});
};

WestoreOrderQuery.bindButtons = function(){
	//开始日期
	//$("[name='startdate']").datepicker({dateFormat:"yy年mm月dd日"});
	$("[name='startdate']").datetimepicker({
		defaultTime:'00:00:00',
		step:1,
		format: 'Y-m-d H:i',
		lang:'ch',
		timepicker:true,
		onSelectDate:WestoreOrderQuery.BindTimeSelect,
		onChangeDateTime:WestoreOrderQuery.BindTimeSelect
	});
	//结束日期
	//$("[name='enddate']").datepicker({dateFormat:"yy年mm月dd日"});
	$("[name='enddate']").datetimepicker({
		defaultTime:'23:59:59',
		step:1,
		//formatTime:'H:i',
		//formatDate:'d-m-Y',
		format: 'Y-m-d H:i',
		lang:'ch',
		timepicker:true,
		onSelectDate:WestoreOrderQuery.BindTimeSelect,
		onChangeDateTime:WestoreOrderQuery.BindTimeSelect
	});
	
	$("[name='startdateico']").on('click',function(){
		$("[name='startdate']").focus();
	});
	
	$("[name='enddateico']").on('click',function(){
		$("[name='enddate']").focus();
	});
	
	//点击查询按钮
	$("[name='orderQuery']").on('click',function(){
		if(WestoreOrderQuery.ValidateEarnMoney() && WestoreOrderQuery.ValidateTime()){
			WestoreOrderQuery.QueryFlow(1);
		}
		else{
			$("#result").addClass("hide");
			$("#no-order").removeClass("hide");
			$("#orderPage").addClass("hide");
		}
	});
	
};

WestoreOrderQuery.bindEarnMoney = function(){
	earnmoneymin.on('blur',function() {
		WestoreOrderQuery.ValidateEarnMoney();
	});
	earnmoneymax.on('blur',function(){
		WestoreOrderQuery.ValidateEarnMoney();
	});
};

WestoreOrderQuery.bindSelects = function(){
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

WestoreOrderQuery.bindMenu = function(){
	//一开始没有查询结果，没有结果的一栏必须出现，页码必须屏蔽
	$("#no-order").removeClass("hide");
	$("#orderPage").addClass("hide");
};

WestoreOrderQuery.bind = function(){
	this.bindButtons();
	//下拉列表
	this.bindSelects();
	this.bindEarnMoney();
	this.bindPageButton();
	this.bindMenu();
};

WestoreOrderQuery.init();
