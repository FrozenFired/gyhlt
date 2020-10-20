const Index = require('../controllers/aaIndex/index');

const Pdnome = require('../controllers/user/bner/pdnome');

const Brand = require('../controllers/user/bner/brand');
const Pdfir = require('../controllers/user/bner/pdfir');
const Pdsec = require('../controllers/user/bner/pdsec');
const Pdthd = require('../controllers/user/bner/pdthd');
const Album = require('../controllers/user/bner/album');

const Strmup = require('../controllers/user/bner/strmup');
const Buy = require('../controllers/user/bner/buy');


const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.get('/bner', MdRole.bnerIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/bner/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});
	/* =================================== Pdnome =================================== */
	app.post('/bnPdnomeNew', MdRole.bnerIsLogin, postForm, Pdnome.bnPdnomeNew);
	app.get('/bnPdnomeDelAjax', MdRole.bnerIsLogin, Pdnome.bnPdnomeDelAjax);

	/* ============================= Supplier Upstream ============================= */
	app.get('/bnStrmups', MdRole.bnerIsLogin, Strmup.bnStrmups)
	app.get('/bnStrmupAdd', MdRole.bnerIsLogin, Strmup.bnStrmupAdd)
	app.get('/bnStrmup/:id', MdRole.bnerIsLogin, Strmup.bnStrmup)
	app.get('/bnStrmupUp/:id', MdRole.bnerIsLogin, Strmup.bnStrmupUp)
	app.get('/bnStrmupDel/:id', MdRole.bnerIsLogin, Strmup.bnStrmupDel)

	app.post('/bnStrmupNew', MdRole.bnerIsLogin, postForm, Strmup.bnStrmupNew)
	app.post('/bnStrmupUpd', MdRole.bnerIsLogin, postForm, Strmup.bnStrmupUpd)
	/* ============================= Supplier discount ============================= */
	app.get('/bnBuys', MdRole.bnerIsLogin, Buy.bnBuys)
	app.get('/bnBuyAdd', MdRole.bnerIsLogin, Buy.bnBuyAdd)
	app.get('/bnBuy/:id', MdRole.bnerIsLogin, Buy.bnBuy)
	app.get('/bnBuyUp/:id', MdRole.bnerIsLogin, Buy.bnBuyUp)
	app.get('/bnBuyDel/:id', MdRole.bnerIsLogin, Buy.bnBuyDel)

	app.post('/bnBuyNew', MdRole.bnerIsLogin, postForm, Buy.bnBuyNew)
	app.post('/bnBuyUpd', MdRole.bnerIsLogin, postForm, Buy.bnBuyUpd)

	app.get('/bnBuyBrands', MdRole.bnerIsLogin, Buy.bnBuyBrands)
	app.get('/bnBuyBrand/:id', MdRole.bnerIsLogin, Buy.bnBuyBrand)
	app.post('/bnBuyBrandUpd', MdRole.bnerIsLogin, postForm, Buy.bnBuyBrandUpd)

	/* =================================== Brand =================================== */
	app.get('/bnBrands', MdRole.bnerIsLogin, Brand.bnBrands)
	app.post('/bnBrandNew', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Brand.bnBrandNew)
	app.post('/bnBrandUpd', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Brand.bnBrandUpd)
	app.post('/bnBrandUpdForce', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Brand.bnBrandUpdForce)
	app.get('/bnBrand/:id', MdRole.bnerIsLogin, Brand.bnBrand)
	app.get('/bnBrandUp/:id', MdRole.bnerIsLogin, Brand.bnBrandUp)
	app.get('/bnBrandDel/:id', MdRole.bnerIsLogin, Brand.bnBrandDel)
	app.get('/bnBrandAdd', MdRole.bnerIsLogin, Brand.bnBrandAdd)

	app.post('/bnBrandPdnomeNew', MdRole.bnerIsLogin, postForm, Brand.bnBrandPdnomeNew)
	app.get('/bnBrandPdnomeDelAjax', MdRole.bnerIsLogin, Brand.bnBrandPdnomeDelAjax)
	/* =================================== Brand =================================== */

	/* =================================== Pdfir =================================== */
	app.get('/bnPdfirs', MdRole.bnerIsLogin, Pdfir.bnPdfirs)
	app.get('/bnPdfirsUpPdnomeForce', MdRole.bnerIsLogin, Pdfir.bnPdfirsUpPdnomeForce)
	app.get('/bnPdfir/:id', MdRole.bnerIsLogin, Pdfir.bnPdfir)
	app.get('/bnPdfirUp/:id', MdRole.bnerIsLogin, Pdfir.bnPdfirUp)
	app.get('/bnPdfirDel/:id', MdRole.bnerIsLogin, Pdfir.bnPdfirDel)

	app.post('/bnPdfirsUpdPdnomeForce', MdRole.bnerIsLogin, postForm, Pdfir.bnPdfirsUpdPdnomeForce);
	app.post('/bnPdfirNew', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Pdfir.bnPdfirNew)
	app.post('/bnPdfirUpd', MdRole.bnerIsLogin, postForm, Pdfir.bnPdfirUpd)
	// app.post('/bnPdfirPicUpd', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Pdfir.bnPdfirPicUpd)

	/* =================================== Pdsec =================================== */
	app.get('/bnPdsecs', MdRole.bnerIsLogin, Pdsec.bnPdsecs)
	app.get('/bnPdsec/:id', MdRole.bnerIsLogin, Pdsec.bnPdsec)
	app.get('/bnPdsecUp/:id', MdRole.bnerIsLogin, Pdsec.bnPdsecUp)
	app.get('/bnPdsecDel/:id', MdRole.bnerIsLogin, Pdsec.bnPdsecDel)

	app.post('/bnPdsecNew', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Pdsec.bnPdsecNew)
	app.post('/bnPdsecUpd', MdRole.bnerIsLogin, postForm, MdPicture.pictureNew, Pdsec.bnPdsecUpd)

	/* =================================== Pdthd =================================== */
	app.get('/bnPdthd/:id', MdRole.bnerIsLogin, Pdthd.bnPdthd)
	app.get('/bnPdthdUp/:id', MdRole.bnerIsLogin, Pdthd.bnPdthdUp)
	app.get('/bnPdthdDel/:id', MdRole.bnerIsLogin, Pdthd.bnPdthdDel)

	app.post('/bnPdthdNew', MdRole.bnerIsLogin, postForm, Pdthd.bnPdthdNew)
	app.post('/bnPdthdUpd', MdRole.bnerIsLogin, postForm, Pdthd.bnPdthdUpd)

	/* =================================== Album =================================== */
	app.get('/bnAlbums', MdRole.bnerIsLogin, Album.bnAlbums)
	app.get('/bnAlbum/:id', MdRole.bnerIsLogin, Album.bnAlbum)
	app.get('/bnAlbumAdd', MdRole.bnerIsLogin, Album.bnAlbumAdd)
	app.post('/bnAlbumNew', MdRole.bnerIsLogin, postForm, MdFile.fileNew, Album.bnAlbumNew)
	app.get('/bnAlbumDel/:id', MdRole.bnerIsLogin, Album.bnAlbumDel)

};