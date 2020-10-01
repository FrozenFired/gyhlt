const Index = require('../controllers/aaIndex/index');

const User = require('../controllers/user/mger/user');
const Firm = require('../controllers/user/mger/firm');

const Qutpd = require('../controllers/user/mger/qutpd');
const Qut = require('../controllers/user/mger/qut');

const Din = require('../controllers/user/mger/din');
const Dinpd = require('../controllers/user/mger/dinpd');

const Bill = require('../controllers/user/mger/bill');

const Dut = require('../controllers/user/mger/dut');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/mger', MdRole.mgerIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/mger/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});
	/* =================================== User =================================== */
	app.get('/users', MdRole.mgerIsLogin, User.users)
	app.get('/userAdd', MdRole.mgerIsLogin, User.userAdd)
	app.post('/userNew', MdRole.mgerIsLogin, postForm, MdBcrypt.rqBcrypt, User.userNew)
	app.get('/userDel/:userId', MdRole.mgerIsLogin, User.userDel)

	app.get('/user/:userId', MdRole.userIsLogin, User.user)
	app.post('/userUpdInfo', MdRole.userIsLogin, postForm, User.userUpd)
	app.post('/userUpdPwd', MdRole.userIsLogin, postForm, MdBcrypt.rqBcrypt, User.userUpd)

	/* =================================== Firm =================================== */
	app.get('/usFirm', MdRole.userIsLogin, Firm.usFirm)
	app.post('/mgFirmUpd', MdRole.mgerIsLogin, postForm, Firm.mgFirmUpd);
	app.post('/mgFirmPostNew', MdRole.mgerIsLogin, postForm, MdPicture.pictureNew, Firm.mgFirmPostNew);
	app.get('/mgFirmPostDel/:id', MdRole.mgerIsLogin, Firm.mgFirmPostDel);


	/* =================================== compd 报价商品 =================================== */
	app.get('/mgQutpds', MdRole.mgerIsLogin, Qutpd.mgQutpds)
	app.get('/mgQutpd/:id', MdRole.mgerIsLogin, Qutpd.mgQutpd)
	app.get('/mgQutpdDel/:id', MdRole.mgerIsLogin, Qutpd.mgQutpdDel)

	app.post('/mgQutpdUpdAjax', MdRole.mgerIsLogin, postForm, Qutpd.mgQutpdUpdAjax)
	/* =================================== Inquot 报价 =================================== */
	app.get('/mgQuts', MdRole.mgerIsLogin, Qut.mgQuts)
	app.get('/mgQut/:id', MdRole.mgerIsLogin, Qut.mgQut)
	app.get('/mgQutDel/:id', MdRole.mgerIsLogin, Qut.mgQutDel)

	app.post('/mgQutUpd', MdRole.mgerIsLogin, postForm, Qut.mgQutUpd)


	/* =================================== Bill =================================== */
	app.post('/mgBillNew', MdRole.mgerIsLogin, postForm, Bill.mgBillNew)
	app.get('/mgBillDel/:id', MdRole.mgerIsLogin, Bill.mgBillDel)

	/* =================================== Din =================================== */
	app.get('/mgDinGen/:inquotId', MdRole.mgerIsLogin, Din.mgDinGen)
	app.get('/mgDins', MdRole.mgerIsLogin, Din.mgDins)
	app.get('/mgDin/:id', MdRole.mgerIsLogin, Din.mgDin)
	app.get('/mgDinDel/:id', MdRole.mgerIsLogin, Din.mgDinDel)

	app.post('/mgDinUpd', MdRole.mgerIsLogin, postForm, Din.mgDinUpd)

	/* =================================== Dinpd 销售商品 =================================== */
	app.post('/mgDinOptpd', MdRole.mgerIsLogin, postForm, Dinpd.mgDinOptpd)

	app.get('/mgDinpds', MdRole.mgerIsLogin, Dinpd.mgDinpds)
	app.get('/mgDinpd/:id', MdRole.mgerIsLogin, Dinpd.mgDinpd)
	app.get('/mgDinpdUp/:id', MdRole.mgerIsLogin, Dinpd.mgDinpdUp)
	app.get('/mgDinpdDel/:id', MdRole.mgerIsLogin, Dinpd.mgDinpdDel)

	app.post('/mgDinpdUpdAjax', MdRole.mgerIsLogin, postForm, Dinpd.mgDinpdUpdAjax)

	/* =================================== Dut =================================== */
	app.get('/mgDuts', MdRole.mgerIsLogin, Dut.mgDuts)
	app.post('/mgDutNew', MdRole.mgerIsLogin, postForm, Dut.mgDutNew)
	app.get('/mgDut/:id', MdRole.mgerIsLogin, Dut.mgDut)
	app.get('/mgDutDel/:id', MdRole.mgerIsLogin, Dut.mgDutDel)

	app.post('/mgDutUpd', MdRole.mgerIsLogin, postForm, Dut.mgDutUpd)

	app.get('/mgDutExcel/:id', MdRole.slerIsLogin, Dut.mgDutExcel)
};