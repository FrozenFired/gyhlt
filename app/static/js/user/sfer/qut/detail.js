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
		$(".quotingSpan").show();
	} else {
		$(".quotingSpan").hide();
		$(".quotingBtn").show();
	}

	$(".inquotUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		$("#"+htmlId+"-form").show();
		$(this).hide();
	})
	$(".inquotUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let org = $("#"+htmlId+"-org").val();
		let now = $(this).val();
		if(org != now) {
			let form =$("#"+htmlId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-span").text("备注: " + now);
						$("#"+htmlId+"-org").val(now);
						$("#"+htmlId+"-form").hide();
						$("#"+htmlId+"-span").show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-form").hide();
			$("#"+htmlId+"-span").show();
		}
	})

	$(".ordinUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		$("#"+htmlId+"-form").show();
		$(this).hide();
	})
	$(".ordinUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let org = $("#"+htmlId+"-org").val();
		let now = $(this).val();
		if(org != now) {
			let form =$("#"+htmlId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-span").text("备注: " + now);
						$("#"+htmlId+"-org").val(now);
						$("#"+htmlId+"-form").hide();
						$("#"+htmlId+"-span").show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-form").hide();
			$("#"+htmlId+"-span").show();
		}
	})
})