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
	} else {
		$(".quotingBtn").show();
	}
})