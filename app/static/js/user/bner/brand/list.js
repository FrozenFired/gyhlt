$(function() {
	/* ====== 初始加载 =====*/
	let brandParam = '';
	let brandElemId = '';
	let role = '';
	brandsInit = () => {
		let brandFilter = $("#brandFilterAjax").val();
		if(brandFilter) {
			brandParam = brandFilter.split('@')[0];
			brandElemId = brandFilter.split('@')[1];
			role = brandFilter.split('@')[2];
		}
		urlQuery = brandParam;
		getBrands(urlQuery, brandElemId, 1, role);
	}
	brandsInit();

	/* ====== 品牌搜索加载 =====*/
	$("#brandSearch").blur((e) => {
		let keyword = $("#brandSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
		}
		urlQuery = brandParam + keyword;
		getBrands(urlQuery, brandElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var windowHeight = $(this).height();
		var scrollHeight = $(document).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			// alert('page:'+page+' count:'+count)
			if(isMore == 1) {
				getBrands(urlQuery+'&page='+(parseInt(page)+1), brandElemId, 0, role);
			}
		}
	});
})