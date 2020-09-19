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
	elem += '<div class="col-6 col-md-3 col-lg-2 mt-2 text-center border-bottom border-left pdthdCard">'

		if(role == 'ct') {
			elem += '<div>'+pdthd.code+'</div>'
		} else {
			elem += '<a href="/'+role+'Pdthd/'+pdthd._id+'">'
				elem += '<span>'+pdthd.code+'</span>'
			elem += '</a>'
			elem += '<div class="text-info">'+pdthd.price+' €</div>'
		}
		elem += '<div class="text-dark">'+pdthd.note+'</div>'
		for(let i=0; i<pdthd.maters.length; i++) {
			let mater = pdthd.maters[i]
			elem += '<div class="text-dark mt-2">'+mater+'</div>'
		}
		
	elem += '</div>'
	return elem;
}