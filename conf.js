let Conf = {
	firmId: '5eea52c7e61fa97e3ff44fdb',
	codeLenFirm: 3,
	categFirm: {
		factory: {num: 0, val: '工厂'},
		proxy: {num: 1, val: '代理'},
		dealer: {num: 2, val: '经销'},
		store: {num: 3, val: '门店'},
	},

	roleAdmin: [1, 3],
	// roles: [1, 3, 5, 10, 20, 25, 30, 35, 40, 60, 90],
	roleUser: {
		boss: {num: 1, val: 'BOSS', index: '/bser'},
		manager: {num: 3, val: 'Manager', index: '/mger'},
		staff: {num: 5, val: 'Staff', index: '/sfer'},
		finance: {num: 10, val: 'Finance', index: '/fner'},
		brander: {num: 20, val: 'Brander', index: '/bner'},
		promotion: {num: 25, val: 'Promotion', index: '/pmer'},
		quotation: {num: 30, val: 'Quotation', index: '/qter'},
		ordin: {num: 35, val: 'Ordin', index: '/oder'},
		logistic: {num: 40, val: 'Logistic', index: '/lger'},
		seller: {num: 60, val: 'Seller', index: '/sler'},
		customer: {num: 90, val: 'Customer', index: '/cter'},
	},

	userLang: {
		cn: {num: 0, val: '中文'},
		en: {num: 1, val: 'English'},
		it: {num: 2, val: 'Italiano'},
	},
	article: {
		notice: {num: 1, val: '新闻'},
		project: {num: 2, val: '项目案例'},
	},

	shelf: {0: '下架', 1: '上架', 2: '推荐'},
	accept: {
		no: {num: 0, val: '未连接'},
		yes: {num: 1, val: '已连接'},
	},

	picDefault: {
		article: '/upload/article/1.jpg',		// 品牌logo
		brand: '/upload/brand/1.jpg',		// 品牌logo
		pdfir: '/upload/pdfir/1.jpg',		// 系列
		pdsec: '/upload/pdsec/1.jpg',		// 产品
	},
	picPath: {
		article: '/article/',					// 品牌logo
		brand: '/brand/',					// 品牌logo
		pdfir: '/pdfir/',					// 系列
		pdsec: '/pdsec/',					// 产品
		compd: '/compd/',					// 询价单图片
	},
	filePath: {
		album: '/album/',					// 图册
	},

	status: {
		init: { num: 10, val: '创建中'},

		quoting: {num: 20, val: '报价中'},
		pricing: {num: 30, val: '定价中'},
		confirm: {num: 35, val: '确认中'},
		pending: {num: 40, val: '待付款'},
		ord : { num:  45, val: '已成单' },
		unord: { num: 50, val: '未成单' },

		unpaid: {num: 100, val: '未付'},
		deposit: {num: 300, val: '已付首款'},
		payoff : {num: 500, val: '已付清'},

		waiting: { num: 200, val: '等待生产'},
		proding: { num: 400, val: '在产'},
		traning: { num: 600, val: '在途'},
		stocking:{ num: 700, val: '在库'},

		done: { num: 1000, val: '完成' , },
		del : { num: 2000, val: '删除' , },
	},

	qutSts: [ 'quoting', 'pricing', 'confirm', 'pending', 'ord', 'unord' ],	// 报价单状态
	qunSts: [ 'init', 'quoting', 'pricing', 'confirm', 'pending', 'ord', 'unord'],	// 询价单状态
 	qntpdSts: [ 'quoting', 'done', 'del' ],
 
	dinSts: [ 'unpaid', 'deposit', 'payoff', 'done'],	// 销售订单状态
 	dinpdSts: [ 'init', 'waiting', 'proding', 'traning', 'stocking', 'done' ],
	dutSts: [ 'init', 'unpaid', 'deposit', 'payoff', 'done'],	// 采购订单状态
}

module.exports = Conf