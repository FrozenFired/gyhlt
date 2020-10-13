var page = 0;
var count;
var isMore;
var getPdsecs = (urlQuery, elemId, isReload, role) => {
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
					let pdsecs = results.data.pdsecs;
					page = results.data.page
					isMore = results.data.isMore
					count = results.data.count
					$("#pdsecCount").text(count)
					pdsecsRender(pdsecs, elemId, isReload, role)
				}
			} else if(results.status === 0) {
				alert(results.msg);
			}
		}
	});
}

var pdsecsRender = (pdsecs, elemId, isReload, role) => {
	let elem = '<div class="row pdsecsElem">'
		for(let i=0; i<pdsecs.length; i++) {
			let pdsec = pdsecs[i];
			elem += pdsecRender(pdsec, role);
		}
	elem += '</div>'
	if(isReload == 1) $(".pdsecsElem").remove();
	if(!elemId) elemId = "#pdsecsElem";
	$(elemId).append(elem);
}
var pdsecRender = (pdsec, role) => {
	let codeBg = 'bg-default';
	if(pdsec.shelf == 0) {
		codeBg = 'bg-secondary';
	} else if(pdsec.shelf == 2) {
		codeBg = 'bg-warning';
	}
	if(role == 'ct') codeBg = 'bg-default';

	let elem = '';
	elem += '<div class="col-6 col-md-3 col-lg-2 mt-2 text-center border-bottom border-left pdsecCard">'
		elem += '<a href="/'+role+'Pdsec/'+pdsec._id+'">'
			elem += '<img src="'+pdsec.photo+'" '
				elem += 'width="100%" height="120px" '
				elem += 'style="object-fit: scale-down;"'
			elem += '/>'
		elem += '</a>'
		elem += '<div class="text-info text-info">'
			if(pdsec.spec) {
				elem += pdsec.spec
			}
		elem += '&nbsp;</div>'
		elem += '<div class="row">'
			elem += '<div class="col-2 text-right">'
			elem += '</div>'
			elem += '<div class="col-12">'
				elem += '<div class="text-info text-muted '+codeBg+'">'+pdsec.code+'</div>'
			elem += '</div>'
			// elem += '<div class="col-2 text-right">'
			// 	elem += '<a href="'+pdsec.photo+'" target="_blank"><span class="oi oi-magnifying-glass"></span></a>'
			// elem += '</div>'

		elem += '</div>'
	elem += '</div>'
	return elem;
}

$(function() {
	/* ====== 初始加载 =====*/
	let urlQuery = '';
	let pdsecParam = '';
	let pdsecElemId = '';
	let role = '';
	pdsecsInit = () => {
		let pdsecFilter = $("#pdsecFilterAjax").val();
		if(pdsecFilter) {
			pdsecParam = pdsecFilter.split('@')[0];
			pdsecElemId = pdsecFilter.split('@')[1];
			role = pdsecFilter.split('@')[2];
		}
		urlQuery = pdsecParam;
		getPdsecs(urlQuery, pdsecElemId, 1, role);
	}
	pdsecsInit();

	$("#searchTog").click(function(e) {
		$("#searchElem").toggle();
	})
	/* ====== 根据搜索关键词 显示系列 ====== */
	$("#pdsecSearch").blur((e) => {
		$(".pdnomeClick").removeClass("btn-success");
		$(".pdnomeClick").addClass("btn-default");

		let keyword = $("#pdsecSearch").val().replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		if(keyword && keyword.length > 0) {
			keyword = "&keyword=" + keyword;
		} else {
			keyword = "";
			$("#pdnomeAll").removeClass("btn-default");
			$("#pdnomeAll").addClass("btn-success");
		}
		$("#pdnomeFilter").hide();

		page = 0;
		urlQuery = pdsecParam + keyword;
		getPdsecs(urlQuery, pdsecElemId, 1, role);
	})

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 58 > scrollHeight){
			if(isMore == 1) {
				getPdsecs(urlQuery+'&page='+(parseInt(page)+1), pdsecElemId, 0, role);
			}
		}
	});
})