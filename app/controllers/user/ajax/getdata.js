const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Brand = require('../../../models/firm/brand');
const Pdfir = require('../../../models/firm/pd/pdfir');
const Pdsec = require('../../../models/firm/pd/pdsec');

/* ===================== 客户搜索系列名或产品编号出的结果 ===================== */
exports.usGetdataAjax = (req, res) => {
	let crUser = req.session.crUser;

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
	if(crUser.role == Conf.roleUser.customer.num) {
		shelfSymb = '$gt';
		shelfConb = 0;
	}

	let param = {
		firm: crUser.firm,
		shelf: {[shelfSymb]: shelfConb},

		'code': {[codeSymb]: codeCond},
	}
	Pdfir.countDocuments(param, (err, firCount) => {
		if(err) {
			info = "bser getdataAjax, Pdfir.countDocuments(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Pdfir.find(param).sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.limit(5).exec((err, pdfirs) => {
				if(err) console.log(err);
				let firIsMore = 1;
				if(firCount <= 5) firIsMore = 0;

				Pdsec.countDocuments(param, (err, secCount) => {
					if(err) {
						info = "bser getdataAjax, Pdsec.countDocuments(), Error!";
						Err.jsonErr(req, res, info);
					} else {
						Pdsec.find(param).sort({'shelf': -1, 'weight': -1, 'updAt': -1})
						.limit(5).populate('pdfir').exec((err, pdsecs) => {
							if(err) console.log(err);

							let secIsMore = 1;
							if(secCount <= 5) secIsMore = 0;
							res.json({
								status: 1,
								msg: '',
								data: {
									pdfirs,
									firCount,
									firIsMore,

									pdsecs,
									secCount,
									secIsMore,
								}
							});
						})
					}
				})
			})
		}
	})
}
