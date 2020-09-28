$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let dinParam = '';
	let dinElemId = '';
	let role = '';
	let statusParam = '';
	dinsInit = () => {
		let dinFilter = $("#dinFilterAjax").val();
		if(dinFilter) {
			dinParam = dinFilter.split('@')[0];
			dinElemId = dinFilter.split('@')[1];
			role = dinFilter.split('@')[2];
			statusParam = dinFilter.split('@')[3];
		}
		urlQuery = dinParam+statusParam;
		getDins(urlQuery, dinElemId, 1, role);
	}
	dinsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".statusClick").click(function(e) {
		let target = $(e.target);
		let status = target.data("status");

		if((!status && status != 0) || status.length < 1) {
			statusParam = '';
		} else {
			statusParam = "&status=" + status;
		}

		page = 0;
		urlQuery = dinParam + statusParam;
		getDins(urlQuery, dinElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#dinSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#dinSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#dinSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = dinParam + keyword;
		getDins(urlQuery, dinElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getDins(urlQuery+'&page='+(parseInt(page)+1), dinElemId, 0, role);
			}
		}
	});
})