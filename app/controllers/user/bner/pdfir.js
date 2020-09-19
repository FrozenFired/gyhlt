let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Pdfir = require('../../../models/firm/pd/pdfir');
let Brand = require('../../../models/firm/brand');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.bnPdfirs = (req, res) => {
	let crUser = req.session.crUser;
	// Pdfir.find({})
	// .exec((err, pdfirs) => {
	// 	console.log(pdfirs)
	// 	// pdfirSave(pdfirs, 0)
	// })
	Firm.findOne({_id: crUser.firm})
	.exec((err, firm) => {
		if(err) {
			console.log(err);
			info = "user Pdfirs, Pdfir.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息错误, 请重试";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdfir/list', {
				title: '产品系列',
				crUser,
				firm
			})
		}
	})
}
// let pdfirSave = function(pdfirs, n) {
// 	if(n == pdfirs.length) return;
// 	let pdfir = pdfirs[n];
// 	pdfir.pdnome = pdfir.pdnomes[0];
// 	pdfir.save(function(err, firSave) {
// 		if(err) console.log(err);
// 		pdfirSave(pdfirs, n+1);
// 	})
// }
exports.bnPdfirsUpPdnomeForce = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/pdfir/upPdnomeForce', {
		title: '品类的批量修改',
		crUser,
	})
}
exports.bnPdfirsUpdPdnomeForce = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.val = obj.val.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	// console.log(obj)
	// console.log('-----------------')
	Pdfir.updateMany({
		firm: crUser.firm,
		pdnome: obj.pdnome
	}, {
		pdnome: obj.val
	},(err, pdfirs) => {
		if(err) {
			console.log(err);
			info = "user PdfirFilter, Pdfir.findOne, Error!";
			Err.usError(req, res, info);
		} else {
			// console.log(pdfirs)
			res.redirect('/bner')
		}
	})
}

exports.bnPdfir = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdfir.findOne({_id: id})
	.populate('brand')
	.exec((err, pdfir) => {
		if(err) {
			console.log(err);
			info = "user PdfirFilter, Pdfir.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdfir) {
			info = "这个系列已经被删除";
			Err.usError(req, res, info);
		} else if(!pdfir.brand) {
			info = "这个系列的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdfir/detail', {
				title: '系列详情',
				crUser,
				pdfir
			})
		}
	})
}

exports.bnPdfirUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdfir.findOne({_id: id})
	.populate('brand')
	.exec((err, pdfir) => {
		if(err) {
			console.log(err);
			info = "user PdfirFilter, Pdfir.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdfir) {
			info = "这个系列已经被删除";
			Err.usError(req, res, info);
		} else if(!pdfir.brand){
			info = "这个系列的品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/pdfir/update', {
				title: '系列更新',
				crUser,
				pdfir,
			})
		}
	})
}

exports.bnPdfirDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Pdfir.findOne({_id: id}, (err, pdfir) => {
		if(err) {
			info = "user PdfirDel, Pdfir.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!pdfir) {
			info = "此系列已经被删除，请刷新查看";
			Err.usError(req, res, info);
		} else {
			let brandId = pdfir.brand;
			let picDel = pdfir.photo;
			MdPicture.deletePicture(picDel, Conf.picPath.pdfir);
			Pdfir.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "user PdfirDel, Pdfir.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect("/bnBrand/"+brandId);
				}
			})
		}
	})
}


exports.bnPdfirNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	// obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let picNew = obj.picture;
	if(obj.picture) obj.photo = obj.picture;
	if(!obj.photo) obj.photo = Conf.picDefault.pdfir;
	let _pdfir = new Pdfir(obj)
	_pdfir.save((err, objSave) => {
		if(err) {
			console.log(err);
			MdPicture.deletePicture(picNew, Conf.picPath.pdfir);
			info = "添加系列时 数据库保存错误, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			if(obj.reUrl) {
				res.redirect(obj.reUrl);
			} else {
				res.redirect('/bnBrand/'+obj.brand)
			}
		}
	})
}


exports.bnPdfirUpd = (req, res) => {
	let obj = req.body.obj
	obj.code = obj.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let picNew = obj.picture;
	if(obj.picture) obj.photo = obj.picture;
	Pdfir.findOne({_id: obj._id}, (err, pdfir) => {
		if(err) {
			MdPicture.deletePicture(picNew, Conf.picPath.pdfir);
			info = "更新系列时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!pdfir) {
			MdPicture.deletePicture(picNew, Conf.picPath.pdfir);
			info = "此系列已经被删除，请刷新查看";
			Err.usError(req, res, info);
		} else {
			let picDel = null;
			if(obj.post != pdfir.post) {
				picDel = pdfir.post;
			}
			let _pdfir = _.extend(pdfir, obj)
			_pdfir.save((err, objSave) => {
				if(err) {
					MdPicture.deletePicture(picNew, Conf.picPath.pdfir);
					info = "更新系列时数据库保存数据时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picDel, Conf.picPath.pdfir);
					res.redirect("/bnPdfir/"+objSave._id)
				}
			})
		}
	})
}
