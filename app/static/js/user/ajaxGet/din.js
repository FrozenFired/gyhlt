var statusConb = Conf.status.init.num;
var page = 0;
var count;
var isMore;
var getDins = (urlQuery, elemId, isReload, role) => {
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
					let dins = results.data.ordins;
					// console.log(dins)
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#dinCount").text(count)
					dinsRender(dins, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var dinsRender = (dins, elemId, isReload, role) => {
	let elem = '<div class="dinsElem">'
		for(let i=0; i<dins.length; i++) {
			let din = dins[i];
			elem += dinRender(din, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".dinsElem").remove();
	if(!elemId) elemId = "#dinsElem";
	$(elemId).append(elem);
}
var dinRender = (din, role) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == din.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border dinCard">'
		elem += '<div class="col-4">'
			elem += '<a class="btn btn-info" href="/'+role+'Din/'+din._id+'">'
				elem += '<div style="font-size: 23px;">'+din.code+'</div>'
			elem += '</a>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '销售员:'
				if(din.diner) {
					elem += din.diner.nome + ' [' + din.diner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'
			elem += '<div>'
				elem += '下单时间: '
				dinAt = Date.now();
				if(din.dinAt) dinAt = new Date(din.dinAt)
				elem += transformTime(dinAt, 0, 10)
			elem += '</div>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '<span>客户: </span>'
				if(din.cter) {
					elem += '<span>'
						let nome = '';
						if(din.cter.nome) nome = din.cter.nome;
						elem += nome + ' [' + din.cter.code + ']'
					elem += '</span>'
				} else {
					elem += '<span>'+din.cterNome+'</span>'
				}
			elem += '</div>'

			elem += '<div>'
				elem += '状态: ' + status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}