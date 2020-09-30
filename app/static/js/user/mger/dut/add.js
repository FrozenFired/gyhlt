$(function() {
	$(".dutAddBtn").click(function(e) {
		$(".dutAddBtn").hide();
		$(".dutAddPage").show();
		$(".dutCancelBtn").show();
	})
	$(".dutCancelBtn").click(function(e) {
		$(".dutCancelBtn").hide();
		$(".dutAddPage").hide();
		$(".dutAddBtn").show();
	})

	$("#dutForm").submit(function(e) {
		let selStrmup = $("#selStrmup").val();
		if(!selStrmup || selStrmup.length < 20) {
			alert("请选择供应商")
			e.preventDefault();
		}
	})
})