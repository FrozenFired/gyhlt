const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Article = require('../../../models/firm/article');
const _ = require('underscore');

const MdPicture = require('../../../middle/middlePicture');

exports.pmNotices = (req, res) => {
	let crUser = req.session.crUser;

	Article.find({
		firm: crUser.firm,
		categ: Conf.article.notice.num
	})
	.exec((err, articles) => {
		if(err) {
			info = "pmer Articles, Article.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/article/notice/list', {
				title: '新闻列表',
				crUser,

				articles
			});
		}
	})
}
exports.pmProjects = (req, res) => {
	let crUser = req.session.crUser;

	Article.find({
		firm: crUser.firm,
		categ: Conf.article.project.num
	})
	.exec((err, articles) => {
		if(err) {
			info = "pmer Articles, Article.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/article/project/list', {
				title: '项目案例',
				crUser,

				articles
			});
		}
	})
}


exports.pmNoticeAdd =(req, res) => {
	res.render('./user/pmer/article/notice/add', {
		title: '新闻添加',
		crUser : req.session.crUser,
	})
}
exports.pmProjectAdd =(req, res) => {
	res.render('./user/pmer/article/project/add', {
		title: '添加项目案例',
		crUser : req.session.crUser,
	})
}

exports.pmArticleDel = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Article.findOne({_id: id}, (err, article) => {
		if(err) {
			info = "pmer ArticleDel, Article.find, Error!";
			Err.usError(req, res, info);
		} else if(!article) {
			info = "此品牌已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let redirectUrl = "/";
			if(article.categ == Conf.article.notice.num) {
				redirectUrl = "/pmNotices";
			} else if(article.categ == Conf.article.project.num) {
				redirectUrl = "/pmProjects";
			}
			let picDel = article.photo;
			MdPicture.deletePicture(picDel, Conf.picPath.article);
			Article.deleteOne({_id: id}, (err, objRm) => {
				if(err) {
					info = "pmer ArticleDel, Article.deleteOne, Error!";
					Err.usError(req, res, info);
				} else {
					res.redirect(redirectUrl);
				}
			})
		}
	})
}
exports.pmArticle = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Article.findOne({_id: id}, (err, article) => {
		if(err) {
			console.log(err);
			info = "pmer ArticleFilter, Article.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!article) {
			info = "这个品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			info = null;
			let renderUrl;
			if(article.categ == Conf.article.notice.num) {
				renderUrl = './user/pmer/article/notice/detail';
			} else if(article.categ == Conf.article.project.num) {
				renderUrl = './user/pmer/article/project/detail';
			} else {
				info = "操作错误, 请截图后, 联系管理员"
			}
			if(info) {
				Err.usError(req, res, info);
			} else {
				res.render(renderUrl, {
					title: '详情',
					crUser,
					article,
				})
			}
		}
	})
}

exports.pmNoticeUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Article.findOne({_id: id}, (err, article) => {
		if(err) {
			console.log(err);
			info = "pmer ArticleFilter, Article.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!article) {
			info = "这篇新闻已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/article/notice/update', {
				title: '新闻更新',
				crUser,
				article
			})
		}
	})
}
exports.pmProjectUp = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Article.findOne({_id: id}, (err, article) => {
		if(err) {
			console.log(err);
			info = "pmer ArticleFilter, Article.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!article) {
			info = "这项目已经被删除";
			Err.usError(req, res, info);
		} else {
			res.render('./user/pmer/article/project/update', {
				title: '项目更新',
				crUser,
				article
			})
		}
	})
}





exports.pmArticleNew = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj;
	obj.firm = crUser.firm;
	obj.title = obj.title.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let picNew = obj.picture;
	if(obj.picture) obj.photo = obj.picture;
	info = null;
	let redirectUrl;
	if(obj.categ == Conf.article.notice.num) {
		redirectUrl = '/pmNotices';
	} else if(obj.categ == Conf.article.project.num) {
		redirectUrl = '/pmProjects';
	} else {
		info = "操作错误, 请重新添加"
	}
	if(info) {
			Err.usError(req, res, info);
	} else {
		let _article = new Article(obj)
		_article.save((err, objSave) => {
			if(err) {
				MdPicture.deletePicture(picNew, Conf.picPath.article);
				info = "添加品牌时 数据库保存错误, 请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else {
				res.redirect(redirectUrl)
			}
		})
	}
}


exports.pmArticleUpd = (req, res) => {
	let obj = req.body.obj
	obj.title = obj.title.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let picNew = obj.picture;
	if(obj.picture) obj.photo = obj.picture;
	Article.findOne({_id: obj._id}, (err, article) => {
		if(err) {
			MdPicture.deletePicture(picNew, Conf.picPath.article);
			info = "更新品牌时数据库查找出现错误, 请截图后, 联系管理员"
			Err.usError(req, res, info);
		} else if(!article) {
			MdPicture.deletePicture(picNew, Conf.picPath.article);
			info = "此品牌已经被删除, 请刷新查看";
			Err.usError(req, res, info);
		} else {
			let picOld = null;
			if(picNew) {
				picOld = article.photo;
			}
			let _article = _.extend(article, obj)
			_article.save((err, objSave) => {
				if(err) {
					MdPicture.deletePicture(picNew, Conf.picPath.article);
					info = "更新品牌时数据库保存数据时出现错误, 请截图后, 联系管理员"
					Err.usError(req, res, info);
				} else {
					MdPicture.deletePicture(picOld, Conf.picPath.article);
					res.redirect("/pmArticle/"+objSave._id)
				}
			})
		}
	})
}