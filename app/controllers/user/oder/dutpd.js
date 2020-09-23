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
exports.odDutpds = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/oder/ordin/dutpd/list', {
		title: '销售订单',
		crUser,
	})
}

exports.odDutpd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.populate('ordin')
	.populate('brand').populate('pdfir').populate('pdsec').populate('pdthd')
	.populate('duter')
	.populate('cter')
	.populate('qutFirm').populate('strmup')
	.exec((err, dutpd) => {
		if(err) {
			console.log(err);
			info = "oder Dutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dutpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			// console.log(dutpd)
			res.render('./user/oder/ordin/dutpd/detail', {
				title: '销售订单详情',
				crUser,
				dutpd
			})
		}
	})
}
exports.odDutpdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, dutpd) => {
		if(err) {
			console.log(err);
			info = "oder Dutpd, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!dutpd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/oder/ordin/dutpd/update', {
				title: '销售订单修改',
				crUser,
				dutpd,
			})
		}
	})
}

exports.odDutpdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Compd.findOne({_id: id})
	.exec((err, compd) => {
		if(err) {
			console.log(err);
			info = "oder DutpdDel, Compd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!compd) {
			info = "这个销售订单已经被删除";
			Err.usError(req, res, info);
		} else {
			let photoDel = compd.photo;
			let sketchDel = compd.sketch;
			let dutId = compd.ordin;
			Compd.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user CompdDel, Compd.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect("/odDut/"+dutId);
				}
			})
		}
	})
}





exports.odDutpdUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	Compd.findOne({
		firm: crUser.firm,
		_id: obj._id
	}, (err, compd) => {
		if(err) {
			console.log(err);
			info = "oder DutpdUpd, Strmup.findOne, Error!"
			Err.usError(req, res, info);
		} else if(!compd) {
			info = '此销售订单已经被删除, 请刷新查看';
			Err.usError(req, res, info);
		} else {
			if(!obj.brand || obj.brand.length < 20) obj.brand = null;
			if(!obj.pdfir || obj.pdfir.length < 20) obj.pdfir = null;
			if(!obj.pdsec || obj.pdsec.length < 20) obj.pdsec = null;
			if(!obj.pdthd || obj.pdthd.length < 20) obj.pdthd = null;
			let photoDel = sketchDel = null;
			if(obj.pdfir || (obj.firNome != compd.firNome)) {
				obj.photo = '';
				photoDel = compd.photo;
			}
			if(obj.pdsec || (obj.secNome != compd.secNome)) {
				obj.sketch = '';
				sketchDel = compd.sketch;
			}
			let _compd = _.extend(compd, obj);
			_compd.save((err, objSave) => {
				if(err) {
					info = "添加销售订单时 数据库保存错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(photoDel, Conf.picPath.compd);
					MdPicture.deletePicture(sketchDel, Conf.picPath.compd);
					res.redirect('/odDutpd/'+objSave._id)
				}
			})
		}
	})
}
exports.odDutOptpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	let dutId = obj.dutId
	let inquotId = obj.inquotId
	let compdId = obj.compdId
	Ordin.findOne({_id: dutId}, (err, dut) => {
		if(err) {
			console.log(err);
			info = "oder Dut option pd, Ordin.findOne, Error!"
			Err.usError(res, req, info);
		} else if(!dut) {
			info = "操作错误, 没有找到采购单, 请刷新页面重试"
			Err.usError(res, req, info);
		} else {
			// console.log(dut)
			Inquot.findOne({_id: inquotId}, (err, qun) => {
				if(err) {
					console.log(err);
					info = "oder Dut option pd, Inquot.findOne, Error!"
					Err.usError(res, req, info);
				} else if(!qun) {
					info = "操作错误, 没有找到询价单, 请刷新页面重试"
					Err.usError(res, req, info);
				} else {
					// console.log(qun)
					Compd.findOne({_id: compdId}, (err, qunpd) => {
						if(err) {
							console.log(err);
							info = "oder Dut option pd, Compd.findOne, Error!"
							Err.usError(res, req, info);
						} else if(!qunpd) {
							info = "操作错误, 没有找到询价单商品, 请刷新页面重试"
							Err.usError(res, req, info);
						} else {
							// console.log(qunpd)
							let compdObj = new Object();

							compdObj.compd = qunpd._id;
							compdObj.ordin = dutId;
							if(qunpd.firm) compdObj.firm = qunpd.firm;
							if(qunpd.cter) compdObj.cter = qunpd.cter;
							compdObj.cterNome = qunpd.cterNome;
							if(qunpd.strmup) compdObj.strmup = qunpd.strmup;
							if(qunpd.qutFirm) compdObj.firm = qunpd.qutFirm;
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
									info = "oder Dut option pd, _compd.save, Error!"
									Err.usError(res, req, info);
								} else {
									qunpd.shelf = 1
									qunpd.save((err, qunpdSave) => {
										if(err) console.log(err);
										res.redirect("/odQunGenDut?inquotId="+inquotId+"&ordinId="+dutId)
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