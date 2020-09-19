exports.shopping = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/footer/shopping', {
		title: '购物指南',
		crUser,
	})
}

exports.guarantee = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/footer/guarantee', {
		title: '服务保障',
		crUser,
	})
}

exports.logistics = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/footer/logistics', {
		title: '配送方式',
		crUser,
	})
}

exports.aftersale = (req, res) => {
	let crUser = req.session.crUser;

	res.render('./cter/footer/aftersale', {
		title: '售后服务',
		crUser,
	})
}