const Err = require('../../aaIndex/err');

const MdPicture = require('../../../middle/middlePicture');
const Conf = require('../../../../conf');

const Ordin = require('../../../models/firm/ord/ordin');

const Inquot = require('../../../models/firm/ord/inquot');
const Compd = require('../../../models/firm/ord/compd');

const Strmup = require('../../../models/firm/stream/strmup');
const Strmdw = require('../../../models/firm/stream/strmdw');
const User = require('../../../models/login/user');

const _ = require('underscore');

// 销售订单
exports.slDinpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/sler/ordin/dinpd/list', {
		title: '销售订单',
		crUser,
	})
}

exports.slDinpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('ordin')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('diner')
	.populate('cter')
	.populate('qutFirm').populate('nstrmup')
	.exec((err, dinpd) => {
		if(err) {
			console.log(err);
			info = "sler Dinpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dinpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dinpd)
			res.render('./user/sler/ordin/dinpd/detail', {
				title: '销售订单详情',
				crUser,
				dinpd
			})
		}
	})
}
exports.slDinpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, dinpd) => {
		if(err) {
			console.log(err);
			info = "sler Dinpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dinpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/sler/ordin/dinpd/update', {
				title: '销售订单修改',
				crUser,
				dinpd,
			})
		}
	})
}

exports.slDinpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sler DinpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			let photoDel = compd.photo;
			let sketchDel = compd.sketch;
			let dinId = compd.ordin;
			Compd.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user CompdDel, Compd.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect("/slDin/"+dinId);
				}
			})
		}
	})
}





exports.slDinpdUpdAjax = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	})
	.populate('ordin')
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "sler DinpdUpd, Strmup.findOne, Error!"
			Err.jsonErr(req, res, info);
		} else if(!compd) {
			info = 'sler DinpdUpdAjax 此产品已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(!compd.ordin) {
			info = 'sler DinpdUpdAjax 此产品所属销售订单已经被删除, 请截图后, 联系管理员';
			Err.jsonErr(req, res, info);
		} else if(compd.ordin.status != Conf.status.init.num) {
			info = 'sler DinpdUpdAjax 此产品所属销售订单状态已经改变, 价格不可更改';
			Err.jsonErr(req, res, info);
		} else {
			if(obj.dinPr) obj.dinPr = parseFloat(obj.dinPr);
			if(isNaN(obj.dinPr)) {
				info = '销售价格输入有误, 请仔细查看, 请刷新查看';
				Err.jsonErr(req, res, info);
			} else {
				let _compd = _.extend(compd, obj);
				_compd.save((err, objSave) => {
					if(err) {
						info = "添加销售订单时 数据库保存错误, 请截图后, 联系管理员";
						Err.jsonErr(req, res, info);
					} else {
						res.json({
							status: 1,
							msg: '',
							data: {
							}
						});
					}
				})
			}
		}
	})
}
exports.slDinOptpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	let dinId = obj.dinId
	let inquotId = obj.inquotId
	let compdId = obj.compdId
	Ordin.findOne({_id: dinId}, (err, din) => {
		if(err) {
			console.log(err);
			info = "sler Din option pd, Ordin.findOne, Error!"
			Err.usError(res, req, info);
		} else if(!din) {
			info = "操作错误, 没有找到采购单, 请刷新页面重试"
			Err.usError(res, req, info);
		} else {
			// console.log(din)
			Inquot.findOne({_id: inquotId}, (err, qun) => {
				if(err) {
					console.log(err);
					info = "sler Din option pd, Inquot.findOne, Error!"
					Err.usError(res, req, info);
				} else if(!qun) {
					info = "操作错误, 没有找到询价单, 请刷新页面重试"
					Err.usError(res, req, info);
				} else {
					// console.log(qun)
					Compd.findOne({_id: compdId}, (err, qunpd) => {
						if(err) {
							console.log(err);
							info = "sler Din option pd, Compd.findOne, Error!"
							Err.usError(res, req, info);
						} else if(!qunpd) {
							info = "操作错误, 没有找到询价单商品, 请刷新页面重试"
							Err.usError(res, req, info);
						} else {
							// console.log(qunpd)
							let compdObj = new Object();

							compdObj.compd = qunpd._id;
							compdObj.ordin = dinId;
							if(qunpd.firm) compdObj.firm = qunpd.firm;
							if(qunpd.cter) compdObj.cter = qunpd.cter;
							compdObj.cterNome = qunpd.cterNome;
							if(qunpd.nstrmup) compdObj.nstrmup = qunpd.nstrmup;
							if(qunpd.qutFirm) compdObj.dutFirm = qunpd.qutFirm;
							if(qunpd.tstrmdw) compdObj.tstrmdw = qunpd.tstrmdw;
							if(qunpd.tstrmup) compdObj.tstrmup = qunpd.tstrmup;
							if(qunpd.brand) compdObj.brand = qunpd.brand;
							if(qunpd.brandNome) compdObj.brandNome = qunpd.brandNome;
							if(qunpd.pdfir) compdObj.pdfir = qunpd.pdfir;
							if(qunpd.firNome) compdObj.firNome = qunpd.firNome;
							if(qunpd.photo) compdObj.photo = qunpd.photo;
							if(qunpd.pdsec) compdObj.pdsec = qunpd.pdsec;
							if(qunpd.secNome) compdObj.secNome = qunpd.secNome;
							if(qunpd.sketch) compdObj.sketch = qunpd.sketch;
							if(qunpd.pdthd) compdObj.pdthd = qunpd.pdthd;
							if(qunpd.thdNome) compdObj.thdNome = qunpd.thdNome;

							if(qunpd.price) compdObj.price = parseFloat(qunpd.price);
							compdObj.quant = parseInt(obj.quant);

							_compd = new Compd(compdObj)
							_compd.save((err, pdSave) => {
								if(err) {
									console.log(err);
									info = "sler Din option pd, _compd.save, Error!"
									Err.usError(res, req, info);
								} else {
									qunpd.shelf = 1
									qunpd.save((err, qunpdSave) => {
										if(err) console.log(err);
										res.redirect("/slQunGenDin?inquotId="+inquotId+"&ordinId="+dinId)
									})
								}
							})
						}
					})
				}
			})
		}
	})
}