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
			elem += '<a class="btn btn-info mt-3" href="/'+role+'Qun/'+qun._id+'">'
				elem += '<div style="font-size: 23px;">'+qun.code+'</div>'
			elem += '</a>'

		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>'
				elem += '创建时间: '
				crtAt = Date.now();
				if(qun.crtAt) crtAt = new Date(qun.crtAt)
				elem += transformTime(crtAt, 0, 10)
			elem += '</div>'


			elem += '<div class="mt-1">'
				elem += '询价人:'
				if(qun.quner) {
					elem += qun.quner.nome + ' [' + qun.quner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'
			elem += '<div class="mt-2 text-info">客户姓名: ' + qun.cterNome +'</div>'
		elem += '</div>'

		elem += '<div class="col-md-4">'
			elem += '<div>产品种类: ' + qun.compds.length +'</div>'
			elem += '<div class="mt-1">报价次数: '+ qun.times + '</div>'
			elem += '<div class="mt-2 text-danger">'
				elem += '状态: ' + status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let qunParam = '';
	let qunElemId = '';
	let role = '';
	let statusParam = '';
	qunsInit = () => {
		let qunFilter = $("#qunFilterAjax").val();
		if(qunFilter) {
			qunParam = qunFilter.split('@')[0];
			qunElemId = qunFilter.split('@')[1];
			role = qunFilter.split('@')[2];
			statusParam = qunFilter.split('@')[3];
		}
		urlQuery = qunParam+statusParam;
		getQuns(urlQuery, qunElemId, 1, role);
	}
	qunsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".statusClick").click(function(e) {
		let target = $(e.target);
		let status = target.data("status");

		if((!status && status != 0) || status.length < 1) {
			statusParam = '';
		} else {
			statusParam = "&status=" + status;
		}
		// console.log(statusParam)
		page = 0;
		urlQuery = qunParam + statusParam;
		getQuns(urlQuery, qunElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#qunSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#qunSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#qunSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = qunParam + keyword;
		getQuns(urlQuery, qunElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getQuns(urlQuery+'&page='+(parseInt(page)+1), qunElemId, 0, role);
			}
		}
	});
})