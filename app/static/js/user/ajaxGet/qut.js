var statusConb = Conf.status.init.num;
var page = 0;
var count;
var isMore;
var getQuts = (urlQuery, elemId, isReload, role) => {
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
					let quts = results.data.inquots;
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#qutCount").text(count)
					qutsRender(quts, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var qutsRender = (quts, elemId, isReload, role) => {
	let elem = '<div class="qutsElem">'
		for(let i=0; i<quts.length; i++) {
			let qut = quts[i];
			elem += qutRender(qut, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".qutsElem").remove();
	if(!elemId) elemId = "#qutsElem";
	$(elemId).append(elem);
}
var qutRender = (qut, role) => {
	let stsBg = 'bg-default';
	if(qut.status == Conf.status.quoting.num) {
		stsBg = 'bg-default';
	} else if(qut.status == Conf.status.done.num) {
		stsBg = 'bg-info';
	} else if(qut.status == Conf.status.ord.num) {
		stsBg = 'bg-success';
	} else if(qut.status == Conf.status.unord.num) {
		stsBg = 'bg-danger';
	}
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == qut.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let crUserRole = $("#crUserRole").val();
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border qutCard">'

		elem += '<div class="col-4 mt-3">'
			elem += '<div>'
				elem += '询价人:'
				if(qut.quner) {
					elem += qut.quner.nome + ' [' + qut.quner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'
			elem += '<div>'
				elem += '询价时间: '
				qunAt = Date.now();
				if(qut.qunAt) qunAt = new Date(qut.qunAt)
				elem += transformTime(qunAt, 0, 10)
			elem += '</div>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<a href="/'+role+'Qut/'+qut._id+'">'
				elem += '<h3 class="text-dark">'+qut.code+'</h3>'
			elem += '</a>'
			if(qut.qutNote) {
				elem += '<div>'
					elem += qut.qutNote
				elem += '</div>'
			}

		elem += '</div>'

		elem += '<div class="col-4 mt-3">'
			if(qut.status == Conf.status.done.num) {
				elem += '<h4 class="p-2">'
					elem += '总价格:'
					elem += qut.price
				elem += '</h4>'
			}
			elem += '<div>'
				elem += '报价人:'
				if(qut.quter) {
					elem += qut.quter.nome + ' [' + qut.quter.code + ']'
				} else {
					elem += '未分配';
				}
			elem += '</div>'
			elem += '<div class="'+stsBg+'">'
				elem += status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}