const Err = require('../../aaIndex/err');

const Firm = require('../../../models/login/firm')


exports.bnPdnomeNew = (req, res) => {
	let crUser = req.session.crUser;
	let pdnomeNew = req.body.pdnome.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	Firm.findOne({_id: crUser.firm}, (err, firm) => {
		if(err) {
			console.log(err);
			info = "bner FirmPdnomeNew, Firm.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!firm) {
			info = "公司信息被删除, 请截图后, 联系管理员";
			Err.usError(req, res, info);
		} else {
			let pdnomes = firm.pdnomes;
			let i=0;
			for(; i<pdnomes.length; i++) {
				let pdnome = pdnomes[i];
				if(pdnome == pdnomeNew) {
					break;
				}
			}
			if(i != pdnomes.length) {
				info = "此系列已经存在!";
				Err.usError(req, res, info);
			} else {
				pdnomes.unshift(pdnomeNew)
				firm.save((err, firmSave) => {
					if(err) {
						console.log(err);
						info = "firm.save Error!";
						Err.usError(req, res, info);
					} else {
						res.redirect('/bnPdfirs');
					}
				})
			}
		}
	});
}

exports.bnPdnomeDelAjax = (req, res) => {
	let crUser = req.session.crUser;
	let pdnomeDel = req.query.pdnome;
	Firm.findOne({_id: crUser.firm})
	.exec((err, firm) => {
		if(err) {
			console.log(err);
			info = "bner FirmPdnomeDelAjax, Firm.findOne, Error! ----- "+err;
			Err.jsonErr(req, res, info);
		} else if(!firm) {
			info = "公司信息错误"
			Err.jsonErr(req, res, info);
		} else {
			let pdnomes = firm.pdnomes;
			let i=0;
			for(; i<pdnomes.length; i++) {
				let pdnome = pdnomes[i];
				if(pdnome == pdnomeDel) {
					break;
				}
			}
			if(i == pdnomes.length) {
				info = "品牌中不存在此系列!";
				Err.jsonErr(req, res, info);
			} else {
				pdnomes.remove(pdnomeDel)
				firm.save((err, firmSave) => {
					if(err) {
						console.log(err);
						info = "bner FirmPdnomeDelAjax, firm.save, Error!";
						Err.jsonErr(req, res, info);
					} else {
						res.json({
							status: 1,
							msg: '',
							data: {}
						});
					}
				})
			}
		}
	})
}