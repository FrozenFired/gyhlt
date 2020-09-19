const Conf = require('../../../conf.js');
const Err = require('./err');

let Brand = require('../../models/firm/brand');
let Article = require('../../models/firm/article');
exports.index = (req, res) => {
	let crUser = req.session.crUser;
	if(!crUser || crUser.role == Conf.roleUser.customer.num) {
		let firm = req.session.firm;

		Brand.find({
			firm: firm._id,
			shelf: {'$gt': 0},
		})
		.limit(4)
		.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
		.exec((err, brands) => {
			if(err) {
				info = "index, Brand.find(), Error!";
				Err.usError(req, res, info);
			} else {
				Article.find({
					firm: firm._id,
					categ: Conf.article.notice.num,
					// shelf: {'$gt': 0},
				}).limit(2)
				.sort({'shelf': -1, 'weight': -1, 'upAt': -1})
				.exec((err, articles) => {
					if(err) {
						info = "index, Brand.find(), Error!";
						Err.usError(req, res, info);
					} else {
						res.render('./cter/index/index', {
							title: firm.nome,
							crUser,
							brands,
							articles
						})
					}
				})
			}
		})
	} else {
		let roleUser = null;
		for(rl in Conf.roleUser) {
			if(crUser.role == Conf.roleUser[rl].num) {
				roleUser = Conf.roleUser[rl];
				break;
			}
		}
		if(roleUser) {
			res.redirect(roleUser.index);
		} else {
			info = "登录角色错误，请截图后, 联系管理员";
			Err.usError(req, res, info);
		}
	}
}



exports.usLogin = (req, res) => {
	res.render('./login', {
		title: 'Login',
	});
}



const User = require('../../models/login/user');
const Firm = require('../../models/login/firm');
const bcrypt = require('bcryptjs');
exports.loginUser = (req, res) => {
	// let firmCode = req.body.firm.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	let code = req.body.code.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
	if(code.length < Conf.codeLenFirm+1) {
		info = "用户名不正确，请重新登陆";
		Err.usError(req, res, info);
	} else {
		let firmCode = code.substring(0,Conf.codeLenFirm)
		code = code.substring(Conf.codeLenFirm)
		let pwd = String(req.body.pwd).replace(/(\s*$)/g, "").replace( /^\s*/, '');
		if(pwd.length == 0) pwd = " ";
		Firm.findOne({code: firmCode}, (err, firm) => {
			if(err) {
				console.log(err);
				info = "登录公司数据库错误，请截图后, 联系管理员";
				Err.usError(req, res, info);
			} else if(!firm){
				info = "公司账号输入错误";
				Err.usError(req, res, info);
			} else {
				loginUserf(req, res, firm._id, code, pwd);
			}
		})
	}
}
let loginUserf = (req, res, firmId, code, pwd) => {
	User.findOne({code: code, firm: firmId})
	.populate('firm')		// header中firm的名字
	.exec((err, user) => {
		if(err) {
			console.log(err);
			info = "用户数据库不正确，请重新登陆";
			Err.usError(req, res, info);
		} else if(!user){
			info = "用户名不正确，请重新登陆";
			Err.usError(req, res, info);
		} else{
			bcrypt.compare(pwd, user.pwd, (err, isMatch) => {
				if(err) console.log(err);
				if(isMatch) {
					user.lgAt = Date.now();
					// console.log(user)
					user.save((err, objSave) => {
						if(err) console.log(err)
					})
					req.session.crUser = user;
					// console.log(req.session.crUser.firm)
					res.redirect('/');
				}
				else {
					info = "密码不正确，请重新登陆";
					Err.usError(req, res, info);
				}
			})
		}
	})
}

exports.logout = (req, res) => {
	// User
	if(req.session.crUser) delete req.session.crUser;
	// Ader
	if(req.session.crAder) delete req.session.crAder;

	res.redirect('/');
}