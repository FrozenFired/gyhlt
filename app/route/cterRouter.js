const Index = require('../controllers/aaIndex/index');

const User = require('../controllers/user/cter/user');
const Firm = require('../controllers/user/cter/firm');
const Article = require('../controllers/user/cter/article');

const Footer = require('../controllers/user/cter/footer');

const Brand = require('../controllers/user/cter/brand');
const Pdfir = require('../controllers/user/cter/pdfir');
const Pdsec = require('../controllers/user/cter/pdsec');
const Album = require('../controllers/user/cter/album');

const Ordin = require('../controllers/user/cter/ordin');
const Inquot = require('../controllers/user/cter/inquot');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/cter', (req, res) => {
		res.redirect('/');
	});
	/* =================================== User =================================== */
	// app.get('/ctUser', User.ctUser)
	app.post('/ctUserUpdInfo', MdRole.cterIsLogin, postForm, User.ctUserUpd)
	app.post('/ctUserUpdPwd', MdRole.cterIsLogin, postForm, MdBcrypt.rqBcrypt, User.ctUserUpd)

	/* =================================== Firm =================================== */
	app.get('/us', Firm.us);
	app.get('/qr', Firm.qr);
	app.get('/ctFirm', Firm.ctFirm)

	/* =================================== Footer =================================== */
	app.get('/shopping', Footer.shopping)
	app.get('/guarantee', Footer.guarantee)
	app.get('/logistics', Footer.logistics)
	app.get('/aftersale', Footer.aftersale)

	/* =================================== Article =================================== */
	app.get('/ctNotices', Article.ctNotices)
	app.get('/ctProjects', Article.ctProjects)

	app.get('/ctArticle/:id', Article.ctArticle)

	/* =================================== Brand =================================== */
	app.get('/ctBrands', Brand.ctBrands)
	app.get('/ctBrand/:id', Brand.ctBrand)

	/* =================================== Pdfir =================================== */
	app.get('/ctPdfirs', Pdfir.ctPdfirs)
	app.get('/ctPdfir/:id', Pdfir.ctPdfir)

	/* =================================== Pdsec =================================== */
	app.get('/ctPdsecs', Pdsec.ctPdsecs)
	app.get('/ctPdsec/:id', Pdsec.ctPdsec)

	/* =================================== Album =================================== */
	app.get('/ctAlbums', MdRole.userIsLogin, Album.ctAlbums)

	/* =================================== Ordin =================================== */
	app.get('/ctOrdins', MdRole.userIsLogin, Ordin.ctOrdins)
	app.get('/ordin/:id', Ordin.ordin)

	app.get('/compd/:id', Ordin.compd)
};