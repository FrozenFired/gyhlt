const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Album = require('../../../models/firm/datafile/album');

const MdFile = require('../../../middle/middleFile');

exports.usAlbumsAjax = (req, res) => {
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
	Album.countDocuments(param, (err, count) => {
		if(err) {
			info = "cter Albums, Album.find(), Error!";
			Err.jsonErr(req, res, info);
		} else {
			Album.find(param)
			.populate('brand')
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			.exec((err, albums) => {
				if(err) {
					info = "cter Albums, Album.find(), Error!";
					Err.jsonErr(req, res, info);
				} else {
					let isMore = 1;
					if(page*pagesize >= count) isMore = 0;
					// console.log(albums)
					res.json({
						status: 1,
						msg: '',
						data: {
							albums,
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