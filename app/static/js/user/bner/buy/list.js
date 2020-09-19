$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let buyParam = '';
	let buyElemId = '';
	let role = '';
	buysInit = () => {
		let buyFilter = $("#buyFilterAjax").val();
		if(buyFilter) {
			buyParam = buyFilter.split('@')[0];
			buyElemId = buyFilter.split('@')[1];
			role = buyFilter.split('@')[2];
		}
		urlQuery = buyParam;
		getBuys(urlQuery, buyElemId, 1, role);
	}
	buysInit();

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getBuys(urlQuery+'&page='+(parseInt(page)+1), buyElemId, 0, role);
			}
		}
	});
})