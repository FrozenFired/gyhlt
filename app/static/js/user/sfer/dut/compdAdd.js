$(function() {
	/* ======== 询价单下的商品添加页面的切换 ======*/
	$("#objpdAddPageShow").click((e) => {
		$("#objpdsPage").hide();
		$("#objpdAddPage").show();
	})
	$("#objpdsPageShow").click((e) => {	// 取消添加
		$("#objpdAddPage").hide();
		$("#objpdsPage").show();
	})

	/* ============ 显示 隐藏 商品 table =========== */
	$(".compdTableShow").click(function(e) {
		let dinId = $(this).attr("id").split("-")[1]
		$("#compdTable-"+dinId).toggle();
	})

	/* ============ 全选 反选 取消选择 =========== */
	// 给单选设置值
	$(".compdSel").click(function(e) {
		if($(this).attr("checked")) {
			$(this).removeAttr("checked");
		} else {
			$(this).attr("checked","true");
		}
	})
	// 点击全选按钮
	$(".compdSelAll").click(function(e) {
		let dinId = $(this).attr("id").split("-")[1]
		if($(this).is(':checked')) {
			$(".compdSel-"+dinId).each(function(index,elem) {
				$(this).attr("checked","true");
				$(this).prop("checked", true);
			})
		} else {
			$(".compdSel-"+dinId).each(function(index,elem) {
				$(this).removeAttr("checked");
				$(this).prop("checked", false);
			})
		}
	})
	// 点击反选按钮
	$(".compdReverse").click(function(e) {
		let dinId = $(this).attr("id").split("-")[1]
		$(".compdSel-"+dinId).each(function(index,elem) {
			if($(this).attr("checked")) {
				$(this).removeAttr("checked");
				$(this).prop("checked", false);
			} else {
				$(this).attr("checked","true");
				$(this).prop("checked", true);
			}
		})
	})

})