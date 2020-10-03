const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Compd = require('../../../models/firm/ord/compd');

const _ = require('underscore');

exports.mgTranpdCel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Compd.findOne({
		_id: id,
		firm: crUser.firm
	})
	.populate('tran')
	// .populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger TranpdCel, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "mger TranpdCel, 此商品已经不存在, 请联系管理员!"
			Err.usError(req, res, info);
		} else if(compd.tran.status != Conf.status.init.num) {
			info = "mger TranpdCel, 采购单状态已经改变, 不可删除商品!"
			Err.usError(req, res, info);
		} else {
			let tran = compd.tran;
			compd.tran = null;
			compd.compdSts = Conf.status.tranpre.num;
			compd.save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = "mger TranpdCel, Compd.save, Error!"
					Err.usError(req, res, info);
				} else {
					tran.compds.remove(id);
					tran.save((err, tranSave) => {
						if(err) {
							console.log(err);
							info = "mger TranpdCel, tran.save, Error!"
							Err.usError(req, res, info);
						} else {
							res.redirect('/mgTran/'+tran._id)
						}
					})
				}
			})
		}
	})
}
exports.mgTranpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('tran')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "mger TranpdUpd, Compd.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = 'mger TranpdUpdAjax 此产品已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(!compd.tran) {
			info = 'mger TranpdUpdAjax 此产品所属采购单已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(compd.tran.status != Conf.status.init.num) {
			info = 'mger TranpdUpdAjax 此产品所属采购单状态已经改变, 价格不可更改';
			Err.jsonErr(req, res, info);
		} else {
			if(obj.tranPr) obj.tranPr = parseFloat(obj.tranPr);
			if(isNaN(obj.tranPr)) {
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