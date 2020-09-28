const Index = require('../controllers/ader/index');

const Ader = require('../controllers/ader/ader'); // ct control
const Categ = require('../controllers/ader/categ')

const Firm = require('../controllers/ader/firm')
const User = require('../controllers/ader/user')

const MdBcrypt = require('../middle/middleBcrypt')
const MdRole = require('../middle/middleRole')
const MdPicture = require('../middle/middlePicture');

const multipart = require('connect-multiparty')
const postForm = multipart();

module.exports = function(app){

	/* index --------------- Ader 首页 登录页面 登录 登出---------------------- */
	app.get('/ader', Index.aderHome)
	app.get('/aderLogin', Index.aderLogin)
	app.post('/loginAder', Index.loginAder)
	app.get('/aderLogout', Index.aderLogout)

	/* index -------------------- 添加删除(后期要关闭) ----------------------------- */
	app.get('/aderAdd', Ader.aderAdd)
	app.post('/aderNew', postForm, MdBcrypt.rqBcrypt, Ader.aderNew)
	app.delete('/aderDelAjax', MdRole.aderIsLogin, Ader.aderDelAjax)

	app.get('/aders', MdRole.aderIsLogin, Ader.aders)
	app.get('/ader/:id', MdRole.aderIsLogin, Ader.ader)

	/* Categ ---------------------- Categ ---------------------------------- */
	app.get('/adCategs', MdRole.aderIsLogin, Categ.adCategs)
	app.get('/adCateg/:id', MdRole.aderIsLogin, Categ.adCategFilter, Categ.adCateg)
	app.get('/adCategDel/:id', MdRole.aderIsLogin, Categ.adCategFilter, Categ.adCategDel)

	app.post('/adCategUpd', MdRole.aderIsLogin, postForm, Categ.adCategUpd)

	app.get('/adCategAdd', MdRole.aderIsLogin, Categ.adCategAdd)
	app.post('/adCategNew', MdRole.aderIsLogin, postForm, Categ.adCategNew)

	/* Firm ---------------------- Firm ---------------------------------- */
	app.get('/adFirms', MdRole.aderIsLogin, Firm.adFirms)
	app.get('/adFirm/:id', MdRole.aderIsLogin, Firm.adFirmFilter, Firm.adFirm)
	app.get('/adFirmDel/:id', MdRole.aderIsLogin, Firm.adFirmFilter, Firm.adFirmDel)

	app.post('/adFirmUpd', MdRole.aderIsLogin, postForm, Firm.adFirmUpd)

	app.get('/adFirmAdd', MdRole.aderIsLogin, Firm.adFirmAdd)
	app.post('/adFirmNew', MdRole.aderIsLogin, postForm, Firm.adFirmNew)

	/* user ---------------------- user ---------------------------------- */
	app.get('/adUsers', MdRole.aderIsLogin, User.adUsers)
	app.get('/adUser/:id', MdRole.aderIsLogin, User.adUserFilter, User.adUser)
	app.get('/adUserDel/:id', MdRole.aderIsLogin, User.adUserFilter, User.adUserDel)

	app.post('/adUserUpInfo', MdRole.aderIsLogin, postForm, User.adUserUpd)
	app.post('/adUserUpPw', MdRole.aderIsLogin, postForm, MdBcrypt.rqBcrypt, User.adUserUpd)

	app.get('/adUserAdd', MdRole.aderIsLogin, User.adUserAdd)
	app.post('/adUserNew', MdRole.aderIsLogin, postForm, MdBcrypt.rqBcrypt, User.adUserNew)
}