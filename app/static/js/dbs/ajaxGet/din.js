/* ====== 初始加载 =====*/
let urlQuery = dinParam = dinElemId = role = statusParam = '';
var statusConb = Conf.status.init.num;
var page = 0, count, isMore;
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
				if(din.seller) {
					elem += din.seller.nome + ' [' + din.seller.code + ']'
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

			elem += '<div class="text-danger">'
				elem += '状态: ' + status
			elem += '</div>'
		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	
	dinsInit = () => {
		let dinFilter = $("#dinFilterAjax").val();
		if(dinFilter) {
			dinParam = dinFilter.split('@')[0];
			dinElemId = dinFilter.split('@')[1];
			role = dinFilter.split('@')[2];
			statusParam = dinFilter.split('@')[3];
		}
		urlQuery = dinParam+statusParam;
		getDins(urlQuery, dinElemId, 1, role);
	}
	dinsInit();

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
		urlQuery = dinParam + statusParam;
		getDins(urlQuery, dinElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#dinSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#dinSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#dinSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = dinParam + keyword;
		getDins(urlQuery, dinElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getDins(urlQuery+'&page='+(parseInt(page)+1), dinElemId, 0, role);
			}
		}
	});
})