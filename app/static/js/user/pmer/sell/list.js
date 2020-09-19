$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let sellParam = '';
	let sellElemId = '';
	let role = '';
	sellsInit = () => {
		let sellFilter = $("#sellFilterAjax").val();
		if(sellFilter) {
			sellParam = sellFilter.split('@')[0];
			sellElemId = sellFilter.split('@')[1];
			role = sellFilter.split('@')[2];
		}
		urlQuery = sellParam;
		getSells(urlQuery, sellElemId, 1, role);
	}
	sellsInit();

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getSells(urlQuery+'&page='+(parseInt(page)+1), sellElemId, 0, role);
			}
		}
	});
})