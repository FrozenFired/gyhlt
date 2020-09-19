$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let pdthdParam = '';
	let pdthdElemId = '';
	let role = '';
	pdthdsInit = () => {
		let pdthdFilter = $("#pdthdFilterAjax").val();
		if(pdthdFilter) {
			pdthdParam = pdthdFilter.split('@')[0];
			pdthdElemId = pdthdFilter.split('@')[1];
			role = pdthdFilter.split('@')[2];
		}
		urlQuery = pdthdParam;
		getPdthds(urlQuery, pdthdElemId, 1, role);
	}
	pdthdsInit();


	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getPdthds(urlQuery+'&page='+(parseInt(page)+1), pdthdElemId, 0, role);
			}
		}
	});
})