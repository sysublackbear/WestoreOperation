/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreReceiveOrderQuery;

/**************
 * 全局参数配置 
 */

WestoreReceiveOrderQuery = {
	
};

/**************
 * 初始化配置 
 */

var earnbegintime = $("[name='startdate']");
var earnendtime = $("[name='enddate']");
var timealert = $("[name='time-alert']");

WestoreReceiveOrderQuery.init = function(){
	//先将所有的菜单收起来
	$("dt").removeClass("open");
	WestoreReceiveOrderQuery.bind();
};

WestoreReceiveOrderQuery.isPInt = function(v) {
	var reg = new RegExp("^[1-9][0-9]*$");
 	return reg.test(v);
};

WestoreReceiveOrderQuery.ValidateTime = function(index){
	var m_begin_time="";
	var m_end_time="";

	m_begin_time = earnbegintime.val();
	m_end_time = earnendtime.val();
	timealert.addClass('hide');
	if (m_begin_time != "" && typeof(m_begin_time) !="undefined" && m_end_time != "" && typeof(m_end_time) !="undefined") {
		var dt1 = WestoreReceiveOrderQuery.DateToUnix(m_begin_time);
		var dt2 = WestoreReceiveOrderQuery.DateToUnix(m_end_time);
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

//下载对账单
WestoreReceiveOrderQuery.BindDownload = function(fileType){
	if(WestoreReceiveOrderQuery.ValidateTime()){
		var startdate = $("[name='startdate']").val();
		startdate = startdate + ":00";
		//startdate = WestoreReceiveOrderQuery.DateToUnix(startdate);
		var enddate = $("[name='enddate']").val();
		enddate = enddate + ":59";
		//enddate = WestoreReceiveOrderQuery.DateToUnix(enddate);
		//备注
		var remark = $("[name='remark']").val();
		
		var postData = "startdate=" + startdate + "&enddate=" + enddate
		+ "&remark=" + remark + "&filetype=" + fileType;
		
		console.log(postData);
		
		//调用ajax
		window.open('/WeStoreOperation/index.php/westore/downOrderList?' + postData);
	}
	else{  //不通过校验的情况，下载空文本
		var postData = "fileType=" + fileType;
		window.open('/WeStoreOperation/index.php/westore/downOrderList?' + postData);
	}
};

WestoreReceiveOrderQuery.showQueryResult = function(data){
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
			item[9] = "http://localhost/WeStoreOperation/index.php/westore/sendProducts?orderNo=" + item[1];
			item[10] = '发货';
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
	var html = template('consumelist',tdata);
	//先清空
	$('#result').empty();
	$(html).appendTo($('#result'));
	
	//alert(data.post[0].datetime);
};

WestoreReceiveOrderQuery.DateToUnix = function(datetime){
	var date=new Date();
	date.setFullYear(datetime.substring(0,4));
	date.setMonth(Number(datetime.substring(5,7))-1);
	date.setDate(datetime.substring(8,10));
	date.setHours(Number(datetime.substring(11,13)));
	date.setMinutes(Number(datetime.substring(14,16)));
	date.setSeconds(datetime.substring(17,19));
	return Date.parse(date)/1000;
};

WestoreReceiveOrderQuery.QueryConsume = function(index){
	//只传递开始时间，结束时间以及备注过去
	var startdate = $("[name='startdate']").val();
	startdate = startdate + ":00";
	//startdate = WestoreReceiveOrderQuery.DateToUnix(startdate);
	var enddate = $("[name='enddate']").val();
	enddate = enddate + ":59";
	//enddate = WestoreReceiveOrderQuery.DateToUnix(enddate);
	//备注：
	var remark = $("[name='remark']").val();
	
	//注意：别忘了传页码参数过去！
	var postData = "startdate=" + startdate + "&enddate=" + enddate 
	+ "&page=" + index + "&remark=" + remark;
	
	console.log(postData);
	
	//调用ajax
	$.ajax({
		url:"/WeStoreOperation/index.php/westore/queryReceiveOrder",
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
				$("#consumePage").removeClass("hide");
				$("#result").removeClass("hide");
				$("[name='pageno']").val("");
				WestoreReceiveOrderQuery.showQueryResult(data);	
				$("label[name=curpage]").text(data.curpage);
				$("label[name=total_page]").text(data.total_page);
			}
			else if(data.totalNum == 0){
				$("#result").addClass("hide");
				$("#no-order").removeClass("hide");
				$("#consumePage").addClass("hide");
			}
		}
	});
};

WestoreReceiveOrderQuery.bindButtons = function(){
	//开始日期
	//$("[name='startdate']").datepicker({dateFormat:"yy年mm月dd日"});
	$("[name='startdate']").datetimepicker({
		defaultTime:'00:00:00',
		step:1,
		format: 'Y-m-d H:i',
		lang:'ch',
		timepicker:true,
		onSelectDate:WestoreReceiveOrderQuery.BindTimeSelect,
		onChangeDateTime:WestoreReceiveOrderQuery.BindTimeSelect
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
		onSelectDate:WestoreReceiveOrderQuery.BindTimeSelect,
		onChangeDateTime:WestoreReceiveOrderQuery.BindTimeSelect
	});
	
	$("[name='startdateico']").on('click',function(){
		$("[name='startdate']").focus();
	});
	
	$("[name='enddateico']").on('click',function(){
		$("[name='enddate']").focus();
	});
	
	//点击查询按钮
	$("[name='consumeQuery']").on('click',function(){
		if(WestoreReceiveOrderQuery.ValidateTime()){
			WestoreReceiveOrderQuery.QueryConsume(1);
		}
		else{
			$("#result").addClass("hide");
			$("#no-order").removeClass("hide");
			$("#orderPage").addClass("hide");
		}
	});
};

//分页函数
WestoreReceiveOrderQuery.bindPage = function(classname, callback) {
	var parent_div = "div.pagination." + classname + " ";
	$(parent_div + " a.page-first").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreReceiveOrderQuery.isPInt(curpage)) {
			callback(1);
		}
	});
	$(parent_div + "a.page-last").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if (total_page != curpage &&  WestoreReceiveOrderQuery.isPInt(curpage) && WestoreReceiveOrderQuery.isPInt(total_page)) {
			callback(total_page);
		}
	});
	$(parent_div + "a.page-next").on('click', function() {
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		
		if (total_page != curpage && WestoreReceiveOrderQuery.isPInt(curpage) && WestoreReceiveOrderQuery.isPInt(total_page)) {
			callback(curpage + 1);
		}
	});
	$(parent_div + "a.page-prev").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		if (curpage != 1 &&  WestoreReceiveOrderQuery.isPInt(curpage)) {
			callback(curpage - 1);
		}
	});
	$(parent_div + "a.page-go").on('click', function() {
		var curpage = parseInt($(parent_div + "label[name=curpage]").text(), 10);
		var go_page = parseInt($(parent_div + "input").val(), 10);
		var total_page = parseInt($(parent_div + "label[name=total_page]").text(), 10);
		if ( WestoreReceiveOrderQuery.isPInt(curpage) && WestoreReceiveOrderQuery.isPInt(total_page) && WestoreReceiveOrderQuery.isPInt(go_page) && go_page <= total_page && go_page != curpage) {
			callback(go_page);
		}
	});
};

WestoreReceiveOrderQuery.Do_search = function(){
	WestoreOrderQuery.QueryConsume(page);
};

WestoreReceiveOrderQuery.bindPageButton = function(){
	WestoreReceiveOrderQuery.bindPage('consume_page', WestoreReceiveOrderQuery.Do_search);
};

WestoreReceiveOrderQuery.bindMenu = function(){
	//一开始没有查询结果，没有结果的一栏必须出现，页码必须屏蔽
	$("#no-order").removeClass("hide");
	$("#consumePage").addClass("hide");
};

WestoreReceiveOrderQuery.bind = function(){
	this.bindButtons();
	this.bindPageButton();
	this.bindMenu();
};

WestoreReceiveOrderQuery.init();



