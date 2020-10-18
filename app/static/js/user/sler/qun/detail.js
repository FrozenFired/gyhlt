$(function() {

	/* == 判断是否完成了所有产品的报价 == */
	let quotingStatus = false;
	$(".statusInput").each(function(index,elem) {
		status = parseInt($(this).val());
		if(status == Conf.status.quoting.num) {
			quotingStatus = true;
		}
	})
	if(quotingStatus) {
		$(".quotingBtn").hide();
		$(".quotingBtnShow").show();
	} else {
		$(".quotingBtnShow").hide();
		$(".quotingBtn").show();
	}
	$(".quotingBtnShow").click(function(e) {
		alert("必须完善具体工艺面料等细节")
	})

	$(".delObjectBtn").click(function(e) {
		$(".textinfo").hide();
		$(".delObject").show();
	})
	$(".delObjectCancel").click(function(e) {
		$(".delObject").hide();
		$(".textinfo").show();
	})

	// 查看报价按钮
	$(".qntPrTdBtn").click(function(e) {
		$(".qntPrTd").toggle();
	})

	$(".cterNomeClickup").click(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		$("#form-"+field+"-"+id).show();
	})
	$(".cterNomeBlurup").blur(function(e) {
		let strids = $(this).attr("id").split("-")
		let field = strids[1];
		let id = strids[2];
		let orgVal = $("#org-"+field+"-"+id).val();
		let newVal = $(this).val();
		if(newVal.length>0 && orgVal != newVal) {
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
						$("#org-"+field+"-"+id).val(newVal);
						$("#form-"+field+"-"+id).hide();
						$("#span-"+field+"-"+id).show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#form-"+field+"-"+id).hide();
		}
	})
})