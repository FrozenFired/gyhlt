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
		let orgVal = $("#org-"+field+"-"+id).val();
		let newVal = $(this).val();
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