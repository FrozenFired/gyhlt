$(function() {
	$(".strmupClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).toggle();
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