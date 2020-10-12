// 采购单
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Ordut = require('../../../models/firm/ord/ordut');
const Compd = require('../../../models/firm/ord/compd');

const Ordin = require('../../../models/firm/ord/ordin');
const Strmup = require('../../../models/firm/stream/strmup');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 采购单
exports.fnDuts = (req, res) => {
	let crUser = req.session.crUser;
	Strmup.find({firm: crUser.firm})
	.exec((err, strmups) => {
		if(err) {
			console.log(err);
			info = "fner Duts, Strmup.find, Error!"
		} else {
			res.render('./user/fner/order/dut/list', {
				title: '采购单',
				crUser,
				strmups
			})
		}
	})
}

exports.fnDutNew = (req, res) => {
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
			info = "fner DutNew, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			let lastDate = monthStart.getDate();
			let codeNum = 0;
			if(lastOrdut) {
				lastDate = lastOrdut.crtAt.getDate();
				codeNum = (lastOrdut.code).split('GYIP')[1];
			}
			let daySpan = parseInt(today) - parseInt(lastDate);
			codeNum = String(parseInt(codeNum) + daySpan * r1 + r2);

			if(codeNum.length < 4) {
				for(let i=codeNum.length; i < 4; i++) { // 序列号补0
					codeNum = "0"+codeNum;
				}
			}
			let code = codePre + 'GYIP' + codeNum;
			obj.firm = crUser.firm;
			obj.duter = crUser._id;
			obj.code = code;
			_ordut = new Ordut(obj)
			_ordut.save((err, ordutSave) => {
				if(err) {
					console.log(err);
					info = "fner DutNew, _ordut.save, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/fnDut/'+ordutSave._id);
				}
			})
		}
	})
}


exports.fnDut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id})
	.populate('duter')
	.populate('strmup')
	.populate('bills')
	.populate({
		path: 'compds',
		options: { sort: { 'ordin': 1, 'pdnum': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'ordin'},
			{path: 'tran'},
		]
	})
	.exec((err, dut) => {
		if(err) {
			console.log(err);
			info = "fner Dut, Ordut.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dut) {
			info = "这个采购单已经被删除, fnDutFilter";
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
					info = 'fner Dut, Strmup.find, Error!';
					Err.usError(req, res, info);
				} else {
					Ordin.find({
						firm: crUser.firm,
						status: {'$in': [Conf.status.deposit.num, Conf.status.payoff.num]},
					})
					.populate('diner')
					.populate({
						path: 'compds',
						match: { 'compdSts': Conf.status.waiting.num, 'strmup': dut.strmup },
						populate: [
							{path: 'brand'},
							{path: 'pdfir'},
							{path: 'pdsec'},
							{path: 'pdthd'},

							{path: 'strmup'},
							{path: 'cter'},
						]
					})
					.exec((err, dins) => {
						if(err) {
							console.log(err);
							info = 'fner Dut, Ordin.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/fner/order/dut/detail', {
								title: '采购单详情',
								crUser,
								dut,
								dutpds: dut.compds,

								strmups,
								dins
							})
						}
					})
				}
			})
		}
	})
}