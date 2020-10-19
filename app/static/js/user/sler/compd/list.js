$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let qunpdParam = '';
	let qunpdElemId = '';
	let role = '';
	compdsInit = () => {
		let qunpdFilter = $("#qunpdFilterAjax").val();
		if(qunpdFilter) {
			qunpdParam = qunpdFilter.split('@')[0];
			qunpdElemId = qunpdFilter.split('@')[1];
			role = qunpdFilter.split('@')[2];
		}
		urlQuery = qunpdParam;
		getQunpds(urlQuery, qunpdElemId, 1, role);
	}
	compdsInit();

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#qunpdSearch").blur((e) => {
		$(".pdnomeClick").removeClass("btn-success");
		$(".pdnomeClick").addClass("btn-default");

		let keyword = $("#qunpdSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}

		page = 0;
		urlQuery = qunpdParam + keyword;
		getQunpds(urlQuery, qunpdElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getQunpds(urlQuery+'&page='+(parseInt(page)+1), qunpdElemId, 0, role);
			}
		}
	});
})