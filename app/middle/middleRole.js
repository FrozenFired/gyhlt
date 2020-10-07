let AdIndex = require('../controllers/ader/index');
exports.aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder;
	if(!crAder) {
		info = "需要您的 Administrator 账户,请输入";
		AdIndex.adOptionWrong(req, res, info);
	} else {
		next();
	}
};




const Conf = require('../../conf');
let User = require('../models/login/user');
let Err = require('../controllers/aaIndex/err');
exports.singleUsLogin = function(req, res, next){
	let crUser = req.session.crUser;
	User.findById(crUser._id, function(err, user){ 
		if(err) {
			console.log(err);
			info = "singleUsLogin, User.findById, Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此帐号已经被删除!";
			Err.usError(req, res, info);
		} else {
			let crLog = (new Date(crUser.logAt)).getTime();
			let atLog = (new Date(user.logAt)).getTime();
			if(crLog == atLog){
				next();
			}else{
				res.redirect('/usLogin');
			}
		} 
	});
};


exports.bserIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.boss.num) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.mgerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.boss.num) {
		next();
	} else if(crUser.role == Conf.roleUser.manager.num) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.sferIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else if(crUser.role == Conf.roleUser.staff.num) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.bnerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.brander.num) {
		next();
	} else if(crUser.role == Conf.roleUser.quotation.num) {
		//  因为报价部 在报价的时候可以添加产品
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.qterIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.quotation.num) {
		next();
	} else if(crUser.role == Conf.roleUser.ordin.num) {
		//  订单部可以看到报价部报价 为了对应订单
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.slerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.seller.num) {
		next();
	} else if(crUser.role == Conf.roleUser.ordin.num) {
		//  订单部可以看到销售单
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.oderIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.ordin.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.pmerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.promotion.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};

exports.cterIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else if(crUser.role == Conf.roleUser.customer.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		res.redirect('/usLogin');
	}
};


exports.userIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		res.redirect('/usLogin');
	} else {
		next();
	}
};