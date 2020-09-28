$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let pdfirParam = '';
	let pdfirElemId = '';
	let role = '';
	let ifload = '';
	pdfirsInit = () => {
		let pdfirFilter = $("#pdfirFilterAjax").val();
		if(pdfirFilter) {
			pdfirParam = pdfirFilter.split('@')[0];
			pdfirElemId = pdfirFilter.split('@')[1];
			role = pdfirFilter.split('@')[2];
		}
		ifload = $("#ifload").val();
		urlQuery = pdfirParam;
		getPdfirs(urlQuery, pdfirElemId, 1, role);
	}
	pdfirsInit();

	var pdnomeListOpt = function(pdnome) {
		if(!pdnome || pdnome.length < 1) {
			pdnome = '';
		} else {
			pdnome = "&pdnome=" + pdnome;
		}

		page = 0;
		urlQuery = pdfirParam + pdnome;
		getPdfirs(urlQuery, pdfirElemId, 1, role);

		$(".pdfirSearch").val('');
	}
	if(getUrlParam("pdnome") != null) {
		setTimeout(function(){
			let pdnome = getUrlParam("pdnome");
			$("#pdnomeSel").val(pdnome)
			pdnomeListOpt(pdnome)
		}, 300)
	}
	/* ====== 点击品类名 显示系列 ====== */
	$("#pdnomeSel").change(function(e) {
		let pdnome = $(this).val();
		pdnomeListOpt(pdnome);
	})

	/* ====== 根据搜索关键词 显示系列 ====== */
	$(".pdfirSearch").blur((e) => {
		let keyword = $(".pdfirSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
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

	$(".ifload").click(function(e) {
		ifload = "loadyes"
		$(this).hide();
	})
	$(window).scroll(function(){
		if(ifload != "loadno") {
			var scrollTop = $(this).scrollTop();
			var windowHeight = $(this).height();
			var scrollHeight = $(document).height();
			if(scrollTop + windowHeight + 58 > scrollHeight){
				// alert('page:'+page+' count:'+count)
				if(isMore == 1) {
					getPdfirs(urlQuery+'&page='+(parseInt(page)+1), pdfirElemId, 0, role);
				}
			}
		}
	});
})