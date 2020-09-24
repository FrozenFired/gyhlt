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
		let orgVal = parseInt($("#org-"+field+"-"+id).val());
		let newVal = parseInt($(this).val());
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
						$("#span-"+field+"-"+id).text(newVal);
						$("#org-"+field+"-"+id).val(newVal);
						$("#ipt-"+field+"-"+id).val(newVal);
						$("#span-qntPrtot-"+id).text(data.qntPrTot);
						$("#span-qntPrImp").text(data.qntPrImp);
						// $("#span-qntPrtot-"+id).val(data.qntPr);
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		}
		$("#form-"+field+"-"+id).hide();
	})

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
					$("#span-"+field+"-"+id).text(newText);
				} else if(results.status === 0) {
					alert(results.msg)
				}
			}
		});
		$("#form-"+field+"-"+id).hide();
	})
})