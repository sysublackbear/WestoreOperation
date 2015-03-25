<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *  O2O微店平台的实现类（表现层）
 *  @author sysublackbear
 *  @copyright 2015 SYSU
 *  @license http://sysublackbear.github.io/
 */
class WeStore extends CI_Controller {
	/**
	 * 构造函数
	 */
	public function __construct(){
		parent::__construct();
		//载入模型
		$this->load->model('westore/westore_model','westore_model');
		$this->load->helper("url");  //载入url帮助函数
		$this->load->helper("cookie");
		
		//session类库函数
		$this->load->library('session');
		
		//设置默认时区：北京时间
		date_default_timezone_set('PRC');
	}
	
	/**
	 * 登录页面
	 */
	public function index(){
		//在这之前先去掉除了loginAccount之外的cookie
		delete_cookie("userNo");
		delete_cookie("nickname");
		delete_cookie("merchantNo");
		delete_cookie("merchantName");
		$this->load->view('westore-index.shtml');
	}
	
	/**
	 * 销毁cookie
	 */
	public function cookieDestory(){
		delete_cookie("loginAccount");
		delete_cookie("userNo");
		delete_cookie("nickname");
		delete_cookie("merchantNo");
		delete_cookie("merchantName");
	}
	
	/**
	 * 登出页面
	 */
	public function logout(){
		$userNo = $this->input->cookie("userNo");
		$this->westore_model->setNoLogined($userNo);
		//销毁cookie
		$this->cookieDestory();
		$this->load->view('westore-logout.shtml');
	}
	
	/**
	 * 帮助导航页
	 */
	public function help(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '帮助导航';
			$data['websitecode'] = 6;
			$data['websitesoncode'] = 601;
		
			$user = '张三';
			$this->load->view('westore-help.shtml',$data);
		}	
	}
	
	/**
	 * 即时沟通报错页（当sender和getter没被定义的时候）
	 */
	public function contactError(){
		
		$this->load->view('westore-contact-error.shtml');
	}
	
	public function submitLogin(){
		$username = $this->input->post("username",true);
		$password = sha1($this->input->post("password",true));
		
		$arr = array();
		
		$ret = $this->westore_model->checkUsernamePassword($username,$password,$arr);
		$output = array();
		
		if($ret){
			//设定cookie
			$cookie = array();
			$cookie[0] = array(
			'name' => 'userNo',
			'value' => $arr['userNo'],
			'expire' => '86500'
			);
			$cookie[1] = array(
			'name' => 'loginAccount',
			'value' => $username,
			'expire' => '86500'
			);
			$cookie[2] = array(
			'name' => 'nickname',
			'value' => $arr['nickname'],
			'expire' => '86500'
			);
			
			$this->input->set_cookie($cookie[0]);
			$this->input->set_cookie($cookie[1]);
			$this->input->set_cookie($cookie[2]);
			
			//看该用户是否为商户，否则要进行商户号的获取
			$this->setMerchantCookie($arr['roleType'],$arr['userNo']);
			
			//同时记得把数据库的登录状态更新
			$ret2 = $this->westore_model->setLogined($arr['userNo']);
			
			$output['errcode'] = 1;	
		}
		else{
			$output['errcode'] = 0;
		}
		
		echo json_encode($output);
	}
	
	
	/**
	 * 加上商户cookie
	 */
	public function setMerchantCookie($roleType,$userNo){
		
		if($roleType == 2){
			$merchant = array();
			$ret = $this->westore_model->CheckBoolMerchant($userNo,$merchant);
			if($ret){
				$merchantCookie = array();
				$merchantCookie[0] = array(
				'name' => 'merchantNo',
				'value' => $merchant['merchantNo'],
				'expire' => '86500'
				);
				
				$merchantCookie[1] = array(
				'name' => 'merchantName',
				'value' => $merchant['merchantName'],
				'expire' => '86500'
				);
				
				$this->input->set_cookie($merchantCookie[0]);
				$this->input->set_cookie($merchantCookie[1]);
			}
		}
	}
	
	/**
	 * 校验密码是否正确
	 */
	public function checkPassword(){
		//获取数据
		$password = $this->input->get_post("password",true);
		
		//sha1哈希处理
		$password = sha1($password);
		
		$user = $this->input->cookie("userNo");
		
		//输出结果
		$output = array();
		
		//校验密码，如果返回true，说明校验结果正确，否则校验结果错误
		$ret = $this->westore_model->CheckPassword($user,$password);
		
		if($ret){
			$output['errcode'] = 1;
		}
		else{
			$output['errcode'] = 0;
		}
		
		echo json_encode($output);		
	}
	
	/**
	 * 查找账号是否有重复
	 */
	public function checkLoginNameRepeat(){
		//获取数据
		$loginName = $this->input->get_post("loginName",true);
	
		//输出结果
		$output = array();
		
		//校验账号是否有重复
		$ret = $this->westore_model->CheckLoginNameRepeat($loginName);
		
		if(!$ret){
			$output['errcode'] = 1;
		}
		else{
			$output['errcode'] = 0;
		}
		echo json_encode($output);

	}
	
	/**
	 * 校验商家编码是否重复
	 */
	public function checkMerchantCodeRepeat(){
		//获取数据
		$merchantCode = $this->input->get_post("merchantCode",true);
		
		//输出结果
		$output = array();
		
		//校验商家编码是否有重复
		$ret = $this->westore_model->CheckMerchantCodeRepeat($merchantCode);
		
		if(!$ret){
			$output['errcode'] = 1;
		}
		else{
			$output['errcode'] = 0;
		}
		echo json_encode($output);
	}
	
	/**
	 * 注册新用户
	 */
	public function registerNewRole(){
			
		$role = array();
		$merchant = array();
		$userhost = array();
		
		//输出结果
		$output = array();
		
		$merchantCode = $this->input->get_post("merchantCode",true);
		$server = $this->input->get_post("server",true);
		
		//获取数据，把数据摘下来
		$role['loginAccount'] = $this->input->get_post("loginName",true);
		$role['userNo'] = sha1($role['loginAccount']);
		//这里对密码还没有进行哈希处理，后面再处理
		$role['loginPassword'] = sha1($this->input->get_post("password",true));
		$role['email'] = $this->input->get_post("email",true);
		$role['telephone'] = $this->input->get_post("mobile",true);
		$role['nickname'] = $this->input->get_post("nickname",true);
		$role['userName'] = $this->input->get_post("contact",true);
		$role['wechatNo'] = $this->input->get_post("wechatNo",true);
		
		$role['userIcon'] = $this->input->get_post("userIcon",true);
		//角色决定，默认值为1，如果为商家，则为2
		if($merchantCode){
			$role['roleType'] = 2;
		}
		else{
			$role['roleType'] = 1;
		}
		$role['bankAccountUser'] = $this->input->get_post("bankAccountUser",true);
		$role['bankName'] = $this->input->get_post("bankName",true);
		$role['bankInfo'] = $this->input->get_post("bankInfo",true);
		$role['bankAccountInfo'] = $this->input->get_post("bankAccountInfo",true);
		$role['bankAccountNo'] = $this->input->get_post("bankAccountNo",true);
		$role['bankAccountUserName'] = $this->input->get_post("bankAccountUserName",true);
		
		
		//注册主要发生几个动作，插入数据到数据库，分配session_id，生成用户号。
		
		//插入到数据库
		//role表
		$ret1 = $this->westore_model->InsertRole($role);
		
		
		//填写商户平台信息
		if($merchantCode){
			$merchant['userNo'] = $role['userNo'];
			$merchant['merchantCode'] = $this->input->get_post("merchantCode",true);
			$merchant['merchantNo'] = sha1($merchant['merchantCode']);
			$merchant['merchantName'] = $this->input->get_post("merchantName",true);
			$merchant['contact'] = $this->input->get_post("merchantContact",true);
			$merchant['wechatMembershipNo'] = $this->input->get_post("wechatMembership",true);
			$merchant['website'] = $this->input->get_post("website",true);
			$merchant['websiteName'] = $this->input->get_post("websiteName",true);
			$merchant['telphone'] = $this->input->get_post("contactMobile",true);
			$merchant['merchantEmail'] = $this->input->get_post("merchantEmail",true);
			
			//金钱是以分作单位存入数据库里面的，所以这里要乘以100
			$merchant['freight'] = $this->input->get_post("freight",true) * 100;
			$merchant['minFreight'] = $this->input->get_post("minFreight",true) * 100;
			
			$merchant['freightTime'] = $this->input->get_post("freightTime",true);
			$merchant['freightArea'] = $this->input->get_post("freightArea",true);
			$merchant['starttime'] = $this->input->get_post("starttime",true);
			$merchant['endtime'] = $this->input->get_post("endtime",true);
			$merchant['fax'] = $this->input->get_post("fax",true);
			
			//merchant表
			$ret2 = $this->westore_model->InsertMerchant($merchant);
		}
		
		if($server){
			$userhost['userNo'] = $role['userNo'];   //等于role里面的用户号
			$userhost['serverhost'] = $this->input->get_post("server",true);
			$userhost['hostdatabase'] = $this->input->get_post("database",true);
			$userhost['port'] = $this->input->get_post("port",true);
			$userhost['account'] = $this->input->get_post("account",true);
			$userhost['password'] = $this->input->get_post("databasePassword",true);
			
			//userhost表
			$ret3 = $this->westore_model->InsertUserHost($userhost);
		}

		if($ret1){
			$output['errcode'] = 1;
			
			$arr = array();
			//同时，分配session_id
			//如果是商户身份，分配商户号，用户号，登录账号
			if($role['roleType'] == 2){
				$arr['merchantNo'] = $merchant['merchantNo'];
				$arr['merchantName'] = $merchant['merchantName'];
				
				$merchantCookie = array();
				$merchantCookie[0] = array(
				'name' => 'merchantNo',
				'value' => $merchant['merchantNo'],
				'expire' => '86500'
				);
				
				$merchantCookie[1] = array(
				'name' => 'merchantName',
				'value' => $merchant['merchantName'],
				'expire' => '86500'
				);
				
				$this->input->set_cookie($merchantCookie[0]);
				$this->input->set_cookie($merchantCookie[1]);
				
			}
			$arr['userNo'] = $role['userNo'];
			$arr['loginAccount'] = $role['loginAccount'];
			$arr['nickname'] = $role['nickname'];
			
			//$this->session->set_userdata($arr);
			$cookie = array();
			$cookie[0] = array(
			'name' => 'userNo',
			'value' => $arr['userNo'],
			'expire' => '86500'
			);
			$cookie[1] = array(
			'name' => 'loginAccount',
			'value' => $arr['loginAccount'],
			'expire' => '86500'
			);
			$cookie[2] = array(
			'name' => 'nickname',
			'value' => $arr['nickname'],
			'expire' => '86500'
			);
			
			$this->input->set_cookie($cookie[0]);
			$this->input->set_cookie($cookie[1]);
			$this->input->set_cookie($cookie[2]);
		}
		else{
			$output['errcode'] = 0;
		}
		
		echo json_encode($output);
	}
	
	/**
	 * 更改密码
	 */
	public function updatePassword(){
		//获取数据
		$password = array();
		
		$user = $this->input->cookie("userNo");
		
		$password['oldPassword'] = $this->input->get_post("oldPassword",true);
		$password['newPassword'] = $this->input->get_post("newPassword",true);
		
		//哈希处理
		$password['newPassword'] = sha1($password['newPassword']);
		//执行更新操作
		$ret = $this->westore_model->UpdatePassword($user,$password);
		
		$output = array();
		
		//如果$ret为真，说明更新成功，直接摆原值；如果$ret为false，则保持原值
		if($ret){
			$output['errcode'] = 1;
		}
		else{
			$output['errcode'] = 0;
		}
		
		echo json_encode($output);
	}

	
	/**
	 * 更新用户的结算信息
	 */
	public function updateUserSettled(){
		//获取数据
		$userSettled = array();
		
		$user = $this->input->cookie("userNo");
		
		$userSettled['bankAccountUser'] = $this->input->get_post("bankAccountUser",true);
		$userSettled['bankName'] = $this->input->get_post("bankName",true);
		$userSettled['bankInfo'] = $this->input->get_post("bankInfo",true);
		$userSettled['bankAccountInfo'] = $this->input->get_post("bankAccountInfo",true);
		$userSettled['bankAccountNo'] = $this->input->get_post("bankAccountNo",true);
		$userSettled['bankAccountUserName'] = $this->input->get_post("bankAccountUserName",true);
	
		//执行更新操作
		$ret = $this->westore_model->UpdateUserSettled($user,$userSettled);
		
		$output = array();
		
		//如果$ret为真，说明更新成功，直接摆原值；如果$ret为false，则保持原值
		if($ret){
			$output['errcode'] = 1;
			$output['post'] = $userSettled;
		}
		else{
			$output['errcode'] = 0;
		}
		
		echo json_encode($output);
	}
	
	
	/**
	 * 更新用户的基本信息
	 */
	public function updateUserInfo(){
		//获取数据
		$userInfo = array();
		
		$user = $this->input->cookie("userNo");		
		
		$userInfo['userTelphone'] = $this->input->get_post("userTelphone",true);
		$userInfo['userWebsiteName'] = $this->input->get_post("userWebsiteName",true);
		$userInfo['userWebsite'] = $this->input->get_post("userWebsite",true);
		
		//执行更新操作
		$ret = $this->westore_model->UpdateUserInfo($user,$userInfo);
		
		$output = array();
		
		//如果$ret为真，说明更新成功，直接摆原值；如果$ret为false，则保持原值
		if($ret){
			$output['errcode'] = 1;
			$output['post'] = $userInfo;
		}
		else{
			$output['errcode'] = 0;
		}
		echo json_encode($output);
	}
	
	/**
	 * 管理密码
	 */
	public function loginPassword(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '密码安全';
			$data['websitecode'] = 1;
			$data['websitesoncode'] = 103;
		
			$this->load->view('westore-login-password.shtml',$data);
		}
	}
	
	/**
	 * 账户概况
	 */
	public function accountView(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '账户概况';
			$data['websitecode'] = 1;
			$data['websitesoncode'] = 101;
		
			$user = $this->input->cookie("userNo");
			
			//从数据库返回的结果放到$userAccountView当中
			$userAccountView = array();
			$userHistoryTrade = array();
			$recentTradeAccords = array();
			
			$ret = $this->westore_model->GetAccountView($user,$userAccountView,$userHistoryTrade,$recentTradeAccords);
		
			//处理账户概况
			$data['userAccountView'] = $userAccountView;
			$data['userAccountView']['totalAccount'] = number_format((float)$data['userAccountView']['totalAccount'] / 100,2);
			$data['userAccountView']['availableBalance'] = number_format((float)$data['userAccountView']['availableBalance'] / 100,2);	
			$data['userAccountView']['depositBalance'] = number_format((float)$data['userAccountView']['depositBalance'] / 100,2);		
			$data['userAccountView']['noSettledBalance'] = number_format((float)$data['userAccountView']['noSettledBalance'] / 100,2);		
		
			$this->load->view('westore-account-view.shtml',$data);
			//var_dump($data);
		}
	}

	/**
	 * 查询是商户是否有权利操作商品
	 */
	public function checkMerchantProduct($merchantNo,$productNo){
		return $ret = $this->westore_model->CheckMerchantProduct($merchantNo,$productNo);
	}
	
	/**
	 * 商家发货
	 */
	public function sendProducts(){
		$cookie = $this->input->cookie('userNo');
		//商品编号
		$orderNo = $this->input->get_post("orderNo");
		//先判断商品编号是否为空，再看该商品是否存在
		if($this->checkUserCookie($cookie) && $this->checkOrder($orderNo)){
			$this->load->view('westore-send-products.shtml');
		}
		else{
			header('Location: http://localhost/WeStoreOperation/index.php/westore/contactError');
		}
	}
	
	/**
	 * 退款商品
	 */
	public function refundProducts(){
		$cookie = $this->input->cookie('userNo');
		//商品编号
		$orderNo = $this->input->get_post("orderNo");
		//先判断商品编号是否为空，再看该商品是否存在
		if($this->checkUserCookie($cookie) && $this->checkOrder($orderNo)){
			$this->load->view('westore-refund-page.shtml');
		}
		else{
			header('Location: http://localhost/WeStoreOperation/index.php/westore/contactError');
		}
	}
	
	/**
	 * 购买商品
	 */
	public function buyProducts(){
		$cookie = $this->input->cookie('userNo');
		//商品编号
		$productNo = $this->input->get_post("productNo");
		//先判断商品编号是否为空，再看该商品是否存在
		if($this->checkUserCookie($cookie) && $this->checkProduct($productNo)){
			$data = array();
			$productInfo = array();
			
			//查询商品信息
			$ret = $this->westore_model->GetProductInfo($productNo,$productInfo);
			
			//查询运费
			$freight = $this->westore_model->GetFreight($productInfo['merchantNo']);
			$data['title'] = '购买商品';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 306;
			$data['productInfo'] = $productInfo;
			$data['freight'] = (float)$freight / 100;
			
			$this->load->view('westore-buy-products.shtml',$data);
		}
		else{
			header('Location: http://localhost/WeStoreOperation/index.php/westore/contactError');
		}
	}
	 
	/**
	 * 更改商品备注信息
	 */
	public function updateProducts(){
		$cookie = $this->input->cookie('userNo');
		//商品编号
		$productNo = $this->input->get_post("productNo");
		//商户号
		$merchantNo = $this->input->cookie("merchantNo");
		//先判断商品编号是否为空，再看商户是否具有修改商品的权限
		if($this->checkUserCookie($cookie) && $productNo && $this->checkMerchantProduct($merchantNo,$productNo)){
			$data = array();
			$productInfo = array();
			
			//查询商品信息
			$ret = $this->westore_model->GetProductInfo($productNo,$productInfo);
			$data['title'] = '更改商品信息';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 305;
			$data['productInfo'] = $productInfo;
			
			$this->load->view('westore-update-products.shtml',$data);
		}
		else{
			header('Location: http://localhost/WeStoreOperation/index.php/westore/contactError');
		}
	}

	/**
	 * 即时沟通
	 */
	public function westoreContact(){
		
		$sender = $this->input->get('sender',true);
		$getter = $this->input->get('getter',true);
		$cookie = $this->input->cookie('userNo');
		
		//这里到时候要校验数据库里面是否有这两个发送者和接收者的用户id
		//pass
		
		//两个相同的发送者也不能聊天，因为自己跟自己不能聊天
		if(!empty($sender) && !empty($getter) && $sender != $getter && $this->checkUserCookie($cookie)){
			$data = array();
			$data['title'] = '即时沟通';
			$data['websitecode'] = 4;
			$data['websitesoncode'] = 401;
			$this->load->view('westore-contact.shtml',$data);
		}
		else{
			header('Location: http://localhost/WeStoreOperation/index.php/westore/contactError');
		}
		
		
	}

	/**
	 * 账户信息
	 */
	public function accountInfo(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '账户信息';
			$data['websitecode'] = 1;
			$data['websitesoncode'] = 102;
		
			//获取cookie中的用户号
			$user = $this->input->cookie('userNo');
			//从数据库返回结果
			//基本信息
			$userInfo = array();
			//结算信息
			$settledInfo = array();
			//安全证书
			$safeCertificate = array();
		
			$ret = $this->westore_model->GetUserInfo($user,$userInfo,$settledInfo,$safeCertificate);
		
			$data['userInfo'] = $userInfo;
			$data['settledInfo'] = $settledInfo;
			$data['safeCertificate'] = $safeCertificate;
		
			$this->load->view('westore-account-info.shtml',$data);
		}
	}

	/**
	 * 账户的发票信息
	 */
	public function accountInvoice(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '发票信息';
			$data['websitecode'] = 1;
			$data['websitesoncode'] = 104;
		
			//从数据库返回结果
			$this->load->view('westore-account-invoice.shtml',$data);
		}
	}
	
	/**
	 * 注册页
	 */
	public function register(){
		$this->load->view('westore-register.shtml');
	}
	
	/**
	 * 订单查找页
	 */
	public function orderManage(){
			
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '查看订单';
			$data['websitecode'] = 2;
			$data['websitesoncode'] = 201;
			$this->load->view('westore-order-query.shtml',$data);
		}
	}
	
	/**
	 * 查看消费页
	 */
	public function consumeManage(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '查看消费';
			$data['websitecode'] = 2;
			$data['websitesoncode'] = 202;
			$this->load->view('westore-consume-query.shtml',$data);
		}
	}
	
	/**
	 * 获取微信会员名单及其数据
	 */
	public function wechatMembership(){
		
		$cookie = $this->input->cookie('userNo');
		$merchantNo = $this->input->cookie('merchantNo');
		$userNo = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			if($merchantNo){
				$data = array();
				$data['title'] = '我的会员';
				$data['secondTitle'] = '微信会员';
				$data['websitecode'] = 5;
				$data['websitesoncode'] = 501;
				$this->load->view('westore-wechat-membership.shtml',$data);
			}
			else{
				$data = array();
				$data['title'] = '我的商家';
				$data['secondTitle'] = '微信商家';
				$data['websitecode'] = 5;
				$data['websitesoncode'] = 501;
				$this->load->view('westore-wechat-membership.shtml',$data);
			}
			
		}
	}
	
	/**
	 * 下载订单
	 */
	public function downOrderList(){
		
	}
	
	/**
	 * 查看在线商品
	 */
	public function onlineProducts(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '在线商品';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 303;
			$this->load->view('westore-online-products.shtml',$data);
		}
	}

	/**
	 * 查看我的商品
	 */
	public function myProducts(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->input->cookie('userNo')){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '我的商品';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 301;
			$this->load->view('westore-my-products.shtml',$data);
		}
	}
	
	/**
	 * 商家查看我的收单
	 */
	public function myReceiveOrder(){
		$cookie = $this->input->cookie('userNo');
		if(!$this->input->cookie('userNo')){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '查看收单';
			$data['websitecode'] = 2;
			$data['websitesoncode'] = 203;
			$this->load->view('westore-receive-order.shtml',$data);
		}
	}
	
	/**
	 * 查看促销商品
	 */
	public function salesPromotion(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '新增促销';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 302;
			$this->load->view('westore-online-products.shtml',$data);
		}
	}
	
	/**
	 * 插入商品增加库存
	 */
	public function addProducts(){
		
		$cookie = $this->input->cookie('userNo');
		if(!$this->checkUserCookie($cookie)){
			$this->load->view('westore-cookie-expired.shtml');
		}
		else{
			$data = array();
			$data['title'] = '新增商品';
			$data['websitecode'] = 3;
			$data['websitesoncode'] = 304;
			$this->load->view('westore-add-products.shtml',$data);
		}
		
	}
	
	/**
	 * 接收新的消息
	 */
	public function receiveNewMessage(){
		//获取数据
		$data = array();
		
		$data['sender'] = $this->input->get_post("sender",true);
		$data['getter'] = $this->input->get_post("getter",true);
		
		//用于接收数据
		$messageList = array();
		
		//返回总条数
		$totalNum = 0;
		
		$senderName = '';
		$ret = $this->westore_model->ReceiveNewMessage($data,$messageList,$totalNum,$senderName);
		
		//输出结果
		$output = array();
		
		$output['post'] = $messageList;
		$output['senderName'] = $senderName;
		$output['totalNum'] = $totalNum;
		
		echo json_encode($output);
	}
	
	/**
	 * 发送消息
	 */
	public function addMessage(){
		//获取数据
		$data = array();
		
		$data['sender'] = $this->input->get_post("sender",true);
		$data['getter'] = $this->input->get_post("getter",true);
		$data['content'] = $this->input->get_post("contents",true);
		
		//存储当前时间
		$data['sendTime'] = date("Y-m-d H:i:s");
		
		//输出结果
		$output = array();
		
		$ret = $this->westore_model->AddMessage($data);
		
		//如果插入成功，则$ret不为0（$ret为由于操作而影响的数据库的数据的列数）
		if($ret){
			$output['code'] = 0;
		}
		else{
			$output['code'] = 1;
		}
		
		$output['content'] = $data['content'];
		
		//通过表来查找发送者的昵称
		$sendName = $this->westore_model->findSenderName($data['sender']);
		$output['userandtime'] = $sendName ."   ".$data['sendTime']; 
		
		echo json_encode($output);
	}
	
	/**
	 * 删除商品
	 */
	public function deleteSomeProducts(){
		//获取数据
		$productNo = $this->input->get_post("productNo",true);
		
		//删除商品
		$ret = $this->westore_model->DeleteProduct($productNo);
		
		$output = array();
		$output['code'] = 0;
		
		echo json_encode($output);
	}
	
	/**
	 * 完成支付动作：插入订单流水，修改订单状态以及扣钱
	 */
	public function finishPayProducts(){
		//获取数据
		$data = array();
		//用户号：通过cookie获取
		$data['userNo'] = $this->input->cookie("userNo");
		$data['orderNo'] = $this->input->get_post("orderNo",true);
		$data['orderMoney'] = $this->input->get_post("orderMoney",true);
		
		$productNo = $this->input->get_post("productNo",true);
		$buyAmount = $this->input->get_post("buyAmount",true);
		
		/**
		 * 关于订单状态:0——订单发起；1——用户已支付；2——商户已发货；3——用户已收到货；4——用户退款
		 * 这里：0——>1
		 */
		$data['statusAfterOperate'] = 1;
		$data['createTime'] = date("Y-m-d H:i:s");
		$data['operatorNo'] = $this->input->cookie("userNo");
		
		//判断用户是否有钱付款，否则不作任何改变
		$totalAccount = $this->westore_model->GetAccountMoney($data['userNo']);
		
		if($data['orderMoney'] > $totalAccount){
			//不足以付款
			$output = array();
			$output['code'] = -1;
			echo json_encode($output);
		}
		//余额足够的话，开始插入订单流水表
		else{
			//插入订单流水表
			$ret1 = $this->westore_model->InsertOrderFlow($data);
			
			$value = 1;
			$ret2 = $this->westore_model->UpdateOrderStatus($data['orderNo'],$value);
			
			$deposit = $totalAccount - $data['orderMoney'];
			
			$ret3 = $this->westore_model->UpdateTotalAccount($deposit,$data['userNo']);
			
			//同时修改库存量
			
			$productInfo = array();

			$ret4 = $this->westore_model->GetProductInfo($productNo,$productInfo);
			
			$ret5 = $this->westore_model->UpdateInventory($productNo,$productInfo['inventory'] - $buyAmount);
			
			$output = array();
			$output['code'] = 0;
			
			echo json_encode($output);
		}
	}

	/**
	 * 商家发货
	 */
	public function sendSomeProducts(){
		//获取数据
		$data = array();
		
		$data['orderNo'] = $this->input->get_post("orderNo",true);
		$data['userNo'] = $this->input->get_post("userNo",true);
		
		//退款发生的动作：修改订单状态，插入订单流水以及在账户钱上加值
		
		$orderInfo = array();
		
		$orderMoney = $this->westore_model->GetOrderMoney($data['orderNo']);
		
		$orderflow = array();
		
		$orderflow['userNo'] = $data['userNo'];
		$orderflow['orderNo'] = $data['orderNo'];
		$orderflow['orderMoney'] = $orderMoney;
		$orderflow['statusBeforeOperate'] = 1;
		$orderflow['statusAfterOperate'] = 2;
		$orderflow['createTime'] = date("Y-m-d H:i:s");
		$orderflow['operatorNo'] = $data['userNo'];
		
		//插入到订单流水表
		$ret1 = $this->westore_model->InsertOrderFlow($orderflow);
		
		//同时修改订单状态
		$value = 2;
		$ret2 = $this->westore_model->UpdateOrderStatus($data['orderNo'],$value);
		
		$output['errcode'] = 1;
		
		echo json_encode($output);
	}

	/**
	 * 商品退货
	 */
	public function refundSomeProducts(){
		//获取数据
		$data = array();
		
		$data['orderNo'] = $this->input->get_post("orderNo",true);
		$data['userNo'] = $this->input->get_post("userNo",true);
		
		//退款发生的动作：修改订单状态，插入订单流水以及在账户钱上加值
		
		$orderInfo = array();
		
		$orderMoney = $this->westore_model->GetOrderMoney($data['orderNo']);
		
		$orderflow = array();
		
		$orderflow['userNo'] = $data['userNo'];
		$orderflow['orderNo'] = $data['orderNo'];
		$orderflow['orderMoney'] = $orderMoney;
		$orderflow['statusBeforeOperate'] = 1;
		$orderflow['statusAfterOperate'] = 4;
		$orderflow['createTime'] = date("Y-m-d H:i:s");
		$orderflow['operatorNo'] = $data['userNo'];
		
		//插入到订单流水表
		$ret1 = $this->westore_model->InsertOrderFlow($orderflow);
		
		//同时修改订单状态
		$value = 4;
		$ret2 = $this->westore_model->UpdateOrderStatus($data['orderNo'],$value);
		
		//判断用户是否有钱付款，否则不作任何改变
		$totalAccount = $this->westore_model->GetAccountMoney($data['userNo']);
		
		$deposit = $totalAccount + $orderMoney;
		
		//查询购买数量
		$buyAmount = $this->westore_model->GetBuyAmount($data['orderNo']);
		$productNo = $this->westore_model->GetProductNo($data['orderNo']);
		//账户加余额
		$ret3 = $this->westore_model->UpdateTotalAccount($deposit,$data['userNo']);
		
		//释放库存
		//同时修改库存量
		$productInfo = array();

		$ret4 = $this->westore_model->GetProductInfo($productNo,$productInfo);
			
		$ret5 = $this->westore_model->UpdateInventory($productNo,$productInfo['inventory'] + $buyAmount);
		
		$output['errcode'] = 1;
		
		echo json_encode($output);
	}
	
	/**
	 * 购买商品
	 */
	public function buySomeProducts(){
		//获取数据
		$data = array();
		
		$data['productNo'] = $this->input->get_post("productNo",true);
		$data['productName'] = $this->input->get_post("productName",true);
		
		//商品金额由商品单价*购买数量
		$data['productMoney'] = $this->input->get_post("unitPrice",true) * $this->input->get_post("buyAmount",true) * 100;
		//用户号
		$data['userNo'] = $this->input->cookie("userNo");
		
		//商户号：通过商品编号来查找
		$data['merchantNo'] = $this->westore_model->GetMerchantNo($data['productNo']);
		
		//商户名称：通过商户号获取
		$data['merchantName'] = $this->westore_model->GetMerchantName($data['merchantNo']);
		
		$data['freight'] = $this->input->get_post("freight",true) * 100;
		
		//订单金额=商品金额+运费
		$data['orderMoney'] = $data['productMoney'] + $data['freight'];
		
		$data['createTime'] = date("Y-m-d H:i:s");
		
		//购买数量
		$data['buyAmount'] = $this->input->get_post("buyAmount",true);
		
		//最后：订单金额有商户号和商品编号哈希而成
		$data['orderNo'] = sha1($data['userNo'].$data['productNo'].$data['merchantNo'].$data['createTime']);

		$ret = $this->westore_model->InsertOrder($data);
		
		$output = array();
		$output['code'] = 0;
		$output['orderNo'] = $data['orderNo'];
		$output['orderMoney'] = $data['orderMoney'];
		$output['productNo'] = $data['productNo'];
		$output['buyAmount'] = $this->input->get_post("buyAmount",true);
		
		echo json_encode($output);
	}
	
	/**
	 * 更改商品
	 */
	public function updateSomeProducts(){
		//获取数据
		$data = array();
		
		$data['productName'] = $this->input->get_post("productName",true);
		$data['productStatus'] = $this->input->get_post("productStatus",true);
		$data['productCode'] = $this->input->get_post("productCode",true);
		
		//注意，单价以分作为单位
		$data['unitprice'] = $this->input->get_post("unitPrice",true) * 100;
		
		$data['inventory'] = $this->input->get_post("inventory",true);
		$data['productInfo'] = $this->input->get_post("productRemark",true);
		
		//商品号由商品编号哈希而成
		//$data['productNo'] = sha1($data['productCode']);
		$productNo = $this->input->get_post("productNo",true);
		//执行插入操作
		//pass
		
		//状态含义转换：1——线上；2——促销；3——下架
		if($data['productStatus'] == '线上'){
			$data['productStatus'] = 1;
		}
		else if($data['productStatus'] == '促销'){
			$data['productStatus'] = 2;
		}
		else if($data['productStatus'] == '下架'){
			$data['productStatus'] = 3;
		}
		
		//获取商户号
		$merchantNo = $this->input->cookie("merchantNo");
		
		//获取当前时间
		$data['createTime'] = date("Y-m-d H:i:s");
		//插入商品
		$ret = $this->westore_model->UpdateProduct($merchantNo,$data,$productNo);
		
		$output = array();
		$output['code'] = 0;
		
		echo json_encode($output);
	}

	/**
	 * 新增商品
	 */
	public function addSomeProducts(){
		//获取数据
		$data = array();
		
		$data['ProductPic'] = sha1($this->input->get_post("fileName",true)).".jpg";
		$data['productName'] = $this->input->get_post("productName",true);
		$data['productStatus'] = $this->input->get_post("productStatus",true);
		$data['productCode'] = $this->input->get_post("productCode",true);
		
		//注意，单价以分作为单位
		$data['unitprice'] = $this->input->get_post("unitPrice",true) * 100;
		
		$data['inventory'] = $this->input->get_post("inventory",true);
		$data['productInfo'] = $this->input->get_post("productRemark",true);
		
		//商品号由商品编号哈希而成
		$data['productNo'] = sha1($data['productCode']);
		//执行插入操作
		//pass
		
		//状态含义转换：1——线上；2——促销；3——下架
		if($data['productStatus'] == '线上'){
			$data['productStatus'] = 1;
		}
		else if($data['productStatus'] == '促销'){
			$data['productStatus'] = 2;
		}
		else if($data['productStatus'] == '下架'){
			$data['productStatus'] = 3;
		}
		
		//获取商户号
		$merchantNo = $this->input->cookie("merchantNo");
		
		//获取商家编码
		$merchantCode = $this->westore_model->GetMerchantCode($merchantNo);
		
		//获取商家名称
		$merchantName = $this->westore_model->GetMerchantName($merchantNo);
		
		$data['merchantCode'] = $merchantCode;
		$data['merchantNo'] = $merchantNo;
		$data['merchantName'] = $merchantName;
		
		//获取当前时间
		$data['createTime'] = date("Y-m-d H:i:s");
		//插入商品
		$ret = $this->westore_model->InsertProduct($data);
		
		$output = array();
		$output['code'] = 0;
		
		echo json_encode($output);
	}
	
	/**
	 * 接收商品图片
	 */
	public function receiveSomeProducts(){
		$error = "";
		$msg = "";
		$fileElementName = 'productPicture';
		if(!empty($_FILES[$fileElementName]['error'])){
			
			//各种接收文件的错误及其错误码显示
			switch($_FILES[$fileElementName]['error']){

				case '1':
					$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
					break;
				case '2':
					$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
					break;
				case '3':
					$error = 'The uploaded file was only partially uploaded';
					break;
				case '4':
					$error = 'No file was uploaded.';
					break;

				case '6':
					$error = 'Missing a temporary folder';
					break;
				case '7':
					$error = 'Failed to write file to disk';
					break;
				case '8':
					$error = 'File upload stopped by extension';
					break;
				case '999':
				default:
					$error = 'No error code avaiable';
			}
		}
		elseif(empty($_FILES['productPicture']['tmp_name']) || $_FILES['productPicture']['tmp_name'] == 'none'){
			$error = 'No file was uploaded..';
		}
		else {
			$msg .= $_FILES['productPicture']['name'];
			//$msg .= " File Size: " . @filesize($_FILES['productPicture']['tmp_name']);
			//for security reason, we force to remove all uploaded file
			
			//将文件存起来
			
			@unlink($_FILES['productPicture']);		
		
			
		}		
		echo "{";
		echo				"error: '" . $error . "',\n";
		echo				"msg: '" . $msg . "'\n";
		echo "}";
		if(!$error){
			$fileName = sha1($_FILES['productPicture']['name'])."";
			move_uploaded_file($_FILES['productPicture']['tmp_name'], "./static/img/products/" . $fileName . ".jpg");
		}
	}
	
	/**
	 * 查询用户关系链
	 */
	public function queryUser(){
		$data = array();
		
		$merchantNo = $this->input->cookie("merchantNo");
		$pageNo = $this->input->get_post("page");
		
		//设定分页长度，表示一页有多少条（先暂时设为2）
		$pageSize = 3;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//获取数据
		$page = $this->input->get_post("page",true);
		$data['user'] = $this->input->get_post("user",true);
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$userList = array();
		
		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetStaffOfMerchant($merchantNo,$userList,$totalNum,$pageSize,$startIndex);
		
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $userList;
		$output['totalNum'] = $totalNum;
		
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $page;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
		
	}

	/**
	 * 查询商品列表
	 */
	public function queryProducts(){
		$data = array();
		
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$data['merchantName'] = $this->input->get_post("merchantName",true);
		$data['productsName'] = $this->input->get_post("productsName",true);
		$data['productsCode'] = $this->input->get_post("productsCode",true);
		$funcName = $this->input->get_post("funcName",true);
		
		
		//设定分页长度，表示一页有多少条(先暂时设为2)
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		
		$productsList = array();
		
		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetProductsList($funcName,$data,$productList,$totalNum,$pageSize,$startIndex);
		
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $productList;
		$output['totalNum'] = $totalNum;
		$output['post2'] = print_r($productList,true);
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
	}

	/**
	 * 查询我的商品
	 */
	public function queryMyProducts(){
		$data = array();
		
		$merchantNo = $this->input->cookie("merchantNo",true);
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$productsName = $this->input->get_post("productsName",true);
		$productsCode = $this->input->get_post("productsCode",true);
		
		
		//设定分页长度。表示一页有多少条（先暂时设为10）
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$productList = array();
		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetMyProductsList($merchantNo,$productsName,$productsCode,$productList,$totalNum,$pageSize,$startIndex);
		
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $productList;
		$output['totalNum'] = $totalNum;
		
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
	}

	/**
	 * 查询收单列表
	 */
	public function queryReceiveOrder(){
		$data = array();
		
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$data['startdate'] = $this->input->get_post("startdate",true);
		$data['enddate'] = $this->input->get_post("enddate",true);
		$data['remark'] = $this->input->get_post("remark",true);
		
		//设定分页长度，表示一页有多少条（先暂时设为10）
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$receiveOrderList = array();
		
		//用户号
		$merchantNo = $this->input->cookie("merchantNo");

		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetReceiveOrderList($merchantNo,$data,$receiveOrderList,$totalNum,$pageSize,$startIndex);
		
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $receiveOrderList;
		$output['totalNum'] = $totalNum;

		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
	}
	
	/**
	 * 查询订单
	 */
	public function queryOrder(){
		$data = array();
		
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$data['startdate'] = $this->input->get_post("startdate",true);
		$data['enddate'] = $this->input->get_post("enddate",true);
		$data['tradeorder'] = $this->input->get_post("tradeorder",true);
		$data['tradeuser'] = $this->input->get_post("tradeuser",true);
		$data['remark'] = $this->input->get_post("remark",true);
		$data['minmoney'] = $this->input->get_post("earnmoneymin",true);
		$data['maxmoney'] = $this->input->get_post("earnmoneymax",true);
		
		$orderStatus = $this->input->get_post("orderstatus",true);
		
		if($orderStatus == '所有'){
			$orderStatus = 0;
		}
		else if($orderStatus == '用户已支付'){
			$orderStatus = 1;
		}
		else if($orderStatus == '商户已发货'){
			$orderStatus = 2;
		}
		else if($orderStatus == '用户已收到货'){
			$orderStatus = 3;
		}
		else if($orderStatus == '用户退款'){
			$orderStatus = 4;
		}
		
		$data['orderStatus'] = $orderStatus;
		
		$userNo = '';
		//根据昵称查找下单用户
		if($data['tradeuser']){
			$userNo = $this->westore_model->GetUserNo($data['tradeuser']);
			if(!$userNo){
				$userNo = 'no this user';
			}
		}
		$data['userNo'] = $userNo;
		
		//设定分页长度，表示一页有多少条（先暂时设为10）
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$orderList = array();
		
		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetOrderList($data,$orderList,$totalNum,$pageSize,$startIndex);
		
		$output['post'] = $orderList;
		$output['totalNum'] = $totalNum;
		$output['list'] = print_r($orderList,true);
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
	}

	/**
	 * 查询消费列表
	 */
	public function queryConsume(){
		$data = array();
		
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$data['startdate'] = $this->input->get_post("startdate",true);
		$data['enddate'] = $this->input->get_post("enddate",true);
		$data['remark'] = $this->input->get_post("remark",true);
		
		//设定分页长度，表示一页有多少条（先暂时设为10）
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$consumeList = array();
		
		//用户号
		$userNo = $this->input->cookie("userNo");

		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetConsumeList($userNo,$data,$consumeList,$totalNum,$pageSize,$startIndex);
		
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $consumeList;
		$output['totalNum'] = $totalNum;
		
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
	}
	
	/**
	 * 查询微信会员
	 */
	public function queryWechatMembership(){
		$data = array();
		
		//获取数据
		$pageNo = $this->input->get_post("page",true);
		$wechatPublicNumber = $this->input->get_post("wechatPublicNumber",true);
		$wechatUserName = $this->input->get_post("wechatUserName",true);
		
		//设定分页长度，表示一页有多少条（先暂时设为10）
		$pageSize = 10;
		$startIndex = ($pageNo - 1) * $pageSize;
		
		//返回结果
		$output = array();
		$output['code'] = 'success';
		$output['errcode'] = 0;
		
		//设定返回的总条数
		$totalNum = 0;
		
		$wechatMembershipList = array();
		
		
		//$pageSize——一页的长度；$startIndex——起始坐标
		$ret = $this->westore_model->GetWechatMembership($wechatPublicNumber,$wechatUserName,$wechatMembershipList,$totalNum,$pageSize,$startIndex);
	
		if($ret){
			$output['errcode'] = 0;
		}
		else{
			$output['errcode'] = 1;
		}
		
		$output['post'] = $wechatMembershipList;
		$output['totalNum'] = $totalNum;
		
		if (!empty($totalNum) && $totalNum > 0) {
			$append = 0;
			if (($output['totalNum'] % $pageSize) == 0) {
				$append = 0;
			}
			else {
				$append = 1;
			}
			$output['curpage'] = $pageNo;
			$output['total_page'] = ((int)($output['totalNum']/$pageSize) + $append);
		}
		echo json_encode($output);
		
	}

	/**
	 * 校验cookie，防止伪造cookie
	 */
	public function checkUserCookie($cookie){
		
		return $ret = $this->westore_model->CheckUserCookie($cookie);
	}
	
	public function checkMerchantCookie($cookie){
		return $ret = $this->westore_model->CheckMerchantCookie($cookie);
	}
	
	/**
	 * 查询订单是否存在
	 */
	public function checkOrder($orderNo){
		return $ret = $this->westore_model->CheckOrder($orderNo);
	}
	
	/**
	 * 查询商品是否存在
	 */
	public function checkProduct($productNo){
		return $ret = $this->westore_model->CheckProduct($productNo);
	}
}

/* End of file WeStore.php */
/* Location: ./application/controllers/WeStore.php */