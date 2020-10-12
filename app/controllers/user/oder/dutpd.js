const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Compd = require('../../../models/firm/ord/compd');

const _ = require('underscore');

exports.odDutpdCel = (req, res) => {
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
			info = "oder DutpdCel, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "oder DutpdCel, 此商品已经不存在, 请联系管理员!"
			Err.usError(req, res, info);
		} else if(compd.ordut.status != Conf.status.init.num) {
			info = "oder DutpdCel, 采购单状态已经改变, 不可删除商品!"
			Err.usError(req, res, info);
		} else {
			let ordut = compd.ordut;
			compd.ordut = null;
			compd.compdSts = Conf.status.waiting.num;
			compd.save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = "oder DutpdCel, Compd.save, Error!"
					Err.usError(req, res, info);
				} else {
					ordut.compds.remove(id);
					ordut.save((err, ordutSave) => {
						if(err) {
							console.log(err);
							info = "oder DutpdCel, ordut.save, Error!"
							Err.usError(req, res, info);
						} else {
							res.redirect('/odDut/'+ordut._id)
						}
					})
				}
			})
		}
	})
}
exports.odDutpdUpdAjax = (req, res) => {
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
			info = "oder DutpdUpd, Compd.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = 'oder DutpdUpdAjax 此产品已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(!compd.ordut) {
			info = 'oder DutpdUpdAjax 此产品所属采购单已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(compd.ordut.status != Conf.status.init.num) {
			info = 'oder DutpdUpdAjax 此产品所属采购单状态已经改变, 价格不可更改';
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
						info = "添加采购单时 数据库保存错误, 请截图后, 联系管理员";
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