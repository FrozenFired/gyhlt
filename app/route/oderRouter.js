const Index = require('../controllers/aaIndex/index');

const Dut = require('../controllers/user/oder/dut');
const Dutpd = require('../controllers/user/oder/dutpd');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/oder', MdRole.oderIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/oder/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});

	/* =================================== Dut =================================== */
	app.get('/odDutGen/:inquotId', MdRole.oderIsLogin, Dut.odDutGen)
	app.get('/odDuts', MdRole.oderIsLogin, Dut.odDuts)
	app.get('/odDut/:id', MdRole.oderIsLogin, Dut.odDutFilter, Dut.odDut)
	app.get('/odDutExcel/:id', MdRole.oderIsLogin, Dut.odDutExcel)
	app.get('/odDutUp/:id', MdRole.oderIsLogin, Dut.odDutUp)
	app.get('/odDutDel/:id', MdRole.oderIsLogin, Dut.odDutDel)

	app.post('/odDutUpd', MdRole.oderIsLogin, postForm, Dut.odDutUpd)

	/* =================================== Dutpd 销售商品 =================================== */
	app.post('/odDutOptpd', MdRole.oderIsLogin, postForm, Dutpd.odDutOptpd)

	app.get('/odDutpds', MdRole.oderIsLogin, Dutpd.odDutpds)
	app.get('/odDutpd/:id', MdRole.oderIsLogin, Dutpd.odDutpd)
	app.get('/odDutpdUp/:id', MdRole.oderIsLogin, Dutpd.odDutpdUp)
	app.get('/odDutpdDel/:id', MdRole.oderIsLogin, Dutpd.odDutpdDel)

	app.post('/odDutpdUpd', MdRole.oderIsLogin, postForm, Dutpd.odDutpdUpd)
};