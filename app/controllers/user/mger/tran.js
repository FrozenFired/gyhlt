// 运输 集装箱
const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Strmlg = require('../../../models/firm/stream/strmlg');
const Tran = require('../../../models/firm/ord/tran');

const Ordin = require('../../../models/firm/ord/ordin');
const Ordut = require('../../../models/firm/ord/ordut');

// 运输管理
exports.mgTrans = (req, res) => {
	let crUser = req.session.crUser;
	Strmlg.find({firm: crUser.firm})
	.exec((err, strmlgs) => {
		if(err) {
			console.log(err);
			info = "mger Trans, Strmlg.find, Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/mger/tran/list', {
				title: '运输管理',
				crUser,
				strmlgs
			})
		}
	})
}