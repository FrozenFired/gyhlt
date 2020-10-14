var page = 0;
var count;
var isMore;
var getPdthds = (urlQuery, elemId, isReload, role) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(isReload)
	// console.log(role)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				if(page+1 != results.data.page) {
					// 如果数据错误 则不输出
				} else {
					let pdthds = results.data.pdthds;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#codeIpt").val('P0' + (count+1))
					$("#pdthdCount").text(count)
					pdthdsRender(pdthds, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var pdthdsRender = (pdthds, elemId, isReload, role) => {
	let elem = '<div class="row pdthdsElem">'
		for(let i=0; i<pdthds.length; i++) {
			let pdthd = pdthds[i];
			elem += pdthdRender(pdthd, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".pdthdsElem").remove();
	if(!elemId) elemId = "#pdthdsElem";
	$(elemId).append(elem);
}
var pdthdRender = (pdthd, role) => {
	let elem = '';
	elem += '<div class="col-6 col-md-4 col-lg-3 mt-2 text-center border-bottom border-left pdthdCard">'
		if(role == 'ct') {
			elem += '<div>'+pdthd.code+'</div>'
		} else {
			elem += '<a class="btn btn-info" href="/'+role+'Pdthd/'+pdthd._id+'">'+pdthd.code+'</a>'
			elem += '<div class="text-info">'+pdthd.price+' €</div>'
		}
		for(let i=0; i<pdthd.maters.length; i++) {
			if(i>2) break;
			let mater = pdthd.maters[i]
			let craft = pdthd.crafts[i]
			if(!mater && !craft) continue;
			elem += '<div class="row">'
				elem += '<div class="col-4 border-top">'
					if(mater) {
						elem += '<div class="text-dark mt-2">'+mater+': </div>'
					}
				elem += '</div>'
				elem += '<div class="col-8 border-top">'
					if(craft) {
						elem += '<div class="text-dark mt-2">'+craft+'</div>'
					}
				elem += '</div>'
			elem += '</div>'
		}
		elem += '<div class="text-dark">'+pdthd.note+'</div>'
	elem += '</div>'
	return elem;
}

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