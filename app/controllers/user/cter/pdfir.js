let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Pdfir = require('../../../models/firm/pd/pdfir');
let Brand = require('../../../models/firm/brand');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.ctPdfirs = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/pdfir/list', {
		title: '产品系列',
		crUser,
	})
}

exports.ctPdfir = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	let id = req.params.id;

	/* ====== 判定从哪来 ===== */
	let lastUrl = 'ctPdfirs';
	let referer = req.headers.referer;
	if(referer && referer.split('ctBrand').length == 2) {
		lastUrl = 'ctBrand';
	}

	Pdfir.findOne({
		firm: firm._id,
		shelf: {'$gt': 0},
		_id: id
	})
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
			res.render('./cter/pdfir/detail', {
				title: '系列更新',
				crUser,
				pdfir,
				lastUrl
			})
		}
	})
}
