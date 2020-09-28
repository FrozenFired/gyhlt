const Err = require('../../aaIndex/err');

const Conf = require('../../../../conf');
const MdPicture = require('../../../middle/middlePicture');

const User = require('../../../models/login/user')

const _ = require('underscore')

exports.userUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	if(obj.code) {
		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
	}
	User.findOne({_id: obj._id}, (err, user) => {
		if(err) {
			info = "mger UserUpd, User Findone Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此用户已经被删除";
			Err.usError(req, res, info);
		} else {
			if(crUser.role == user.role) {
				if(obj.pw || obj.pw == "") {
					usUser_changePwd(req, res, obj, user);
				} else {
					usUser_save(req, res, obj, user);
				}
			} else if(Conf.roleAdmin.includes(crUser.role) && crUser.role < user.role) {
				if(obj.code && obj.code != user.code) {
					usUser_changeCode(req, res, obj, user);
				} else {
					usUser_save(req, res, obj, user);
				}
			} else {
				info = "您无权修改此人信息";
				Err.usError(req, res, info);
			}
		}
	})
}
let bcrypt = require('bcryptjs');
let usUser_changePwd = (req, res, obj, user) => {
	let crUser = req.session.crUser;
	if(crUser.role == user.role) {
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
		usUser_save(req, res, obj, user);
	}
}
let usUser_changeCode = (req, res, obj, user) => {
	User.findOne({code: obj.code})
	.where('_id').ne(obj._id)
	.exec((err, objSame) => {
		if(err) {
			info = "mger User ChangeCode, User Findone Error!";
			Err.usError(req, res, info);
		} else if(objSame) {
			info = "此用户名已经存在";
			Err.usError(req, res, info);
		} else {
			usUser_save(req, res, obj, user);
		}
	})
}
let usUser_save = (req, res, obj, user) => {
	let _user = _.extend(user, obj)
	_user.save((err, userSave) => {
		if(err) {
			info = "mger User_Save, User Save Error!"
			Err.usError(req, res, info);
		} else {
			if(req.session.crUser._id == userSave._id) {
				User.findOne({_id: userSave._id})
				.populate('firm')
				.exec((err, crUser) => {
					req.session.crUser = crUser;
					res.redirect('/user/'+userSave._id)
				})
			} else {
				res.redirect('/user/'+userSave._id)
			}
		}
	})
}


exports.users = (req, res) => {
	let crUser = req.session.crUser;

	User.find({'firm': crUser.firm})
	.where('role').gt(crUser.role)
	.sort({'role': 1})
	.exec((err, users) => {
		if(err) {
			info = "mger Users, User Find Error!";
			Err.usError(req, res, info);
		} else {
			users.unshift(crUser)
			res.render('./user/mger/index/user/list', {
				title: '成员列表',
				crUser,

				users
			})
		}
	})
}

exports.user = (req, res) => {
	let crUser = req.session.crUser;
	let userId = req.params.userId;
	User.findOne({_id: userId, firm: crUser.firm})
	.exec((err, user) => {
		if(err) {
			info = "mger User, User FindOne Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此帐号已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/index/user/detail', {
				title: '成员信息',
				crUser: crUser,

				user: user
			})
		}
	})
}
exports.userDel = (req, res) => {
	let crUser = req.session.crUser;
	let userId = req.params.userId;
	User.findOne({_id: userId, firm: crUser.firm})
	.exec((err, user) => {
		if(err) {
			info = "mger User, User FindOne Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此帐号已经被删除";
			Err.usError(req, res, info);
		} else {
			User.deleteOne({_id: userId, firm: crUser.firm}, (err, userDel) => {
				if(err) console.log(err);
				res.redirect('/users')
			})
		}
	})
}

exports.userAdd = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/index/user/add', {
		title: '成员列表',
		crUser,
	})
}
exports.userNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	let info;
	if(obj.code) {
		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		if(obj.code.length < 2) {
			info = "用户帐号必须大于2个字符";
		}
	} else {
		info = "用户帐号必须大于2个字符";
	}
	if(info && info.length > 0) {
		Err.usError(req, res, info);
	} else {
		User.findOne({
			code: obj.code,
			firm: obj.firm
		})
		.exec((err, objSame) => {
			if(err) {
				info = "添加用户时，数据库查找错误, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else if(objSame) {
				info = "公司已有此账号，请重新注册";
				Err.usError(req, res, info);
			} else {
				let _object = new User(obj)
				_object.save((err, objSave) => {
					if(err) {
						console.log(err);
						info = "添加用户时，数据库保存错误, 请截图后, 联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/users')
					}
				})
			}
		})
	}
}