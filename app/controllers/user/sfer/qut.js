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
exports.sfQuts = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/sfer/inquot/qut/list', {
		title: '报价单',
		crUser,
	})
}

exports.sfQut = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	// .populate('firm')
	.populate('cter')
	.populate('quner')
	.populate('quter')
	.populate('strmup')
	.populate({
		path: 'compds',
		options: { sort: {'qntpdSts': 1, 'qntnum': 1 } },
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
			info = "sfer Qut, Inquot.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qut) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qut)
			let qutpds = qut.compds;
			Strmup.find({
				firm: crUser.firm,
			})
			.sort({'role': -1})
			.exec((err, strmups) => {
				if(err) {
					console.log(err);
					info = 'sfer QutAdd, Strmup.find, Error!';
					Err.usError(req, res, info);
				} else {
					let brands = new Array();
					for(let i=0; i<qutpds.length; i++) {
						let qutpd = qutpds[i];
						let k=0;
						for(; k<brands.length; k++) {
							if(brands[k].brandNome == qutpd.brandNome) break;
						}
						if(k == brands.length) {
							let brand = new Object();
							brand.num = k+1;
							brand.brandNome = qutpd.brandNome;
							brands.push(brand)
						}
					}
					res.render('./user/sfer/inquot/qut/detail', {
						title: '报价单详情',
						crUser,

						qut,
						qutpds,
						strmups,
						brands
					})
				}
			})
		}
	})
}

exports.sfQutDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Inquot.findOne({_id: id})
	.exec((err, inquot) => {
		if(err) {
			console.log(err);
			info = "sfer QutDel, Inquot.findOne, Error!";
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
						res.redirect("/sfQuts");
					}
				})
			}
		}
	})
}



exports.sfQutUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Inquot.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, inquot) => {
		if(err) {
			console.log(err);
			info = "sfer QutUpd, Inquot.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!inquot) {
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			sferQuterSel(req, res, obj, inquot);
		}
	})
}
let sferQuterSel = (req, res, obj, inquot) => {
	if(String(inquot.quter) == String(obj.quter)) {
		// 如果是更新， 则判断如果 quter 没有变化, 则跳过此步骤
		sfercterSel(req, res, obj, inquot);
	} else if(!obj.quter) {
		obj.quter = inquot.quter;
		sfercterSel(req, res, obj, inquot);
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
				info = "sfer QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				sfercterSel(req, res, obj, inquot);
			}
		})
	}
}
let sfercterSel = (req, res, obj, inquot) => {
	if(String(inquot.cter) == String(obj.cter)) {
		// 如果是更新， 则判断如果 cter 没有变化, 则跳过此步骤
		sferStrmupSel(req, res, obj, inquot);
	} else if(!obj.cter) {
		obj.cter = inquot.cter;
		sferStrmupSel(req, res, obj, inquot);
	} else {
		if(obj.cter == "null") obj.cter = null;
		Compd.updateMany({
			_id: inquot.compds,
			cter: inquot.cter
		}, {
			cter: obj.cter
		},(err, compds) => {
			if(err) {
				console.log(err);
				info = "sfer cterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				sferStrmupSel(req, res, obj, inquot);
			}
		})
	}
}
let sferStrmupSel = (req, res, obj, inquot) => {
	if(inquot && (String(inquot.strmup) == String(obj.strmup))) {
		// 如果是更新， 则判断如果 strmup 没有变化, 则跳过此步骤
		sferqutSave(req, res, obj, inquot);
	} else if(!obj.strmup) {
		obj.strmup = inquot.strmup;
		sferqutSave(req, res, obj, inquot);
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
				info = "sfer QuterSel, Compd.find(), Error!";
				Err.usError(req, res, info);
			} else {
				sferqutSave(req, res, obj, inquot);
			}
		})
	}
}
let sferqutSave = (req, res, obj, inquot) => {
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
			res.redirect('/sfQut/'+objSave._id)
		}
	})
}