let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let productSchema = new Schema({
    "productId":{type:String},
    "productName":{type:String},
    "salePrice":{type:Number},
    "productImage":{type:String},
    "productUrl":{type:String},
	"checked":String,
	"productNum":Number
});

module.exports = mongoose.model("Good",productSchema,"goods");
// 最后指定的是 goods Document