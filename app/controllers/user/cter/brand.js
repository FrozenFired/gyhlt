let Err = require('../../aaIndex/err');

let MdPicture = require('../../../middle/middlePicture');
let Conf = require('../../../../conf');

let Brand = require('../../../models/firm/brand');
let Pdsec = require('../../../models/firm/pd/pdsec');
let Firm = require('../../../models/login/firm');

let _ = require('underscore');

exports.ctBrands = (req, res) => {
	let crUser = req.session.crUser;
	res.render('./cter/brand/list', {
		title: 'Brand List',
		crUser: crUser,
	});
}

exports.ctBrand = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	let id = req.params.id;
	Brand.findOne({
		firm: firm._id,
		shelf: {'$gt': 0},
		_id: id, 
	})
	.exec((err, brand) => {
		if(err) {
			info = "cter Brands, Brand.find(), Error!";
			Err.usError(req, res, info);
		} else if(!brand){
			info = "数据库中找不到此品牌";
			Err.usError(req, res, info);
		}else {
			Firm.findOne({_id: firm._id})
			.exec((err, firm) => {
				if(err) {
					console.log(err);
					info = "cter PdsecAdd, Firm.findOne, Error! ----- "+err;
					Err.usError(req, res, info);
				} else if(!firm) {
					info = "公司信息错误";
					Err.usError(req, res, info);
				} else {
					res.render('./cter/brand/detail', {
						title: 'Brand Info',
						crUser,

						brand,
						pdnomes: firm.pdnomes
					});
				}
			})
		}
	})
}

