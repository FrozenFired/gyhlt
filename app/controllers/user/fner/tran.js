// 运输 集装箱
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Tran = require('../../../models/firm/ord/tran');
const Compd = require('../../../models/firm/ord/compd');

const Strmlg = require('../../../models/firm/stream/strmlg');
const Ordut = require('../../../models/firm/ord/ordut');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 运输管理
exports.fnTrans = (req, res) => {
	let crUser = req.session.crUser;
	Strmlg.find({firm: crUser.firm})
	.exec((err, strmlgs) => {
		if(err) {
			console.log(err);
			info = "fner Trans, Strmlg.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/fner/tran/list', {
				title: '运输清单(财务)',
				crUser,
				strmlgs
			})
		}
	})
}

exports.fnTran = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Tran.findOne({_id: id})
	.populate('lger')
	.populate('strmlg')
	.populate('bills')
	.populate({
		path: 'compds',
		options: { sort: { 'ordut': 1, 'pdnum': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'ordut'},
		]
	})
	.exec((err, tran) => {
		if(err) {
			console.log(err);
			info = "fner Tran, Tran.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!tran) {
			info = "这个运输单已经被删除, fnTranFilter";
			Err.usError(req, res, info);
		} else {
			// console.log(tran)
			Strmlg.find({
				firm: crUser.firm,
			})
			.sort({'role': -1})
			.exec((err, strmlgs) => {
				if(err) {
					console.log(err);
					info = 'fner Tran, Strmlg.find, Error!';
					Err.usError(req, res, info);
				} else {
					Ordut.find({
						firm: crUser.firm,
						status: Conf.status.done.num,
					})
					.populate('strmup')
					.populate({
						path: 'compds',
						match: { 'compdSts': Conf.status.tranpre.num},
						populate: [
							{path: 'brand'},
							{path: 'pdfir'},
							{path: 'pdsec'},
							{path: 'pdthd'},
						]
					})
					.exec((err, duts) => {
						if(err) {
							console.log(err);
							info = 'fner Tran, Ordut.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/fner/tran/detail', {
								title: '运输单详情',
								crUser,
								tran,
								tranpds: tran.compds,

								strmlgs,
								duts
							})
						}
					})
				}
			})
		}
	})
}