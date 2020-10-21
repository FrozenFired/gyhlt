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

exports.ctAlbum = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Album.findOne({_id: id})
	.populate('brand')
	.exec((err, album) => {
		if(err) {
			console.log(err);
			info = "cter AlbumFilter, Album.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!album) {
			info = "这个品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./cter/album/detail', {
				title: '详情',
				crUser,
				album,
			})
		}
	})
}
