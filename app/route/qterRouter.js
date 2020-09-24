const Index = require('../controllers/aaIndex/index');

const Qut = require('../controllers/user/qter/qut');
const Qutpd = require('../controllers/user/qter/qutpd');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/qter', MdRole.qterIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/qter/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});
	/* =================================== User =================================== */
	
	/* =================================== compd 报价商品 =================================== */
	app.get('/qtQutpds', MdRole.qterIsLogin, Qutpd.qtQutpds)
	app.get('/qtQutpd/:id', MdRole.qterIsLogin, Qutpd.qtQutpd)
	app.get('/qtQutpdUp/:id', MdRole.qterIsLogin, Qutpd.qtQutpdUp)

	app.post('/qtQutpdDelPic', MdRole.qterIsLogin, postForm, Qutpd.qtQutpdDelPic)
	app.post('/qtQutpdUpd', MdRole.slerIsLogin, postForm, MdPicture.photoNew,MdPicture.sketchNew,MdPicture.imgsNew, Qutpd.qtQutpdUpd)
	/* =================================== Inquot 报价 =================================== */
	app.get('/qtQuts', MdRole.qterIsLogin, Qut.qtQuts)
	app.get('/qtQut/:id', MdRole.qterIsLogin, Qut.qtQut)
	app.get('/qtQutExcel/:id', MdRole.qterIsLogin, Qut.qtQutExcel)
	app.get('/qtQutDel/:id', MdRole.qterIsLogin, Qut.qtQutDel)

	app.post('/qtQutUpdAjax', MdRole.qterIsLogin, postForm, Qut.qtQutUpdAjax)
};