let Err = require('../../aaIndex/err');

let Conf = require('../../../../conf');

let Pdthd = require('../../../models/firm/pd/pdthd');
let Pdsec = require('../../../models/firm/pd/pdsec');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');


exports.bnPdthd = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdthd.findOne({_id: id})
	.populate('pdsec')
	.exec((err, pdthd) => {
		if(err) {
			console.log(err);
			info = "user PdthdFilter, Pdthd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdthd) {
			info = "这个产品已经被删除";
			Err.usError(req, res, info);
		} else if(!pdthd.pdsec) {
			info = "这个产品的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdthd/detail', {
				title: '产品详情',
				crUser,
				pdthd
			})
		}
	})
}

exports.bnPdthdUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdthd.findOne({_id: id})
	.populate('pdsec')
	.exec((err, pdthd) => {
		if(err) {
			console.log(err);
			info = "user PdthdFilter, Pdthd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdthd) {
			info = "这个产品已经被删除";
			Err.usError(req, res, info);
		} else if(!pdthd.pdsec){
			info = "这个产品的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdthd/update', {
				title: '产品更新',
				crUser,
				pdthd,
			})
		}
	})
}

exports.bnPdthdDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdthd.findOne({_id: id}, (err, pdthd) => {
		if(err) {
			info = "user PdthdDel, Pdthd.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdthd) {
			info = "此产品已经被删除，请刷新查看";
			Err.usError(req, res, info);
		} else {
			let pdsecId = pdthd.pdsec;
			Pdthd.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user PdthdDel, Pdthd.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnPdsec/"+pdsecId);
				}
			})
		}
	})
}


exports.bnPdthdNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	
	Pdsec.findOne({firm: crUser.firm,_id: obj.pdsec}, (err, pdsec) => {
		if(err) {
			console.log(err);
			info = "操作错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if (!pdsec) {
			info = "没有找到该产品, 请刷新重试";
			Err.usError(req, res, info);
		} else {
			obj.firm = crUser.firm;
			obj.brand = pdsec.brand;
			obj.pdfir = pdsec.pdfir;
			obj.price = parseFloat(obj.price);
			if(!obj.code) {
				info = "请输入产品价格编号";
				Err.usError(req, res, info);
			} else if(isNaN(obj.price)) {
				info = "价格输入错误";
				Err.usError(req, res, info);
			} else {
				obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
				let _pdthd = new Pdthd(obj)
				_pdthd.save((err, objSave) => {
					if(err) {
						info = "添加产品时 数据库保存错误, 请截图后, 联系管理员";
						Err.usError(req, res, info);
					} else {
						if(obj.reUrl) {
							res.redirect(obj.reUrl);
						} else {
							res.redirect('/bnPdsec/'+obj.pdsec)
						}
					}
				})
			}
		}
	})
}


exports.bnPdthdUpd = (req, res) => {
	let crUser = req.session.crUser;

	let obj = req.body.obj
	obj.price = parseFloat(obj.price);
	if(obj.code) obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(isNaN(obj.price)) {
		info = "价格输入错误";
		Err.usError(req, res, info);
	} else {
		Pdthd.findOne({firm: crUser.firm, _id: obj._id}, (err, pdthd) => {
			if(err) {
				info = "更新产品时数据库查找出现错误, 请截图后, 联系管理员"
				Err.usError(req, res, info);
			} else if(!pdthd) {
				info = "此产品已经被删除，请刷新查看";
				Err.usError(req, res, info);
			} else {

				// console.log(obj)
				let _pdthd = _.extend(pdthd, obj)
				// console.log(_pdthd)
				_pdthd.save((err, objSave) => {
					if(err) {
						info = "更新产品时数据库保存数据时出现错误, 请截图后, 联系管理员"
						Err.usError(req, res, info);
					} else {
						res.redirect("/bnPdthd/"+objSave._id)
					}
				})
			}
		})
	}
}
