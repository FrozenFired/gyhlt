$(function() {
	let height;
	let width;
	let brandPostLen = parseInt($("#brandPostLen").val());
	/* ====== 首页海报获取宽度和高度 =====*/
	var postArea = function() {
		height = $(window).height()
		width = $(window).width()
		if(height > width) height = width/1.5;
		$(".brandPost").css({"position": "relative", "width":width,"height":height/1.2})
		$(".brandTitle").css({"position": "absolute", "bottom": 20,"width":'100%',})

		$(".firmPost").css({"width":width, "min-height":height})
		$(".postTitle").css({"line-height": height, "text-align": "center;"})
	}
	postArea();
	$(window).resize(function () {		//当浏览器大小变化时
		postArea()
	});

	/* ====== 首页海报循环播放 =====*/
	let firmPostLen = parseInt($("#firmPostLen").val());
	var i = 0;
	setInterval(function(){
		i++;
		$(".firmPost").fadeOut("slow");
		$("#firmPost"+i).fadeIn("slow");
		// $(".firmPost").hide("slow");
		// $("#firmPost"+i).show("slow");
		// alert(i)
		if(i == firmPostLen) i=0;
	}, 4000)

	/* ====== 首页海报循环播放 =====*/

	/* ====== 品牌加载 =====*/
	let urlQuery = '';
	let brandParam = '';
	let brandElemId = '';
	let role = '';
	cterInit = () => {
		let brandFilter = $("#brandFilterAjax").val();
		if(brandFilter) {
			brandParam = brandFilter.split('@')[0];
			brandElemId = brandFilter.split('@')[1];
			role = brandFilter.split('@')[2];
		}
		urlQuery = brandParam;
		getBrands(urlQuery, brandElemId, 1, role);
	}
	cterInit();

	// $(brandElemId).on('click', '.moreBrand', function(e) {
	// 	if(isMore == 1) {
	// 		getBrands(urlQuery+'&page='+(parseInt(page)+1), brandElemId, 0, role);
	// 	}
	// })
})