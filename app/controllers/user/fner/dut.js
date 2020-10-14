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


exports.fnDut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordut.findOne({_id: id})
	.populate('order')
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
					.populate('seller')
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