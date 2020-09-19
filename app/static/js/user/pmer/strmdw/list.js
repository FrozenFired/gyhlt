$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let strmdwParam = '';
	let strmdwElemId = '';
	let role = '';
	strmdwsInit = () => {
		let strmdwFilter = $("#strmdwFilterAjax").val();
		if(strmdwFilter) {
			strmdwParam = strmdwFilter.split('@')[0];
			strmdwElemId = strmdwFilter.split('@')[1];
			role = strmdwFilter.split('@')[2];
		}
		urlQuery = strmdwParam;
		getStrmdws(urlQuery, strmdwElemId, 1, role);
	}
	strmdwsInit();

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
		urlQuery = strmdwParam + categ;
		getStrmdws(urlQuery, strmdwElemId, 1, role);
		
		$(".categClick").removeClass("btn-success");
		$(".categClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#strmdwSearch").val('');
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#strmdwSearch").blur((e) => {
		$(".categClick").removeClass("btn-success");
		$(".categClick").addClass("btn-default");

		let keyword = $("#strmdwSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#categAll").removeClass("btn-default");
			$("#categAll").addClass("btn-success");
		}

		page = 0;
		urlQuery = strmdwParam + keyword;
		getStrmdws(urlQuery, strmdwElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getStrmdws(urlQuery+'&page='+(parseInt(page)+1), strmdwElemId, 0, role);
			}
		}
	});
})