$(function() {
	/* == 判断是否完成了所有产品的销售价 == */
	var ifChangeStatus = function() {
		let ifnext = true;
		$(".dinPrIpt").each(function(index,elem) {
			dinPr = $(this).val();
			if(!isFloat(dinPr)) {
				ifnext = false;
			}
		})
		if(ifnext) {
			$(".statusChange").show();
		} else {
			$(".statusChange").hide();
		}
	}
	ifChangeStatus();

	// 删除订单操作按钮
	$(".delObjectBtn").click(function(e) {
		$(".delObjectBtn").hide();
		$(".delObject").show();
	})
	$(".delObjectCancel").click(function(e) {
		$(".delObject").hide();
		$(".delObjectBtn").show();
	})

	// 查看报价按钮
	$(".qntPrTdBtn").click(function(e) {
		$(".qntPrTd").toggle();
	})
})