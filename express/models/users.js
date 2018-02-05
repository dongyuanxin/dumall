let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let productSchema = new Schema({
	"userId":{type:String},
	"userName":{type:String},
	"userPwd":{type:String},
	"orderList":{type:Array},
	"cartList":[
		{
			"productId":String,
			"productName":String,
			"salePrice":String,
			"productImage":String,
			"checked":String,
			"productNum":Number
		}
	],
	"addressList":[
		{
			"addressId" : String,
			"userName" : String,
			"streetName" : String,
			"postCode" : String,
			"tel" : String,
			"isDefault" : Boolean
		}
	]
});

module.exports = mongoose.model("User",productSchema,"users");