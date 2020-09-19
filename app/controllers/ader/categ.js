const Conf = require('../../../conf.js')
const Err = require('../aaIndex/err');
const Categ = require('../../models/plat/categ');
const User = require('../../models/login/user');
const _ = require('underscore');


exports.adCategs = (req, res) => {
	let crAder = req.session.crAder;
	Categ.find()
	.exec((err, categs) => {
		if(err) {
			info = "adCategs, Categ.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./ader/categ/list', {
				title: 'Categ List',
				crAder: crAder,

				categs: categs
			});
		}
	})
}



exports.adCategFilter = (req, res, next) => {
	let id = req.params.id;
	Categ.findOne({_id: id}, (err, object) => {
		if(err) {
			console.log(err);
			info = "adCategFilter, Categ.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!object) {
			info = "这个品类已经被删除";
			Err.usError(req, res, info);
		} else {
			req.body.object = object;
			next();
		}
	})
}
exports.adCategDel = (req, res) => {
	let object = req.body.object;
	let id = object._id;
	Categ.deleteOne({_id: id}, (err, objRm) => {
		if(err) {
			info = "adCategDel, Categ.deleteOne, Error!";
			Err.usError(req, res, info);
		} else {
			res.redirect("/adCategs");
		}
	})
}

exports.adCateg = (req, res) => {
	let object = req.body.object;

	let objBody = new Object();

	objBody.crAder = req.session.crAder;
	objBody.object = object;
	objBody.title = "品类详情";

	User.find({categ: object._id}, (err, users) => {
		if(err) {
			info = "查看品类时，用户查找错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else {
			objBody.users = users;
			res.render('./ader/categ/detail', objBody)
		}
	})
}



exports.adCategUpd = (req, res) => {
	let obj = req.body.obj
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.en) obj.en = obj.en.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.cn) obj.cn = obj.cn.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.it) obj.it = obj.it.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.code.length < 1) {
		info = "请输入品类名称";
		Err.usError(req, res, info);
	} else {
		Categ.findOne({_id: obj._id}, (err, object) => {
			if(err) {
				info = "更新品类时数据库查找出现错误, 请截图后, 联系管理员"
				Err.usError(req, res, info);
			} else if(!object) {
				info = "此品类已经被删除，请刷新查看";
				Err.usError(req, res, info);
			} else {
				Categ.findOne({code: obj.code})
				.where('_id').ne(obj._id)
				.exec((err, objSame) => {
					if(err) {
						info = "更新品类时数据库查找相同名称时出现错误, 请截图后, 联系管理员"
						Err.usError(req, res, info);
					} else if(objSame) {
						info = "已经有这个名字的品类"
						Err.usError(req, res, info);
					} else {
						let _object = _.extend(object, obj)
						_object.save((err, objSave) => {
							if(err) {
								info = "更新品类时数据库保存数据时出现错误, 请截图后, 联系管理员"
								Err.usError(req, res, info);
							} else {
								res.redirect("/adCateg/"+objSave._id)
							}
						})
					}
				})
			}
		})
	}
}



exports.adCategAdd = (req, res) => {
	res.render('./ader/categ/add', {
		title: '添加新品类',
		crAder : req.session.crAder,
	})
}


exports.adCategNew = (req, res) => {
	let obj = req.body.obj;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.en) obj.en = obj.en.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.cn) obj.cn = obj.cn.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.it) obj.it = obj.it.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(obj.code.length < 1) {
		info = "请输入品类名称";
		Err.usError(req, res, info);
	} else {
		Categ.findOne({code: obj.code}, (err, objSame) => {
			if(err) {
				info = "添加品类时 数据库查找错误, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else if(objSame) {
				info = "此品类帐号已经存在";
				Err.usError(req, res, info);
			} else {
				let _object = new Categ(obj)
				_object.save((err, objSave) => {
					if(err) {
						info = "添加品类时 数据库保存错误, 请截图后, 联系管理员";
						Err.usError(req, res, info);
					} else {
						res.redirect('/adCategs')
					}
				})
			}
		})
	}
}