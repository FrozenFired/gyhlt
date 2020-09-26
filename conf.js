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
		ord : { num:  40, val: '已成单' },
		unord: { num: 45, val: '未成单' },

		checking:{num: 60, val: '审核中'},
		paiding:{num: 70, val: '付款中' },
		dealing:{num: 100, val: '处理中'},
		delivering:{num:200,val:'待发货'},

		proding: { num: 120, val: '在产'},
		traning: { num: 160, val: '在途'},
		stocking:{ num: 180, val: '在库'},

		done: { num: 500, val: '完成' , },
		del : { num: 700, val: '删除' , },
	},

 	qntpdSts: [ 'quoting', 'done', 'del' ],
	qunSts: [ 'init', 'quoting', 'pricing', 'done', 'ord', 'unord'],	// 询价单状态
	qutSts: [ 'quoting', 'pricing', 'done', 'ord', 'unord' ],	// 报价单状态
 
 	dinpdSts: [ 'init', 'proding', 'traning', 'stocking', 'done' ],
	dinSts: [ 'init', 'checking', 'paiding', 'dealing', 'delivering', 'done'],	// 销售订单状态
	dutSts: [ 'init', 'checking', 'paiding', 'dealing', 'delivering', 'done'],	// 采购订单状态
}

module.exports = Conf