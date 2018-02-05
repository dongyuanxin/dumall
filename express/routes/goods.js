let express = require("express");
let mongoose = require('mongoose');

let router = express.Router();
let goods = require('./../models/goods');

mongoose.connect('mongodb://imooc:dyx240030@119.29.108.188:27017/dumall');
mongoose.connection.on("connected",() => {
    console.log("Goods-DB connected success");
});
mongoose.connection.on("error",() => {
    console.log("Goods-DB connected fail");
});
mongoose.connection.on("disconnected",() => {
    console.log("Goods-DB connected diesconnected");
});

// 查询商品列表数据
router.get("/",(req,res,next) => {
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize); // 数据/页
    let sort = parseInt(req.query.sort);
    let priceLevel = req.query.priceLevel;
    let skip = (page-1)*pageSize; // 分页公式：跳过的条数
    let params ;
    let priceGt ,priceLte ;
    if(priceLevel==="all") {
        params = {};
    } else {
        switch (priceLevel) {
            case '0':priceGt=0;priceLte=100;break;
            case '1':priceGt=100;priceLte=500;break;
            case '2':priceGt=500;priceLte=1000;break;
            case '3':priceGt=1000;priceLte=5000;break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        };
    }
    let goodsModel = goods.find(params).skip(skip).limit(pageSize); // find返回一个model
    goodsModel.sort({'salePrice':sort}); // 1是升序 -1是降序
    goodsModel.exec((err,doc) => {
        if(err){
            res.json({
                status:'0',
                msg:err.message
            });
        } else {
            res.json({
               status:'1',
               msg:'success',
               result:{
                   count:doc.length,
                   list:doc
               }
            });
        }
    });
    // goods.find({},(err,doc) => {...});
});

// 加入到购物车
router.post("/addCart",(req,res,next) => {
	let userId = '100000077',productId = req.body.productId;
	let User = require('../models/users');
	User.findOne({ // 1、 查找用户
		userId:userId
	},(err,doc) => {
		if(err){
			res.json({
				status:"0",
				msg:err.message
			});
		} else { // 1、 找到用户
			if(doc){
				let goodsItem = false;
				doc.cartList.forEach((item,index) => {
					if(item.productId===productId){
						goodsItem=item;
						item.productNum++;
					}
				});
				if(goodsItem!==false) {
					doc.save((err3,doc3) => { // 3、 保存到MongoDB
						if(err3) {
							res.json({
								status:"0",
								msg:err3.message
							});
						} else {
							res.json({
								status:"1",
								msg:"",
								result:"success"
							});
						}
					});
					return ;
				}
				goods.findOne({ // 2、查找商品
					productId:productId
				},(err2,doc2) => {
					if(err2) {
						res.json({
							status:"0",
							msg:err2.message
						});
					} else { // 2、找到商品
						if(doc2){
							doc2.productNum = 1; // 添加字段，保持字段一致
							doc2.checked = "1";
							doc.cartList.push(doc2);
							doc.save((err3,doc3) => { // 3、 保存到MongoDB
								if(err3) {
									res.json({
										status:"0",
										msg:err3.message
									});
								} else {
									res.json({
										status:"1",
										msg:"",
										result:"success"
									});
								}
							});
						}
					}
				});
			}
		}
	});
});

module.exports = router;