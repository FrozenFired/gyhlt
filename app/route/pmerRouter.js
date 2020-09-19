const Index = require('../controllers/aaIndex/index');

const Article = require('../controllers/user/pmer/article');

const Strmdw = require('../controllers/user/pmer/strmdw');
const Sell = require('../controllers/user/pmer/sell');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/pmer', MdRole.pmerIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/pmer/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});

	/* =================================== Article =================================== */
	app.get('/pmNotices', MdRole.pmerIsLogin, Article.pmNotices)
	app.get('/pmProjects', MdRole.pmerIsLogin, Article.pmProjects)
	app.get('/pmNoticeAdd', MdRole.pmerIsLogin, Article.pmNoticeAdd)
	app.get('/pmProjectAdd', MdRole.pmerIsLogin, Article.pmProjectAdd)
	app.post('/pmArticleNew', MdRole.pmerIsLogin, postForm, MdPicture.pictureNew, Article.pmArticleNew)
	app.post('/pmArticleUpd', MdRole.pmerIsLogin, postForm, MdPicture.pictureNew, Article.pmArticleUpd)

	app.get('/pmArticle/:id', MdRole.pmerIsLogin, Article.pmArticle)
	app.get('/pmNoticeUp/:id', MdRole.pmerIsLogin, Article.pmNoticeUp)
	app.get('/pmProjectUp/:id', MdRole.pmerIsLogin, Article.pmProjectUp)
	app.get('/pmArticleDel/:id', MdRole.pmerIsLogin, Article.pmArticleDel);


	/* ============================= Client Downstream ============================= */
	app.get('/pmStrmdws', MdRole.pmerIsLogin, Strmdw.pmStrmdws)
	app.get('/pmStrmdwAdd', MdRole.pmerIsLogin, Strmdw.pmStrmdwAdd)
	app.get('/pmStrmdw/:id', MdRole.pmerIsLogin, Strmdw.pmStrmdw)
	app.get('/pmStrmdwUp/:id', MdRole.pmerIsLogin, Strmdw.pmStrmdwUp)
	app.get('/pmStrmdwDel/:id', MdRole.pmerIsLogin, Strmdw.pmStrmdwDel)

	app.post('/pmStrmdwNew', MdRole.pmerIsLogin, postForm, Strmdw.pmStrmdwNew)
	app.post('/pmStrmdwUpd', MdRole.pmerIsLogin, postForm, Strmdw.pmStrmdwUpd)
	/* ============================== Client discount ============================== */
	app.get('/pmSells', MdRole.pmerIsLogin, Sell.pmSells)
	app.get('/pmSellAdd', MdRole.pmerIsLogin, Sell.pmSellAdd)
	app.get('/pmSell/:id', MdRole.pmerIsLogin, Sell.pmSell)
	app.get('/pmSellUp/:id', MdRole.pmerIsLogin, Sell.pmSellUp)
	app.get('/pmSellDel/:id', MdRole.pmerIsLogin, Sell.pmSellDel)

	app.post('/pmSellNew', MdRole.pmerIsLogin, postForm, Sell.pmSellNew)
	app.post('/pmSellUpd', MdRole.pmerIsLogin, postForm, Sell.pmSellUpd)

};