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

	// 查看报价按钮
	$(".qntPrTdBtn").click(function(e) {
		$(".qntPrTd").toggle();
	})

	$(".inquotUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		$("#"+htmlId+"-form").show();
	})
	$(".inquotUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let orgVal = $("#"+htmlId+"-org").val();
		let newVal = $(this).val();
		if(newVal.length>0 && orgVal != newVal) {
			let form =$("#"+htmlId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-span").text(newVal);
						$("#"+htmlId+"-org").val(newVal);
						$("#"+htmlId+"-form").hide();
						$("#"+htmlId+"-span").show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-form").hide();
		}
	})
})