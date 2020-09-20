// 销售订单
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

const moment = require('moment');
const xl = require('excel4node');

// 订单
exports.mgDins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/ordin/din/list', {
		title: '销售订单',
		crUser,
	})
}


exports.mgDin = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordin.findOne({_id: id})
	.populate('diner')
	.populate('cter')
	.populate({
		path: 'compds',
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},
			
			{path: 'strmup'},
			{path: 'cter'},
		]
	})
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "mger Qun, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个询价单已经被删除, mgDinFilter";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			Strmup.find({
				firm: crUser.firm,
			})
			.sort({'role': -1})
			.exec((err, strmups) => {
				if(err) {
					console.log(err);
					info = 'mger QutAdd, Strmup.find, Error!';
					Err.usError(req, res, info);
				} else {
					User.find({
						firm: crUser.firm,
						role: Conf.roleUser.customer.num
					})
					.exec((err, cters) => {
						if(err) {
							console.log(err);
							info = 'mger QutAdd, Strmup.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/mger/ordin/din/detail', {
								title: '订单详情',
								crUser,
								din,
								dinpds: din.compds,

								strmups,
								cters
							})
						}
					})
				}
			})
		}
	})
}
exports.mgDinUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "mger Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "此订单已经被删除";
			Err.usError(req, res, info);
		} else if(din.status != Conf.status.init.num){
			info = "此订单不能被修改, 请联系报价员修改";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			Strmup.find({firm: crUser.firm})
			.sort({'weight': -1})
			.exec((err, nstrmups) => {
				if(err) {
					console.log(err);
					info = 'mger QunAdd, Strmup.find, Error!'
					Err.usError(req, res, info);
				} else {
					User.find({firm: crUser.firm, role: Conf.roleUser.customer.num})
					.sort({'weight': -1})
					.exec((err, cters) => {
						if(err) {
							console.log(err);
							info = 'mger QunAdd, User.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/mger/ordin/din/update', {
								title: '订单修改',
								crUser,
								din,

								nstrmups,
								cters
							})
						}
					})
				}
			})
		}
	})
}
exports.mgDinDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.exec((err, ordin) => {
		if(err) {
			console.log(err);
			info = "mger QunDel, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			if(ordin.compds.length > 0) {
				info = "安全起见, 请先删除此单中的询价货物!";
				Err.usError(req, res, info);
			} else {
				Ordin.deleteOne({_id: id}, (err, objRm) => {
					if(err) {
						info = "user OrdinDel, Ordin.deleteOne, Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect("/mgDins");
					}
				})
			}
		}
	})
}







exports.mgDinUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Ordin.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, ordin) => {
		if(err) {
			console.log(err);
			info = "mger QunUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = '此订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			mgerDinCterSel(req, res, obj, ordin);
		}
	})
}
let mgerDinCterSel = (req, res, obj, ordin) => {
	if(ordin && (String(ordin.cter) == String(obj.cter))) {
		// 如果是更新， 则判断如果 cter 没有变化, 则跳过此步骤
		mgerdinSave(req, res, obj, ordin);
	} else if(!obj.cter) {
		obj.cter = ordin.cter;
		mgerdinSave(req, res, obj, ordin);
	} else {
		if(obj.cter == "null") obj.cter = null;
		Compd.updateMany({
			_id: ordin.compds,
			cter: ordin.cter
		}, {
			cter: obj.cter
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "mger QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				mgerdinSave(req, res, obj, ordin);
			}
		})
	}
}
let mgerdinSave = (req, res, obj, ordin) => {
	let _ordin = Object();
	if(ordin) {
		_ordin = _.extend(ordin, obj)
	} else {
		_ordin = new Ordin(obj)
	}
	_ordin.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "添加订单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/mgDin/'+objSave._id)
		}
	})
}