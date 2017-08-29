const mongoose = require('mongoose')
const goodsSchema = new mongoose.Schema({
	"productId":{type:String},
	"productName":String,
	"salePrice":Number,
	"checked":String,
	"productNum":Number,
	"productImage":String
})

module.exports = mongoose.model('Goods',goodsSchema,'')