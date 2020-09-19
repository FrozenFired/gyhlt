$(function() {
	/* ====== 导航栏效果 =====*/
	$(".nav").mouseover(function(e) {
		let id = $(this).attr("id")
		$(".topNav-second-header").hide();
		$(".topNav-second-headerHide").show();
		$("."+id).show();
	})
	$(".topNav-second-headerHide").mouseover(function(e) {
		$(".topNav-second-header").hide();
		$(".topNav-second-headerHide").hide();
	})

	/* ====== 导航栏中的产品系列显示 =====*/
	var navProducts = function() {
		let elem = '';
		let i=0;
		for(; i<pdfirs.length; i++) {
			if(i>2) break;
			let pdfir = pdfirs[i];
			elem += '<div class="col-4 mt-3 text-center navPdfir">'
				elem += '<a href="/ctPdfir/'+pdfir._id +'">'
					elem += '<img class="border-top-0" src="'
					elem += pdfir.photo+'" width="100%" height="120px" '
					elem += 'style="object-fit: scale-down;">'

					elem += '<br/>'

					elem += '<span>' + pdfir.code + '</span>'
				elem += '</a>'
			elem += '</div>';
		}
		$(".navPdfir").remove();
		$("#navPdfirs").append(elem);
	}
	var getNavpdfirs = () => {

		$.ajax({
			type: "GET",
			url: "/usPdfirsAjax",
			success: function(results) {
				if(results.status === 1) {
					pdfirs = results.data.pdfirs;
					navProducts();
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});
	}
	getNavpdfirs();

})