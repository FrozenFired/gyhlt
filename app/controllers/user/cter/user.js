const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const User = require('../../../models/login/user')
const _ = require('underscore')


exports.ctUserUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	if(obj.role || obj.code) {
		info = "违规操作";
		Err.usError(req, res, info);
	} else {
		User.findOne({_id: crUser._id}, (err, user) => {
			if(err) {
				info = "cter UserUpd, User Findone Error!";
				Err.usError(req, res, info);
			} else if(!user) {
				info = "此用户已经被删除";
				Err.usError(req, res, info);
			} else {
				if(obj.pwd || obj.pwd == "") {
					usUser_changePwd(req, res, obj, user);
				} else {
					usUser_save(req, res, obj, user);
				}
			}
		})
	}
}
let bcrypt = require('bcryptjs');
let usUser_changePwd = (req, res, obj, user) => {
	let crUser = req.session.crUser;
	if(crUser._id == user._id) {
		obj.pw = obj.pw.replace(/(\s*$)/g, "").replace( /^\s*/, '')
		bcrypt.compare(obj.pw, user.pwd, (err, isMatch) => {
			if(err) console.log(err);
			if(!isMatch) {
				info = "原密码错误，请重新操作";
				Err.usError(req, res, info);
			}
			else {
				usUser_save(req, res, obj, user);
			}
		});
	} else {
		info = "您无权修改此人密码";
		Err.usError(req, res, info);
	}
}

let usUser_save = (req, res, obj, user) => {
	let _user = _.extend(user, obj)
	_user.save((err, userSave) => {
		if(err) {
			info = "cter User_Save, User Save Error!"
			Err.usError(req, res, info);
		} else {
			if(req.session.crUser._id == userSave._id) {
				User.findOne({_id: userSave._id})
				.populate('firm')
				.exec((err, crUser) => {
					req.session.crUser = crUser;
					res.redirect('/ctUser')
				})
			} else {
				res.redirect('/ctUser')
			}
		}
	})
}


exports.ctUser = (req, res) => {
	let crUser = req.session.crUser;
	if(crUser && crUser.role == Conf.roleUser.customer) {
		User.findOne({_id: crUser._id, firm: crUser.firm})
		.exec((err, user) => {
			if(err) {
				info = "cter User, User FindOne Error!";
				Err.usError(req, res, info);
			} else if(!user) {
				info = "此帐号已经被删除";
				Err.usError(req, res, info);
			} else {
				res.render('./cter/index/user', {
					title: '我的信息',
					crUser: crUser,

					user: user
				})
			}
		})
	} else {
		res.redirect('/usLogin')
	}
}