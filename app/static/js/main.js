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
	// 如果input中的值为0 则隐藏
	$("input").focus(function(e) {
		let thisVal = $(this).val();
		if(!thisVal || thisVal == 0) {
			$(this).val('')
		}
	})
	// ajaxForm 不提交 交给js中的ajax处理
	$(".ajaxForm").submit(function(e) {
		e.preventDefault();
	})
	// 图片放大
	$("body").on('click', '.thumbnailImg', function(){
		var _this = $(this);//将当前的thumbnailImg元素作为_this传入函数
		imgShow("#outerdiv", "#innerdiv", "#zoomImg", _this);
	});
})

let imgShow = function(outerdiv, innerdiv, zoomImg, _this){
	var src = _this.attr("src");//获取当前点击的thumbnailImg元素中的src属性
	$(zoomImg).attr("src", src);//设置#zoomImg元素的src属性
	/*获取当前点击图片的真实大小，并显示弹出层及大图*/
	$("<img/>").attr("src", src).on('load', function(){
		var windowW = $(window).width();//获取当前窗口宽度
		var windowH = $(window).height();//获取当前窗口高度
		var realWidth = this.width;//获取图片真实宽度
		var realHeight = this.height;//获取图片真实高度
		var imgWidth, imgHeight;
		var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
		if(realHeight>windowH*scale) { //判断图片高度
			imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
			imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
			if(imgWidth>windowW*scale) { //如宽度扔大于窗口宽度
				imgWidth = windowW*scale;//再对宽度进行缩放
			}
		} else if(realWidth>windowW*scale) { //如图片高度合适，判断图片宽度
			imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
			imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
		} else if(realWidth<windowW*scale/2) { //如图片高度合适，判断图片宽度
			imgWidth = realWidth*2;//如大于窗口宽度，图片宽度进行缩放
			if(imgWidth<windowW*scale/2) {
				imgWidth *= 2;
			}
			imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
			if(imgHeight>windowH*scale) { //如高度大于窗口高度
				imgWidth /= 2;
				imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
			}
		} else { //如果图片真实高度和宽度都符合要求，高宽不变
			imgWidth = realWidth;
			imgHeight = realHeight;
		}
		$(zoomImg).css("width",imgWidth);//以最终的宽度对图片缩放

		var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
		var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
		$(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
		$(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.thumbnailImg
	});

	$(outerdiv).click(function(){ //再次点击淡出消失弹出层
		$(this).fadeOut("fast");
	});
}
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
		order:    {num:35, index: '/oder', code: 'od', val: 'Order', },
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