let Err = require('../../aaIndex/err');

let Conf = require('../../../../conf');

let Strmlg = require('../../../models/firm/stream/strmlg');
let Buy = require('../../../models/firm/stream/buy');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.lgStrmlgs = (req, res) => {
	let crUser = req.session.crUser;
	Strmlg.find({firm: crUser.firm})
	.exec((err, strmlgs) => {
		if(err) {
			console.log(err);
			info = "lger Strmlgs, Strmlg.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/lger/strm/strmlg/list', {
				title: '运输公司列表',
				crUser,
				strmlgs
			})
		}
	})
}

exports.lgStrmlgAdd = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/lger/strm/strmlg/add', {
		title: '添加运输公司',
		crUser,
	})
}

exports.lgStrmlg = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id})
	.populate('firmUp')
	.exec((err, strmlg) => {
		if(err) {
			console.log(err);
			info = "lger StrmlgFilter, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "这个运输公司已经被删除";
			Err.usError(req, res, info);
		} else {
			Buy.find({firm: crUser.firm, strmlg: id})
			.populate('brand')
			.exec((err, buys) => {
				if(err) {
					console.log(err);
					info = "lger StrmlgFilter, Strmlg.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/lger/strm/strmlg/detail', {
						title: '运输公司详情',
						crUser,

						strmlg,
						buys
					})
				}
			})
		}
	})
}

exports.lgStrmlgUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id})
	.exec((err, strmlg) => {
		if(err) {
			console.log(err);
			info = "lger StrmlgFilter, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "这个运输公司已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/lger/strm/strmlg/update', {
				title: '运输公司更新',
				crUser,
				strmlg,
			})
		}
	})
}

exports.lgStrmlgDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id}, (err, strmlg) => {
		if(err) {
			info = "lger StrmlgDel, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "此运输公司已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmlg.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "lger StrmlgDel, Strmlg.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/lgStrmlgs");
				}
			})
		}
	})
}


exports.lgStrmlgNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmlg.findOne({firm: crUser.firm, code: obj.code}, (err, codeSame)=> {
		if(err) {
			console.log(err);
			info = "lger StrmlgNew, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(codeSame) {
			info = "已经有此运输公司, 请查看";
			Err.usError(req, res, info);
		} else {
			let _strmlg = new Strmlg(obj)
			_strmlg.save((err, objSave) => {
				if(err) {
					console.log(err);
					info = "添加运输公司时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/lgStrmlg/'+objSave._id)
				}
			})
		}
	})
}


exports.lgStrmlgUpd = (req, res) => {
	let crUser = req.session.crUser;

	let obj = req.body.obj;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmlg.findOne({_id: obj._id, firm: crUser.firm}, (err, strmlg) => {
		if(err) {
			info = "更新运输公司时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "此运输公司已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmlg.findOne({firm: crUser.firm, code: obj.code})
			.where('_id').ne(obj._id)
			.exec((err, codeSame) => {
				if(err) {
					console.log(err);
					info = "更新运输公司时数据库查找出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else if(codeSame) {
					info = "此名称已经存在, 请重试";
					Err.usError(req, res, info);
				} else {
					let _strmlg = _.extend(strmlg, obj)
					_strmlg.save((err, objSave) => {
						if(err) {
							info = "更新运输公司时数据库保存数据时出现错误, 请截图后, 联系管理员"
							Err.usError(req, res, info);
						} else {
							res.redirect("/lgStrmlg/"+objSave._id)
						}
					})
				}
			})
		}
	})
}
