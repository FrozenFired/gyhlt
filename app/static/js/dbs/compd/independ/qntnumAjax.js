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
})