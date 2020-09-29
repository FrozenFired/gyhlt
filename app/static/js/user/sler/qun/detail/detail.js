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
		$(".quotingBtnShow").show();
	} else {
		$(".quotingBtnShow").hide();
		$(".quotingBtn").show();
	}
	$(".quotingBtnShow").click(function(e) {
		alert("必须完善具体工艺面料等细节")
	})

	$(".delObjectBtn").click(function(e) {
		$(".textinfo").hide();
		$(".delObject").show();
	})
	$(".delObjectCancel").click(function(e) {
		$(".delObject").hide();
		$(".textinfo").show();
	})
})