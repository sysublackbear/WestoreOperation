<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *  O2O微店平台的model（数据层）
 *  @author sysublackbear
 *  @copyright 2015 SYSU
 *  @license http://sysublackbear.github.io/
 */
 
class Westore_Model extends CI_Model {
	/**
	 * 构造函数
	 */
	public function __construct(){
		parent::__construct();
		//连接数据库
		$this->load->database();
	}
	
	/**
	 * 获取用户基本信息
	 */
	public function GetUserInfo($user,&$userInfo,&$settledInfo,&$safeCertificate){
		
		//标准查询
		$sql1 = "SELECT * FROM role WHERE userNo='" . $user . "' LIMIT 1";
		$query1 = $this->db->query($sql1);
		
		//如果结果集为空，说明可以注册
		if(!$query1->result_array()){
			return false;
		}
		else{
			foreach($query1->result_array() as $row){
				$settledInfo['bankAccountUser'] = $row['bankAccountUser'];
				$settledInfo['bankName'] = $row['bankName'];
				$settledInfo['bankInfo'] = $row['bankInfo'];
				$settledInfo['bankAccountInfo'] = $row['bankAccountInfo'];
				$settledInfo['bankAccountNo'] = $row['bankAccountNo'];
				$settledInfo['bankAccountUserName'] = $row['bankAccountUserName'];	
			}
		}
		
		//标准查询
		$sql2 = "SELECT * FROM merchant WHERE userNo='" . $user . "' LIMIT 1";
		$query2 = $this->db->query($sql2);
		
		//如果结果集为空，说明可以注册
		if($query2->result_array()){
			foreach($query2->result_array() as $row){
				$userInfo['merchantNo'] = $row['merchantCode'];
				$userInfo['companyName'] = $row['merchantName'];
				$userInfo['contact'] = $row['contact'];
				$userInfo['userTelphone'] = $row['telphone'];
				$userInfo['userWebsiteName'] = $row['websiteName'];
				$userInfo['userWebsite'] = $row['website'];
			}
		}
		
		//安全证书信息
		//这里后续插上数据库查找操作
		$safeCertificate['amount'] = 5;
		
		return true;
	}


	/**
	 * 查询商家旗下员工的基本信息
	 */
	public function GetStaffOfMerchant($merchantNo,&$userList,&$totalNum,$pageSize,$startIndex){
		//标准查询
		$sql1 = "SELECT merchantCode FROM merchant WHERE merchantNo='" . $merchantNo . "'";
		$query1 = $this->db->query($sql1);
		$merchantCode = '';
		
		//先获取商家编码
		//如果结果集为空，说明可以注册
		if(!$query1->result_array()){
			return false;
		}
		else{
			foreach($query1->result_array() as $row){
				$merchantCode = $row['merchantCode'];
			}
			//然后通过在staff表上面查询员工信息
			$sql2 = "SELECT * FROM staff where merchantNo='" . $merchantCode . "' LIMIT ". $startIndex . " , " . $pageSize;
			
			$query2 = $this->db->query($sql2);
			
			if($query2->result_array()){
				$i = 0;
				foreach($query2->result_array() as $row){
					$staff = array();
					$staff['loginAccount'] = $row['loginAccount'];
					$staff['loginName'] = $row['contact'];
					
					$head = $row['loginPassword'][0];
					$len = count($row['loginPassword']);
					$tail = $row['loginPassword'][$len];
					
					$staff['loginPassword'] = $head . "******" . $tail;
					$staff['remark'] = $row['remark'];
					
					$userList[$i] = $staff;
					
					$i++;
				}
				$totalNum = $i;
			}
			return true;
		}
	}

	/**
	 * 查询商品列表
	 */
	public function GetProductsList($funcName,$data,&$productList,&$totalNum,$pageSize,$startIndex){
		//根据文件名选择不同的sql语句
		$sql = "SELECT * FROM product";
		if($funcName == "onlineProducts" || $funcName == "onlineProducts#"){
			//查询在线商品
			//如果商家名称不为空
			$sql .= " WHERE productStatus=1"; 
			if($data['merchantName']){
				$sql .= " AND merchantName='" . $data['merchantName'] . "'";
			}
			else if($data['productsName']){
				$sql .= " AND productName='" . $data['productName'] . "'";
			}
			else if($data['productsCode']){
				$sql .= " AND productsCode='" . $data['productName'] . "'";
			}
			
		}
		else if($funcName == "salesPromotion" || $funcName == "salesPromotion#"){
			//查询促销商品
			//查询在线商品
			//如果商家名称不为空
			$sql .= " WHERE productStatus=2"; 
			if($data['merchantName']){
				$sql .= " AND merchantName='" . $data['merchantName'] . "'";
			}
			else if($data['productsName']){
				$sql .= " AND productName='" . $data['productName'] . "'";
			}
			else if($data['productsCode']){
				$sql .= " AND productsCode='" . $data['productName'] . "'";
			}
			
		}
		
		$sql .= " LIMIT ". $startIndex . " , " . $pageSize;
		$query = $this->db->query($sql);
		//处理数据
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$productitem = array();
				$productitem['lineno'] = $i + 1;
				$productitem['productPic'] = $row['productPic'];
				$productitem['merchantCode'] = $row['merchantCode'];
				$productitem['merchantName'] = $row['merchantName'];
				$productitem['productName'] = $row['productName'];
				
				//处理金钱
				$productitem['unitprice'] = number_format((float)$row['unitprice'] / 100,2);
				$productitem['productCode'] = $row['productCode'];
				$productitem['inventory'] = $row['inventory'];
				
				if($row['productStatus'] == 1){
					$productitem['productStatus'] = '线上';
				}
				else if($row['productStatus'] == 2){
					$productitem['productStatus'] = '促销';
				}
				else if($row['productStatus'] == 3){
					$productitem['productStatus'] = '下架';
				}
				
				$productitem['productNo'] = $row['productNo'];
				
				$productList[$i] = $productitem;
					
				$i++;
			}
			$totalNum = $i;
		}
	}
	 


	/**
	 * 查询我的商品列表
	 */
	public function GetMyProductsList($merchantNo,$productsName,$productsCode,&$productList,&$totalNum,$pageSize,$startIndex){
		//判断哪个变量为空
		if($productsName && $productsCode){
			//两者都不为空
			//标准查询
			$sql = "SELECT * FROM product WHERE merchantNo='" . $merchantNo . "' AND productName='" . $productsName . "' AND productCode='" . $productsCode . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);	
		}
		else if(!$productsName && $productsCode){
			//商品名称为空
			//标准查询
			$sql = "SELECT * FROM product WHERE merchantNo='" . $merchantNo . "' AND productCode='" . $productsCode . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		else if($productsName && !$productsCode){
			//商品编码为空
			//标准查询
			$sql = "SELECT * FROM product WHERE merchantNo='" . $merchantNo . "' AND productName='" . $productsName . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		else if(!$productsName && !$productsCode){
			//两个都为空
			//标准查询
			$sql = "SELECT * FROM product WHERE merchantNo='" . $merchantNo . "'  LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		
		//处理数据
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$productitem = array();
				$productitem['lineno'] = $i + 1;
				$productitem['productPic'] = $row['productPic'];
				$productitem['merchantCode'] = $row['merchantCode'];
				$productitem['merchantName'] = $row['merchantName'];
				$productitem['productName'] = $row['productName'];
				
				//处理金钱
				$productitem['unitprice'] = number_format((float)$row['unitprice'] / 100,2);
				$productitem['productCode'] = $row['productCode'];
				$productitem['inventory'] = $row['inventory'];
				
				if($row['productStatus'] == 1){
					$productitem['productStatus'] = '线上';
				}
				else if($row['productStatus'] == 2){
					$productitem['productStatus'] = '促销';
				}
				else if($row['productStatus'] == 3){
					$productitem['productStatus'] = '下架';
				}
				
				$productitem['productNo'] = $row['productNo'];
				
				$productList[$i] = $productitem;
					
				$i++;
			}
			$totalNum = $i;
		}
	}

	/**
	 * 查询用户的收单方案
	 */
	public function GetReceiveOrderList($merchantNo,$data,&$receiveOrderList,&$totalNum,$pageSize,$startIndex){
		//标准查询
		$sql = "SELECT * FROM orders WHERE merchantNo='" . $merchantNo . "' AND (orderType = 1 OR orderType = 2 OR orderType = 3) AND (createTime BETWEEN '" 
		. $data['startdate'] . "' AND '" . $data['enddate'] ."') LIMIT " . $startIndex . " , " . $pageSize;

		$query = $this->db->query($sql);
		
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$consumeitem = array();
				
				$consumeitem['createTime'] = $row['createTime'];
				$consumeitem['orderNo'] = $row['orderNo'];
				
				
				$consumeitem['orderType'] = $row['orderType'];
				
				if($consumeitem['orderType'] == 1){
					$consumeitem['orderType'] = '已支付，等待商家发货';
				}
				else if($consumeitem['orderType'] == 2){
					$consumeitem['orderType'] = '商家已发货';
				}
				else if($consumeitem['orderType'] == 3){
					$consumeitem['orderType'] = '已收到商品';
				}
				
				
				$consumeitem['userNo'] = $row['userNo'];
				$consumeitem['merchantName'] = $this->GetMerchantName($row['merchantNo']);
				$consumeitem['orderMoney'] = number_format((float)$row['orderMoney'] / 100,2);
				$consumeitem['productMoney'] = number_format((float)$row['productMoney'] / 100,2);
				$consumeitem['freight'] = number_format((float)$row['freight'] / 100,2);
				$consumeitem['remark'] = $row['remark'];
				$consumeitem['userName'] = $this->input->cookie("nickname");
				$consumeitem['productNo'] = $row['productNo'];
				$receiveOrderList[$i] = $consumeitem;
					
				$i++;
			}
			$totalNum = $i;
		}
		return true;
	}

	/**
	 * 订单查询
	 */
	public function GetOrderList($data,&$orderList,&$totalNum,$pageSize,$startIndex){
		//标准查询
		$sql = "SELECT * FROM orders WHERE (createTime BETWEEN '" . $data['startdate'] . "' AND '" . $data['enddate'] ."') ";
		
		//交易单号不为空
		if($data['tradeorder']){
			$sql .= " AND orderNo = '" . $data['tradeorder'] . "'";
		}
		if($data['userNo']){
			$sql .= " AND userNo = '" . $data['userNo'] . "'";
		}
		if($data['remark']){
			$sql .= " AND remark = '" . $data['remark'] . "'";
		}
		if($data['orderStatus'] != 0){
			$sql .= " AND orderType=" . $data['orderStatus'];
		}
		if($data['minmoney'] || $data['maxmoney']){
			$sql .= " AND ( ";
			if($data['minmoney'] && $data['maxmoney']){
				$sql .= " orderMoney > " . $data['minmoney'] . " AND orderMoney < " . $data['maxmoney'];
			}
			else if($data['minmoney'] && !$data['maxmoney']){
				$sql .= " orderMoney > " . $data['minmoney'];
			}
			else if(!$data['minmoney'] && $data['maxmoney']){
				$sql .= " orderMoney < " . $data['maxmoney'];
			}	
			$sql .= " ) ";
		}
		
		$sql .= " LIMIT " . $startIndex . " , " . $pageSize;
		//file_put_contents('D:\xampp\htdocs\phpchat\mylog.log',"sql=".$sql."\r\n",FILE_APPEND);
		$query = $this->db->query($sql);
		
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$consumeitem = array();
				
				$consumeitem['createTime'] = $row['createTime'];
				$consumeitem['orderNo'] = $row['orderNo'];
				
				
				$consumeitem['orderType'] = $row['orderType'];
				
				if($consumeitem['orderType'] == 1){
					$consumeitem['orderType'] = '已支付，等待商家发货';
				}
				else if($consumeitem['orderType'] == 2){
					$consumeitem['orderType'] = '商家已发货';
				}
				else if($consumeitem['orderType'] == 3){
					$consumeitem['orderType'] = '已收到商品';
				}
				else if($consumeitem['orderType'] == 4){
					$consumeitem['orderType'] = '用户已退款';
				}
				
				
				$consumeitem['userNo'] = $row['userNo'];
				$consumeitem['merchantName'] = $this->GetMerchantName($row['merchantNo']);
				$consumeitem['orderMoney'] = number_format((float)$row['orderMoney'] / 100,2);
				$consumeitem['productMoney'] = number_format((float)$row['productMoney'] / 100,2);
				$consumeitem['freight'] = number_format((float)$row['freight'] / 100,2);
				$consumeitem['remark'] = $row['remark'];
				$consumeitem['userName'] = $this->input->cookie("nickname");
				$consumeitem['productNo'] = $row['productNo'];
				$orderList[$i] = $consumeitem;
					
				$i++;
			}
			$totalNum = $i;
		}
		return true;
	}

	/**
	 * 查询用户的消费
	 */
	public function GetConsumeList($userNo,$data,&$consumeList,&$totalNum,$pageSize,$startIndex){
		//标准查询
		$sql = "SELECT * FROM orders WHERE userNo='" . $userNo . "' AND (orderType = 1 OR orderType = 2 OR orderType = 3) AND (createTime BETWEEN '" 
		. $data['startdate'] . "' AND '" . $data['enddate'] ."') LIMIT " . $startIndex . " , " . $pageSize;

		$query = $this->db->query($sql);
		
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$consumeitem = array();
				
				$consumeitem['createTime'] = $row['createTime'];
				$consumeitem['orderNo'] = $row['orderNo'];
				
				
				$consumeitem['orderType'] = $row['orderType'];
				
				if($consumeitem['orderType'] == 1){
					$consumeitem['orderType'] = '已支付，等待商家发货';
				}
				else if($consumeitem['orderType'] == 2){
					$consumeitem['orderType'] = '商家已发货';
				}
				else if($consumeitem['orderType'] == 3){
					$consumeitem['orderType'] = '已收到商品';
				}
				
				
				$consumeitem['userNo'] = $row['userNo'];
				$consumeitem['merchantName'] = $this->GetMerchantName($row['merchantNo']);
				$consumeitem['orderMoney'] = number_format((float)$row['orderMoney'] / 100,2);
				$consumeitem['productMoney'] = number_format((float)$row['productMoney'] / 100,2);
				$consumeitem['freight'] = number_format((float)$row['freight'] / 100,2);
				$consumeitem['remark'] = $row['remark'];
				$consumeitem['userName'] = $this->input->cookie("nickname");
				$consumeitem['productNo'] = $row['productNo'];
				$consumeList[$i] = $consumeitem;
					
				$i++;
			}
			$totalNum = $i;
		}
		return true;
	}

	/**
	 * 查询有关微信公众号和微信粉丝
	 */
	public function GetWechatMembership($wechatPublicNumber,$wechatUserName,&$wechatMembershipList,&$totalNum,$pageSize,$startIndex){
		
		//判断哪个变量为空
		if(!$wechatPublicNumber){
			//微信公众号为空
			//标准查询
			$sql = "SELECT * FROM fans WHERE fanNickname='" . $wechatUserName . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		else if(!$wechatUserName){
			//微信昵称为空
			$sql = "SELECT * FROM fans WHERE wechatMembershipNo='" . $wechatPublicNumber . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		else{
			//两个都不为空
			$sql = "SELECT * FROM fans WHERE wechatMembershipNo='" . $wechatPublicNumber . "' AND fanNickname='" . $wechatUserName . "' LIMIT " . $startIndex . " , " . $pageSize;
			$query = $this->db->query($sql);
		}
		
		if($query->result_array()){
			$i = 0;
			foreach($query->result_array() as $row){
				$fanitem = array();
				$fanitem['lineno'] = $i + 1;
				$fanitem['portrait'] = $row['fanIcon'];
				$fanitem['userName'] = $row['fanNickname'];
				$fanitem['publicNumber'] = $row['wechatMembershipNo'];
				$fanitem['city'] = $row['city'];
				if($row['isRun'] == 1){
					$fanitem['booltransport'] = '是';
				}
				else if($row['isRun'] == 0){
					$fanitem['booltransport'] = '否';
				}
				$fanitem['lastOnlineTime'] = $row['lastOnlineTime'];
				$fanitem['lastReplyTime'] = $row['lastReplyTime'];
				$fanitem['userNo'] = $row['userNo'];
				$wechatMembershipList[$i] = $fanitem;
					
				$i++;
			}
			$totalNum = $i;
		}
		return true;
	}

	/**
	 * 设定登录状态为已登录
	 */
	public function setLogined($userNo){
		
		$sql = "UPDATE role SET isLogin=1 where userNo='" . $userNo . "'";
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 离线前先把登录状态设为未登录
	 */
	public function setNoLogined($userNo){
		$sql = "UPDATE role SET isLogin=0 where userNo='" . $userNo . "'";
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 通过userNo来查找昵称
	 */
	public function findSenderName($sender){
		//标准查询
		$sql = "SELECT nickname FROM role WHERE userNo='" . $sender . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['nickname'];
			}
			return $result;
		}
	}

	/**
	 * 根据商户号获取商家编码
	 */
	public function GetMerchantCode($merchantNo){
		//标准查询
		$sql = "SELECT merchantCode FROM merchant WHERE merchantNo='" . $merchantNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['merchantCode'];
			}
			return $result;
		}
	}
	
	/**
	 * 根据昵称查找用户号
	 */
	public function GetUserNo($nickname){
		//标准查询
		$sql = "SELECT userNo FROM role WHERE nickname='" . $nickname . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['userNo'];
			}
			return $result;
		}
	}
	
	/**
	 * 根据商户号获取商家名称
	 */
	public function GetMerchantName($merchantNo){
		//标准查询
		$sql = "SELECT merchantName FROM merchant WHERE merchantNo='" . $merchantNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['merchantName'];
			}
			return $result;
		}
	}
	
	/**
	 * 根据订单号获取购买数量
	 */
	public function GetBuyAmount($orderNo){
		//标准查询
		$sql = "SELECT buyAmount FROM orders WHERE orderNo='" . $orderNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['buyAmount'];
			}
			return $result;
		}
	}
	
	/**
	 * 根据订单号获取商品号
	 */
	public function GetProductNo($orderNo){
		//标准查询
		$sql = "SELECT productNo FROM orders WHERE orderNo='" . $orderNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['productNo'];
			}
			return $result;
		}
	}
	
	/**
	 * 校验密码是否正确
	 */
	public function CheckPassword($user,$password){
		
		//先看密码是否存在
		//标准查询
		$sql = "SELECT * FROM role WHERE userNo='" . $user . "' AND loginPassword='" . $password ."' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 校验商家是否有权利操作
	 */
	public function CheckMerchantProduct($merchantNo,$productNo){
		
		//先看密码是否存在
		//标准查询
		$sql = "SELECT * FROM product WHERE merchantNo='" . $merchantNo . "' AND productNo='" . $productNo ."' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 插入到role表里面
	 */
	public function InsertRole($role){
		$this->db->insert('role',$role);
		return true;
	}
	
	/**
	 * 插入到merchant表里面
	 */
	public function InsertMerchant($merchant){
		$this->db->insert('merchant',$merchant);
		return true;
	}
	
	/**
	 * 插入到userhost表
	 */
	public function InsertUserHost($userhost){
		$this->db->insert("userhost",$userhost);
		return true;
	}
	
	/**
	 * 插入到orderflow表里面
	 */
	public function InsertOrderFlow($orderFlow){
		$this->db->insert("orderflow",$orderFlow);
		return true;
	}
	
	/**
	 * 删除商品
	 */
	public function DeleteProduct($productNo){
		$sql1 = "SELECT productPic FROM product WHERE productNo='" . $productNo . "' LIMIT 1";
		
		$query1 = $this->db->query($sql1);
		
		$result = '';
		if($query1->result_array()){
			foreach($query1->result_array() as $row){
				$result = $row['productPic'];
			}
		}
		
		@unlink("./static/img/products/".$result);
		
		$sql = "DELETE FROM product where productNo='" . $productNo . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 更新商品信息
	 */
	public function UpdateProduct($merchantNo,$product,$productNo){
		
		$sql = "UPDATE product SET productName='" . $product['productName'] . "' , productStatus=" . $product['productStatus'] . " , productCode='"
		. $product['productCode'] . "' , unitprice=" . $product['unitprice'] . " , inventory=" . $product['inventory']
		. " , productInfo='" . $product['productInfo'] . "' , createTime='" . $product['createTime'] . "' where productNo='" . $productNo . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 修改订单状态
	 */
	public function UpdateOrderStatus($orderNo,$value){
		$sql = "UPDATE orders SET orderType=" . $value . " where orderNo='" . $orderNo . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 修改账户余额
	 */
	public function UpdateTotalAccount($deposit,$userNo){
		$sql = "UPDATE role SET totalAccount=" . $deposit . " where userNo='" . $userNo . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 修改库存
	 */
	public function UpdateInventory($productNo,$amount){
		$sql = "UPDATE product SET inventory=" . $amount . " where productNo='" . $productNo . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 插入到product表中
	 */
	public function InsertProduct($product){
		$this->db->insert("product",$product);
		return true;
	}
	
	/**
	 * 插入到订单表上面
	 */
	public function InsertOrder($order){
		$this->db->insert("orders",$order);
		return true;
	}
	 
	/**
	 * 校验账号是否重复
	 */
	public function CheckLoginNameRepeat($loginName){
		//标准查询
		$sql = "SELECT * FROM role WHERE loginAccount='" . $loginName . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 校验商家编码是否重复
	 */
	public function CheckMerchantCodeRepeat($merchantCode){
		//标准查询
		$sql = "SELECT * FROM merchant WHERE  merchantCode='" . $merchantCode . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 更新用户的密码
	 */
	public function UpdatePassword($user,$password){
		
		$sql = "UPDATE role SET loginPassword='" . $password['newPassword'] . "' where userNo='" . $user . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 更新用户的结算信息
	 */
	public function UpdateUserSettled($user,&$userSettled){
		
		$sql = "UPDATE role SET bankAccountUser='" . $userSettled['bankAccountUser'] . "' , bankName='" . $userSettled['bankName'] . "' , bankInfo='"
		. $userSettled['bankInfo'] . "' , bankAccountInfo='" . $userSettled['bankAccountInfo'] . "' , bankAccountNo='" . $userSettled['bankAccountNo']
		. "' , bankAccountUserName='" . $userSettled['bankAccountUserName'] . "' where userNo='" . $user . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 更新用户基本信息
	 */
	public function UpdateUserInfo($user,&$userInfo){
		
		//这里后续数据库字段名要改，改成telephone
		$sql = "UPDATE merchant SET telphone='" . $userInfo['userTelphone'] . "' , websiteName='" 
		. $userInfo['userWebsiteName'] . "' , website='" . $userInfo['userWebsite'] . "'";
		
		$query = $this->db->query($sql);
		
		return true;
	}
	
	/**
	 * 接收新的消息
	 */
	public function ReceiveNewMessage($data,&$messageList,&$totalNum,&$senderName){
		
		//标准查询(每次只取3条)
		$sql = "SELECT * FROM messages WHERE  getterNo='" . $data['getter'] . "' and senderNo='" . $data['sender'] .  "' and isGet=0 ORDER BY sendTime LIMIT 3";
		$query = $this->db->query($sql);
		$senderName = $this->findSenderName($data['sender']);
		//遍历结果集
		$i = 0;
		foreach($query->result_array() as $row){
			$messageList[$i]['sender'] = $row['senderNo'];
			$messageList[$i]['getter'] = $row['getterNo'];
			$messageList[$i]['sendTime'] = $row['sendTime'];
			$messageList[$i]['content'] = $row['contents'];
			
			
			$messageList[$i]['info'] = $senderName."   ".$row['sendTime'];
			$i++;
		}
		
		//记录总条数
		$totalNum = $i;
		
		
		
		if($totalNum){
			//同时更新消息变为已读
			$sql = "UPDATE messages set isGet=1 where getterNo='" . $data['getter'] . "' and senderNo='" . $data['sender'] . "'";
			$query = $this->db->query($sql);
			
			//上面的更新操作如果要检测出问题，可能日后需要增加日志打印
			//file_put_contents('D:\xampp\htdocs\phpchat\mylog.log',"sql=".$sql."\r\n",FILE_APPEND);
			
			return true;    //表明有拉取到数据
		}
		else{
			return false;
		}
	}
	
		
	/**
	 * 插入新的消息
	 */
	public function AddMessage($data){
		
		//标准插入
		$sql = "INSERT INTO messages (senderNo, getterNo, contents, sendTime) 
        VALUES ('".$data['sender']."', '".$data['getter']."', '".$data['content']."', '".$data["sendTime"]."')";
        
        $this->db->query($sql);
		
		//看他影响了多少页，有影响说明插入成功，没影响说明插入不成功。
		return  $this->db->affected_rows();
		
		/*
		 * 对象快捷插入法
		 */
		/*
		$this->db->insert('messages',$data);
		//代表插入成功
		return 1;
		 */
	}
	
	/**
	 * 校验用户的cookie
	 */
	public function CheckUserCookie($cookie){
		//标准查询
		$sql = "SELECT * FROM role WHERE userNo='" . $cookie . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 查询订单是否存在
	 */
	public function CheckOrder($orderNo){
		//标准查询
		$sql = "SELECT * FROM orders WHERE orderNo='" . $orderNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 查询商品是否存在
	 */
	public function CheckProduct($productNo){
		//标准查询
		$sql = "SELECT * FROM product WHERE productNo='" . $productNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
	}
	
	/**
	 * 校验商户有cookie
	 */
	public function CheckMerchantCookie($cookie){
		//标准查询
		$sql = "SELECT * FROM merchantNo WHERE userNo='" . $cookie . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			return true;
		}
		
	}
	
	/**
	 * 校验用户的账号和密码是否一致
	 */
	public function checkUsernamePassword($username,$password,&$result){
		//标准查询
		$sql = "SELECT * FROM role WHERE loginAccount='" . $username . "' AND loginPassword='" . $password ."' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			foreach($query->result_array() as $row){
				$result['userNo'] = $row['userNo'];
				$result['nickname'] = $row['nickname'];
				$result['roleType'] = $row['roleType'];
			}
			return true;
		}
	}
	
	/**
	 * 获取商品运费
	 */
	public function GetFreight($merchantNo){
		//标准查询
		$sql = "SELECT freight FROM merchant WHERE merchantNo='" . $merchantNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['freight'];
			}
			return $result;
		}
	}
	
	/**
	 * 根据订单号获取订单金额
	 */
	public function GetOrderMoney($orderNo){
		//标准查询
		$sql = "SELECT orderMoney FROM orders WHERE orderNo='" . $orderNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['orderMoney'];
			}
			return $result;
		}
	}
	
	/**
	 * 获取商户号
	 */
	public function GetMerchantNo($productNo){
		//标准查询
		$sql = "SELECT merchantNo FROM product WHERE productNo='" . $productNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['merchantNo'];
			}
			return $result;
		}
	}
	
	/**
	 * 获取账户余额
	 */
	public function GetAccountMoney($userNo){
		//标准查询
		$sql = "SELECT totalAccount FROM role WHERE userNo='" . $userNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		$result = '';
		if($query->result_array()){
			foreach($query->result_array() as $row){
				$result = $row['totalAccount'];
			}
			return $result;
		}
	}


	/**
	 * 根据商品编号获取商品信息
	 */
	public function GetProductInfo($productNo,&$productInfo){
		//标准查询
		$sql = "SELECT * FROM product WHERE productNo='" . $productNo . "' LIMIT 1 ";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			foreach($query->result_array() as $row){
				$productInfo = $row;
			}
			$productInfo['unitprice'] = (float)$productInfo['unitprice'] / 100;
			
			if($productInfo['productStatus'] == 1){
				$productInfo['productStatus'] = '线上';
			}
			else if($productInfo['productStatus'] == 2){
				$productInfo['productStatus'] = '促销';
			}
			else if($productInfo['productStatus'] == 3){
				$productInfo['productStatus'] = '下架';
			}
			return true;
		}
	}
	
	/**
	 * 校验是否存在该商户
	 */
	public function CheckBoolMerchant($userNo,&$result){
		//标准查询
		$sql = "SELECT * FROM merchant WHERE userNo='" . $userNo . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			foreach($query->result_array() as $row){
				$result['merchantNo'] = $row['merchantNo'];
				$result['merchantName'] = $row['merchantName'];
			}
			return true;
		}
	}
	
	/**
	 * 获取用户详细信息
	 */
	public function GetAccountView($user,&$userAccountView,&$userHistoryTrade,&$recentTradeAccords){
		//标准查询
		$sql = "SELECT * FROM role WHERE userNo='" . $user . "' LIMIT 1";
		$query = $this->db->query($sql);
		
		//如果结果集为空，说明可以注册
		if(!$query->result_array()){
			return false;
		}
		else{
			foreach($query->result_array() as $row){
				$userAccountView['totalAccount'] = $row['totalAccount'];
				$userAccountView['availableBalance'] = $row['availableBalance'];
				$userAccountView['depositBalance'] = $row['depositBalance'];
				$userAccountView['noSettledBalance'] = $row['noSettledBalance'];
			}
		}
	}
	
}

/* End of file westore_model.php */
/* Location: ./application/models/westore_model.php */