var express = require('express');
var router = express.Router();
const User = require('../model/user')
require('../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login',(req,res,next)=>{
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}
	User.findOne(param, (err,userDoc)=>{
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			if(userDoc){
				res.cookie('userId',userDoc.userId,{
					path: '/',
					maxAge:1000*60*60
				})
				res.cookie('userName',userDoc.userName,{
					path: '/',
					maxAge:1000*60*60
				})
				// req.session.user = userDoc
				res.json({
					status:'0',
					msg:'',
					result:{
						userName: userDoc.userName
					}
				})
			}
		}
	})
})

//登出
router.post('/logout',(req,res,next)=>{
	res.cookie('userId','',{
		path:'/',
		maxAge:-1
	})
	res.cookie('userName','',{
		path:'/',
		maxAge:-1
	})
	res.json({
		status:'0',
		msg:'',
		result:'登出成功'
	})
})

//检查是否登录
router.get('/checkLogin',(req,res,nect)=>{
	if(req.cookies.userId){
		res.json({
			status: '0',
			msg: '',
			result:req.cookies.userName
		})
	}else{
		res.json({
			status:'0',
			msg:'',
			result:''
		})
	}
})

//购物车数据列表列表
router.get('/cartList',(req,res,next)=>{
	const userId = req.cookies.userId
	console.log(userId)
	User.findOne({userId:userId},(err,userDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			if(userDoc){
				res.json({
					status:'0',
					msg:'',
					result:userDoc.cartList
				})
			}
		}
	})
})

//购物车删除
router.post("/cart/del", function (req,res,next) {
  var userId = req.cookies.userId,productId = req.body.productId;
  console.log(userId+'===='+productId)
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  }, function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
});

//修改商品数量
router.post('/cartEdit',(req,res,next)=>{
	const userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum,
		checked = req.body.checked;
	User.update({'userId':userId,'cartList.productId':productId},
		{
			'cartList.$.productNum':productNum,
			'cartList.$.checked':checked
		},(err,doc)=>{
			if(err){
				res.json({
					status:'1',
					msg:err.message,
					result:''
				})
			}else{
				res.json({
					status:'0',
					msg:'',
					result:'success'
				})
			}
		})
})

//全选
router.post('/editCheckAll',(req,res,next)=>{
	const userId = req.cookies.userId,
		checkAll = req.body.checkAll ? '1' : '-1';
	User.findOne({'userId':userId},(err,userDoc)=>{
		if(err){
				res.json({
					status:'1',
					msg:err.message,
					result:''
				})
			}else{
				if(userDoc){
					userDoc.cartList.forEach((item)=>{
						item.checked = checkAll
					})
					userDoc.save((err1,doc)=>{
						if(err1){
							res.json({
								status:'1',
								msg:err1.message,
								result:''
							})
						}else{
							if(doc){
								res.json({
									status:'0',
									msg:'',
									result:'suc'
								})
							}
						}
					})
				}
				
			}
	})
})

//获取购物车数量
router.get('/getCartCount',(req,res,next=>{
	if(req.cookies && req.cookies.userId) {
		var userId = req.cookies.userId;
		User.findOne({'userId': userId},(err,doc)=>{
			if(err){
				res.json({
					status:'1',
					msg:err.message,
					result:''
				})
			}else{
				var cartList = doc.cartList;
				let cartCount = 0;
				cartList.forEach((item)=>{
					cartCount += parsetInt(item.productNum)
				})
				res.json({
					status:'0',
					msg:'',
					result:cartCount
				})
			}
		})
	}
}))

//获取地址列表
router.get('/address',(req,res,next)=>{
	const userId = req.cookies.userId;
	User.findOne({'userId':userId},(err,addDoc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message
			})
		}else{
			if(addDoc){
				
				res.json({
					status:'0',
					msg:'',
					result:addDoc.addressList
				})
			}
		}
	})
})

//删除地址列表
router.post('/addressDel',(req,res,next)=>{
	const userId = req.cookies.userId,
		  addressId = req.body.addressId;
	User.update({'userId':userId},{
		$pull:{
			'addressList':{
				'addressId':addressId
        }}},(err,doc)=>{
        	if(err){
        		res.json({
        			status:'1',
        			msg:err.message
        		})
        	}else{
        		if(doc){
        			res.json({
        				status:'0',
        				msg:'',
        				result:'scuess'
        			})
        		}
        	}
        })
})

//设置默认地址
router.post('/addressDef',(req,res,next)=>{
	const userId = req.cookies.userId,addressId = req.body.addressId;
	if(!addressId){
		res.json({
			status:'10',
			msg:'address is null',
			result:''
		})
		return
	}
	User.findOne({userId:userId},(err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			let addressList = doc.addressList;
			addressList.forEach((item)=>{
				if(item.addressId === addressId){
					item.isDefault = true
				}else{
					item.isDefault = false
				}
			})
			doc.save((err1,doc)=>{
				if(err1){
					res.json({
						status:'1',
						msg:err1.message,
						result:''
					})
				}else{
					if(doc){
						res.json({
							status:'0',
							msg:'',
							result:'scuess'
						})
					}
				}
			})
		}
	})
})

//创建订单 
// 订单字段
// orderId
// orderTotal
// addressInfo
// goodsList
// orderStatus
// createDate
router.post('/payMent',(req,res,next)=>{
	const userId = req.cookies.userId,
		  orderTotal = req.body.orderTotal, //订单的金额
		  addressId = req.body.addressId; //地址id
	User.findOne({'userId':userId}, (err,doc)=>{
		if(err){
			res.json({
				status:'1',
				msg:err.message,
				result:''
			})
		}else{
			var address = null,goodsList = [];
			// 获取当前用户的地址信息
			doc.addressList.forEach((item)=>{
				if(item.addressId === addressId){
					address = item
				}
			})
			// 获取当前的用户的购物车的商品
			goodsList = doc.cartList.filter((item)=>{
				return item.checked === '1'
			})
			// 生成订单号
			var platform = '622';
			var r1 = Math.floor(Math.random() * 10);
			var r2 = Math.floor(Math.random() * 10);
			var sysDate = new Date().Format('yyyyMMddhhmmss');
			var createDate = new Date().Format('yyyy-MM-dd- hh:mm:ss');
			var orderId = platform + r1 + sysDate + r2;

			var order = {
				orderId:orderId,
				orderTotal: orderTotal,
				addressInfo: address,
				goodsList: goodsList,
				orderStatus: '1',
				createDate: createDate
			}
			doc.orderList.push(order)
			doc.save((err1,doc1)=>{
				if(err1){
					res.json({
						status:'1',
						msg:err.message,
						result:''
					})
				}else{
					if(doc1){
						console.log(doc1)
						res.json({
							status:'0',
							msg:'',
							result:{
								orderId:order.orderId,
								orderTotal:order.orderTotal
							}
						})
					}
				}
			})
			
		}
	})
})

// 根据订单id查询订单信息
router.get('/orderDetail', (req,res,next)=>{
	var userId = req.cookies.userId,orderId = req.param("orderId");
	User.findOne({'userId':userId},(err,userInfo)=>{
		if(err){
			res.json({
				status: '1',
				msg: '',
				result: ''
			})
		}else{
			var orderList = userInfo.orderList;
			if(orderList.length > 0){
				var orderTotal = 0;
				orderList.forEach((item)=>{
					if(item.orderId === orderId){
						orderTotal = item.orderTotal
					}
				})
				if(orderTotal>0){
					res.json({
						status: '0',
						msg: '',
						result:{
							orderId: orderId,
							orderTotal:orderTotal
						}
					})
				}else{
					res.json({
						status: '120002',
						msg: '无此订单',
						result:''
					})
				}
				
			}else{
				res.json({
					status: '120001',
					msg: '当前用户未创建订单',
					result:''
				})
			}
			
		}
	})
})
module.exports = router;
