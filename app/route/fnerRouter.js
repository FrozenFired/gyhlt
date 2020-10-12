const Index = require('../controllers/aaIndex/index');

const Bill = require('../controllers/user/fner/bill');
const Din = require('../controllers/user/fner/din');
const Dut = require('../controllers/user/fner/dut');
const Tran = require('../controllers/user/fner/tran');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/fner', MdRole.fnerIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/fner/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});


	/* =================================== Bill =================================== */
	app.post('/fnBillNew', MdRole.fnerIsLogin, postForm, Bill.fnBillNew)
	app.get('/fnBillDel/:id', MdRole.fnerIsLogin, Bill.fnBillDel)
	app.get('/fnBills', MdRole.fnerIsLogin, Bill.fnBills)

	/* =================================== Din =================================== */
	app.get('/fnDins', MdRole.fnerIsLogin, Din.fnDins)
	app.get('/fnDin/:id', MdRole.fnerIsLogin, Din.fnDin)

	/* =================================== Dut =================================== */
	app.get('/fnDuts', MdRole.fnerIsLogin, Dut.fnDuts)
	app.get('/fnDut/:id', MdRole.fnerIsLogin, Dut.fnDut)

	/* =================================== Tran =================================== */
	app.get('/fnTrans', MdRole.fnerIsLogin, Tran.fnTrans)
	app.get('/fnTran/:id', MdRole.fnerIsLogin, Tran.fnTran)
};