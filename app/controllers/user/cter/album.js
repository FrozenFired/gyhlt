const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Album = require('../../../models/firm/datafile/album');
const Brand = require('../../../models/firm/brand');

const MdFile = require('../../../middle/middleFile');

exports.ctAlbums = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/album/list', {
		title: '图册列表',
		crUser,
	});
}