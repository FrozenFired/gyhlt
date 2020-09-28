$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let pdfirParam = '';
	let pdfirElemId = '';
	let role = '';
	pdfirsInit = () => {
		let pdfirFilter = $("#pdfirFilterAjax").val();
		if(pdfirFilter) {
			pdfirParam = pdfirFilter.split('@')[0];
			pdfirElemId = pdfirFilter.split('@')[1];
			role = pdfirFilter.split('@')[2];
		}
		urlQuery = pdfirParam;
		getPdfirs(urlQuery, pdfirElemId, 1, role);
	}
	pdfirsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".pdnomeClick").click(function(e) {
		let target = $(e.target);
		let pdnome = target.data("pdnome");
		if(!pdnome || pdnome.length < 1) {
			pdnome = '';
		} else {
			pdnome = "&pdnome=" + pdnome;
		}

		page = 0;
		urlQuery = pdfirParam + pdnome;
		getPdfirs(urlQuery, pdfirElemId, 1, role);

		$(".pdnomeClick").removeClass("btn-success");
		$(".pdnomeClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#pdfirSearch").val('');
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#pdfirSearch").blur((e) => {
		$(".pdnomeClick").removeClass("btn-success");
		$(".pdnomeClick").addClass("btn-default");

		let keyword = $("#pdfirSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}

		page = 0;
		urlQuery = pdfirParam + keyword;
		getPdfirs(urlQuery, pdfirElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getPdfirs(urlQuery+'&page='+(parseInt(page)+1), pdfirElemId, 0, role);
			}
		}
	});
})