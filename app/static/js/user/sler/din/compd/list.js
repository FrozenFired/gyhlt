$(function() {
	// $(".dinpdUpClick").dblclick(function(e) {
	$(".dinpdUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let dinpdId = $(this).attr("id").split('-')[1]
		$("#"+htmlId+"-"+dinpdId+"-form").show();
		$(this).hide();
	})
	$(".dinpdUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let dinpdId = $(this).attr("id").split('-')[1]

		let qntPr = $("#qntPr-"+dinpdId).val();
		let quant = parseInt($("#quant-"+dinpdId).val());
		let org = $("#"+htmlId+"-"+dinpdId+"-org").val();
		let dinPr = $(this).val();
		$("#dinPrOpt-"+dinpdId).text("")
		if(!isFloat(qntPr)) {
			$("#dinPrOpt-"+dinpdId).text("产品的报价有错误, 请刷新重试! 如果无法解决请联系管理员")
		} else if(!isFloat(dinPr)) {
			$("#dinPrOpt-"+dinpdId).text("请输入正确的数字")
		} else if(parseFloat(dinPr) < parseFloat(qntPr)) {
			$("#dinPrOpt-"+dinpdId).text("销售价格低于报价价格, 请联系管理员处理")
		} else if(org != dinPr) {
			let form =$("#"+htmlId+"-"+dinpdId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			console.log(data)
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-"+dinpdId+"-span").text(dinPr).addClass("text-info");
						$("#"+htmlId+"-"+dinpdId+"-org").val(dinPr);
						$("#dinPrTot-"+dinpdId).text(dinPr*quant);
						$("#"+htmlId+"-"+dinpdId+"-form").hide();
						$("#"+htmlId+"-"+dinpdId+"-span").show();
						ifChangeStatus()
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-"+dinpdId+"-form").hide();
			$("#"+htmlId+"-"+dinpdId+"-span").show();
		}
	})
})