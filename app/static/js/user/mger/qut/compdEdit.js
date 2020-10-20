$(function() {
	$(".clickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
	})

	// 采购价及平台报价修改
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

	// 供应商修改
	$(".selectup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).hide();
	})
	$(".selectup").change(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let newVal = $(this).val();
		let newText = $(this).find("option:selected").text();
		// $("#select1 option:selected").text()
		let form =$("#form-"+field+"-"+id);
		let data = form.serialize();
		let url = form.attr('action');
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(results) {
				if(results.status === 1) {
					let compd = results.data.compd;
					$("#span-"+field+"-"+id).text(newText);
					$("#span-dutPr-"+id).text(compd.dutPr);
					$("#org-dutPr-"+id).val(compd.dutPr);
					$("#ipt-dutPr-"+id).val(compd.dutPr);

					$("#span-qntPr-"+id).text(compd.qntPr);
					$("#org-qntPr-"+id).val(compd.qntPr);
					$("#ipt-qntPr-"+id).val(compd.qntPr);
					$("#tot-qntPr-"+id).text(compd.qntPr * compd.quant);
				} else if(results.status === 0) {
					alert(results.msg)
				}
			}
		});
		$("#form-"+field+"-"+id).hide();
	})
})