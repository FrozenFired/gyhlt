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
		let selStrmup = $("#selStrmup").val();
		if(!selStrmup || selStrmup.length < 20) {
			alert("请选择供应商")
			e.preventDefault();
		}
	})
})