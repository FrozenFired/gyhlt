$(function() {
	$(".datepicker").datepicker();

	// 删除运输单操作按钮
	$(".delObjectBtn").click(function(e) {
		$(".delObjectBtn").hide();
		$(".delObject").show();
	})
	$(".delObjectCancel").click(function(e) {
		$(".delObject").hide();
		$(".delObjectBtn").show();
	})

	// 点击单独改变数据库值
	$(".objUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		$("#form-"+htmlId).toggle();
	})
	// 更改集装箱编号
	$("#ipt-nome").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		let now = $(this).val();
		let org = $("#org-"+htmlId).val();
		if(now != org) {
			let form =$("#form-"+htmlId);
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						let tran = results.data.tran;
						$("#span-"+htmlId).text(now);
						$("#org-"+htmlId).val(now);
						$("#form-"+htmlId).hide();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#form-"+htmlId).hide();
		}
	})
	// 更改船期
	$("#ipt-trpDay").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		let now = parseInt($(this).val());
		let org = parseInt($("#org-"+htmlId).val());
		if(!isNaN(now) && now != org) {
			let form =$("#form-"+htmlId);
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						let tran = results.data.tran;
						$("#span-"+htmlId).text(now);
						$("#org-"+htmlId).val(now);
						let arrivAt = transformTime(tran.arrivAt, 0, 10)
						$("#span-arrivAt").text(arrivAt)
						$("#form-"+htmlId).hide();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#form-"+htmlId).hide();
		}
	})
	// 更改开船日期
	$("#ipt-trpAt").change(function(e) {
		let htmlId = $(this).attr("id").split('-')[1]
		let form =$("#form-"+htmlId);
		let data = form.serialize();
		let url = form.attr('action');
		let now = $(this).val();
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			success: function(results) {
				if(results.status === 1) {
					let tran = results.data.tran;
					let trpAt = transformTime(tran.trpAt, 0, 10)
					$("#span-"+htmlId).text(trpAt)
					let arrivAt = transformTime(tran.arrivAt, 0, 10)
					$("#span-arrivAt").text(arrivAt)
					$("#ipt-"+htmlId).val("")
					$("#form-"+htmlId).hide();
				} else if(results.status === 0) {
					alert(results.msg)
				}
			}
		});
	})
})