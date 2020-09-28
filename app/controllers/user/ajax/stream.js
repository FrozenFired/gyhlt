let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Strmup = require('../../../models/firm/stream/strmup');
let Buy = require('../../../models/firm/stream/buy');
let Strmdw = require('../../../models/firm/stream/strmdw');
let Sell = require('../../../models/firm/stream/sell');

/* ============ 供应商 ============ */
exports.usStrmupsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 12;
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

	let categSymb = '$ne';
	let categCond = '-1';
	if(req.query.categ && !isNaN(parseInt(req.query.categ))) {
		categSymb = '$eq';
		categCond = parseInt(req.query.categ);
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;

	let param = {
		firm: crUser.firm,
		shelf: {[shelfSymb]: shelfConb},

		'nome': {[nomeSymb]: nomeCond},
		'categFirm': {[categSymb]: categCond},
	}

	Strmup.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser getdataAjax, Strmup.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Strmup.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
			.populate('firmUp')
			.exec((err, strmups) => {
				if(err) console.log(err);

				let isMore = 1;
				if(page*pagesize >= count) isMore = 0;
				res.json({
					status: 1,
					msg: '',
					data: {
						strmups,
						count,
						page,
						isMore,
					}
				});
			})
		}
	})
}

/* ============ 供应商折扣 ============ */
exports.usBuysAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 12;
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

	let categSymb = '$ne';
	let categCond = '-1';
	if(req.query.categ && !isNaN(parseInt(req.query.categ))) {
		categSymb = '$eq';
		categCond = parseInt(req.query.categ);
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;

	let param = {
		firm: crUser.firm,
		shelf: {[shelfSymb]: shelfConb},

		'nome': {[nomeSymb]: nomeCond},
		'categFirm': {[categSymb]: categCond},
	}

	Buy.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser getdataAjax, Buy.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Buy.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
			.populate('strmup')
			.populate('brand')
			.exec((err, buys) => {
				if(err) console.log(err);

				let isMore = 1;
				if(page*pagesize >= count) isMore = 0;
				res.json({
					status: 1,
					msg: '',
					data: {
						buys,
						count,
						page,
						isMore,
					}
				});
			})
		}
	})
}


/* ============ 下游客户 ============ */
exports.usStrmdwsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 12;
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

	let categSymb = '$ne';
	let categCond = '-1';
	if(req.query.categ && !isNaN(parseInt(req.query.categ))) {
		categSymb = '$eq';
		categCond = parseInt(req.query.categ);
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;

	let param = {
		firm: crUser.firm,
		shelf: {[shelfSymb]: shelfConb},

		'nome': {[nomeSymb]: nomeCond},
		'categFirm': {[categSymb]: categCond},
	}

	Strmdw.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser getdataAjax, Strmdw.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Strmdw.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
			.populate('firmUp')
			.exec((err, strmdws) => {
				if(err) console.log(err);

				let isMore = 1;
				if(page*pagesize >= count) isMore = 0;
				res.json({
					status: 1,
					msg: '',
					data: {
						strmdws,
						count,
						page,
						isMore,
					}
				});
			})
		}
	})
}

/* ============ 客户折扣 ============ */
exports.usSellsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 12;
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

	let categSymb = '$ne';
	let categCond = '-1';
	if(req.query.categ && !isNaN(parseInt(req.query.categ))) {
		categSymb = '$eq';
		categCond = parseInt(req.query.categ);
	}

	let shelfSymb = '$ne';
	let shelfConb = -1;

	let param = {
		firm: crUser.firm,
		shelf: {[shelfSymb]: shelfConb},

		'nome': {[nomeSymb]: nomeCond},
		'categFirm': {[categSymb]: categCond},
	}

	Sell.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser getdataAjax, Sell.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Sell.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
			.populate('strmdw')
			.populate('brand')
			.exec((err, sells) => {
				if(err) console.log(err);

				let isMore = 1;
				if(page*pagesize >= count) isMore = 0;
				res.json({
					status: 1,
					msg: '',
					data: {
						sells,
						count,
						page,
						isMore,
					}
				});
			})
		}
	})
}
