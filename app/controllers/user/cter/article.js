const Err = require('../../aaIndex/err');
const Conf = require('../../../../conf');

const Article = require('../../../models/firm/article');
const _ = require('underscore');

const MdPicture = require('../../../middle/middlePicture');

exports.ctNotices = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;
	if(crUser) frim = crUser.firm;

	Article.find({
		firm: firm._id,
		categ: Conf.article.notice.num
	})
	.exec((err, articles) => {
		if(err) {
			info = "cter Articles, Article.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./cter/article/notice/list', {
				title: '新闻列表',
				crUser,

				articles
			});
		}
	})
}
exports.ctProjects = (req, res) => {
	let crUser = req.session.crUser;
	let firm = req.session.firm;

	Article.find({
		firm: firm._id,
		categ: Conf.article.project.num
	})
	.exec((err, articles) => {
		if(err) {
			info = "cter Articles, Article.find(), Error!";
			Err.usError(req, res, info);
		} else {
			res.render('./cter/article/project/list', {
				title: '项目案例',
				crUser,

				articles
			});
		}
	})
}


exports.ctArticle = (req, res) => {
	let crUser = req.session.crUser;
	let id = req.params.id;

	Article.findOne({_id: id}, (err, article) => {
		if(err) {
			console.log(err);
			info = "cter ArticleFilter, Article.findOne, Error!";
			Err.usError(req, res, info);
		} else if(!article) {
			info = "这个品牌已经被删除";
			Err.usError(req, res, info);
		} else {
			info = null;
			let renderUrl;
			if(article.categ == Conf.article.notice.num) {
				renderUrl = './cter/article/notice/detail';
			} else if(article.categ == Conf.article.project.num) {
				renderUrl = './cter/article/project/detail';
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