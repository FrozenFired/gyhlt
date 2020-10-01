const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

// 销售订单
exports.odDutpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/oder/ordin/dutpd/list', {
		title: '销售订单',
		crUser,
	})
}

exports.odDutpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('ordin')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('duter')
	.populate('cter')
	.populate('qutFirm').populate('strmup')
	.exec((err, dutpd) => {
		if(err) {
			console.log(err);
			info = "oder Dutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dutpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dutpd)
			res.render('./user/oder/ordin/dutpd/detail', {
				title: '销售订单详情',
				crUser,
				dutpd
			})
		}
	})
}
exports.odDutpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, dutpd) => {
		if(err) {
			console.log(err);
			info = "oder Dutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dutpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/oder/ordin/dutpd/update', {
				title: '销售订单修改',
				crUser,
				dutpd,
			})
		}
	})
}

exports.odDutpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "oder DutpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			let photoDel = compd.photo;
			let sketchDel = compd.sketch;
			let dutId = compd.ordin;
			Compd.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user CompdDel, Compd.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect("/odDut/"+dutId);
				}
			})
		}
	})
}





exports.odDutpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, compd) => {
		if(err) {
			console.log(err);
			info = "oder DutpdUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此销售订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			let photoDel = sketchDel = null;
			if(obj.pdfir || (obj.firNome != compd.firNome)) {
				obj.photo = '';
				photoDel = compd.photo;
			}
			if(obj.pdsec || (obj.secNome != compd.secNome)) {
				obj.sketch = '';
				sketchDel = compd.sketch;
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					info = "添加销售订单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect('/odDutpd/'+objSave._id)
				}
			})
		}
	})
}