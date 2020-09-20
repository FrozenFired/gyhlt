const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const User = require('../../../models/login/user');

const _ = require('underscore');

const moment = require('moment');
const xl = require('excel4node');

// 报价单
exports.mgQuts = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/mger/inquot/qut/list', {
		title: '报价单',
		crUser,
	})
}

exports.mgQut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	// .populate('firm')
	.populate('quner')
	.populate('quter')
	.populate('strmup')
	.populate({
		path: 'compds',
		options: { sort: { 'qntpdSts': 1 } },
		populate: [
			{path: 'brand'},
			{path: 'pdfir'},
			{path: 'pdsec'},
			{path: 'pdthd'},

			{path: 'strmup'},
			{path: 'quner'},
			{path: 'quter'},
		]
	})
	.exec((err, qut) => {
		if(err) {
			console.log(err);
			info = "mger Qut, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qut) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qut)
			let qutpds = qut.compds;
			User.find({
				firm: crUser.firm,
				$or:[
					{'role': {"$in": Conf.roleAdmin}},
					{'role': {"$eq": Conf.roleUser.quotation.num}},
				]
			})
			.sort({'role': -1})
			.exec((err, quters) => {
				if(err) {
					console.log(err);
					info = 'mger QutAdd, User.find, Error!';
					Err.usError(req, res, info);
				} else {
					Strmup.find({
						firm: crUser.firm,
					})
					.sort({'role': -1})
					.exec((err, strmups) => {
						if(err) {
							console.log(err);
							info = 'mger QutAdd, Strmup.find, Error!';
							Err.usError(req, res, info);
						} else {
							res.render('./user/mger/inquot/qut/detail', {
								title: '报价单详情',
								crUser,

								qut,
								qutpds,
								quters,
								strmups,
							})
						}
					})
				}
			})
		}
	})
}
exports.mgQutUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Inquot.findOne({_id: id})
	.exec((err, qut) => {
		if(err) {
			console.log(err);
			info = "mger Qut, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qut) {
			info = "此报价单已经被删除";
			Err.usError(req, res, info);
		} else if(qut.status == Conf.status.init.num){
			info = "此报价单, 您无权查看";
			Err.usError(req, res, info);
		} else {
			User.find({
				firm: crUser.firm,
				$or:[
					{'role': {"$in": Conf.roleAdmin}},
					{'role': {"$eq": Conf.roleUser.quotation.num}},
				]
			})
			.sort({'role': -1})
			.exec((err, quters) => {
				if(err) {
					console.log(err);
					info = 'mger QutAdd, User.find, Error!';
					Err.usError(req, res, info);
				} else {
					res.render('./user/mger/inquot/qut/update', {
						title: '报价单修改',
						crUser,
						qut,

						quters
					})
				}
			})
		}
	})
}
exports.mgQutDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = "mger QutDel, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			if(inquot.compds.length > 0) {
				info = "安全起见, 请先删除此单中的报价货物!";
				Err.usError(req, res, info);
			} else {
				Inquot.deleteOne({_id: id}, (err, objRm) => {
					if(err) {
						info = "user InquotDel, Inquot.deleteOne, Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect("/mgQuts");
					}
				})
			}
		}
	})
}








exports.mgQutUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Inquot.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, inquot) => {
		if(err) {
			console.log(err);
			info = "mger QutUpd, Inquot.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			mgerQuterSel(req, res, obj, inquot);
		}
	})
}
let mgerQuterSel = (req, res, obj, inquot) => {
	if(String(inquot.quter) == String(obj.quter)) {
		// 如果是更新， 则判断如果 quter 没有变化, 则跳过此步骤
		mgerStrmupSel(req, res, obj, inquot);
	} else if(!obj.quter) {
		obj.quter = inquot.quter;
		mgerStrmupSel(req, res, obj, inquot);
	} else {
		if(obj.quter == "null") obj.quter = null;
		Compd.updateMany({
			_id: inquot.compds,
			quter: inquot.quter
		}, {
			quter: obj.quter
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "mger QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				mgerStrmupSel(req, res, obj, inquot);
			}
		})
	}
}
let mgerStrmupSel = (req, res, obj, inquot) => {
	if(inquot && (String(inquot.strmup) == String(obj.strmup))) {
		// 如果是更新， 则判断如果 strmup 没有变化, 则跳过此步骤
		mgerqutSave(req, res, obj, inquot);
	} else if(!obj.strmup) {
		obj.strmup = inquot.strmup;
		mgerqutSave(req, res, obj, inquot);
	} else {
		if(obj.strmup == "null") obj.strmup = null;
		Compd.updateMany({
			_id: inquot.compds,
			strmup: inquot.strmup
		}, {
			strmup: obj.strmup
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "mger QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				mgerqutSave(req, res, obj, inquot);
			}
		})
	}
}
let mgerqutSave = (req, res, obj, inquot) => {
	let _inquot = Object();
	if(inquot) {
		_inquot = _.extend(inquot, obj)
	} else {
		_inquot = new Inquot(obj)
	}
	_inquot.save((err, objSave) => {
		if(err) {
			console.log(err);
			info = "添加报价单时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			res.redirect('/mgQut/'+objSave._id)
		}
	})
}