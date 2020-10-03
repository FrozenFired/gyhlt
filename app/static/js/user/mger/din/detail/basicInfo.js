$(function() {
	// 初始化数量和总金额
	$("#span-quantTotal").text($("#ipt-quantTotal").val())
	$("#span-qntPrImp").text($("#ipt-qntPrImp").val())
	$("#span-dinPrImp").text($("#ipt-dinPrImp").val())

	// 删除订单操作按钮
	$(".delObjectBtn").click(function(e) {
		$(".delObjectBtn").hide();
		$(".delObject").show();
	})
	$(".delObjectCancel").click(function(e) {
		$(".delObject").hide();
		$(".delObjectBtn").show();
	})


	$(".objUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		$("#"+htmlId+"-form").toggle();
	})
	$(".objUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let org = $("#"+htmlId+"-org").val();
		let now = $(this).val();
		if(org != now) {
			let form =$("#"+htmlId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-span").text("备注: " + now);
						$("#"+htmlId+"-org").val(now);
						$("#"+htmlId+"-form").hide();
						$("#"+htmlId+"-span").show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-form").hide();
			$("#"+htmlId+"-span").show();
		}
	})
})