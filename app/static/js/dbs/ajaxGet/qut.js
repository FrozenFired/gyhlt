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
					let inquots = results.data.inquots;
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#qutCount").text(count)
					inquotsRender(inquots, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var inquotsRender = (inquots, elemId, isReload, role) => {
	let elem = '<div class="inquotsElem">'
		for(let i=0; i<inquots.length; i++) {
			let qut = inquots[i];
			elem += qutRender(qut, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".inquotsElem").remove();
	if(!elemId) elemId = "#inquotsElem";
	$(elemId).append(elem);
}
var qutRender = (qut, role) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == qut.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border qutCard">'

		elem += '<div class="col-md-4">'
			elem += '<a class="mt-4 btn btn-info" href="/'+role+'Qut/'+qut._id+'">'
				elem += '<div style="font-size: 23px;">'+qut.code+' <span class="text-warning">[ '+qut.compds.length+' ]</span></div>'
			elem += '</a>'
		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>'
				elem += '询价时间: '
				crtAt = Date.now();
				if(qut.crtAt) crtAt = new Date(qut.crtAt)
				elem += transformTime(crtAt, 0, 10)
			elem += '</div>'

			elem += '<div class="mt-2">'
				elem += '询价人:'
				if(qut.quner) {
					elem += qut.quner.nome + ' [' + qut.quner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'

			elem += '<div class="mt-3 text-info">客户姓名: ' + qut.cterNome +'</div>'

		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>'
				elem += '报价次数: '+ qut.times
			elem += '</div>'
			elem += '<div class="mt-2">'
				elem += '报价人:'
				if(qut.quter) {
					elem += qut.quter.nome + ' [' + qut.quter.code + ']'
				} else {
					elem += '未分配';
				}
			elem += '</div>'

			elem += '<div class="mt-3 text-danger">'
				elem += status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let qutParam = '';
	let qutElemId = '';
	let role = '';
	let statusParam = '';
	inquotsInit = () => {
		let qutFilter = $("#qutFilterAjax").val();
		if(qutFilter) {
			qutParam = qutFilter.split('@')[0];
			qutElemId = qutFilter.split('@')[1];
			role = qutFilter.split('@')[2];
			statusParam = qutFilter.split('@')[3];
		}
		urlQuery = qutParam+'&quter=null'+statusParam;
		getQuts(urlQuery, qutElemId, 1, role);
	}
	inquotsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".statusClick").click(function(e) {
		let target = $(e.target);
		let status = target.data("status");
		let quter = target.data("quter");

		if((!status && status != 0) || status.length < 1) {
			statusParam = '';
		} else {
			statusParam = "&status=" + status;
		}

		page = 0;
		urlQuery = qutParam + quter + statusParam;
		getQuts(urlQuery, qutElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#qutSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#qutSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#qutSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = qutParam + keyword;
		getQuts(urlQuery, qutElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getQuts(urlQuery+'&page='+(parseInt(page)+1), qutElemId, 0, role);
			}
		}
	});
})