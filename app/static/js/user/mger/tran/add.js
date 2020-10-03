$(function() {
	$(".objAddBtn").click(function(e) {
		$(".objAddBtn").hide();
		$(".objAddPage").show();
		$(".objCancelBtn").show();
	})
	$(".objCancelBtn").click(function(e) {
		$(".objCancelBtn").hide();
		$(".objAddPage").hide();
		$(".objAddBtn").show();
	})

	$("#objForm").submit(function(e) {
		let selStrmlg = $("#selStrmlg").val();
		if(!selStrmlg || selStrmlg.length < 20) {
			alert("请选择物流公司")
			e.preventDefault();
		}
	})
})