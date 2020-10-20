$(function() {
	$(".qntPrClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})

	// 采购价及平台报价修改
	$(".qntPrBlurup").blur(function(e) {
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
						$("#span-"+field+"-"+id).text(newVal);
						let quant = parseInt($("#quant-"+field+"-"+id).val());
						$("#tot-"+field+"-"+id).text(quant*newVal);
						$("#org-"+field+"-"+id).val(newVal);
						$("#ipt-"+field+"-"+id).val(newVal);
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
		$("#form-"+field+"-"+id).hide();
	})
})