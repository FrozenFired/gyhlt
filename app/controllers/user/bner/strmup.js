let Err = require('../../aaIndex/err');

let Conf = require('../../../../conf');

let Strmup = require('../../../models/firm/stream/strmup');
let Buy = require('../../../models/firm/stream/buy');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.bnStrmups = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/strmup/list', {
		title: '供应商列表',
		crUser,
	})
}

exports.bnStrmupAdd = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/strmup/add', {
		title: '添加供应商',
		crUser,
	})
}

exports.bnStrmup = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmup.findOne({_id: id})
	.populate('firmUp')
	.exec((err, strmup) => {
		if(err) {
			console.log(err);
			info = "user StrmupFilter, Strmup.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmup) {
			info = "这个供应商已经被删除";
			Err.usError(req, res, info);
		} else {
			Buy.find({firm: crUser.firm, strmup: id})
			.populate('brand')
			.exec((err, buys) => {
				if(err) {
					console.log(err);
					info = "user StrmupFilter, Strmup.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/bner/strmup/detail', {
						title: '供应商详情',
						crUser,

						strmup,
						buys
					})
				}
			})
		}
	})
}

exports.bnStrmupUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmup.findOne({_id: id})
	.exec((err, strmup) => {
		if(err) {
			console.log(err);
			info = "user StrmupFilter, Strmup.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmup) {
			info = "这个供应商已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/strmup/update', {
				title: '供应商更新',
				crUser,
				strmup,
			})
		}
	})
}

exports.bnStrmupDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmup.findOne({_id: id}, (err, strmup) => {
		if(err) {
			info = "user StrmupDel, Strmup.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmup) {
			info = "此供应商已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmup.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user StrmupDel, Strmup.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnStrmups");
				}
			})
		}
	})
}


exports.bnStrmupNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmup.findOne({firm: crUser.firm, nome: obj.nome}, (err, nomeSame)=> {
		if(err) {
			console.log(err);
			info = "bner StrmupNew, Strmup.findOne, Error!";
			Err.usError(req, res, info);
		} else if(nomeSame) {
			info = "已经有此供应商, 请查看";
			Err.usError(req, res, info);
		} else {
			let _strmup = new Strmup(obj)
			_strmup.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加供应商时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bnStrmup/'+objSave._id)
				}
			})
		}
	})
}


exports.bnStrmupUpd = (req, res) => {
	let crUser = req.session.crUser;

	let obj = req.body.obj;
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmup.findOne({_id: obj._id, firm: crUser.firm}, (err, strmup) => {
		if(err) {
			info = "更新供应商时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!strmup) {
			info = "此供应商已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmup.findOne({firm: crUser.firm, nome: obj.nome})
			.where('_id').ne(obj._id)
			.exec((err, nomeSame) => {
				if(err) {
					console.log(err);
					info = "更新供应商时数据库查找出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else if(nomeSame) {
					info = "此名称已经存在, 请重试";
					Err.usError(req, res, info);
				} else {
					let _strmup = _.extend(strmup, obj)
					_strmup.save((err, objSave) => {
						if(err) {
							info = "更新供应商时数据库保存数据时出现错误, 请截图后, 联系管理员"
							Err.usError(req, res, info);
						} else {
							res.redirect("/bnStrmup/"+objSave._id)
						}
					})
				}
			})
		}
	})
}
