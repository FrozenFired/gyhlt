$(function() {
	// 修改序号
	$(".qntnumClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})
	$(".qntnumBlurup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let orgVal = parseInt($("#org-"+field+"-"+id).val());
		let newVal = parseInt($(this).val());
		if(isNaN(newVal)) {
			alert("请输入正确的数字")
		}
		else if(newVal < 0) {
			alert("数量不能为负数");
		}
		else if(orgVal != newVal) {
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
						$("#org-"+field+"-"+id).val(newVal);	// org原数量
						$("#ipt-"+field+"-"+id).val(newVal);	// ipt的数量
						$("#span-"+field+"-"+id).text(newVal);	// span的数量
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
		$("#form-"+field+"-"+id).hide();
	})

	// 修改数量
	$(".quantClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})
	$(".quantBlurup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let orgVal = parseInt($("#org-"+field+"-"+id).val());
		let newVal = parseInt($(this).val());
		if(isNaN(newVal)) {
			alert("请输入正确的数字")
		}
		else if(newVal < 0) {
			alert("数量不能为负数");
		}
		else if(orgVal != newVal) {
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
						$("#org-"+field+"-"+id).val(newVal);	// org原数量
						$("#ipt-"+field+"-"+id).val(newVal);	// ipt的数量
						$("#span-"+field+"-"+id).text(newVal);	// span的数量

						let orgTotal = parseInt($("#ipt-quantTotal").val());	// 改变总数量
						let newTotal = orgTotal - orgVal + newVal;
						$("#ipt-quantTotal").val(parseFloat(newTotal).toFixed(2))
						$("#span-quantTotal").text(parseFloat(newTotal).toFixed(2))

						$("#span-qntPrtot-"+id).text(parseFloat(data.qntPrTot).toFixed(2));	// 改变 一种商品的总价
						$("#span-dinPrtot-"+id).text(parseFloat(data.dinPrTot).toFixed(2));	// 改变 一种商品的售价

						// 改变报价总价值
						let orgQntPr = parseFloat($("#org-qntPr-"+id).val());
						let orgQntImp = parseFloat($("#ipt-qntPrImp").val());
						let newQntImp = orgQntImp + (newVal-orgVal)*orgQntPr;
						$("#ipt-qntPrImp").val(parseFloat(newQntImp).toFixed(2))
						$("#span-qntPrImp").text(parseFloat(newQntImp).toFixed(2))

						// 改变销售总价值
						let orgDinPr = parseFloat($("#org-dinPr-"+id).val());
						let orgDinImp = parseFloat($("#ipt-dinPrImp").val());
						let newDinImp = orgDinImp + (newVal-orgVal)*orgDinPr;
						$("#ipt-dinPrImp").val(parseFloat(newDinImp).toFixed(2))
						$("#span-dinPrImp").text(parseFloat(newDinImp).toFixed(2))
						// $("#span-qntPrtot-"+id).val(data.qntPr);
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
		$("#form-"+field+"-"+id).hide();
	})

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