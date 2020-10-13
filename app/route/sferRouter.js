const Index = require('../controllers/aaIndex/index');

const Qutpd = require('../controllers/user/sfer/qutpd');
const Qut = require('../controllers/user/sfer/qut');

const Din = require('../controllers/user/sfer/din');
const Dinpd = require('../controllers/user/sfer/dinpd');

const Dut = require('../controllers/user/sfer/dut');
const Dutpd = require('../controllers/user/sfer/dutpd');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/sfer', MdRole.sferIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/sfer/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});

	/* =================================== compd 报价商品 =================================== */
	app.get('/sfQutpdUp/:id', MdRole.sferIsLogin, Qutpd.sfQutpdUp)
	app.get('/sfQutpdDel/:id', MdRole.sferIsLogin, Qutpd.sfQutpdDel)
	app.post('/sfQutpdUpd', MdRole.slerIsLogin, postForm, MdPicture.photoNew,MdPicture.sketchNew,MdPicture.imgsNew, Qutpd.sfQutpdUpd)
	app.post('/sfQutpdUpdAjax', MdRole.sferIsLogin, postForm, Qutpd.sfQutpdUpdAjax)
	/* =================================== Inquot 报价 =================================== */
	app.get('/sfQuts', MdRole.sferIsLogin, Qut.sfQuts)
	app.get('/sfQut/:id', MdRole.sferIsLogin, Qut.sfQut)
	app.get('/sfQutDel/:id', MdRole.sferIsLogin, Qut.sfQutDel)

	app.post('/sfQutUpd', MdRole.sferIsLogin, postForm, Qut.sfQutUpd)

	/* =================================== Din =================================== */
	app.get('/sfDinGen/:inquotId', MdRole.sferIsLogin, Din.sfDinGen)
	app.get('/sfDins', MdRole.sferIsLogin, Din.sfDins)
	app.get('/sfDin/:id', MdRole.sferIsLogin, Din.sfDin)
	app.get('/sfDinDel/:id', MdRole.sferIsLogin, Din.sfDinDel)

	app.post('/sfDinUpd', MdRole.sferIsLogin, postForm, Din.sfDinUpd)
	app.post('/sfDinUpdAjax', MdRole.sferIsLogin, postForm, Din.sfDinUpdAjax)

	/* =================================== Dinpd 销售商品 =================================== */
	app.post('/sfDinpdUpdAjax', MdRole.sferIsLogin, postForm, Dinpd.sfDinpdUpdAjax)

	/* =================================== Dut =================================== */
	app.get('/sfDuts', MdRole.sferIsLogin, Dut.sfDuts)
	app.post('/sfDutNew', MdRole.sferIsLogin, postForm, Dut.sfDutNew)
	app.get('/sfDut/:id', MdRole.sferIsLogin, Dut.sfDut)
	app.get('/sfDutDel/:id', MdRole.sferIsLogin, Dut.sfDutDel)

	app.post('/sfDutUpd', MdRole.sferIsLogin, postForm, Dut.sfDutUpd)

	app.post('/sfDutPlusPd', MdRole.sferIsLogin, postForm, Dut.sfDutPlusPd)

	app.get('/sfDutExcel/:id', MdRole.slerIsLogin, Dut.sfDutExcel)
	/* =================================== Dutpd 采购商品 =================================== */
	app.post('/sfDutpdUpdAjax', MdRole.sferIsLogin, postForm, Dutpd.sfDutpdUpdAjax)
	app.get('/sfDutpdCel/:id', MdRole.sferIsLogin, Dutpd.sfDutpdCel)

};