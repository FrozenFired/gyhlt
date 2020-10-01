/* ====== 初始加载 =====*/
let urlQuery = dutParam = dutElemId = role = statusParam = '';
var statusConb = Conf.status.init.num;
var page = 0, count, isMore;
var getDuts = (urlQuery, elemId, isReload, role) => {
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
					let duts = results.data.orduts;
					// console.log(duts)
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#dutCount").text(count)
					dutsRender(duts, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var dutsRender = (duts, elemId, isReload, role) => {
	let elem = '<div class="dutsElem">'
		for(let i=0; i<duts.length; i++) {
			let dut = duts[i];
			elem += dutRender(dut, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".dutsElem").remove();
	if(!elemId) elemId = "#dutsElem";
	$(elemId).append(elem);
}
var dutRender = (dut, role) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == dut.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border dutCard">'
		elem += '<div class="col-4">'
			elem += '<a class="btn btn-info" href="/'+role+'Dut/'+dut._id+'">'
				elem += '<div style="font-size: 23px;">'+dut.code+'</div>'
			elem += '</a>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '采购员:'
				if(dut.duter) {
					elem += dut.duter.nome + ' [' + dut.duter.code + ']'
				} else {
					elem += '数据丢失';
				}
			elem += '</div>'
			elem += '<div>'
				elem += '下单时间: '
				dutAt = Date.now();
				if(dut.dutAt) dutAt = new Date(dut.dutAt)
				elem += transformTime(dutAt, 0, 10)
			elem += '</div>'
		elem += '</div>'

		elem += '<div class="col-4">'
			elem += '<div>'
				elem += '<span>供应商: </span>'
				if(dut.strmup) {
					elem += '<span>'
						let nome = '';
						if(dut.strmup.nome) nome = dut.strmup.nome;
						elem += nome
					elem += '</span>'
				} else {
					elem += '<span>'+dut.strmupNome+'</span>'
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
	
	dutsInit = () => {
		let dutFilter = $("#dutFilterAjax").val();
		if(dutFilter) {
			dutParam = dutFilter.split('@')[0];
			dutElemId = dutFilter.split('@')[1];
			role = dutFilter.split('@')[2];
			statusParam = dutFilter.split('@')[3];
		}
		urlQuery = dutParam+statusParam;
		getDuts(urlQuery, dutElemId, 1, role);
	}
	dutsInit();

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
		urlQuery = dutParam + statusParam;
		getDuts(urlQuery, dutElemId, 1, role);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#dutSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#dutSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#dutSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = dutParam + keyword;
		getDuts(urlQuery, dutElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getDuts(urlQuery+'&page='+(parseInt(page)+1), dutElemId, 0, role);
			}
		}
	});
})