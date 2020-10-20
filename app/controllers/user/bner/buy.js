const Err = require('../../aaIndex/err');

const Conf = require('../../../../conf');

const Buy = require('../../../models/firm/stream/buy');
const Strmup = require('../../../models/firm/stream/strmup');
const Brand = require('../../../models/firm/brand');
const Firm = require('../../../models/login/firm');

const _ = require('underscore');

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
exports.bnBuyNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.crter = crUser._id;
	info = null;
	if(!obj.discount) {
		info = "请输入折扣"
	} else if(isNaN(parseInt(obj.discount))) {
		info = "折扣必须是数字"
	}
	if(info) {
		Err.usError(req, res, info);
	} else {
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
				Strmup.findOne({_id: obj.strmup}, (err, strmup) => {
					if(err) {
						console.log(err);
						info = "bner BuyNew, Strmup.findOne, Error!";
						Err.usError(req, res, info);
					} else if(!strmup) {
						info = "bner BuyNew, 数据库中没有找到供应商";
						Err.usError(req, res, info);
					} else {
						strmup.buys.push(_buy._id);
						if(!strmup.buynum) {
							strmup.buynum = 1;
						} else {
							strmup.buynum++;
						}
						strmup.save((err, strmupSave) => {
							if(err) {
								console.log(err);
								info = "bner BuyNew, strmup.save, Error!";
								Err.usError(req, res, info);
							} else {
								Brand.findOne({_id: obj.brand}, (err, brand) => {
									if(err) {
										console.log(err);
										info = "bner BuyNew, Brand.findOne, Error!";
										Err.usError(req, res, info);
									} else if(!brand) {
										info = "bner BuyNew, 数据库中没有找到供应商";
										Err.usError(req, res, info);
									} else{
										brand.buys.push(_buy._id);
										if(!brand.buynum) {
											brand.buynum = 1;
										} else {
											brand.buynum++;
										}
										brand.save((err, brandSave) => {
											if(err) {
												console.log(err);
												info = "bner BuyNew, brand.save, Error!";
												Err.usError(req, res, info);
											} else {
												_buy.save((err, objSave) => {
													if(err) {
														console.log(err);
														info = "添加供应商品牌折扣时 数据库保存错误, 请截图后, 联系管理员";
														Err.usError(req, res, info);
													} else {
														res.redirect('/bnBuy/'+objSave._id)
													}
												})
											}
										})
									}
								})
							}
						})
					}
				})
			}
		})
	}
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

	Buy.findOne({_id: id})
	.populate('brand')
	.populate('strmup')
	.exec((err, buy) => {
		if(err) {
			info = "user BuyDel, Buy.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!buy) {
			info = "此折扣信息已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let brand = buy.brand;
			let strmup = buy.strmup;
			brand.buys.remove(id);
			brand.buynum--;
			brand.save((err, brandSave) => {if(err) console.log(err)})
			strmup.buys.remove(id);
			strmup.buynum--;
			strmup.save((err, strmupSave) => {if(err) console.log(err)})
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



exports.bnBuyUpd = (req, res) => {
	let crUser = req.session.crUser;

	obj.upder = crUser._id;
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


exports.bnBuyBrands = (req, res) => {
	let crUser = req.session.crUser;

	Brand.find({
		firm: crUser.firm,
		buynum: {'$gt': 0}
	})
	.exec((err, brands) => {
		if(err) {
			console.log(err);
			info = "bner BuyBrand, Brand.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/buy/brand/list', {
				title: '品牌折扣列表',
				crUser,
				brands
			})
		}
	})
}
exports.bnBuyBrand = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Brand.findOne({
		firm: crUser.firm,
		_id: id
	})
	.populate({path: "buys", populate: {path: 'strmup'}})
	.exec((err, brand) => {
		if(err) {
			console.log(err);
			info = "bner BuyBrand, Brand.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!brand) {
			info = "没有找到此品牌";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/buy/brand/detail', {
				title: '品牌折扣列表',
				crUser,
				brand
			})
		}
	})
}
exports.bnBuyBrandUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	info = null;
	if(!obj.discount) {
		info = "请输入品牌的默认折扣"
	} else if(isNaN(parseInt(obj.discount))) {
		info = "折扣必须是数字"
	}
	if(info) {
		Err.usError(req, res, info);
	} else {
		Brand.findOne({
			firm: crUser.firm,
			_id: obj._id
		})
		.exec((err, brand) => {
			if(err) {
				console.log(err);
				info = "bner BuyBrand, Brand.findOne, Error!";
				Err.usError(req, res, info);
			} else if(!brand) {
				info = "没有找到此品牌";
				Err.usError(req, res, info);
			} else {
				brand.discount = parseInt(obj.discount)
				brand.save((err, brandSave) => {
					if(err) {
						console.log(err);
						info = "bner BuyBrandUpd, brand.save, Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bnBuyBrand/'+brandSave._id)
					}
				})
			}
		})
	}
}