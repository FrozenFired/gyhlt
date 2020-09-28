var page = 0;
var count;
var isMore;
var getStrmdws = (urlQuery, elemId, isReload, role) => {
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
					let strmdws = results.data.strmdws;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#strmdwCount").text(count)
					strmdwsRender(strmdws, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var strmdwsRender = (strmdws, elemId, isReload, role) => {
	let elem = '<div class="row strmdwsElem">'
		for(let i=0; i<strmdws.length; i++) {
			let strmdw = strmdws[i];
			elem += strmdwRender(strmdw, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".strmdwsElem").remove();
	if(!elemId) elemId = "#strmdwsElem";
	$(elemId).append(elem);
}
var strmdwRender = (strmdw, role) => {
	let nomeBg = 'bg-default';
	if(strmdw.shelf == 0) {
		nomeBg = 'bg-secondary';
	} else if(strmdw.shelf == 2) {
		nomeBg = 'bg-warning';
	}
	if(role == 'ct') nomeBg = 'bg-default';

	let elem = '';
	elem += '<div class="col-12 col-md-6 col-xl-4 p-2 text-center strmdwCard">'
	elem += '<div class="border p-2">'
		elem += '<a class="text-info mb-2 text-muted '+nomeBg+'" href="/'+role+'Strmdw/'+strmdw._id+'">';
		elem += strmdw.nome+' ['+strmdw.categFirm+']</a>'

		elem += '<div>' + strmdw.resp + '</div>'
		elem += '<div>' + strmdw.tel + '</div>'
		elem += '<div>' + strmdw.email + '</div>'

	elem += '</div>'
	elem += '</div>'
	return elem;
}