const Index = require('../controllers/aaIndex/index');

const Strmlg = require('../controllers/user/lger/strmlg');
const Tran = require('../controllers/user/lger/tran');
const Tranpd = require('../controllers/user/lger/tranpd');

const MdRole = require('../middle/middleRole');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/lger', MdRole.lgerIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/lger/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});

	/* ============================= Supplier Upstream ============================= */
	app.get('/lgStrmlgs', MdRole.lgerIsLogin, Strmlg.lgStrmlgs)
	app.get('/lgStrmlgAdd', MdRole.lgerIsLogin, Strmlg.lgStrmlgAdd)
	app.get('/lgStrmlg/:id', MdRole.lgerIsLogin, Strmlg.lgStrmlg)
	app.get('/lgStrmlgUp/:id', MdRole.lgerIsLogin, Strmlg.lgStrmlgUp)
	app.get('/lgStrmlgDel/:id', MdRole.lgerIsLogin, Strmlg.lgStrmlgDel)

	app.post('/lgStrmlgNew', MdRole.lgerIsLogin, postForm, Strmlg.lgStrmlgNew)
	app.post('/lgStrmlgUpd', MdRole.lgerIsLogin, postForm, Strmlg.lgStrmlgUpd)

	/* =================================== Tran =================================== */
	app.get('/lgTrans', MdRole.lgerIsLogin, Tran.lgTrans)
	app.post('/lgTranNew', MdRole.lgerIsLogin, postForm, Tran.lgTranNew)
	app.get('/lgTran/:id', MdRole.lgerIsLogin, Tran.lgTran)
	app.get('/lgTranDel/:id', MdRole.lgerIsLogin, Tran.lgTranDel)

	app.post('/lgTranUpd', MdRole.lgerIsLogin, postForm, Tran.lgTranUpd)
	app.post('/lgTranUpdAjax', MdRole.lgerIsLogin, postForm, Tran.lgTranUpdAjax)

	app.post('/lgTranPlusPd', MdRole.lgerIsLogin, postForm, Tran.lgTranPlusPd)

	app.get('/lgTranExcel/:id', MdRole.slerIsLogin, Tran.lgTranExcel)
	/* =================================== Tranpd 运输商品 =================================== */
	app.get('/lgTranpdCel/:id', MdRole.lgerIsLogin, Tranpd.lgTranpdCel)
};