let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Pdsec = require('../../../models/firm/pd/pdsec');
let Pdfir = require('../../../models/firm/pd/pdfir');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.bnPdsecs = (req, res) => {
	let crUser = req.session.crUser;

	Firm.findOne({_id: crUser.firm})
	.exec((err, firm) => {
		if(err) {
			console.log(err);
			info = "user Pdsecs, Pdsec.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息错误, 请重试";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdsec/list', {
				title: '产品系列',
				crUser,
				firm
			})
		}
	})
}

exports.bnPdsec = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdsec.findOne({_id: id})
	.populate('pdfir')
	.exec((err, pdsec) => {
		if(err) {
			console.log(err);
			info = "user PdsecFilter, Pdsec.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdsec) {
			info = "这个系列已经被删除";
			Err.usError(req, res, info);
		} else if(!pdsec.pdfir) {
			info = "这个系列的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdsec/detail', {
				title: '系列详情',
				crUser,
				pdsec
			})
		}
	})
}

exports.bnPdsecUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdsec.findOne({_id: id})
	.populate('pdfir')
	.exec((err, pdsec) => {
		if(err) {
			console.log(err);
			info = "user PdsecFilter, Pdsec.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdsec) {
			info = "这个系列已经被删除";
			Err.usError(req, res, info);
		} else if(!pdsec.pdfir){
			info = "这个系列的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdsec/update', {
				title: '系列更新',
				crUser,
				pdsec,
			})
		}
	})
}

exports.bnPdsecDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdsec.findOne({_id: id}, (err, pdsec) => {
		if(err) {
			info = "user PdsecDel, Pdsec.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdsec) {
			info = "此系列已经被删除，请刷新查看";
			Err.usError(req, res, info);
		} else {
			let pdfirId = pdsec.pdfir;
			let picDel = pdsec.photo;
			MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
			Pdsec.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user PdsecDel, Pdsec.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnPdfir/"+pdfirId);
				}
			})
		}
	})
}


exports.bnPdsecNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	let picDel = obj.picture;

	Pdfir.findOne({firm: crUser.firm,_id: obj.pdfir}, (err, pdfir) => {
		if(err) {
			console.log(err);
			if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
			info = "操作错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else if (!pdfir) {
			if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
			info = "没有找到该系列, 请刷新重试";
			Err.usError(req, res, info);
		} else {
			obj.firm = crUser.firm;
			obj.brand = pdfir.brand;
			obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();

			Pdsec.findOne({firm: crUser.firm, brand: pdfir.brand, code: obj.code}, (err, secSame) => {
				if(err) {
					console.log(err);
					if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
					info = "bner PdsecNew, Error!";
					Err.usError(req, res, info);
				} else if(secSame) {
					if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
					info = "此品牌下有相同的账号, 请仔细检查";
					Err.usError(req, res, info);
				} else {
					if(obj.picture) obj.photo = obj.picture;
					if(!obj.photo) obj.photo = Conf.picDefault.pdsec;
					let _pdsec = new Pdsec(obj)
					_pdsec.save((err, objSave) => {
						if(err) {
							if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
							info = "添加系列时 数据库保存错误, 请截图后, 联系管理员";
							Err.usError(req, res, info);
						} else {
							if(obj.reUrl) {
								res.redirect(obj.reUrl);
							} else {
								res.redirect('/bnPdfir/'+obj.pdfir)
							}
						}
					})
				}
			})
		}
	})
}


exports.bnPdsecUpd = (req, res) => {
	let crUser = req.session.crUser;

	let obj = req.body.obj
	obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
	let picDel = obj.picture;
	if(obj.picture) obj.photo = obj.picture;
	if(!obj.photo) obj.photo = Conf.picDefault.pdsec;
	// console.log(obj.photo)
	Pdsec.findOne({firm: crUser.firm, _id: obj._id}, (err, pdsec) => {
		if(err) {
			MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
			info = "更新系列时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!pdsec) {
			MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
			info = "此系列已经被删除，请刷新查看";
			Err.usError(req, res, info);
		} else {
			Pdsec.findOne({firm: crUser.firm, brand: pdsec.brand, code: obj.code})
			.where('_id').ne(obj._id)
			.exec((err, secSame) => {
				if(err) {
					console.log(err);
					if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
					info = "bner PdsecNew, Error!";
					Err.usError(req, res, info);
				} else if(secSame) {
					if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
					info = "此品牌下有相同的账号, 请仔细检查";
					Err.usError(req, res, info);
				} else {
					let picOld = null;
					if(obj.picture) picOld = pdsec.photo;

					// console.log(obj)
					let _pdsec = _.extend(pdsec, obj)
					// console.log(_pdsec)
					_pdsec.save((err, objSave) => {
						if(err) {
							if(picDel) MdPicture.deletePicture(picDel, Conf.picPath.pdsec);
							info = "更新系列时数据库保存数据时出现错误, 请截图后, 联系管理员"
							Err.usError(req, res, info);
						} else {
							if(picOld) MdPicture.deletePicture(picOld, Conf.picPath.pdsec);
							res.redirect("/bnPdsec/"+objSave._id)
						}
					})
				}
			})
		}
	})
}
