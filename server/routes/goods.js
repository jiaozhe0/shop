const express = require('express')
const mongoose = require('mongoose')
const Goods = require('../model/goods.js')
const User = require('../model/user.js')
const router = express.Router()

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

//连接成功
mongoose.connection.on("connected",()=>{
	console.log('MongoDB connected success')

})

//连接失败
mongoose.connection.on("error",()=>{
	console.log('MongoDB connected fail')

})

//断开连接
mongoose.connection.on("disconnected",()=>{
	console.log('MongoDB connected disconnected')
})

// 获取商品列表
router.get('/list',(req,res,next)=>{
	let page = parseInt(req.param('page')) //页码
	let pageSize = parseInt(req.param('pageSize')) //数量
	let priceLevel = req.param('priceLevel')//价格区间
	let sort = req.param('sort')  //升序/降序
	let skip = (page - 1) * pageSize //起始位置
	var priceGt = '',priceLte = '';
	let params = {};
	if(priceLevel !== 'all'){
		switch(priceLevel){
			case '0':priceGt = 0;priceLte = 100;break;
			case '1':priceGt = 100;priceLte = 500;break;
			case '2':priceGt = 500;priceLte = 1000;break;
			case '3':priceGt = 1000;priceLte = 2000;break;
		}
		params = {
			salePrice:{
				$gt:priceGt,
				$lte:priceLte
			}
		}
	}

	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice':sort});
	goodsModel.exec((err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			res.json({
				status:'0',
				msg:'',
				result:{
					count:doc.length,
					list:doc
				}
			})
		}
	})
})

//加入购物车
// router.post("/addCart",(req,res,next)=>{
// 	const userId = '100000077',productId = req.body.productId;
// 	User.findOne({userId:userId},(err0,userDoc)=>{
// 		if(err0){
// 			res.json({
// 				status:"1",
// 				msg:err0.message
// 			})
// 		}else{
// 			console.log(`userDoc:${userDoc}`)
// 			if(userDoc){
// 				Goods.findOne({productId:productId},(err1,doc)=>{
// 					if(err1){
// 						res.json({
// 							status:"1",
// 							msg:err1.message
// 						})
// 					}else{
// 						if(doc){
// 							doc.productNum = 1
// 							doc.checked = 1
// 							userDoc.cartList.push(doc);
// 							userDoc.save((err2,doc2)=>{
// 								if(err2){
// 									res.json({
// 									   status:"1",
// 									   msg:err2.message
// 									})
// 								}else{
// 									res.json({
// 										status:"0",
// 										msg:'',
// 										result:doc
// 									})
// 								}
// 							})
// 						}
// 					}
// 				})
// 			}
// 		}
// 	})
// })


//逻辑：1、用户商品列表里已经含有商品，商品数目productNum++,然后保存save()
//2、用户商品列表中没有商品，Goods模型搜索该商品，然后在用户列表上追加
router.post('/addCart',(req,res,next)=>{
	const userId = '100000077',productId = req.body.productId;
	   //查询用户
	   User.findOne({userId:userId},(err,userDoc)=>{
			if(err){
				res.json({
					status:'1',
					msg:err.message
				})
			}else{
				if(userDoc){
					console.log('.>>>>>>>>')
					var goodsItem = null
					userDoc.cartList.forEach((item)=>{
						//判断购物车如果已经存在该产品
						if(item.productId == productId){
							goodsItem = item;
							item.productNum++ ;
						}
					})
					//购物车列表有该产品
					if(goodsItem){
						console.log('=========')
						userDoc.save((err0,doc)=>{
							if(err0){
								res.json({
									status:'1',
									msg:err0.message
								})
							}else{
								res.json({
									status:'0',
									msg:'',
									result:doc
								})
							}
						})
					}else{
						console.log('.666666>>>>>>>>')
						//如果购物车没有该商品，就很商品的集合里查找车来
						Goods.findOne({productId:productId},(err1,goodsDoc)=>{
							if(err1){
								res.json({
									status:'1',
									msg:err1.message
								})
							}else{
								if(goodsDoc){
									console.log('.>>>>>>>>')
									goodsDoc.productNum = 1;
									goodsDoc.checked = 1;
									userDoc.cartList.push(goodsDoc);
									userDoc.save((err2,doc)=>{
										if(err2){
											res.json({
												status:'1',
												msg:err2.message
											})
										}else{
											console.log('lllllllllllll')
											if(doc){
 
												res.json({
													status:"0",
													msg:'',
													result:doc
												})
											}
										}
									})
								}
							}
						})
					}

				}
			}
			
			
			// resolve(userDoc)
		})
	
})


module.exports = router;


