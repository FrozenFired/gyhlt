const Err = require('../../aaIndex/err');

exports.us = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	res.render('./cter/index/us', {
		title: '关于我们',
		crUser,

		firm
	})
}

exports.qr = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) {
		firm = crUser.firm;
	}

	res.render('./cter/index/qr', {
		title: '关于我们',
		crUser,

		firm
	})
}

exports.ctFirm = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/index/firm', {
		title: '公司信息',
		crUser: crUser,
	})
}