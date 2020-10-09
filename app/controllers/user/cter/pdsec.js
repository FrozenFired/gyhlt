let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Pdsec = require('../../../models/firm/pd/pdsec');
let Brand = require('../../../models/firm/brand');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.ctPdsecs = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./cter/pdsec/list', {
		title: 'Pdsec List',
		crUser,
	});
}




exports.ctPdsec = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	let id = req.params.id;
	Pdsec.findOne({_id: id, firm: firm._id})
	.populate({path: 'pdfir', populate: {path: 'brand'}})
	.exec((err, pdsec) => {
		if(err) {
			info = "cter Pdsecs, Pdsec.find(), Error!";
			Err.usError(req, res, info);
		} else if(!pdsec){
			info = "数据库中找不到此品牌";
			Err.usError(req, res, info);
		}else {
			res.render('./cter/pdsec/detail', {
				title: 'Pdsec Info',
				crUser,

				pdsec
			});
		}
	})
}
