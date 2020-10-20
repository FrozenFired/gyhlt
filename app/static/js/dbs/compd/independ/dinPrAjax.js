$(function() {
	// 修改售价
	$(".dinPrClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})
	$(".dinPrBlurup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let orgVal = parseFloat($("#org-"+field+"-"+id).val());
		let qntPr = parseFloat($("#org-qntPr-"+id).val());
		let newVal = parseFloat($(this).val());
		if(isNaN(qntPr)) {
			alert("平台报价有问题, 请联系管理员")
		} else if(isNaN(newVal)) {
			alert("价格只能是数字")
		} else if(newVal < qntPr) {
			alert("成交价不能小于平台报价:"+qntPr)
		} else {
			if(orgVal != newVal) {
				let form =$("#form-"+field+"-"+id);
				let data = form.serialize();
				let url = form.attr('action');
				$.ajax({
					type: "POST",
					url: url,
					data: data,
					success: function(results) {
						if(results.status === 1) {
							let data = results.data;
							$("#org-"+field+"-"+id).val(parseFloat(newVal).toFixed(2));	// org原价格
							$("#ipt-"+field+"-"+id).val(parseFloat(newVal).toFixed(2));	// ipt的价格
							$("#span-"+field+"-"+id).text(parseFloat(newVal).toFixed(2));	// span的价格

							$("#span-dinPrtot-"+id).text(parseFloat(data.dinPrTot).toFixed(2));	// 改变 一种商品的售价

							// 改变销售总价值
							let orgQuant = parseFloat($("#org-quant-"+id).val());
							let orgDinImp = parseFloat($("#ipt-dinPrImp").val());
							let newDinImp = orgDinImp + (newVal-orgVal)*orgQuant;
							$("#ipt-dinPrImp").val(parseFloat(newDinImp).toFixed(2))
							$("#span-dinPrImp").text(parseFloat(newDinImp).toFixed(2))
						} else if(results.status === 0) {
							alert(results.msg)
						}
					}
				});
			}
			$("#form-"+field+"-"+id).hide();
		}
	})
})