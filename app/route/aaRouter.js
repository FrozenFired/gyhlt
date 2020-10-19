const Index = require('../controllers/aaIndex/index');

module.exports = function(app){
	const Conf = require('../../conf');
	const Firm = require('../models/login/firm');
	app.use(function(req, res, next) {
		Firm.findOne({_id: Conf.firmId}, (err, firm) => {
			if(err) {
				console.log(err);
				let info = '信息加载错误, 请联系工作人员 +39 3888787897'
				res.render('./wrongPage', {
					title: '500-15 Page',
					info: info
				});
			} else if(!firm) {
				let info = '信息加载错误, 请联系工作人员 +39 3888787897'
				res.render('./wrongPage', {
					title: '500-15 Page',
					info: info
				});
			} else {
				req.session.firm = firm
				app.locals.firm = firm
				return next()
			}
		})
	})

	// index -------- Vder 首页 登录页面 登录 登出 -----------
	app.get('/', Index.index);
	app.get('/usLogin', Index.usLogin);
	app.post('/loginUser', Index.loginUser);
	app.get('/logout', Index.logout);

};