const Err = require('../aaIndex/err');
const User = require('../../models/login/user');
const Firm = require('../../models/login/firm');
const _ = require('underscore');


exports.adUsers = (req, res) => {
	let crAder = req.session.crAder;

	User.find()
	.populate('firm')
	.sort({'firm': 1, 'role': 1})
	.exec((err, users) => {
		if(err) {
			console.log(err);
			info = "adUsersFilter, User.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./ader/user/list', {
				title: 'User List',
				crAder: crAder,

				users: users
			})
		}
	})
}



exports.adUserFilter = (req, res, next) => {
	let id = req.params.id;
	User.findOne({_id: id})
	.populate('firm')
	.exec((err, user) => {
		if(err) {
			console.log(err);
			info = "adUserFilter, User.findOne, Error!";
			Err.usError(req, res, info);
		}else if(!user) {
			info = "此帐号已经被删除";
			Err.usError(req, res, info);
		} else {
			req.body.object = user;
			next();
		}
	})
}
exports.adUserDel = (req, res) => {
	let user = req.body.object;
	User.deleteOne({_id: user.id}, (err, objRm) => {
		if(err) {
			info = "删除用户时，数据删除错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect("/adUsers");
		}
	})
		
}
exports.adUser = (req, res) => {
	let objBody = new Object();
	objBody.user = req.body.object;
	objBody.title = "用户:"+objBody.user.code;
	objBody.crAder = req.session.crAder;
	objBody.thisAct = "/adUser";
	objBody.thisTit = "用户";
	res.render('./ader/user/detail', objBody);
}



exports.adUserUpd = (req, res) => {
	let obj = req.body.obj
	if(obj.code) {
		obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	}
	User.findOne({_id: obj._id, firm: obj.firm}, (err, object) => {
		if(err) {
			info = "更新用户，用户数据库查找时错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if(!object) {
			info = "此用户名已经被删除";
			Err.usError(req, res, info);
		} else {
			if(obj.code && obj.code != object.code) {
				adUser_changeCode(req, res, obj, object);
			} else {
				adSaveUser(req, res, obj, object);
			}
		}
	})
}
let adUser_changeCode = (req, res, obj, object) => {
	User.findOne({code: obj.code, firm: obj.firm})
	.where('_id').ne(obj._id)
	.exec((err, objSame) => {
		if(err) {
			info = "更新用户，用户数据库查找相同时错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if(objSame) {
			info = "此用户名已经存在";
			Err.usError(req, res, info);
		} else {
			adSaveUser(req, res, obj, object);
		}
	})
}
adSaveUser = (req, res, obj, object) => {
	let _object = _.extend(object, obj)
	_object.save((err, objSave) => {
		if(err) {
			info = "更新用户时数据库保存数据时出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else {
			res.redirect("/adUser/"+objSave._id)
		}
	})
}



exports.adUserAdd =(req, res) => {
	Firm.find((err, firms) => {
		if(err) {
			info = "添加用户页面时，数据库公司查找错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if(firms && firms.length > 0) {
			res.render('./ader/user/add', {
				title: 'Add 用户',
				crAder : req.session.crAder,
				thisAct : "/adUser",
				thisTit : "用户",
				firms: firms,
			})
		} else {
			info = "请先添加公司";
			Err.usError(req, res, info);
		}
	})
}


exports.adUserNew = (req, res) => {
	let obj = req.body.obj;
	let info;
	if(obj.code) {
		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		if(obj.code.length < 2) {
			info = "用户帐号必须大于2个字符";
		}
	} else {
		info = "用户帐号必须大于2个字符";
	}
	if(!obj.firm || obj.firm.length < 20){
		info = "请为员工选择公司";
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
						res.redirect('/adUsers')
					}
				})
			}
		})
	}
}

