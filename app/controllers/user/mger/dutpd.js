const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');
const Ordut = require('../../../models/firm/ord/ordut');

const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

exports.mgDutpdCel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Compd.findOne({
		_id: id,
		firm: crUser.firm
	})
	.populate('ordut')
	// .populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger DutpdCel, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "mger DutpdCel, 此商品已经不存在, 请联系管理员!"
			Err.usError(req, res, info);
		} else if(compd.ordut.status != Conf.status.init.num) {
			info = "mger DutpdCel, 采购单状态已经改变, 不可删除商品!"
			Err.usError(req, res, info);
		} else {
			let ordut = compd.ordut;
			compd.ordut = null;
			compd.dinpdSts = Conf.status.waiting.num;
			compd.save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = "mger DutpdCel, Compd.save, Error!"
					Err.usError(req, res, info);
				} else {
					ordut.compds.remove(id);
					ordut.save((err, ordutSave) => {
						if(err) {
							console.log(err);
							info = "mger DutpdCel, ordut.save, Error!"
							Err.usError(req, res, info);
						} else {
							res.redirect('/mgDut/'+ordut._id)
						}
					})
				}
			})
		}
	})
}
exports.mgDutpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('ordut')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger DutpdUpd, Compd.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = 'mger DutpdUpdAjax 此产品已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(!compd.ordut) {
			info = 'mger DutpdUpdAjax 此产品所属采购订单已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(compd.ordut.status != Conf.status.init.num) {
			info = 'mger DutpdUpdAjax 此产品所属采购订单状态已经改变, 价格不可更改';
			Err.jsonErr(req, res, info);
		} else {
			if(obj.dutPr) obj.dutPr = parseFloat(obj.dutPr);
			if(isNaN(obj.dutPr)) {
				info = '采购价格输入有误, 请仔细查看, 请刷新查看';
				Err.jsonErr(req, res, info);
			} else {
				let _compd = _.extend(compd, obj);
				_compd.save((err, objSave) => {
					if(err) {
						info = "添加采购订单时 数据库保存错误, 请截图后, 联系管理员";
						Err.jsonErr(req, res, info);
					} else {
						res.json({
							status: 1,
							msg: '',
							data: {
							}
						});
					}
				})
			}
		}
	})
}