$(function() {
	/* == 判断是否完成了所有产品的报价 == */
	let quotingStatus = false;
	$(".statusInput").each(function(index,elem) {
		status = parseInt($(this).val());
		if(status == Conf.status.quoting.num) {
			quotingStatus = true;
		}
	})
	if(quotingStatus) {
		$(".quotingBtn").hide();
		$(".quotingSpan").show();
	} else {
		$(".quotingSpan").hide();
		$(".quotingBtn").show();
	}

	$(".inquotUpClick").click(function(e) {
		let field = $(this).attr("id").split('-')[1]
		let id = $(this).attr("id").split('-')[2]
		$("#form-"+field+"-obj").toggle();
	})
})