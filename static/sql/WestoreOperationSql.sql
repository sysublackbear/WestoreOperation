create database westoreoperation;

use westoreoperation;

create table orders(
orderID int unsigned primary key auto_increment,
orderNo varchar(64) not null,
orderType tinyint default 0,
userNo varchar(64) not null,
merchantNo varchar(64) not null,
merchantName varchar(64) not null,
productNo varchar(64) not null,
productName varchar(64) not null,
productMoney int unsigned not null,
buyAmount int unsigned not null,
freight int unsigned default 0,
orderMoney int unsigned not null,
paidMoney int unsigned default 0,
createTime datetime not null,
remark varchar(64),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table orderflow(
orderflowID int unsigned primary key auto_increment,
orderNo varchar(64) not null,
userNo varchar(64) not null,
orderMoney int unsigned not null,
statusBeforeOperate int unsigned default 0,
statusAfterOperate int unsigned default 0,
createTime datetime not null,
operatorNo varchar(64) not null,
remark varchar(64),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table role(
userID int unsigned primary key auto_increment,
userNo varchar(64) not null,
loginAccount varchar(32) not null,
loginPassword varchar(64) not null,
email varchar(32) not null,
telephone varchar(32) not null,
nickname varchar(32) not null,
userName varchar(32) not null,
wechatNo varchar(32) not null,
userIcon varchar(32),
totalAccount int unsigned default 0,
availableBalance int unsigned default 0,
depositBalance int unsigned default 0,
noSettledBalance int unsigned default 0,
roleType int unsigned default 1,
isLogin tinyint default 0,
bankAccountUser varchar(32) not null,
bankName varchar(32) not null,
bankInfo varchar(32) not null,
bankAccountInfo varchar(32) not null,
bankAccountNo varchar(32) not null,
bankAccountUserName varchar(32) not null,
amountOfSafeHost int unsigned default 1,
remark varchar(64),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table merchant(
merchantID int unsigned primary key auto_increment,
merchantNo varchar(64) not null,
merchantName varchar(64) not null,
merchantCode varchar(64) not null,
userNo varchar(64) not null,
contact varchar(64) not null,
telphone varchar(64) not null,
fax varchar(64) not null,
merchantEmail varchar(64) not null,
starttime varchar(10) not null,
endtime varchar(10) not null,
freight int unsigned default 0,
minFreight int unsigned default 0,
freightTime varchar(10) not null,
freightArea varchar(32) not null,
wechatMembershipNo varchar(32),
website varchar(64),
websiteName varchar(32),
remark varchar(32),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table product(
productID int unsigned primary key auto_increment,
productPic varchar(64) not null,
productNo varchar(64) not null,
productCode varchar(64) not null,
merchantCode varchar(64) not null,
merchantName varchar(64) not null,
merchantNo varchar(64) not null,
productName varchar(64) not null,
productStatus int unsigned default 1,
unitprice int unsigned not null,
inventory int unsigned not null,
createTime datetime not null,
productInfo varchar(2048) not null,
remark varchar(64),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table userhost(
userNo varchar(64) not null primary key,
serverhost varchar(64),
hostdatabase varchar(64),
port int unsigned,
account varchar(64),
password varchar(64),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table messages(
messageID int unsigned primary key auto_increment,
senderNo varchar(64) not null,
getterNo varchar(64) not null,
contents varchar(2048) not null,
sendTime datetime not null,
isGet tinyint default 0,
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table fans(
fanID int unsigned primary key auto_increment,
fanIcon varchar(64),
fanNickname varchar(64) not null,
wechatMembershipNo varchar(64) not null,
city varchar(10) not null,
isRun tinyint default 0,
lastOnlineTime datetime not null,
wechatNo varchar(32) not null,
userNo varchar(64) not null,
lastReplyTime datetime not null,
remark varchar(32),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);

create table staff(
staffID int unsigned primary key auto_increment,
merchantNo varchar(32) not null,
contact varchar(64) not null,
loginAccount varchar(32) not null,
loginPassword varchar(32) not null,
remark varchar(32),
reserved1 varchar(64),
reserved2 varchar(64),
reserved3 varchar(64),
reserved4 varchar(64),
reserved5 varchar(64)
);


