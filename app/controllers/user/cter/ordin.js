exports.ctOrdins = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/ordin/list', {
		title: '我的订单',
		crUser,
	})
}