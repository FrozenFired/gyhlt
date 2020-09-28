let Err = require('../../aaIndex/err');

let Conf = require('../../../../conf');

let Buy = require('../../../models/firm/stream/buy');
let Strmup = require('../../../models/firm/stream/strmup');
let Brand = require('../../../models/firm/brand');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.bnBuys = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/buy/list', {
		title: '供应商折扣列表',
		crUser,
	})
}

exports.bnBuyAdd = (req, res) => {
	let crUser = req.session.crUser;
	Strmup.find({
		firm: crUser.firm,
		shelf: {'$gt': 0}
	})
	.sort({'weight': -1})
	.exec((err, strmups) => {
		if(err) {
			console.log(err);
			info = "bner BuyAdd, Strmup.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			Brand.find({firm: crUser.firm}, (err, brands) => {
				if(err) {
					console.log(err);
					info = "bner BuyAdd, Brand.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/bner/buy/add', {
						title: '添加供应商',
						crUser,
						strmups,
						brands
					})
				}
			})
		}
	})
}

exports.bnBuy = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Buy.findOne({_id: id})
	.populate('strmup')
	.populate('brand')
	.exec((err, buy) => {
		if(err) {
			console.log(err);
			info = "user BuyFilter, Buy.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!buy) {
			info = "这个供应商已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/buy/detail', {
				title: '供应商详情',
				crUser,
				buy
			})
		}
	})
}

exports.bnBuyUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Buy.findOne({_id: id})
	.exec((err, buy) => {
		if(err) {
			console.log(err);
			info = "user BuyFilter, Buy.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!buy) {
			info = "这个供应商已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/buy/update', {
				title: '供应商更新',
				crUser,
				buy,
			})
		}
	})
}

exports.bnBuyDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Buy.findOne({_id: id}, (err, buy) => {
		if(err) {
			info = "user BuyDel, Buy.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!buy) {
			info = "此折扣信息已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Buy.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user BuyDel, Buy.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnBuys");
				}
			})
		}
	})
}


exports.bnBuyNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.creater = crUser._id;

	Buy.findOne({
		firm: crUser.firm,
		strmup: obj.strmup,
		brand: obj.brand,
	}, (err, buySame)=> {
		if(err) {
			console.log(err);
			info = "bner BuyNew, Buy.findOne, Error!";
			Err.usError(req, res, info);
		} else if(buySame) {
			info = "此供应商下已经有了该品牌, 请查看";
			Err.usError(req, res, info);
		} else {
			let _buy = new Buy(obj)
			_buy.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加供应商时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bnBuy/'+objSave._id)
				}
			})
		}
	})
}


exports.bnBuyUpd = (req, res) => {
	let crUser = req.session.crUser;

	obj.updater = crUser._id;
	let obj = req.body.obj;
	Buy.findOne({_id: obj._id, firm: crUser.firm}, (err, buy) => {
		if(err) {
			info = "更新供应商时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!buy) {
			info = "此供应商折扣已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let _buy = _.extend(buy, obj)
			_buy.save((err, objSave) => {
				if(err) {
					info = "更新供应商时数据库保存数据时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnBuy/"+objSave._id)
				}
			})
		}
	})
}
