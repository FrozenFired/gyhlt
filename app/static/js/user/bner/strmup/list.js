$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let strmupParam = '';
	let strmupElemId = '';
	let role = '';
	strmupsInit = () => {
		let strmupFilter = $("#strmupFilterAjax").val();
		if(strmupFilter) {
			strmupParam = strmupFilter.split('@')[0];
			strmupElemId = strmupFilter.split('@')[1];
			role = strmupFilter.split('@')[2];
		}
		urlQuery = strmupParam;
		getStrmups(urlQuery, strmupElemId, 1, role);
	}
	strmupsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".categClick").click(function(e) {
		let target = $(e.target);
		let categ = target.data("categ");
		if(categ != 0 && (!categ || isNaN(categ))) {
			categ = '';
		} else {
			categ = "&categ=" + categ;
		}
		
		page = 0;
		urlQuery = strmupParam + categ;
		getStrmups(urlQuery, strmupElemId, 1, role);
		
		$(".categClick").removeClass("btn-success");
		$(".categClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#strmupSearch").val('');
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#strmupSearch").blur((e) => {
		$(".categClick").removeClass("btn-success");
		$(".categClick").addClass("btn-default");

		let keyword = $("#strmupSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#categAll").removeClass("btn-default");
			$("#categAll").addClass("btn-success");
		}

		page = 0;
		urlQuery = strmupParam + keyword;
		getStrmups(urlQuery, strmupElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getStrmups(urlQuery+'&page='+(parseInt(page)+1), strmupElemId, 0, role);
			}
		}
	});
})