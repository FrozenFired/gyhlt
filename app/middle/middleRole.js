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
				info = "此账号在其他地方登陆过, 请退出后 重新登陆!";
				Err.usError(req, res, info);
			}
		} 
	});
};


exports.bserIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.boss.num) {
		next();
	} else {
		info = "您没有此权限, 需要bser部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.mgerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.boss.num) {
		next();
	} else if(crUser.role == Conf.roleUser.manager.num) {
		next();
	} else {
		info = "您没有此权限, 需要mger部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.fnerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.finance.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要fner部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.sferIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else if(crUser.role == Conf.roleUser.staff.num) {
		next();
	} else {
		info = "您没有此权限, 需要sfer部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.bnerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.brander.num) {
		next();
	} else if(crUser.role == Conf.roleUser.quotation.num) {
		//  因为报价部 在报价的时候可以添加产品
		next();
	} else if(crUser.role == Conf.roleUser.order.num) {
		//  因为报价部 在报价的时候可以添加产品
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要bner部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.qterIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.quotation.num) {
		next();
	} else if(crUser.role == Conf.roleUser.order.num) {
		//  订单部可以看到报价部报价 为了对应订单
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要qter部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.slerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.seller.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要sler部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.oderIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.order.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要oder部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.lgerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.logistic.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要lger部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.pmerIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.promotion.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要pmer部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};

exports.cterIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else if(crUser.role == Conf.roleUser.customer.num) {
		next();
	} else if(Conf.roleAdmin.includes(crUser.role)) {
		next();
	} else {
		info = "您没有此权限, 需要cter部, 请联系管理员!";
		Err.usError(req, res, info);
	}
};


exports.userIsLogin = function(req, res, next) {
	let crUser = req.session.crUser;
	if(!crUser) {
		info = "请登陆您的账号!";
		Err.usError(req, res, info);
	} else {
		next();
	}
};