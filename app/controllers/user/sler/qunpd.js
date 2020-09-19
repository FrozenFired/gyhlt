const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

// 询价单
exports.slQunpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/sler/inquot/qunpd/list', {
		title: '询价单',
		crUser,
	})
}

exports.slQunpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('quner')
	.exec((err, qunpd) => {
		if(err) {
			console.log(err);
			info = "sler Qunpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qunpd) {
			info = "这个询价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qunpd)
			res.render('./user/sler/inquot/qunpd/detail', {
				title: '询价单详情',
				crUser,
				qunpd
			})
		}
	})
}
exports.slQunpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('ordin')
	.populate('pdthd')
	.exec((err, qunpd) => {
		if(err) {
			console.log(err);
			info = "sler Qunpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qunpd) {
			info = "这个询价单已经被删除";
			Err.usError(req, res, info);
		} else if(qunpd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(qunpd.inquot.status != Conf.status.init.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			res.render('./user/sler/inquot/qunpd/update', {
				title: '询价单修改',
				crUser,
				qunpd,
			})
		}
	})
}

exports.slQunpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sler QunpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个询价单已经被删除";
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(compd.inquot.status != Conf.status.init.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
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
					let qunId = inquot._id;
					Compd.deleteOne({_id: id}, (err, objRm) => {
						if(err) {
							info = "user CompdDel, Compd.deleteOne, Error!";
							Err.usError(req, res, info);
						} else {
							MdPicture.deletePicture(photoDel, Conf.picPath.compd);
							MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
							res.redirect("/slQun/"+qunId);
						}
					})
				}
			})
		}
	})
}





exports.slQunpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sler QunpdUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此询价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(compd.inquot.status != Conf.status.init.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			let photoDel = sketchDel = null;
			if(obj.pdfir) {
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
					info = "添加询价单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect('/slQunpd/'+objSave._id)
				}
			})
		}
	})
}

exports.slQunpdImg = (req, res) => {
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
			info = "sler QunpdUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			MdPicture.deletePicture(picDel, Conf.picPath.compd);
			info = '此询价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			let qunId = compd.inquot;
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
					info = "添加询价单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picOld, Conf.picPath.compd);
					res.redirect('/slQun/'+qunId)
				}
			})			
		}
	})
}
exports.slQunpdNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.qunAt = Date.now();
	obj.qntpdSts = Conf.status.quoting.num;
	obj.quant = parseInt(obj.quant);
	if(isNaN(obj.quant)) obj.quant = 1;
	Inquot.findOne({
		firm: crUser.firm,
		_id: obj.inquot
	}, (err, inquot) => {
		if(err) {
			console.log(err);
			info = "sler QunpdNew, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = "询价单不存在, 请刷新查看!"
			Err.usError(req, res, info);
		} else if(inquot.status != Conf.status.init.num) {
			info = "状态已经改变, 不可操作!"
			Err.usError(req, res, info);
		} else {
			obj.firm = inquot.firm
			obj.quner = inquot.quner
			obj.quter = inquot.quter

			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			let _compd = new Compd(obj)
			inquot.compds.unshift(_compd._id);
			inquot.save((err, inquotSave) => {
				if(err) {
					console.log(err);
					info = "添加询价单商品时 数据库保存错误 inquot.save, 请截图后, 联系管理员!";
					Err.usError(req, res, info);
				} else {
					_compd.save((err, objSave) => {
						if(err) {
							console.log(err);
							info = "添加询价单商品时 数据库保存错误 _compd.save, 请截图后, 联系管理员!";
							Err.usError(req, res, info);
						} else {
							res.redirect('/slQun/'+obj.inquot)
						}
					})
				}
			})
		}
	})
}