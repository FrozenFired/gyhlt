var statusConb = Conf.status.init.num;
var page = 0;
var count;
var isMore;
var getQuns = (urlQuery, elemId, isReload, role) => {
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
					// console.log(results.data)
					let quns = results.data.inquots;
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#qunCount").text(count)
					qunsRender(quns, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var qunsRender = (quns, elemId, isReload, role) => {
	let elem = '<div class="qunsElem">'
		for(let i=0; i<quns.length; i++) {
			let qun = quns[i];
			elem += qunRender(qun, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".qunsElem").remove();
	if(!elemId) elemId = "#qunsElem";
	$(elemId).append(elem);
}
var qunRender = (qun, role) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == qun.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border qunCard">'
		elem += '<div class="col-md-4">'
			elem += '<a class="btn btn-info" href="/'+role+'Qun/'+qun._id+'">'
				elem += '<div style="font-size: 23px;">'+qun.code+'</div>'
			elem += '</a>'

		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>'
				elem += '创建时间: '
				qntcrtAt = Date.now();
				if(qun.qntcrtAt) qntcrtAt = new Date(qun.qntcrtAt)
				elem += transformTime(qntcrtAt, 0, 10)
			elem += '</div>'

			elem += '<div>'
				elem += '询价人:'
				if(qun.quner) {
					elem += qun.quner.nome + ' [' + qun.quner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'

			elem += '<div>'
				elem += '报价次数: '+ qun.times
			elem += '</div>'

		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>客户姓名: ' + qun.cterNome +'</div>'

			if(qun.status == Conf.status.done.num) {
				elem += '<h4 class="mt-2">'
					elem += '总价格:'
					elem += qun.qntPr
				elem += '</h4>'
			}

			elem += '<div class="mt-2">'
				elem += '状态: ' + status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}