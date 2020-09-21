const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

// 报价单
exports.mgQutpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/inquot/qutpd/list', {
		title: '报价单',
		crUser,
	})
}

exports.mgQutpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('quter')
	.populate('strmup')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "mger Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qutpd)
			res.render('./user/mger/inquot/qutpd/detail', {
				title: '报价单详情',
				crUser,
				qutpd
			})
		}
	})
}
exports.mgQutpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('pdthd')
	.populate('strmup')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "mger Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
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
					info = 'mger QutAdd, User.find, Error!';
					Err.usError(req, res, info);
				} else {
					Strmup.find({
						firm: crUser.firm,
					})
					.exec((err, strmups) => {
						if(err) {
							console.log(err);
							info = 'mger QutAdd, Strmup.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/mger/inquot/qutpd/update', {
								title: '报价单修改',
								crUser,
								qutpd,

								quters,
								strmups,
							})
						}
					})
				}
			})
		}
	})
}

exports.mgQutpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger QutpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			let photoDel = compd.photo;
			let sketchDel = compd.sketch;
			let qutId = compd.inquot;
			Compd.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user CompdDel, Compd.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect("/mgQut/"+qutId);
				}
			})
		}
	})
}





exports.mgQutpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(obj.price) obj.price = parseFloat(obj.price);
	if(isNaN(obj.price)) obj.price = 0;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, compd) => {
		if(err) {
			console.log(err);
			info = "mger QutpdUpd, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;

			if(!obj.strmup || obj.strmup.length < 20) obj.strmup = null;
			let photoDel = sketchDel = null;
			if(obj.pdfir ) {
				obj.photo = '';
				photoDel = compd.photo;
			}
			if(obj.pdsec) {
				obj.sketch = '';
				sketchDel = compd.sketch;
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					console.log(err)
					info = "mger QutpdUpd 更新报价单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect('/mgQutpd/'+objSave._id)
				}
			})
		}
	})
}
exports.mgQutpdImg = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	let picDel = obj.picture;
	if(obj.picture) {
		if(obj.photo == 1) {
			obj.photo = obj.picture;
		} else if(obj.sketch) {
			obj.sketch = obj.picture;
		}
	}
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, compd) => {
		if(err) {
			console.log(err);
			MdPicture.deletePicture(picDel, Conf.picPath.compd);
			info = "mger QutpdUpd, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			MdPicture.deletePicture(picDel, Conf.picPath.compd);
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			let qutId = compd.inquot;
			let picOld;
			if(obj.photo == 1) {
				picOld = compd.photo;
			}  else if(obj.sketch) {
				picOld = compd.sketch;
			}

			let _compd = _.extend(compd, obj)
			_compd.save((err, objSave) => {
				if(err) {
					MdPicture.deletePicture(picDel, Conf.picPath.compd);
					info = "添加报价单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picOld, Conf.picPath.compd);
					res.redirect('/mgQut/'+qutId)
				}
			})			
		}
	})
}
exports.mgQutpdNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.qntcrtAt = obj.qntupdAt = Date.now();
	obj.status = Conf.status.quoting.num;
	obj.quant = parseInt(obj.quant);
	if(isNaN(obj.quant)) obj.quant = 1;
	Inquot.findOne({
		firm: crUser.firm,
		_id: obj.inquot
	}, (err, inquot) => {
		if(err) {
			console.log(err);
			info = "mger QutpdNew, Inquot.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = "报价单不存在, 请刷新查看!"
			Err.usError(req, res, info);
		} else if(inquot.status != Conf.status.pricing.num) {
			info = "状态已经改变, 不可操作!"
			Err.usError(req, res, info);
		} else {
			obj.firm = inquot.firm
			obj.quner = inquot.quner
			obj.quter = inquot.quter
			obj.cterNome = inquot.cterNome

			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			let _compd = new Compd(obj)
			_compd.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加报价单商品时 数据库保存错误, 请截图后, 联系管理员!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/mgQut/'+obj.inquot)
				}
			})
		}
	})
}