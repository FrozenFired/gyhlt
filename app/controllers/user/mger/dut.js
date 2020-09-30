// 采购订单
const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordut = require('../../../models/firm/ord/ordut');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');


// 订单
exports.mgDuts = (req, res) => {
	let crUser = req.session.crUser;
	Strmup.find({firm: crUser.firm})
	.exec((err, strmups) => {
		if(err) {
			console.log(err);
			info = "mger Duts, Strmup.find, Error!"
		} else {
			res.render('./user/mger/order/dut/list', {
				title: '采购订单',
				crUser,
				strmups
			})
		}
	})
}

exports.mgDutNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	
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

	Ordut.findOne({
		'firm': crUser.firm,
		'crtAt': {[symAtFm]: monthStart}
	})
	.sort({'crtAt': -1})
	.exec((err, lastOrdut) => {
		if(err) {
			console.log(err);
			info = "mger DutNew, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			let lastDate = monthStart.getDate();
			let codeNum = 0;
			if(lastOrdut) {
				lastDate = lastOrdut.crtAt.getDate();
				codeNum = (lastOrdut.code).split('GYIS')[1];
			}
			let daySpan = parseInt(today) - parseInt(lastDate);
			// console.log(codeNum)
			codeNum = String(parseInt(codeNum) + daySpan * r1 + r2);
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

			_ordut = new Ordut(obj)
			_ordut.save((err, ordutSave) => {
				if(err) {
					console.log(err);
					info = "mger DutNew, _ordut.save, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/mgDut/'+ordutSave._id);
				}
			})
		}
	})
}


exports.mgDut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id})
	.populate('duter')
	.populate('strmup')
	.populate('bills')
	.populate({
		path: 'compds',
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'strmup'},
		]
	})
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "mger Qun, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个询价单已经被删除, mgDutFilter";
			Err.usError(req, res, info);
		} else {
			// console.log(dut)
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
					res.render('./user/mger/order/dut/detail', {
						title: '订单详情',
						crUser,
						dut,
						dutpds: dut.compds,

						strmups,
					})
				}
			})
		}
	})
}


exports.mgDutDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id})
	.populate('bills')
	.populate('compds')
	.exec((err, ordut) => {
		if(err) {
			console.log(err);
			info = "mger QunDel, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!ordut) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else if(ordut.status != Conf.status.unpaid.num) {
			info = "订单状态已经改变, 不可删除";
			Err.usError(req, res, info);
		} else if(ordut.bills.length > 0) {
			info = "此采购单已经付款, 不可删除";
			Err.usError(req, res, info);
		} else {
			let compds = ordut.compds;
			Ordut.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user OrdutDel, Ordut.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					inquot.save((err, inquotSave) => {
						if(err) {
							info = "user OrdutDel, inquot.save, Error!";
							Err.usError(req, res, info);
						} else {
							mgerDutCompdStatus(req, res, compds, 0);
							res.redirect("/mgQut/"+inquotSave._id);
						}
					})
				}
			})
		}
	})
}
let mgerDutCompdStatus = (req, res, compds, n) => {
	if(n == compds.length) {
		return;
	} else {
		compds[n].dinpdSts = Conf.status.waiting.num;
		compds[n].save((err, compdSave) => {
			if(err) console.log(err);
			mgerDutCompdStatus(req, res, compds, n+1);
		})
	}
}





exports.mgDutUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(obj.cterNome) obj.cterNome = obj.cterNome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Ordut.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, ordut) => {
		if(err) {
			console.log(err);
			info = "mger QunUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!ordut) {
			info = '此订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			mgerDutCterSel(req, res, obj, ordut);
		}
	})
}
let mgerDutCterSel = (req, res, obj, ordut) => {
	if(ordut && (String(ordut.cter) == String(obj.cter))) {
		// 如果是更新， 则判断如果 cter 没有变化, 则跳过此步骤
		mgerdutSave(req, res, obj, ordut);
	} else if(!obj.cter) {
		obj.cter = ordut.cter;
		mgerdutSave(req, res, obj, ordut);
	} else {
		if(obj.cter == "null") obj.cter = null;
		Compd.updateMany({
			_id: ordut.compds,
			cter: ordut.cter
		}, {
			cter: obj.cter
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "mger QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				mgerdutSave(req, res, obj, ordut);
			}
		})
	}
}
let mgerdutSave = (req, res, obj, ordut) => {
	let _ordut = Object();
	if(ordut) {
		_ordut = _.extend(ordut, obj)
	} else {
		_ordut = new Ordut(obj)
	}
	_ordut.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "添加订单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/mgDut/'+objSave._id)
		}
	})
}