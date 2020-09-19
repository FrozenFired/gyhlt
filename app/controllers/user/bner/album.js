const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Album = require('../../../models/firm/datafile/album');
const Brand = require('../../../models/firm/brand');
const _ = require('underscore');

const MdFile = require('../../../middle/middleFile');

exports.bnAlbums = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./user/bner/album/list', {
		title: '图册列表',
		crUser,
	});
}

exports.bnAlbumAdd =(req, res) => {
	res.render('./user/bner/album/add', {
		title: '添加图册',
		crUser : req.session.crUser,
	})
}

exports.bnAlbumDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Album.findOne({_id: id}, (err, album) => {
		if(err) {
			info = "bner AlbumDel, Album.find, Error!";
			Err.usError(req, res, info);
		} else if(!album) {
			info = "此品牌已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let fileDel = album.pdf;
			MdFile.deleteFile(fileDel, Conf.filePath.album);
			Album.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "bner AlbumDel, Album.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect('/bnAlbums');
				}
			})
		}
	})
}
exports.bnAlbum = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Album.findOne({_id: id})
	.populate('brand')
	.exec((err, album) => {
		if(err) {
			console.log(err);
			info = "bner AlbumFilter, Album.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!album) {
			info = "这个品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/bner/album/detail', {
				title: '详情',
				crUser,
				album,
			})
		}
	})
}



exports.bnAlbumNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	if(!obj.file) {
		info = "文件写入错误, 请重试";
		Err.usError(req, res, info);
	} else {
		obj.firm = crUser.firm;
		let fileNew = obj.file;
		obj.pdf = obj.file;

		let _album = new Album(obj)
		_album.save((err, objSave) => {
			if(err) {
				MdFile.deleteFile(fileNew, Conf.filePath.album);
				info = "添加品牌时 数据库保存错误, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else {
				res.redirect('/bnAlbums');
			}
		})
	}
}