const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

// 报价单
exports.mgQutpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/inquot/qutpd/list', {
		title: '报价单',
		crUser,
	})
}

exports.mgQutpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('quter')
	.populate('strmup')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "mger Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qutpd)
			res.render('./user/mger/inquot/qutpd/detail', {
				title: '报价单详情',
				crUser,
				qutpd
			})
		}
	})
}




exports.mgQutpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(obj.qntPr) obj.qntPr = parseFloat(obj.qntPr);
	info = null;
	if(obj.qntPr && isNaN(obj.qntPr)) {
		info = "请输入正确的报价"
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
