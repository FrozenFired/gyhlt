const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Compd = require('../../../models/firm/ord/compd');

const _ = require('underscore');

exports.compdImagesUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	let reUrl = req.body.reUrl;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "compd ImagesUpd, Compd.findOne, Error!"
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
					info = "添加询价单时 compd ImagesUpd, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect(reUrl+objSave.inquot._id+'/#tr-compdid-'+objSave._id)
				}
			})
		}
	})
}

exports.compdDelPic = (req, res) => {
	let crUser = req.session.crUser;
	let compdId = req.body.compdId;
	let picField = req.body.picField;
	let subsp = req.body.subsp;
	if(!picField) {
		info = '操作错误, 请截图 联系管理员 compdDelPic';
		Err.usError(req, res, info);
	} else {
		Compd.findOne({
			_id: compdId,
			firm: crUser.firm
		})
		.populate('ordin')
		.exec((err, compd) => {
			if(err) {
				console.log(err);
				info = "compdDelPic, Compd.findOne, Error!"
				Err.usError(req, res, info);
			} else if(!compd) {
				info = '此询价单已经被删除, 请刷新查看';
				Err.usError(req, res, info);
			} else if(compd.ordin) {
				info = '已经生成了订单, 不可删除图片, 请截图 联系管理员 compdDelPic';
				Err.usError(req, res, info);
			} else {
				let picDel = compd[picField];
				if(subsp) {
					picDel = compd[picField][subsp];
					// compd[picField][subsp] = '';
					compd.images.remove(picDel)
				} else {
					picDel = compd[picField];
					compd[picField] = '';
				}
				// return;
				compd.save((err, compdSave) => {
					if(err) {
						console.log(err);
						info = "compdDelPic, Compd.save, Error!"
						Err.usError(req, res, info);
					} else {
						MdPicture.deletePicture(picDel, Conf.picPath.compd);
						res.redirect(req.body.reUrl+compdSave.inquot)
					}
				})
			}
		})
	}
}