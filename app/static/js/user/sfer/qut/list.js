$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let qutParam = '';
	let qutElemId = '';
	let role = '';
	let statusParam = '';
	qutsInit = () => {
		let qutFilter = $("#qutFilterAjax").val();
		if(qutFilter) {
			qutParam = qutFilter.split('@')[0];
			qutElemId = qutFilter.split('@')[1];
			role = qutFilter.split('@')[2];
			statusParam = qutFilter.split('@')[3];
		}
		urlQuery = qutParam+'&quter=null'+statusParam;
		getQuts(urlQuery, qutElemId, 1, role);
	}
	qutsInit();

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
		urlQuery = qutParam + statusParam;
		getQuts(urlQuery, qutElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#qutSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#qutSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#qutSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = qutParam + keyword;
		getQuts(urlQuery, qutElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getQuts(urlQuery+'&page='+(parseInt(page)+1), qutElemId, 0, role);
			}
		}
	});
})