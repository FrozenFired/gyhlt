$(function() {
	/* ============== 添加Firm中的品类: pdnome ============== */
	$(".pdnomeFormTogg").click(function(e) {
		$(".pdnomeDel").hide();
		$("#pdnomeForm").toggle();
	})
	$("#pdnomeForm").submit(function(e) {
		let pdnome = $("#pdnomeFirmIpt").val();
		if(!pdnome || pdnome.length < 1){
			alert("请输入品类名!")
			e.preventDefault();
		}
	})
	/* ============== 添加Firm中的品类: pdnome ============== */

	/* ============== 删除Firm中的品类: pdnome ============== */
	$(".pdnomeDelTogg").click(function(e) {
		$("#pdnomeForm").hide();
		$(".pdnomeDel").toggle();
	})
	$(".pdnomeDel").click(function(e) {
		let target = $(e.target);
		let id = target.data('id');
		let pdnome = target.data('pdnome');
		let element = $('.pdnomeRow-' + pdnome)
		$.ajax({
			type: "GET",
			url: "/bnPdnomeDelAjax?id="+id+"&pdnome="+pdnome,
			success: function(results) {
				if(results.status === 1) {
					// element.remove();
					window.location.reload();
				} else if(results.status === 0) {
					alert(results.msg);
				}
			}
		});
	})
	/* ============== 删除Firm中的品类: pdnome ============== */
})