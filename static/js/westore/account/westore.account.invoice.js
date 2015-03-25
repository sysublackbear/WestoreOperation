/**************
 * 定义命名空间
 * @author sysublackbear 
 */
var WestoreAccountInvoice;


/**************
 * 全局参数配置 
 */

WestoreAccountInvoice = {
	
};

/**************
 * 初始化配置 
 */

WestoreAccountInvoice.init = function(){
	//先将所有的菜单收起来
	$("dt").removeClass("open");
	WestoreAccountInvoice.bind();
};

WestoreAccountInvoice.bindButtons = function(){
		//开始日期
	//$("[name='startdate']").datepicker({dateFormat:"yy年mm月dd日"});
	$("[name='startdate']").datetimepicker({
		defaultTime:'00:00:00',
		step:1,
		format: 'Y-m-d',
		lang:'ch',
		timepicker:false,
	});
	//结束日期
	//$("[name='enddate']").datepicker({dateFormat:"yy年mm月dd日"});
	$("[name='enddate']").datetimepicker({
		defaultTime:'23:59:59',
		step:1,
		//formatTime:'H:i',
		//formatDate:'d-m-Y',
		format: 'Y-m-d',
		lang:'ch',
		timepicker:false,
	});
};

WestoreAccountInvoice.bind = function(){
	console.log("WestoreAccountInvoice");
	this.bindButtons();
};

WestoreAccountInvoice.init();
