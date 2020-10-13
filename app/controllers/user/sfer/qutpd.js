const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

exports.sfQutpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('brand')
	.populate('pdfir')
	.populate('pdsec')
	.populate('pdthd')
	.populate('ordin')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "sfer Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else if(qutpd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(qutpd.inquot.status != Conf.status.quoting.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			// console.log(qut)
			let roleQuoter = Conf.roleAdmin;
			roleQuoter.push(Conf.roleUser.quotation.num);
			User.find({
				firm: crUser.firm,
				$or:[
					{'role': {"$in": Conf.roleAdmin}},
					{'role': {"$eq": Conf.roleUser.quotation.num}},
				]
			})
			.sort({'role': -1})
			.exec((err, quters) => {
				if(err) {
					console.log(err);
					info = 'sfer QutAdd, User.find, Error!';
					Err.usError(req, res, info);
				} else {
					res.render('./user/sfer/inquot/qutpd/update', {
						title: '报价单修改',
						crUser,
						qutpd,

						quters
					})
				}
			})
		}
	})
}

exports.sfQutpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	info = null;
	if(obj.qntPr) {
		obj.qntPr = parseFloat(obj.qntPr);
		if(isNaN(obj.qntPr)) {
			info = "请输入正确的报价"
		}
	}
	if(info) {
		Err.jsonErr(req, res, info);
	} else {
		Compd.findOne({
			firm: crUser.firm,
			_id: obj._id
		}, (err, compd) => {
			if(err) {
				console.log(err);
				info = "sfer QutpdUpdAjax, Compd.findOne, Error!"
				Err.jsonErr(req, res, info);
			} else if(!compd) {
				info = '此商品不存在, 请刷新查看';
				Err.jsonErr(req, res, info);
			} else {
				_compd = _.extend(compd, obj)
				_compd.save((err, compdSave) => {
					if(err) {
						console.log(err);
						info = "sfer QutpdUpdAjax, _compd.save, Error!"
						Err.jsonErr(req, res, info);
					} else {
						res.json({ status: 1, msg: '', data: { } })
					}
				})
			}
		})
	}
}

exports.sfQutpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.qntupdAt = Date.now();
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sfer QutpdUpd, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(compd.inquot.status != Conf.status.quoting.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			// 自动改变商品状态
			// if(obj.qntpdSts != Conf.status.del.num) {
			// 	if(obj.pdthd) {
			// 		obj.qntpdSts = Conf.status.done.num;
			// 	} else {
			// 		obj.qntpdSts = Conf.status.quoting.num;
			// 	}
			// }
			if(obj.images && compd.images) {
				for(let i=0; i<obj.images.length; i++) {
					if(compd.images.length>=i && !obj.images[i]) {
						obj.images[i] = compd.images[i];
					}
				}
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					console.log(err)
					info = "添加询价单时 sfer QutpdUpd, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/sfQut/'+objSave.inquot._id)
				}
			})
		}
	})
}

exports.sfQutpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sfer QutpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "已经生成订单, 不可删除!";
			Err.usError(req, res, info);
		} else {
			let inquot = compd.inquot;
			inquot.compds.remove(id);
			inquot.save((err, inquotSave) => {
				if(err) {
					console.log(err);
					info = "user CompdDel, inquot.save, Error!";
					Err.usError(req, res, info);
				} else {
					let photoDel = compd.photo;
					let sketchDel = compd.sketch;
					let qutId = inquot._id;
					Compd.deleteOne({_id: id}, (err, objRm) => {
						if(err) {
							info = "user CompdDel, Compd.deleteOne, Error!";
							Err.usError(req, res, info);
						} else {
							MdPicture.deletePicture(photoDel, Conf.picPath.compd);
							MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
							res.redirect("/sfQut/"+qutId);
						}
					})
				}
			})
		}
	})
}