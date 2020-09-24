const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const User = require('../../../models/login/user');

const _ = require('underscore');

// 报价单
exports.qtQutpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/qter/inquot/qutpd/list', {
		title: '报价单',
		crUser,
	})
}

exports.qtQutpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('quter')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "qter Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(qutpd)
			res.render('./user/qter/inquot/qutpd/detail', {
				title: '报价单详情',
				crUser,
				qutpd
			})
		}
	})
}
exports.qtQutpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('inquot')
	.populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('ordin')
	.exec((err, qutpd) => {
		if(err) {
			console.log(err);
			info = "qter Qutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!qutpd) {
			info = "这个报价单已经被删除";
			Err.usError(req, res, info);
		} else if(qutpd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(qutpd.inquot.status != Conf.status.quoting.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			// console.log(qut)
			let roleQuoter = Conf.roleAdmin;
			roleQuoter.push(Conf.roleUser.quotation.num);
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
					info = 'qter QutAdd, User.find, Error!';
					Err.usError(req, res, info);
				} else {
					res.render('./user/qter/inquot/qutpd/update', {
						title: '报价单修改',
						crUser,
						qutpd,

						quters
					})
				}
			})
		}
	})
}




exports.qtQutpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, compd) => {
		if(err) {
			console.log(err);
			info = "qter QutpdUpdAjax, Compd.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = '此商品不存在, 请刷新查看';
			Err.jsonErr(req, res, info);
		} else {
			_compd = _.extend(compd, obj)
			_compd.save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = "qter QutpdUpdAjax, _compd.save, Error!"
					Err.jsonErr(req, res, info);
				} else {
					res.json({ status: 1, msg: '', data: { } })
				}
			})
		}
	})
}


exports.qtQutpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.qntupdAt = Date.now();
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('inquot')
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "qter QutpdUpd, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此报价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else if(compd.ordin) {
			info = "您现在无权修改此商品信息, 因为已经生成订单";
			Err.usError(req, res, info);
		} else if(compd.inquot.status != Conf.status.quoting.num) {
			info = "您现在无权修改此商品信息, 因为询价单状态已经被修改";
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			// 自动改变商品状态
			// if(obj.qntpdSts != Conf.status.del.num) {
			// 	if(obj.pdthd) {
			// 		obj.qntpdSts = Conf.status.done.num;
			// 	} else {
			// 		obj.qntpdSts = Conf.status.quoting.num;
			// 	}
			// }
			if(obj.images && compd.images) {
				for(let i=0; i<obj.images.length; i++) {
					if(compd.images.length>=i && !obj.images[i]) {
						obj.images[i] = compd.images[i];
					}
				}
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					console.log(err)
					info = "添加询价单时 qter QutpdUpd, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					res.redirect('/qtQut/'+objSave.inquot._id)
				}
			})
		}
	})
}
exports.qtQutpdDelPic = (req, res) => {
	let crUser = req.session.crUser;
	let compdId = req.body.compdId;
	let picField = req.body.picField;
	let subsp = req.body.subsp;
	Compd.findOne({
		_id: compdId,
		firm: crUser.firm
	})
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "qter QutpdDelPic, Compd.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此询价单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else if(!picField) {
			info = '操作错误, 请截图 联系管理员 qter QutpdDelPic';
			Err.usError(req, res, info);
		} else {
			let picDel = compd[picField];
			if(subsp) {
				picDel = compd[picField][subsp];
				// compd[picField][subsp] = '';
				compd.images.remove(picDel)
			} else {
				picDel = compd[picField];
				compd[picField] = '';
			}
			// return;
			compd.save((err, compdSave) => {
				if(err) {
					console.log(err);
					info = "qter QutpdDelPic, Compd.save, Error!"
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picDel, Conf.picPath.compd);
					res.redirect('/qtQut/'+compdSave.inquot)
				}
			})
		}
	})
}