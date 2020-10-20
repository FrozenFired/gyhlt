const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Brand = require('../../../models/firm/brand');
const Pdfir = require('../../../models/firm/pd/pdfir');
const Pdsec = require('../../../models/firm/pd/pdsec');
const Pdthd = require('../../../models/firm/pd/pdthd');

exports.usBrandsAjax = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	let nomeSymb = '$ne';
	let nomeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		nomeSymb = '$in';
		nomeCond = String(req.query.keyword);
		nomeCond = nomeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		nomeCond = new RegExp(nomeCond + '.*');
	}

	let shelfSymb = '$gt';
	let shelfConb = 0;
	if(crUser && crUser.role < Conf.roleUser.customer.num) {
		shelfSymb = '$ne';
		shelfConb = -1;
	}
	if(req.query.shelf && !isNaN(parseInt(req.query.shelf))) {
		shelfSymb = '$eq';
		shelfConb = parseInt(req.query.shelf)

		if((!crUser || (crUser.role == Conf.roleUser.customer.num)) && shelfConb == 0) {
			shelfSymb = '$gt';
		}
	}
	// console.log(shelfSymb)
	// console.log(shelfConb)
	let param = {
		// firm: firm._id,
		shelf: {[shelfSymb]: shelfConb},
		'nome': {[nomeSymb]: nomeCond},
	}
	Brand.countDocuments(param, (err, count) => {
		if(err) {
			info = "cter Brands, Brand.find(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Brand.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.exec((err, brands) => {
				if(err) {
					info = "cter Brands, Brand.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					// console.log(brands)
					res.json({
						status: 1,
						msg: '',
						data: {
							brands,
							count,
							page,
							isMore,
						}
					})
				}
			})
		}
	})
}

exports.usPdfirsAjax = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	let brandSymb = '$ne';
	let brandCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.brandId) {
		brandSymb = '$eq';
		brandCond = req.query.brandId;
	}

	let pdnomeSymb = '$ne';
	let pdnomeCond = 'rander[a`a。=]';
	if(req.query.pdnome) {
		pdnomeSymb = '$eq';
		pdnomeCond = req.query.pdnome;
	}

	let codeSymb = '$ne';
	let codeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		codeSymb = '$in';
		codeCond = String(req.query.keyword);
		codeCond = codeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeCond = new RegExp(codeCond + '.*');
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;
	if(!crUser || crUser.role == Conf.roleUser.customer.num) {
		shelfSymb = '$gt';
		shelfConb = 0;
	}
	if(req.query.shelf && !isNaN(parseInt(req.query.shelf))) {
		shelfSymb = '$eq';
		shelfConb = parseInt(req.query.shelf)

		if((!crUser || crUser.role == Conf.roleUser.customer.num) && shelfConb == 0) {
			shelfSymb = '$gt';
		}
	}

	let param = {
		firm: firm._id,
		shelf: {[shelfSymb]: shelfConb},

		brand: {[brandSymb]: brandCond},
		pdnome: {[pdnomeSymb]: pdnomeCond},
		'code': {[codeSymb]: codeCond},
	}
	Pdfir.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser PdfirsAjax, Pdfir.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Pdfir.find(param)
			.populate('brand')
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.exec((err, pdfirs) => {
				if(err) {
					info = "cter PdfirsAjax, Pdfir.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							pdfirs,
							count,
							page,
							isMore,
						}
					});
				}
			})
		}
	})
}

exports.usPdsecsAjax = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	let brandSymb = '$ne';
	let brandCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.brandId) {
		brandSymb = '$eq';
		brandCond = req.query.brandId;
	}

	let pdfirSymb = '$ne';
	let pdfirCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.pdfirId) {
		pdfirSymb = '$eq';
		pdfirCond = req.query.pdfirId;
	}

	let codeSymb = '$ne';
	let codeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		codeSymb = '$in';
		codeCond = String(req.query.keyword);
		codeCond = codeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeCond = new RegExp(codeCond + '.*');
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;
	if(!crUser || crUser.role == Conf.roleUser.customer.num) {
		shelfSymb = '$gt';
		shelfConb = 0;
	}
	if(req.query.shelf && !isNaN(parseInt(req.query.shelf))) {
		shelfSymb = '$eq';
		shelfConb = parseInt(req.query.shelf)

		if((!crUser || crUser.role == Conf.roleUser.customer.num) && shelfConb == 0) {
			shelfSymb = '$gt';
		}
	}

	let param = {
		firm: firm._id,
		shelf: {[shelfSymb]: shelfConb},

		brand: {[brandSymb]: brandCond},
		pdfir: {[pdfirSymb]: pdfirCond},
		'code': {[codeSymb]: codeCond},
	}
	Pdsec.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser PdsecsAjax, Pdsec.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Pdsec.find(param)
			.populate({path: 'pdfir', populate: {path: 'brand'}})
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.exec((err, pdsecs) => {
				if(err) {
					info = "cter PdsecsAjax, Pdsec.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							pdsecs,
							count,
							page,
							isMore,
						}
					});
				}
			})
		}
	})
}

exports.usPdthdsAjax = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	let brandSymb = '$ne';
	let brandCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.brandId) {
		brandSymb = '$eq';
		brandCond = req.query.brandId;
	}

	let pdfirSymb = '$ne';
	let pdfirCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.pdfirId) {
		pdfirSymb = '$eq';
		pdfirCond = req.query.pdfirId;
	}

	let pdsecSymb = '$ne';
	let pdsecCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.pdsecId) {
		pdsecSymb = '$eq';
		pdsecCond = req.query.pdsecId;
	}

	let codeSymb = '$ne';
	let codeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		codeSymb = '$in';
		codeCond = String(req.query.keyword);
		codeCond = codeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeCond = new RegExp(codeCond + '.*');
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;
	if(!crUser || crUser.role == Conf.roleUser.customer.num) {
		shelfSymb = '$gt';
		shelfConb = 0;
	}
	if(req.query.shelf && !isNaN(parseInt(req.query.shelf))) {
		shelfSymb = '$eq';
		shelfConb = parseInt(req.query.shelf)

		if((!crUser || crUser.role == Conf.roleUser.customer.num) && shelfConb == 0) {
			shelfSymb = '$gt';
		}
	}

	let param = {
		firm: firm._id,
		shelf: {[shelfSymb]: shelfConb},

		brand: {[brandSymb]: brandCond},
		pdfir: {[pdfirSymb]: pdfirCond},
		pdsec: {[pdsecSymb]: pdsecCond},
		code: {[codeSymb]: codeCond},
	}
	Pdthd.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser PdthdsAjax, Pdthd.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Pdthd.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.exec((err, pdthds) => {
				if(err) {
					info = "cter PdthdsAjax, Pdthd.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							pdthds,
							count,
							page,
							isMore,
						}
					});
				}
			})
		}
	})
}