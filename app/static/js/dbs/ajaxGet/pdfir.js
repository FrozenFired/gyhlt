var page = 0;
var count;
var isMore;
var getPdfirs = (urlQuery, elemId, isReload, role) => {
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
					let pdfirs = results.data.pdfirs;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#pdfirCount").text(count)
					pdfirsRender(pdfirs, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var pdfirsRender = (pdfirs, elemId, isReload, role) => {
	let elem = '<div class="row pdfirsElem">'
		for(let i=0; i<pdfirs.length; i++) {
			let pdfir = pdfirs[i];
			elem += pdfirRender(pdfir, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".pdfirsElem").remove();
	if(!elemId) elemId = "#pdfirsElem";
	$(elemId).append(elem);
}
var pdfirRender = (pdfir, role) => {
	let codeBg = 'bg-default';
	if(pdfir.shelf == 0) {
		codeBg = 'bg-secondary';
	} else if(pdfir.shelf == 2) {
		codeBg = 'bg-warning';
	}
	if(role == 'ct') codeBg = 'bg-default';

	let elem = '';
	elem += '<div class="col-6 col-lg-4 mt-2 text-center border-bottom border-left pdfirCard">'
		elem += '<img class="thumbnailImg" src="'+pdfir.photo+'" '
			elem += 'width="100%" height="120px" '
			elem += 'style="object-fit: scale-down;"'
		elem += '/>'
		elem += '<a href="/'+role+'Pdfir/'+pdfir._id+'">'
			elem += '<h5 class="'+codeBg+'">'+pdfir.code+'</h5>'
		elem += '</a>'
	elem += '</div>'
	return elem;
}