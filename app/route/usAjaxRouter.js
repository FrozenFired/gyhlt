const Datafile = require('../controllers/user/ajax/datafile');
const Prod = require('../controllers/user/ajax/prod');
const Getdata = require('../controllers/user/ajax/getdata');
const Stream = require('../controllers/user/ajax/stream');
const Inquot = require('../controllers/user/ajax/inquot');
const Order = require('../controllers/user/ajax/order');
const Status = require('../controllers/user/ajax/status');
const Comment = require('../controllers/user/ajax/comment');


const MdBcrypt = require('../middle/middleBcrypt');
const MdRole = require('../middle/middleRole');
const MdPicture = require('../middle/middlePicture');
const MdExcel = require('../middle/middleExcel');

const multipart = require('connect-multiparty');
const postForm = multipart();

module.exports = function(app){
	/* =================================== Prod =================================== */
	app.get('/usBrandsAjax', Prod.usBrandsAjax)
	app.get('/usPdfirsAjax', Prod.usPdfirsAjax)
	app.get('/usPdsecsAjax', Prod.usPdsecsAjax)
	app.get('/usPdthdsAjax', Prod.usPdthdsAjax)

	/* ===================== 客户搜索系列名或产品编号出的结果 ===================== */
	app.get('/usGetdataAjax', Getdata.usGetdataAjax)

	/* ===================== 获取上下游公司的结果 ===================== */
	app.get('/usStrmupsAjax', MdRole.userIsLogin, Stream.usStrmupsAjax)
	app.get('/usBuysAjax', MdRole.userIsLogin, Stream.usBuysAjax)
	app.get('/usStrmdwsAjax', MdRole.userIsLogin, Stream.usStrmdwsAjax)
	app.get('/usSellsAjax', MdRole.userIsLogin, Stream.usSellsAjax)

	/* ===================== 获取询价报价单的结果 ===================== */
	app.get('/usQunsAjax', MdRole.slerIsLogin, Inquot.usQunsAjax)
	app.get('/usQutsAjax', MdRole.qterIsLogin, Inquot.usQutsAjax)

	/* ===================== 获取询价报价单的结果 ===================== */
	app.get('/usDinsAjax', MdRole.slerIsLogin, Order.usDinsAjax)
	app.get('/usDutsAjax', MdRole.oderIsLogin, Order.usDutsAjax)
	app.get('/usBillsAjax', MdRole.oderIsLogin, Order.usBillsAjax)
	app.get('/usTransAjax', MdRole.mgerIsLogin, Order.usTransAjax)

	/* ===================== 状态更改 ===================== */
	app.get('/usInquotQuterStAjax', MdRole.userIsLogin, Status.usInquotQuterStAjax)
	app.get('/usInquotStatusAjax', MdRole.userIsLogin, Status.usInquotStatusAjax)
	app.get('/usOrdinStatusAjax', MdRole.userIsLogin, Status.usOrdinStatusAjax)
	app.get('/usOrdutStatusAjax', MdRole.userIsLogin, Status.usOrdutStatusAjax)

	/* =================================== Datafile =================================== */
	app.get('/usAlbumsAjax', Datafile.usAlbumsAjax);

	/* =================================== Comment =================================== */
	app.get('/usCommentsAjax', MdRole.userIsLogin, Comment.usCommentsAjax);
	app.post('/usCommentNewAjax', MdRole.userIsLogin, postForm, Comment.usCommentNewAjax);
	app.post('/usCommentReplyAjax', MdRole.userIsLogin, postForm, Comment.usCommentReplyAjax);
};