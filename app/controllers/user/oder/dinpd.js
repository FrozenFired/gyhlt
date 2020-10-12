const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

exports.odDinpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "oder DinpdUpd, Strmup.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = 'oder DinpdUpdAjax 此产品已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(!compd.ordin) {
			info = 'oder DinpdUpdAjax 此产品所属销售单已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(compd.ordin.status != Conf.status.init.num) {
			info = 'oder DinpdUpdAjax 此产品所属销售单状态已经改变, 价格不可更改';
			Err.jsonErr(req, res, info);
		} else {
			if(obj.dinPr) obj.dinPr = parseFloat(obj.dinPr);
			if(isNaN(obj.dinPr)) {
				info = '销售价格输入有误, 请仔细查看, 请刷新查看';
				Err.jsonErr(req, res, info);
			} else {
				let _compd = _.extend(compd, obj);
				_compd.save((err, objSave) => {
					if(err) {
						info = "添加销售单时 数据库保存错误, 请截图后, 联系管理员";
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