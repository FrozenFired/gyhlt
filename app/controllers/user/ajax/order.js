let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Ordin = require('../../../models/firm/ord/ordin');
let Ordut = require('../../../models/firm/ord/ordut');
let Compd = require('../../../models/firm/ord/compd');

let Bill = require('../../../models/firm/bill');

exports.usDinsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	let dinerSymb = '$ne';
	let dinerConb = '5f1dff1063781676b6a5f6ff';
	if(req.query.diner) {
		dinerSymb = '$eq';
		dinerConb = req.query.diner;
	}
	if(crUser.role == Conf.roleUser.seller.num) {
		dinerSymb = '$eq';
		dinerConb = crUser._id;
	}
	/* 销售公司筛选, 如果是查询销售单, 则销售公司一定是本公司*/
	// dinSymb = '$eq';
	// dinCond = crUser.firm._id;

	/* 采购公司筛选, 如果是查询采购单, 则采购公司一定是本公司*/
	let dutSymb = '$ne';
	let dutCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.dutId) {
		dutSymb = '$eq';
		dutCond = req.query.dutId;
	}


	let codeSymb = '$ne';
	let codeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		codeSymb = '$in';
		codeCond = String(req.query.keyword);
		codeCond = codeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeCond = new RegExp(codeCond + '.*');
	}

	let statusSymb = '$ne';
	let statusConb = -1;
	if(req.query.status && !isNaN(parseInt(req.query.status))) {
		statusSymb = '$eq';
		statusConb = parseInt(req.query.status)
	}
	// console.log(statusConb)

	let param = {
		firm: crUser.firm,
		diner: {[dinerSymb]: dinerConb},
		status: {[statusSymb]: statusConb},

		$or:[
			{'dateCd': {[codeSymb]: codeCond}},
			{'code': {[codeSymb]: codeCond}},
		]
	}

	Ordin.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser OrdinsAjax, Ordin.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Ordin.find(param)
			.populate('diner')
			.populate('cter')
			.populate('strmup')
			.skip(skip).limit(pagesize)
			.sort({'crtAt': -1})
			.exec((err, ordins) => {
				if(err) {
					info = "cter OrdinsAjax, Ordin.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(ordins)
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							ordins,
							count,
							page,
							isMore,
							statusConb,
						}
					});
				}
			})
		}
	})
}




exports.usDutsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	/* 销售公司筛选, 如果是查询销售单, 则销售公司一定是本公司*/
	// dutSymb = '$eq';
	// dutCond = crUser.firm._id;

	/* 采购公司筛选, 如果是查询采购单, 则采购公司一定是本公司*/
	let dutSymb = '$ne';
	let dutCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.dutId) {
		dutSymb = '$eq';
		dutCond = req.query.dutId;
	}


	let codeSymb = '$ne';
	let codeCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		codeSymb = '$in';
		codeCond = String(req.query.keyword);
		codeCond = codeCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeCond = new RegExp(codeCond + '.*');
	}

	let statusSymb = '$ne';
	let statusConb = -1;
	if(req.query.status && !isNaN(parseInt(req.query.status))) {
		statusSymb = '$eq';
		statusConb = parseInt(req.query.status)
	}
	// console.log(statusConb)

	let param = {
		firm: crUser.firm,
		firm: {[dutSymb]: dutCond},
		status: {[statusSymb]: statusConb},

		$or:[
			{'code': {[codeSymb]: codeCond}},
		]
	}
	Ordut.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser OrdutsAjax, Ordut.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Ordut.find(param)
			.populate('firm')
			.populate('duter')
			.populate('strmup')
			.skip(skip).limit(pagesize)
			.sort({'status': 1, 'weight': -1, 'upAt': -1})
			.exec((err, orduts) => {
				if(err) {
					info = "cter OrdutsAjax, Ordut.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(orduts)
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							orduts,
							count,
							page,
							isMore,
							statusConb,
						}
					});
				}
			})
		}
	})
}









exports.usBillsAjax = (req, res) => {
	let crUser = req.session.crUser;

	let page = 1;
	if(req.query.page && !isNaN(parseInt(req.query.page))) {
		page = parseInt(req.query.page);
	}
	let pagesize = 24;
	if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
		pagesize = parseInt(req.query.pagesize);
	}
	let skip = (page-1)*pagesize;

	/* 销售公司筛选, 如果是查询销售单, 则销售公司一定是本公司*/
	// dutSymb = '$eq';
	// dutCond = crUser.firm._id;

	/* 采购公司筛选, 如果是查询采购单, 则采购公司一定是本公司*/
	let dutSymb = '$ne';
	let dutCond = '5ee8cf3dfd644e4fc8b8536d';
	if(req.query.dutId) {
		dutSymb = '$eq';
		dutCond = req.query.dutId;
	}


	let genreSymb = '$ne';
	let genreConb = -100;
	if(req.query.genre && !isNaN(parseInt(req.query.genre))) {
		genreSymb = '$eq';
		genreConb = parseInt(req.query.genre)
	}
	// console.log(genreConb)

	let param = {
		firm: crUser.firm,
		firm: {[dutSymb]: dutCond},
		genre: {[genreSymb]: genreConb},
	}
	Bill.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser BillsAjax, Bill.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Bill.find(param)
			.populate('ordin')
			.populate('ordut')
			.skip(skip).limit(pagesize)
			.sort({'crtAt': 1})
			.exec((err, bills) => {
				if(err) {
					info = "cter BillsAjax, Bill.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(bills)
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							bills,
							count,
							page,
							isMore,
							genreConb,
						}
					});
				}
			})
		}
	})
}