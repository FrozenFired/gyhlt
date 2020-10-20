const Err = require('../../aaIndex/err');

const Conf = require('../../../../conf');

const Sell = require('../../../models/firm/stream/sell');
const Strmdw = require('../../../models/firm/stream/strmdw');
const Brand = require('../../../models/firm/brand');
const Firm = require('../../../models/login/firm');

const _ = require('underscore');

exports.pmSells = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/pmer/sell/list', {
		title: '客户折扣列表',
		crUser,
	})
}

exports.pmSellAdd = (req, res) => {
	let crUser = req.session.crUser;
	Strmdw.find({
		firm: crUser.firm,
		shelf: {'$gt': 0}
	})
	.sort({'weight': -1})
	.exec((err, strmdws) => {
		if(err) {
			console.log(err);
			info = "pmer SellAdd, Strmdw.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			Brand.find({firm: crUser.firm}, (err, brands) => {
				if(err) {
					console.log(err);
					info = "pmer SellAdd, Brand.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/pmer/sell/add', {
						title: '添加客户',
						crUser,
						strmdws,
						brands
					})
				}
			})
		}
	})
}

exports.pmSell = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Sell.findOne({_id: id})
	.populate('strmdw')
	.populate('brand')
	.exec((err, sell) => {
		if(err) {
			console.log(err);
			info = "user SellFilter, Sell.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!sell) {
			info = "这个客户已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/sell/detail', {
				title: '客户详情',
				crUser,
				sell
			})
		}
	})
}

exports.pmSellUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Sell.findOne({_id: id})
	.exec((err, sell) => {
		if(err) {
			console.log(err);
			info = "user SellFilter, Sell.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!sell) {
			info = "这个客户已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/sell/update', {
				title: '客户更新',
				crUser,
				sell,
			})
		}
	})
}

exports.pmSellDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Sell.findOne({_id: id}, (err, sell) => {
		if(err) {
			info = "user SellDel, Sell.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!sell) {
			info = "此折扣信息已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Sell.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user SellDel, Sell.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/pmSells");
				}
			})
		}
	})
}


exports.pmSellNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.crter = crUser._id;

	Sell.findOne({
		firm: crUser.firm,
		strmdw: obj.strmdw,
		brand: obj.brand,
	}, (err, sellSame)=> {
		if(err) {
			console.log(err);
			info = "pmer SellNew, Sell.findOne, Error!";
			Err.usError(req, res, info);
		} else if(sellSame) {
			info = "此客户下已经有了该品牌, 请查看";
			Err.usError(req, res, info);
		} else {
			let _sell = new Sell(obj)
			_sell.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加客户时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/pmSell/'+objSave._id)
				}
			})
		}
	})
}


exports.pmSellUpd = (req, res) => {
	let crUser = req.session.crUser;

	obj.upder = crUser._id;
	let obj = req.body.obj;
	Sell.findOne({_id: obj._id, firm: crUser.firm}, (err, sell) => {
		if(err) {
			info = "更新客户时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!sell) {
			info = "此客户折扣已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let _sell = _.extend(sell, obj)
			_sell.save((err, objSave) => {
				if(err) {
					info = "更新客户时数据库保存数据时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else {
					res.redirect("/pmSell/"+objSave._id)
				}
			})
		}
	})
}
