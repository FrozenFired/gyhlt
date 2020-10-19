const Compd = require('../controllers/user/user/compd');

const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdFile = require('../middle/middleFile');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){

	app.post('/compdImagesUpd', MdRole.userIsLogin, postForm, MdPicture.imgsNew, Compd.compdImagesUpd)
	// app.post('/slQunpdUpd', MdRole.slerIsLogin, postForm, MdPicture.photoNew,MdPicture.sketchNew,MdPicture.imgsNew, Qunpd.slQunpdUpd)
};