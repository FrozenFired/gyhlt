// 销售单
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

exports.ctOrdins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/ordin/list', {
		title: '我的订单',
		crUser,
	})
}

exports.ordin = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Ordin.findOne({_id: id})
	.populate('diner')
	.populate('cter')
	.populate({
		path: 'compds',
		options: { sort: { 'pdnum': 1,} },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},
			{path: 'diner'},
			{path: 'cter'},
		]
	})
	.exec((err, din) => {
		if(err) {
			console.log(err);
			info = "sler Qun, Ordin.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!din) {
			info = "这个订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(din)
			res.render('./cter/ordin/detail', {
				title: '订单详情',
				crUser,
				din,
				dinpds: din.compds,
			})
		}
	})
}