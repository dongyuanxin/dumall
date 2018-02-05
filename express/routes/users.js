var express = require('express');
var router = express.Router();
require('./../utils/util'); // node语法 = import
var User = require("./../models/users");
var mongoose = require("mongoose");

mongoose.connect('mongodb://imooc:dyx240030@119.29.108.188:27017/dumall');
mongoose.connection.on("connected",() => {
	console.log("Users-DB connected success");
});
mongoose.connection.on("error",() => {
	console.log("Users-DB connected fail");
});
mongoose.connection.on("disconnected",() => {
	console.log("Users-DB connected diesconnected");
});


/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.post("/", (req, res, next) => {
	let param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	};
	User.findOne(param, (err, doc) => {
		if (err) {
			res.json({
				status: "0",
				msg: err.message
			});
		} else if(doc===null){
			res.json({
				status:"0",
				msg:"Not found 404"
			})
		}else {
			if (doc) {
				res.cookie("userId", doc.userId, {
					path: "/",
					maxAge: 1000 * 60 * 60
				});
				res.cookie("userName", doc.userName, {
					path: "/",
					maxAge: 1000 * 60 * 60
				});
				// req.session.user = doc;
				res.json({
					status: "1",
					msg: "",
					result: {
						userName: doc.userName
					}
				});
			}
		}
	});
});

// 登出接口
router.post("/logout",(req,res,next) => {
	res.cookie("userId","",{
		path:"/",
		maxAge:-1
	}); // 清空cookie
	res.json({
		status:"1",
		msg:"",
		result:""
	})
});

// 检验窗口
router.get("/checkLogin",(req,res,next) => {
	if(req.cookies.userId){
		res.json({
			status:"1",
			msg:'',
			result:req.cookies.userName
		});
	} else {
		res.json({
			status:"0",
			msg:"未登录",
			result:""
		});
	}
});

router.get("/getCartCount",(req,res,next) => {
	if(req.cookies && req.cookies.userId) {
		let userId = req.cookies.userId;
		User.findOne({userId:userId},(err,doc)=>{
			if(err) {
				res.json({
					status:'0',
					msg:err.message,
					result:''
				});
			} else {
				let cartList = doc.cartList;
				let cartCount = 0;
				cartList.forEach((item)=>{
					cartCount += parseInt(item.productNum);
				});
				res.json({
					status:'1',
					msg:'',
					result:cartCount
				})
			}
		})
	}
});

// 查询当前用户的购物车数据
router.get("/cartList",(req,res,next) => {
	let userId = req.cookies.userId;
	User.findOne({userId:userId},(err,doc)=>{
		if(err){
			res.json({
				status:"0",
				msg:err.message,
				result:""
			});
		} else {
			if(doc) {
				res.json({
					status:"1",
					msg:"",
					result:doc.cartList
				});
			}
		}
	});
});

// 购物车删除
router.post("/cartDel",(req,res,next) => {
	let userId = req.cookies.userId,
		productId =req.body.productId;

	User.update({
		userId:userId
	},{
		$pull:{
			'cartList':{
				'productId':productId
			}
		}
	},(err,doc)=>{
		if(err){
			res.json({
				status:"0",
				msg:err.message,
				result:''
			});
		}else {
			res.json({
				status:"1",
				msg:'',
				result:doc
			});
		}
	});
});

// 修改商品数量
router.post("/cartEdit",(req,res,next)=> {
	let userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum,
		checked = req.body.checked;
	User.update({
		"userId":userId,
		"cartList.productId":productId
	},{
		"cartList.$.productNum":productNum,
		"cartList.$.checked":checked
	},(err,doc) => {
		if(err){
			res.json({
				status:"0",
				msg:err.message,
				result:''
			});
		}else {
			res.json({
				status:"1",
				msg:'',
				result:doc
			});
		}
	});
});

router.post("/editCheckAll",(req,res,next) => {
	let userId = req.cookies.userId,
		checkAll = req.body.checkAll?'1':'0';
	User.findOne({
		userId:userId
	},(err,doc) => {
		if(err){
			res.json({
				status:"0",
				msg:err.message,
				result:''
			});
		}else {
			if(doc){
				doc.cartList.forEach((item)=>{
					item.checked = checkAll;
				}); // 对每一项改变后保存修改。
				doc.save((err1,doc1)=>{
					if(err1){
						res.json({
							status:"0",
							msg:err1.message,
							result:''
						});
					} else {
						res.json({
							status:"1",
							msg:'',
							result:'suc'
						});
					}
				});
			}
		}
	});
});
// 查询用户地址接口
router.get("/addressList",(req,res,next)=>{
	let userId = req.cookies.userId;
	User.findOne({
		userId:userId
	},(err,doc)=>{
		if(err){
			res.json({
				status:'0',
				msg:err.message,
				result:''
			});
		}else {
			res.json({
				status:'1',
				msg:'',
				result:doc.addressList
			})
		}
	});
});

// 设置默认地址接口
router.post("/setDefault",(req,res,next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addressId;
	User.findOne({
		userId:userId
	},(err,doc)=>{
		if(err){
			res.json({
				status:'0',
				msg:err.message,
				result:''
			});
		}else {
			let addressList = doc.addressList;
			addressList.forEach((item)=>{
				if(item.addressId === addressId ){
					item.isDefault = true;
				} else {
					item.isDefault = false;
				}
			});
			doc.save((err1,doc1)=>{
				if(err1){
					res.json({
						status:'0',
						msg:err1.message,
						result:''
					});
				} else {
					res.json({
						status:'1',
						msg:'',
						result:''
					});
				}
			})
		}
	});
});

// 删除地址接口
router.post("/delAddress",(req,res,next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addressId;
	User.update({
		userId:userId
	},{
		$pull:{
			'addressList':{
				'addressId':addressId
			}
		}
	},(err,doc)=>{
		if(err) {
			res.json({
				status:'0',
				msg:err.message,
				result:''
			})
		} else {
			res.json({
				status:'1',
				msg:'',
				result:''
			})
		}
	});
});

router.post("/payMent",(req,res,next)=>{
	let userId = req.cookies.userId,
		orderTotal = req.body.orderTotal,
		addressId = req.body.addressId;
	User.findOne({userId:userId},(err,doc)=>{
		if(err) {
			res.json({
				status:'0',
				msg:err.message,
				result:''
			})
		} else {
			let address='',goodsList = [];
			// 获取当前用户的地址信息
			doc.addressList.forEach((item)=>{
				if(addressId===item.addressId) {
					address = item;
					return ;
				}
			});
			// 获取用户购物车的购买商品
			doc.cartList.filter((item)=>{
				if(item.checked==='1') {
					goodsList.push(item);
				}
			});
			// 生成 orderId 和 createDate
			let platform = '622'; // 平台码
			let r1 = Math.floor(Math.random()*10);
			let r2 = Math.floor(Math.random()*10); // 随机数
			let sysDate = new Date().Format('yyyyMMddhhmmss'); // 得到一个16位数字
			let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss'); // 系统时间
			let orderId = platform + r1 + sysDate + r2;
			// 创建订单
			let order = {
				orderId:orderId,
				orderTotal:orderTotal,
				addressInfo:address,
				goodsList:goodsList,
				orderStatus:'1',
				createDate:createDate
			};

			doc.orderList.push(order);
			doc.save((err1,doc1)=>{
				if(err1) {
					res.json({
						status:'0',
						msg:err1.message,
						result:''
					});
				} else {
					res.json({
						status:'1',
						msg:'',
						result:{
							orderTotal:order.orderTotal,
							orderId:order.orderId
						}
					});
				}
			});
		}
	})
});

// 根据订单Id查询订单信息
router.get("/orderDetail",(req,res,next)=>{
	let userId = req.cookies.userId,
		orderId = req.query.orderId;
	User.findOne({userId:userId},(err,userInfo)=>{
		if(err) {
			res.json({
				status:"0",
				msg:err.message,
				result:''
			})
		} else {
			let orderList = userInfo.orderList;
			if(orderList.length<=0) {
				res.json({
					status:"120001",
					msg:'无此订单',
					result:''
				});
			} else {
				let orderTotal = 0;
				orderList.forEach((item)=>{
					if(item.orderId===orderId) {
						orderTotal = item.orderTotal;
						return ;
					}
				});
				res.json({
					status:"1",
					msg:'',
					result:{
						orderId:orderId,
						orderTotal:orderTotal
					}
				})
			}
		}
	})
});
module.exports = router;
