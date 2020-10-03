/* ====== 初始加载 =====*/
let urlQuery = tranParam = tranElemId = role = statusParam = '';
var statusConb = Conf.status.init.num;
var page = 0, count, isMore;
var getTrans = (urlQuery, elemId, isReload) => {
	// console.log(urlQuery)
	// console.log(elemId)
	// console.log(isReload)

	$.ajax({
		type: "GET",
		url: urlQuery,
		success: function(results) {
			if(results.status === 1) {
				if(page+1 != results.data.page) {
					// 如果数据错误 则不输出
				} else {
					// console.log(results.data)
					let trans = results.data.trans;
					// console.log(trans)
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#tranCount").text(count)
					transRender(trans, elemId, isReload)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var transRender = (trans, elemId, isReload) => {
	let elem = '<div class="transElem">'
		for(let i=0; i<trans.length; i++) {
			let tran = trans[i];
			elem += tranRender(tran);
		}
	elem += '</div>'
	if(isReload == 1) $(".transElem").remove();
	if(!elemId) elemId = "#transElem";
	$(elemId).append(elem);
}
var tranRender = (tran) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == tran.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border tranCard">'
		elem += '<div class="col-4">'
			elem += '<a class="btn btn-info" href="/'+role+'Tran/'+tran._id+'">'
				elem += '<div style="font-size: 23px;">'+tran.code+'</div>'
			elem += '</a>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '采购员:'
				if(tran.traner) {
					elem += tran.traner.nome + ' [' + tran.traner.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'
			elem += '<div>'
				elem += '下单时间: '
				tranAt = Date.now();
				if(tran.tranAt) tranAt = new Date(tran.tranAt)
				elem += transformTime(tranAt, 0, 10)
			elem += '</div>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '<span>供应商: </span>'
				if(tran.strmup) {
					elem += '<span>'
						let nome = '';
						if(tran.strmup.nome) nome = tran.strmup.nome;
						elem += nome
					elem += '</span>'
				} else {
					elem += '<span>'+tran.strmupNome+'</span>'
				}
			elem += '</div>'

			elem += '<div>'
				elem += '状态: ' + status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	
	transInit = () => {
		let tranFilter = $("#tranFilterAjax").val();
		if(tranFilter) {
			tranParam = tranFilter.split('@')[0];
			tranElemId = tranFilter.split('@')[1];
			role = tranFilter.split('@')[2];
			statusParam = tranFilter.split('@')[3];
		}
		urlQuery = tranParam+statusParam;
		getTrans(urlQuery, tranElemId, 1);
	}
	transInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".statusClick").click(function(e) {
		let target = $(e.target);
		let status = target.data("status");

		if((!status && status != 0) || status.length < 1) {
			statusParam = '';
		} else {
			statusParam = "&status=" + status;
		}

		page = 0;
		urlQuery = tranParam + statusParam;
		getTrans(urlQuery, tranElemId, 1);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#tranSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#tranSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#tranSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = tranParam + keyword;
		getTrans(urlQuery, tranElemId, 1);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getTrans(urlQuery+'&page='+(parseInt(page)+1), tranElemId, 0);
			}
		}
	});
})