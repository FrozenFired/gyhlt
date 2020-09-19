var page = 0;
var count;
var isMore;
var getBuys = (urlQuery, elemId, isReload, role) => {
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
					let buys = results.data.buys;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#buyCount").text(count)
					buysRender(buys, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var buysRender = (buys, elemId, isReload, role) => {
	let elem = '<div class="buysElem">'
		for(let i=0; i<buys.length; i++) {
			let buy = buys[i];
			elem += buyRender(buy, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".buysElem").remove();
	if(!elemId) elemId = "#buysElem";
	$(elemId).append(elem);
}
var buyRender = (buy, role) => {
	let discBg = 'bg-default';
	if(buy.shelf == 0) {
		discBg = 'bg-secondary';
	} else if(buy.shelf == 2) {
		discBg = 'bg-warning';
	}
	if(role == 'ct') discBg = 'bg-default';

	let elem = '';
	elem += '<div class="row border mt-3 text-center buyCard">'
		elem += '<div class="col-4 p-2">'
			if(buy.brand) {
				let brand = buy.brand;
				elem += '<a class="text-info mb-2 text-muted" href="/'+role+'Brand/'+brand._id+'">';
				elem += brand.nome+'</a>'
			}
		elem += '</div>'
		elem += '<div class="col-4 p-2">'
			if(buy.strmup) {
				let strmup = buy.strmup;
				elem += '<a class="text-info mb-2 text-muted" href="/'+role+'Strmup/'+strmup._id+'">';
				elem += strmup.nome+'</a>'
			}
		elem += '</div>'
		elem += '<div class="col-4 p-2">'
			elem += '<a class="text-info mb-2 text-muted '+discBg+'" href="/'+role+'Buy/'+buy._id+'"><h3>';
			elem += buy.discount+'</h3></a>'

			elem += '<div>' + buy.note + '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}