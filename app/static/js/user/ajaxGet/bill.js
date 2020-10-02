/* ====== 初始加载 =====*/
let urlQuery = billParam = billElemId = role = statusParam = '';
var statusConb = Conf.status.init.num;
var page = 0, count, isMore;
var getBills = (urlQuery, elemId, isReload) => {
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
					let bills = results.data.bills;
					// console.log(bills)
					statusConb = results.data.statusConb;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#billCount").text(count)
					billsRender(bills, elemId, isReload)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var billsRender = (bills, elemId, isReload) => {
	let elem = '<div class="billsElem">'
		for(let i=0; i<bills.length; i++) {
			let bill = bills[i];
			elem += billRender(bill);
		}
	elem += '</div>'
	if(isReload == 1) $(".billsElem").remove();
	if(!elemId) elemId = "#billsElem";
	$(elemId).append(elem);
}
var billRender = (bill) => {
	let status = '';
	for(sts in Conf.status) {
		status = '';
		if(Conf.status[sts].num == bill.status) {
			status = Conf.status[sts].val;
			break;
		}
	}
	let elem = '';
	elem += '<div class="row py-2 mt-2 text-center border billCard">'
		elem += '<h5 class="col-4">'
			if(bill.billPr && !isNaN(bill.billPr)) {
				elem += '<span class="text-info">' + (bill.billPr).toFixed(2) + '</span> €'
			} else {
				elem += '<span class="text-danger">金额错误</span>'
			}
		elem += '</h5>'

		elem += '<div class="col-4">'
			crtAt = Date.now();
			if(bill.crtAt) crtAt = new Date(bill.crtAt)
			elem += transformTime(crtAt, 0, 19)
		elem += '</div>'

		elem += '<div class="col-4">'
			if(bill.ordin) {
				elem += '<span class="text-success"> 销售订单: </span>'
				elem += '[<a href="/mgDin/'+bill.ordin._id+'">' + bill.ordin.code + '</a>]'
			} else if(bill.ordut) {
				elem += '<span class="text-danger"> 采购订单: </span>'
				elem += '[<a href="/mgDut/'+bill.ordut._id+'">' + bill.ordut.code + '</a>]'
			} else {
				elem += '数据丢失';
			}
		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	
	billsInit = () => {
		let billFilter = $("#billFilterAjax").val();
		if(billFilter) {
			billParam = billFilter.split('@')[0];
			billElemId = billFilter.split('@')[1];
			role = billFilter.split('@')[2];
			statusParam = billFilter.split('@')[3];
		}
		urlQuery = billParam+statusParam;
		getBills(urlQuery, billElemId, 1);
	}
	billsInit();

	/* ====== 点击品类名 显示系列 ====== */
	$(".statusClick").click(function(e) {
		let target = $(e.target);
		let status = target.data("status");

		if((!status && status != 0) || status.length < 1) {
			statusParam = '';
		} else {
			statusParam = "&genre=" + status;
		}

		page = 0;
		urlQuery = billParam + statusParam;
		getBills(urlQuery, billElemId, 1);

		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		$(this).removeClass("btn-default");
		$(this).addClass("btn-success");

		$("#billSearch").val('');
	})

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#billSearch").blur((e) => {
		$(".statusClick").removeClass("btn-success");
		$(".statusClick").addClass("btn-default");

		let keyword = $("#billSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#statusAll").removeClass("btn-default");
			$("#statusAll").addClass("btn-success");
		}
		page = 0;
		// statusParam = '&status='+statusCond
		urlQuery = billParam + keyword;
		getBills(urlQuery, billElemId, 1);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getBills(urlQuery+'&page='+(parseInt(page)+1), billElemId, 0);
			}
		}
	});
})