$(function() {
	// $(".inquotUpClick").dblclick(function(e) {
	$(".inquotUpClick").click(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		$("#"+htmlId+"-form").show();
	})
	$(".inquotUpIpt").blur(function(e) {
		let htmlId = $(this).attr("id").split('-')[0]
		let orgVal = $("#"+htmlId+"-org").val();
		let newVal = $(this).val();
		if(newVal.length>0 && orgVal != newVal) {
			let form =$("#"+htmlId+"-form");
			let data = form.serialize();
			let url = form.attr('action');
			$.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(results) {
					if(results.status === 1) {
						$("#"+htmlId+"-span").text(newVal);
						$("#"+htmlId+"-org").val(newVal);
						$("#"+htmlId+"-form").hide();
						$("#"+htmlId+"-span").show();
					} else if(results.status === 0) {
						alert(results.msg)
					}
				}
			});
		} else {
			$("#"+htmlId+"-form").hide();
		}
	})
})