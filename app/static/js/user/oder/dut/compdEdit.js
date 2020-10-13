$(function() {
	/* ================= 把商品从采购单中移除 ====================== */
	$(".delObjpdBtn").click(function(e) {
		let objpdId = $(this).attr("id").split("-")[1]
		$("#delObjpd-"+objpdId).show();
		$(this).hide();
	})

	$(".delObjpdCancel").click(function(e) {
		let objpdId = $(this).attr("id").split("-")[1]
		$("#delObjpd-"+objpdId).hide();
		$("#delObjpdBtn-"+objpdId).show();
	})

	/* ================= 更改采购价格 ====================== */
	$(".clickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})
	$(".blurup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let orgVal = $("#org-"+field+"-"+id).val();
		let newVal = $(this).val();
		if(orgVal != newVal) {
			newVal = parseFloat(newVal);
			if(isNaN(newVal)) {
				alert("您输入的不是小数")
			} else if(newVal < 0) {
				alert("价格不能是负数")
			} else {
				newVal = (newVal).toFixed(2);
			}
			let form =$("#form-"+field+"-"+id);
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#org-"+field+"-"+id).val(newVal);
						$("#ipt-"+field+"-"+id).val(newVal);
						$("#span-"+field+"-"+id).text(newVal);

						let quant = parseInt($("#org-quant-"+id).val());
						$("#span-dutPrTot-"+id).text(quant*newVal);

						let orgQuant = parseFloat($("#org-quant-"+id).val());
						let orgDutImp = parseFloat($("#ipt-dutPrImp").val());
						let newDutImp = orgDutImp + (newVal-orgVal)*orgQuant;
						$("#ipt-dutPrImp").val(newDutImp)
						$("#span-dutPrImp").text(newDutImp)
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
		$("#form-"+field+"-"+id).hide();
	})
})