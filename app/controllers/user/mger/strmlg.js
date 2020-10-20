const Err = require('../../aaIndex/err');

const Conf = require('../../../../conf');

const Strmlg = require('../../../models/firm/stream/strmlg');
const Buy = require('../../../models/firm/stream/buy');
const Firm = require('../../../models/login/firm');

const _ = require('underscore');

exports.mgStrmlgs = (req, res) => {
	let crUser = req.session.crUser;
	Strmlg.find({firm: crUser.firm})
	.exec((err, strmlgs) => {
		if(err) {
			console.log(err);
			info = "mger Strmlgs, Strmlg.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/strm/strmlg/list', {
				title: '运输公司列表',
				crUser,
				strmlgs
			})
		}
	})
}

exports.mgStrmlgAdd = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/mger/strm/strmlg/add', {
		title: '添加运输公司',
		crUser,
	})
}

exports.mgStrmlg = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id})
	.populate('firmUp')
	.exec((err, strmlg) => {
		if(err) {
			console.log(err);
			info = "mger StrmlgFilter, Strmlg.findOne, Error!";
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
					info = "mger StrmlgFilter, Strmlg.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.render('./user/mger/strm/strmlg/detail', {
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

exports.mgStrmlgUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id})
	.exec((err, strmlg) => {
		if(err) {
			console.log(err);
			info = "mger StrmlgFilter, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "这个运输公司已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/strm/strmlg/update', {
				title: '运输公司更新',
				crUser,
				strmlg,
			})
		}
	})
}

exports.mgStrmlgDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Strmlg.findOne({_id: id}, (err, strmlg) => {
		if(err) {
			info = "mger StrmlgDel, Strmlg.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!strmlg) {
			info = "此运输公司已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			Strmlg.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "mger StrmlgDel, Strmlg.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/mgStrmlgs");
				}
			})
		}
	})
}


exports.mgStrmlgNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Strmlg.findOne({firm: crUser.firm, code: obj.code}, (err, codeSame)=> {
		if(err) {
			console.log(err);
			info = "mger StrmlgNew, Strmlg.findOne, Error!";
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
					res.redirect('/mgStrmlg/'+objSave._id)
				}
			})
		}
	})
}


exports.mgStrmlgUpd = (req, res) => {
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
							res.redirect("/mgStrmlg/"+objSave._id)
						}
					})
				}
			})
		}
	})
}
