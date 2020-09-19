var page = 0;
var count;
var isMore;
var getSells = (urlQuery, elemId, isReload, role) => {
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
					let sells = results.data.sells;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#sellCount").text(count)
					sellsRender(sells, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var sellsRender = (sells, elemId, isReload, role) => {
	let elem = '<div class="sellsElem">'
		for(let i=0; i<sells.length; i++) {
			let sell = sells[i];
			elem += sellRender(sell, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".sellsElem").remove();
	if(!elemId) elemId = "#sellsElem";
	$(elemId).append(elem);
}
var sellRender = (sell, role) => {
	let discBg = 'bg-default';
	if(sell.shelf == 0) {
		discBg = 'bg-secondary';
	} else if(sell.shelf == 2) {
		discBg = 'bg-warning';
	}
	if(role == 'ct') discBg = 'bg-default';

	let elem = '';
	elem += '<div class="row border mt-3 text-center sellCard">'
		elem += '<div class="col-4 p-2">'
			if(sell.brand) {
				let brand = sell.brand;
				elem += '<a class="text-info mb-2 text-muted" href="/'+role+'Brand/'+brand._id+'">';
				elem += brand.nome+'</a>'
			}
		elem += '</div>'
		elem += '<div class="col-4 p-2">'
			if(sell.strmdw) {
				let strmdw = sell.strmdw;
				elem += '<a class="text-info mb-2 text-muted" href="/'+role+'Strmdw/'+strmdw._id+'">';
				elem += strmdw.nome+'</a>'
			}
		elem += '</div>'
		elem += '<div class="col-4 p-2">'
			elem += '<a class="text-info mb-2 text-muted '+discBg+'" href="/'+role+'Sell/'+sell._id+'"><h3>';
			elem += sell.discount+'</h3></a>'

			elem += '<div>' + sell.note + '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}