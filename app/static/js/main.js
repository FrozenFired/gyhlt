const cdn = 'http://192.168.1.5:8000';
const dns = 'http://192.168.1.5:8000';

/* ============= 页面滚动 三级导航事件 ============= */
let p=0, t=0;
$(window).scroll(function(event){
	p=$(this).scrollTop();
	if(t<p){
		$(".scrollDownHide").hide();
		$(".scrollDownShow").show();
	} else if(t>p){
		$(".scrollDownHide").show();
		$(".scrollDownShow").hide();
	}
	setTimeout(function(){ t = p ; },0)
});
/* ============= 页面滚动 三级导航事件 ============= */

$(function() {
	var resizeWindow = function() {
		let minH = 0;
		if($(window).width()<992) {
			minH = 250;
			$('.pcSpace').hide()
			$('.mbSpace').show()
		} else {
			minH = 300;
			$('.mbSpace').hide()
			$('.pcSpace').show()
		}
		// console.log($(window).height())
		// console.log($(document.body).height())
		let browH = $(window).height()
		let bodyH = $(document.body).height()
		$('.homeSpace').height(browH-minH)
		if(bodyH < browH) {
			footH = browH - bodyH
			$('.footerSpace').height(footH)
		}
	}
	resizeWindow();
	$(window).resize(function () {		//当浏览器大小变化时
		resizeWindow()
	});

	$(".footerSearch").click(function(e) {
		$("#footerSearch").toggle();
	})
	$("#headerSearch").click(function(e) {
	})
})


let isFloat = function(num) {
	if(num.length == 0){
		return false
	} else {
		let nums = num.split('.')
		if(nums.length > 2){
			return false
		} else {
			let n0 = nums[0]
			if(nums.length == 1){
				if(isNaN(n0)) {
					return false
				} else {
					return true
				}
			} else {
				let n1 = nums[1]
				if(isNaN(n0)) {
					return false
				} else {
					if(n1 && isNaN(n1)) {
						return false
					} else {
						return true
					}
				}
			}
		}
	}
}

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}

function transformTime(time = +new Date(), start =0, end = 19) {
	var date = new Date(time);
	return date.toJSON().substr(start, end).replace('T', ' ');
}
function timeSpan(time = +new Date()) {
	var date = new Date(time);
	var now = Date.now();
	let tsNum = now - date.getTime();
	var years = Math.floor(tsNum/(365*24*3600*1000))
	if(years > 1) {
		return years + '年前'
	} 
	var months=Math.floor(tsNum/(30*24*3600*1000))
	if(months > 1) {
		return months + '个月前'
	} 
	var days=Math.floor(tsNum/(24*3600*1000))
	if(days > 1) {
		return days + '天前'
	} 
	var hours=Math.floor(tsNum/(3600*1000))
	if(hours > 1) {
		return hours + '小时前'
	}
	var minits=Math.floor(tsNum/(60*1000))
	if(minits > 1) {
		return minits + '分钟前'
	}
	var seconds=Math.floor(tsNum/(1000))
	if(seconds < 1) seconds = 1;
	return seconds + '秒前'
}





let Conf = {
	firmId: '5eea52c7e61fa97e3ff44fdb',
	codeLenFirm: 3,
	dinDay: 200,

	categFirm: {
		factory: {num: 0, val: '工厂'},
		proxy: {num: 1, val: '代理'},
		dealer: {num: 2, val: '经销'},
		store: {num: 3, val: '门店'},
	},

	roleAdmin: [1, 3],
	// roles: [1, 3, 5, 10, 20, 25, 30, 35, 40, 60, 90],
	roleUser: {
		boss:     {num: 1, index: '/bser', code: 'bs', val: 'BOSS', },
		manager:  {num: 3, index: '/mger', code: 'mg', val: 'Manager', },
		staff:    {num: 5, index: '/sfer', code: 'sf', val: 'Staff', },
		finance:  {num:10, index: '/fner', code: 'fn', val: 'Finance', },
		brander:  {num:20, index: '/bner', code: 'bn', val: 'Brander', },
		promotion:{num:25, index: '/pmer', code: 'pm', val: 'Promotion', },
		quotation:{num:30, index: '/qter', code: 'qt', val: 'Quotation', },
		ordin:    {num:35, index: '/oder', code: 'od', val: 'Ordin', },
		logistic: {num:40, index: '/lger', code: 'lg', val: 'Logistic', },
		seller:   {num:60, index: '/sler', code: 'sl', val: 'Seller', },
		customer: {num:90, index: '/cter', code: 'ct', val: 'Customer', },
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
		tranpre: { num: 550, val: '待运'},
		traning: { num: 600, val: '在途'},
		stocking:{ num: 700, val: '在库'},

		customin: {num: 580, val: '报关'},
		shipping: {num: 620, val: '海运'},
		customut: {num: 650, val: '清关'},

		done: { num: 1000, val: '完成' , },
		del : { num: 2000, val: '删除' , },
	},

	qutSts: [ 'quoting', 'pricing', 'confirm', 'pending', 'ord', 'unord' ],	// 报价单状态
	qunSts: [ 'init', 'quoting', 'pricing', 'confirm', 'pending', 'ord', 'unord'],	// 询价单状态
 	qntpdSts: [ 'quoting', 'done', 'del' ],
 
	dinSts: [ 'unpaid', 'deposit', 'payoff', 'done'],	// 销售订单状态
 	dinpdSts: [ 'init', 'waiting', 'proding', 'tranpre', 'traning', 'stocking', 'done' ],
	dutSts: [ 'init', 'unpaid', 'deposit', 'payoff', 'done'],	// 采购订单状态

	tranSts: [ 'init', 'customin', 'shipping', 'customut', 'done'],	// 运输单状态
}