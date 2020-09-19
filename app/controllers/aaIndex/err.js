exports.usError = (req, res, info) => {
	res.render('./wrongPage', {
		title: '500-15 Page',
		info: info
	});
}

exports.jsonErr = (req, res, info) => {
	res.json({
		status: 0,
		msg: info,
		data: {}
	})
}