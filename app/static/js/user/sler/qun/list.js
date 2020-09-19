$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let qunParam = '';
	let qunElemId = '';
	let role = '';
	let statusParam = '';
	qunsInit = () => {
		let qunFilter = $("#qunFilterAjax").val();
		if(qunFilter) {
			qunParam = qunFilter.split('@')[0];
			qunElemId = qunFilter.split('@')[1];
			role = qunFilter.split('@')[2];
			statusParam = qunFilter.split('@')[3];
		}
		urlQuery = qunParam+statusParam;
		getQuns(urlQuery, qunElemId, 1, role);
	}
	qunsInit();

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
		urlQuery = qunParam + statusParam;
		getQuns(urlQuery, qunElemId, 1, role);
		
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#qunSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#qunSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#qunSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = qunParam + keyword;
		getQuns(urlQuery, qunElemId, 1, role);
	})

	

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getQuns(urlQuery+'&page='+(parseInt(page)+1), qunElemId, 0, role);
			}
		}
	});
})