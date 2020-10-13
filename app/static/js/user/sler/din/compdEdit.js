$(function() {
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
		let orgVal = parseFloat($("#org-"+field+"-"+id).val());
		let qntPr = parseFloat($("#qntPr-"+field+"-"+id).val());
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
							$("#span-"+field+"-"+id).text(newVal);
							let quant = parseInt($("#quant-"+field+"-"+id).val());
							$("#tot-"+field+"-"+id).text(quant*parseFloat(newVal));
							$("#org-"+field+"-"+id).val(newVal);
							$("#ipt-"+field+"-"+id).val(newVal);
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