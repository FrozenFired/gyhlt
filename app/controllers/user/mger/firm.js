const Err = require('../../aaIndex/err');

const Conf = require('../../../../conf');
const MdPicture = require('../../../middle/middlePicture');

const Firm = require('../../../models/login/firm')

const _ = require('underscore')

exports.usFirm = (req, res) => {
	let crUser = req.session.crUser;
	
	Firm.findOne({'_id': crUser.firm})
	.exec((err, firm) => {
		if(err) {
			info = "mger firm, Firm Find Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息出现错误，联系管理员";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/index/firm/firm', {
				title: '公司信息',
				crUser: crUser,

				firm: firm
			})
		}
	})
}

exports.mgFirmUpd = (req, res) => {
	let obj = req.body.obj;
	if(obj.code || obj.type) {
		info = "不允许私自篡改数据";
		Err.usError(req, res, info);
	} else {
		Firm.findOne({_id: obj._id}, (err, firm) => {
			if(err) {
				console.log(err);
				info = "mger FirmUpd, Firm.findOne, Error!";
				Err.usError(req, res, info);
			} else if(!firm) {
				info = "公司信息被删除, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else {
				let _firm = _.extend(firm, obj);
				_firm.save((err, firmSave) => {
					if(err) {
						info = "修改公司信息时，数据库保存错误 请截图后, 联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/usFirm')
					}
				});
			}
		});
	}
}


exports.mgFirmPostNew = (req, res) => {
	let crUser = req.session.crUser;
	let postObj = req.body.obj;
	if(postObj.picture) postObj.photo = postObj.picture;
	Firm.findOne({_id: crUser.firm}, function(err, firm) {
		if(err) console.log(err);
		if(!firm) {
			info = "修改公司信息时，数据库保存错误 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			firm.posts.unshift(postObj);
			firm.save(function(err, firmSave) {
				if(err) console.log(err);
				res.redirect('/usFirm')
			})
		}
	})
}
exports.mgFirmPostDel = function(req, res) {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Firm.findOne({_id: crUser.firm}, function(err, firm) {
		if(err) console.log(err);
		if(!firm) {
			info = "修改公司信息时，数据库保存错误 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			for(let i=0; i<firm.posts.length; i++) {
				let post = firm.posts[i];
				if(post._id == id) {
					let orgPhoto = post.photo;
					MdPicture.deletePicture(orgPhoto, '/firm/');
					firm.posts.remove(post);
				}
			}
			firm.save(function(err, firmSave) {
				if(err) console.log(err);
				res.redirect('/usFirm')
			})
		}
	})
}