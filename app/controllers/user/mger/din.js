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


exports.mgDinFilter = (req, res, next) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	if(!id) id = req.query.ordinId
	if(!id) {
		let dinObj = {
			din: new Object(),
			dinpds: new Object()
		}
		req.body.dinObj = dinObj;
		next();
	} else {
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
				let dinObj = {
					din,
					dinpds: din.compds
				}
				req.body.dinObj = dinObj;
				next();
			}
		})
	}
}




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
	.populate('dutFirm')
	.populate('nstrmup')
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "mger Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			Compd.find({ordin: id})
			.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
			.populate('diner')
			.populate('cter')
			.populate('dutFirm').populate('nstrmup')
			.sort({'status': 1, 'weight': -1, 'dinAt': -1})
			.exec((err, dinpds) => {
				if(err) {
					info = "cter CompdsAjax, Compd.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					res.render('./user/mger/ordin/din/detail', {
						title: '订单详情',
						crUser,
						din,
						dinpds,
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
	if(!obj.nstrmup || obj.nstrmup.length == 0) obj.nstrmup = null;
	if(!obj.cter || obj.cter.length == 0) obj.cter = null;
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
			mgerDinNstrmupSel(req, res, obj, ordin);
		}
	})
}
let mgerDinNstrmupSel = (req, res, obj, ordin) => {
	if(ordin && (String(ordin.nstrmup) == obj.nstrmup)) {
		// 如果是更新， 则判断如果nstrmup没有变化, 则跳过此步骤
		mgerDinCterSel(req, res, obj, ordin);
	} else {
		let crUser = req.session.crUser;
		if(!obj.nstrmup || obj.nstrmup.length < 20) {
			// 说明本订单的 合作报价公司为 本公司， 以询价视角看供应商公司为null, 以报价视角看下游客户公司为null
			obj.nstrmup = null;
			obj.tstrmdw = null;
			obj.dutFirm = crUser.firm;
			mgerDinCterSel(req, res, obj, ordin);
		} else {
			// 如果订单的上游公司不为空, 就要看上游报价公司是否在本平台, 并且是否和本公司建立联系
			Strmup.findOne({
				firm: crUser.firm,
				_id: obj.nstrmup
			}, (err, nstrmup) => {
				if(err) {
					console.log(err);
					info = "mger QunNew, Strmup.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!nstrmup) {	// 本公司数据库中没有此供应商
					info = "本公司数据库中没有此供应商! "
					Err.usError(req, res, info);
				} else if(nstrmup.accept != Conf.accept.yes.num) {
					// 如果询价公司没有跟上游报价公司建立联系
					obj.dutFirm = null;
					obj.tstrmdw = null;
					mgerDinCterSel(req, res, obj, ordin);
				} else {
					// 如果询价公司和报价公司建立了联系
					obj.dutFirm = nstrmup.firmUp;
					Strmdw.findOne({
						firm: obj.dutFirm,
						firmDw: crUser.firm
					}, (err, tstrmdw) => {
						if(err) {
							console.log(err);
							info = "mger QunNew, Strmup.findOne, Error!"
							Err.usError(req, res, info);
						} else if(!tstrmdw){
							info = "对方没有跟我们建立联系, 请联系对方公司! "
							Err.usError(req, res, info);
						} else {
							obj.tstrmdw = tstrmdw._id;
							mgerDinCterSel(req, res, obj, ordin);
						}
					})
				}
			})
		}
	}
}
let mgerDinCterSel = (req, res, obj, ordin) => {
	let crUser = req.session.crUser;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();

	let cterSel = req.body.cterSel
	if(cterSel == 'cterNome') {
		obj.cter = null;
		mgerdinSave(req, res, obj, ordin);
	} else if(cterSel == 'cter') {
		if(ordin && (String(ordin.cter) == obj.cter)) {
			mgerdinSave(req, res, obj, ordin);
		} else {
			User.findOne({
				firm: crUser.firm,
				_id: obj.cter
			}, (err, cter) => {
				if(err) {
					console.log(err);
					info = "mger QunNew, User.findOne, Error!"
					Err.usError(req, res, info);
				} else if(!cter) {
					info = "您选的客户不存在! "
					Err.usError(req, res, info);
				} else {
					obj.cterNome = cter.nome + ' ' + [cter.code]
					mgerdinSave(req, res, obj, ordin);
				}
			})
		}
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