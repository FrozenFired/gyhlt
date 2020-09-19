$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let pdsecParam = '';
	let pdsecElemId = '';
	let role = '';
	pdsecsInit = () => {
		let pdsecFilter = $("#pdsecFilterAjax").val();
		if(pdsecFilter) {
			pdsecParam = pdsecFilter.split('@')[0];
			pdsecElemId = pdsecFilter.split('@')[1];
			role = pdsecFilter.split('@')[2];
		}
		urlQuery = pdsecParam;
		getPdsecs(urlQuery, pdsecElemId, 1, role);
	}
	pdsecsInit();

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#pdsecSearch").blur((e) => {
		$(".pdnomeClick").removeClass("btn-success");
		$(".pdnomeClick").addClass("btn-default");

		let keyword = $("#pdsecSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}
		$("#pdnomeFilter").hide();

		page = 0;
		urlQuery = pdsecParam + keyword;
		getPdsecs(urlQuery, pdsecElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getPdsecs(urlQuery+'&page='+(parseInt(page)+1), pdsecElemId, 0, role);
			}
		}
	});
})