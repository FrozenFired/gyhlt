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

// 销售单
exports.fnDins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/fner/order/din/list', {
		title: '销售单',
		crUser,
	})
}


exports.fnDin = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Ordin.findOne({_id: id})
	.populate('seller')
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
			info = "fner Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个询价单已经被删除, fnDinFilter";
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
					info = 'fner QutAdd, Strmup.find, Error!';
					Err.usError(req, res, info);
				} else {
					User.find({
						firm: crUser.firm,
						role: Conf.roleUser.customer.num
					})
					.exec((err, cters) => {
						if(err) {
							console.log(err);
							info = 'fner QutAdd, Strmup.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/fner/order/din/detail', {
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