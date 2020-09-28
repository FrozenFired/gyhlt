let Err = require('../../aaIndex/err');

let Conf = require('../../../../conf');

let Strmdw = require('../../../models/firm/stream/strmdw');
let Sell = require('../../../models/firm/stream/sell');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.pmStrmdws = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/pmer/strmdw/list', {
		title: '客户列表',
		crUser,
	})
}

exports.pmStrmdwAdd = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/pmer/strmdw/add', {
		title: '添加客户',
		crUser,
	})
}

exports.pmStrmdw = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmdw.findOne({_id: id})
	.populate('firmUp')
	.exec((err, strmdw) => {
		if(err) {
			console.log(err);
			info = "user StrmdwFilter, Strmdw.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmdw) {
			info = "这个客户已经被删除";
			Err.usError(req, res, info);
		} else {
			Sell.find({firm: crUser.firm, strmdw: id})
			.populate('brand')
			.exec((err, sells) => {
				if(err) {
					console.log(err);
					info = "user StrmdwFilter, Strmdw.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/pmer/strmdw/detail', {
						title: '客户详情',
						crUser,

						strmdw,
						sells
					})
				}
			})
		}
	})
}

exports.pmStrmdwUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmdw.findOne({_id: id})
	.exec((err, strmdw) => {
		if(err) {
			console.log(err);
			info = "user StrmdwFilter, Strmdw.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmdw) {
			info = "这个客户已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/strmdw/update', {
				title: '客户更新',
				crUser,
				strmdw,
			})
		}
	})
}

exports.pmStrmdwDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmdw.findOne({_id: id}, (err, strmdw) => {
		if(err) {
			info = "user StrmdwDel, Strmdw.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmdw) {
			info = "此客户已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmdw.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user StrmdwDel, Strmdw.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/pmStrmdws");
				}
			})
		}
	})
}


exports.pmStrmdwNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmdw.findOne({firm: crUser.firm, nome: obj.nome}, (err, nomeSame)=> {
		if(err) {
			console.log(err);
			info = "pmer StrmdwNew, Strmdw.findOne, Error!";
			Err.usError(req, res, info);
		} else if(nomeSame) {
			info = "已经有此客户, 请查看";
			Err.usError(req, res, info);
		} else {
			let _strmdw = new Strmdw(obj)
			_strmdw.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加客户时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/pmStrmdw/'+objSave._id)
				}
			})
		}
	})
}


exports.pmStrmdwUpd = (req, res) => {
	let crUser = req.session.crUser;

	let obj = req.body.obj;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmdw.findOne({_id: obj._id, firm: crUser.firm}, (err, strmdw) => {
		if(err) {
			info = "更新客户时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!strmdw) {
			info = "此客户已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmdw.findOne({firm: crUser.firm, nome: obj.nome})
			.where('_id').ne(obj._id)
			.exec((err, nomeSame) => {
				if(err) {
					console.log(err);
					info = "更新客户时数据库查找出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else if(nomeSame) {
					info = "此名称已经存在, 请重试";
					Err.usError(req, res, info);
				} else {
					let _strmdw = _.extend(strmdw, obj)
					_strmdw.save((err, objSave) => {
						if(err) {
							info = "更新客户时数据库保存数据时出现错误, 请截图后, 联系管理员"
							Err.usError(req, res, info);
						} else {
							res.redirect("/pmStrmdw/"+objSave._id)
						}
					})
				}
			})
		}
	})
}
