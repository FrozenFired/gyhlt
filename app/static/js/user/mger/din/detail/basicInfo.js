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

	// 点击单独改变数据库值
	$(".objUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		$("#form-"+htmlId).toggle();
	})
	// 改变货期
	$("#ipt-dinDay").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		let now = parseInt($(this).val());
		let org = parseInt($("#org-"+htmlId).val());
		if(!isNaN(now) && now != org) {
			let form =$("#form-"+htmlId);
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						let ordin = results.data.ordin;
						$("#span-"+htmlId).text(now);
						$("#org-"+htmlId).val(now);
						let dinAt = transformTime(ordin.dinAt, 0, 10)
						$("#span-dinAt").text(dinAt)
						$("#form-"+htmlId).hide();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#form-"+htmlId).hide();
		}
	})
})