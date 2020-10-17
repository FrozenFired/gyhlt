let Err = require('../../aaIndex/err');
let Conf = require('../../../../conf');

let Inquot = require('../../../models/firm/ord/inquot');
let Compd = require('../../../models/firm/ord/compd');

exports.usQunsAjax = (req, res) => {
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

	let qunerSymb = '$ne';
	let qunerConb = '5f1dff1063781676b6a5f6ff';
	if(req.query.quner) {
		qunerSymb = '$eq';
		qunerConb = req.query.quner;
	}
	if(crUser.role == Conf.roleUser.seller.num) {
		qunerSymb = '$eq';
		qunerConb = crUser._id;
	}

	let keySymb = '$ne';
	let keyCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		keySymb = '$in';
		keyCond = String(req.query.keyword);
		keyCond = keyCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		keyCond = new RegExp(keyCond + '.*');
	}

	let statusSymb = '$ne';
	let statusConb = -1;
	// if(crUser.role == Conf.roleUser.customer.num) {
	// 	statusSymb = '$gt';
	// 	statusConb = 0;
	// }
	if(req.query.status && !isNaN(parseInt(req.query.status))) {
		statusSymb = '$eq';
		statusConb = parseInt(req.query.status)
	}
	// console.log(statusConb)

	let param = {
		firm: crUser.firm,
		quner: {[qunerSymb]: qunerConb},

		status: {[statusSymb]: statusConb},

		$or:[
			{'cterNome': {[keySymb]: keyCond}},
			{'code': {[keySymb]: keyCond}},
		]
	}
	Inquot.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser InquotsAjax, Inquot.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Inquot.find(param)
			.populate('quner')
			.populate('quter')
			.skip(skip).limit(pagesize)
			.sort({'status': 1, 'weight': -1, 'qntcrtAt': -1})
			.exec((err, inquots) => {
				if(err) {
					info = "cter InquotsAjax, Inquot.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(inquots)
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							inquots,
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




exports.usQutsAjax = (req, res) => {
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

	let quterSymb = '$ne';
	let quterConb = '5ef450f1b0268e77894e5bea';
	if(req.query.quter) {
		if(req.query.quter == "null"){
			quterSymb = '$eq';
			quterConb = null;
		} else if(req.query.quter == "nenull") {
			quterSymb = '$ne';
			quterConb = null;
		} else {
			quterSymb = '$eq';
			quterConb = req.query.quter;
		}
	}
	if(crUser.role == Conf.roleUser.staff.num) {
		quterSymb = '$eq';
		quterConb = crUser._id;
	}

	if(crUser.role == Conf.roleUser.quotation.num) {
		quterSymb = '$eq';
		quterConb = crUser._id;
	}
	// console.log(quterSymb)
	// console.log(quterConb)

	let keySymb = '$ne';
	let keyCond = 'rander[a`a。=]';
	if(req.query.keyword) {
		keySymb = '$in';
		keyCond = String(req.query.keyword);
		keyCond = keyCond.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		keyCond = new RegExp(keyCond + '.*');
	}

	let statusSymb = '$ne';
	let statusConb = Conf.status.init.num;
	if(req.query.status) {
		if(!isNaN(parseInt(req.query.status))) {
			statusSymb = '$eq';
			statusConb = parseInt(req.query.status)
		} else if(req.query.status == 'qter') {
			statusSymb = '$nin';
			statusConb = [Conf.status.init.num, Conf.status.quoting.num];
		}
	}
	// console.log(statusSymb)
	// console.log(statusConb)
	// console.log("========================")

	let param = {
		firm: crUser.firm,
		quter: {[quterSymb]: quterConb},

		status: {[statusSymb]: statusConb},

		$or:[
			{'cterNome': {[keySymb]: keyCond}},
			{'code': {[keySymb]: keyCond}},
		]
	}
	Inquot.countDocuments(param, (err, count) => {
		if(err) {
			info = "bser InquotsAjax, Inquot.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Inquot.find(param)
			.populate('quner')
			.populate('quter')
			.skip(skip).limit(pagesize)
			.sort({'status': 1, 'weight': -1, 'qntcrtAt': -1})
			.exec((err, inquots) => {
				if(err) {
					info = "cter InquotsAjax, Inquot.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					// console.log(inquots)
					// console.log(page)
					// console.log(count)
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					res.json({
						status: 1,
						msg: '',
						data: {
							inquots,
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