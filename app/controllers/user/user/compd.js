const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

exports.compdImagesUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sler QunpdUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此询价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else {
			if(obj.images && compd.images) {
				for(let i=0; i<obj.images.length; i++) {
					if(compd.images.length>=i && !obj.images[i]) {
						obj.images[i] = compd.images[i];
					}
				}
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					console.log(err)
					info = "添加询价单时 sler QunpdUpd, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/slQun/'+objSave.inquot._id+'/#tr-compdid-'+objSave._id)
				}
			})
		}
	})
}