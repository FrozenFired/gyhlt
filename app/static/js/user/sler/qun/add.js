$(function() {
	$(".qunAddBtn").click(function(e) {
		$(".qunAddBtn").hide();
		$(".qunAddPage").show();
		$(".qunCancelBtn").show();
	})
	$(".qunCancelBtn").click(function(e) {
		$(".qunCancelBtn").hide();
		$(".qunAddPage").hide();
		$(".qunAddBtn").show();
	})

	$("#qunForm").submit(function(e) {
		let cterNome = $("#cterNomeIpt").val();

		if(!cterNome || cterNome.length < 1) {
			alert("请输入客户名字")
			e.preventDefault();
		}
	})
})