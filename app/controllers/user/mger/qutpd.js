const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

exports.mgQutpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	info = null;
	if(obj.qntPr) {
		obj.qntPr = parseFloat(obj.qntPr);
		if(isNaN(obj.qntPr)) {
			info = "请输入正确的报价"
		}
	} else if(obj.strmup) {
		if(obj.strmup == "null") obj.strmup = null;
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
				info = "mger QutpdUpdAjax, Compd.findOne, Error!"
				Err.jsonErr(req, res, info);
			} else if(!compd) {
				info = '此商品不存在, 请刷新查看';
				Err.jsonErr(req, res, info);
			} else {
				_compd = _.extend(compd, obj)
				_compd.save((err, compdSave) => {
					if(err) {
						console.log(err);
						info = "mger QutpdUpdAjax, _compd.save, Error!"
						Err.jsonErr(req, res, info);
					} else {
						res.json({ status: 1, msg: '', data: { } })
					}
				})
			}
		})
	}
}


exports.mgQutpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger QutpdDel, Compd.findOne, Error!";
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
							res.redirect("/mgQut/"+qutId);
						}
					})
				}
			})
		}
	})
}