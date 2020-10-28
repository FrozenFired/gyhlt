const Index = require('../controllers/aaIndex/index');

const User = require('../controllers/user/mger/user');
const Firm = require('../controllers/user/mger/firm');

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
};