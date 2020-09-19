const MdRole = require('../middle/middleRole');

module.exports = function(app){

	app.get('/bser', MdRole.bserIsLogin, (req, res) => {
		let crUser = req.session.crUser;
		res.render('./user/bser/index/index', {
			title: '公司管理',
			crUser : crUser,
		})
	});
	/* =================================== User =================================== */
};