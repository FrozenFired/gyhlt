let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Brand = require('../../../models/firm/brand');
let Pdfir = require('../../../models/firm/pd/pdfir');
let Firm = require('../../../models/login/firm');

let Buy = require('../../../models/firm/stream/buy');
let Sell = require('../../../models/firm/stream/sell');

let _ = require('underscore');

exports.bnBrands = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/brand/list', {
		title: 'Brand List',
		crUser,
	});
}

exports.bnBrandAdd = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./user/bner/brand/add', {
		title: '添加新品牌',
		crUser
	})
}

exports.bnBrandNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	// obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
	obj.nome = obj.nome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	obj.firm = crUser.firm;
	
	let picNew = obj.picture;
	if(obj.picture) obj.logo = obj.picture;
	// Brand.findOne({code: obj.code}, (err, codeSame) => {
	// 	if(err) {
	// 		MdPicture.deletePicture(picNew, Conf.picPath.brand);
	// 		info = "添加品牌时 数据库查找错误, 请截图后, 联系管理员";
	// 		Err.usError(req, res, info);
	// 	} else if(codeSame) {
	// 		MdPicture.deletePicture(picNew, Conf.picPath.brand);
	// 		info = "此品牌帐号已经存在";
	// 		Err.usError(req, res, info);
	// 	} else {
			Brand.findOne({nome: obj.nome}, (err, nomeSame) => {
				if(err) {
					MdPicture.deletePicture(picNew, Conf.picPath.brand);
					info = "添加品牌时 数据库查找错误, 请截图后, 联系管理员";
					Err.usError(req, res, info);
				} else if(nomeSame) {
					MdPicture.deletePicture(picNew, Conf.picPath.brand);
					info = "此品牌名称已经存在";
					Err.usError(req, res, info);
				} else {
					let _brand = new Brand(obj)
					_brand.save((err, objSave) => {
						if(err) {
							MdPicture.deletePicture(picNew, Conf.picPath.brand);
							info = "添加品牌时 数据库保存错误, 请截图后, 联系管理员";
							Err.usError(req, res, info);
						} else {
							res.redirect('/bnBrands')
						}
					})
				}
			})
	// 	}
	// })
}


exports.bnBrand = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Brand.findOne({_id: id, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			info = "bner Brands, Brand.find(), Error!";
			Err.usError(req, res, info);
		} else if(!brand){
			info = "数据库中找不到此品牌";
			Err.usError(req, res, info);
		}else {
			Buy.find({firm: crUser.firm, brand: id})
			.populate('strmup')
			.exec((err, buys) => {
				if(err) {
					console.log(err);
					info = "user StrmupFilter, Strmup.findOne, Error!";
					Err.usError(req, res, info);
				} else {
					Sell.find({firm: crUser.firm, brand: id})
					.populate('strmdw')
					.exec((err, sells) => {
						if(err) {
							console.log(err);
							info = "user StrmupFilter, Strmup.findOne, Error!";
							Err.usError(req, res, info);
						} else {
							res.render('./user/bner/brand/detail', {
								title: 'Brand Info',
								crUser,

								brand,
								buys,
								sells
							});
						}
					})
				}
			})
		}
	})
}
exports.bnBrandUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Brand.findOne({_id: id, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			info = "bner Brands, Brand.find(), Error!";
			Err.usError(req, res, info);
		} else if(!brand){
			info = "数据库中找不到此品牌";
			Err.usError(req, res, info);
		}else {
			let updatePug = "update";
			if(req.query.force == 1) updatePug = "updateForce";
			res.render('./user/bner/brand/'+updatePug, {
				title: 'Brand Info',
				crUser,

				brand,
			});
		}
	})
}
exports.bnBrandDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;
	Pdfir.findOne({brand: id})
	.exec((err, pdfir) => {
		if(err) {
			info = "bner BrandDel, Pdfir.find(), Error!";
			Err.usError(req, res, info);
		} else if(pdfir){
			info = "请先删除品牌下的所有产品";
			Err.usError(req, res, info);
		}else {
			Brand.deleteOne({_id: id}, (err, brandDel) => {
				if(err) {
					console.log(err);
					info = "Brand.deleteOne";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bnBrands');
				}
			})
		}
	})
}

exports.bnBrandUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	let picNew = obj.picture;
	if(obj.picture) obj.post = obj.picture;
	if(!obj.post) obj.post = Conf.picDefault.brand;

	Brand.findOne({_id: obj._id, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			console.log(err);
			MdPicture.deletePicture(picNew, Conf.picPath.brand);
			info = "bner BrandUpd, Brand.findOne, Error! ----- "+err;
			Err.usError(req, res, info);
		} else if(!brand) {
			MdPicture.deletePicture(picNew, Conf.picPath.brand);
			info = "公司没有此产品, 操作错误! ----- "+err;
			Err.usError(req, res, info);
		} else {
			info = null;
			if(obj.code && (obj.code != brand.code)) {
				info = "不允许在此更改品牌名称, 请点击到强制更新页面更新"
			} else if(obj.logo && (obj.logo != brand.logo)) {
				info = "不允许在此更改品牌logo, 请点击到强制更新页面更新"
			} else if(obj.shelf && (obj.shelf != brand.shelf)) {
				info = "不允许在此更改品牌上下架, 请点击到强制更新页面更新"
			}
			let picDel = null;
			if(obj.post != brand.post) {
				picDel = brand.post;
			}
			let _brand = _.extend(brand, obj)
			// console.log(_brand)
			_brand.save((err, objSave) => {
				if(err) {
					MdPicture.deletePicture(picNew, Conf.picPath.brand);
					info = "更新品牌时数据库保存数据时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picDel, Conf.picPath.brand);
					res.redirect("/bnBrand/"+brand._id)
				}
			})
		}
	})
}
exports.bnBrandUpdForce = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;

	let picNew = obj.picture;
	if(obj.picture) obj.logo = obj.picture;
	if(!obj.logo) obj.logo = Conf.picDefault.brand;

	Brand.findOne({_id: obj._id, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			console.log(err);
			MdPicture.deletePicture(picNew, Conf.picPath.brand);
			info = "bner BrandUpd, Brand.findOne, Error! ----- "+err;
			Err.usError(req, res, info);
		} else if(!brand) {
			MdPicture.deletePicture(picNew, Conf.picPath.brand);
			info = "公司没有此产品, 操作错误! ----- "+err;
			Err.usError(req, res, info);
		} else {
			Brand.findOne({nome: obj.nome, firm: crUser.firm})
			.where('_id').ne(obj._id)
			.exec((err, nomeSame) => {
				if(err) {
					console.log(err);
					MdPicture.deletePicture(picNew, Conf.picPath.brand);
					info = "更新品牌时数据库查找相同名称时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else if(nomeSame) {
					MdPicture.deletePicture(picNew, Conf.picPath.brand);
					info = "已经有这个名字的品牌"
					Err.usError(req, res, info);
				} else {
					if(obj.shelf != brand.shelf) {
						bnerBrandShelfPdfirs(brand._id, obj.shelf)
					}
					let picDel = null;
					if(obj.logo != brand.logo) {
						picDel = brand.logo;
					}
					let _brand = _.extend(brand, obj)
					// console.log(_brand)
					_brand.save((err, objSave) => {
						if(err) {
							MdPicture.deletePicture(picNew, Conf.picPath.brand);
							info = "更新品牌时数据库保存数据时出现错误, 请截图后, 联系管理员"
							Err.usError(req, res, info);
						} else {
							MdPicture.deletePicture(picDel, Conf.picPath.brand);
							res.redirect("/bnBrand/"+brand._id)
						}
					})
				}
			})
		}
	})
}
var bnerBrandShelfPdfirs = (brandId, shelf) => {
	Pdfir.updateMany({
		brand: brandId
	}, {
		shelf: shelf
	},(err, pdfirs) => {
		if(err) {
			console.log(err);
		}
	})
}

exports.bnBrandPdnomeNew = (req, res) => {
	let crUser = req.session.crUser;
	let brandId = req.body.id;
	let pdnomeNew = req.body.pdnome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Brand.findOne({_id: brandId, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			console.log(err);
			info = "bner BrandPdnomeNew, Brand.findOne(), Error!";
			Err.usError(req, res, info);
		} else if(!brand) {
			info = "本公司没有此品牌!";
			Err.usError(req, res, info);
		} else {
			let pdnomes = brand.pdnomes;
			let i=0;
			for(; i<pdnomes.length; i++) {
				let pdnome = pdnomes[i];
				if(pdnome == pdnomeNew) {
					break;
				}
			}
			if(i != pdnomes.length) {
				info = "此品牌中已经存在 ["+pdnomeNew+"]";
				Err.usError(req, res, info);
			} else {
				pdnomes.unshift(pdnomeNew)
				brand.save((err, brandSave) => {
					if(err) {
						console.log(err);
						info = "保存错误, 请返回并刷新重试!";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bnBrand/'+brandId);
					}
				})
			}
		}
	})
}

exports.bnBrandPdnomeDelAjax = (req, res) => {
	let crUser = req.session.crUser;
	let brandId = req.query.id;
	let pdnomeDel = req.query.pdnome;
	Brand.findOne({_id: brandId, firm: crUser.firm})
	.exec((err, brand) => {
		if(err) {
			console.log(err);
			info = "bner BrandPdnomeDelAjax, Brand.findOne, Error! ----- "+err;
			Err.jsonErr(req, res, info);
		} else if(!brand) {
			info = "本公司没有此品牌"
			Err.jsonErr(req, res, info);
		} else {
			let pdnomes = brand.pdnomes;
			let i=0;
			for(; i<pdnomes.length; i++) {
				let pdnome = pdnomes[i];
				if(pdnome == pdnomeDel) {
					break;
				}
			}
			if(i == pdnomes.length) {
				info = "品牌中不存在此系列!";
				Err.jsonErr(req, res, info);
			} else {
				pdnomes.remove(pdnomeDel)
				brand.save((err, brandSave) => {
					if(err) {
						console.log(err);
						info = "bner BrandPdnomeDelAjax, brand.save, Error!";
						Err.jsonErr(req, res, info);
					} else {
						res.json({
							status: 1,
							msg: '',
							data: {}
						});
					}
				})
			}
		}
	})
}