var page = 0;
var count;
var isMore;
var getStrmups = (urlQuery, elemId, isReload, role) => {
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
					let strmups = results.data.strmups;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#strmupCount").text(count)
					strmupsRender(strmups, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var strmupsRender = (strmups, elemId, isReload, role) => {
	let elem = '<div class="row strmupsElem">'
		for(let i=0; i<strmups.length; i++) {
			let strmup = strmups[i];
			elem += strmupRender(strmup, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".strmupsElem").remove();
	if(!elemId) elemId = "#strmupsElem";
	$(elemId).append(elem);
}
var strmupRender = (strmup, role) => {
	let nomeBg = 'bg-default';
	if(strmup.shelf == 0) {
		nomeBg = 'bg-secondary';
	} else if(strmup.shelf == 2) {
		nomeBg = 'bg-warning';
	}
	if(role == 'ct') nomeBg = 'bg-default';

	let elem = '';
	elem += '<div class="col-12 col-md-6 col-xl-4 p-2 text-center strmupCard">'
	elem += '<div class="border p-2">'
		elem += '<a class="text-info mb-2 text-muted '+nomeBg+'" href="/'+role+'Strmup/'+strmup._id+'">';
		elem += strmup.nome+' ['+strmup.categFirm+']</a>'

		elem += '<div>' + strmup.resp + '</div>'
		elem += '<div>' + strmup.tel + '</div>'
		elem += '<div>' + strmup.email + '</div>'

	elem += '</div>'
	elem += '</div>'
	return elem;
}