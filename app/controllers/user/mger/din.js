// 销售单
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

exports.mgDinGen = (req, res) => {
	let crUser = req.session.crUser;
	let inquotId = req.params.inquotId;
	Inquot.findOne({_id: inquotId})
	.populate({
		path: 'compds',
		match: { 'qntpdSts': Conf.status.done.num }
	})
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = 'mger DinGen, Inquot.findOne, Error!'
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = '没有找到询价单, 请重试!'
			Err.usError(req, res, info);
		} else {
			let compds = inquot.compds;
			// console.log(compds)
			let maxNum = 3
			let minNum = 1
			let r1 = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)
			let r2 = parseInt(Math.random()*(maxNum-minNum+1)+minNum,10)

			let symAtFm = "$gte";
			var monthStart = new Date(); //本月
			let today = monthStart.getDate();
			let codePre = moment(monthStart).format("YYMM");
			monthStart.setDate(1);
			monthStart.setHours(0);
			monthStart.setSeconds(0);
			monthStart.setMinutes(0);

			Ordin.findOne({
				'firm': crUser.firm,
				'crtAt': {[symAtFm]: monthStart}
			})
			.sort({'crtAt': -1})
			.exec((err, lastOrdin) => {
				if(err) {
					console.log(err);
					info = "mger DinGen, Ordin.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					let lastDate = monthStart.getDate();
					let codeNum = 0;
					if(lastOrdin) {
						lastDate = lastOrdin.crtAt.getDate();
						codeNum = (lastOrdin.code).split('GYIS')[1];
					}
					let daySpan = parseInt(today) - parseInt(lastDate);
					// console.log(codeNum)
					let dinNum = parseInt(codeNum) + daySpan * r1 + r2;

					codeNum = String(dinNum);
					// console.log(daySpan)
					// console.log(r1)
					// console.log(r2)
					// console.log(codeNum)
					if(codeNum.length < 4) {
						for(let i=codeNum.length; i < 4; i++) { // 序列号补0
							codeNum = "0"+codeNum;
						}
					}
					let code = codePre + 'GYIS' + codeNum;

					let ordinObj = new Object();
					ordinObj.inquot = inquot._id;
					ordinObj.cter = inquot.cter;
					ordinObj.cterNome = inquot.cterNome;
					ordinObj.firm = crUser.firm;
					ordinObj.diner = crUser._id;
					ordinObj.code = code;
					ordinObj.dinImp = 0;
					ordinObj.billPr = 0;
					_ordin = new Ordin(ordinObj)
					mgerOrdinSave(req, res, _ordin, inquot, dinNum, compds, 0);
				}
			})
		}
	})
}
let mgerOrdinSave = (req, res, ordin, inquot, dinNum, compds, n) => {
	if(n == compds.length) {
		ordin.save((err, ordSave) => {
			if(err) {
				console.log(err);
				info = 'mger OrdinSave, ordin.save, Error, 请截图后, 联系管理员!'
				Err.usError(req, res, info);
			} else {
				inquot.status = Conf.status.ord.num;
				inquot.ordin = ordSave._id;
				inquot.save((err, inquotSave) => {
					if(err) {
						console.log(err);
						info = 'mger OrdinSave, inquot.save, Error, 请截图后, 联系管理员!'
						Err.usError(req, res, info);
					} else {
						res.redirect('/mgDin/'+ordSave._id)
					}
				})
			}
		})
		return;
	} else {
		if(compds[n].quant > 0) {
			ordin.compds.push(compds[n]._id);
			if(!isNaN(compds[n].dinPr) && !isNaN(compds[n].quant)) {
				ordin.dinImp += compds[n].dinPr * compds[n].quant;
			}

			compds[n].pdnum = 'S'+dinNum+'-N'+parseInt(n+1);
			compds[n].ordin = ordin._id;
			compds[n].compdSts = Conf.status.init.num;
			compds[n].save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = 'mger OrdinSave, Error, compds[n].save, 请截图后, 联系管理员!'
					Err.usError(req, res, info);
				} else {
					mgerOrdinSave(req, res, ordin, inquot, dinNum, compds, n+1);
				}
			})
		} else {
			mgerOrdinSave(req, res, ordin, inquot, dinNum, compds, n+1);
		}
	}
}


// 销售单
exports.mgDins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/order/din/list', {
		title: '销售单',
		crUser,
	})
}


exports.mgDin = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordin.findOne({_id: id})
	.populate('diner')
	.populate('cter')
	.populate('bills')
	.populate({
		path: 'compds',
		options: { sort: { 'ordut': 1, 'pdnum': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'strmup'},
			{path: 'cter'},
			{path: 'ordut'},
		]
	})
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "mger Qun, Ordin.findOne, Error!";
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
							res.render('./user/mger/order/din/detail', {
								title: '销售单详情',
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

exports.mgDinDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordin.findOne({_id: id, firm: crUser.firm})
	.populate('inquot')
	.exec((err, ordin) => {
		if(err) {
			console.log(err);
			info = "mger QunDel, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!ordin) {
			info = "此销售单已经被删除";
			Err.usError(req, res, info);
		} else if(ordin.status != Conf.status.unpaid.num) {
			info = "销售单状态已经改变, 不可删除";
			Err.usError(req, res, info);
		} else if(!ordin.inquot) {
			info = "此销售单的询价单, 已经不存在, 请联系管理员";
			Err.usError(req, res, info);
		} else if(ordin.bills && ordin.bills.length > 0) {
			info = "此销售单已经有收款, 不可删除";
			Err.usError(req, res, info);
		} else {
			let inquot = ordin.inquot;
			Ordin.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user OrdinDel, Ordin.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					inquot.status = Conf.status.pending.num;
					inquot.cter = ordin.cter;
					inquot.save((err, inquotSave) => {
						if(err) {
							info = "user OrdinDel, inquot.save, Error!";
							Err.usError(req, res, info);
						} else {
							res.redirect("/mgQut/"+inquotSave._id);
						}
					})
				}
			})
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
			info = '此销售单已经被删除, 请刷新查看';
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
			info = "添加销售单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/mgDin/'+objSave._id)
		}
	})
}