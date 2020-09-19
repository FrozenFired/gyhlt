const Conf = require('../../../conf.js')
const Err = require('../aaIndex/err');
const Firm = require('../../models/login/firm');
const User = require('../../models/login/user');
const _ = require('underscore');


exports.adFirms = (req, res) => {
	let crAder = req.session.crAder;
	Firm.find()
	.exec((err, firms) => {
		if(err) {
			info = "adFirms, Firm.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./ader/firm/list', {
				title: 'Firm List',
				crAder: crAder,

				firms: firms
			});
		}
	})
}



exports.adFirmFilter = (req, res, next) => {
	let id = req.params.id;
	Firm.findOne({_id: id}, (err, object) => {
		if(err) {
			console.log(err);
			info = "adFirmFilter, Firm.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!object) {
			info = "这个公司已经被删除";
			Err.usError(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.adFirmDel = (req, res) => {
	let object = req.body.object;
	let id = object._id;
	User.find({firm: id}, (err, users) => {
		if(err) {
			info = "adFirmDel, User.find, Error!";
			Err.usError(req, res, info);
		} else if(users && users.length > 0) {
			info = "此公司中还有员工，请先删除此公司的员工";
			Err.usError(req, res, info);
		} else {
			Firm.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "adFirmDel, Firm.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/adFirms");
				}
			})
		}
	})
}
exports.adFirm = (req, res) => {
	let object = req.body.object;

	let objBody = new Object();

	objBody.crAder = req.session.crAder;
	objBody.object = object;
	objBody.title = "公司详情";

	User.find({firm: object._id}, (err, users) => {
		if(err) {
			info = "查看公司时，用户查找错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else {
			objBody.users = users;
			res.render('./ader/firm/detail', objBody)
		}
	})
}



exports.adFirmUpd = (req, res) => {
	let obj = req.body.obj
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.code.length != Conf.codeLenFirm) {
		info = "公司编号长度必须是:"+Conf.codeLenFirm;
		Err.usError(req, res, info);
	} else {
		Firm.findOne({_id: obj._id}, (err, object) => {
			if(err) {
				info = "更新公司时数据库查找出现错误, 请截图后, 联系管理员"
				Err.usError(req, res, info);
			} else if(!object) {
				info = "此公司已经被删除，请刷新查看";
				Err.usError(req, res, info);
			} else {
				Firm.findOne({code: obj.code})
				.where('_id').ne(obj._id)
				.exec((err, objSame) => {
					if(err) {
						info = "更新公司时数据库查找相同名称时出现错误, 请截图后, 联系管理员"
						Err.usError(req, res, info);
					} else if(objSame) {
						info = "已经有这个名字的公司"
						Err.usError(req, res, info);
					} else {
						let _object = _.extend(object, obj)
						_object.save((err, objSave) => {
							if(err) {
								info = "更新公司时数据库保存数据时出现错误, 请截图后, 联系管理员"
								Err.usError(req, res, info);
							} else {
								res.redirect("/adFirm/"+objSave._id)
							}
						})
					}
				})
			}
		})
	}
}



exports.adFirmAdd = (req, res) => {
	res.render('./ader/firm/add', {
		title: '添加新公司',
		crAder : req.session.crAder,
	})
}


exports.adFirmNew = (req, res) => {
	let obj = req.body.obj;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.code.length != Conf.codeLenFirm) {
		info = "公司编号长度必须是:"+Conf.codeLenFirm;
		Err.usError(req, res, info);
	} else {
		if(!obj.nome) obj.nome = obj.code;
		Firm.findOne({code: obj.code}, (err, objSame) => {
			if(err) {
				info = "添加公司时 数据库查找错误, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else if(objSame) {
				info = "此公司帐号已经存在";
				Err.usError(req, res, info);
			} else {
				let _object = new Firm(obj)
				_object.save((err, objSave) => {
					if(err) {
						info = "添加公司时 数据库保存错误, 请截图后, 联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/adFirms')
					}
				})
			}
		})
	}
}